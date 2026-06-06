  import React, { useState, useEffect, useRef } from 'react';
  import { Link, useNavigate, useLocation } from 'react-router-dom';
  import { Search, Menu, X, LayoutDashboard, LogOut, LogIn, Newspaper, ChevronDown } from 'lucide-react';
  import logo from '../assets/janasena_logo.png';

  const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);

    // Close dropdown and mobile drawer on path change, and load user details
    useEffect(() => {
      const adminToken = localStorage.getItem('adminToken');
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      const userToken = localStorage.getItem('userToken');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (adminToken && adminUser.role === 'admin') {
        setIsAdmin(true);
        setUserName(adminUser.name || 'Admin');
      } else if (userToken && user) {
        setIsAdmin(false);
        setUserName(user.name || 'User');
      } else {
        setIsAdmin(false);
        setUserName('');
      }
      
      setIsDropdownOpen(false);
      setIsOpen(false);
    }, [location]);

    // Click outside to close the dropdown menu
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Synchronize search input with URL query param if on Home page
    useEffect(() => {
      if (location.pathname === '/') {
        const searchParams = new URLSearchParams(location.search);
        setSearchQuery(searchParams.get('search') || '');
      } else {
        setSearchQuery('');
      }
    }, [location.pathname, location.search]);

    const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        navigate('/');
      }
    };

    const handleLogout = () => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      setIsAdmin(false);
      setUserName('');
      navigate('/login');
    };

    return (
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" >
                {/* <span className="bg-[#DA2824] p-1.5 rounded-lg text-white block">
                  <Newspaper size={20} className="text-white" />
                </span> */}
                {/* <span className="text-slate-800">News<span className="text-[#DA2824]">Hub</span></span> */}
               <img
                src={logo}
                alt="JanaSena Logo"
                className="w-32 h-auto object-contain"
              />
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            {/* <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200/80 rounded-full py-1.5 pl-4 pr-10 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#DA2824] focus:ring-1 focus:ring-[#DA2824] focus:bg-white transition-all duration-300"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#DA2824] transition-colors cursor-pointer">
                  <Search size={16} />
                </button>
              </form>
            </div> */}

            {/* Desktop Nav Links / Profile Dropdown */}
            <div className="hidden md:flex items-center gap-4">
              {userName ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-50 border border-slate-200/80 bg-white transition-all duration-200 cursor-pointer select-none"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#DA2824] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 hidden lg:inline-block">
                      {userName}
                    </span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200/80 shadow-xl py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-[10px] text-slate-400 font-medium">Logged in as</p>
                        <p className="text-sm font-bold text-slate-850 truncate">{userName}</p>
                        <span className="inline-block text-[9px] uppercase font-bold tracking-wider text-[#DA2824] bg-red-50 px-2 py-0.5 rounded mt-1">
                          {isAdmin ? 'Administrator' : 'Reader'}
                        </span>
                      </div>
                      
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#DA2824] transition-colors"
                        >
                          <LayoutDashboard size={15} />
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 bg-[#DA2824] hover:bg-[#e03d39] text-white px-5 py-2 rounded-full text-sm font-bold shadow-md shadow-red-600/5 hover:shadow-red-600/15 transition-all duration-300 cursor-pointer"
                >
                  <LogIn size={15} className="text-white" />
                  <span className="text-white">Login</span>
                </Link>
              )}
            </div>

            {/* Hamburger Menu - Mobile */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-600 hover:text-[#DA2824] p-2 rounded-md focus:outline-none cursor-pointer"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="md:hidden bg-white/95 border-t border-slate-100 px-4 pt-4 pb-6 space-y-4 shadow-xl z-50 animate-fadeIn">
            {/* Mobile Search */}
            {/* <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-4 pr-10 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#DA2824]"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={16} />
              </button>
            </form> */}

            {/* Mobile Links */}
            <div className="flex flex-col gap-3">
              {userName ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-full bg-[#DA2824] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{userName}</p>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-[#DA2824]">
                        {isAdmin ? 'Administrator' : 'Reader'}
                      </span>
                    </div>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-slate-700 hover:text-[#DA2824] px-3 py-2 rounded-md text-base font-semibold transition-all"
                    >
                      <LayoutDashboard size={18} />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full bg-red-50 text-[#DA2824] border border-[#DA2824]/20 px-4 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-[#DA2824] text-white px-4 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-red-600/10 transition-all cursor-pointer"
                >
                  <LogIn size={18} className="text-white" />
                  <span className="text-white">Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    );
  };

  export default Navbar;
