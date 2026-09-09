// Sends booking status emails using the Gmail API (HTTPS), so emails appear
// as sent from your real Gmail account (e.g. matrikatoursandtravels3@gmail.com)
// instead of a generic "noreply@" address.
//
// We deliberately do NOT use Nodemailer's Gmail/SMTP transport here — even
// with OAuth2, Nodemailer's Gmail transport still connects over raw SMTP
// sockets (smtp.gmail.com:465), which are blocked on Render (see the old
// comment in the previous version of this file). The Gmail REST API sends
// mail via a normal HTTPS POST request instead, so it works the same as any
// other API call your server makes — no blocked ports involved.

const GMAIL_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GMAIL_SEND_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const formatPrice = (price) =>
  price ? `${price.currency === 'INR' ? '₹' : price.currency + ' '}${price.amount?.toLocaleString('en-IN')}` : '';

// price.amount on a Package is PER PERSON — multiply by groupSize for the actual total charge
const calculateTotalPrice = (price, groupSize) => {
  if (!price?.amount || !groupSize) return null;
  return { amount: price.amount * groupSize, currency: price.currency };
};

const approvedTemplate = (booking) => ({
  subject: `Booking Confirmed — ${booking.package?.title || 'Your Trek'} (${booking.bookingId})`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
      <div style="background: #0a1628; padding: 28px 24px; text-align: center;">
        <h1 style="color: #fbbf24; margin: 0; font-size: 20px;">Matrika</h1>
      </div>
      <div style="padding: 28px 24px;">
        <h2 style="color: #0a1628; margin-top: 0;">Your booking is confirmed! 🎉</h2>
        <p>Hi ${booking.contactPerson?.name || 'there'},</p>
        <p>Great news — your booking for <strong>${booking.package?.title || 'your trek'}</strong> has been confirmed.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Booking ID</td><td style="padding: 8px 0; font-weight: 600;">${booking.bookingId}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Trek Date</td><td style="padding: 8px 0; font-weight: 600;">${formatDate(booking.trekDate)}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Group Size</td><td style="padding: 8px 0; font-weight: 600;">${booking.groupSize}</td></tr>
        </table>
        ${booking.adminNotes ? `<p style="background: #f9fafb; padding: 12px 16px; border-radius: 8px; font-size: 14px;"><strong>Note from our team:</strong> ${booking.adminNotes}</p>` : ''}
        <p>We're excited to have you on this trek. If you have any questions, just reply to this email.</p>
         <p><strong> Contact : +91 9027378308</strong></p>
        <p><strong> Mail : matrikatoursandtravels3@gmail.com</strong></p>
      </div>
    </div>
  `,
});

const cancelledTemplate = (booking) => ({
  subject: `Booking Update — ${booking.package?.title || 'Your Trek'} (${booking.bookingId})`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
      <div style="background: #0a1628; padding: 28px 24px; text-align: center;">
        <h1 style="color: #fbbf24; margin: 0; font-size: 20px;">Matrika</h1>
      </div>
      <div style="padding: 28px 24px;">
        <h2 style="color: #0a1628; margin-top: 0;">Booking Update</h2>
        <p>Hi ${booking.contactPerson?.name || 'there'},</p>
        <p>We're writing to let you know that your booking for <strong>${booking.package?.title || 'your trek'}</strong> (${booking.bookingId}) has been cancelled.</p>
        ${booking.cancelReason ? `<p style="background: #fef2f2; padding: 12px 16px; border-radius: 8px; font-size: 14px; color: #b91c1c;"><strong>Reason:</strong> ${booking.cancelReason}</p>` : ''}
        <p>If you believe this is a mistake or have any questions, please reply to this email and we'll sort it out.</p>
        <p style="margin-top: 28px; color: #6b7280; font-size: 13px;">— The Matrika Team</p>
        <p><strong> Contact : +91 9027378308</strong></p>
        <p><strong> Mail : matrikatoursandtravels3@gmail.com</strong></p>
      </div>
    </div>
  `,
});

const completedTemplate = (booking) => ({
  subject: `Thank You for Trekking With Us! (${booking.bookingId})`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
      <div style="background: #0a1628; padding: 28px 24px; text-align: center;">
        <h1 style="color: #fbbf24; margin: 0; font-size: 20px;">Matrika </h1>
      </div>
      <div style="padding: 28px 24px;">
        <h2 style="color: #0a1628; margin-top: 0;">Hope you had an amazing trek! 🏔️</h2>
        <p>Hi ${booking.contactPerson?.name || 'there'},</p>
        <p>Your trek — <strong>${booking.package?.title || 'this journey'}</strong> (${booking.bookingId}) — is now marked complete. Thank you for choosing Matrika !</p>
        <p>We'd love to hear about your experience. Feel free to reply with any feedback.</p>
        <p style="margin-top: 28px; color: #6b7280; font-size: 13px;">— The Matrika Team</p>
        <p><strong> Contact : +91 9027378308</strong></p>
        <p><strong> Mail : matrikatoursandtravels3@gmail.com</strong></p>
      </div>
    </div>
  `,
});

const templates = {
  Approved: approvedTemplate,
  Cancelled: cancelledTemplate,
  Completed: completedTemplate,
};

// Email sent to the OWNER/ADMIN whenever a new booking comes in.
const newBookingAdminTemplate = (booking) => {
  const total = calculateTotalPrice(booking.package?.price, booking.groupSize);
  return {
    subject: `New Booking Received — ${booking.package?.title || 'Trek'} (${booking.bookingId})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
        <div style="background: #0a1628; padding: 28px 24px; text-align: center;">
          <h1 style="color: #fbbf24; margin: 0; font-size: 20px;">New Booking Alert</h1>
        </div>
        <div style="padding: 28px 24px;">
          <p>A new booking has just come in for <strong>${booking.package?.title || 'a trek'}</strong>.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <tr><td style="padding: 8px 0; color: #6b7280;">Booking ID</td><td style="padding: 8px 0; font-weight: 600;">${booking.bookingId}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Trek</td><td style="padding: 8px 0; font-weight: 600;">${booking.package?.title || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Trek Date</td><td style="padding: 8px 0; font-weight: 600;">${formatDate(booking.trekDate)}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Group Size</td><td style="padding: 8px 0; font-weight: 600;">${booking.groupSize}</td></tr>
            ${total ? `<tr><td style="padding: 8px 0; color: #6b7280;">Total Amount</td><td style="padding: 8px 0; font-weight: 600;">${formatPrice(total)}</td></tr>` : ''}
          </table>
          <h3 style="color: #0a1628; margin-bottom: 8px;">Contact Person</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #6b7280;">Name</td><td style="padding: 6px 0; font-weight: 600;">${booking.contactPerson?.name || '—'}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Phone</td><td style="padding: 6px 0; font-weight: 600;">${booking.contactPerson?.phone || '—'}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0; font-weight: 600;">${booking.contactPerson?.email || '—'}</td></tr>
          </table>
          ${booking.specialRequests ? `<p style="background: #f9fafb; padding: 12px 16px; border-radius: 8px; font-size: 14px;"><strong>Special Requests:</strong> ${booking.specialRequests}</p>` : ''}
          <p style="margin-top: 24px;">Log in to the admin panel to review and approve this booking.</p>
        </div>
      </div>
    `,
  };
};

// Exchanges the long-lived refresh token for a short-lived access token.
// This happens on every send — access tokens expire in ~1 hour, so we don't
// bother caching it; one extra HTTPS call per email is negligible.
const getAccessToken = async () => {
  const response = await fetch(GMAIL_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GMAIL_CLIENT_ID,
      client_secret: process.env.GMAIL_CLIENT_SECRET,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to refresh Gmail access token (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return data.access_token;
};

// Base64url-encodes a string (Gmail API requires base64url, not plain base64).
const base64UrlEncode = (str) =>
  Buffer.from(str, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

// Builds a raw RFC 2822 MIME email message that the Gmail API expects.
const buildRawMessage = ({ from, to, subject, html }) => {
  // Encode the subject so non-ASCII characters (e.g. ₹, emoji) survive.
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`;

  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: 7bit',
    '',
    html,
  ].join('\r\n');

  return base64UrlEncode(message);
};

// Sends a status-update email for a booking. Deliberately swallows all errors —
// a failed email must never block or fail the booking status update itself.
export const sendBookingStatusEmail = async (booking) => {
  try {
    const buildTemplate = templates[booking.status];
    if (!buildTemplate) return; // e.g. 'Pending' has no email

    const to = booking.contactPerson?.email;
    if (!to) {
      console.warn(`No contact email on booking ${booking.bookingId}, skipping email`);
      return;
    }

    const { subject, html } = buildTemplate(booking);

    const accessToken = await getAccessToken();

    const raw = buildRawMessage({
      from: process.env.EMAIL_FROM, // e.g. "Matrika Treks <matrikatoursandtravels3@gmail.com>"
      to,
      subject,
      html,
    });

    const response = await fetch(GMAIL_SEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gmail API error (${response.status}): ${errorBody}`);
    }

    console.log(`Status email sent for booking ${booking.bookingId} (${booking.status})`);
  } catch (err) {
    console.error(`Failed to send status email for booking ${booking.bookingId}:`, err.message);
  }
};

// Sends a "new booking" alert to the owner/admin inbox. Deliberately swallows
// all errors — a failed email must never block or fail booking creation itself.
export const sendNewBookingAlert = async (booking) => {
  try {
    // The address that receives owner notifications. Falls back to EMAIL_FROM's
    // raw email if ADMIN_EMAIL isn't set (e.g. EMAIL_FROM = '"Matrika" <a@b.com>').
    const to =
      process.env.ADMIN_EMAIL ||
      (process.env.EMAIL_FROM || '').match(/[\w.+-]+@[\w-]+\.[\w.-]+/)?.[0];

    if (!to) {
      console.warn('No ADMIN_EMAIL or parseable EMAIL_FROM set, skipping new-booking alert');
      return;
    }

    const { subject, html } = newBookingAdminTemplate(booking);

    const accessToken = await getAccessToken();

    const raw = buildRawMessage({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    const response = await fetch(GMAIL_SEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gmail API error (${response.status}): ${errorBody}`);
    }

    console.log(`New-booking alert sent for booking ${booking.bookingId}`);
  } catch (err) {
    console.error(`Failed to send new-booking alert for booking ${booking.bookingId}:`, err.message);
  }
};
