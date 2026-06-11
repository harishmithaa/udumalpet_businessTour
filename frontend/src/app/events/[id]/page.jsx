import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, User, Heart, MessageSquare, Clock, Send, Trash2, RefreshCw, AlertCircle, Share2, CheckCircle, MapPin, Phone, ExternalLink, Bookmark
} from 'lucide-react';

const mockEvents = [
  {
    _id: 'evt_1',
    title: 'Udumalpet Marathon 2025',
    category: 'Sports',
    description: 'Join us for a fitness-filled marathon event across beautiful routes in Udumalpet. Great way to experience Thirumoorthy Hills and surrounding rural landscapes while running with hundreds of active enthusiasts.',
    date: new Date('2025-05-25T06:00:00'),
    endDate: new Date('2025-05-25T18:00:00'),
    time: 'Sunday, 6:00 AM',
    venue: 'Udumalpet Town, Tamil Nadu',
    organizer: 'FitLife Club Udumalpet',
    phone: '+91 98945 67890',
    price: 99,
    coverImageUrl: 'https://images.unsplash.com/photo-1502224562085-639556652f33?w=800&q=80',
    paymentLink: 'https://tickets.udumalpetmarathon.in',
    duration: '1 Day',
    likes: [],
    comments: [],
    status: 'Approved'
  },
  {
    _id: 'evt_2',
    title: 'Arulmigu Subramanya Swamy Temple Festival',
    category: 'Festival',
    description: 'Annual temple festival with special poojas, processions and cultural programs. A holy celebration spanning multiple days with spiritual offerings and local fairs.',
    date: new Date('2025-06-10T00:00:00'),
    endDate: new Date('2025-06-16T23:59:59'),
    time: 'All Day',
    venue: 'Palani Road, Udumalpet',
    organizer: 'Temple Committee',
    phone: '+91 97500 12345',
    price: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1608958416755-22d7d566f1ea?w=800&q=80',
    paymentLink: '',
    duration: '7 Days',
    likes: [],
    comments: [],
    status: 'Approved'
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
    duration: '1 Day',
    likes: [],
    comments: [],
    status: 'Approved'
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
    duration: '4 Hours',
    likes: [],
    comments: [],
    status: 'Approved'
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
    duration: '2 Days',
    likes: [],
    comments: [],
    status: 'Approved'
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
    duration: '3 Days',
    likes: [],
    comments: [],
    status: 'Approved'
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
    duration: '4 Days',
    likes: [],
    comments: [],
    status: 'Approved'
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
    duration: '1 Day',
    likes: [],
    comments: [],
    status: 'Approved'
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
    duration: '1 Evening',
    likes: [],
    comments: [],
    status: 'Approved'
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
    duration: '3 Days',
    likes: [],
    comments: [],
    status: 'Approved'
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
    duration: '4 Hours',
    likes: [],
    comments: [],
    status: 'Approved'
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
    duration: '1 Day',
    likes: [],
    comments: [],
    status: 'Approved'
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
    duration: '1 Day',
    likes: [],
    comments: [],
    status: 'Approved'
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
    duration: '1 Day',
    likes: [],
    comments: [],
    status: 'Approved'
  }
];

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [guestName, setGuestName] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [commentStatusMsg, setCommentStatusMsg] = useState('');

  // Auth Context
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('ubt_user');
    const storedToken = localStorage.getItem('ubt_token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (err) {
        console.error('Failed to parse ubt_user details from localStorage:', err);
        localStorage.removeItem('ubt_user');
        localStorage.removeItem('ubt_token');
      }
    }

    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`);
      const data = await res.json();
      if (data.success) {
        setEvent(data.data);
      } else {
        throw new Error('Not found');
      }
    } catch (err) {
      console.warn('Backend server offline, searching mock events.');
      const mockObj = mockEvents.find(e => e._id === id);
      if (mockObj) {
        setEvent(mockObj);
      } else {
        setEvent(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    setLikeLoading(true);
    try {
      let guestId = localStorage.getItem('ubt_guest_id');
      if (!guestId) {
        guestId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        localStorage.setItem('ubt_guest_id', guestId);
      }

      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`http://localhost:5000/api/events/${id}/like`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ guestId })
      });
      const data = await res.json();
      if (data.success) {
        setEvent(prev => ({
          ...prev,
          likes: data.data
        }));
      }
    } catch (err) {
      if (event) {
        const identifier = (user?._id || user?.id) || localStorage.getItem('ubt_guest_id') || 'guest_temp';
        const isAlreadyLiked = event.likes.includes(identifier);
        const newLikes = isAlreadyLiked
          ? event.likes.filter(uid => uid !== identifier)
          : [...event.likes, identifier];
        setEvent(prev => ({
          ...prev,
          likes: newLikes
        }));
      }
    } finally {
      setLikeLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const payload = { 
        text: commentText,
        userName: token ? undefined : (guestName.trim() || 'Anonymous Visitor')
      };

      const res = await fetch(`http://localhost:5000/api/events/${id}/comment`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setEvent(prev => ({
          ...prev,
          comments: data.data
        }));
        setCommentText('');
        setGuestName('');
        setCommentStatusMsg(data.message || 'Comment posted successfully!');
        setTimeout(() => setCommentStatusMsg(''), 6000);
      }
    } catch (err) {
      const mockComment = {
        _id: 'mock_c_' + Math.random().toString(36).substr(2, 9),
        user: user ? (user._id || user.id) : undefined,
        userName: user ? user.fullName : (guestName.trim() || 'Anonymous Visitor'),
        text: commentText,
        createdAt: new Date()
      };
      setEvent(prev => ({
        ...prev,
        comments: [...prev.comments, mockComment]
      }));
      setCommentText('');
      setGuestName('');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}/comment/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEvent(prev => ({
          ...prev,
          comments: data.data
        }));
      }
    } catch (err) {
      setEvent(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c._id !== commentId)
      }));
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-3 text-slate-400 min-h-[70vh]">
        <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
        <span className="text-xs font-bold">Loading event details...</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-slate-200 shadow rounded-3xl text-center flex flex-col items-center gap-5">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm">Event Not Found</h3>
          <p className="text-xs text-slate-450 font-semibold leading-relaxed mt-1">
            The event you are looking for does not exist or has been deleted.
          </p>
        </div>
        <Link 
          to="/events" 
          className="py-2.5 px-6 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow transition-transform hover:-translate-y-0.5"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  const currentGuestId = localStorage.getItem('ubt_guest_id');
  const isLiked = event && (
    (user && (event.likes.includes(user._id) || event.likes.includes(user.id))) ||
    (!user && currentGuestId && event.likes.includes(currentGuestId))
  );

  const canDeleteComment = (comment) => {
    if (!user) return false;
    const currentUserId = user._id || user.id;
    if (!currentUserId) return false;
    const isCommentCreator = comment.user && comment.user.toString() === currentUserId.toString();
    const isEventOwner = event.ownerId && event.ownerId.toString() === currentUserId.toString();
    const isAdmin = ['admin', 'superadmin'].includes(user.role);
    return isCommentCreator || isEventOwner || isAdmin;
  };

  const formatEventDateRange = (startDate, endDate) => {
    if (!startDate) return 'N/A';
    const startStr = new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    if (!endDate) return startStr;
    const endStr = new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    if (startStr === endStr) return startStr;
    return `${startStr} - ${endStr}`;
  };

  const getBadgeStyles = (category) => {
    switch (category) {
      case 'Sports': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'Festival': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'Business': return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      case 'Music': return 'bg-purple-50 border-purple-200 text-purple-700';
      default: return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Sports': return '⚽';
      case 'Festival': return '🪔';
      case 'Business': return '💼';
      case 'Music': return '🎵';
      default: return '📅';
    }
  };

  let backPath = "/events";
  let backLabel = "Back to Events";
  if (token && user) {
    if (user.role === 'admin') {
      backPath = "/admin";
      backLabel = "Back to Admin Dashboard";
    } else if (user.role === 'superadmin') {
      backPath = "/superadmin";
      backLabel = "Back to SuperAdmin Dashboard";
    }
  }

  return (
    <div className="w-full flex flex-col items-center bg-[#F8FAFC] pb-16 font-sans">
      
      {/* Container */}
      <div className="max-w-4xl w-full px-4 md:px-8 mt-8 flex flex-col gap-6 text-left">
        
        {/* Back Link */}
        <Link 
          to={backPath} 
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-[#027244] transition-colors py-1 hover:-translate-x-0.5 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" /> {backLabel}
        </Link>

        {/* Cover Landscape */}
        <div className="w-full h-[320px] md:h-[420px] rounded-3xl overflow-hidden border border-slate-200/60 shadow-md relative select-none">
          <img 
            src={event.coverImageUrl || 'https://images.unsplash.com/photo-1502224562085-639556652f33?w=800&q=80'} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
        </div>

        {/* Article Details Card */}
        <article className="bg-white border border-slate-200/80 shadow-lg rounded-[28px] p-6 md:p-10 flex flex-col gap-6 -mt-16 relative z-10 mx-2 md:mx-6">
          
          {/* Header info */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 border-b border-slate-100 pb-5">
            {event.category && (
              <span className={`px-2.5 py-0.5 border rounded-md text-[9.5px] font-black uppercase tracking-wider select-none ${getBadgeStyles(event.category)}`}>
                {getCategoryIcon(event.category)} {event.category}
              </span>
            )}
            
            {event.duration && (
              <span className="text-[9.5px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-slate-550 select-none">
                ⏱ {event.duration}
              </span>
            )}

            <span className="text-[9.5px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-emerald-50 border border-emerald-100 rounded-md text-[#027244] select-none">
              {event.price === 0 ? 'FREE' : `₹${event.price}`}
            </span>

            {new Date(event.endDate || event.date) < new Date() && (
              <span className="text-[9.5px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-red-50 border border-red-200 rounded-md text-red-700 select-none">
                Expired
              </span>
            )}

            {event.status !== 'Approved' && (
              <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ml-auto animate-pulse select-none">
                {event.status}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#001c41] tracking-tight leading-snug">
            {event.title}
          </h1>

          {/* Details Spec Table */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue + ', Udumalpet')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 hover:text-emerald-500 transition-colors cursor-pointer group"
              title="Open Venue in Google Maps"
            >
              <MapPin className="h-4.5 w-4.5 text-[#027244] group-hover:text-emerald-500 shrink-0 mt-0.5" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Venue</span>
                <span className="font-bold text-slate-800 mt-1 group-hover:underline">{event.venue}</span>
              </div>
            </a>

            <div className="flex items-start gap-2.5">
              <Calendar className="h-4.5 w-4.5 text-[#027244] shrink-0 mt-0.5" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Date & Timings</span>
                <span className="font-bold text-slate-800 mt-1">{formatEventDateRange(event.date, event.endDate)}</span>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{event.time}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <User className="h-4.5 w-4.5 text-[#027244] shrink-0 mt-0.5" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Organizer / Host</span>
                <span className="font-bold text-slate-800 mt-1">{event.organizer}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="h-4.5 w-4.5 text-[#027244] shrink-0 mt-0.5" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Contact Info</span>
                <span className="font-bold text-slate-800 mt-1">{event.phone}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2.5 text-left mt-2">
            <h3 className="font-extrabold text-sm text-[#001c41] uppercase tracking-wider">About the Event</h3>
            <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed whitespace-pre-line font-sans">
              {event.description}
            </p>
          </div>

          {/* External registration link if exists */}
          {event.paymentLink && (
            <a 
              href={event.paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md self-start uppercase tracking-wider leading-none"
            >
              <span>Register / Book Tickets</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          {/* Interactions panel */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-4 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLike}
                disabled={likeLoading}
                className={`py-2 px-5 rounded-2xl flex items-center gap-2.5 text-xs font-extrabold shadow-sm transition-all cursor-pointer border ${
                  isLiked 
                    ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100/60' 
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Heart className={`h-4.5 w-4.5 transition-transform ${isLiked ? 'fill-current text-rose-500' : ''}`} />
                <span>{isLiked ? 'Liked' : 'Like Event'}</span>
              </button>
              <span className="text-slate-400 text-xs font-bold">{event.likes ? event.likes.length : 0} people liked this event</span>
            </div>
            
            <button
              onClick={handleShare}
              className="py-2 px-5 rounded-2xl flex items-center gap-2.5 text-xs font-extrabold shadow-sm transition-all cursor-pointer border bg-white border-blue-100 text-blue-900 hover:border-blue-300 relative animate-fadeIn"
            >
              {shareCopied && (
                <span className="absolute -top-8 right-0 bg-[#027244] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                  Link Copied!
                </span>
              )}
              <Share2 className="h-4.5 w-4.5 text-emerald-600" />
              <span>Share Event</span>
            </button>
          </div>

        </article>

        {/* Discussion / Comments Feed */}
        <div className="bg-white border border-slate-200/80 shadow-md rounded-[28px] p-6 md:p-8 flex flex-col gap-6 mx-2 md:mx-6">
          
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <MessageSquare className="h-5 w-5 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-[#001c41]">Discussion & Comments ({event.comments ? event.comments.length : 0})</h3>
          </div>

          {/* Comments List */}
          <div className="flex flex-col divide-y divide-slate-100">
            {!event.comments || event.comments.length === 0 ? (
              <div className="py-8 text-center text-slate-450 text-xs font-semibold leading-relaxed">
                No comments yet. Share your thoughts and start the conversation!
              </div>
            ) : (
              event.comments.map((comment) => (
                <div key={comment._id} className="flex gap-4 py-4.5 first:pt-0 last:pb-0 group">
                  {/* Circle avatar */}
                  <div className="h-8.5 w-8.5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-extrabold text-[#001c41] text-xs shadow-inner uppercase shrink-0 select-none">
                    {(comment.userName || 'U').charAt(0)}
                  </div>

                  <div className="flex-grow flex flex-col text-left">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-800 leading-none">{comment.userName}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {new Date(comment.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed font-semibold mt-2.5">
                      {comment.text}
                    </p>
                  </div>

                  {/* Trash Delete comment action button */}
                  {canDeleteComment(comment) && (
                    <button 
                      onClick={() => handleCommentDelete(comment._id)}
                      title="Delete comment"
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 text-slate-400 hover:text-red-655 cursor-pointer h-7 w-7 rounded-lg hover:bg-red-50 flex items-center justify-center shrink-0 self-start"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}

                </div>
              ))
            )}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3 border-t border-slate-100 pt-5 mt-2">
            {commentStatusMsg && (
              <div className="p-3 bg-emerald-50 text-[#027244] border border-emerald-250/20 text-xs font-semibold rounded-xl text-center flex items-center justify-center gap-2 animate-fadeIn">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{commentStatusMsg}</span>
              </div>
            )}
            {!token && (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Your Name (Optional)"
                  disabled={commentLoading}
                  className="w-full sm:w-1/3 border border-slate-200/70 p-2 px-4 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20"
                />
                <div className="text-slate-450 text-[10px] font-extrabold self-center">Commenting as Guest</div>
              </div>
            )}
            <div className="flex gap-3">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a public comment..."
                disabled={commentLoading}
                required
                className="w-full border border-slate-200/70 p-3 px-4 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20"
              />
              <button 
                type="submit"
                disabled={commentLoading || !commentText.trim()}
                className="bg-[#027244] hover:bg-[#005934] disabled:opacity-40 text-white rounded-xl h-11 w-11 flex items-center justify-center shrink-0 cursor-pointer shadow-md transition-colors"
              >
                {commentLoading ? <RefreshCw className="h-4.5 w-4.5 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </form>

        </div>

      </div>

    </div>
  );
}
