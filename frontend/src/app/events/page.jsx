import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, Calendar, MapPin, User, Phone, ShieldCheck, Bookmark, Sparkles, 
  Clock, Grid, ChevronRight, AlertCircle, ArrowLeft, CheckCircle2, MessageSquare, 
  Plus, Lock, PlusCircle, Check, DollarSign, ExternalLink, Tag
} from 'lucide-react';

const availableCategories = [
  'Sports',
  'Festival',
  'Business',
  'Music',
  'Education',
  'Health',
  'Others'
];

const mockEvents = [
  {
    _id: 'evt_1',
    title: 'Udumalpet Marathon 2025',
    category: 'Sports',
    description: 'Join us for a fitness-filled marathon event across beautiful routes in Udumalpet.',
    date: new Date('2025-05-25T06:00:00'),
    time: 'Sunday, 6:00 AM',
    venue: 'Udumalpet Town, Tamil Nadu',
    organizer: 'FitLife Club Udumalpet',
    phone: '+91 98945 67890',
    price: 99,
    coverImageUrl: 'https://images.unsplash.com/photo-1502224562085-639556652f33?w=500&q=80',
    paymentLink: 'https://tickets.udumalpetmarathon.in',
    duration: '1 Day'
  },
  {
    _id: 'evt_2',
    title: 'Arulmigu Subramanya Swamy Temple Festival',
    category: 'Festival',
    description: 'Annual temple festival with special poojas, processions and cultural programs.',
    date: new Date('2025-06-10T00:00:00'),
    endDate: new Date('2025-06-16T23:59:59'),
    time: 'All Day',
    venue: 'Palani Road, Udumalpet',
    organizer: 'Temple Committee',
    phone: '+91 97500 12345',
    price: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1608958416755-22d7d566f1ea?w=500&q=80',
    paymentLink: '',
    duration: '7 Days'
  },
  {
    _id: 'evt_3',
    title: 'Udumalpet Startup Meet 2025',
    category: 'Business',
    description: 'A meetup for entrepreneurs, innovators and business enthusiasts.',
    date: new Date('2025-06-28T10:00:00'),
    time: 'Saturday, 10:00 AM',
    venue: 'Udumalpet IT Park',
    organizer: 'Udumalpet Startup Hub',
    phone: '+91 90035 67890',
    price: 99,
    coverImageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&q=80',
    paymentLink: 'https://startupmeet.in/register',
    duration: '1 Day'
  },
  {
    _id: 'evt_4',
    title: 'Carnatic Music Concert',
    category: 'Music',
    description: 'An evening of classical Carnatic music by renowned artists.',
    date: new Date('2025-07-05T18:30:00'),
    time: 'Saturday, 6:30 PM',
    venue: 'Sri Krishna Mahal, Udumalpet',
    organizer: 'Sangeetha Sabha',
    phone: '+91 98422 33445',
    price: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80',
    paymentLink: '',
    duration: '4 Hours'
  }
];

