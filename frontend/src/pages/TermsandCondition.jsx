import { useState, useEffect, useRef, useCallback } from 'react';
import { useSEO } from '../hooks/useSEO';
import {
  ShieldCheck,
  CalendarX,
  RefreshCcw,
  PackageCheck,
  PackageX,
  CloudLightning,
  UserX,
  Route,
  AlertTriangle,
  ScrollText,
  Compass,
} from 'lucide-react';

// ─── Palette: pine #16342A · parchment #F3ECDC · rust #BF5B3D · gold #C9A227 ──

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&display=swap');
    .mtk-serif { font-family: 'Fraunces', Georgia, serif; }
    .mtk-sans  { font-family: 'Public Sans', system-ui, sans-serif; }

    .mtk-scrollbar-none::-webkit-scrollbar { display: none; }
    .mtk-scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

const SECTIONS = [
  {
    id: 'booking',
    icon: ShieldCheck,
    title: 'Booking & Confirmation',
    body: (
      <>
        <p>
          Once you choose a trek and complete the booking form, we'll send a confirmation email
          with your trek details, itinerary, and payment summary.
        </p>
        <p>
          To lock in your spot, a non-refundable booking deposit of{' '}
          <strong className="text-[#16342A]">₹[amount]</strong> is required, which is adjusted against your total trek cost.
          The remaining balance is payable as per the schedule mentioned in your confirmation
          email.
        </p>
      </>
    ),
  },
  {
    id: 'cancellation',
    icon: CalendarX,
    title: 'Cancellation by the Traveler',
    body: (
      <>
        <p>If you need to cancel a confirmed booking, refunds follow this schedule:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            More than <strong className="text-[#16342A]">30 days</strong> before the trek start date — <strong className="text-[#16342A]">70%</strong>{' '}
            refund of the total amount (excluding the booking deposit)
          </li>
          <li>
            Between <strong className="text-[#16342A]">15–30 days</strong> before the trek start date —{' '}
            <strong className="text-[#16342A]">50%</strong> refund (excluding the booking deposit)
          </li>
          <li>
            Less than <strong className="text-[#16342A]">15 days</strong> before the trek start date — no refund is
            available
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'rescheduling',
    icon: RefreshCcw,
    title: 'Rescheduling Your Trek',
    body: (
      <p>
        Need to change your dates instead of cancelling? You can reschedule up to{' '}
        <strong className="text-[#16342A]">20 days</strong> before the trek start date, provided the new date falls
        within the same trekking season. Rescheduling requests closer to the start date are
        handled case-by-case and are not guaranteed.
      </p>
    ),
  },
  {
    id: 'included',
    icon: PackageCheck,
    title: "What's Included",
    body: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Transportation as specified in your itinerary (pickup/drop points as agreed)</li>
        <li>Accommodation on a shared basis (homestay or hotel, depending on the trek)</li>
        <li>Meals as listed in your specific trek's itinerary</li>
        <li>An experienced guide/team leader assigned according to group size</li>
      </ul>
    ),
  },
  {
    id: 'excluded',
    icon: PackageX,
    title: "What's Not Included",
    body: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Meals taken during transit or outside the listed itinerary</li>
        <li>Personal camera/drone fees where applicable at trek locations</li>
        <li>Personal medical kit, backpack offloading charges, and porters (unless booked)</li>
        <li>Emergency evacuation costs</li>
        <li>Forest entry fees or permits not explicitly mentioned as included</li>
        <li>Any other personal expenses not listed above</li>
      </ul>
    ),
  },
  {
    id: 'company-changes',
    icon: CloudLightning,
    title: 'Cancellations or Changes by SkieHikes',
    body: (
      <p>
        In rare situations beyond our control — severe weather, road closures, local
        disturbances, or government restrictions — a trek may need to be postponed, altered,
        or cancelled. In such cases, we'll offer an alternative batch or date wherever
        possible. Where a full trek cancellation on our part is unavoidable, we will discuss
        fair options with affected trekkers.
      </p>
    ),
  },
  {
    id: 'no-show',
    icon: UserX,
    title: 'No-Show Policy',
    body: (
      <p>
        If a trekker doesn't show up on the scheduled date/time without informing us in
        advance, no refund will be issued for that booking.
      </p>
    ),
  },
  {
    id: 'itinerary-changes',
    icon: Route,
    title: 'Itinerary Changes During the Trek',
    body: (
      <p>
        Trek schedules may be adjusted on the ground due to weather, trail conditions, or
        decisions made by your trek leader in the interest of group safety. These operational
        adjustments do not entitle trekkers to a refund or compensation.
      </p>
    ),
  },
  {
    id: 'guidelines',
    icon: ScrollText,
    title: 'Tour Guidelines',
    body: (
      <>
        <p className="font-semibold text-[#16342A]">Please do:</p>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li>Follow instructions from your trek leader or SkieHikes staff at all times</li>
          <li>Be on time for departures, meals, and scheduled activities</li>
          <li>Keep your personal belongings and documents secure</li>
          <li>Respect local communities, customs, and religious sites along the trail</li>
          <li>Inform your trek leader immediately of any health issue or emergency</li>
        </ul>
        <p className="font-semibold text-[#16342A]">Please don't:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Misbehave with staff, guides, drivers, or fellow trekkers</li>
          <li>Consume alcohol or other intoxicants in a way that disrupts the group</li>
          <li>Damage property belonging to hosts, vehicles, or the trek location</li>
          <li>Leave the group or go off-trail without informing your trek leader</li>
        </ul>
      </>
    ),
  },
  {
    id: 'liability',
    icon: AlertTriangle,
    title: 'Liability & Disclaimer',
    body: (
      <>
        <p>
          Trekking involves inherent risk. SkieHikes is not liable for
          personal injury, illness, loss, delay, or damage arising from circumstances outside
          our reasonable control. Trekkers are responsible for their own belongings throughout
          the trip — we are not responsible for items lost or misplaced during the trek.
        </p>
        <p>
          The right of admission and removal from a trek in cases of misconduct rests with
          SkieHikes, and such decisions are final. Any disputes will be subject
          to the jurisdiction of the courts in <strong className="text-[#16342A]"> Uttarakhand</strong>.
        </p>
      </>
    ),
  },
];

