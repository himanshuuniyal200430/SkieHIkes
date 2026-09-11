import { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, Search, Compass } from 'lucide-react';
import API from '../api/axios';
import { useSEO } from '../hooks/useSEO';

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

    @keyframes mtk-fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .mtk-fade-up { animation: mtk-fade-up 0.4s ease both; }
  `}</style>
);

const categories = ['All', 'Booking', 'Trekking', 'Payment', 'Safety', 'Other'];

const FAQ = () => {
  useSEO({
    title: 'FAQs | Tresk Skies',
    description: 'Answers to common questions about booking treks and tours with Tresk Skies.',
    path: '/faq',
  });

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        // Backend mounts this router at /api/faq (singular) — see server.js
        const params = activeCategory !== 'All' ? `?category=${activeCategory}` : '';
        const res = await API.get(`/faq${params}`);
        setFaqs(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, [activeCategory]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setLoading(true);
    setOpenId(null);
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOpen = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#FBF7EC] mtk-sans">
      <GlobalStyle />

      {/* Header */}
      <div className="bg-[#16342A] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-[#C9A227] text-sm mb-3">
            <Compass size={15} /> Got questions?
          </div>
          <h1 className="mtk-serif text-4xl sm:text-5xl text-[#F3ECDC] mb-3">
            Frequently asked questions
          </h1>
          <p className="text-[#F3ECDC]/60 max-w-xl mx-auto text-sm">
            Everything you need to know before you lace up your boots and join a Tresk Skies trek.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#16342A]/35" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a question..."
            className="w-full pl-11 pr-4 py-3 rounded-sm border border-[#16342A]/15 bg-white text-sm text-[#16342A] placeholder:text-[#16342A]/35 outline-none focus:border-[#BF5B3D] transition-colors"
          />
        </div>

        {/* Category Filter — sliding pill */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`relative px-5 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-[#16342A] text-[#F3ECDC]'
                  : 'bg-white text-[#16342A]/55 border border-[#16342A]/15 hover:border-[#BF5B3D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="mtk-skeleton h-16" />
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-20">
            <HelpCircle size={52} className="mx-auto mb-4 text-[#16342A]/20" />
            <h3 className="mtk-serif text-lg text-[#16342A]/70 mb-2">No questions found</h3>
            <p className="text-[#16342A]/45 text-sm">
              Try a different search term or browse another category.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => {
              const isOpen = openId === faq._id;
              return (
                <div
                  key={faq._id}
                  className="mtk-fade-up bg-white border border-[#16342A]/10 overflow-hidden"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <button
                    onClick={() => toggleOpen(faq._id)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#16342A]/[0.03] transition-colors"
                  >
                    <span className="text-sm sm:text-base font-medium text-[#16342A]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`flex-shrink-0 text-[#16342A]/35 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#BF5B3D]' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm text-[#16342A]/60 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Still have questions CTA */}
        <div className="mt-14 text-center bg-[#16342A] py-12 px-6">
          <h3 className="mtk-serif text-[#F3ECDC] text-2xl mb-2">Still have questions?</h3>
          <p className="text-[#F3ECDC]/55 text-sm mb-6">
            Our team is happy to help you plan your next adventure.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#BF5B3D] hover:bg-[#a94f34] text-[#F3ECDC] font-semibold text-sm px-7 py-3 rounded-sm transition-colors"
          >
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;