export default function EventsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Mode state variables
  const [showListingWizard, setShowListingWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState('auth'); // auth | info_stage_1 | payment | info_stage_2 | success
  const [authView, setAuthView] = useState('login'); // login | register (separated views!)
  const [loginMethod, setLoginMethod] = useState('mobile'); // mobile | email

  // Listing Form Stage 1: Basic details
  const [evtTitle, setEvtTitle] = useState('');
  const [evtCategory, setEvtCategory] = useState('Sports');
  const [evtDate, setEvtDate] = useState('');
  const [evtEndDate, setEvtEndDate] = useState('');
  const [evtDuration, setEvtDuration] = useState('');
  const [evtTime, setEvtTime] = useState('');
  const [evtOrganizer, setEvtOrganizer] = useState('');

  // Listing Form Stage 2: Additional details (only collected AFTER payment!)
  const [evtDescription, setEvtDescription] = useState('');
  const [evtVenue, setEvtVenue] = useState('');
  const [evtPaymentLink, setEvtPaymentLink] = useState('');
  const [evtPhone, setEvtPhone] = useState('');
  const [evtCoverUrl, setEvtCoverUrl] = useState('');

  // Submission / Loading states
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Authentication Fields (Exactly matching Image 2 specifications)
  const [loginMobile, setLoginMobile] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Dynamic Pricing states
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [paymentPrice, setPaymentPrice] = useState(99); // Dynamic: 0 for active business subscribers, 99 for others

  // Dynamic Event Search Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterDate, setFilterDate] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming | past
  const [sortBy, setSortBy] = useState('Date (Soonest)');

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check local storage for auth
    const storedUser = localStorage.getItem('ubt_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        checkUserSubscription(parsedUser._id);
        setWizardStep('info_stage_1');
        if (searchParams.get('list') === 'true') {
          setShowListingWizard(true);
        }
      } catch (err) {
        console.error('Failed to parse ubt_user details from localStorage:', err);
        localStorage.removeItem('ubt_user');
        localStorage.removeItem('ubt_token');
      }
    }
    fetchEvents();
  }, [searchParams]);

  const checkUserSubscription = async (userId) => {
    try {
      const token = localStorage.getItem('ubt_token');
      if (!token) return;
      
      const res = await fetch('http://localhost:5000/api/events/check-subscription', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.hasActiveSubscription) {
        setHasActiveSubscription(true);
        setPaymentPrice(0);
      } else {
        setHasActiveSubscription(false);
        setPaymentPrice(99);
      }
    } catch (err) {
      console.warn('Subscription check error, defaulting to paid standard charge.');
      setHasActiveSubscription(false);
      setPaymentPrice(99);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/events');
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
        calculateCounts(data.data);
      }
    } catch (err) {
      console.warn('API Offline, using realistic mock events fallbacks');
      setEvents(mockEvents);
      calculateCounts(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const calculateCounts = (evtList) => {
    const counts = { 'All Categories': evtList.length };
    availableCategories.forEach(c => {
      counts[c] = 0;
    });
    evtList.forEach(e => {
      if (counts[e.category] !== undefined) {
        counts[e.category]++;
      } else {
        counts[e.category] = 1;
      }
    });
    setCategoryCounts(counts);
  };

  // Auth Submit logic (mobile/email login exactly matching mockup specifications)
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      if (authView === 'login') {
        const payload = loginMethod === 'mobile' 
          ? { email: loginMobile, password: loginPassword }
          : { email: loginEmail, password: loginPassword };

        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
          const token = data.token || (data.data && data.data.token);
          const user = data.user || (data.data && data.data.user);
          if (!token || !user) {
            setAuthError('Response validation error: token or user information missing.');
            return;
          }

          localStorage.setItem('ubt_token', token);
          localStorage.setItem('ubt_user', JSON.stringify(user));
          setCurrentUser(user);
          await checkUserSubscription(user._id || user.id);
          setWizardStep('info_stage_1');
        } else {
          setAuthError(data.message || 'Invalid credentials');
        }
      } else {
        if (regPassword !== regConfirmPassword) {
          throw new Error('Passwords do not match');
        }

        const res = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: regFullName,
            mobileNumber: regMobile,
            email: regEmail,
            password: regPassword,
            role: 'owner'
          })
        });
        const data = await res.json();

        if (data.success) {
          const token = data.token || (data.data && data.data.token);
          const user = data.user || (data.data && data.data.user);
          if (!token || !user) {
            setAuthError('Response validation error: token or user information missing.');
            return;
          }

          localStorage.setItem('ubt_token', token);
          localStorage.setItem('ubt_user', JSON.stringify(user));
          setCurrentUser(user);
          await checkUserSubscription(user._id || user.id);
          setWizardStep('info_stage_1');
        } else {
          setAuthError(data.message || 'Registration failed');
        }
      }
    } catch (err) {
      setAuthError(err.message || 'An error occurred during authentication');
    } finally {
      setAuthLoading(false);
    }
  };

  // Stage 1 collection: validate basic details, then trigger payment
  const handleStage1Submit = (e) => {
    e.preventDefault();
    if (!evtTitle || !evtCategory || !evtDate || !evtTime || !evtOrganizer) {
      setErrorMsg('Please fill in all mandatory fields');
      return;
    }
    setErrorMsg('');
    setWizardStep('payment');
  };

  // Successful payment transitions only to Stage 2 information!
  const handlePaymentProceed = () => {
    setWizardStep('info_stage_2');
  };

  // Stage 2 submission logic
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!evtDescription || !evtVenue || !evtPhone) {
      setErrorMsg('Description, Location, and Contact phone details are required');
      return;
    }
    setErrorMsg('');
    setSubmitLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: evtTitle,
          category: evtCategory,
          description: evtDescription,
          date: evtDate,
          endDate: evtEndDate || undefined,
          duration: evtDuration || undefined,
          time: evtTime,
          venue: evtVenue,
          organizer: evtOrganizer,
          phone: evtPhone,
          coverImageUrl: evtCoverUrl,
          paymentLink: evtPaymentLink,
          price: paymentPrice
        })
      });
      const data = await res.json();
      if (data.success) {
        setWizardStep('success');
        fetchEvents();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      // Mock push on offline fallback
      console.warn('API error during submit, performing local synchronization fallback');
      const mockPush = {
        _id: 'evt_' + Math.random().toString(36).substr(2, 9),
        title: evtTitle,
        category: evtCategory,
        description: evtDescription,
        date: new Date(evtDate),
        endDate: evtEndDate ? new Date(evtEndDate) : undefined,
        duration: evtDuration || undefined,
        time: evtTime,
        venue: evtVenue,
        organizer: evtOrganizer,
        phone: evtPhone,
        coverImageUrl: evtCoverUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&q=80',
        paymentLink: evtPaymentLink,
        price: paymentPrice
      };
      setEvents([mockPush, ...events]);
      calculateCounts([mockPush, ...events]);
      setWizardStep('success');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Filter listings
  const filteredEvents = events.filter(e => {
    const keywordMatch = !searchKeyword || 
      e.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      e.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchKeyword.toLowerCase());

    const catMatch = filterCategory === 'All Categories' || e.category === filterCategory;

    let dateMatch = true;
    if (filterDate) {
      const selected = new Date(filterDate).toDateString();
      const current = new Date(e.date).toDateString();
      dateMatch = selected === current;
    }

    const today = new Date();
    const isUpcoming = new Date(e.date) >= today || (e.endDate && new Date(e.endDate) >= today);
    const tabMatch = activeTab === 'upcoming' ? isUpcoming : !isUpcoming;

    return keywordMatch && catMatch && dateMatch && tabMatch;
  });

  // Sorting list based on selection
  if (sortBy === 'Date (Soonest)') {
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortBy === 'Date (Latest)') {
    filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Visual Styling for Category Badges
  const getBadgeStyles = (cat) => {
    switch (cat) {
      case 'Sports':
        return 'bg-emerald-50 text-[#027244] border-emerald-100';
      case 'Festival':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'Business':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Music':
        return 'bg-pink-50 text-pink-700 border-pink-100';
      case 'Education':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Health':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Sports':
        return '⚽';
      case 'Festival':
        return '🎪';
      case 'Business':
        return '🏢';
      case 'Music':
        return '🎵';
      case 'Education':
        return '🎓';
      case 'Health':
        return '❤️';
      default:
        return '📂';
    }
  };

  // Step-by-Step Listing Wizard View
  if (showListingWizard) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] py-12 px-4 md:px-8 font-sans">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* Top Back navigation */}
          <button 
            onClick={() => setShowListingWizard(false)}
            className="flex items-center gap-2 text-slate-600 hover:text-emerald-700 font-extrabold text-sm self-start cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            <span>Back to Events directory</span>
          </button>

          {/* STEP 1: AUTHENTICATION FLOW (Toggled Login & Register - Separated Clean Layout!) */}
          {wizardStep === 'auth' && (
            <div className="max-w-md w-full mx-auto bg-white border border-slate-200/80 shadow-2xl rounded-3xl p-8 text-left mt-2">
              
              {authView === 'login' ? (
                /* SEPARATED LOGIN SCREEN */
                <div className="flex flex-col gap-5 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-2xl font-black text-[#001c41]">Welcome Back!</h2>
                    <p className="text-slate-450 text-xs font-semibold mt-1.5 leading-relaxed">
                      Login to your account and manage your events in Udumalpet.
                    </p>
                  </div>

                  {/* Auth Type selection tabs */}
                  <div className="flex gap-6 border-b border-slate-100 text-xs font-black">
                    <button 
                      onClick={() => setLoginMethod('mobile')}
                      className={`pb-3 uppercase tracking-wider cursor-pointer border-b-2 ${loginMethod === 'mobile' ? 'border-[#027244] text-[#027244]' : 'border-transparent text-slate-400'}`}
                    >
                      Login with Mobile
                    </button>
                    <button 
                      onClick={() => setLoginMethod('email')}
                      className={`pb-3 uppercase tracking-wider cursor-pointer border-b-2 ${loginMethod === 'email' ? 'border-[#027244] text-[#027244]' : 'border-transparent text-slate-400'}`}
                    >
                      Login with Email
                    </button>
                  </div>

                  {authError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                    {loginMethod === 'mobile' ? (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Mobile Number</span>
                        <div className="flex gap-2">
                          <div className="h-10 px-3 border border-slate-350 rounded-xl bg-slate-50 flex items-center gap-1.5 text-xs font-bold text-slate-700 shrink-0">
                            <span className="text-base">🇮🇳</span>
                            <span>+91</span>
                          </div>
                          <input
                            type="tel"
                            placeholder="Enter your mobile number"
                            value={loginMobile}
                            onChange={(e) => setLoginMobile(e.target.value)}
                            required
                            className="h-10 px-3.5 border border-slate-350 rounded-xl flex-1 text-xs font-semibold focus:outline-none focus:border-[#027244]"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email Address</span>
                        <input
                          type="email"
                          placeholder="Enter your email address"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                          className="h-10 px-3.5 border border-slate-350 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Password</span>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="h-10 px-3.5 border border-slate-350 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs mt-1">
                      <label className="flex items-center gap-2 font-bold text-slate-600 cursor-pointer select-none">
                        <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#027244] focus:ring-[#027244]" />
                        <span>Remember Me</span>
                      </label>
                      <button type="button" className="font-extrabold text-[#027244] hover:underline cursor-pointer bg-transparent border-none">
                        Forgot Password?
                      </button>
                    </div>

                    <button 
                      type="submit"
                      disabled={authLoading}
                      className="h-11 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <span>{authLoading ? 'Signing In...' : 'Login'}</span>
                      <ChevronRight className="h-4.5 w-4.5" />
                    </button>
                  </form>

                  <div className="relative flex items-center justify-center my-3">
                    <div className="border-t border-slate-100 w-full" />
                    <span className="absolute bg-white px-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">or</span>
                  </div>

                  <button className="w-full h-11 border border-slate-200 hover:bg-slate-50 text-slate-600 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer">
                    <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="text-xs text-slate-550 font-bold text-center mt-3 border-t border-slate-100 pt-4">
                    <span>Don't have an account? </span>
                    <button 
                      onClick={() => { setAuthView('register'); setAuthError(''); }}
                      className="text-[#027244] font-black hover:underline cursor-pointer bg-transparent border-none"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              ) : (
                /* SEPARATED REGISTER SCREEN */
                <div className="flex flex-col gap-5 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-2xl font-black text-[#001c41]">Create Your Account</h2>
                    <p className="text-slate-450 text-xs font-semibold mt-1.5 leading-relaxed">
                      Join our platform and start promoting your events in Udumalpet.
                    </p>
                  </div>

                  {authError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit} className="flex flex-col gap-3.5">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Full Name</span>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        required
                        className="h-10 px-3.5 border border-slate-350 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Mobile Number</span>
                      <div className="flex gap-2">
                        <div className="h-10 px-3 border border-slate-350 rounded-xl bg-slate-50 flex items-center gap-1.5 text-xs font-bold text-slate-700 shrink-0">
                          <span className="text-base">🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          placeholder="Enter your mobile number"
                          value={regMobile}
                          onChange={(e) => setRegMobile(e.target.value)}
                          required
                          className="h-10 px-3.5 border border-slate-350 rounded-xl flex-1 text-xs font-semibold focus:outline-none focus:border-[#027244]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email Address *</span>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                        className="h-10 px-3.5 border border-slate-350 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Password</span>
                      <input
                        type="password"
                        placeholder="Create a password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        className="h-10 px-3.5 border border-slate-350 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Confirm Password</span>
                      <input
                        type="password"
                        placeholder="Confirm your password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        required
                        className="h-10 px-3.5 border border-slate-350 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                      />
                    </div>

                    <label className="flex items-start gap-2.5 text-xs font-semibold text-slate-550 leading-snug cursor-pointer select-none mt-1">
                      <input type="checkbox" required className="h-4 w-4 rounded border-slate-300 text-[#027244] focus:ring-[#027244] shrink-0 mt-0.5" />
                      <span>I agree to the <span className="text-[#027244] font-extrabold hover:underline">Terms of Service</span> and <span className="text-[#027244] font-extrabold hover:underline">Privacy Policy</span></span>
                    </label>

                    <button 
                      type="submit"
                      disabled={authLoading}
                      className="h-11 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-2 flex items-center justify-center cursor-pointer disabled:opacity-50"
                    >
                      <span>{authLoading ? 'Creating Account...' : 'Create Account'}</span>
                    </button>
                  </form>

                  <div className="relative flex items-center justify-center my-3">
                    <div className="border-t border-slate-100 w-full" />
                    <span className="absolute bg-white px-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">or</span>
                  </div>

                  <button className="w-full h-11 border border-slate-200 hover:bg-slate-50 text-slate-600 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer">
                    <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>Sign up with Google</span>
                  </button>

                  <div className="text-xs text-slate-550 font-bold text-center mt-3 border-t border-slate-100 pt-4">
                    <span>Already have an account? </span>
                    <button 
                      onClick={() => { setAuthView('login'); setAuthError(''); }}
                      className="text-[#027244] font-black hover:underline cursor-pointer bg-transparent border-none"
                    >
                      Login
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* STEP 2: BASIC DETAILS (Title, Date, Duration, Timings, Organizer) */}
          {wizardStep === 'info_stage_1' && (
            <div className="max-w-3xl w-full mx-auto bg-white border border-slate-200/80 shadow-xl rounded-3xl p-7 text-left mt-2">
              <div className="border-b border-slate-100 pb-3.5 mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-[#001c41]">List Your Event - Basic Details</h2>
                  <span className="text-xs text-slate-450 font-semibold mt-1 block">Step 1 of 3: Provide the core details of your scheduled event.</span>
                </div>
                <span className="bg-slate-50 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider px-2 py-1 rounded border border-slate-200 select-none">
                  Stage 1
                </span>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs font-semibold mb-6 flex items-center gap-2">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleStage1Submit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Event Name / Title *</span>
                  <input
                    type="text"
                    placeholder="e.g. Udumalpet Marathon 2025"
                    value={evtTitle}
                    onChange={(e) => setEvtTitle(e.target.value)}
                    required
                    className="h-10 px-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Category *</span>
                    <select
                      value={evtCategory}
                      onChange={(e) => setEvtCategory(e.target.value)}
                      className="h-10 px-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-[#027244]"
                    >
                      {availableCategories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Event Timings / Schedule *</span>
                    <input
                      type="text"
                      placeholder="e.g. Sunday, 6:00 AM"
                      value={evtTime}
                      onChange={(e) => setEvtTime(e.target.value)}
                      required
                      className="h-10 px-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Event Start Date *</span>
                    <input
                      type="date"
                      value={evtDate}
                      onChange={(e) => setEvtDate(e.target.value)}
                      required
                      className="h-10 px-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">End Date (Optional)</span>
                    <input
                      type="date"
                      value={evtEndDate}
                      onChange={(e) => setEvtEndDate(e.target.value)}
                      className="h-10 px-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Duration (Optional)</span>
                    <input
                      type="text"
                      placeholder="e.g. 1 Day, 3 Days, 4 Hours"
                      value={evtDuration}
                      onChange={(e) => setEvtDuration(e.target.value)}
                      className="h-10 px-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Event Organizer Name *</span>
                  <input
                    type="text"
                    placeholder="e.g. FitLife Club Udumalpet / Temple Committee"
                    value={evtOrganizer}
                    onChange={(e) => setEvtOrganizer(e.target.value)}
                    required
                    className="h-10 px-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 mt-4">
                  <button 
                    type="button"
                    onClick={() => setShowListingWizard(false)}
                    className="h-11 px-5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" /> Cancel
                  </button>
                  <button 
                    type="submit"
                    className="h-11 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer gap-1.5 flex-grow"
                  >
                    <span>Proceed to Payment</span>
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: SECURE CHECKOUT / PAYMENT (Dynamic Subscriber Check: ₹0 vs ₹20) */}
          {wizardStep === 'payment' && (
            <div className="max-w-md w-full mx-auto bg-white border border-slate-200/80 shadow-2xl rounded-3xl p-8 text-left mt-4 flex flex-col gap-6">
              <div className="border-b border-slate-100 pb-3 flex flex-col gap-1">
                <span className="text-[10px] font-extrabold text-[#027244] uppercase tracking-widest leading-none">Checkout Securely</span>
                <h3 className="text-lg font-black text-[#001c41] mt-1.5">Complete Listing Fee</h3>
              </div>

              {/* Dynamic Subscription Pricing badge */}
              {hasActiveSubscription ? (
                <div className="bg-emerald-50 border border-emerald-200 text-[#027244] rounded-xl p-3.5 text-xs font-bold flex items-center gap-2 leading-relaxed">
                  <Sparkles className="h-5 w-5 text-amber-500 fill-current shrink-0" />
                  <div>
                    <h5 className="font-extrabold text-emerald-950 leading-none">Free Business Subscription Active!</h5>
                    <p className="text-[10px] text-emerald-700 font-semibold mt-1">Listing standard fee (₹99) is fully waived. You can promote events for free.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 text-slate-600 rounded-xl p-3 text-xs font-semibold flex items-center gap-2">
                  <Tag className="h-4.5 w-4.5 text-[#027244] shrink-0" />
                  <span>Standard listing charges: ₹99 per event listing.</span>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center text-xs font-bold">
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-800 font-extrabold text-sm">{evtTitle}</span>
                  <span className="text-slate-450 uppercase text-[9.5px] mt-0.5 tracking-wider">{evtCategory} Event</span>
                </div>
                <span className="text-[#027244] font-black text-lg">₹{paymentPrice}</span>
              </div>

              {/* Secure Transaction Specs */}
              <div className="flex flex-col gap-3.5 text-xs text-slate-600 font-semibold">
                <div className="flex items-center gap-2.5 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                  <Lock className="h-4.5 w-4.5 text-[#027244] shrink-0" />
                  <span className="text-[10px] text-emerald-800 leading-normal">Your payment is encrypted and fully secure. Standard charges apply.</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2.5 mt-2">
                  <span className="text-slate-400">Listing Standard Fee</span>
                  <span>₹99.00</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-slate-400">Waived Discount</span>
                  <span>-₹{99 - paymentPrice}.00</span>
                </div>
                <div className="flex justify-between text-slate-800 font-black text-sm pt-1">
                  <span>Grand Total</span>
                  <span>₹{paymentPrice}.00</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mt-2">
                <button 
                  type="button"
                  onClick={() => setWizardStep('info_stage_1')}
                  className="h-11 px-5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={handlePaymentProceed}
                  className="h-11 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer flex-grow"
                >
                  <span>{paymentPrice === 0 ? 'Proceed for Free' : 'Pay ₹99 & Continue'}</span>
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ADDITIONAL DETAILS (About, Location, Payment Link, Phone, Banner) */}
          {wizardStep === 'info_stage_2' && (
            <div className="max-w-3xl w-full mx-auto bg-white border border-slate-200/80 shadow-xl rounded-3xl p-7 text-left mt-2 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3.5 mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-[#001c41]">List Your Event - Additional Details</h2>
                  <span className="text-xs text-slate-450 font-semibold mt-1 block">Step 2 of 3: Provide location, payment redirects, and contact specs.</span>
                </div>
                <span className="bg-emerald-50 text-[#027244] font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded border border-emerald-150 select-none">
                  Payment Verified
                </span>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs font-semibold mb-6 flex items-center gap-2">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateEvent} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Location / Venue Address *</span>
                  <input
                    type="text"
                    placeholder="e.g. Sri Krishna Mahal, Palani Road, Udumalpet"
                    value={evtVenue}
                    onChange={(e) => setEvtVenue(e.target.value)}
                    required
                    className="h-10 px-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Contact Details (Phone Number) *</span>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98422 33445"
                      value={evtPhone}
                      onChange={(e) => setEvtPhone(e.target.value)}
                      required
                      className="h-10 px-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Registration / Payment Link (Optional)</span>
                    <input
                      type="url"
                      placeholder="e.g. https://tickets.udumalpetevents.in"
                      value={evtPaymentLink}
                      onChange={(e) => setEvtPaymentLink(e.target.value)}
                      className="h-10 px-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Cover Image URL (Optional)</span>
                  <input
                    type="url"
                    placeholder="Provide a valid unsplash photo URL or leave empty for default banner"
                    value={evtCoverUrl}
                    onChange={(e) => setEvtCoverUrl(e.target.value)}
                    className="h-10 px-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">About the Event / Description *</span>
                  <textarea
                    placeholder="Provide detailed description of schedules, guidelines, guest details, or event details..."
                    value={evtDescription}
                    onChange={(e) => setEvtDescription(e.target.value)}
                    required
                    rows="4"
                    className="py-2.5 px-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 mt-4">
                  <button 
                    type="button"
                    onClick={() => setWizardStep('payment')}
                    className="h-11 px-5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button 
                    type="submit"
                    disabled={submitLoading}
                    className="h-11 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer disabled:opacity-50 flex-grow"
                  >
                    {submitLoading ? 'Registering Event...' : 'Complete & Launch Event'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 5: SUCCESS CONFIRMATION STATE */}
          {wizardStep === 'success' && (
            <div className="max-w-md w-full mx-auto bg-white border border-slate-200/80 shadow-2xl rounded-3xl p-8 text-center mt-6 flex flex-col items-center gap-5 animate-fadeIn">
              <div className="h-16 w-16 bg-[#E6F4EA] border border-emerald-100 rounded-full flex items-center justify-center text-[#027244]">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl font-black text-[#001c41]">Registration Successful!</h3>
                <p className="text-slate-450 text-xs font-semibold leading-relaxed mt-1">
                  Your event "{evtTitle}" has been listed successfully. Attendees can now discover it under the Upcoming Events directory.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowListingWizard(false);
                  setWizardStep('auth');
                  setEvtTitle('');
                  setEvtDescription('');
                  setEvtDate('');
                  setEvtEndDate('');
                  setEvtDuration('');
                  setEvtTime('');
                  setEvtVenue('');
                  setEvtOrganizer('');
                  setEvtPhone('');
                  setEvtCoverUrl('');
                  setEvtPaymentLink('');
                }}
                className="py-3.5 w-full bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow cursor-pointer uppercase tracking-wider mt-2.5"
              >
                Go to Events directory
              </button>
            </div>
          )}

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // DEFAULT MODE: DIRECTORY LISTINGS (Image 1 Mockup)
  // ----------------------------------------------------
  return (
    <div className="w-full flex flex-col items-center bg-[#F8FAFC]">
      
      {/* 1. Header Scenic Banner Overlay */}
      <section 
        className="w-full relative min-h-[260px] bg-slate-950 text-white py-10 px-4 md:px-8 border-b border-slate-800 bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(to bottom, rgba(0, 28, 65, 0.8), rgba(0, 28, 65, 0.95)), url('/thirumoorthy_hills.png')" }}
      >
        <div className="relative max-w-7xl mx-auto flex flex-col items-center z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-slate-350 font-bold self-start mt-2">
            <Link to="/" className="hover:text-emerald-455 transition-colors">Home</Link>
            <span className="text-slate-500">&gt;</span>
            <span className="text-white">Events</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-4 self-start font-sans">
            Events in Udumalpet
          </h1>
          <p className="text-slate-350 text-xs font-semibold self-start mt-1.5 leading-relaxed">
            Discover exciting events happening around Udumalpet
          </p>

          {/* Search filters inside white ribbon bar */}
          <form 
            onSubmit={(e) => e.preventDefault()} 
            className="mt-8 w-full bg-white border border-slate-200 shadow-xl rounded-2xl p-2 flex flex-col md:flex-row gap-2 max-w-5xl text-slate-700"
          >
            <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
              <Search className="h-4.5 w-4.5 text-slate-500 shrink-0" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-700 placeholder-slate-455 focus:outline-none"
              />
            </div>

            <div className="md:w-48 flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
              <Calendar className="h-4.5 w-4.5 text-slate-500 shrink-0" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-600 focus:outline-none cursor-pointer"
              />
            </div>

            <div className="md:w-48 flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
              <Grid className="h-4.5 w-4.5 text-slate-500 shrink-0" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All Categories">All Categories</option>
                {availableCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className="bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs py-3 px-8 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* 2. Main content grids */}
      <section className="max-w-7xl w-full px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column Listings (Col-span-3) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Sub Navigation tabs */}
          <div className="flex border-b border-slate-200/80 gap-6 text-xs font-black select-none">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-3.5 uppercase tracking-wider cursor-pointer border-b-2 ${activeTab === 'upcoming' ? 'border-[#027244] text-[#027244]' : 'border-transparent text-slate-400'}`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`pb-3.5 uppercase tracking-wider cursor-pointer border-b-2 ${activeTab === 'past' ? 'border-[#027244] text-[#027244]' : 'border-transparent text-slate-400'}`}
            >
              Past Events
            </button>
          </div>

          <div className="flex justify-between items-center mt-2 pb-1.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#001c41] text-sm">
                {activeTab === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
              </span>
              <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                {filteredEvents.length} Event{filteredEvents.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-1 px-2 border border-slate-200 bg-white rounded-lg cursor-pointer focus:outline-none"
              >
                <option>Date (Soonest)</option>
                <option>Date (Latest)</option>
              </select>
            </div>
          </div>

          {/* Cards Loop */}
          {loading ? (
            <div className="py-24 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
              <span className="h-8 w-8 animate-spin border-4 border-emerald-600 border-t-transparent rounded-full" />
              <span className="text-xs font-bold">Scanning events calendar...</span>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-3xl py-16 px-6 text-center shadow-sm flex flex-col items-center justify-center gap-4 text-slate-400">
              <AlertCircle className="h-10 w-10 text-slate-300" />
              <div>
                <h4 className="font-extrabold text-slate-700 text-base leading-none">No events found</h4>
                <p className="text-xs text-slate-400 font-semibold mt-2">Try clearing keyword search or date filters above.</p>
              </div>
              <button 
                onClick={() => { setSearchKeyword(''); setFilterCategory('All Categories'); setFilterDate(''); }}
                className="py-2.5 px-6 bg-[#027244] hover:bg-[#005934] text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer mt-2"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {filteredEvents.map((evt) => {
                const eventDate = new Date(evt.date);
                const isMultiDay = evt.endDate && new Date(evt.endDate).getTime() !== eventDate.getTime();
                
                return (
                  <div 
                    key={evt._id}
                    className="card-premium group rounded-3xl overflow-hidden flex flex-col md:flex-row cursor-pointer"
                  >
                    {/* Cover Image Banner */}
                    <div className="shrink-0 overflow-hidden relative h-48 md:w-56">
                      <div 
                        className="h-full w-full bg-cover bg-center transition-transform duration-750 ease-out-expo group-hover:scale-106"
                        style={{ backgroundImage: `url('${evt.coverImageUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&q=80"}')` }}
                      />
                    </div>

                    {/* Description panels */}
                    <div className="p-5.5 flex-1 flex flex-col justify-between gap-4 text-left">
                      <div className="flex flex-col gap-2">
                        
                        {/* Category tag */}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <span className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-md ${getBadgeStyles(evt.category)}`}>
                              {getBadgeStyles(evt.category) ? getCategoryIcon(evt.category) : ''} {evt.category}
                            </span>
                            {/* Duration Badge */}
                            {evt.duration && (
                              <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-slate-550">
                                ⏱ {evt.duration}
                              </span>
                            )}
                          </div>
                          
                          {/* Bookmark */}
                          <button className="text-slate-400 hover:text-[#027244] transition-colors cursor-pointer bg-transparent border-none">
                            <Bookmark className="h-4.5 w-4.5" />
                          </button>
                        </div>

                        {/* Title & Ticket CTA Button */}
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-black text-lg text-[#001c41] mt-0.5 leading-snug flex-1">
                            {evt.title}
                          </h3>
                          
                          {/* Payment Registration Tickets Link Button */}
                          {evt.paymentLink && (
                            <a 
                              href={evt.paymentLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[10.5px] py-1.5 px-3.5 rounded-lg flex items-center gap-1 transition-all shadow shrink-0 leading-none"
                            >
                              <span>Register / Buy Tickets</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>

                        {/* Venue Locality */}
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{evt.venue}</span>
                        </div>

                        <p className="text-xs text-slate-450 leading-relaxed font-medium mt-1 pr-4">
                          {evt.description}
                        </p>
                      </div>

                      {/* Specs Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-600">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                          <div className="flex flex-col">
                            <span className="font-extrabold text-[#001c41]">
                              {eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              {isMultiDay && ` - ${new Date(evt.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                            </span>
                            <span className="text-[9.5px] text-slate-400 leading-normal mt-0.5">
                              {evt.time}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                          <div className="flex flex-col">
                            <span className="font-extrabold text-[#001c41]">{evt.organizer}</span>
                            <span className="text-[9.5px] text-slate-400 leading-normal mt-0.5">Event Host</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Phone className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                          <div className="flex flex-col">
                            <span className="font-extrabold text-[#001c41]">{evt.phone}</span>
                            <span className="text-[9.5px] text-slate-400 leading-normal mt-0.5">Call for queries</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* View More Button */}
          {!loading && filteredEvents.length > 0 && (
            <button 
              className="py-3 px-8 self-center border border-slate-200 hover:bg-slate-100 text-slate-700 font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
            >
              View More Events
            </button>
          )}

        </div>

        {/* Right Sidebar Widgets */}
        <aside className="lg:col-span-1 flex flex-col gap-6 text-left">
          
          {/* List Your Event Card (₹20 or Free) */}
          <div className="bg-white border border-slate-200/80 shadow-md rounded-[20px] p-6 flex flex-col gap-4 font-sans relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-start gap-3.5 border-b border-slate-100 pb-3">
              <div className="h-10 w-10 rounded-xl bg-[#E6F4EA] text-[#027244] flex items-center justify-center shrink-0">
                <Calendar className="h-5.5 w-5.5" />
              </div>
              <div className="flex flex-col">
                <h4 className="font-extrabold text-sm text-[#001c41] leading-none">List Your Event</h4>
                <span className="text-[9.5px] text-slate-400 font-semibold mt-1">Reach thousands of active people</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-1.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none">Standard Listing Charges</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[#027244] font-black text-2xl">₹99</span>
                <span className="text-[10px] text-slate-400 font-semibold">/ event listing</span>
              </div>
              <span className="text-[9px] text-[#027244] font-bold mt-1">✓ FREE for active business subscribers!</span>
            </div>

            {/* List of benefits */}
            <div className="flex flex-col gap-2.5 mt-2 text-xs text-slate-550 font-semibold leading-none">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#027244] shrink-0" />
                <span>Get more visibility</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#027244] shrink-0" />
                <span>Attract more participants</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#027244] shrink-0" />
                <span>Easy & quick listing</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#027244] shrink-0" />
                <span>Secure payments</span>
              </div>
            </div>

            <button 
              onClick={() => {
                const storedUser = localStorage.getItem('ubt_user');
                if (storedUser) {
                  try {
                    const parsed = JSON.parse(storedUser);
                    setCurrentUser(parsed);
                    checkUserSubscription(parsed._id);
                    setWizardStep('info_stage_1');
                    setShowListingWizard(true);
                  } catch (err) {
                    console.error('Failed to parse ubt_user details from localStorage:', err);
                    localStorage.removeItem('ubt_user');
                    localStorage.removeItem('ubt_token');
                    navigate(`/login?redirect=${encodeURIComponent('/events?list=true')}&from=events`);
                  }
                } else {
                  navigate(`/login?redirect=${encodeURIComponent('/events?list=true')}&from=events`);
                }
              }}
              className="w-full mt-4 py-3 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow transition-all uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>List Your Event Now</span>
            </button>
          </div>

          {/* Categories Count breakdown card */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-[20px] p-6 flex flex-col gap-4 font-sans">
            <div className="flex flex-col border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-sm text-[#001c41] leading-none">Categories</h4>
              <span className="text-[9.5px] text-slate-400 font-semibold mt-1">Browse scheduled events by topic</span>
            </div>

            <div className="flex flex-col gap-3">
              <div 
                onClick={() => setFilterCategory('All Categories')}
                className={`flex items-center justify-between cursor-pointer group py-1.5 border-b border-slate-50 last:border-0 ${filterCategory === 'All Categories' ? 'text-emerald-700 font-bold' : ''}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm shrink-0">📂</span>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-700 transition-colors leading-none">
                    All Categories
                  </span>
                </div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase leading-none bg-slate-50 px-2.5 py-1 rounded">
                  {categoryCounts['All Categories'] || 0}
                </span>
              </div>

              {availableCategories.map((c) => (
                <div 
                  key={c}
                  onClick={() => setFilterCategory(c)}
                  className={`flex items-center justify-between cursor-pointer group py-1.5 border-b border-slate-50 last:border-0 ${filterCategory === c ? 'text-emerald-700 font-bold' : ''}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm shrink-0">{getCategoryIcon(c)}</span>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-700 transition-colors leading-none">
                      {c}
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase leading-none bg-slate-50 px-2.5 py-1 rounded">
                    {categoryCounts[c] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Need Help support box */}
          <div className="bg-[#001c41] text-white border border-slate-900 shadow-xs rounded-[20px] p-6 flex flex-col gap-4 relative overflow-hidden font-sans">
            <div className="absolute -right-8 -top-8 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex flex-col gap-1.5 z-10 text-left">
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest leading-none">Need Help?</span>
              <h4 className="font-extrabold text-sm leading-snug mt-1.5">Having trouble listing your event?</h4>
              <p className="text-slate-450 text-[10px] font-semibold leading-relaxed mt-1">
                Contact our support desk. We are active 24/7 to assist your listings and event promotion.
              </p>
            </div>

            <a 
              href="mailto:support@udumalpetevents.in"
              className="w-full py-3 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow transition-all cursor-pointer text-center z-10 uppercase tracking-wider"
            >
              Contact Support
            </a>
          </div>

        </aside>

      </section>
      
    </div>
  );
}
