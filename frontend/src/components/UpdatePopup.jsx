import { useState, useEffect } from 'react';
import { X, Bell, ShieldCheck, MapPin, Phone, User, Loader, Sparkles } from 'lucide-react';

export default function UpdatePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [area, setArea] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | success

  // Initialize and run the timer logic
  useEffect(() => {
    // Check if the user is already subscribed (saved permanently in localStorage)
    const alreadySubscribed = localStorage.getItem('ubt_subscribed') === 'true';
    if (alreadySubscribed) {
      setIsSubscribed(true);
      return;
    }

    // Retrieve or establish the next show timestamp
    let nextShow = sessionStorage.getItem('ubt_popup_next_show');
    if (!nextShow) {
      const initialShowTime = Date.now() + 60 * 1000; // 1 minute delay
      sessionStorage.setItem('ubt_popup_next_show', initialShowTime.toString());
      nextShow = initialShowTime.toString();
    }

    const interval = setInterval(() => {
      const currentNextShow = parseInt(sessionStorage.getItem('ubt_popup_next_show') || '0', 10);
      const isDone = localStorage.getItem('ubt_subscribed') === 'true';

      if (isDone) {
        setIsSubscribed(true);
        setIsOpen(false);
        clearInterval(interval);
        return;
      }

      // If the scheduled time has arrived and the popup is closed, open it
      if (!isOpen && currentNextShow && Date.now() >= currentNextShow) {
        setIsOpen(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isSubscribed]);

  // Handle popup closure/dismissal
  const handleClose = () => {
    setIsOpen(false);
    // Schedule the next show for 5 minutes (300,000 ms) in the future
    const snoozeTime = Date.now() + 5 * 60 * 1000;
    sessionStorage.setItem('ubt_popup_next_show', snoozeTime.toString());
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    
    // Indian Mobile Number validation (10 digits starting with 6-9)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!area.trim()) {
      setError('Please enter your area or neighborhood.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/update-subscribers/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          mobile: mobile,
          area: area.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        localStorage.setItem('ubt_subscribed', 'true');
        setIsSubscribed(true);
        // Clear fields
        setName('');
        setMobile('');
        setArea('');
        // Auto close the success message after 3 seconds
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      } else {
        setError(data.message || 'Subscription failed. Please check details and try again.');
      }
    } catch (err) {
      setError('Connection to server failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 sm:p-8 flex flex-col items-center animate-scale-up">
        
        {/* Close Button */}
        {status !== 'success' && (
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
            aria-label="Close updates popup"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {status === 'success' ? (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
              <ShieldCheck className="h-9 w-9" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Subscription Confirmed!</h3>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed max-w-xs">
              Thank you for staying connected. You will now receive important updates about trusted Udumalpet businesses, offers, and events!
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col">
            {/* Header Icon & Text */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4 animate-pulse">
                <Bell className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-[#001c41] tracking-tight mb-2 flex items-center gap-1.5 justify-center">
                <span>Stay Updated with UBT</span>
                <Sparkles className="h-5 w-5 text-amber-500 fill-current" />
              </h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Enter your name, mobile number, and area to receive updates about trusted local businesses, services, special offers, events, and opportunities in and around Udumalpet.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-650 rounded-xl p-3 text-xs font-semibold flex items-start gap-2">
                <span className="mt-0.5 text-red-500">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Subscription Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <div className="relative flex items-center">
                  <User className="h-4.5 w-4.5 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-2.5 pl-10 pr-4 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
                  />
                </div>
              </div>

              {/* Mobile Number Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Mobile Number</label>
                <div className="relative flex items-center">
                  <Phone className="h-4.5 w-4.5 text-slate-400 absolute left-3" />
                  <input
                    type="tel"
                    required
                    maxLength="10"
                    placeholder="Enter 10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full py-2.5 pl-10 pr-4 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
                  />
                </div>
              </div>

              {/* Area Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Area / Location</label>
                <div className="relative flex items-center">
                  <MapPin className="h-4.5 w-4.5 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g., Udumalpet Town, Palani Road"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full py-2.5 pl-10 pr-4 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition-all shadow-md shadow-emerald-600/15 flex items-center justify-center gap-2 cursor-pointer hover:translate-y-[-1px] active:translate-y-[0px]"
              >
                {loading && <Loader className="h-4.5 w-4.5 animate-spin" />}
                <span>Subscribe for Updates</span>
              </button>
            </form>

            {/* Snooze/Maybe Later Link */}
            <button
              onClick={handleClose}
              className="mt-4 text-center text-[11px] text-slate-400 hover:text-slate-600 font-bold hover:underline cursor-pointer"
            >
              Maybe Later
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
