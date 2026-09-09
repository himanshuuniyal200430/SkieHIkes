import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Compass } from 'lucide-react';
// import logo from '../../assets/logo.png';

const NavStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&display=swap');
    .mtk-serif { font-family: 'Fraunces', Georgia, serif; }
    .mtk-sans  { font-family: 'Public Sans', system-ui, sans-serif; }

    .mtk-navlink { position: relative; }
    .mtk-navlink::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -4px;
      height: 2px;
      width: 100%;
      background: #C9A227;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.25s ease;
    }
    .mtk-navlink:hover::after,
    .mtk-navlink.is-active::after { transform: scaleX(1); }

    @keyframes mtk-menu-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
    .mtk-menu-in { animation: mtk-menu-in 0.25s ease both; }

    @keyframes mtk-item-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
    .mtk-item-in { animation: mtk-item-in 0.35s ease both; }

    @media (prefers-reduced-motion: reduce) {
      .mtk-navlink::after { transition: none; }
      .mtk-menu-in, .mtk-item-in { animation: none; }
    }
  `}</style>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Packages', path: '/packages' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Our Team', path: '/our-team' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
    { name: 'Terms & Conditions', path: '/termsandconditions' },
  ];

  return (
    <nav className="bg-[#16342A] text-[#F3ECDC] sticky top-0 z-50 border-b border-[#F3ECDC]/10 mtk-sans">
      <NavStyle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src=""
              alt="SKieHikes"
              className="w-9 h-9 rounded-full object-cover object-center flex-shrink-0 border border-[#C9A227]/40"
            />
            <div className="leading-tight">
              <p className="mtk-serif text-sm text-[#F3ECDC]">SKieHikes</p>
              <p className="text-[10px] text-[#C9A227] tracking-wide flex items-center gap-1">
                <Compass size={9} /> Uttrakhand, India
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `mtk-navlink text-sm font-medium transition-colors hover:text-[#F3ECDC] ${
                    isActive ? 'is-active text-[#F3ECDC]' : 'text-[#F3ECDC]/65'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/packages"
              className="bg-[#BF5B3D] hover:bg-[#a94f34] text-[#F3ECDC] font-semibold text-sm px-4 py-2 rounded-sm transition-colors"
            >
              Explore Trips
            </Link>
            <Link
              to="/gallery"
              className="border border-[#C9A227]/60 hover:bg-[#C9A227] hover:text-[#16342A] text-[#C9A227] font-semibold text-sm px-4 py-2 rounded-sm transition-colors"
            >
              Watch Gallery
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#F3ECDC]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mtk-menu-in bg-[#0d2820] px-4 pb-4 pt-2 space-y-1 border-t border-[#F3ECDC]/10">
          {navLinks.map((link, i) => (
            <div key={link.path} className="mtk-item-in" style={{ animationDelay: `${i * 40}ms` }}>
              <NavLink
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block py-2.5 px-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#16342A] text-[#C9A227] border-l-2 border-[#C9A227]'
                      : 'text-[#F3ECDC]/70 hover:text-[#F3ECDC] border-l-2 border-transparent'
                  }`
                }
              >
                {link.name}
              </NavLink>
            </div>
          ))}
          <div className="flex gap-3 pt-3">
            <Link
              to="/packages"
              onClick={() => setIsOpen(false)}
              className="flex-1 text-center bg-[#BF5B3D] hover:bg-[#a94f34] text-[#F3ECDC] font-semibold text-sm px-4 py-2 rounded-sm transition-colors"
            >
              Explore Trips
            </Link>
            <Link
              to="/gallery"
              onClick={() => setIsOpen(false)}
              className="flex-1 text-center border border-[#C9A227]/60 text-[#C9A227] font-semibold text-sm px-4 py-2 rounded-sm transition-colors"
            >
              Gallery
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;