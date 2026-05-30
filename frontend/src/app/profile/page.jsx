import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Store, BookOpen, Calendar, Clock, MapPin, Star, Phone, ShieldCheck, Heart, Eye, ArrowRight, RefreshCw, AlertCircle
} from 'lucide-react';

const mockBlogs = [
  {
    _id: 'blog_1',
    title: '10 Habit Formulas for a Productive and Creative Life',
    content: 'Developing daily habits that support creativity and productivity can transform your personal and professional life...',
    coverImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80',
    author: 'author_fallback_1',
    authorName: 'Ananth Sundar',
    likes: ['u1', 'u2', 'u3'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'blog_2',
    title: 'The Art of Slow Living: Finding Peace in a Fast-Paced World',
    content: 'In a world that constantly encourages speed, choosing to slow down is a deliberate and rewarding act...',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    author: 'author_fallback_2',
    authorName: 'Senthil Kumar',
    likes: ['u1', 'u2'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'blog_3',
    title: 'A Beginner\'s Guide to Photography: Capturing Everyday Moments',
    content: 'Photography is more than just owning a camera; it is about learning how to see light...',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    author: 'author_fallback_3',
    authorName: 'Priya Ramesh',
    likes: ['u1', 'u2', 'u3', 'u4'],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
  }
];

const mockFeatured = [
  {
    _id: 'featured_1',
    name: 'Sri Murugan Stores',
    category: 'Departmental Stores',
    locality: 'Gandhi Nagar, Udumalpet',
    googleRating: 4.6,
    googleReviewsCount: 128,
    isPremium: true,
    isAddressVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80',
    phone: '+91 94430 12345',
    ownerId: 'author_fallback_3'
  },
  {
    _id: 'featured_2',
    name: 'Green Valley Hotel',
    category: 'Hotels & Restaurants',
    locality: 'Pollachi Road, Udumalpet',
    googleRating: 4.8,
    googleReviewsCount: 98,
    isPremium: true,
    isAddressVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
    phone: '+91 98945 99999',
    ownerId: 'author_fallback_2'
  },
  {
    _id: 'featured_3',
    name: 'R.K. Electricals',
    category: 'Electrical Services',
    locality: 'Pollachi Road, Udumalpet',
    googleRating: 4.7,
    googleReviewsCount: 84,
    isPremium: true,
    isAddressVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80',
    phone: '+91 98945 43100',
    ownerId: 'author_fallback_1'
  }
];

const mockEvents = [
  {
    _id: 'event_1',
    title: 'Trade Expo & Shopping Mela 2026',
    category: 'Trade Shows',
    description: 'Explore agricultural products, electrical tools, and clothing discounts...',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    time: '10:00 AM - 9:00 PM',
    venue: 'Municipal Ground, Udumalpet',
    organizer: 'Ananth Sundar',
    phone: '+91 98945 43100',
    coverImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80',
    ownerId: 'author_fallback_1'
  }
];

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [events, setEvents] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('blogs'); // blogs | businesses | events

  useEffect(() => {
    fetchProfileDetails();
  }, [id]);

  const fetchProfileDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/public/${id}`);
      const data = await res.json();
      if (data.success) {
        setProfile(data.data.user);
        setBlogs(data.data.blogs);
        setBusinesses(data.data.businesses);
        setEvents(data.data.events);
      } else {
        throw new Error('Not found');
      }
    } catch (err) {
      console.warn('API details offline, falling back to mock datasets.');
      // Offline Simulation
      const matchedMockUsers = {
        'author_fallback_1': { fullName: 'Ananth Sundar', role: 'writer', createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        'author_fallback_2': { fullName: 'Senthil Kumar', role: 'writer', createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        'author_fallback_3': { fullName: 'Priya Ramesh', role: 'writer', createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
      };

      const matchedUser = matchedMockUsers[id] || { fullName: 'Udumalpet Member Guide', role: 'writer', createdAt: new Date() };
      
      setProfile({
        _id: id,
        fullName: matchedUser.fullName,
        role: matchedUser.role,
        createdAt: matchedUser.createdAt
      });

      // Filter local mocks
      setBlogs(mockBlogs.filter(b => b.author === id));
      setBusinesses(mockFeatured.filter(b => b.ownerId === id));
      setEvents(mockEvents.filter(e => e.ownerId === id));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-3 text-slate-400 min-h-[70vh]">
        <RefreshCw className="h-8 w-8 text-[#027244] animate-spin" />
        <span className="text-xs font-bold">Loading public profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-slate-200 shadow rounded-3xl text-center flex flex-col items-center gap-5">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm">Profile Not Found</h3>
          <p className="text-xs text-slate-450 font-semibold leading-relaxed mt-1">
            The user profile you are looking for does not exist or has been deactivated.
          </p>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="py-2.5 px-6 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center bg-[#F8FAFC] pb-24 font-sans text-left">
      
      {/* Background Banner */}
      <div className="w-full h-44 bg-gradient-to-r from-[#001c41] to-[#002d62] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Main Profile Info Card */}
      <div className="max-w-5xl w-full px-4 md:px-8 -mt-20 relative z-10">
        
        {/* User Card */}
        <div className="bg-white border border-slate-200/80 shadow-lg rounded-[28px] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            
            {/* Avatar Circle */}
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-500/25 flex items-center justify-center font-black text-slate-700 text-3xl shadow-md uppercase select-none shrink-0">
              {profile.fullName.charAt(0)}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl md:text-2xl font-black text-[#001c41] tracking-tight">{profile.fullName}</h1>
                <span className="px-2.5 py-0.5 rounded text-[9.5px] font-black uppercase bg-emerald-50 border border-emerald-250 text-emerald-700 tracking-wider">
                  {profile.role}
                </span>
                <span className="px-2.5 py-0.5 rounded text-[9.5px] font-black uppercase bg-blue-50 border border-blue-200 text-blue-700 tracking-wider flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Vetted Member
                </span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Member since {new Date(profile.createdAt).toLocaleDateString(undefined, {month: 'long', year: 'numeric'})}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="w-full md:w-auto py-2.5 px-5 border border-slate-200 hover:bg-slate-50 text-slate-655 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-stretch md:self-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center border-b border-slate-200 mt-10 overflow-x-auto whitespace-nowrap scrollbar-none">
          {[
            { id: 'blogs', label: 'Other Blogs', count: blogs.length, icon: <BookOpen className="h-4.5 w-4.5" /> },
            { id: 'businesses', label: 'Businesses Owned', count: businesses.length, icon: <Store className="h-4.5 w-4.5" /> },
            { id: 'events', label: 'Community Events', count: events.length, icon: <Calendar className="h-4.5 w-4.5" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-6 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#027244] text-[#027244]'
                  : 'border-transparent text-slate-455 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-[#027244] text-white' : 'bg-slate-100 text-slate-500'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Tab Panel contents */}
        <div className="mt-8">
          
          {/* TAB 1: BLOGS */}
          {activeTab === 'blogs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              {blogs.map(b => {
                const words = b.content ? b.content.split(' ').length : 100;
                const readTime = Math.max(Math.ceil(words / 150), 1);
                return (
                  <div 
                    key={b._id} 
                    onClick={() => navigate(`/blogs/${b._id}`)}
                    className="bg-white border border-slate-200/80 hover:border-slate-350 hover:shadow-md rounded-[24px] p-5 shadow-2xs transition-all flex flex-col justify-between gap-4 cursor-pointer group"
                  >
                    <div className="flex gap-4">
                      {b.coverImage && (
                        <div className="h-16 w-20 rounded-xl overflow-hidden border border-slate-100 shrink-0 select-none bg-slate-50">
                          <img src={b.coverImage} className="w-full h-full object-cover" alt="Blog Cover" />
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="font-extrabold text-[#001c41] text-xs sm:text-[13px] leading-snug truncate group-hover:text-[#027244] transition-colors">{b.title}</span>
                        <div className="flex items-center gap-3 text-[9.5px] text-slate-400 font-bold mt-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {readTime} Min Read
                          </span>
                          <span>•</span>
                          <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-1 text-[10.5px] font-extrabold text-[#027244] group-hover:underline">
                      <span>Read Full Article</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}

              {blogs.length === 0 && (
                <div className="col-span-2 bg-white border border-slate-200/60 rounded-3xl p-16 text-center text-slate-400 flex flex-col items-center gap-3 w-full">
                  <BookOpen className="h-10 w-10 text-slate-300" />
                  <span className="text-sm font-bold text-slate-800 font-sans">No Articles Published</span>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs">This user has not published any guiding blog posts yet.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BUSINESSES */}
          {activeTab === 'businesses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              {businesses.map(biz => (
                <div 
                  key={biz._id}
                  onClick={() => navigate(`/businesses/${biz._id}`)}
                  className="bg-white border border-slate-200/80 hover:border-slate-350 hover:shadow-md rounded-[24px] overflow-hidden flex flex-col cursor-pointer group"
                >
                  <div className="h-36 bg-slate-100 bg-cover bg-center shrink-0 relative" style={{ backgroundImage: `url('${biz.coverImageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80'}')` }}>
                    {biz.isPremium && (
                      <span className="absolute top-3 left-3 bg-amber-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-lg shadow-sm">Featured</span>
                    )}
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                      <h4 className="font-extrabold text-sm text-[#001c41] leading-tight group-hover:text-[#027244] transition-colors">{biz.name || biz.businessName}</h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{biz.category}</span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold mt-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-405 shrink-0" />
                        <span>{biz.locality}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-100 pt-3 text-xs">
                      <div className="flex items-center gap-1 text-slate-500 font-bold">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
                        <span>{(biz.googleRating || 4.5).toFixed(1)}</span>
                        <span className="text-[10px] text-slate-400">({biz.googleReviewsCount || 0})</span>
                      </div>
                      <span className="text-[10.5px] font-extrabold text-[#027244] group-hover:underline">View Details</span>
                    </div>
                  </div>
                </div>
              ))}

              {businesses.length === 0 && (
                <div className="col-span-2 bg-white border border-slate-200/60 rounded-3xl p-16 text-center text-slate-400 flex flex-col items-center gap-3 w-full">
                  <Store className="h-10 w-10 text-slate-300" />
                  <span className="text-sm font-bold text-slate-800 font-sans">No Business Directory Listing</span>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs">This user does not have any active business listings registered on the network.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EVENTS */}
          {activeTab === 'events' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              {events.map(e => (
                <div 
                  key={e._id}
                  className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-2xs flex flex-col gap-4 justify-between"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col">
                      <h4 className="font-extrabold text-sm text-[#001c41] leading-tight">{e.title}</h4>
                      <span className="text-[9.5px] text-slate-400 font-bold mt-1">Organizer: {e.organizer}</span>
                    </div>
                    <span className="bg-emerald-50 border border-emerald-250 text-emerald-700 px-2 py-0.5 rounded text-[8.5px] font-black uppercase shrink-0">
                      {e.category}
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-[10.5px] font-semibold text-slate-500 flex flex-col gap-1.5">
                    <div>📅 Date: <span className="text-slate-800 font-bold">{new Date(e.date).toLocaleDateString()}</span></div>
                    <div>📍 Venue: <span className="text-slate-800 font-bold">{e.venue}</span></div>
                    <div>🕒 Time: <span className="text-slate-800 font-bold">{e.time || '10:00 AM - 9:00 PM'}</span></div>
                  </div>

                  <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 text-xs font-bold text-slate-550">
                    <a 
                      href={`tel:${e.phone}`} 
                      className="px-4 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center gap-1 text-slate-655"
                    >
                      <Phone className="h-3.5 w-3.5" /> Call Organizer
                    </a>
                  </div>
                </div>
              ))}

              {events.length === 0 && (
                <div className="col-span-2 bg-white border border-slate-200/60 rounded-3xl p-16 text-center text-slate-400 flex flex-col items-center gap-3 w-full">
                  <Calendar className="h-10 w-10 text-slate-300" />
                  <span className="text-sm font-bold text-slate-800 font-sans">No Events Promoted</span>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs">This user has not posted or organized any community events yet.</p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
