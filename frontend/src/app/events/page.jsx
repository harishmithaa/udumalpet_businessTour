import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, Calendar, MapPin, User, Phone, ShieldCheck, Bookmark, Sparkles, 
  Clock, Grid, ChevronRight, AlertCircle, ArrowLeft, CheckCircle2, MessageSquare, 
  Plus, Lock, PlusCircle, Check, DollarSign, ExternalLink, Tag, Heart, Trash2, Send, X,
  RefreshCw
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

export const getEventDefaultImage = (category) => {
  return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80';
};

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
  },
  {
    _id: 'evt_5',
    title: 'Udumalpet Badminton Championship 2025',
    category: 'Sports',
    description: 'Annual indoor singles & doubles championship for all age categories.',
    date: new Date('2025-08-12T09:00:00'),
    time: 'Tuesday, 9:00 AM',
    venue: 'Netaji Indoor Stadium, Udumalpet',
    organizer: 'Udumalpet Sports Academy',
    phone: '+91 99432 10987',
    price: 99,
    coverImageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80',
    paymentLink: '',
    duration: '2 Days'
  },
  {
    _id: 'evt_6',
    title: 'Kaniyur Football League 2025',
    category: 'Sports',
    description: 'Exciting regional 7-a-side football tournament featuring top local teams.',
    date: new Date('2025-09-18T15:30:00'),
    time: 'Thursday, 3:30 PM',
    venue: 'Kaniyur Grounds, Udumalpet',
    organizer: 'Kaniyur Sports Club',
    phone: '+91 98765 43210',
    price: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&q=80',
    paymentLink: '',
    duration: '3 Days'
  },
  {
    _id: 'evt_7',
    title: 'Pongal Thiruvizha Celebration',
    category: 'Festival',
    description: 'Traditional cultural dance, sports, pongal cooking contest, and village games.',
    date: new Date('2026-01-14T08:00:00'),
    endDate: new Date('2026-01-17T20:00:00'),
    time: 'Daily, 8:00 AM onwards',
    venue: 'Udumalpet Village Grounds',
    organizer: 'Tamil Cultural Association',
    phone: '+91 94433 55667',
    price: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500&q=80',
    paymentLink: '',
    duration: '4 Days'
  },
  {
    _id: 'evt_8',
    title: 'Mariamman Temple Car Festival',
    category: 'Festival',
    description: 'Magnificent chariot procession with traditional drums, lighting, and offerings.',
    date: new Date('2026-04-22T06:00:00'),
    time: 'Wednesday, 6:00 AM',
    venue: 'Mariamman Temple Street, Udumalpet',
    organizer: 'Temple Festival Committee',
    phone: '+91 95000 98765',
    price: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=500&q=80',
    paymentLink: '',
    duration: '1 Day'
  },
  {
    _id: 'evt_9',
    title: 'Deepavali Light & Food Festival',
    category: 'Festival',
    description: 'Fabulous lights showcase, local sweets exhibition, and firecracker evening show.',
    date: new Date('2025-11-01T17:00:00'),
    time: 'Saturday, 5:00 PM',
    venue: 'Municipality Ground, Udumalpet',
    organizer: 'Retailers Welfare League',
    phone: '+91 90420 11223',
    price: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1605847429054-9fa29c5a17ed?w=500&q=80',
    paymentLink: '',
    duration: '1 Evening'
  },
  {
    _id: 'evt_10',
    title: 'Udumalpet Agri & Poultry Expo',
    category: 'Business',
    description: 'B2B fair showcasing high-yielding farming machinery, seeds, and poultry tech.',
    date: new Date('2025-10-15T09:30:00'),
    endDate: new Date('2025-10-17T18:00:00'),
    time: 'Daily, 9:30 AM',
    venue: 'Venkateswara Hall, Udumalpet',
    organizer: 'Coimbatore Farmers Forum',
    phone: '+91 93600 22334',
    price: 99,
    coverImageUrl: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=500&q=80',
    paymentLink: 'https://tickets.udumalpetagriexpo.in',
    duration: '3 Days'
  },
  {
    _id: 'evt_11',
    title: 'Voice of Udumalpet Melody Night',
    category: 'Music',
    description: 'A grand light music concert performing retro and modern Tamil movie hits.',
    date: new Date('2025-08-20T18:00:00'),
    time: 'Wednesday, 6:00 PM',
    venue: 'Royal Palace Mahal, Udumalpet',
    organizer: 'Udumal Musicians Trust',
    phone: '+91 99944 88822',
    price: 99,
    coverImageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80',
    paymentLink: '',
    duration: '4 Hours'
  },
  {
    _id: 'evt_12',
    title: 'Higher Education & Career Expo',
    category: 'Education',
    description: 'Meet 50+ leading engineering, arts, and medical colleges for instant guidance.',
    date: new Date('2025-07-10T10:00:00'),
    time: 'Thursday, 10:00 AM',
    venue: 'KMR Hall, Udumalpet',
    organizer: 'Rotary Club of Udumalpet',
    phone: '+91 98650 33445',
    price: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80',
    paymentLink: '',
    duration: '1 Day'
  },
  {
    _id: 'evt_13',
    title: 'Free Cardiac & Eye Care Camp',
    category: 'Health',
    description: 'Expert diagnostics, BP/Sugar screening, and free consultations with specialists.',
    date: new Date('2025-09-05T08:30:00'),
    time: 'Friday, 8:30 AM',
    venue: 'Government High School, Udumalpet',
    organizer: 'Ganga Hospitals & Lions Club',
    phone: '+91 94420 88990',
    price: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&q=80',
    duration: '1 Day'
  },
  {
    _id: 'evt_14',
    title: 'Flower Show & Garden Competition',
    category: 'Others',
    description: 'Spectacular floral displays, rare bonsai models, and nursery seeds marketplace.',
    date: new Date('2026-01-05T09:00:00'),
    time: 'Monday, 9:00 AM',
    venue: 'Mullai Nursery Farms, Udumalpet',
    organizer: 'Udumal Horti League',
    phone: '+91 91760 44332',
    price: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=500&q=80',
    duration: '1 Day'
  }
];

