import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Send, Phone, Mail, Clock, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#001c41] text-slate-300 pt-16 pb-8 border-t border-slate-800 z-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Column 1: Logo and Description */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center select-none group py-1">
            <img src="/logo-dark.png" alt="Udumalpet Business Tour" className="h-13 w-auto object-contain" />
          </div>
          <p className="text-xs text-slate-450 leading-relaxed max-w-sm font-semibold">
            A trusted local platform to discover, connect and grow with verified businesses in and around Udumalpet.
          </p>
          <div className="flex items-center gap-3 mt-1">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full border border-slate-700 hover:border-emerald-500 flex items-center justify-center hover:bg-[#027244] hover:text-white transition-all text-slate-400">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full border border-slate-700 hover:border-emerald-500 flex items-center justify-center hover:bg-[#027244] hover:text-white transition-all text-slate-400">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full border border-slate-700 hover:border-emerald-500 flex items-center justify-center hover:bg-[#027244] hover:text-white transition-all text-slate-400">
              <Send className="h-4 w-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full border border-slate-700 hover:border-emerald-500 flex items-center justify-center hover:bg-[#027244] hover:text-white transition-all text-slate-400">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="flex flex-col gap-2.5 text-xs font-semibold text-slate-400">
            <li><Link to="/" className="hover:text-emerald-500 transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-emerald-500 transition-colors">About Us</Link></li>
            <li><Link to="/businesses" className="hover:text-emerald-500 transition-colors">Businesses</Link></li>
            <li><Link to="/businesses?focus=categories" className="hover:text-emerald-500 transition-colors">Categories</Link></li>
            <li><Link to="/events" className="hover:text-emerald-500 transition-colors">Events</Link></li>
            <li><Link to="/blogs" className="hover:text-emerald-500 transition-colors">Blog</Link></li>
            <li><Link to="/businesses?focus=contact" className="hover:text-emerald-500 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Column 3: For Businesses */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">For Businesses</h4>
          <ul className="flex flex-col gap-2.5 text-xs font-semibold text-slate-400">
            <li><Link to="/add-business" className="hover:text-emerald-500 transition-colors">List Your Business</Link></li>
            <li><Link to="/login?from=business" className="hover:text-emerald-500 transition-colors">Business Login</Link></li>
            <li><Link to="/businesses?focus=pricing" className="hover:text-emerald-500 transition-colors">Pricing & Plans</Link></li>
            <li><Link to="/#how-it-works" className="hover:text-emerald-500 transition-colors">How It Works</Link></li>
            <li><Link to="/businesses?focus=guidelines" className="hover:text-emerald-500 transition-colors">Business Guidelines</Link></li>
          </ul>
        </div>

        {/* Column 4: Support */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">Support</h4>
          <ul className="flex flex-col gap-2.5 text-xs font-semibold text-slate-400">
            <li><Link to="/businesses?focus=contact" className="hover:text-emerald-500 transition-colors">Help Center</Link></li>
            <li><Link to="/#faq" className="hover:text-emerald-500 transition-colors">FAQs</Link></li>
            <li><Link to="/businesses?focus=terms" className="hover:text-emerald-500 transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/businesses?focus=privacy" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/businesses?focus=refund" className="hover:text-emerald-500 transition-colors">Refund Policy</Link></li>
          </ul>
        </div>

        {/* Column 5: Contact Us */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">Contact Us</h4>
          <ul className="flex flex-col gap-3.5 text-xs font-semibold text-slate-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">Udumalpet, Tamil Nadu - 642126</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
              <span>+91 12345 67890</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
              <a href="mailto:info@udumalpet.co.in" className="hover:text-emerald-500 transition-colors">info@udumalpet.co.in</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">Mon - Sat: 9:00 AM - 8:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-semibold">
        <span>© 2025 Udumalpet Business Tour. All rights reserved.</span>
        <span>Made with <span className="text-red-500">❤️</span> for Udumalpet</span>
      </div>
    </footer>
  );
}
