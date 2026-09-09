import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&display=swap');
    .mtk-serif { font-family: 'Fraunces', Georgia, serif; }
    .mtk-sans  { font-family: 'Public Sans', system-ui, sans-serif; }
  `}</style>
);

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.username, form.password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#16342A] flex items-center justify-center px-4 mtk-sans">
      <GlobalStyle />
      <div
        className={`w-full max-w-md transition-all duration-500 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 border-2 border-[#C9A227] rounded-full flex items-center justify-center mx-auto mb-4">
            <Compass size={28} className="text-[#C9A227]" />
          </div>
          <h1 className="mtk-serif text-2xl text-[#F3ECDC]">SkieHHikes Admin</h1>
          <p className="text-[#F3ECDC]/50 text-sm mt-1">Sign in to manage your tours</p>
        </div>

        {/* Form */}
        <div className="bg-[#FBF7EC] p-8 shadow-2xl">
          <h2 className="mtk-serif text-xl text-[#16342A] mb-6">Welcome back</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#16342A]/50 uppercase tracking-wide mb-1.5 block">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                placeholder="Enter username"
                className="w-full border border-[#16342A]/15 rounded-sm px-4 py-3 text-sm outline-none focus:border-[#BF5B3D] transition-colors text-[#16342A] placeholder:text-[#16342A]/35 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#16342A]/50 uppercase tracking-wide mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  placeholder="Enter password"
                  className="w-full border border-[#16342A]/15 rounded-sm px-4 py-3 pr-10 text-sm outline-none focus:border-[#BF5B3D] transition-colors text-[#16342A] placeholder:text-[#16342A]/35 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#16342A]/35 hover:text-[#16342A]/70"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#16342A] hover:bg-[#BF5B3D] text-[#F3ECDC] font-semibold py-3 rounded-sm transition-colors text-sm disabled:opacity-60 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-[#F3ECDC]/45 text-xs mt-6">
          Back to{' '}
          <a href="/" className="text-[#C9A227] hover:underline">
            public site
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;