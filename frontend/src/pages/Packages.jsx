import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Mountain, Search, SlidersHorizontal, X, Compass, ChevronDown } from 'lucide-react';
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

    @keyframes mtk-fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .mtk-fade-up { animation: mtk-fade-up 0.45s ease both; }

    @media (prefers-reduced-motion: reduce) {
      .mtk-fade-up { animation: none; }
      .mtk-skeleton { animation: none; }
    }
  `}</style>
);

const difficultyColor = (level) => {
  switch (level) {
    case 'Easy': return '#3F6B4F';
    case 'Moderate': return '#C9A227';
    case 'Difficult': return '#BF5B3D';
    default: return '#7A2E2E';
  }
};

const categories = ['Himalayan', 'Forest', 'Desert', 'Coastal', 'Wildlife', 'Cultural', 'Other'];
const difficulties = ['Easy', 'Moderate', 'Difficult', 'Extreme'];
const sortOptions = [
  { label: 'Newest first', value: '-createdAt' },
  { label: 'Oldest first', value: 'createdAt' },
  { label: 'Price: low to high', value: 'price.amount' },
  { label: 'Price: high to low', value: '-price.amount' },
];

// ─── Package Card ─────────────────────────────────────────────────
const PackageCard = ({ pkg, index }) => (
  <div
    className="mtk-fade-up bg-white group"
    style={{ animationDelay: `${(index % 9) * 50}ms` }}
  >
    <div className="relative overflow-hidden h-52">
      {pkg.images?.[0] ? (
        <img
          src={pkg.images[0].url}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full bg-[#16342A] flex items-center justify-center">
          <Mountain size={44} className="text-[#F3ECDC]/30" />
        </div>
      )}
      {pkg.isFeatured && (
        <span className="absolute top-3 left-3 bg-[#C9A227] text-[#16342A] text-[11px] font-bold px-3 py-1">
          Featured
        </span>
      )}
      <span
        className="absolute top-3 right-3 text-[#F3ECDC] text-[11px] px-2 py-1 font-semibold"
        style={{ backgroundColor: difficultyColor(pkg.difficulty) }}
      >
        {pkg.difficulty}
      </span>
    </div>
    <div className="p-5 mtk-sans border border-t-0 border-[#16342A]/10">
      <div className="flex items-center gap-1 text-[#16342A]/45 text-xs mb-2">
        <MapPin size={12} />
        <span>{pkg.location?.region || 'India'}</span>
        <span className="mx-1">&middot;</span>
        <span>{pkg.category}</span>
      </div>
      <h3 className="mtk-serif text-[#16342A] text-xl mb-1 line-clamp-1">{pkg.title}</h3>
      <p className="text-[#16342A]/55 text-sm mb-4 line-clamp-2 leading-relaxed">{pkg.shortDescription}</p>
      <div className="flex items-center gap-4 text-xs text-[#16342A]/45 mb-4">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {pkg.duration?.days}D / {pkg.duration?.nights}N
        </span>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-[#16342A]/10">
        <div>
          <p className="text-xs text-[#16342A]/40">Starting from</p>
          <p className="mtk-serif text-xl text-[#16342A]">
            ₹{pkg.price?.amount?.toLocaleString()}
          </p>
        </div>
        <Link
          to={`/packages/${pkg.slug}`}
          className="bg-[#16342A] hover:bg-[#BF5B3D] text-[#F3ECDC] text-sm font-semibold px-5 py-2 rounded-sm transition-colors"
        >
          View details
        </Link>
      </div>
    </div>
  </div>
);

// ─── Skeleton Card ────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white">
    <div className="h-52 mtk-skeleton" />
    <div className="p-5 space-y-3 border border-t-0 border-[#16342A]/10">
      <div className="h-3 w-1/3 mtk-skeleton" />
      <div className="h-5 w-3/4 mtk-skeleton" />
      <div className="h-3 w-full mtk-skeleton" />
      <div className="h-3 w-2/3 mtk-skeleton" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 w-1/4 mtk-skeleton" />
        <div className="h-9 w-1/3 mtk-skeleton" />
      </div>
    </div>
  </div>
);

// ─── Filter panel content — shared by the sidebar and the mobile drawer ──
const FilterPanel = ({ filters, handleFilterChange, hasActiveFilters, clearFilters }) => (
  <div className="space-y-7">
    <div>
      <h3 className="text-xs font-semibold text-[#16342A]/50 uppercase tracking-wide mb-3">Sort by</h3>
      <select
        value={filters.sort}
        onChange={(e) => handleFilterChange('sort', e.target.value)}
        className="w-full text-sm border border-[#16342A]/15 rounded-sm px-3 py-2.5 outline-none focus:border-[#BF5B3D] bg-white text-[#16342A]"
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>

    <div>
      <h3 className="text-xs font-semibold text-[#16342A]/50 uppercase tracking-wide mb-3">Category</h3>
      <div className="space-y-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilterChange('category', filters.category === cat ? '' : cat)}
            className={`w-full text-left text-sm px-3 py-2 rounded-sm transition-colors ${
              filters.category === cat
                ? 'bg-[#16342A] text-[#F3ECDC] font-semibold'
                : 'text-[#16342A]/60 hover:bg-[#16342A]/[0.05]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>

    <div>
      <h3 className="text-xs font-semibold text-[#16342A]/50 uppercase tracking-wide mb-3">Difficulty</h3>
      <div className="flex flex-wrap gap-2">
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => handleFilterChange('difficulty', filters.difficulty === d ? '' : d)}
            className={`text-xs px-3 py-1.5 rounded-sm border transition-colors ${
              filters.difficulty === d
                ? 'bg-[#BF5B3D] border-[#BF5B3D] text-[#F3ECDC] font-semibold'
                : 'border-[#16342A]/15 text-[#16342A]/60 hover:border-[#BF5B3D]'
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>

    <div>
      <h3 className="text-xs font-semibold text-[#16342A]/50 uppercase tracking-wide mb-3">Price range (₹)</h3>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          placeholder="Min"
          value={filters.minPrice}
          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          className="w-full text-sm border border-[#16342A]/15 rounded-sm px-3 py-2 outline-none focus:border-[#BF5B3D] text-[#16342A] placeholder:text-[#16342A]/35"
        />
        <input
          type="number"
          placeholder="Max"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          className="w-full text-sm border border-[#16342A]/15 rounded-sm px-3 py-2 outline-none focus:border-[#BF5B3D] text-[#16342A] placeholder:text-[#16342A]/35"
        />
      </div>
    </div>

    {hasActiveFilters && (
      <button
        onClick={clearFilters}
        className="flex items-center gap-1 text-xs text-[#BF5B3D] hover:underline"
      >
        <X size={12} /> Clear all filters
      </button>
    )}
  </div>
);

// ─── Main Packages Page ───────────────────────────────────────────
const Packages = () => {
  useSEO({
    title: 'Trek Packages | Tresk Skies',
    description: 'Browse curated trek packages across Uttarakhand — from beginner-friendly trails to challenging summit treks.',
    path: '/packages',
  });

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    minPrice: '',
    maxPrice: '',
    sort: '-createdAt',
    page: 1,
  });

  const fetchPackages = async (page, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      params.append('sort', filters.sort);
      params.append('page', page);
      params.append('limit', 9);

      const res = await API.get(`/packages?${params.toString()}`);
      setPackages((prev) => (append ? [...prev, ...res.data.data] : res.data.data));
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Re-fetch page 1 whenever a filter (other than search) changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, page: 1 }));
    fetchPackages(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.difficulty, filters.minPrice, filters.maxPrice, filters.sort]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      difficulty: '',
      minPrice: '',
      maxPrice: '',
      sort: '-createdAt',
      page: 1,
    });
  };

  const loadMore = () => {
    const nextPage = filters.page + 1;
    setFilters((prev) => ({ ...prev, page: nextPage }));
    fetchPackages(nextPage, true);
  };

  const hasActiveFilters = filters.category || filters.difficulty || filters.minPrice || filters.maxPrice;

  const filteredPackages = filters.search
    ? packages.filter(
        (p) =>
          p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(filters.search.toLowerCase())
      )
    : packages;

  const filterProps = { filters, handleFilterChange, hasActiveFilters, clearFilters };

  return (
    <div className="min-h-screen bg-[#FBF7EC] mtk-sans">
      <GlobalStyle />

      {/* Slim header — the sidebar carries the visual weight now, not a big banner */}
      <div className="bg-[#16342A] py-8 border-b-4 border-[#C9A227]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-[#C9A227] text-sm mb-2">
            <Compass size={14} /> Explore &amp; discover
          </div>
          <h1 className="mtk-serif text-3xl sm:text-4xl text-[#F3ECDC]">Our trek packages</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Search + mobile filter trigger */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#16342A]/40" />
            <input
              type="text"
              placeholder="Search packages..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#16342A]/15 rounded-sm outline-none focus:border-[#BF5B3D] bg-white text-[#16342A] placeholder:text-[#16342A]/35"
            />
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className={`lg:hidden flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-sm border transition-colors ${
              hasActiveFilters
                ? 'bg-[#16342A] text-[#F3ECDC] border-[#16342A]'
                : 'border-[#16342A]/15 text-[#16342A]/70 bg-white'
            }`}
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-white border border-[#16342A]/10 p-5">
              <FilterPanel {...filterProps} />
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-[#16342A]/50">
                {loading ? 'Loading…' : `${pagination.total} packages found`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredPackages.length === 0 ? (
              <div className="text-center py-20">
                <Mountain size={52} className="mx-auto mb-4 text-[#16342A]/20" />
                <h3 className="mtk-serif text-lg text-[#16342A]/70 mb-2">No packages found</h3>
                <p className="text-[#16342A]/45 text-sm mb-5">Try adjusting your search or filters.</p>
                <button
                  onClick={clearFilters}
                  className="bg-[#16342A] text-[#F3ECDC] text-sm font-semibold px-6 py-2.5 rounded-sm hover:bg-[#BF5B3D] transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPackages.map((pkg, i) => (
                    <PackageCard key={pkg._id} pkg={pkg} index={i % 9} />
                  ))}
                </div>

                {/* Load more — replaces numbered pagination */}
                {filters.page < pagination.pages && (
                  <div className="text-center mt-10">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="inline-flex items-center gap-2 border border-[#16342A]/20 hover:border-[#BF5B3D] hover:text-[#BF5B3D] text-[#16342A] font-semibold px-7 py-3 rounded-sm transition-colors disabled:opacity-50"
                    >
                      {loadingMore ? 'Loading…' : 'Load more packages'}
                      {!loadingMore && <ChevronDown size={16} />}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          mobileFiltersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-[#0a1410]/60" onClick={() => setMobileFiltersOpen(false)} />
        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-[#FBF7EC] transition-transform duration-300 ease-out overflow-y-auto ${
            mobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#16342A]/10 bg-white">
            <h2 className="mtk-serif text-lg text-[#16342A]">Filters</h2>
            <button onClick={() => setMobileFiltersOpen(false)} className="text-[#16342A]/50 hover:text-[#16342A]" aria-label="Close filters">
              <X size={20} />
            </button>
          </div>
          <div className="p-5">
            <FilterPanel {...filterProps} />
          </div>
          <div className="p-5 pt-0">
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full bg-[#16342A] text-[#F3ECDC] font-semibold py-3 rounded-sm hover:bg-[#BF5B3D] transition-colors text-sm"
            >
              Show results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;