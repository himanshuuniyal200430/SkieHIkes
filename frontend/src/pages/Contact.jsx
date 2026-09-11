import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Compass } from 'lucide-react';
import API from '../api/axios';
import { useSEO } from '../hooks/useSEO';

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&display=swap');
    .mtk-serif { font-family: 'Fraunces', Georgia, serif; }
    .mtk-sans  { font-family: 'Public Sans', system-ui, sans-serif; }

    @keyframes mtk-fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .mtk-fade-up { animation: mtk-fade-up 0.4s ease both; }

    @keyframes mtk-pop { 0% { opacity: 0; transform: scale(0.7); } 60% { opacity: 1; transform: scale(1.08); } 100% { transform: scale(1); } }
    .mtk-pop { animation: mtk-pop 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }

    @keyframes mtk-shake { 10%, 90% { transform: translateX(-1px); } 20%, 80% { transform: translateX(2px); } 30%, 50%, 70% { transform: translateX(-3px); } 40%, 60% { transform: translateX(3px); } }
    .mtk-shake { animation: mtk-shake 0.4s ease; }
  `}</style>
);

const contactInfo = [
  {
    icon: Phone,
    label: 'Call us',
    value: '+91 912345308',
    sub: 'Mon - Sat, 9am - 7pm',
  },
  {
    icon: Mail,
    label: 'Email us',
    value: 'trekskies01@gmail.com',
    sub: 'We reply within 24 hours',
  },
  {
    icon: MapPin,
    label: 'Visit us',
    value: 'Uttrakhand, India',
    sub: 'Uttarakhand, India - 248001',
  },
  {
    icon: Clock,
    label: 'Office hours',
    value: '9:00 AM - 7:00 PM',
    sub: 'Monday to Saturday',
  },
];

const initialForm = { name: '', email: '', phone: '', subject: '', message: '' };

const Contact = () => {
  useSEO({
    title: 'Contact Us | Tresk Skies',
    description: 'Get in touch with Tresk Skies for trek and tour enquiries. Based in Dehradun, Uttarakhand.',
    path: '/contact',
  });

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    setSubmitting(true);
    try {
      await API.post('/contact', form);
      setSubmitted(true);
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7EC] mtk-sans">
      <GlobalStyle />

      {/* Header */}
      <div className="bg-[#16342A] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-[#C9A227] text-sm mb-3">
            <Compass size={15} /> Get in touch
          </div>
          <h1 className="mtk-serif text-4xl sm:text-5xl text-[#F3ECDC] mb-3">Contact us</h1>
          <p className="text-[#F3ECDC]/60 max-w-xl mx-auto text-sm">
            Have a question about a trek, a booking, or just want to say hi? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left rail — contact info, replaces the old bottom card grid + map */}
          <div className="lg:col-span-2">
            <h2 className="mtk-serif text-2xl text-[#16342A] mb-2">Let's talk trails</h2>
            <p className="text-[#16342A]/55 text-sm mb-8 leading-relaxed">
              Reach us directly, or send a message and our team will get back to you within a day.
            </p>

            <div className="space-y-1">
              {contactInfo.map(({ icon: Icon, label, value, sub }, i) => (
                <div
                  key={label}
                  className={`mtk-fade-up flex items-start gap-4 py-4 ${
                    i < contactInfo.length - 1 ? 'border-b border-[#16342A]/10' : ''
                  }`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="w-10 h-10 rounded-full bg-[#16342A] flex items-center justify-center shrink-0">
                    <Icon size={17} className="text-[#C9A227]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#16342A]/45 font-semibold mb-0.5">
                      {label}
                    </p>
                    <p className="text-sm font-medium text-[#16342A]">{value}</p>
                    <p className="text-xs text-[#16342A]/45 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className={`lg:col-span-3 bg-white border border-[#16342A]/10 p-6 sm:p-8 ${shake ? 'mtk-shake' : ''}`}>
            {submitted ? (
              <div className="text-center py-16">
                <CheckCircle2 size={56} className="mtk-pop mx-auto mb-4 text-[#3F6B4F]" />
                <h3 className="mtk-serif text-lg text-[#16342A] mb-2">Message sent</h3>
                <p className="text-[#16342A]/55 text-sm mb-6">
                  Thanks for reaching out. Our team will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm font-medium text-[#BF5B3D] underline underline-offset-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="mtk-serif text-xl text-[#16342A] mb-1">Send us a message</h2>
                <p className="text-sm text-[#16342A]/50 mb-6">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>

                {error && (
                  <div className="mb-5 text-sm text-[#BF5B3D] bg-[#BF5B3D]/5 border border-[#BF5B3D]/20 px-4 py-3">
                    {error}
                  </div>
                )}

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#16342A]/60 mb-1.5">
                        Full name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full px-4 py-2.5 rounded-sm border text-sm outline-none focus:border-[#BF5B3D] text-[#16342A] placeholder:text-[#16342A]/35 transition-colors ${
                          errors.name ? 'border-[#BF5B3D]' : 'border-[#16342A]/15'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-[#BF5B3D] mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#16342A]/60 mb-1.5">
                        Phone (optional)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-sm border border-[#16342A]/15 text-sm outline-none focus:border-[#BF5B3D] text-[#16342A] placeholder:text-[#16342A]/35 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#16342A]/60 mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`w-full px-4 py-2.5 rounded-sm border text-sm outline-none focus:border-[#BF5B3D] text-[#16342A] placeholder:text-[#16342A]/35 transition-colors ${
                        errors.email ? 'border-[#BF5B3D]' : 'border-[#16342A]/15'
                      }`}
                    />
                    {errors.email && <p className="text-xs text-[#BF5B3D] mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#16342A]/60 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Booking inquiry, general question..."
                      className={`w-full px-4 py-2.5 rounded-sm border text-sm outline-none focus:border-[#BF5B3D] text-[#16342A] placeholder:text-[#16342A]/35 transition-colors ${
                        errors.subject ? 'border-[#BF5B3D]' : 'border-[#16342A]/15'
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-xs text-[#BF5B3D] mt-1">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#16342A]/60 mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us more about what you need..."
                      className={`w-full px-4 py-2.5 rounded-sm border text-sm resize-none outline-none focus:border-[#BF5B3D] text-[#16342A] placeholder:text-[#16342A]/35 transition-colors ${
                        errors.message ? 'border-[#BF5B3D]' : 'border-[#16342A]/15'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs text-[#BF5B3D] mt-1">{errors.message}</p>
                    )}
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#16342A] text-[#F3ECDC] font-semibold text-sm px-8 py-3 rounded-sm hover:bg-[#BF5B3D] transition-colors disabled:opacity-60"
                  >
                    {submitting ? 'Sending…' : 'Send message'}
                    <Send size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;