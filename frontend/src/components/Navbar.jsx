import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Menu, X, User, LogOut, Bell, Home, Building2, LayoutGrid, Calendar, BookOpen, Users, Phone, Plus, Facebook, Instagram, Mail } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get('from') || '';
  const redirectParam = searchParams.get('redirect') || '';
  const fromContext = pathname.startsWith('/events') ? 'events' : (pathname.startsWith('/blogs') ? 'blogs' : 'business');

  const getAuthTogglePath = (target) => {
    const params = [];
    if (fromParam) params.push(`from=${fromParam}`);
    if (redirectParam) params.push(`redirect=${encodeURIComponent(redirectParam)}`);
    return `${target}${params.length > 0 ? `?${params.join('&')}` : ''}`;
  };

  const getNavbarAuthPath = (target) => {
    if (pathname === '/login' || pathname === '/register') {
      return getAuthTogglePath(target);
    }
    const params = [];
    params.push(`redirect=${encodeURIComponent(pathname)}`);
    params.push(`from=${fromContext}`);
    return `${target}?${params.join('&')}`;
  };

  const isItemActive = (itemPath) => {
    if (itemPath === '/') {
      return pathname === '/';
    }
    if (itemPath === '/about') {
      return pathname === '/about' || (pathname === '/businesses' && searchParams.get('focus') === 'about');
    }
    if (itemPath === '/businesses?focus=categories') {
      return pathname === '/businesses' && searchParams.get('focus') === 'categories';
    }
    if (itemPath === '/businesses?focus=contact') {
      return pathname === '/businesses' && searchParams.get('focus') === 'contact';
    }
    if (itemPath === '/businesses') {
      return pathname === '/businesses' && !['categories', 'contact', 'about'].includes(searchParams.get('focus') || '');
    }
    return pathname.startsWith(itemPath);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Check local storage for auth
    const storedUser = localStorage.getItem('ubt_user');
    const storedToken = localStorage.getItem('ubt_token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        fetchNotifications(storedToken);
      } catch (err) {
        console.error('Failed to parse user details:', err);
        localStorage.removeItem('ubt_user');
        localStorage.removeItem('ubt_token');
      }
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const fetchNotifications = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data.filter(n => !n.isRead));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ubt_token');
    localStorage.removeItem('ubt_user');
    setUser(null);
    navigate('/');
  };

  const markAllRead = async () => {
    const token = localStorage.getItem('ubt_token');
    if (!token) return;
    try {
      await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications([]);
      setShowNotifications(false);
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Businesses', path: '/businesses' },
    { name: 'Categories', path: '/businesses?focus=categories' },
    { name: 'Events', path: '/events' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/businesses?focus=contact' },
  ];

  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return (
      <header className="w-full bg-white py-4.5 px-4 md:px-8 border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center select-none group py-1">
            <img src="/logo.png" alt="Udumalpet Business Tour" className="h-13 w-auto object-contain" />
          </Link>

          {/* Right auth navigation button */}
          <div className="flex items-center gap-3.5 text-xs font-semibold text-slate-500">
            {pathname === '/login' ? (
              <>
                <span>Don't have an account?</span>
                <Link to={getAuthTogglePath('/register')} className="border border-[#027244] text-[#027244] hover:bg-emerald-50 font-black py-2 px-5 rounded-lg transition-colors">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <span>Already have an account?</span>
                <Link to={getAuthTogglePath('/login')} className="border border-[#027244] text-[#027244] hover:bg-emerald-50 font-black py-2 px-5 rounded-lg transition-colors">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

  const getMenuIcon = (name) => {
    switch (name) {
      case 'Home': return <Home className="h-4.5 w-4.5" />;
      case 'Businesses': return <Building2 className="h-4.5 w-4.5" />;
      case 'Categories': return <LayoutGrid className="h-4.5 w-4.5" />;
      case 'Events': return <Calendar className="h-4.5 w-4.5" />;
      case 'Blogs': return <BookOpen className="h-4.5 w-4.5" />;
      case 'About Us': return <Users className="h-4.5 w-4.5" />;
      case 'Contact Us': return <Phone className="h-4.5 w-4.5" />;
      default: return null;
    }
  };

  return (
    <header className="w-full flex flex-col z-50">
      {/* Top Banner Bar */}
      <div className="hidden lg:flex w-full bg-slate-50 border-b border-slate-200 py-2 px-4 md:px-8 text-xs text-slate-600 justify-between items-center">
        <div className="flex items-center gap-1.5 font-medium">
          <MapPin className="h-3.5 w-3.5 text-emerald-600" />
          <span>Udumalpet, Tamil Nadu</span>
        </div>
        <div className="flex items-center gap-6 font-medium">
          <Link to="/add-business" className="hover:text-emerald-600 transition-colors">
            List Your Business
          </Link>
          {!user ? (
            <>
              <Link to={getNavbarAuthPath('/login')} className="hover:text-emerald-600 transition-colors">
                Login
              </Link>
              <Link
                to={getNavbarAuthPath('/register')}
                className="bg-emerald-600 text-white font-semibold py-1 px-3.5 rounded hover:bg-emerald-700 transition-colors"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {/* Notification bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-1 text-slate-600 hover:text-emerald-600"
                >
                  <Bell className="h-4 w-4" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded shadow-xl py-2 z-50 text-slate-800">
                    <div className="px-4 py-1.5 border-b border-slate-100 flex justify-between items-center">
                      <span className="font-bold text-slate-700">Alerts ({notifications.length})</span>
                      {notifications.length > 0 && (
                        <button onClick={markAllRead} className="text-emerald-600 hover:underline text-[10px]">
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-slate-400 text-xs">No new notifications</div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n._id} className="p-3 border-b border-slate-50 hover:bg-slate-50 text-[11px] leading-relaxed">
                             <p className="text-slate-600">{n.message}</p>
                             <span className="text-[9px] text-slate-400 mt-1 block">
                               {new Date(n.createdAt).toLocaleDateString()}
                             </span>
                           </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link
                to={user.role === 'superadmin' ? '/superadmin' : (user.role === 'admin' ? '/admin' : '/dashboard')}
                className="hover:text-emerald-600 font-semibold flex items-center gap-1"
              >
                <User className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer bg-transparent border-none"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav
        className={`w-full py-4 px-4 md:px-8 transition-all duration-300 ${
          isSticky
            ? 'fixed top-0 left-0 shadow-md border-b border-slate-100 navbar-glass animate-slideDown'
            : 'relative border-b border-slate-100 bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center select-none group py-1">
            <img src="/logo.png" alt="Udumalpet Business Tour" className="h-13 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7">
            {menuItems.map((item) => {
              const active = isItemActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-semibold transition-all duration-300 ease-in-out py-1.5 border-b-2 hover:text-emerald-600 ${
                    active ? 'border-emerald-600 text-emerald-600 font-bold' : 'border-transparent text-slate-600'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Actions in Header */}
          <div className="flex items-center gap-2.5 lg:hidden">
            {!user ? (
              <>
                <Link
                  to={getNavbarAuthPath('/login')}
                  className="text-xs font-bold text-slate-700 hover:text-[#027244] px-2 py-1.5 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to={getNavbarAuthPath('/register')}
                  className="text-xs font-extrabold bg-[#027244] hover:bg-[#005934] text-white px-3 py-1.5 rounded-lg transition-all shadow-xs"
                >
                  Register
                </Link>
              </>
            ) : (
              <Link
                to={user.role === 'superadmin' ? '/superadmin' : (user.role === 'admin' ? '/admin' : '/dashboard')}
                className="text-xs font-extrabold text-slate-700 hover:text-[#027244] flex items-center gap-1 border border-slate-200 bg-slate-50 px-2.5 py-1.5 rounded-lg shadow-3xs"
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {/* Mobile Hamburger menu trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 text-slate-700 hover:text-emerald-600 cursor-pointer bg-transparent border-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 py-4 px-6 flex flex-col gap-4 animate-fadeIn text-left z-50">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`text-base font-semibold py-2.5 border-b border-slate-50 hover:text-emerald-600 transition-colors flex items-center gap-3 ${
                  isItemActive(item.path) ? 'text-emerald-600 font-bold' : 'text-slate-600'
                }`}
              >
                <span className="text-emerald-500 shrink-0">{getMenuIcon(item.name)}</span>
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Divider */}
            <div className="w-full border-t border-slate-100 my-1" />

            {/* Auth actions for mobile */}
            {/* Auth actions when logged in */}
            {user && (
              <div className="flex flex-col gap-3.5 mt-2">
                <Link
                  to={user.role === 'superadmin' ? '/superadmin' : (user.role === 'admin' ? '/admin' : '/dashboard')}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-base font-semibold py-2.5 text-slate-600 hover:text-[#027244] transition-colors border-b border-slate-50"
                >
                  <User className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 text-base font-semibold py-2.5 text-red-600 hover:text-red-800 transition-colors border-none bg-transparent w-full text-left cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5 text-red-400 shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            )}

            {/* Social connection & contact details */}
            <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-slate-100">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Connect With Us</span>
              <div className="flex items-center gap-3 mt-1.5">
                <a 
                  href="https://www.facebook.com/profile.php?fb_profile_edit_entry_point=%7B%22click_point%22%3A%22edit_profile_button%22%2C%22feature%22%3A%22profile_header%22%7D&id=61590472206771&sk=about" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="h-9 w-9 rounded-xl border border-slate-200 hover:border-emerald-500 flex items-center justify-center hover:bg-[#027244] hover:text-white transition-all text-slate-500 bg-slate-50"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a 
                  href="https://www.instagram.com/udumalpet.co.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="h-9 w-9 rounded-xl border border-slate-200 hover:border-emerald-500 flex items-center justify-center hover:bg-[#027244] hover:text-white transition-all text-slate-500 bg-slate-50"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
              <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-600 mt-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#027244] shrink-0" />
                  <span>+91 12345 67890</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#027244] shrink-0" />
                  <a href="mailto:udumalpetbusinesstour@gmail.com" className="hover:text-[#027244] transition-colors break-all">udumalpetbusinesstour@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
      {/* Spacer to prevent content jump when navbar becomes fixed on scroll */}
      {isSticky && <div className="h-[76px] hidden lg:block" />}
    </header>
  );
}
