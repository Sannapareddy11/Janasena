import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-slate-800 font-extrabold text-xl heading-display tracking-wider mb-4">
              <span className="bg-[#dc2626] p-1.5 rounded-lg text-white">
                <Newspaper size={18} />
              </span>
              <span>News<span className="text-[#dc2626]">Hub</span></span>
            </Link>
            <p className="text-sm text-slate-600 max-w-xs leading-relaxed">
              NewsHub is a premium, state-of-the-art news portal delivering the latest updates, trending debates, and insightful journalism.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#DA2824] font-bold text-sm tracking-wider uppercase mb-4 heading-display">Navigation</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link to="/" className="hover:text-[#dc2626] transition-colors">Home</Link>
              </li>
              {/* <li>
                <Link to="/login" className="hover:text-[#dc2626] transition-colors">Admin Dashboard</Link>
              </li> */}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h3 className="text-[#DA2824] font-bold text-sm tracking-wider uppercase mb-4 heading-display">Newsletter</h3>
            <p className="text-sm text-slate-600 mb-3 leading-relaxed">Subscribe to get real-time email notifications for hot news.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-slate-50 border border-slate-200 text-sm rounded-l-lg px-3.5 py-1.5 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] flex-grow text-slate-800 placeholder-slate-400"
              />
              <button className="bg-[#dc2626] hover:bg-[#ef4444] text-white text-xs font-semibold px-4 py-1.5 rounded-r-lg uppercase tracking-wider transition-colors cursor-pointer">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-200 my-6" />

        {/* Bottom Credits */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NewsHub Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-700 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-700 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-700 cursor-pointer">Contact Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
