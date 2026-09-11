import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mountain, Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../api/axios';
import { useSEO } from '../hooks/useSEO';

// ─── Palette: pine #16342A · parchment #F3ECDC · rust #BF5B3D · gold #C9A227 ──

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&display=swap');
    .mtk-serif { font-family: 'Fraunces', Georgia, serif; }
    .mtk-sans  { font-family: 'Public Sans', system-ui, sans-serif; }

    @keyframes mtk-shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
    .mtk-skeleton {
      background: linear-gradient(90deg, #16342A12 25%, #16342A22 37%, #16342A12 63%);
      background-size: 400px 100%;
      animation: mtk-shimmer 1.3s ease infinite;
    }

    .mtk-scrollbar-none::-webkit-scrollbar { display: none; }
    .mtk-scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

const categories = ['All', 'Trek', 'Camp', 'Nature', 'People', 'Wildlife', 'Other'];

const gridVariants = {
  show: { transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const Gallery = () => {
  useSEO({
    title: 'Gallery | Tresk Skies',
    description: 'Explore photos from our treks and tours across Uttarakhand — real moments from real journeys.',
    path: '/gallery',
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const filmstripRef = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const params = activeCategory !== 'All' ? `?category=${activeCategory}` : '';
        const res = await API.get(`/gallery${params}`);
        setImages(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [activeCategory]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setLoading(true);
  };

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const showNext = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );

  // Keyboard navigation for the lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  // Keep the active filmstrip thumbnail scrolled into view
  useEffect(() => {
    if (lightboxIndex === null || !filmstripRef.current) return;
    const activeThumb = filmstripRef.current.children[lightboxIndex];
    if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [lightboxIndex]);

  const lightbox = lightboxIndex !== null ? images[lightboxIndex] : null;

  return (
    <div className="min-h-screen bg-[#FBF7EC] mtk-sans">
      <GlobalStyle />

      {/* Header */}
      <div className="bg-[#16342A] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-[#C9A227] text-sm mb-3">
            <Compass size={15} /> Memories &amp; moments
          </div>
          <h1 className="mtk-serif text-4xl sm:text-5xl text-[#F3ECDC] mb-3">Our gallery</h1>
          <p className="text-[#F3ECDC]/60 max-w-xl mx-auto text-sm">
            A glimpse into the journeys, landscapes, and community that make every Tresk Skies trek unforgettable.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10">

          {/* Sidebar categories — replaces the top pill row on desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-[#16342A]/45 uppercase tracking-wide mb-3">Filter by</p>
              <nav className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`relative w-full text-left text-sm px-3 py-2 rounded-sm transition-colors ${
                      activeCategory === cat
                        ? 'bg-[#16342A] text-[#F3ECDC] font-medium'
                        : 'text-[#16342A]/55 hover:bg-[#16342A]/[0.05]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile category row — sidebar collapses to a horizontal scroller on small screens */}
          <div className="lg:hidden -mt-2 mb-2">
            <div className="flex gap-2 overflow-x-auto mtk-scrollbar-none pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`relative shrink-0 px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${
                    activeCategory === cat ? 'bg-[#16342A] text-[#F3ECDC]' : 'bg-white border border-[#16342A]/15 text-[#16342A]/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="lg:col-start-2 lg:row-start-1">
            {loading ? (
              <div className="columns-2 sm:columns-3 gap-3 space-y-3">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="mtk-skeleton break-inside-avoid"
                    style={{ height: `${[200, 250, 180, 220, 260, 190][i % 6]}px` }}
                  />
                ))}
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-20">
                <Mountain size={52} className="mx-auto mb-4 text-[#16342A]/20" />
                <h3 className="mtk-serif text-lg text-[#16342A]/70 mb-2">No images yet</h3>
                <p className="text-[#16342A]/45 text-sm">Check back soon for stunning photos.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  variants={gridVariants}
                  initial="hidden"
                  animate="show"
                  className="columns-2 sm:columns-3 gap-3 space-y-3"
                >
                  {images.map((img, i) => (
                    <motion.div
                      key={img._id}
                      variants={itemVariants}
                      className="break-inside-avoid overflow-hidden cursor-pointer group relative"
                      onClick={() => setLightboxIndex(i)}
                    >
                      {img.mediaType === 'video' ? (
                        <video
                          src={img.url}
                          muted
                          playsInline
                          className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <img
                          src={img.url}
                          alt={img.title || img.category}
                          className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute inset-0 bg-[#16342A]/0 group-hover:bg-[#16342A]/50 transition-colors duration-300 flex items-end p-3">
                        {img.title && (
                          <p className="text-[#F3ECDC] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {img.title}
                          </p>
                        )}
                      </div>
                      <span className="absolute top-2 right-2 bg-[#16342A]/70 text-[#F3ECDC] text-[11px] px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {img.category}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0a1410]/92 z-50 flex flex-col items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 text-[#F3ECDC]/80 hover:text-[#C9A227] transition-colors z-10"
              onClick={closeLightbox}
              aria-label="Close"
            >
              <X size={28} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); showPrev(); }}
                  className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full border border-[#F3ECDC]/25 text-[#F3ECDC] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); showNext(); }}
                  className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full border border-[#F3ECDC]/25 text-[#F3ECDC] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full"
            >
              {lightbox.mediaType === 'video' ? (
                <video
                  src={lightbox.url}
                  controls
                  autoPlay
                  className="w-full max-h-[70vh] object-contain"
                />
              ) : (
                <img
                  src={lightbox.url}
                  alt={lightbox.title || lightbox.category}
                  className="w-full max-h-[70vh] object-contain"
                />
              )}
              {(lightbox.title || lightbox.category) && (
                <div className="text-center mt-4">
                  {lightbox.title && <p className="mtk-serif text-[#F3ECDC] text-lg">{lightbox.title}</p>}
                  <p className="text-[#F3ECDC]/50 text-sm mt-0.5">{lightbox.category}</p>
                </div>
              )}
            </motion.div>

            {/* Filmstrip — new: jump straight to any photo without closing */}
            {images.length > 1 && (
              <div
                ref={filmstripRef}
                onClick={(e) => e.stopPropagation()}
                className="mt-5 flex gap-2 overflow-x-auto mtk-scrollbar-none max-w-full px-4"
              >
                {images.map((img, i) => (
                  <button
                    key={img._id}
                    onClick={() => setLightboxIndex(i)}
                    className={`shrink-0 w-14 h-14 overflow-hidden border-2 transition-colors ${
                      i === lightboxIndex ? 'border-[#C9A227]' : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    {img.mediaType === 'video' ? (
                      <video src={img.url} muted className="w-full h-full object-cover" />
                    ) : (
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;