const TermsAndConditions = () => {
  useSEO({
    title: 'Terms & Conditions | SkieHIkes',
    description: 'Terms and conditions for booking treks and tours with SkieHIkes.',
    path: '/terms',
  });

  const [active, setActive] = useState(SECTIONS[0].id);
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-140px 0px -60% 0px', threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = sectionRefs.current[s.id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const jumpTo = useCallback((id) => {
    const el = sectionRefs.current[id];
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  const registerRef = (id) => (el) => { sectionRefs.current[id] = el; };

  return (
    <div className="min-h-screen bg-[#FBF7EC] mtk-sans">
      <GlobalStyle />

      {/* Header */}
      <div className="bg-[#16342A] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-[#C9A227] text-sm mb-3">
            <Compass size={15} /> Please read carefully
          </div>
          <h1 className="mtk-serif text-4xl sm:text-5xl text-[#F3ECDC] mb-3">Terms &amp; conditions</h1>
          <p className="text-[#F3ECDC]/60 max-w-xl mx-auto text-sm">
            These terms apply to every booking made with SkieHikes. By confirming
            a trek with us, you agree to the policies below.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">

          {/* Sticky table of contents — replaces the click-to-expand accordion */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-[#16342A]/45 uppercase tracking-wide mb-3">On this page</p>
              <nav className="space-y-1 mtk-scrollbar-none max-h-[70vh] overflow-y-auto pr-2">
                {SECTIONS.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => jumpTo(s.id)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-sm transition-colors flex items-start gap-2 ${
                      active === s.id
                        ? 'bg-[#16342A] text-[#F3ECDC] font-medium'
                        : 'text-[#16342A]/55 hover:bg-[#16342A]/[0.05]'
                    }`}
                  >
                    <span className={active === s.id ? 'text-[#C9A227]' : 'text-[#16342A]/30'}>{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Continuous numbered sections — no expand/collapse, just read or jump */}
          <div className="space-y-14">
            {SECTIONS.map((s, i) => {
              const Icon = s.icon;
              return (
                <section key={s.id} id={s.id} ref={registerRef(s.id)} className="scroll-mt-28">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="mtk-serif text-[#C9A227] text-sm">{String(i + 1).padStart(2, '0')}</span>
                    <span className="w-8 h-8 rounded-full bg-[#16342A] flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-[#C9A227]" />
                    </span>
                    <h2 className="mtk-serif text-xl text-[#16342A]">{s.title}</h2>
                  </div>
                  <div className="text-sm text-[#16342A]/65 leading-relaxed space-y-2 pl-11">
                    {s.body}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;