import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Tent, Heart, Map } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
// import logo from '../../assets/logo.png';

const FooterStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&display=swap');
    .mtk-serif { font-family: 'Fraunces', Georgia, serif; }
    .mtk-sans  { font-family: 'Public Sans', system-ui, sans-serif; }
  `}</style>
);

const trekTypes = [
  {
    icon: <Tent size={14} />,
    title: 'Mixed social treks',
    points: [
      'Perfect gender ratios',
      'Vibrant social vibes',
      'Solo travelers welcome',
      'Strangers to trekking family',
    ],
  },
  {
    icon: <Heart size={14} />,
    title: 'Women-only treks',
    points: [
      'Designed by women, for women',
      'Safe, empowering spaces',
      'Lifelong sisterhood',
      'Like-minded adventurers',
    ],
  },
  {
    icon: <Map size={14} />,
    title: 'Private custom treks',
    points: [
      'Built around your schedule',
      'Your pace, your circle',
      'Families, couples, teams',
      'Fully custom itinerary',
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#16342A] text-[#F3ECDC]/70 mtk-sans">
      <FooterStyle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-10">

          {/* Row 1 — Brand full width */}
          <div className="w-full">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img
                src=""
                alt="Tresk Skies"
                className="w-10 h-10 rounded-full object-cover object-center flex-shrink-0 border border-[#C9A227]/40"
              />
              <div className="leading-tight">
                <p className="mtk-serif text-base text-[#F3ECDC]">Tresk Skies</p>
                <p className="text-[11px] text-[#C9A227]">Find your perfect trail</p>
              </div>
            </Link>

            <p className="text-sm text-[#F3ECDC]/55 leading-relaxed mb-8 max-w-lg">
              We believe the mountains should be accessible to everyone, exactly
              the way they want to experience them.
            </p>

            {/* Trek Types */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-9">
              {trekTypes.map((type) => (
                <div key={type.title} className="border-t-2 border-[#C9A227]/50 pt-4">
                  <p className="flex items-center gap-2 text-[#C9A227] text-xs font-semibold mb-3">
                    {type.icon} {type.title}
                  </p>
                  <ul className="space-y-1.5">
                    {type.points.map((point) => (
                      <li key={point} className="text-[#F3ECDC]/50 text-xs flex items-start gap-2">
                        <span className="w-1 h-1 bg-[#C9A227]/70 rounded-full inline-block shrink-0 mt-1.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div> */}

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#F3ECDC]/15 hover:border-[#C9A227] hover:text-[#C9A227] text-[#F3ECDC]/50 rounded-full flex items-center justify-center transition-colors"
              >
                <FaFacebookF size={13} />
              </a>
              <a
                href="https://www.instagram.com/trekskies?igsi=NGNyajNwbXJqd2Jk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#F3ECDC]/15 hover:border-[#C9A227] hover:text-[#C9A227] text-[#F3ECDC]/50 rounded-full flex items-center justify-center transition-colors"
              >
                <FaInstagram size={13} />
              </a>
              <a
                href="#"
                className="w-9 h-9 border border-[#F3ECDC]/15 hover:border-[#C9A227] hover:text-[#C9A227] text-[#F3ECDC]/50 rounded-full flex items-center justify-center transition-colors"
              >
                <FaTwitter size={13} />
              </a>
              <a
                href="https://wa.me/+919411548183"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#F3ECDC]/15 hover:border-[#C9A227] hover:text-[#C9A227] text-[#F3ECDC]/50 rounded-full flex items-center justify-center transition-colors"
              >
                <FaWhatsapp size={13} />
              </a>
            </div>
          </div>

          {/* Row 2 — Quick Links, Popular Treks, Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pt-10 border-t border-[#F3ECDC]/10">

            {/* Quick Links */}
            <div>
              <h3 className="mtk-serif text-[#F3ECDC] mb-4 text-base">
                Quick links
              </h3>
              <ul className="space-y-2.5">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Packages', path: '/packages' },
                  { name: 'Gallery', path: '/gallery' },
                  { name: 'FAQ', path: '/faq' },
                  { name: 'Contact Us', path: '/contact' },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-[#F3ECDC]/55 hover:text-[#C9A227] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Treks */}
            <div>
              <h3 className="mtk-serif text-[#F3ECDC] mb-4 text-base">
                Popular treks
              </h3>
              <ul className="space-y-2.5">
                {[
                  'Valley of Flowers Trek',
                  'Chopta Tungnath Trek',
                  'Madhyamaheshwar Trek',
                  'Kedarkantha Trek',
                  'Tirthan Jibhi Trek',
                ].map((trek) => (
                  <li key={trek}>
                    <Link
                      to="/packages"
                      className="text-sm text-[#F3ECDC]/55 hover:text-[#C9A227] transition-colors"
                    >
                      {trek}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mtk-serif text-[#F3ECDC] mb-4 text-base">
                Contact
              </h3>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-2.5">
                  <MapPin size={14} className="text-[#C9A227] mt-1 shrink-0" />
                  <span className="text-sm text-[#F3ECDC]/55">
                    Uttrakhand, India
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={14} className="text-[#C9A227] shrink-0" />
                  <a
                    href="tel:+919411548183"
                    className="text-sm text-[#F3ECDC]/55 hover:text-[#C9A227] transition-colors"
                  >
                    +91-9411548183
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={14} className="text-[#C9A227] shrink-0" />
                  <a
                    href="mailto:skies@gmail.com"
                    className="text-sm text-[#F3ECDC]/55 hover:text-[#C9A227] transition-colors break-all"
                  >
                    trekskies01@gmail.com
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#F3ECDC]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#F3ECDC]/35">
            © {new Date().getFullYear()} Tresk Skies. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/login"
              className="text-xs text-[#F3ECDC]/25 hover:text-[#F3ECDC]/50 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;