export const formatEventDateRange = (startDate, endDate) => {
  if (!startDate) return 'N/A';
  const startStr = new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  if (!endDate) return startStr;
  const endStr = new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  if (startStr === endStr) return startStr;
  return `${startStr} - ${endStr}`;
};

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
  const [customCategory, setCustomCategory] = useState('');
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
  const [evtPrice, setEvtPrice] = useState(0);

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
  const [registeredEvent, setRegisteredEvent] = useState(null);

  // Comments and Likes state variables
  const [guestName, setGuestName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [activeCommentsEvent, setActiveCommentsEvent] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    setVisibleCount(3);
  }, [searchKeyword, filterCategory, filterDate, activeTab]);

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
        // Combine fetched events with mockup mock events so the user always has a rich directory to view!
        const fetchedIds = new Set((data.data || []).map(item => item._id));
        const nonDuplicateMock = mockEvents.filter(mock => !fetchedIds.has(mock._id));
        const combined = [...(data.data || []), ...nonDuplicateMock];
        setEvents(combined);
        calculateCounts(combined);
      } else {
        setEvents(mockEvents);
        calculateCounts(mockEvents);
      }
    } catch (err) {
      console.warn('API Offline, using realistic mock events fallbacks');
      setEvents(mockEvents);
      calculateCounts(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (eventId) => {
    try {
      const token = localStorage.getItem('ubt_token');
      const guestId = localStorage.getItem('ubt_guest_id') || 'guest_' + Math.random().toString(36).substr(2, 9);
      if (!localStorage.getItem('ubt_guest_id')) {
        localStorage.setItem('ubt_guest_id', guestId);
      }
      
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ guestId })
      });
      const data = await res.json();
      if (data.success) {
        setEvents(prev => prev.map(e => e._id === eventId ? { ...e, likes: data.data } : e));
        if (activeCommentsEvent && activeCommentsEvent._id === eventId) {
          setActiveCommentsEvent(prev => ({ ...prev, likes: data.data }));
        }
      }
    } catch (err) {
      // Offline fallback toggle
      const identifier = currentUser ? currentUser._id : (localStorage.getItem('ubt_guest_id') || 'guest_unknown');
      setEvents(prev => prev.map(e => {
        if (e._id !== eventId) return e;
        const currentLikes = e.likes || [];
        const index = currentLikes.indexOf(identifier);
        const nextLikes = index === -1 ? [...currentLikes, identifier] : currentLikes.filter(l => l !== identifier);
        return { ...e, likes: nextLikes };
      }));
      if (activeCommentsEvent && activeCommentsEvent._id === eventId) {
        setActiveCommentsEvent(prev => {
          const currentLikes = prev.likes || [];
          const index = currentLikes.indexOf(identifier);
          const nextLikes = index === -1 ? [...currentLikes, identifier] : currentLikes.filter(l => l !== identifier);
          return { ...prev, likes: nextLikes };
        });
      }
    }
  };

  const isLikedByUser = (evt) => {
    if (!evt.likes) return false;
    const identifier = currentUser ? currentUser._id : localStorage.getItem('ubt_guest_id');
    return evt.likes.includes(identifier);
  };

  const openEventCommentsModal = (evt) => {
    navigate(`/events/${evt._id}`);
  };

  const handleAddComment = async (e, eventId) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentLoading(true);

    try {
      const token = localStorage.getItem('ubt_token');
      const finalUserName = currentUser ? (currentUser.fullName || currentUser.name) : (guestName.trim() || 'Anonymous Visitor');
      
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          text: commentText,
          userName: finalUserName
        })
      });
      const data = await res.json();
      if (data.success) {
        setEvents(prev => prev.map(evt => evt._id === eventId ? { ...evt, comments: data.data } : evt));
        // Update active comments event detail state
        setActiveCommentsEvent(prev => ({ ...prev, comments: data.data }));
        setCommentText('');
      } else {
        alert(data.message || 'Failed to add comment.');
      }
    } catch (err) {
      // Offline fallback
      const mockComment = {
        _id: 'comment_' + Math.random().toString(36).substr(2, 9),
        userName: currentUser ? (currentUser.fullName || currentUser.name) : (guestName.trim() || 'Anonymous Visitor'),
        text: commentText,
        user: currentUser ? currentUser._id : undefined,
        createdAt: new Date()
      };
      setEvents(prev => prev.map(evt => {
        if (evt._id !== eventId) return evt;
        const nextComments = [...(evt.comments || []), mockComment];
        return { ...evt, comments: nextComments };
      }));
      setActiveCommentsEvent(prev => {
        const nextComments = [...(prev.comments || []), mockComment];
        return { ...prev, comments: nextComments };
      });
      setCommentText('');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentDelete = async (eventId, commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const token = localStorage.getItem('ubt_token');
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setEvents(prev => prev.map(evt => evt._id === eventId ? { ...evt, comments: data.data } : evt));
        setActiveCommentsEvent(prev => ({ ...prev, comments: data.data }));
      } else {
        alert(data.message || 'Failed to delete comment.');
      }
    } catch (err) {
      // Offline fallback
      setEvents(prev => prev.map(evt => {
        if (evt._id !== eventId) return evt;
        const nextComments = (evt.comments || []).filter(c => c._id !== commentId);
        return { ...evt, comments: nextComments };
      }));
      setActiveCommentsEvent(prev => {
        const nextComments = (prev.comments || []).filter(c => c._id !== commentId);
        return { ...prev, comments: nextComments };
      });
    }
  };

  const canDeleteComment = (comment, evt) => {
    if (!currentUser) return false;
    if (['admin', 'superadmin'].includes(currentUser.role)) return true;
    if (comment.user && comment.user.toString() === currentUser._id.toString()) return true;
    if (evt.ownerId && evt.ownerId.toString() === currentUser._id.toString()) return true;
    return false;
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
  const handleStage1Submit = async (e) => {
    e.preventDefault();
    const finalCategory = evtCategory === 'Others' ? (customCategory.trim() || 'Others') : evtCategory;
    if (!evtTitle || !finalCategory || !evtDate || !evtEndDate || !evtOrganizer) {
      setErrorMsg('Please fill in all mandatory fields');
      return;
    }
    setErrorMsg('');
    setSubmitLoading(true);

    try {
      const token = localStorage.getItem('ubt_token');
      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: evtTitle,
          category: finalCategory,
          date: evtDate,
          endDate: evtEndDate,
          duration: evtDuration || undefined,
          time: 'TBD',
          organizer: evtOrganizer,
          price: 0,
          paymentLink: ''
        })
      });
      const data = await res.json();
      if (data.success) {
        setRegisteredEvent(data.data);
        setWizardStep('payment');
      } else {
        throw new Error(data.message || 'Failed to submit event');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during submission');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEventPaymentCheckout = async (evtId) => {
    setSubmitLoading(true);
    setErrorMsg('');
    const activeToken = localStorage.getItem('ubt_token');
    
    try {
      const orderRes = await fetch('http://localhost:5000/api/payments/create-event-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ eventId: evtId }),
      });
      const orderData = await orderRes.json();
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      if (orderData.amount === 0 || orderData.orderId === 'free_listing') {
        const verifyRes = await fetch('http://localhost:5000/api/payments/verify-event-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeToken}`,
          },
          body: JSON.stringify({
            eventId: evtId,
            razorpayOrderId: 'free_listing',
            razorpayPaymentId: 'pay_free_waived',
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setWizardStep('pending_approval_success');
        } else {
          throw new Error(verifyData.message || 'Sandbox payment verification failed.');
        }
      } else {
        const isRazorpayScriptLoaded = () => {
          return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        await isRazorpayScriptLoaded();

        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Udumalpet Business Tour',
          description: 'Event Listing Fee',
          order_id: orderData.orderId,
          handler: async function (response) {
            try {
              setSubmitLoading(true);
              const verifyRes = await fetch('http://localhost:5000/api/payments/verify-event-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${activeToken}`,
                },
                body: JSON.stringify({
                  eventId: evtId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                setWizardStep('pending_approval_success');
              } else {
                setErrorMsg('Payment verification failed.');
              }
            } catch (err) {
              setErrorMsg('Signature verification connection failed.');
            } finally {
              setSubmitLoading(false);
            }
          },
          prefill: {
            name: currentUser?.fullName || '',
            email: currentUser?.email || '',
            contact: currentUser?.mobileNumber || '',
          },
          theme: {
            color: '#027244',
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      }
    } catch (err) {
      console.warn('Razorpay popup blocked/failed, using Sandbox payment verification fallback...', err);
      try {
        const mockOrderId = 'order_mock_' + Math.random().toString(36).substr(2, 9);
        const mockPaymentId = 'pay_mock_' + Math.random().toString(36).substr(2, 9);
        
        const verifyRes = await fetch('http://localhost:5000/api/payments/verify-event-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeToken}`,
          },
          body: JSON.stringify({
            eventId: evtId,
            razorpayOrderId: mockOrderId,
            razorpayPaymentId: mockPaymentId,
            razorpaySignature: '',
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setWizardStep('pending_approval_success');
        } else {
          throw new Error(verifyData.message || 'Sandbox verification failed.');
        }
      } catch (mockErr) {
        setErrorMsg('Sandbox payment verification failed.');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEventPaymentSkip = async (evtId) => {
    setSubmitLoading(true);
    setErrorMsg('');
    const activeToken = localStorage.getItem('ubt_token');
    
    try {
      const verifyRes = await fetch('http://localhost:5000/api/payments/verify-event-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`,
        },
        body: JSON.stringify({
          eventId: evtId,
          razorpayOrderId: 'order_mock_skip_' + Math.random().toString(36).substr(2, 9),
          razorpayPaymentId: 'pay_mock_skip_' + Math.random().toString(36).substr(2, 9),
        }),
      });
      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setWizardStep('pending_approval_success');
      } else {
        setErrorMsg('Payment verification failed.');
      }
    } catch (err) {
      console.warn('Network error during skip, performing mock success transition...', err);
      setWizardStep('pending_approval_success');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Successful payment transitions
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
          endDate: evtEndDate,
          duration: evtDuration || undefined,
          time: evtTime,
          venue: evtVenue,
          organizer: evtOrganizer,
          phone: evtPhone,
          coverImageUrl: evtCoverUrl,
          paymentLink: evtPaymentLink,
          price: evtPrice
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
        coverImageUrl: evtCoverUrl || getEventDefaultImage(evtCategory),
        paymentLink: evtPaymentLink,
        price: evtPrice
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

                {evtCategory === 'Others' && (
                  <div className="flex flex-col gap-1 mt-1 animate-fadeIn">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Custom Category Name *</span>
                    <input
                      type="text"
                      placeholder="e.g. Workshop, Seminar, Expo"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      required
                      className="h-10 px-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                    />
                  </div>
                )}

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
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Event End Date *</span>
                    <input
                      type="date"
                      value={evtEndDate}
                      onChange={(e) => setEvtEndDate(e.target.value)}
                      required
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
                    disabled={submitLoading}
                    className="h-11 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer gap-1.5 flex-grow disabled:opacity-60"
                  >
                    <span>{submitLoading ? 'Submitting...' : 'Proceed to Payment'}</span>
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP: PENDING REVIEW SUCCESS MESSAGE */}
          {wizardStep === 'pending_approval_success' && (
            <div className="max-w-md w-full mx-auto bg-white border border-slate-200/80 shadow-2xl rounded-3xl p-8 text-center mt-6 flex flex-col items-center gap-5 animate-fadeIn">
              <div className="h-16 w-16 bg-[#FFF9E6] border border-amber-250 rounded-full flex items-center justify-center text-amber-600">
                <Clock className="h-10 w-10 animate-pulse" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-black text-[#001c41]">Submitted for Approval!</h3>
                <p className="text-slate-500 text-xs font-semibold leading-relaxed text-left">
                  Your event <strong>"{evtTitle}"</strong> has been successfully submitted to the admin queue.
                </p>
                <p className="text-slate-400 text-[11px] leading-relaxed text-left mt-1.5 font-sans">
                  Your payment has been received and verified successfully! Your event is now submitted to the admin queue for review. Once the administrator approves it, you will see it in your dashboard under the **Events** tab. From there, you can complete the final details like location address, contact phone, cover picture, and description to publish it live!
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
                  setEvtPrice(0);
                }}
                className="py-3.5 w-full bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow cursor-pointer uppercase tracking-wider mt-2.5"
              >
                Go to Events directory
              </button>
            </div>
          )}

          {/* STEP 3: SECURE CHECKOUT / PAYMENT (Dynamic Subscriber Check: ₹0 vs ₹99) */}
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
                  className="h-11 px-4 border border-slate-350 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => handleEventPaymentSkip(registeredEvent?._id)}
                  disabled={submitLoading}
                  className="h-11 px-4 bg-amber-50 hover:bg-amber-100 border border-amber-250 text-amber-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Skip Now
                </button>
                <button
                  onClick={() => handleEventPaymentCheckout(registeredEvent?._id)}
                  disabled={submitLoading}
                  className="h-11 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer flex-grow disabled:opacity-50"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Registration Fee / Ticket Price (₹) *</span>
                    <input
                      type="number"
                      min="0"
                      value={evtPrice}
                      onChange={(e) => setEvtPrice(Number(e.target.value))}
                      placeholder="e.g. 0 for Free, 150 for Entry Ticket"
                      required
                      className="h-10 px-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Event Timings / Schedule *</span>
                    <input
                      type="text"
                      value={evtTime}
                      onChange={(e) => setEvtTime(e.target.value)}
                      placeholder="e.g. Sunday, 6:00 AM"
                      required
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
                  setEvtPrice(0);
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
            <div className="flex-1 flex items-center justify-between gap-2.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
              <input
                type="text"
                placeholder="Search events..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-700 placeholder-slate-455 focus:outline-none"
              />
              <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            </div>

            <div className="md:w-48 flex items-center justify-between gap-2.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 relative">
              <input
                type={filterDate ? "date" : "text"}
                placeholder="Select Date"
                value={filterDate}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => { if (!filterDate) e.target.type = "text"; }}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-650 focus:outline-none cursor-pointer placeholder-slate-455"
              />
              <Calendar className="h-4.5 w-4.5 text-slate-400 shrink-0 pointer-events-none" />
            </div>

            <div className="md:w-48 flex items-center justify-between gap-2.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer appearance-none pr-8 bg-transparent"
              >
                <option value="All Categories">All Categories</option>
                {availableCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
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
              <span className="bg-emerald-50 text-[#027244] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-100 shadow-xs">
                {filteredEvents.length} Event{filteredEvents.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-650 relative">
              <span>Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="py-1 px-3.5 pr-8 border border-slate-200 bg-white rounded-lg cursor-pointer focus:outline-none font-bold text-slate-700 appearance-none bg-transparent"
                >
                  <option>Date (Soonest)</option>
                  <option>Date (Latest)</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
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
              {filteredEvents.slice(0, visibleCount).map((evt) => {
                const eventDate = new Date(evt.date);
                const isMultiDay = evt.endDate && new Date(evt.endDate).getTime() !== eventDate.getTime();
                
                return (
                  <div 
                    key={evt._id}
                    className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden flex flex-col md:flex-row p-4 gap-6 transition-all duration-300 hover:shadow-md hover:border-slate-200/80"
                  >
                    {/* Cover Image Container */}
                    <div className="shrink-0 overflow-hidden relative h-40 w-full md:w-52 rounded-2xl bg-slate-50 border border-slate-100">
                      <div 
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${evt.coverImageUrl || getEventDefaultImage(evt.category)}')` }}
                      />
                    </div>

                    {/* Middle-Left Content Panel */}
                    <div className="flex-1 flex flex-col justify-between gap-3 text-left">
                      <div className="flex flex-col gap-2">
                        
                        {/* Category tag */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-md ${getBadgeStyles(evt.category)}`}>
                            {getCategoryIcon(evt.category)} {evt.category}
                          </span>
                          {evt.duration && (
                            <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-slate-550">
                              ⏱ {evt.duration}
                            </span>
                          )}
                          <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-md text-[#027244]">
                            {evt.price === 0 ? 'FREE' : `₹${evt.price}`}
                          </span>
                          {new Date(evt.endDate || evt.date) < new Date() && (
                            <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 bg-red-50 border border-red-200 rounded-md text-red-700">
                              Expired
                            </span>
                          )}
                          {evt.paymentLink && (
                            <a 
                              href={evt.paymentLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-50 border border-emerald-250 text-[#027244] hover:bg-emerald-100 rounded-md flex items-center gap-1 transition-colors leading-none"
                            >
                              <span>Tickets</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="font-extrabold text-base text-[#001c41] leading-snug">
                          {evt.title}
                        </h3>

                        {/* Venue locality */}
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{evt.venue}</span>
                        </div>

                        <p className="text-xs text-slate-450 leading-relaxed font-medium mt-1 pr-4">
                          {evt.description}
                        </p>
                      </div>

                      {/* Interactive Likes & Comments Bar */}
                      <div className="flex gap-4 border-t border-slate-100 pt-3 mt-1 text-[11px] font-black text-slate-455">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleToggleLike(evt._id); }}
                          className={`flex items-center gap-1 bg-transparent border-none cursor-pointer hover:text-red-550 transition-colors ${
                            isLikedByUser(evt) ? 'text-red-550' : 'text-slate-450'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${isLikedByUser(evt) ? 'fill-current text-red-550' : ''}`} />
                          <span>{evt.likes ? evt.likes.length : 0} Likes</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); openEventCommentsModal(evt); }}
                          className="flex items-center gap-1 bg-transparent border-none cursor-pointer hover:text-[#027244] text-slate-455 transition-colors"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>{evt.comments ? evt.comments.length : 0} Comments</span>
                        </button>
                        {evt.businessId && (
                          <div className="ml-auto">
                            <Link 
                              to={`/businesses/${evt.businessId._id || evt.businessId}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-[#027244] hover:text-[#005934] hover:underline flex items-center gap-1 leading-none font-bold"
                            >
                              <User className="h-3.5 w-3.5" />
                              <span>View Profile</span>
                            </Link>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Middle-Right Specs Section */}
                    <div className="w-full md:w-64 shrink-0 flex flex-col justify-center gap-3.5 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 text-xs font-semibold text-slate-650 text-left">
                      
                      <div className="flex items-start gap-2.5">
                        <Calendar className="h-4.5 w-4.5 text-[#027244] shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 font-sans">
                            {eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {isMultiDay && ` - ${new Date(evt.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">
                            {evt.time}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <User className="h-4.5 w-4.5 text-[#027244] shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{evt.organizer}</span>
                          <span className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">
                            Event Host
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Phone className="h-4.5 w-4.5 text-[#027244] shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{evt.phone}</span>
                          <span className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">
                            Call for queries
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Right Action Section */}
                    <div className="w-full md:w-36 shrink-0 flex flex-col items-stretch md:items-end justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); openEventCommentsModal(evt); }}
                        className="w-full border border-emerald-600 hover:bg-emerald-50 text-[#027244] font-extrabold text-xs py-2 px-4 rounded-xl transition-all text-center cursor-pointer shadow-xs"
                      >
                        View Details
                      </button>

                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleLike(evt._id); }}
                        className={`self-center md:self-end p-2 border hover:bg-slate-50 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                          isLikedByUser(evt) ? 'text-[#027244] border-emerald-200 bg-emerald-50/50' : 'text-slate-400 border-slate-200'
                        }`}
                      >
                        <Bookmark className={`h-4.5 w-4.5 ${isLikedByUser(evt) ? 'fill-current' : ''}`} />
                      </button>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* View More Button */}
          {!loading && filteredEvents.length > visibleCount && (
            <button 
              onClick={() => setVisibleCount(prev => prev + 3)}
              className="py-3 px-8 self-center border border-slate-200 hover:bg-slate-100 text-slate-700 font-extrabold text-xs rounded-xl transition-colors cursor-pointer mt-2"
            >
              View More Events
            </button>
          )}

        </div>

        {/* Right Sidebar Widgets */}
        <aside className="lg:col-span-1 flex flex-col gap-6 text-left">
          
          {/* List Your Event Card (₹99 or Free) */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-[#027244] border border-emerald-100 flex items-center justify-center shrink-0">
                <Calendar className="h-5.5 w-5.5" />
              </div>
              <div className="flex flex-col">
                <h4 className="font-extrabold text-base text-[#001c41] leading-none">List Your Event</h4>
                <span className="text-[10px] text-slate-450 font-semibold mt-1.5 leading-normal">
                  Reach thousands of people in Udumalpet. List your event for just
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-[#027244] font-black text-3xl">₹99</span>
              <span className="text-[10px] text-slate-400 font-semibold">/ listing</span>
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
              className="w-full py-3 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>List Your Event Now</span>
            </button>

            {/* Checklist of benefits */}
            <div className="flex flex-col gap-2.5 mt-2 border-t border-slate-100 pt-4 text-xs text-slate-550 font-semibold">
              <div className="flex items-center gap-2">
                <div className="h-4.5 w-4.5 rounded-full bg-emerald-50 text-[#027244] flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span>Get more visibility</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4.5 w-4.5 rounded-full bg-emerald-50 text-[#027244] flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span>Attract more participants</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4.5 w-4.5 rounded-full bg-emerald-50 text-[#027244] flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span>Easy & quick listing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4.5 w-4.5 rounded-full bg-emerald-50 text-[#027244] flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span>Secure payments</span>
              </div>
            </div>
          </div>

          {/* Categories Count breakdown card */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-3">
              <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-500 border border-slate-200/60 flex items-center justify-center shrink-0">
                <Grid className="h-5.5 w-5.5" />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="font-extrabold text-base text-[#001c41] leading-none">Categories</h4>
                <span className="text-[10px] text-slate-400 font-semibold mt-1">Browse scheduled events by topic</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              {/* All Categories Item */}
              <div 
                onClick={() => setFilterCategory('All Categories')}
                className={`flex items-center justify-between cursor-pointer group py-2.5 px-3 rounded-xl transition-all duration-200 ${
                  filterCategory === 'All Categories' 
                    ? 'bg-emerald-50 text-[#027244]' 
                    : 'hover:bg-slate-50 text-slate-650'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm shrink-0">📂</span>
                  <span className="text-xs font-bold leading-none">
                    All Categories
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-black leading-none ${
                    filterCategory === 'All Categories' ? 'text-[#027244]' : 'text-slate-400'
                  }`}>
                    {categoryCounts['All Categories'] || 0}
                  </span>
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    filterCategory === 'All Categories' ? 'text-[#027244] translate-x-0.5' : 'text-slate-355'
                  }`} />
                </div>
              </div>

              {availableCategories.map((c) => (
                <div 
                  key={c}
                  onClick={() => setFilterCategory(c)}
                  className={`flex items-center justify-between cursor-pointer group py-2.5 px-3 rounded-xl transition-all duration-200 ${
                    filterCategory === c 
                      ? 'bg-emerald-50 text-[#027244]' 
                      : 'hover:bg-slate-50 text-slate-650'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm shrink-0">{getCategoryIcon(c)}</span>
                    <span className="text-xs font-bold leading-none">
                      {c}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-black leading-none ${
                      filterCategory === c ? 'text-[#027244]' : 'text-slate-400'
                    }`}>
                      {categoryCounts[c] || 0}
                    </span>
                    <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      filterCategory === c ? 'text-[#027244] translate-x-0.5' : 'text-slate-355'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Need Help support box */}
          <div className="bg-white border border-[#E0E7FF] shadow-sm rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-[#6366F1] border border-indigo-100 flex items-center justify-center shrink-0">
                <Phone className="h-5.5 w-5.5" />
              </div>
              <div className="flex flex-col">
                <h4 className="font-extrabold text-base text-[#001c41] leading-none">Need Help?</h4>
                <span className="text-[10px] text-slate-450 font-semibold mt-1.5 leading-normal">
                  Contact us if you need any help in listing your event.
                </span>
              </div>
            </div>

            <a 
              href="mailto:udumalpetbusinesstour@gmail.com"
              className="w-full py-3 border border-[#6366F1] text-[#6366F1] hover:bg-indigo-50 font-extrabold text-xs rounded-xl shadow-xs transition-all text-center uppercase tracking-wider cursor-pointer"
            >
              Contact Support
            </a>
          </div>

        </aside>

      </section>

    </div>
  );
}
