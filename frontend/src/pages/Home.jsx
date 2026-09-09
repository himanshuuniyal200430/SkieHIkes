import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Heart, Star, Users, MapPin, Clock, ArrowRight,
  Tent, Compass, HeartHandshake, Mountain, Binoculars,
  ChevronLeft, ChevronRight, Quote, Send,
} from 'lucide-react';
import API from '../api/axios';
import { useSEO } from '../hooks/useSEO';

// ─── Palette: pine #16342A · parchment #F3ECDC · rust #BF5B3D · gold #C9A227 ──

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&display=swap');
    .mtk-serif { font-family: 'Fraunces', Georgia, serif; }
    .mtk-sans  { font-family: 'Public Sans', system-ui, sans-serif; }

    @keyframes mtk-shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
    .mtk-skeleton {
      background: linear-gradient(90deg, #16342A12 25%, #16342A22 37%, #16342A12 63%);
      background-size: 400px 100%;
      animation: mtk-shimmer 1.3s ease infinite;
    }

    @keyframes mtk-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    .mtk-fade-up { animation: mtk-fade-up 0.5s ease both; }

    .mtk-scrollbar-none::-webkit-scrollbar { display: none; }
    .mtk-scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes mtk-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .mtk-marquee-track { animation: mtk-scroll 38s linear infinite; width: max-content; }
    .mtk-marquee:hover .mtk-marquee-track { animation-play-state: paused; }

    @media (prefers-reduced-motion: reduce) {
      .mtk-fade-up { animation: none; }
      .mtk-skeleton { animation: none; }
      .mtk-marquee-track { animation: none; }
    }
  `}</style>
);

// ─── Small shared hooks ──────────────────────────────────────────
const useInView = (options = { threshold: 0.3 }) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, options);
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, inView];
};

const useCountUp = (target, active, duration = 1200) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    let start = null;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
};

// ─── Hero (split, collage, floating count-up badge) ──────────────
const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const [badgeRef, badgeInView] = useInView({ threshold: 0.5 });
  const travelers = useCountUp(4200, badgeInView, 1400);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative bg-[#F3ECDC] mtk-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Copy */}
        <div
          className={`transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}
        >
          <div className="flex items-center gap-2 text-[#BF5B3D] text-sm mb-4">
            <Compass size={16} />
            Dehradun, Uttarakhand
          </div>
          <h1 className="mtk-serif text-4xl sm:text-5xl lg:text-[3.4rem] text-[#16342A] leading-[1.08] mb-5">
            Every trail leads<br />somewhere braver.
          </h1>
          <p className="text-[#16342A]/65 leading-relaxed text-base mb-8 max-w-md">
            Empower &amp; explore the journey together — for groups. 
            Thousands of travelers have found their footing on India's
            most transformative trails with us.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/packages"
              className="bg-[#BF5B3D] hover:bg-[#a94f34] text-[#F3ECDC] font-semibold px-7 py-3 rounded-sm transition-colors flex items-center gap-2"
            >
              Find your trek <ArrowRight size={16} />
            </Link>
            <Link
              to="/gallery"
              className="border border-[#16342A]/25 text-[#16342A] hover:border-[#16342A] font-semibold px-7 py-3 rounded-sm transition-colors"
            >
              See the gallery
            </Link>
          </div>
        </div>

        {/* Image collage + floating stat badge */}
        <div className="relative h-[420px] sm:h-[480px]">
          <div
            className={`absolute top-0 right-0 w-[70%] h-[75%] overflow-hidden shadow-xl transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80"
              alt="Mountain trail"
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className={`absolute bottom-0 left-0 w-[58%] h-[55%] overflow-hidden shadow-xl border-4 border-[#F3ECDC] transition-all duration-700 ease-out delay-150 ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80"
              alt="Travelers on a trek"
              className="w-full h-full object-cover"
            />
          </div>

          <div
            ref={badgeRef}
            className={`absolute bottom-6 right-2 sm:right-6 bg-[#16342A] text-[#F3ECDC] px-5 py-4 shadow-lg transition-all duration-700 ease-out delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="mtk-serif text-2xl leading-none mb-1">
              {travelers.toLocaleString()}+
            </p>
            <p className="text-[11px] text-[#F3ECDC]/60 tracking-wide">travelers guided</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Stats strip ──────────────────────────────────────────────────
const StatsBar = () => {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const stats = [
    { label: 'Treks completed', value: 180, suffix: '+' },
    { label: 'Women-led groups', value: 65, suffix: '%' },
    { label: 'Average rating', value: 4.9, suffix: '', decimals: 1 },
    { label: 'Years on the trail', value: 9, suffix: '' },
  ];

  return (
    <section ref={ref} className="bg-[#16342A] mtk-sans py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {stats.map((s) => (
          <StatItem key={s.label} {...s} active={inView} />
        ))}
      </div>
    </section>
  );
};

const StatItem = ({ label, value, suffix, decimals = 0, active }) => {
  const raw = useCountUp(decimals ? value * 10 : value, active, 1300);
  const display = decimals ? (raw / 10).toFixed(decimals) : raw;
  return (
    <div className="text-center sm:text-left">
      <p className="mtk-serif text-3xl sm:text-4xl text-[#F3ECDC]">
        {display}{suffix}
      </p>
      <p className="text-[#F3ECDC]/50 text-xs mt-1">{label}</p>
    </div>
  );
};

// ─── How it works ─────────────────────────────────────────────────
const HowItWorks = () => {
  const [ref, inView] = useInView({ threshold: 0.25 });
  const steps = [
    { n: '01', title: 'Choose your trail', desc: 'Browse treks by difficulty, region, or duration and find your fit.' },
    { n: '02', title: 'Reserve your seat', desc: 'Send an enquiry, get a quick response, and lock in your spot.' },
    { n: '03', title: 'Hit the trail', desc: 'Show up — guides, gear checks, and logistics are already handled.' },
  ];

  return (
    <section ref={ref} className="bg-[#F3ECDC] mtk-sans py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mtk-serif text-3xl sm:text-4xl text-[#16342A] mb-14">
          How booking works
        </h2>
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div className="hidden sm:block absolute top-6 left-[16.5%] right-[16.5%] h-px bg-[#16342A]/15" />
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={inView ? 'mtk-fade-up' : 'opacity-0'}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="relative z-10 w-12 h-12 rounded-full bg-[#16342A] text-[#C9A227] flex items-center justify-center mtk-serif text-sm mb-5">
                {s.n}
              </div>
              <h3 className="text-[#16342A] font-semibold text-base mb-2">{s.title}</h3>
              <p className="text-[#16342A]/60 text-sm leading-relaxed max-w-xs">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Package card (grid) ──────────────────────────────────────────
const difficultyColor = (level) => {
  switch (level) {
    case 'Easy': return '#3F6B4F';
    case 'Moderate': return '#C9A227';
    case 'Difficult': return '#BF5B3D';
    default: return '#7A2E2E';
  }
};

const PackageCard = ({ pkg }) => (
  <div className="bg-white group shrink-0 w-[270px] sm:w-[290px]">
    <div className="relative overflow-hidden h-48">
      {pkg.images?.[0] ? (
        <img
          src={pkg.images[0].url}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full bg-[#16342A] flex items-center justify-center">
          <Mountain size={36} className="text-[#F3ECDC]/40" />
        </div>
      )}
      <span
        className="absolute top-3 left-3 text-[11px] font-semibold px-2 py-0.5 text-[#F3ECDC]"
        style={{ backgroundColor: difficultyColor(pkg.difficulty) }}
      >
        {pkg.difficulty}
      </span>
      <div className="absolute bottom-0 left-0 right-0 bg-[#16342A]/85 backdrop-blur-sm px-3 py-2 flex items-center justify-between">
        <span className="text-[#F3ECDC]/70 text-[11px]">From</span>
        <span className="mtk-serif text-[#F3ECDC] text-base">
          ₹{pkg.price?.amount?.toLocaleString()}
        </span>
      </div>
    </div>

    <div className="p-4 mtk-sans border border-t-0 border-[#16342A]/10">
      <span className="flex items-center gap-1 text-[#16342A]/50 text-xs mb-2">
        <MapPin size={12} />
        {pkg.location?.region || 'India'}
      </span>
      <h3 className="mtk-serif text-[#16342A] text-lg mb-1 line-clamp-1">{pkg.title}</h3>
      <p className="text-[#16342A]/55 text-xs mb-4 line-clamp-2 leading-relaxed">{pkg.shortDescription}</p>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-[#16342A]/45">
          <Clock size={12} />
          {pkg.duration?.days}D / {pkg.duration?.nights}N
        </span>
        <Link
          to={`/packages/${pkg.slug}`}
          className="text-xs font-semibold text-[#BF5B3D] hover:text-[#16342A] flex items-center gap-1 transition-colors"
        >
          Reserve <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="bg-white shrink-0 w-[270px] sm:w-[290px]">
    <div className="h-48 mtk-skeleton" />
    <div className="p-4 space-y-2 border border-t-0 border-[#16342A]/10">
      <div className="h-3 w-1/3 mtk-skeleton" />
      <div className="h-4 w-3/4 mtk-skeleton" />
      <div className="h-3 w-full mtk-skeleton" />
      <div className="h-3 w-2/3 mtk-skeleton" />
    </div>
  </div>
);

// ─── Packages: tabbed, auto-scrolling row ───────────────────────────
const PackagesSection = () => {
  const [featured, setFeatured] = useState([]);
  const [allTreks, setAllTreks] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingTreks, setLoadingTreks] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get('/packages?featured=true&limit=10');
        setFeatured(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingFeatured(false);
      }
    };
    const fetchAllTreks = async () => {
      try {
        const res = await API.get('/packages?trekSection=true&sort=-createdAt&limit=10');
        setAllTreks(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTreks(false);
      }
    };
    fetchFeatured();
    fetchAllTreks();
  }, []);

  const active = tab === 'featured' ? featured : allTreks;
  const isLoading = tab === 'featured' ? loadingFeatured : loadingTreks;

  return (
    <section className="py-20 bg-[#FBF7EC] mtk-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <h2 className="mtk-serif text-3xl sm:text-4xl text-[#16342A]">
            Pick your elevation
          </h2>
          <div className="flex gap-1 bg-[#16342A]/5 p-1">
            {[
              { id: 'featured', label: 'Featured' },
              { id: 'all', label: 'All treks' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-[#16342A] text-[#F3ECDC]'
                    : 'text-[#16342A]/60 hover:text-[#16342A]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex gap-6 overflow-x-hidden">
            {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : active.length === 0 ? (
          <p className="text-[#16342A]/50 text-sm py-8">No trips here yet — check back soon.</p>
        ) : (
          <div className="relative overflow-hidden mtk-marquee">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-[#FBF7EC] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-[#FBF7EC] to-transparent z-10" />
            <div className="mtk-marquee-track flex gap-6">
              {[...active, ...active].map((pkg, i) => (
                <PackageCard key={`${pkg._id}-${i}`} pkg={pkg} />
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 border border-[#16342A]/25 hover:border-[#BF5B3D] hover:text-[#BF5B3D] text-[#16342A] font-semibold px-7 py-3 rounded-sm transition-colors"
          >
            View all packages <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ─── Why Us: waypoint carousel ─────────────────────────────────────
const Waypoints = () => {
  const scrollerRef = useRef(null);
  const [active, setActive] = useState(0);
  const reasons = [
    { icon: <Tent size={20} />, title: 'Trusted hospitality', desc: 'Thoughtfully designed stays and experiences throughout your journey.' },
    { icon: <ShieldCheck size={20} />, title: 'Well equipped', desc: 'Safety gear, first aid, and emergency support built into every trip.' },
    { icon: <Heart size={20} />, title: 'Mindful curation', desc: 'Every detail curated for comfort, safety, and meaning.' },
    { icon: <Users size={20} />, title: 'Small, meaningful groups', desc: 'Kept deliberately small for real attention and real bonding.' },
    { icon: <Compass size={20} />, title: 'Expert local guides', desc: 'People who know every switchback and every story behind it.' },
    { icon: <HeartHandshake size={20} />, title: 'Community building', desc: 'A growing community of travelers who explore, connect, and inspire.' },
    { icon: <Mountain size={20} />, title: 'Unmatched diversity', desc: 'Himalayan treks to coastal escapes, for every kind of traveler.' },
    { icon: <Binoculars size={20} />, title: 'Safe group travel', desc: 'Certified, experienced guides watching the trail with you.' },
  ];

  const scrollBy = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  };

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / (el.scrollWidth / reasons.length));
    setActive(idx);
  };

  return (
    <section className="py-20 bg-[#16342A] mtk-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mb-10">
          <h2 className="mtk-serif text-3xl sm:text-4xl text-[#F3ECDC] mb-3">
            What you can count on
          </h2>
          <p className="text-[#F3ECDC]/60 text-sm leading-relaxed">
            Eight things we hold ourselves to on every single trip.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => scrollBy(-1)}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-[#16342A] border border-[#F3ECDC]/25 text-[#F3ECDC] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors shadow-lg"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>

          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory mtk-scrollbar-none pb-2"
          >
            {reasons.map((r) => (
              <div
                key={r.title}
                className="snap-start shrink-0 w-[240px] sm:w-[260px] bg-[#0d2820] p-6"
              >
                <div className="w-10 h-10 rounded-full border border-[#C9A227]/50 text-[#C9A227] flex items-center justify-center mb-4">
                  {r.icon}
                </div>
                <h3 className="text-[#F3ECDC] font-semibold text-sm mb-2">{r.title}</h3>
                <p className="text-[#F3ECDC]/55 text-xs leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => scrollBy(1)}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-[#16342A] border border-[#F3ECDC]/25 text-[#F3ECDC] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors shadow-lg"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex gap-1.5 mt-6">
          {reasons.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === active ? 'w-6 bg-[#C9A227]' : 'w-1.5 bg-[#F3ECDC]/25'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Testimonials: sliding carousel ────────────────────────────────
const TestimonialCarousel = () => {
  const testimonials = [
    { name: 'Aanya Singh', city: 'Mumbai', text: 'The Valley of Flowers trek was life-changing. Every moment felt safe, fun, and filled with memories I will treasure forever.', rating: 5 },
    { name: 'Meera Patel', city: 'Ahmedabad', text: 'As a solo traveler I was nervous at first. SkieHikes made me feel at home from day one — the community I found here is priceless.', rating: 5 },
    { name: 'Divya Nair', city: 'Bangalore', text: 'Professional, caring, and deeply empowering. Every detail was thoughtfully arranged. Will definitely book again.', rating: 5 },
  ];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goPrev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const goNext = () => setIndex((i) => (i + 1) % testimonials.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 2500);
    return () => clearInterval(t);
  }, [paused, testimonials.length]);

  return (
    <section className="py-20 bg-[#F3ECDC] mtk-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="mtk-serif text-3xl sm:text-4xl text-[#16342A] mb-12">
          Postcards from the trail
        </h2>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            onClick={goPrev}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-[#F3ECDC] border border-[#16342A]/15 text-[#16342A] hover:border-[#BF5B3D] hover:text-[#BF5B3D] transition-colors shadow-sm"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div key={t.name} className="w-full shrink-0 px-2">
                  <Quote size={28} className="text-[#BF5B3D] mx-auto mb-4" />
                  <p className="mtk-serif text-[#16342A] text-xl italic leading-relaxed mb-6">
                    {t.text}
                  </p>
                  <div className="flex justify-center gap-1 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} className="text-[#C9A227] fill-[#C9A227]" />
                    ))}
                  </div>
                  <p className="font-semibold text-[#16342A] text-sm">{t.name}</p>
                  <p className="text-xs text-[#16342A]/45">{t.city}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={goNext}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-[#F3ECDC] border border-[#16342A]/15 text-[#16342A] hover:border-[#BF5B3D] hover:text-[#BF5B3D] transition-colors shadow-sm"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-[#BF5B3D]' : 'w-1.5 bg-[#16342A]/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── CTA: full-bleed photo + centered glass form ───────────────────
const QuickContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'Trip Enquiry', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/contact', form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: 'Trip Enquiry', message: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 rounded-full border border-[#3F6B4F] flex items-center justify-center mx-auto mb-4">
          <Heart size={22} className="text-[#3F6B4F]" />
        </div>
        <h4 className="mtk-serif text-[#16342A] text-lg mb-1">Enquiry sent</h4>
        <p className="text-[#16342A]/55 text-sm">We'll get back to you within 24 hours.</p>
        <button onClick={() => setSuccess(false)} className="mt-4 text-[#BF5B3D] text-sm font-medium hover:underline">
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input type="text" placeholder="Your name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} required
          className="col-span-2 sm:col-span-1 border border-[#16342A]/20 bg-white rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#BF5B3D] text-[#16342A] placeholder:text-[#16342A]/40" />
        <input type="tel" placeholder="Phone number" value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })} required
          className="col-span-2 sm:col-span-1 border border-[#16342A]/20 bg-white rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#BF5B3D] text-[#16342A] placeholder:text-[#16342A]/40" />
      </div>
      <input type="email" placeholder="Email address" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} required
        className="w-full border border-[#16342A]/20 bg-white rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#BF5B3D] text-[#16342A] placeholder:text-[#16342A]/40" />
      <div className="flex gap-2 flex-wrap pt-1">
        {['Himalayan', 'Coastal', 'Desert', 'Cultural'].map((cat) => (
          <button type="button" key={cat}
            onClick={() => setForm({ ...form, subject: `${cat} Trek Enquiry` })}
            className={`text-xs px-3 py-1.5 rounded-sm border transition-colors ${
              form.subject === `${cat} Trek Enquiry`
                ? 'bg-[#16342A] border-[#16342A] text-[#F3ECDC] font-semibold'
                : 'border-[#16342A]/20 bg-white text-[#16342A]/60 hover:border-[#BF5B3D]'
            }`}>
            {cat}
          </button>
        ))}
      </div>
      <textarea placeholder="Tell us about your dream trip..." rows={3} value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })} required
        className="w-full border border-[#16342A]/20 bg-white rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#BF5B3D] resize-none text-[#16342A] placeholder:text-[#16342A]/40" />
      <button type="submit" disabled={loading}
        className="w-full bg-[#BF5B3D] hover:bg-[#a94f34] text-[#F3ECDC] font-semibold py-3 rounded-sm transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2">
        {loading ? 'Sending…' : (<>Send enquiry <Send size={14} /></>)}
      </button>
    </form>
  );
};

const CTA = () => (
  <section className="relative py-24 mtk-sans overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600&q=80')" }}
    />
    <div className="absolute inset-0 bg-[#16342A]/85" />
    <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#F3ECDC] p-6 sm:p-10">
        <p className="text-[#BF5B3D] text-sm font-medium mb-2">Ready when you are</p>
        <h2 className="mtk-serif text-2xl sm:text-3xl text-[#16342A] mb-6">
          Tell us about your dream trip
        </h2>
        <QuickContactForm />
      </div>
    </div>
  </section>
);

// ─── Main Home Page ──────────────────────────────────────────────
const Home = () => {
  useSEO({
    title: 'SkieHIkes | Tour & Trekking Packages in Uttarakhand',
    description: 'SkieHIkes offers curated tour and trekking packages across Uttarakhand and beyond. Based in Dehradun, trusted by travelers for personalized itineraries and reliable service.',
    path: '/',
  });

  return (
    <div>
      <GlobalStyle />
      <Hero />
      <StatsBar />
      <PackagesSection />
      <HowItWorks />
      <Waypoints />
      <TestimonialCarousel />
      <CTA />
    </div>
  );
};

export default Home;