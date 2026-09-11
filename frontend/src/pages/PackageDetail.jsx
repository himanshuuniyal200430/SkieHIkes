import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, CheckCircle, XCircle,
  Mountain, Calendar, Star, Phone, Mail, ChevronDown, ChevronUp,
  ArrowLeft, RefreshCw, Compass, ChevronLeft, ChevronRight,
} from 'lucide-react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { useSEO } from '../hooks/useSEO';

// ─── Palette: pine #16342A · parchment #F3ECDC · rust #BF5B3D · gold #C9A227 ──

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&display=swap');
    .mtk-serif { font-family: 'Fraunces', Georgia, serif; }
    .mtk-sans  { font-family: 'Public Sans', system-ui, sans-serif; }

    @keyframes mtk-fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .mtk-fade-up { animation: mtk-fade-up 0.5s ease both; }

    @keyframes mtk-spin { to { transform: rotate(360deg); } }
    .mtk-spin { animation: mtk-spin 1.4s linear infinite; }

    .mtk-scrollbar-none::-webkit-scrollbar { display: none; }
    .mtk-scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

const difficultyColor = (level) => {
  switch (level) {
    case 'Easy': return { bg: '#3F6B4F1a', text: '#3F6B4F' };
    case 'Moderate': return { bg: '#C9A2271a', text: '#8a6f1a' };
    case 'Difficult': return { bg: '#BF5B3D1a', text: '#BF5B3D' };
    default: return { bg: '#7A2E2E1a', text: '#7A2E2E' };
  }
};

