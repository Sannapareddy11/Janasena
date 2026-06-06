import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/janasena_logo.png';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Logo & About */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img
                src={logo}
                alt="JanaSena News"
                className="w-32 h-auto object-contain"
              />
            </Link>

            <p className="text-sm text-slate-600 leading-7">
              JanaSena News is dedicated to providing timely, accurate, and
              reliable coverage of JanaSena Party activities, leadership,
              public meetings, political developments, and community initiatives.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#DA2824] font-bold uppercase text-sm mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link
                  to="/"
                  className="hover:text-[#DA2824] transition-colors"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-[#DA2824] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="hover:text-[#DA2824] transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#DA2824] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#DA2824] font-bold uppercase text-sm mb-4">
              Contact
            </h3>

            <div className="space-y-3 text-sm text-slate-600">
              <p>Email: janasenanews@gmail.com</p>
              <p>Website: www.janasenanews.com</p>
              <p>Andhra Pradesh, India</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-slate-500">
            <p>
              © {new Date().getFullYear()} JanaSena News. All Rights Reserved.
            </p>

            <p>
              Developed with ❤️ for JanaSena Party
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;