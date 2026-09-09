import Ankit from "../assets/Ankit.png";
import Archana from "../assets/Archana.png";
import Harshmani from "../assets/Harsh.png";
import Ayush from "../assets/Ayush.png";
import Arjun from "../assets/Arjun.png";
import { Compass } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&display=swap');
    .mtk-serif { font-family: 'Fraunces', Georgia, serif; }
    .mtk-sans  { font-family: 'Public Sans', system-ui, sans-serif; }

    @keyframes mtk-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    .mtk-fade-up { animation: mtk-fade-up 0.5s ease both; }

    @keyframes mtk-spin-slow { to { transform: rotate(360deg); } }
    .group:hover .mtk-ring { animation: mtk-spin-slow 6s linear infinite; }
  `}</style>
);

const team = [
  {
    name: 'Archana Uniyal',
    role: 'Founder',
    initials: 'AU',
    photo: Archana,
    badge: 'Leadership',
  },
  {
    name: 'Harshmani Uniyal',
    role: 'CEO',
    initials: 'HU',
    photo: Harshmani,
    badge: 'Leadership',
  },
  {
    name: 'Ankit Sajwan',
    role: 'Company Manager',
    initials: 'AS',
    photo: Ankit,
    badge: 'Operations',
  },
  {
    name: 'Arjun Uniyal',
    role: 'Accounts Manager',
    initials: 'AU',
    photo: Arjun,
    badge: 'Finance',
  },
  {
    name: 'Ayush Sindhwal',
    role: 'Marketing Manager',
    initials: 'AY',
    photo: Ayush,
    badge: 'Growth',
  },
];

const OurTeam = () => {
  useSEO({
    title: 'Meet the Team | SkieHIkes',
    description: 'Meet the people behind SkieHIkes — the team crafting your Himalayan adventures.',
    path: '/our-team',
  });

  return (
    <div className="mtk-sans">
      <GlobalStyle />

      {/* Page Header */}
      <section className="bg-[#16342A] py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-[#C9A227] text-sm mb-3">
            <Compass size={15} /> The people behind the magic
          </div>
          <h1 className="mtk-serif text-3xl sm:text-4xl text-[#F3ECDC] mb-2">
            Meet the team
          </h1>
          <p className="text-[#F3ECDC]/55 text-sm">Five passionate people. One mission.</p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 bg-[#FBF7EC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {team.map((member, i) => (
              <div
                key={member.name}
                className="mtk-fade-up bg-white border border-[#16342A]/10 hover:border-[#BF5B3D] p-6 text-center transition-all duration-300 hover:-translate-y-1 group"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="relative mx-auto mb-4" style={{ width: '72px', height: '72px' }}>
                  <div
                    className="mtk-ring absolute rounded-full border-2 border-dashed border-[#16342A]/15 group-hover:border-[#C9A227] transition-colors duration-300"
                    style={{
                      inset: '-6px',
                      width: 'calc(100% + 12px)',
                      height: 'calc(100% + 12px)',
                    }}
                  />
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover object-center relative"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full flex items-center justify-center text-sm font-bold bg-[#16342A] text-[#C9A227] relative">
                      {member.initials}
                    </div>
                  )}
                </div>

                <p className="mtk-serif text-[#16342A] text-base leading-tight mb-1">{member.name}</p>
                <p className="text-[#16342A]/45 text-xs uppercase tracking-wider mb-3">{member.role}</p>
                <span className="text-xs font-semibold px-3 py-1 border border-[#C9A227]/40 text-[#8a6f1a] bg-[#C9A227]/10">
                  {member.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurTeam;