import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, ToggleLeft, RefreshCw, Star, HelpCircle, Check, X, AlertCircle, AlertTriangle, 
  ArrowRight, Eye, Grid, Shield, CreditCard, LayoutDashboard, Store, BookOpen, Calendar, 
  MessageSquare, CreditCard as CardIcon, Bell, BarChart3, Settings, LogOut, Search, User, 
  MapPin, ChevronRight, Landmark, Trash2, Mail, Globe, Award, ShieldAlert, CheckCircle2,
  Clock, Plus, Filter, ShieldCheck as ShieldOk, Activity, Cpu, Database, Terminal
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const getStatusWeight = (status) => {
    if (status === 'Pending Approval') return 0;
    if (status === 'Needs Revision') return 1;
    if (status === 'Approved') return 2;
    if (status === 'Rejected') return 3;
    return 4;
  };
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  
  // Tab navigation state
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [auditSubTab, setAuditSubTab] = useState('Businesses'); // Businesses | Blogs | Testimonials
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Datasets states
  const [businesses, setBusinesses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reportsData, setReportsData] = useState({});

  // Slide-over Modal State
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [showBizModal, setShowBizModal] = useState(false);
  
  // Blog Moderation Modal State
  const [selectedBlogModal, setSelectedBlogModal] = useState(null);
  const [suggestionText, setSuggestionText] = useState('');
  
  // Custom states for forms
  const [newNotice, setNewNotice] = useState({ title: '', message: '', type: 'announcement' });
  const [noticeSuccess, setNoticeSuccess] = useState(false);

  // Queries related state variables
  const [queries, setQueries] = useState([]);
  const [queriesLoading, setQueriesLoading] = useState(false);
  const [queriesError, setQueriesError] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [queryFilter, setQueryFilter] = useState('All'); // All | Pending | Replied
  const [querySearch, setQuerySearch] = useState('');

  // UBT App Testimonials states and handlers
  const [appTestimonials, setAppTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);

  const fetchAppTestimonials = async () => {
    setTestimonialsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/testimonials/admin', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setAppTestimonials(data.data);
      } else {
        throw new Error(data.message || 'Error');
      }
    } catch (err) {
      console.warn('API error, using realistic mockup testimonials.');
      const mockTestimonials = [
        {
          _id: 't1',
          authorName: 'Ramesh Krishnan',
          role: 'Business Owner',
          text: 'Udumalpet Business Tour (UBT) has increased our departmental store leads and customer footfalls significantly. Highly recommended platform for all town vendors!',
          rating: 5,
          status: 'Pending',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: 't2',
          authorName: 'Sarah John',
          role: 'Blog Writer',
          text: 'Publishing local guiding articles on UBT is super clean and elegant. The interactive dashboard keeps our reader metrics clear.',
          rating: 5,
          status: 'Approved',
          createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
        }
      ];
      setAppTestimonials(mockTestimonials);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  const handleTestimonialStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/testimonials/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setAppTestimonials(prev => prev.map(t => t._id === id ? { ...t, status } : t));
        alert(`Testimonial thoughts successfully ${status.toLowerCase()}!`);
      } else {
        alert(data.message || 'Failed to update testimonial status.');
      }
    } catch (err) {
      setAppTestimonials(prev => prev.map(t => t._id === id ? { ...t, status } : t));
      alert(`Testimonial thoughts successfully ${status.toLowerCase()} (simulated offline mode)!`);
    }
  };

  const handleTestimonialDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this testimonial Thoughts?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setAppTestimonials(prev => prev.filter(t => t._id !== id));
        alert('Testimonial thoughts deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete testimonial.');
      }
    } catch (err) {
      setAppTestimonials(prev => prev.filter(t => t._id !== id));
      alert('Testimonial thoughts deleted successfully (simulated offline mode)!');
    }
  };

  const fetchQueries = async () => {
    setQueriesLoading(true);
    setQueriesError('');
    try {
      const res = await fetch('http://localhost:5000/api/queries', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setQueries(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch queries.');
      }
    } catch (err) {
      console.warn('API error, using realistic mockup fallback queries.');
      const mockQs = [
        {
          _id: 'q1',
          name: 'Ramesh Krishnan',
          email: 'ramesh@gmail.com',
          subject: 'Verified Badge enquiry',
          message: 'Hello, how can I apply for a verified badge for my shop (Sri Murugan Stores)? What documents are needed?',
          status: 'Pending',
          createdAt: new Date(new Date().getTime() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: 'q2',
          name: 'Sarah John',
          email: 'sarah@ubt.com',
          subject: 'Banner advertising pricing',
          message: 'I want to advertise my resort on your home banner slide. Can you share the pricing sheet and impressions data?',
          status: 'Replied',
          replyMessage: 'Hello Sarah, we have sent the media kit to your email. Our representative will follow up tomorrow.',
          repliedAt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(new Date().getTime() - 36 * 60 * 60 * 1000).toISOString()
        }
      ];
      setQueries(mockQs);
    } finally {
      setQueriesLoading(false);
    }
  };

  const handleQueryReply = async (queryId) => {
    if (!replyText.trim()) return;
    setReplySubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/queries/${queryId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}`
        },
        body: JSON.stringify({ replyMessage: replyText })
      });
      const data = await res.json();
      if (data.success) {
        setQueries(prev => prev.map(q => q._id === queryId ? { ...q, status: 'Replied', replyMessage: replyText, repliedAt: new Date().toISOString() } : q));
        alert('Reply sent successfully!');
        setShowReplyModal(false);
        setReplyText('');
      } else {
        alert(data.message || 'Failed to send reply.');
      }
    } catch (err) {
      console.warn('API error, simulating offline reply submission.');
      setQueries(prev => prev.map(q => q._id === queryId ? { ...q, status: 'Replied', replyMessage: replyText, repliedAt: new Date().toISOString() } : q));
      alert('Reply sent successfully (simulated offline mode)!');
      setShowReplyModal(false);
      setReplyText('');
    } finally {
      setReplySubmitting(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('ubt_token');
    const storedUser = localStorage.getItem('ubt_user');

    if (!storedToken || !storedUser) {
      navigate('/login');
      return;
    }

    try {
      const uObj = JSON.parse(storedUser);
      if (uObj.role !== 'admin' && uObj.role !== 'superadmin') {
        navigate('/login?error=unauthorized');
        return;
      }
      setToken(storedToken);
      setUser(uObj);
      loadPlatformRealData();
      fetchQueries();
      fetchAppTestimonials();
    } catch (err) {
      localStorage.removeItem('ubt_user');
      localStorage.removeItem('ubt_token');
      navigate('/login');
    }
  }, []);

  const loadPlatformRealData = async () => {
    setLoading(true);
    try {
      const storedToken = localStorage.getItem('ubt_token');
      const headers = { 'Authorization': `Bearer ${storedToken}` };

      // 1. Fetch businesses
      const bizRes = await fetch('http://localhost:5000/api/admin/businesses', { headers });
      const bizData = await bizRes.json();
      let activeBiz = [];
      if (bizData.success) {
        activeBiz = bizData.data.map(b => ({
          ...b,
          ownerName: b.ownerId ? b.ownerId.fullName || b.ownerId.name || 'Merchant' : 'Merchant',
          ownerEmail: b.ownerId ? b.ownerId.email : '',
          googlePlaceId: b.googlePlaceId || '',
          googleRating: b.googleRating || 0,
          googleReviewsCount: b.googleReviewsCount || 0
        }));
        setBusinesses(activeBiz);
      }

      // 2. Fetch blogs
      const blogsRes = await fetch('http://localhost:5000/api/blogs/admin/all', { headers });
      const blogsData = await blogsRes.json();
      if (blogsData.success) {
        setBlogs(blogsData.data);
      }

      // 3. Fetch events
      const evRes = await fetch('http://localhost:5000/api/events/admin/all', { headers });
      const evData = await evRes.json();
      if (evData.success) {
        setEvents(evData.data);
      }

      // Keep mock subscriptions and reviews for simple UI metrics
      const mockReviews = [
        {
          _id: 'rev_1',
          businessName: 'Vibrant Bakery & Cafe',
          authorName: 'Ramesh K.',
          rating: 1,
          text: 'SPAM REVIEW: Earn Rs 5000 daily from home visit spamlink.com!',
          status: 'flagged'
        },
        {
          _id: 'rev_2',
          businessName: 'R.K. Electricals',
          authorName: 'Karthik S.',
          rating: 5,
          text: 'Excellent service! They came on time and fixed the inverter issue quickly. Very professional.',
          status: 'approved'
        }
      ];

      const mockSubs = [
        {
          _id: 'sub_1',
          businessName: 'R.K. Electricals',
          planType: 'Monthly',
          amount: 499,
          paymentStatus: 'Paid',
          expiryDate: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000)
        }
      ];

      setReviews(mockReviews);
      setSubscriptions(mockSubs);

      // Auto-calculate stats
      setReportsData({
        total: activeBiz.length,
        pending: activeBiz.filter(b => b.status === 'Pending Verification' || b.status === 'Under Review').length,
        active: activeBiz.filter(b => b.subscriptionStatus === 'active' && b.status === 'Approved').length,
        expired: activeBiz.filter(b => b.subscriptionStatus === 'expired').length
      });

    } catch (err) {
      console.error('Error hydrating admin platform datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (bizId, type) => {
    let nextStatus = 'Pending Verification';
    if (type === 'approve') nextStatus = 'Approved';
    if (type === 'reject') nextStatus = 'Rejected';
    if (type === 'suspend') nextStatus = 'Suspended';
    
    try {
      const res = await fetch(`http://localhost:5000/api/admin/businesses/${bizId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Business successfully marked as ${nextStatus}!`);
        loadPlatformRealData();
      } else {
        alert(data.message || 'Failed to update business status.');
      }
    } catch (err) {
      // Fallback mock update locally
      setBusinesses(prev => prev.map(b => b._id === bizId ? { ...b, status: nextStatus } : b));
      if (selectedBiz && selectedBiz._id === bizId) {
        setSelectedBiz(prev => ({ ...prev, status: nextStatus }));
      }
    }
  };

  const handleManualSubscription = (bizId) => {
    setBusinesses(prev => prev.map(b => {
      if (b._id === bizId) {
        return { 
          ...b, 
          subscriptionStatus: 'active', 
          subscriptionExpiry: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000) 
        };
      }
      return b;
    }));
    alert('Plan manually activated successfully for 30 days!');
  };

  const handleBlogAction = async (blogId, status, suggestions = '') => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/blogs/moderate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('ubt_token')}`
        },
        body: JSON.stringify({ blogId, status, suggestions })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Blog status successfully set to ${status}!`);
        loadPlatformRealData();
      } else {
        alert(data.message || 'Failed to update blog status.');
      }
    } catch (err) {
      // Fallback mock update locally
      setBlogs(prev => prev.map(b => b._id === blogId ? { ...b, status, revisionSuggestions: suggestions } : b));
    }
  };

  const handleBlogDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to permanently delete this blog post? This action cannot be undone.')) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token || localStorage.getItem('ubt_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        alert('Blog post successfully deleted!');
        loadPlatformRealData();
      } else {
        alert(data.message || 'Failed to delete blog.');
      }
    } catch (err) {
      alert('Error deleting blog post.');
    }
  };

  const handleEventAction = async (eventId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/events/moderate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ eventId, status })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Event status successfully set to ${status}!`);
        loadPlatformRealData();
      } else {
        alert(data.message || 'Failed to update event status.');
      }
    } catch (err) {
      // Fallback mock update locally
      setEvents(prev => prev.map(e => e._id === eventId ? { ...e, status } : e));
    }
  };

  const handleReviewAction = (revId, action) => {
    if (action === 'delete') {
      setReviews(prev => prev.filter(r => r._id !== revId));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ubt_token');
    localStorage.removeItem('ubt_user');
    navigate('/login');
  };

  // Filtered lists
  const filteredBusinesses = businesses.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800 text-left">
      
      {/* 1. SIDEBAR CONTAINER */}
      <aside className={`bg-[#001c41] text-white flex flex-col justify-between transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'} shrink-0 relative overflow-hidden z-20`}>
        <div className="flex flex-col gap-8 py-6">
          {/* Logo Brand */}
          <div className="px-6 flex items-center justify-start py-2">
            <Link to="/" className="flex items-center select-none shrink-0">
              <img 
                src="/logo-dark.png" 
                alt="Udumalpet Business Tour" 
                className={`${sidebarCollapsed ? 'h-6' : 'h-10'} w-auto object-contain transition-all duration-300`} 
              />
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1 px-3">
            {[
              { id: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
              { id: 'Businesses', label: 'Businesses', icon: <Store className="h-5 w-5" /> },
              { id: 'Pending Approvals', label: 'Pending Approvals', icon: <ShieldAlert className="h-5 w-5" /> },
              { id: 'Blogs', label: 'Blogs Moderation', icon: <BookOpen className="h-5 w-5" /> },
              { id: 'Events', label: 'Events Moderation', icon: <Calendar className="h-5 w-5" /> },
              { id: 'Reviews', label: 'Reviews Feed', icon: <MessageSquare className="h-5 w-5" /> },
              { id: 'Subscriptions', label: 'Subscriptions', icon: <CardIcon className="h-5 w-5" /> },
              { id: 'Notifications', label: 'Notifications Hub', icon: <Bell className="h-5 w-5" /> },
              { id: 'Reports', label: 'Reports & Trends', icon: <BarChart3 className="h-5 w-5" /> },
              { id: 'Queries', label: 'Queries Inbox', icon: <Mail className="h-5 w-5" /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === item.id 
                    ? 'bg-[#027244] text-white shadow-md shadow-emerald-950/15' 
                    : 'text-slate-350 hover:bg-slate-900/40 hover:text-white'
                }`}
              >
                {item.icon}
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-900 flex flex-col gap-1">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full py-2.5 px-4 text-xs font-bold text-slate-400 hover:text-white rounded-xl hover:bg-slate-900/40 text-center shrink-0 hidden md:block cursor-pointer"
          >
            {sidebarCollapsed ? '→' : '← Collapse Sidebar'}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-4 py-3 w-full rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/15 hover:text-rose-350 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN APP SPACE */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        
        {/* Topbar navigation panel */}
        <header className="h-[76px] bg-white border-b border-slate-200/80 px-6 md:px-8 flex items-center justify-between z-10 sticky top-0 shrink-0">
          {/* Left: tab name / Search */}
          <div className="flex items-center gap-6 flex-1 max-w-md">
            <h2 className="font-extrabold text-slate-800 text-lg hidden sm:block">{activeTab}</h2>
            <div className="relative flex items-center flex-1">
              <Search className="h-4.5 w-4.5 text-slate-400 absolute left-3" />
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-xs border border-slate-200 px-4 py-2 pl-10 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/50 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Right: profile dropdown notification bar */}
          <div className="flex items-center gap-4">
            <button className="h-10 w-10 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded-full flex items-center justify-center text-slate-500 relative cursor-pointer">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="h-10 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right hidden sm:flex leading-none">
                <span className="font-extrabold text-[#001c41] text-xs">{user?.fullName || 'Admin Account'}</span>
                <span className="text-[8.5px] text-emerald-600 font-extrabold uppercase mt-1 tracking-wider bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-full self-end">
                  {user?.role || 'Admin'}
                </span>
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-[#001c41] text-xs">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Workspace views content */}
        <div className="p-6 md:p-8 flex-1">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
              <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
              <span className="text-xs font-bold">Configuring Administrator Datasets...</span>
            </div>
          ) : (
            <div className="animate-fadeIn">
                       {/* TAB: DASHBOARD VIEW */}
              {activeTab === 'Dashboard' && (
                <div className="flex flex-col gap-8">
                  {/* UBT UI Header Panel matching the reference image */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 text-left">
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-1.5 text-red-650 font-black text-[10px] uppercase tracking-wider">
                        <Shield className="h-4 w-4 text-red-500 fill-red-50" />
                        <span>Secure Admin Dashboard</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-[#001c41] mt-1.5 tracking-tight font-sans">
                        UBT Platform Administrator
                      </h2>
                    </div>
                    <div className="self-start sm:self-center">
                      <span className="border border-red-250 bg-red-50/50 text-red-650 font-black text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-full select-none shadow-2xs">
                        Admin Mode Active
                      </span>
                    </div>
                  </div>

                  {/* Overview Cards matching the UBT UI layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: Pending Approvals */}
                    <div className="bg-amber-50/30 border border-amber-250/70 p-5 rounded-[22px] shadow-2xs flex justify-between items-center transition-all hover:-translate-y-0.5 hover:shadow">
                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider">Pending Approvals</span>
                        <span className="text-3xl font-black text-amber-700 mt-2 leading-none">
                          {businesses.filter(b => b.status === 'Pending Verification' || b.status === 'Under Review').length}
                        </span>
                      </div>
                      <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 border border-amber-100/50">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Card 2: Active Premium */}
                    <div className="bg-emerald-50/30 border border-emerald-250/70 p-5 rounded-[22px] shadow-2xs flex justify-between items-center transition-all hover:-translate-y-0.5 hover:shadow">
                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-[10px] text-emerald-700 font-black uppercase tracking-wider">Active Premium</span>
                        <span className="text-3xl font-black text-emerald-800 mt-2 leading-none">
                          {businesses.filter(b => b.subscriptionStatus === 'active' && b.status === 'Approved').length}
                        </span>
                      </div>
                      <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100/50">
                        <CreditCard className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Card 3: Expired Billing */}
                    <div className="bg-red-50/30 border border-red-200/80 p-5 rounded-[22px] shadow-2xs flex justify-between items-center transition-all hover:-translate-y-0.5 hover:shadow">
                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-[10px] text-red-650 font-black uppercase tracking-wider">Expired Billing</span>
                        <span className="text-3xl font-black text-red-700 mt-2 leading-none">
                          {businesses.filter(b => b.subscriptionStatus === 'expired').length}
                        </span>
                      </div>
                      <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 border border-red-100/50">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Card 4: Total Listings */}
                    <div className="bg-slate-50/50 border border-slate-200/80 p-5 rounded-[22px] shadow-2xs flex justify-between items-center transition-all hover:-translate-y-0.5 hover:shadow">
                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Total Listings</span>
                        <span className="text-3xl font-black text-[#001c41] mt-2 leading-none">
                          {businesses.length}
                        </span>
                      </div>
                      <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200/50">
                        <Grid className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  {/* Listings Audit & Approval Desk Card */}
                  <div className="bg-white border border-slate-200/80 shadow-sm rounded-3xl p-6 md:p-8 flex flex-col gap-6 text-left">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-100 pb-5">
                      <div className="flex flex-col">
                        <h3 className="font-extrabold text-[#001c41] text-base leading-tight font-sans">
                          Listings Audit & Approval Desk
                        </h3>
                        <span className="text-[10px] text-slate-400 font-semibold mt-1">
                          Vetting new directories, moderation blogs and rating comments across the UBT platform.
                        </span>
                      </div>

                      {/* Pill tabs container */}
                      <div className="bg-slate-100/60 p-1 rounded-xl flex items-center self-start md:self-center overflow-x-auto shrink-0 border border-slate-200/30">
                        <button
                          onClick={() => setAuditSubTab('Businesses')}
                          className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                            auditSubTab === 'Businesses'
                              ? 'bg-[#027244] text-white shadow-sm shadow-emerald-950/15'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Businesses Audit
                        </button>
                        <button
                          onClick={() => setAuditSubTab('Blogs')}
                          className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                            auditSubTab === 'Blogs'
                              ? 'bg-[#027244] text-white shadow-sm shadow-emerald-950/15'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <span>Blogs Audit</span>
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                            auditSubTab === 'Blogs' ? 'bg-white text-[#027244]' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {blogs.filter(b => b.status === 'Pending Approval').length}
                          </span>
                        </button>
                        <button
                          onClick={() => setAuditSubTab('Events')}
                          className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                            auditSubTab === 'Events'
                              ? 'bg-[#027244] text-white shadow-sm shadow-emerald-950/15'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <span>Events Audit</span>
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                            auditSubTab === 'Events' ? 'bg-white text-[#027244]' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {events.filter(e => e.status === 'Pending Review').length}
                          </span>
                        </button>
                        <button
                          onClick={() => setAuditSubTab('Testimonials')}
                          className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                            auditSubTab === 'Testimonials'
                              ? 'bg-[#027244] text-white shadow-sm shadow-emerald-950/15'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <span>Testimonials Audit</span>
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                            auditSubTab === 'Testimonials' ? 'bg-white text-[#027244]' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {reviews.filter(r => r.status === 'flagged').length}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Sub-tab content */}
                    {auditSubTab === 'Businesses' && (
                      <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                        <table className="w-full border-collapse text-left text-xs font-semibold text-slate-600">
                          <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[9px] font-black text-slate-450 tracking-wider">
                            <tr>
                              <th className="p-4.5">Business Profile</th>
                              <th className="p-4.5">Category / Locality</th>
                              <th className="p-4.5">Status</th>
                              <th className="p-4.5">Sub Expiry</th>
                              <th className="p-4.5">Premium Boost</th>
                              <th className="p-4.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {filteredBusinesses.map(b => (
                              <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4.5 flex items-center gap-3.5">
                                  <div className="h-11 w-11 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200 relative shadow-2xs">
                                    <img src={b.coverImageUrl} className="h-full w-full object-cover" alt={b.name} />
                                  </div>
                                  <div className="flex flex-col text-left min-w-0">
                                    <span className="font-extrabold text-slate-800 text-xs sm:text-[13px] leading-tight truncate">
                                      {b.name}
                                    </span>
                                    <span className="text-[10px] text-slate-405 font-semibold mt-1 font-sans">
                                      Owner: {b.ownerName}
                                    </span>
                                    {/* Prominent external View Profile link */}
                                    <a
                                      href={`/businesses/${b._id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[#027244] hover:text-[#005934] hover:underline font-black text-[10.5px] mt-1.5 flex items-center gap-1 w-fit cursor-pointer leading-none"
                                    >
                                      View Profile →
                                    </a>
                                  </div>
                                </td>
                                <td className="p-4.5">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-slate-700 text-xs">{b.type}</span>
                                    <span className="text-[10px] text-slate-400 mt-1 font-semibold">{b.locality}</span>
                                  </div>
                                </td>
                                <td className="p-4.5">
                                  <span className={`px-2.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border ${
                                    b.status === 'Approved'
                                      ? 'bg-emerald-50 border-emerald-250 text-emerald-700'
                                      : b.status === 'Rejected'
                                        ? 'bg-red-50 border-red-200 text-red-650'
                                        : 'bg-amber-50 border-amber-250 text-amber-600 animate-pulse'
                                  }`}>
                                    {b.status}
                                  </span>
                                </td>
                                <td className="p-4.5 font-bold text-slate-500">
                                  {b.subscriptionExpiry ? new Date(b.subscriptionExpiry).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="p-4.5">
                                  {b.subscriptionStatus === 'active' ? (
                                    <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[8.5px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1 w-fit">
                                      <Check className="h-3 w-3" /> Boosted
                                    </span>
                                  ) : (
                                    <span className="bg-slate-50 border border-slate-200 text-slate-400 text-[8.5px] font-bold px-2 py-0.5 rounded uppercase w-fit">
                                      Standard
                                    </span>
                                  )}
                                </td>
                                <td className="p-4.5 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => { setSelectedBiz(b); setShowBizModal(true); }}
                                      className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[10.5px] font-extrabold cursor-pointer shadow-2xs"
                                    >
                                      Vet details
                                    </button>
                                    <button
                                      onClick={() => handleAction(b._id, 'approve')}
                                      disabled={b.status === 'Approved'}
                                      className="px-2.5 py-1.5 bg-[#027244] hover:bg-[#005934] text-white rounded-lg text-[10.5px] font-extrabold cursor-pointer disabled:opacity-40 shadow-2xs"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleAction(b._id, 'reject')}
                                      disabled={b.status === 'Rejected'}
                                      className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg text-[10.5px] font-extrabold cursor-pointer disabled:opacity-40 shadow-2xs"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {filteredBusinesses.length === 0 && (
                              <tr>
                                <td colSpan="6" className="p-8 text-center text-slate-400 text-xs font-bold leading-normal">
                                  No business listings match your query.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {auditSubTab === 'Blogs' && (
                      <div className="flex flex-col gap-4">
                        {blogs.map(b => (
                          <div key={b._id} className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 flex flex-col gap-4">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex flex-col text-left font-sans">
                                <span className="font-extrabold text-[#001c41] text-xs sm:text-[13px] leading-snug">{b.title}</span>
                                <span className="text-[9.5px] text-slate-400 font-bold mt-1 block">
                                  Author: {b.authorName} • Date: {new Date(b.createdAt).toLocaleDateString()}
                                </span>
                                <a
                                  href={`/blogs/${b._id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#027244] hover:text-[#005934] hover:underline font-black text-[10.5px] mt-1.5 flex items-center gap-1 w-fit cursor-pointer leading-none"
                                >
                                  View Details →
                                </a>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border ${
                                b.status === 'Approved' ? 'bg-emerald-50 border-emerald-250 text-emerald-700' : 'bg-amber-50 border-amber-250 text-amber-600 animate-pulse'
                              }`}>
                                {b.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-3xl text-justify">{b.content}</p>
                            
                            <div className="flex justify-end gap-2 border-t border-slate-200/50 pt-3">
                              <button 
                                onClick={() => handleBlogAction(b._id, 'Rejected')}
                                disabled={b.status === 'Rejected'}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-650 font-extrabold text-[10.5px] rounded-xl cursor-pointer disabled:opacity-40 shadow-2xs"
                              >
                                Reject
                              </button>
                              <button 
                                onClick={() => handleBlogAction(b._id, 'Approved')}
                                disabled={b.status === 'Approved'}
                                className="px-4 py-1.5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer disabled:opacity-40 shadow-sm shadow-emerald-800/10"
                              >
                                Approve & Publish
                              </button>
                            </div>
                          </div>
                        ))}
                        {blogs.length === 0 && (
                          <div className="p-8 text-center text-slate-400 text-xs font-bold bg-slate-50 rounded-2xl">
                            No blogs waiting for verification.
                          </div>
                        )}
                      </div>
                    )}

                    {auditSubTab === 'Events' && (
                      <div className="flex flex-col gap-4">
                        {events.map(e => (
                          <div key={e._id} className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 flex flex-col gap-4">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex flex-col text-left font-sans">
                                <span className="font-extrabold text-[#001c41] text-xs sm:text-[13px] leading-snug">{e.title}</span>
                                <span className="text-[9.5px] text-slate-450 font-bold mt-1 block">
                                  Organizer: {e.organizer} • Date: {e.date} • Venue: {e.venue}
                                </span>
                                <a
                                  href="/events"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#027244] hover:text-[#005934] hover:underline font-black text-[10.5px] mt-1.5 flex items-center gap-1 w-fit cursor-pointer leading-none"
                                >
                                  View Details →
                                </a>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border ${
                                e.status === 'Approved' ? 'bg-emerald-50 border-emerald-250 text-emerald-700' : 'bg-amber-50 border-amber-250 text-amber-600 animate-pulse'
                              }`}>
                                {e.status}
                              </span>
                            </div>
                            
                            <div className="flex justify-end gap-2 border-t border-slate-200/50 pt-3">
                              <button 
                                onClick={() => handleEventAction(e._id, 'Rejected')}
                                disabled={e.status === 'Rejected'}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-650 font-extrabold text-[10.5px] rounded-xl cursor-pointer disabled:opacity-40 shadow-2xs"
                              >
                                Reject
                              </button>
                              <button 
                                onClick={() => handleEventAction(e._id, 'Approved')}
                                disabled={e.status === 'Approved'}
                                className="px-4 py-1.5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer disabled:opacity-40 shadow-sm"
                              >
                                Approve & Publish
                              </button>
                            </div>
                          </div>
                        ))}
                        {events.length === 0 && (
                          <div className="p-8 text-center text-slate-400 text-xs font-bold bg-slate-50 rounded-2xl">
                            No events waiting for verification.
                          </div>
                        )}
                      </div>
                    )}

                    {auditSubTab === 'Testimonials' && (
                      <div className="flex flex-col gap-4">
                        {reviews.map(r => (
                          <div key={r._id} className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 flex justify-between items-center gap-6">
                            <div className="flex items-start gap-4">
                              <div className="h-10 w-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center font-black text-slate-600 text-xs">
                                {r.authorName.charAt(0)}
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="font-extrabold text-xs text-slate-800 leading-none">{r.authorName} on {r.businessName}</span>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                  <div className="flex text-amber-400 gap-0.5 shrink-0">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`h-3 w-3 ${i < r.rating ? 'fill-current' : 'text-slate-200'}`} />
                                    ))}
                                  </div>
                                  {r.status === 'flagged' && <span className="bg-red-50 border border-red-150 text-red-650 text-[7.5px] font-black uppercase px-1 py-0.5 rounded leading-none shrink-0 animate-pulse">SPAM FLAG</span>}
                                </div>
                                <p className="text-[11.5px] text-slate-500 font-semibold mt-2 max-w-2xl leading-relaxed">{r.text}</p>
                              </div>
                            </div>

                            <button 
                              onClick={() => handleReviewAction(r._id, 'delete')}
                              className="h-10 w-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-650 flex items-center justify-center shrink-0 shadow-2xs transition-colors cursor-pointer"
                              title="Purge Review"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        ))}
                        {reviews.length === 0 && (
                          <div className="p-8 text-center text-slate-400 text-xs font-bold bg-slate-50 rounded-2xl">
                            No active reviews to display.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: BUSINESSES MANAGEMENT */}
              {activeTab === 'Businesses' && (
                <div className="flex flex-col gap-6 text-left">
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col">
                      <h3 className="font-extrabold text-[#001c41] text-base">Registrations Directory</h3>
                      <span className="text-[10px] text-slate-450 font-semibold mt-0.5">Audit, suspend, or update registered listings across the town division</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200/80 shadow-xs rounded-[28px] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-xs font-semibold text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[9px] font-black text-slate-450 tracking-wider">
                          <tr>
                            <th className="p-4.5">Business / Owner</th>
                            <th className="p-4.5">Category / Locality</th>
                            <th className="p-4.5">Pincode</th>
                            <th className="p-4.5">Verification</th>
                            <th className="p-4.5">Subscription</th>
                            <th className="p-4.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {filteredBusinesses.map(b => (
                            <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4.5 flex items-center gap-3">
                                <div className="h-9 w-9 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                                  <img src={b.coverImageUrl} className="h-full w-full object-cover" alt={b.name} />
                                </div>
                                <div className="flex flex-col text-left">
                                  <span className="font-extrabold text-slate-800 text-xs leading-none">{b.name}</span>
                                  <span className="text-[9.5px] text-slate-400 font-bold mt-1 leading-none">Owner: {b.ownerName}</span>
                                </div>
                              </td>
                              <td className="p-4.5">
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-700 text-xs">{b.type}</span>
                                  <span className="text-[9.5px] text-slate-400 mt-1">{b.locality}</span>
                                </div>
                              </td>
                              <td className="p-4.5 font-bold text-slate-800">{b.pincode}</td>
                              <td className="p-4.5">
                                <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border ${
                                  b.status === 'Approved'
                                    ? 'bg-emerald-50 border-emerald-250 text-emerald-700'
                                    : b.status === 'Rejected'
                                      ? 'bg-red-50 border-red-200 text-red-650'
                                      : 'bg-amber-50 border-amber-250 text-amber-600 animate-pulse'
                                }`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="p-4.5">
                                <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border ${
                                  b.subscriptionStatus === 'active'
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    : 'bg-red-50 border-red-200 text-red-650'
                                }`}>
                                  {b.subscriptionStatus}
                                </span>
                              </td>
                              <td className="p-4.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <a 
                                    href={`/businesses/${b._id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[10.5px] font-extrabold text-center leading-none shadow-2xs"
                                  >
                                    View Profile
                                  </a>
                                  <button 
                                    onClick={() => handleAction(b._id, 'approve')}
                                    disabled={b.status === 'Approved'}
                                    className="px-2.5 py-1.5 bg-[#027244] hover:bg-[#005934] text-white rounded-lg text-[10.5px] font-extrabold cursor-pointer disabled:opacity-40"
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    onClick={() => handleAction(b._id, 'reject')}
                                    disabled={b.status === 'Rejected'}
                                    className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg text-[10.5px] font-extrabold cursor-pointer disabled:opacity-40"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PENDING APPROVALS LIST */}
              {activeTab === 'Pending Approvals' && (
                <div className="flex flex-col gap-6 text-left">
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
                    <h3 className="font-extrabold text-[#001c41] text-base">Pending Approvals Desk</h3>
                    <span className="text-[10px] text-slate-450 font-semibold mt-0.5">Showcasing registrations waiting to be approved or under review</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {businesses.filter(b => b.status === 'Pending Verification' || b.status === 'Under Review').map(b => (
                      <div key={b._id} className="bg-white border border-slate-200 shadow-sm rounded-3xl p-5 flex flex-col justify-between gap-5 hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                          <div className="h-16 w-16 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
                            <img src={b.coverImageUrl} className="h-full w-full object-cover" alt={b.name} />
                          </div>
                          <div className="flex flex-col gap-1 text-left min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-sm text-[#001c41] truncate leading-none">{b.name}</h4>
                              {b.googlePlaceId && <span className="bg-blue-50 border border-blue-150 text-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase shrink-0">Google</span>}
                            </div>
                            <span className="text-xs text-emerald-650 font-bold mt-1 leading-none">{b.type}</span>
                            <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-semibold">
                              <MapPin className="h-3 w-3 text-slate-400 shrink-0" /> {b.address}
                            </span>
                          </div>
                        </div>

                        {/* Specs quick cards row */}
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 p-2.5 rounded-2xl">
                          <div className="flex flex-col gap-0.5 border-r border-slate-200">
                            <span className="text-[8px] text-slate-400 font-extrabold uppercase">Pincode</span>
                            <span className="font-extrabold text-slate-800">{b.pincode}</span>
                          </div>
                          <div className="flex flex-col gap-0.5 border-r border-slate-200">
                            <span className="text-[8px] text-slate-400 font-extrabold uppercase">G-Rating</span>
                            <span className="font-extrabold text-slate-800">{b.googleRating || 'N/A'}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] text-slate-400 font-extrabold uppercase">Timings</span>
                            <span className="font-extrabold text-slate-800 truncate">9AM - 8PM</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-100 pt-3.5 gap-2">
                          <button 
                            onClick={() => { setSelectedBiz(b); setShowBizModal(true); }}
                            className="text-xs font-bold text-slate-550 hover:text-slate-800 flex items-center gap-0.5 cursor-pointer"
                          >
                            <Eye className="h-4 w-4 text-slate-400" /> View details
                          </button>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleAction(b._id, 'reject')}
                              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-650 font-extrabold text-[10.5px] rounded-xl cursor-pointer"
                            >
                              Reject
                            </button>
                            <button 
                              onClick={() => handleAction(b._id, 'approve')}
                              className="px-4.5 py-2 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer shadow shadow-emerald-800/10"
                            >
                              Approve listing
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {businesses.filter(b => b.status === 'Pending Verification' || b.status === 'Under Review').length === 0 && (
                      <div className="col-span-2 bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 flex flex-col items-center gap-3">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600 animate-bounce" />
                        <span className="text-sm font-bold text-slate-800 font-sans">Queue Empty!</span>
                        <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs">There are no pending business listings waiting for administrative approval today.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* TAB: BLOGS MODERATION */}
              {activeTab === 'Blogs' && (
                <div className="flex flex-col gap-6 text-left">
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
                    <h3 className="font-extrabold text-[#001c41] text-base">Blogs Moderation Desk</h3>
                    <span className="text-[10px] text-slate-450 font-semibold mt-0.5">Audit community blogs, feature written items, or filter spam</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...blogs]
                      .sort((a, b) => getStatusWeight(a.status) - getStatusWeight(b.status) || new Date(b.createdAt) - new Date(a.createdAt))
                      .map(b => (
                      <div 
                        key={b._id} 
                        onClick={() => { setSelectedBlogModal(b); setSuggestionText(b.revisionSuggestions || ''); }}
                        className="bg-white border border-slate-200 hover:border-slate-350 hover:shadow-md rounded-[24px] p-5 shadow-2xs transition-all flex flex-col justify-between gap-4 cursor-pointer text-left group"
                      >
                        <div className="flex gap-4">
                          {b.coverImage && (
                            <div className="h-16 w-20 rounded-xl overflow-hidden border border-slate-100 shrink-0 select-none">
                              <img src={b.coverImage} className="w-full h-full object-cover" alt="Blog Cover" />
                            </div>
                          )}
                          <div className="flex flex-col min-w-0 text-left">
                            <span className="font-extrabold text-[#001c41] text-xs sm:text-[13px] leading-snug truncate group-hover:text-[#027244] transition-colors">{b.title}</span>
                            <span className="text-[9.5px] text-slate-405 font-bold mt-1">Author: {b.authorName} • {new Date(b.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-1">
                          <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border ${
                            b.status === 'Approved' 
                              ? 'bg-emerald-50 border-emerald-250 text-emerald-700' 
                              : b.status === 'Pending Approval' || b.status === 'Needs Revision'
                                ? 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse'
                                : b.status === 'Rejected'
                                  ? 'bg-rose-50 border-rose-200 text-rose-650'
                                  : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}>
                            {b.status}
                          </span>
                          <span className="text-[10.5px] font-extrabold text-[#027244] flex items-center gap-1 group-hover:underline">
                            Touch to Audit & Moderate →
                          </span>
                        </div>
                      </div>
                    ))}
                    {blogs.length === 0 && (
                      <div className="col-span-2 bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 flex flex-col items-center gap-3">
                        <BookOpen className="h-10 w-10 text-emerald-600 animate-pulse" />
                        <span className="text-sm font-bold text-slate-800 font-sans">No Blogs Yet</span>
                        <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs">There are no blog posts currently available in the moderation system.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: EVENTS MODERATION */}
              {activeTab === 'Events' && (
                <div className="flex flex-col gap-6 text-left">
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
                    <h3 className="font-extrabold text-[#001c41] text-base">Community Events Moderation</h3>
                    <span className="text-[10px] text-slate-450 font-semibold mt-0.5">Moderate event list sub-streams to maintain community relevance</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map(e => (
                      <div key={e._id} className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-2xs flex flex-col gap-4 justify-between">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex flex-col text-left">
                            <h4 className="font-extrabold text-sm text-[#001c41] leading-none">{e.title}</h4>
                            <span className="text-[9.5px] text-slate-400 font-bold mt-1.5 leading-none">Organizer: {e.organizer}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[8.5px] font-black border ${
                            e.status === 'Approved' ? 'bg-emerald-50 border-emerald-250 text-emerald-700' : 'bg-amber-50 border-amber-250 text-amber-600'
                          }`}>
                            {e.status}
                          </span>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-[10.5px] font-bold text-slate-600 flex flex-col gap-1.5">
                          <div>📅 Date: <span className="text-slate-800">{e.date}</span></div>
                          <div>📍 Venue: <span className="text-slate-800">{e.venue}</span></div>
                          <div>🎭 Category: <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">{e.category}</span></div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                          <button 
                            onClick={() => handleEventAction(e._id, 'Rejected')}
                            disabled={e.status === 'Rejected'}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-650 font-extrabold text-[10.5px] rounded-xl cursor-pointer disabled:opacity-40"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => handleEventAction(e._id, 'Approved')}
                            disabled={e.status === 'Approved'}
                            className="px-4 py-1.5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer disabled:opacity-40 shadow-sm"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: REVIEWS FEED */}
              {activeTab === 'Reviews' && (
                <div className="flex flex-col gap-6 text-left">
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
                    <h3 className="font-extrabold text-[#001c41] text-base">Ratings & Reviews Moderation</h3>
                    <span className="text-[10px] text-slate-450 font-semibold mt-0.5">Purge spam, review duplicates, or filter inappropriate content</span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {reviews.map(r => (
                      <div key={r._id} className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-2xs flex justify-between items-center gap-6">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center font-black text-slate-600 text-xs">
                            {r.authorName.charAt(0)}
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="font-extrabold text-xs text-slate-800 leading-none">{r.authorName} on {r.businessName}</span>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <div className="flex text-amber-400 gap-0.5 shrink-0">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-3 w-3 ${i < r.rating ? 'fill-current' : 'text-slate-200'}`} />
                                ))}
                              </div>
                              {r.status === 'flagged' && <span className="bg-red-50 border border-red-150 text-red-650 text-[7.5px] font-black uppercase px-1 py-0.5 rounded leading-none shrink-0 animate-pulse">SPAM FLAG</span>}
                            </div>
                            <p className="text-[11.5px] text-slate-500 font-semibold mt-2 max-w-2xl leading-relaxed">{r.text}</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleReviewAction(r._id, 'delete')}
                          className="h-10 w-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-650 flex items-center justify-center shrink-0 shadow-2xs transition-colors cursor-pointer"
                          title="Purge Spam Review"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: SUBSCRIPTIONS */}
              {activeTab === 'Subscriptions' && (
                <div className="flex flex-col gap-6 text-left">
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
                    <h3 className="font-extrabold text-[#001c41] text-base">Subscription Billings & Billing Audit</h3>
                    <span className="text-[10px] text-slate-450 font-semibold mt-0.5">Review active premium accounts, manually activate plans, or suspend exipries</span>
                  </div>

                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden">
                    <table className="w-full text-left text-xs font-semibold text-slate-600">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[9px] font-black text-slate-450 uppercase tracking-widest">
                        <tr>
                          <th className="p-4">Business Name</th>
                          <th className="p-4">Plan Type</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Expiry Date</th>
                          <th className="p-4 text-right">Manual Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {businesses.map(b => (
                          <tr key={b._id} className="hover:bg-slate-50/50">
                            <td className="p-4 font-bold text-slate-800">{b.name}</td>
                            <td className="p-4">{b.subscriptionStatus === 'active' ? 'Premium Package' : 'Basic Tier'}</td>
                            <td className="p-4 font-extrabold text-slate-800">
                              {b.subscriptionStatus === 'active' ? '₹499 / Mon' : '₹0'}
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wide border ${
                                b.subscriptionStatus === 'active' ? 'bg-emerald-50 border-emerald-250 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'
                              }`}>
                                {b.subscriptionStatus}
                              </span>
                            </td>
                            <td className="p-4 font-bold text-slate-500">
                              {b.subscriptionExpiry ? new Date(b.subscriptionExpiry).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="p-4 text-right">
                              <button 
                                onClick={() => handleManualSubscription(b._id)}
                                disabled={b.subscriptionStatus === 'active'}
                                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer disabled:opacity-40 shadow-sm"
                              >
                                Activate 30 Days
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: NOTIFICATIONS HUB */}
              {activeTab === 'Notifications' && (
                <div className="flex flex-col gap-6 text-left">
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
                    <h3 className="font-extrabold text-[#001c41] text-base">Merchant Alerts & Notifications Broadcast</h3>
                    <span className="text-[10px] text-slate-450 font-semibold mt-0.5">Send alerts, announcements, maintenance alerts, or expiry warnings directly</span>
                  </div>

                  <div className="max-w-xl mx-auto w-full bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 flex flex-col gap-5">
                    <span className="font-extrabold text-sm text-slate-800 border-b border-slate-100 pb-2.5">Compose System Alert</span>
                    
                    {noticeSuccess && (
                      <div className="bg-emerald-50 border border-emerald-200 text-[#027244] rounded-xl p-3 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                        <span>System alert broadcast successfully to all active UBT merchants!</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Alert Category</label>
                      <select 
                        value={newNotice.type}
                        onChange={(e) => setNewNotice({ ...newNotice, type: e.target.value })}
                        className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20 cursor-pointer animate-fadeIn"
                      >
                        <option value="announcement">Global Announcement</option>
                        <option value="maintenance">Maintenance Warning</option>
                        <option value="billing">Subscription Billing Reminder</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Subject Title</label>
                      <input 
                        type="text"
                        placeholder="e.g. Scheduled System Upgrade Tonight"
                        value={newNotice.title}
                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                        className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/20 focus:outline-none focus:border-[#027244]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Notification Body Message</label>
                      <textarea 
                        rows={4}
                        placeholder="Detail the announcement details inside town limits..."
                        value={newNotice.message}
                        onChange={(e) => setNewNotice({ ...newNotice, message: e.target.value })}
                        className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/20 focus:outline-none focus:border-[#027244] resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (!newNotice.title || !newNotice.message) return;
                        setNoticeSuccess(true);
                        setNewNotice({ title: '', message: '', type: 'announcement' });
                        setTimeout(() => setNoticeSuccess(false), 4000);
                      }}
                      disabled={!newNotice.title || !newNotice.message}
                      className="py-3 px-6 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                    >
                      Broadcast Message
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: REPORTS */}
              {activeTab === 'Reports' && (
                <div className="flex flex-col gap-6 text-left">
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
                    <h3 className="font-extrabold text-[#001c41] text-base">Growth & Approval Trends Audit</h3>
                    <span className="text-[10px] text-slate-450 font-semibold mt-0.5">Overview of business registration ratios, active categories, and reviews counts</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stat 1 */}
                    <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-2xs text-left flex flex-col gap-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Business Approval Ratio</span>
                      <span className="text-3xl font-black text-[#001c41] leading-none">80% Approved</span>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '80%' }} />
                      </div>
                      <span className="text-[10.5px] font-bold text-slate-500">4 of 5 businesses verified active</span>
                    </div>

                    {/* Stat 2 */}
                    <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-2xs text-left flex flex-col gap-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Subscriptions</span>
                      <span className="text-3xl font-black text-[#027244] leading-none">60% Premium</span>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
                      </div>
                      <span className="text-[10.5px] font-bold text-slate-500">3 of 5 listings unlocked lead buttons</span>
                    </div>

                    {/* Stat 3 */}
                    <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-2xs text-left flex flex-col gap-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Ratings Vetted Rate</span>
                      <span className="text-3xl font-black text-purple-700 leading-none">50% Vetted</span>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '50%' }} />
                      </div>
                      <span className="text-[10.5px] font-bold text-slate-500">1 spam review purged from listings</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: QUERIES INBOX */}
              {activeTab === 'Queries' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn font-sans">
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col text-left font-sans">
                      <h3 className="font-extrabold text-[#001c41] text-base leading-tight">User Queries Inbox</h3>
                      <span className="text-[10px] text-slate-400 font-semibold mt-1">Vetting customer messages, support requests, and business badges enquiries</span>
                    </div>
                    {/* Tabs for query filter */}
                    <div className="bg-slate-100/60 p-1 rounded-xl flex items-center shrink-0 border border-slate-200/30">
                      {['All', 'Pending', 'Replied'].map(status => (
                        <button
                          key={status}
                          onClick={() => setQueryFilter(status)}
                          className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                            queryFilter === status
                              ? 'bg-[#027244] text-white shadow-sm shadow-emerald-950/15'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {status} Messages
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search and stats bar */}
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-5 flex flex-col sm:flex-row gap-4 justify-between items-center font-sans">
                    <div className="w-full sm:max-w-md bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2">
                      <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Search queries by name, email, subject..."
                        value={querySearch}
                        onChange={(e) => setQuerySearch(e.target.value)}
                        className="w-full bg-transparent text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-4.5 text-[10.5px] font-bold text-slate-500">
                      <span>Total: <b className="text-[#001c41] font-black">{queries.length}</b></span>
                      <span>Pending: <b className="text-amber-650 font-black">{queries.filter(q => q.status === 'Pending').length}</b></span>
                      <span>Replied: <b className="text-[#027244] font-black">{queries.filter(q => q.status === 'Replied').length}</b></span>
                    </div>
                  </div>

                  {/* Query cards list */}
                  <div className="flex flex-col gap-5">
                    {queries
                      .filter(q => {
                        if (queryFilter === 'Pending') return q.status === 'Pending';
                        if (queryFilter === 'Replied') return q.status === 'Replied';
                        return true;
                      })
                      .filter(q => {
                        const search = querySearch.toLowerCase();
                        return (
                          q.name.toLowerCase().includes(search) ||
                          q.email.toLowerCase().includes(search) ||
                          q.subject.toLowerCase().includes(search) ||
                          q.message.toLowerCase().includes(search)
                        );
                      })
                      .map((q) => {
                        const isPending = q.status === 'Pending';
                        return (
                          <div
                            key={q._id}
                            className="bg-white border border-slate-200 shadow-sm hover:shadow-lg rounded-3xl p-6 flex flex-col md:flex-row justify-between gap-6 transition-all animate-fadeIn"
                          >
                            <div className="flex-1 flex flex-col gap-3">
                              {/* Query header */}
                              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-3">
                                  <div className="h-9 w-9 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center font-black text-[#027244] text-xs font-sans shrink-0">
                                    {q.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex flex-col text-left">
                                    <span className="font-extrabold text-slate-800 text-xs sm:text-[13px] leading-tight">{q.name}</span>
                                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">{q.email}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[10.5px] text-slate-400 font-semibold flex items-center gap-1 font-sans">
                                    <Clock className="h-3.5 w-3.5" />
                                    {new Date(q.createdAt).toLocaleString()}
                                  </span>
                                  <span className={`px-2.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border ${
                                    isPending
                                      ? 'bg-amber-50 border-amber-250 text-amber-600 animate-pulse'
                                      : 'bg-emerald-50 border-emerald-250 text-emerald-700'
                                  }`}>
                                    {q.status}
                                  </span>
                                </div>
                              </div>

                              {/* Query subject and message */}
                              <div className="text-left flex flex-col gap-1.5 font-sans">
                                <span className="font-extrabold text-[#001c41] text-[13px]">{q.subject}</span>
                                <p className="text-xs text-slate-505 font-semibold leading-relaxed mt-1 text-justify max-w-4xl">{q.message}</p>
                              </div>

                              {/* Reply content if Replied */}
                              {!isPending && q.replyMessage && (
                                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-left flex flex-col gap-2 mt-2 animate-fadeIn">
                                  <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                    <span>✓ Admin Response</span>
                                    <span>{q.repliedAt ? new Date(q.repliedAt).toLocaleString() : ''}</span>
                                  </div>
                                  <p className="text-xs text-slate-600 font-bold leading-relaxed">{q.replyMessage}</p>
                                </div>
                              )}
                            </div>

                            {/* Actions Column */}
                            <div className="flex md:flex-col justify-end md:justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-200/50 pt-4 md:pt-0 md:pl-5 shrink-0 md:w-36 font-sans">
                              {isPending ? (
                                <button
                                  onClick={() => { setSelectedQuery(q); setShowReplyModal(true); }}
                                  className="w-full py-2 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                                >
                                  <Mail className="h-3.5 w-3.5" />
                                  <span>Send Reply</span>
                                </button>
                              ) : (
                                <span className="w-full py-2 bg-slate-100 text-slate-400 border border-slate-200 font-extrabold text-[10px] rounded-xl flex items-center justify-center select-none text-center leading-none">
                                  Replied Vetted
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                    {queries.filter(q => {
                      if (queryFilter === 'Pending') return q.status === 'Pending';
                      if (queryFilter === 'Replied') return q.status === 'Replied';
                      return true;
                    }).length === 0 && (
                      <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 flex flex-col items-center gap-3">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600 animate-bounce" />
                        <span className="text-sm font-bold text-slate-800 font-sans">No Messages!</span>
                        <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs">There are no queries matching your filter options at this time.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </main>

      {/* 3. BUSINESS DETAIL REVIEW SLIDE-OVER MODAL */}
      {showBizModal && selectedBiz && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-end p-0">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-slideLeft text-left font-sans">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Vetting Workspace</span>
                <h3 className="font-extrabold text-slate-800 text-base mt-1">{selectedBiz.name}</h3>
              </div>
              <button 
                onClick={() => { setShowBizModal(false); setSelectedBiz(null); }}
                className="h-8.5 w-8.5 rounded-xl hover:bg-slate-200/80 flex items-center justify-center text-slate-450 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 flex-grow overflow-y-auto flex flex-col gap-6">
              
              {/* Cover Image */}
              <div className="h-44 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-2xs relative bg-slate-50 shrink-0">
                <img src={selectedBiz.coverImageUrl} className="w-full h-full object-cover" alt={selectedBiz.name} />
              </div>

              {/* View Full Profile Direct Link */}
              <a
                href={`/businesses/${selectedBiz._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl text-center shadow shadow-emerald-800/10 block shrink-0 cursor-pointer transition-colors"
              >
                Open Entire Profile Page ↗
              </a>

              {/* Status details indicators */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-3.5 text-xs font-bold text-slate-600 flex flex-col gap-0.5">
                  <span className="text-[8.5px] text-slate-400 font-extrabold uppercase">Vetting Status</span>
                  <span className="text-slate-800 mt-1 font-extrabold">{selectedBiz.status}</span>
                </div>
                <div className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-3.5 text-xs font-bold text-slate-600 flex flex-col gap-0.5">
                  <span className="text-[8.5px] text-slate-400 font-extrabold uppercase">Sub-Status</span>
                  <span className="text-slate-800 mt-1 font-extrabold">{selectedBiz.subscriptionStatus === 'active' ? 'Premium Active' : 'Basic Tier'}</span>
                </div>
              </div>

              {/* Owner and Contact parameters */}
              <div className="flex flex-col gap-3.5">
                <span className="font-extrabold text-xs text-slate-800 border-b border-slate-100 pb-1.5 uppercase tracking-wider">Contact & Registration</span>
                
                <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span>Merchant Full Name</span>
                    <span className="font-bold text-slate-800">{selectedBiz.ownerName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span>Mobile Phone</span>
                    <span className="font-bold text-slate-800">{selectedBiz.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span>Email Address</span>
                    <span className="font-bold text-slate-800">{selectedBiz.email || 'N/A'}</span>
                  </div>
                  {selectedBiz.website && (
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span>Website</span>
                      <span className="font-bold text-emerald-700">{selectedBiz.website}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Location parameters */}
              <div className="flex flex-col gap-3.5">
                <span className="font-extrabold text-xs text-slate-800 border-b border-slate-100 pb-1.5 uppercase tracking-wider">Location Parameters</span>
                
                <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span>Street Address</span>
                    <span className="font-bold text-slate-805 text-right">{selectedBiz.address}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span>Locality</span>
                    <span className="font-bold text-slate-805">{selectedBiz.locality}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span>Pincode Boundary</span>
                    <span className="font-bold text-slate-800">{selectedBiz.pincode}</span>
                  </div>
                </div>
              </div>

              {/* Uploaded Photos and Timings specifications */}
              <div className="flex flex-col gap-3.5">
                <span className="font-extrabold text-xs text-slate-800 border-b border-slate-100 pb-1.5 uppercase tracking-wider">Vetting Parameters</span>
                
                <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span>GST Number (Taxation)</span>
                    <span className="font-extrabold text-slate-800 tracking-wider">{selectedBiz.gstNumber || 'N/A (Cottage/Unregistered)'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span>Established Year</span>
                    <span className="font-bold text-slate-800">{selectedBiz.yearEstablished || '2012'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span>Staff count</span>
                    <span className="font-bold text-slate-800">{selectedBiz.employeeCount || '10 - 20'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span>Maps Connection PlaceId</span>
                    <span className="font-bold text-blue-650 truncate max-w-[150px]">{selectedBiz.googlePlaceId || 'Not connected'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Action Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3 shrink-0">
              <button 
                onClick={() => { handleAction(selectedBiz._id, 'reject'); setShowBizModal(false); }}
                disabled={selectedBiz.status === 'Rejected'}
                className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-650 font-extrabold text-xs rounded-xl cursor-pointer disabled:opacity-40 text-center"
              >
                Reject Listing
              </button>
              <button 
                onClick={() => { handleAction(selectedBiz._id, 'approve'); setShowBizModal(false); }}
                disabled={selectedBiz.status === 'Approved'}
                className="flex-1 py-3 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl cursor-pointer disabled:opacity-40 text-center shadow shadow-emerald-800/10"
              >
                Approve & Publish
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. REPLY TO QUERY MODAL */}
      {showReplyModal && selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-[28px] overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex flex-col text-left">
                <h3 className="font-extrabold text-slate-800 text-base font-sans">Draft Support Reply</h3>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Responding to query regarding "{selectedQuery.subject}"</span>
              </div>
              <button 
                onClick={() => { setShowReplyModal(false); setReplyText(''); }}
                className="h-8 w-8 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-550 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-5 text-left font-sans">
              {/* Original query review */}
              <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-[9.5px] font-black text-slate-400 uppercase tracking-wider">
                  <span>From: {selectedQuery.name} ({selectedQuery.email})</span>
                  <span>Received: {new Date(selectedQuery.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex flex-col gap-1 border-t border-slate-200/50 pt-2">
                  <span className="font-extrabold text-[#001c41] text-xs">Subject: {selectedQuery.subject}</span>
                  <p className="text-xs text-slate-550 leading-relaxed font-semibold mt-1 bg-white border border-slate-100 p-3.5 rounded-xl">{selectedQuery.message}</p>
                </div>
              </div>

              {/* Draft text area */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Your Reply message *</label>
                <span className="text-[9.5px] text-slate-400 font-medium">This message will be recorded in the system and mock emailed to the user.</span>
                <textarea
                  rows={6}
                  required
                  placeholder="Type your response here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full border border-slate-200 p-3.5 rounded-2xl text-xs font-semibold text-slate-700 bg-slate-50/20 focus:outline-none focus:border-[#027244] resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3 shrink-0 justify-end">
              <button 
                onClick={() => { setShowReplyModal(false); setReplyText(''); }}
                className="px-5 py-2.5 border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleQueryReply(selectedQuery._id)}
                disabled={replySubmitting || !replyText.trim()}
                className="px-6 py-2.5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow shadow-emerald-800/10"
              >
                {replySubmitting ? 'Sending...' : 'Send Reply'}
              </button>
            </div>

          </div>
        </div>
      )}
      {/* 5. BLOG MODERATION DETAILED POPUP MODAL */}
      {selectedBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-[28px] overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex flex-col text-left">
                <h3 className="font-extrabold text-slate-800 text-base font-sans">Blog Moderation Desk</h3>
                <span className="text-[10px] text-slate-450 font-semibold mt-0.5">Review full article content, draft suggestions or approve status.</span>
              </div>
              <button 
                onClick={() => { setSelectedBlogModal(null); setSuggestionText(''); }}
                className="h-8 w-8 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-550 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6 text-left font-sans">
              
              {/* Blog Title & Metadata */}
              <div className="flex flex-col gap-2">
                <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">
                  Submitted on {new Date(selectedBlogModal.createdAt).toLocaleString()} • Status: <span className={`font-extrabold ${
                    selectedBlogModal.status === 'Approved'
                      ? 'text-emerald-650'
                      : selectedBlogModal.status === 'Pending Approval' || selectedBlogModal.status === 'Needs Revision'
                        ? 'text-amber-600'
                        : selectedBlogModal.status === 'Rejected'
                          ? 'text-rose-600'
                          : 'text-slate-500'
                  }`}>{selectedBlogModal.status}</span>
                </span>
                <h2 className="font-extrabold text-xl text-[#001c41] leading-tight font-sans">{selectedBlogModal.title}</h2>
                
                {selectedBlogModal.author && (
                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600 font-semibold">
                    <span>✍️ Author: <strong className="text-slate-800">{selectedBlogModal.authorName}</strong></span>
                    <span>📧 {selectedBlogModal.author.email || 'N/A'}</span>
                    <span>📞 {selectedBlogModal.author.mobileNumber || selectedBlogModal.author.phone || 'N/A'}</span>
                    <span>Role: <strong className="text-emerald-700 uppercase">{selectedBlogModal.author.role || 'Writer'}</strong></span>
                  </div>
                )}
              </div>

              {/* Cover Image */}
              {selectedBlogModal.coverImage && (
                <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-100 shrink-0 select-none shadow-3xs">
                  <img src={selectedBlogModal.coverImage} className="w-full h-full object-cover" alt="Full Blog Cover" />
                </div>
              )}

              {/* Article Content */}
              <div className="flex flex-col gap-2">
                <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest leading-none">Article content</span>
                <p className="text-xs text-slate-655 leading-relaxed font-semibold bg-slate-50/40 border border-slate-100 p-4.5 rounded-2xl whitespace-pre-wrap text-justify">
                  {selectedBlogModal.content}
                </p>
              </div>

              {/* Suggestions Panel */}
              <div className="border-t border-slate-150 pt-5 flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none flex items-center gap-1.5">
                    💡 Revision Suggestions & Chat History
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-semibold mt-1">Discuss corrections or request changes with the writer.</span>
                </div>

                {/* Revision Chat History Stream */}
                {selectedBlogModal.revisionHistory && selectedBlogModal.revisionHistory.length > 0 && (
                  <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto border border-slate-150 rounded-2xl p-4.5 bg-slate-50/50">
                    {selectedBlogModal.revisionHistory.map((item, idx) => {
                      const isAdmin = item.senderRole === 'admin' || item.senderRole === 'superadmin';
                      return (
                        <div 
                          key={idx} 
                          className={`flex flex-col max-w-[85%] rounded-2xl p-3 border text-xs leading-relaxed ${
                            isAdmin 
                              ? 'bg-amber-50 border-amber-100 self-end text-amber-900 text-right' 
                              : 'bg-emerald-50/50 border-emerald-250/20 self-start text-[#001c41] text-left'
                          }`}
                        >
                          <div className={`flex items-center gap-3.5 mb-1 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                            <span className="font-extrabold text-[8.5px] uppercase tracking-wider text-slate-450">
                              {item.senderName} ({isAdmin ? 'Admin' : 'Writer'})
                            </span>
                            <span className="text-[8.5px] text-slate-405 font-bold">
                              {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="font-semibold whitespace-pre-wrap leading-snug">{item.message}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <textarea
                  rows={3}
                  placeholder="Type changes, additions, or reply to writer..."
                  value={suggestionText}
                  onChange={(e) => setSuggestionText(e.target.value)}
                  className="w-full border border-slate-200 p-3.5 rounded-2xl text-xs font-semibold text-slate-700 bg-slate-50/10 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-50 resize-none leading-relaxed"
                />
                
                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      if (!suggestionText.trim()) {
                        alert("Please type suggestions before requesting revision.");
                        return;
                      }
                      handleBlogAction(selectedBlogModal._id, 'Needs Revision', suggestionText);
                      setSuggestionText('');
                      setSelectedBlogModal(null);
                    }}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl cursor-pointer flex items-center gap-1 shadow-xs transition-colors"
                  >
                    Send Suggestions to Writer (Needs Revision)
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3 shrink-0 justify-between items-center">
              <button 
                onClick={() => {
                  if (confirm("Are you sure you want to permanently delete this blog post? This action cannot be undone.")) {
                    handleBlogDelete(selectedBlogModal._id);
                    setSelectedBlogModal(null);
                  }
                }}
                className="px-4 py-2.5 bg-red-550/10 border border-red-550/20 hover:bg-red-550/20 text-red-650 font-extrabold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Delete Post
              </button>

              <div className="flex gap-2">
                <button 
                  onClick={() => { setSelectedBlogModal(null); setSuggestionText(''); }}
                  className="px-4.5 py-2.5 border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    handleBlogAction(selectedBlogModal._id, 'Rejected');
                    setSelectedBlogModal(null);
                  }}
                  disabled={selectedBlogModal.status === 'Rejected'}
                  className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer disabled:opacity-40 transition-colors"
                >
                  Reject & Hide
                </button>
                <button 
                  onClick={() => {
                    handleBlogAction(selectedBlogModal._id, 'Approved');
                    setSelectedBlogModal(null);
                  }}
                  disabled={selectedBlogModal.status === 'Approved'}
                  className="px-5 py-2.5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl cursor-pointer disabled:opacity-40 transition-all shadow shadow-emerald-800/10"
                >
                  Approve & Publish
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
