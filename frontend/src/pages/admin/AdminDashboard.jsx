import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, CalendarCheck, Mail, Image, TrendingUp, ArrowRight } from 'lucide-react';
import API from '../../api/axios';

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

const statCards = [
  { key: 'packages', label: 'Total packages', icon: Package, to: '/admin/packages', endpoint: '/packages' },
  { key: 'bookings', label: 'Total bookings', icon: CalendarCheck, to: '/admin/bookings', endpoint: '/bookings' },
  { key: 'contacts', label: 'Contact messages', icon: Mail, to: '/admin/contacts', endpoint: '/contact' },
  { key: 'gallery', label: 'Gallery images', icon: Image, to: '/admin/gallery', endpoint: '/gallery' },
];

const statusStyles = {
  Pending: 'bg-[#C9A227]/10 text-[#8a6f1a] border-[#C9A227]/30',
  Approved: 'bg-[#3F6B4F]/10 text-[#3F6B4F] border-[#3F6B4F]/30',
  Cancelled: 'bg-[#BF5B3D]/10 text-[#BF5B3D] border-[#BF5B3D]/30',
  Completed: 'bg-[#16342A]/10 text-[#16342A] border-[#16342A]/25',
};

const AdminDashboard = () => {
  const [counts, setCounts] = useState({});
  const [loadingStats, setLoadingStats] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const results = await Promise.allSettled(
        statCards.map((card) => API.get(card.endpoint))
      );

      const newCounts = {};
      results.forEach((res, i) => {
        const key = statCards[i].key;
        if (res.status === 'fulfilled') {
          const data = res.value.data?.data;
          newCounts[key] = Array.isArray(data) ? data.length : res.value.data?.count ?? '—';
        } else {
          newCounts[key] = '—';
        }
      });
      setCounts(newCounts);
      setLoadingStats(false);
    };

    const fetchRecentBookings = async () => {
      try {
        const res = await API.get('/bookings');
        const bookings = res.data?.data || [];
        const sorted = [...bookings].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentBookings(sorted.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchCounts();
    fetchRecentBookings();
  }, []);

  return (
    <div className="mtk-sans">
      <GlobalStyle />

      <div className="mb-8">
        <h1 className="mtk-serif text-3xl text-[#16342A]">Dashboard</h1>
        <p className="text-sm text-[#16342A]/50 mt-1">Overview of your trek booking platform</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map(({ key, label, icon: Icon, to }, i) => (
          <Link
            key={key}
            to={to}
            className="mtk-fade-up bg-white border border-[#16342A]/10 p-5 hover:border-[#BF5B3D] transition-colors group"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#16342A] flex items-center justify-center">
                <Icon size={18} className="text-[#C9A227]" />
              </div>
              <ArrowRight
                size={16}
                className="text-[#16342A]/25 group-hover:text-[#BF5B3D] group-hover:translate-x-0.5 transition-all"
              />
            </div>
            {loadingStats ? (
              <div className="mtk-skeleton h-8 w-14 mb-1" />
            ) : (
              <p className="mtk-serif text-2xl text-[#16342A]">{counts[key]}</p>
            )}
            <p className="text-xs text-[#16342A]/50 font-medium mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white border border-[#16342A]/10 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#16342A]/10">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[#16342A]" />
            <h2 className="mtk-serif text-[#16342A] text-base">Recent bookings</h2>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-medium text-[#BF5B3D] hover:text-[#16342A]"
          >
            View all
          </Link>
        </div>

        {loadingBookings ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="mtk-skeleton h-12" />
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="text-center py-14">
            <CalendarCheck size={40} className="mx-auto mb-3 text-[#16342A]/20" />
            <p className="text-sm text-[#16342A]/45">No bookings yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[#16342A]/45 uppercase tracking-wide border-b border-[#16342A]/10">
                  <th className="px-6 py-3 font-medium">Booking ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Package</th>
                  <th className="px-6 py-3 font-medium">Trek date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#16342A]/10">
                {recentBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-[#16342A]/[0.03]">
                    <td className="px-6 py-3.5 font-mono text-xs text-[#16342A]/50">
                      {booking.bookingId || '—'}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-[#16342A]">
                      {booking.contactPerson?.name || '—'}
                    </td>
                    <td className="px-6 py-3.5 text-[#16342A]/55">
                      {booking.package?.title || '—'}
                    </td>
                    <td className="px-6 py-3.5 text-[#16342A]/55">
                      {booking.trekDate
                        ? new Date(booking.trekDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${
                          statusStyles[booking.status] || 'bg-[#16342A]/5 text-[#16342A]/60 border-[#16342A]/15'
                        }`}
                      >
                        {booking.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;