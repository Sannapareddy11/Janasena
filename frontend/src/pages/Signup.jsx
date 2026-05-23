import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, User, ShieldAlert, UserPlus } from 'lucide-react';
import API from '../services/api';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Reader Registration
      const { data } = await API.post('/users/register', { name, email, password });
      localStorage.setItem('userToken', data.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
        })
      );
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Registration failed. Please check your inputs.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-[#f8fafc]">
      {/* Visual background flares */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#DA2824]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#DA2824]/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xl p-8 md:p-10 z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-[#DA2824]/10 rounded-2xl text-[#DA2824] mb-4">
            <UserPlus size={28} />
          </div>
        
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Sign up to read complete premium stories and interact with news.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-[#DA2824] text-sm p-4 rounded-xl mb-6"
          >
            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={18} />
              </span>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-black placeholder-slate-400 focus:outline-none focus:border-[#DA2824] focus:ring-1 focus:ring-[#DA2824] focus:bg-white transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-black placeholder-slate-400 focus:outline-none focus:border-[#DA2824] focus:ring-1 focus:ring-[#DA2824] focus:bg-white transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-black placeholder-slate-400 focus:outline-none focus:border-[#DA2824] focus:ring-1 focus:ring-[#DA2824] focus:bg-white transition-all duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#DA2824] hover:bg-[#e03d39] text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-red-600/10 hover:shadow-red-600/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus size={18} />
                Register Account
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-slate-100">
          <p className="text-slate-500 text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#DA2824] hover:text-[#e03d39] font-bold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
