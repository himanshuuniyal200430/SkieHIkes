import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  Mail,
  Image,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&display=swap');
    .mtk-serif { font-family: 'Fraunces', Georgia, serif; }
    .mtk-sans  { font-family: 'Public Sans', system-ui, sans-serif; }

    .mtk-navlink { position: relative; }
    .mtk-navlink::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #C9A227;
      transform: scaleY(0);
      transition: transform 0.2s ease;
    }
    .mtk-navlink.is-active::before { transform: scaleY(1); }
  `}</style>
);

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/packages', label: 'Packages', icon: Package },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/admin/contacts', label: 'Contacts', icon: Mail },
  { to: '/admin/gallery', label: 'Gallery', icon: Image },
  { to: '/admin/faq', label: 'FAQ', icon: HelpCircle },
];

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin/login', { replace: true });
  };

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-[#F3ECDC]/10">
        <div className="w-8 h-8 rounded-full border border-[#C9A227] flex items-center justify-center flex-shrink-0">
          <Compass size={15} className="text-[#C9A227]" />
        </div>
        <span className="mtk-serif text-[#F3ECDC] text-sm">Tresk Skies Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto mtk-sans">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `mtk-navlink flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'is-active bg-[#F3ECDC]/[0.06] text-[#F3ECDC]'
                  : 'text-[#F3ECDC]/55 hover:bg-[#F3ECDC]/5 hover:text-[#F3ECDC]'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Admin info + logout */}
      <div className="px-3 py-4 border-t border-[#F3ECDC]/10 mtk-sans">
        {admin?.username && (
          <div className="px-3.5 mb-2">
            <p className="text-[#F3ECDC] text-sm font-medium truncate">{admin.username}</p>
            <p className="text-[#F3ECDC]/40 text-xs capitalize">{admin.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-[#F3ECDC]/55 hover:bg-[#BF5B3D]/10 hover:text-[#BF5B3D] transition-colors"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#FBF7EC] flex">
      <GlobalStyle />

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#16342A] flex-shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar (animated slide-over) */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-[#0a1410]/60"
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`relative flex flex-col w-64 bg-[#16342A] h-full transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 text-[#F3ECDC]/50 hover:text-[#F3ECDC]"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
          <SidebarContent />
        </aside>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar (mobile only — desktop sidebar covers this) */}
        <header className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-[#16342A]/10 sticky top-0 z-30 mtk-sans">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-[#16342A]/60 hover:text-[#16342A]"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="mtk-serif text-[#16342A] text-sm">Matrika Admin</span>
          <div className="w-[22px]" />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 mtk-sans">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;