// ─── Hero: full-bleed crossfading banner with overlaid title/meta ──
const Hero = ({ pkg }) => {
  const [active, setActive] = useState(0);
  const images = pkg.images || [];
  const diffColor = difficultyColor(pkg.difficulty);

  return (
    <div className="relative h-[62vh] min-h-[420px] bg-[#16342A] overflow-hidden">
      {images.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active].url}
            alt={pkg.title}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Mountain size={64} className="text-[#F3ECDC]/20" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#16342A] via-[#16342A]/40 to-[#16342A]/10" />

      {images.length > 1 && (
        <>
          <button
            onClick={() => setActive((i) => (i - 1 + images.length) % images.length)}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full border border-[#F3ECDC]/30 text-[#F3ECDC] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setActive((i) => (i + 1) % images.length)}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full border border-[#F3ECDC]/30 text-[#F3ECDC] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute top-5 right-5 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${i === active ? 'w-6 bg-[#C9A227]' : 'w-1.5 bg-[#F3ECDC]/40'}`}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs bg-[#F3ECDC]/10 backdrop-blur-sm text-[#F3ECDC] font-semibold px-3 py-1">{pkg.category}</span>
          <span className="text-xs font-semibold px-3 py-1" style={{ backgroundColor: diffColor.bg, color: diffColor.text }}>
            {pkg.difficulty}
          </span>
          {pkg.isFeatured && (
            <span className="text-xs bg-[#BF5B3D] text-[#F3ECDC] font-semibold px-3 py-1 flex items-center gap-1">
              <Star size={10} className="fill-[#F3ECDC]" /> Featured
            </span>
          )}
        </div>
        <h1 className="mtk-serif text-3xl sm:text-5xl text-[#F3ECDC] mb-3 max-w-2xl leading-tight">{pkg.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#F3ECDC]/75 mtk-sans">
          <span className="flex items-center gap-1"><MapPin size={14} className="text-[#C9A227]" />{pkg.location?.region}, {pkg.location?.state}</span>
          <span className="flex items-center gap-1"><Clock size={14} className="text-[#C9A227]" />{pkg.duration?.days} Days / {pkg.duration?.nights} Nights</span>
        </div>
      </div>
    </div>
  );
};

// ─── Sticky in-page section nav with scrollspy ──────────────────────
const SECTION_LIST = [
  { id: 'overview', label: 'Overview' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'inclusions', label: 'Inclusions' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'season', label: 'Season & tags' },
];

const SectionNav = ({ present, active, onJump }) => {
  const items = SECTION_LIST.filter((s) => present.includes(s.id));
  if (items.length === 0) return null;

  return (
    <div className="sticky top-16 z-30 bg-[#FBF7EC]/95 backdrop-blur-sm border-b border-[#16342A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 overflow-x-auto mtk-scrollbar-none mtk-sans">
          {items.map((s) => (
            <button
              key={s.id}
              onClick={() => onJump(s.id)}
              className={`relative shrink-0 py-3.5 text-sm font-medium transition-colors ${
                active === s.id ? 'text-[#16342A]' : 'text-[#16342A]/45 hover:text-[#16342A]/70'
              }`}
            >
              {s.label}
              {active === s.id && (
                <motion.span layoutId="section-underline" className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#BF5B3D]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Multi-step booking form ────────────────────────────────────────
const stepVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

const BookingForm = ({ pkg }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [form, setForm] = useState({
    contactPerson: { name: '', email: '', phone: '', city: '' },
    travelers: [{ name: '', age: '', gender: 'Female' }],
    groupSize: 1,
    trekDate: '',
    specialRequests: '',
    emergencyContact: { name: '', phone: '', relation: '' },
  });

  const updateContact = (field, value) => setForm((prev) => ({ ...prev, contactPerson: { ...prev.contactPerson, [field]: value } }));
  const updateEmergency = (field, value) => setForm((prev) => ({ ...prev, emergencyContact: { ...prev.emergencyContact, [field]: value } }));
  const updateTraveler = (index, field, value) => {
    const updated = [...form.travelers];
    updated[index] = { ...updated[index], [field]: value };
    setForm((prev) => ({ ...prev, travelers: updated }));
  };
  const addTraveler = () => {
    if (form.travelers.length < (pkg.groupSize?.max || 20)) {
      setForm((prev) => ({ ...prev, travelers: [...prev.travelers, { name: '', age: '', gender: 'Female' }], groupSize: prev.groupSize + 1 }));
    }
  };
  const removeTraveler = (index) => {
    if (form.travelers.length > 1) {
      const updated = form.travelers.filter((_, i) => i !== index);
      setForm((prev) => ({ ...prev, travelers: updated, groupSize: updated.length }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await API.post('/bookings', {
        packageId: pkg._id,
        ...form,
        groupSize: form.travelers.length,
        travelers: form.travelers.map((t) => ({ ...t, age: Number(t.age) })),
      });
      setBookingId(res.data.data.bookingId);
      setStep(3);
      toast.success('Booking submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full border border-[#16342A]/15 rounded-sm px-3 py-2 text-sm outline-none focus:border-[#BF5B3D] text-[#16342A] placeholder:text-[#16342A]/35 transition-colors bg-white';

  if (step === 3 && bookingId) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 px-4"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
          className="w-16 h-16 rounded-full border-2 border-[#3F6B4F] flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle size={30} className="text-[#3F6B4F]" />
        </motion.div>
        <h3 className="mtk-serif text-xl text-[#16342A] mb-2">Booking submitted</h3>
        <p className="text-[#16342A]/55 text-sm mb-4">Your booking ID is:</p>
        <div className="bg-[#C9A227]/10 border border-[#C9A227]/30 px-6 py-3 inline-block mb-4">
          <p className="mtk-serif text-2xl text-[#16342A] tracking-widest">{bookingId}</p>
        </div>
        <p className="text-[#16342A]/40 text-xs mb-6">Save this ID to check your booking status anytime.</p>
        <button onClick={() => { setStep(1); setBookingId(null); }} className="text-[#BF5B3D] text-sm font-medium hover:underline">
          Make another booking
        </button>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 mtk-sans">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? 'bg-[#16342A] text-[#F3ECDC]' : 'bg-[#16342A]/8 text-[#16342A]/35'}`}>{s}</div>
            {s < 2 && <div className={`h-0.5 w-8 transition-colors ${step > s ? 'bg-[#16342A]' : 'bg-[#16342A]/10'}`} />}
          </div>
        ))}
        <span className="text-xs text-[#16342A]/45 ml-2">{step === 1 ? 'Contact details' : 'Travelers & date'}</span>
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-3 mtk-sans"
            >
              <h4 className="font-semibold text-[#16342A] text-sm">Contact person</h4>
              <input type="text" placeholder="Full name *" value={form.contactPerson.name} onChange={(e) => updateContact('name', e.target.value)} className={inputClass} />
              <input type="email" placeholder="Email address *" value={form.contactPerson.email} onChange={(e) => updateContact('email', e.target.value)} className={inputClass} />
              <input type="tel" placeholder="Phone number *" value={form.contactPerson.phone} onChange={(e) => updateContact('phone', e.target.value)} className={inputClass} />
              <input type="text" placeholder="City" value={form.contactPerson.city} onChange={(e) => updateContact('city', e.target.value)} className={inputClass} />
              <h4 className="font-semibold text-[#16342A] text-sm pt-2">Emergency contact</h4>
              <input type="text" placeholder="Emergency contact name" value={form.emergencyContact.name} onChange={(e) => updateEmergency('name', e.target.value)} className={inputClass} />
              <div className="grid grid-cols-2 gap-2">
                <input type="tel" placeholder="Phone" value={form.emergencyContact.phone} onChange={(e) => updateEmergency('phone', e.target.value)} className={inputClass} />
                <input type="text" placeholder="Relation" value={form.emergencyContact.relation} onChange={(e) => updateEmergency('relation', e.target.value)} className={inputClass} />
              </div>
              <button
                onClick={() => {
                  if (!form.contactPerson.name || !form.contactPerson.email || !form.contactPerson.phone) {
                    toast.error('Please fill in all required fields');
                    return;
                  }
                  setStep(2);
                }}
                className="w-full bg-[#16342A] hover:bg-[#BF5B3D] text-[#F3ECDC] font-semibold py-3 rounded-sm transition-colors text-sm"
              >
                Next: Traveler details
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-4 mtk-sans"
            >
              <div>
                <label className="text-xs font-semibold text-[#16342A]/50 uppercase tracking-wide mb-1 block">Trek date *</label>
                <input type="date" value={form.trekDate} onChange={(e) => setForm((prev) => ({ ...prev, trekDate: e.target.value }))} min={new Date().toISOString().split('T')[0]} className={inputClass} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#16342A]/50 uppercase tracking-wide">Travelers</label>
                  <button onClick={addTraveler} className="text-xs text-[#BF5B3D] font-medium hover:underline">+ Add traveler</button>
                </div>
                <div className="space-y-3">
                  {form.travelers.map((t, i) => (
                    <div key={i} className="bg-[#16342A]/[0.04] p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#16342A]/60">Traveler {i + 1}</span>
                        {form.travelers.length > 1 && <button onClick={() => removeTraveler(i)} className="text-xs text-[#BF5B3D]/70 hover:text-[#BF5B3D]">Remove</button>}
                      </div>
                      <input type="text" placeholder="Full name *" value={t.name} onChange={(e) => updateTraveler(i, 'name', e.target.value)} className={inputClass} />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Age *"
                          value={t.age}
                          min="0"
                          max="120"
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || Number(val) >= 0) updateTraveler(i, 'age', val);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === '-' || e.key === 'e' || e.key === 'E') e.preventDefault();
                          }}
                          className={inputClass}
                        />
                        <select value={t.gender} onChange={(e) => updateTraveler(i, 'gender', e.target.value)} className={inputClass}>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <textarea placeholder="Special requests..." rows={3} value={form.specialRequests} onChange={(e) => setForm((prev) => ({ ...prev, specialRequests: e.target.value }))} className={`${inputClass} resize-none`} />
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="flex-1 border border-[#16342A]/15 text-[#16342A]/60 font-semibold py-3 rounded-sm text-sm hover:border-[#16342A]/30 transition-colors">Back</button>
                <button
                  onClick={() => {
                    if (!form.trekDate) { toast.error('Please select a trek date'); return; }
                    if (form.travelers.some((t) => !t.name || !t.age)) { toast.error('Please fill in all traveler details'); return; }
                    handleSubmit();
                  }}
                  disabled={loading}
                  className="flex-1 bg-[#16342A] hover:bg-[#BF5B3D] text-[#F3ECDC] font-semibold py-3 rounded-sm transition-colors text-sm disabled:opacity-60"
                >
                  {loading ? 'Submitting…' : 'Submit booking'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── Booking modal — form now opens on demand instead of sitting inline ──
const BookingModal = ({ pkg, open, onClose }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      >
        <div className="absolute inset-0 bg-[#0a1410]/60" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative bg-white w-full sm:max-w-md max-h-[90vh] overflow-y-auto p-6 sm:p-7"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#16342A]/40 hover:text-[#16342A]"
            aria-label="Close booking form"
          >
            <XCircle size={22} />
          </button>
          <h3 className="mtk-serif text-xl text-[#16342A] mb-1 pr-8">Book this trek</h3>
          <p className="text-[#16342A]/50 text-sm mb-6">{pkg.title}</p>
          <BookingForm pkg={pkg} />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Compact sidebar summary — replaces the stacked always-open form card ──
const BookingSidebar = ({ pkg, onOpenBooking }) => (
  <div className="sticky top-32 space-y-3">
    <div className="bg-white border border-[#16342A]/10">
      <div className="p-6 pb-5">
        <p className="text-xs text-[#16342A]/40">Starting from</p>
        <p className="mtk-serif text-3xl text-[#16342A] mb-5">
          ₹{pkg.price?.amount?.toLocaleString()}
          <span className="text-sm font-normal text-[#16342A]/40 ml-1 mtk-sans">/ person</span>
        </p>

        {/* Icon stat strip instead of a vertical label/value list */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 bg-[#16342A]/[0.04] px-3 py-2.5">
            <Clock size={16} className="text-[#BF5B3D] shrink-0" />
            <span className="text-xs text-[#16342A]/70 font-medium">{pkg.duration?.days}D / {pkg.duration?.nights}N</span>
          </div>
          <div className="flex items-center gap-2 bg-[#16342A]/[0.04] px-3 py-2.5">
            <Mountain size={16} className="text-[#BF5B3D] shrink-0" />
            <span className="text-xs text-[#16342A]/70 font-medium">{pkg.difficulty}</span>
          </div>
        </div>

        <button
          onClick={onOpenBooking}
          className="w-full bg-[#16342A] hover:bg-[#BF5B3D] text-[#F3ECDC] font-semibold py-3.5 rounded-sm transition-colors text-sm"
        >
          Book this trek
        </button>
      </div>

      {/* Contact strip folded into the same card instead of a separate dark box */}
      <div className="border-t border-[#16342A]/10 px-6 py-4 flex items-center justify-between mtk-sans">
        <a href="tel:+91-1265363308" className="flex items-center gap-1.5 text-xs text-[#16342A]/60 hover:text-[#BF5B3D] transition-colors">
          <Phone size={13} /> Call us
        </a>
        <a href="mailto:skies@gmail.com" className="flex items-center gap-1.5 text-xs text-[#16342A]/60 hover:text-[#BF5B3D] transition-colors">
          <Mail size={13} /> Email us
        </a>
      </div>    </div>
  </div>
);
const PackageDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openItinerary, setOpenItinerary] = useState(null);
  const [loadError, setLoadError] = useState(null); // 'not-found' | 'network' | null
  const [activeSection, setActiveSection] = useState('overview');
  const [bookingOpen, setBookingOpen] = useState(false);

  const sectionRefs = useRef({});

  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await API.get(`/packages/${slug}`);
        setPkg(res.data.data);
      } catch (err) {
        if (err.response?.status === 404) {
          // Genuinely doesn't exist (or was unpublished) — redirecting to the
          // packages list here is correct.
          navigate('/packages');
        } else {
          // Anything else (network error, timeout, backend cold-starting on
          // Render's free tier, 500, etc.) is likely TEMPORARY — do NOT
          // redirect away. Redirecting on a transient error is what was
          // causing Google to see this page as a "Soft 404" whenever it
          // crawled while the backend was still waking up.
          setLoadError('network');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [slug]);

  // Canonical is safe to set immediately (it's just the correct URL for this
  // page). Title/description are only set once the real package data has
  // loaded — if we set a generic placeholder title here, Google sometimes
  // captures THAT instead of the real trek title if it renders the page
  // before the fetch finishes, resulting in a wrong/generic sitelink title.
  useSEO({
    title: pkg ? `${pkg.title} | Tresk Skies` : undefined,
    description: pkg?.shortDescription,
    path: `/packages/${slug}`,
  });

  const presentSections = pkg
    ? SECTION_LIST.filter((s) => {
        if (s.id === 'overview') return true;
        if (s.id === 'highlights') return pkg.highlights?.length > 0;
        if (s.id === 'inclusions') return pkg.included?.length > 0 || pkg.excluded?.length > 0;
        if (s.id === 'itinerary') return pkg.itinerary?.length > 0;
        if (s.id === 'season') return pkg.bestSeason?.length > 0 || pkg.tags?.length > 0;
        return false;
      }).map((s) => s.id)
    : [];

  // Scrollspy: watch each section, mark the one most in view as active
  useEffect(() => {
    if (!pkg) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-160px 0px -60% 0px', threshold: 0 }
    );
    presentSections.forEach((id) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pkg]);

  const jumpTo = useCallback((id) => {
    const el = sectionRefs.current[id];
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  const registerRef = (id) => (el) => { sectionRefs.current[id] = el; };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF7EC]">
        <GlobalStyle />
        <Compass size={32} className="mtk-spin text-[#BF5B3D]" />
      </div>
    );
  }

  if (loadError === 'network') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#FBF7EC] mtk-sans">
        <GlobalStyle />
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 border border-[#C9A227]/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw size={22} className="text-[#C9A227]" />
          </div>
          <h2 className="mtk-serif text-lg text-[#16342A] mb-2">Taking a bit longer than usual</h2>
          <p className="text-[#16342A]/55 text-sm mb-5">
            Our server is just waking up — this can happen after a few minutes of inactivity. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#16342A] hover:bg-[#BF5B3D] text-[#F3ECDC] font-semibold text-sm px-6 py-2.5 rounded-sm transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!pkg) return null;

  return (
    <div className="min-h-screen bg-[#FBF7EC] mtk-sans">
      <GlobalStyle />

      {/* Back button floats over the hero */}
      <div className="relative">
        <button
          onClick={() => navigate('/packages')}
          className="absolute top-4 left-4 sm:left-6 z-20 flex items-center gap-2 text-[#F3ECDC]/85 hover:text-[#C9A227] text-sm transition-colors bg-[#16342A]/40 backdrop-blur-sm px-3 py-1.5"
        >
          <ArrowLeft size={16} /> Back to packages
        </button>
        <Hero pkg={pkg} />
      </div>

      <SectionNav present={presentSections} active={activeSection} onJump={jumpTo} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Content column — continuous flow, not stacked cards */}
          <div className="lg:col-span-2 space-y-12">

            <section id="overview" ref={registerRef('overview')} className="scroll-mt-32">
              <h2 className="mtk-serif text-2xl text-[#16342A] mb-4">About this trek</h2>
              <p className="text-[#16342A]/65 text-[15px] leading-relaxed">{pkg.fullDescription}</p>
            </section>

            {pkg.highlights?.length > 0 && (
              <section id="highlights" ref={registerRef('highlights')} className="scroll-mt-32">
                <h2 className="mtk-serif text-2xl text-[#16342A] mb-5">Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkg.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-white border border-[#16342A]/10 p-3.5">
                      <Star size={14} className="text-[#C9A227] fill-[#C9A227] mt-0.5 shrink-0" />
                      <span className="text-sm text-[#16342A]/70">{h}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(pkg.included?.length > 0 || pkg.excluded?.length > 0) && (
              <section id="inclusions" ref={registerRef('inclusions')} className="scroll-mt-32">
                <h2 className="mtk-serif text-2xl text-[#16342A] mb-5">Inclusions &amp; exclusions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {pkg.included?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-[#3F6B4F] mb-3 flex items-center gap-1.5"><CheckCircle size={15} /> Included</h3>
                      <ul className="space-y-2.5">
                        {pkg.included.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-[#16342A]/65"><CheckCircle size={13} className="text-[#3F6B4F] mt-0.5 shrink-0" />{item}</li>)}
                      </ul>
                    </div>
                  )}
                  {pkg.excluded?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-[#BF5B3D] mb-3 flex items-center gap-1.5"><XCircle size={15} /> Excluded</h3>
                      <ul className="space-y-2.5">
                        {pkg.excluded.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-[#16342A]/65"><XCircle size={13} className="text-[#BF5B3D]/70 mt-0.5 shrink-0" />{item}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {pkg.itinerary?.length > 0 && (
              <section id="itinerary" ref={registerRef('itinerary')} className="scroll-mt-32">
                <h2 className="mtk-serif text-2xl text-[#16342A] mb-5">Day-by-day itinerary</h2>
                <div className="space-y-2">
                  {pkg.itinerary.map((day) => {
                    const isOpen = openItinerary === day.day;
                    return (
                      <div key={day.day} className="bg-white border border-[#16342A]/10 overflow-hidden">
                        <button
                          onClick={() => setOpenItinerary(isOpen ? null : day.day)}
                          className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-[#16342A]/[0.03] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-[#16342A] text-[#C9A227] text-xs font-bold rounded-full flex items-center justify-center shrink-0">{day.day}</span>
                            <span className="font-semibold text-[#16342A] text-sm">{day.title}</span>
                          </div>
                          {isOpen ? <ChevronUp size={16} className="text-[#BF5B3D] shrink-0" /> : <ChevronDown size={16} className="text-[#16342A]/35 shrink-0" />}
                        </button>
                        <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                          <div className="overflow-hidden">
                            {day.description && (
                              <div className="px-4 pb-4 pt-1 text-sm text-[#16342A]/60 border-t border-[#16342A]/10">{day.description}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {(pkg.bestSeason?.length > 0 || pkg.tags?.length > 0) && (
              <section id="season" ref={registerRef('season')} className="scroll-mt-32">
                {pkg.bestSeason?.length > 0 && (
                  <div className="mb-6">
                    <h2 className="mtk-serif text-2xl text-[#16342A] mb-4 flex items-center gap-2"><Calendar size={19} className="text-[#BF5B3D]" /> Best season</h2>
                    <div className="flex flex-wrap gap-2">
                      {pkg.bestSeason.map((s, i) => <span key={i} className="bg-[#C9A227]/10 text-[#8a6f1a] text-xs font-medium px-3 py-1.5 border border-[#C9A227]/30">{s}</span>)}
                    </div>
                  </div>
                )}
                {pkg.tags?.length > 0 && (
                  <div>
                    <h2 className="mtk-serif text-2xl text-[#16342A] mb-4">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {pkg.tags.map((tag, i) => <span key={i} className="bg-[#16342A]/5 text-[#16342A]/55 text-xs px-3 py-1.5">#{tag}</span>)}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <BookingSidebar pkg={pkg} onOpenBooking={() => setBookingOpen(true)} />
          </div>
        </div>
      </div>

      <BookingModal pkg={pkg} open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
};

export default PackageDetail;