import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, ToggleLeft, RefreshCw, Star, HelpCircle, Check, X, AlertCircle, AlertTriangle, 
  ArrowRight, Eye, Grid, Shield, CreditCard, LayoutDashboard, Store, BookOpen, Calendar, 
  MessageSquare, CreditCard as CardIcon, Bell, BarChart3, Settings, LogOut, Search, User, 
  MapPin, ChevronRight, Landmark, Trash2, Mail, Globe, Award, ShieldAlert, CheckCircle2,
  Clock, Plus, Filter, ShieldCheck as ShieldOk, Activity, Cpu, Database, Terminal, Gift, Smile
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const formatEventDateRange = (startDate, endDate) => {
    if (!startDate) return 'N/A';
    const startStr = new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    if (!endDate) return startStr;
    const endStr = new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    if (startStr === endStr) return startStr;
    return `${startStr} - ${endStr}`;
  };

  const getStatusWeight = (status) => {
    if (status === 'Pending Approval' || status === 'Pending Review' || status === 'Pending Verification' || status === 'Under Review') return 0;
    if (status === 'Needs Revision') return 1;
    if (status === 'Approved') return 2;
    if (status === 'Rejected') return 3;
    return 4;
  };

  const getEventSortWeight = (e) => {
    const isExpired = new Date(e.endDate || e.date) < new Date();
    if (isExpired) return 3; // Expired goes to bottom
    const statusLower = e.status?.toLowerCase();
    if (statusLower === 'pending review' || statusLower === 'pending approval' || statusLower === 'pending') return 0; // Top pending
    if (statusLower === 'approved') return 1; // Middle approved
    return 2; // Bottom rejected/other non-expired
  };
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  
  // Tab navigation state
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [auditSubTab, setAuditSubTab] = useState('Businesses'); // Businesses | Blogs | Testimonials
  const [pendingSubTab, setPendingSubTab] = useState('Businesses'); // Businesses | Blogs | Events
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Datasets states
  const [businesses, setBusinesses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [subscriptionTab, setSubscriptionTab] = useState('override');
  const [notifications, setNotifications] = useState([]);
  const [reportsData, setReportsData] = useState({});
  const [pendingCategories, setPendingCategories] = useState([]);
  const [presetCategories, setPresetCategories] = useState([]);

  // Slide-over Modal State
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [showBizModal, setShowBizModal] = useState(false);
  
  // Blog Moderation Modal State
  const [selectedBlogModal, setSelectedBlogModal] = useState(null);
  const [suggestionText, setSuggestionText] = useState('');

  // Selected business branches for moderation
  const [selectedBizBranches, setSelectedBizBranches] = useState([]);
  const [selectedBizBranchesLoading, setSelectedBizBranchesLoading] = useState(false);
  
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

  // Referral System states
  const [referrals, setReferrals] = useState([]);
  const [referralsLoading, setReferralsLoading] = useState(false);
  const [referralsError, setReferralsError] = useState('');
  const [referralFilter, setReferralFilter] = useState('All'); // All | Pending | Completed | Rejected
  const [referralSearch, setReferralSearch] = useState('');

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

  const fetchReferrals = async () => {
    setReferralsLoading(true);
    setReferralsError('');
    try {
      const activeToken = localStorage.getItem('ubt_token');
      const res = await fetch('http://localhost:5000/api/referrals/admin/all', {
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setReferrals(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch referrals.');
      }
    } catch (err) {
      console.warn('API error, using realistic mockup referrals.', err);
      const mockRefs = [
        {
          _id: 'ref1',
          referrerId: { fullName: 'Aravind Swamy', email: 'aravind@gmail.com', mobileNumber: '9443211111' },
          referredUserId: { fullName: 'Balaji Sweet Stall Owner', email: 'balaji@gmail.com', mobileNumber: '9876543210' },
          referredBusinessId: { name: 'Balaji Sweet Stall', gstNumber: '33AAAAA1111A1Z1', phone: '9876543210', status: 'Pending Verification', subscriptionStatus: 'active' },
          status: 'pending',
          points: 100,
          antiFraudChecks: { selfReferral: false, duplicateMobile: true, duplicateGST: false, duplicateBusiness: false },
          createdAt: new Date().toISOString()
        },
        {
          _id: 'ref2',
          referrerId: { fullName: 'Lakshmi Textiles', email: 'lakshmi@gmail.com', mobileNumber: '9443599999' },
          referredUserId: { fullName: 'Sri Murugan Stores Owner', email: 'murugan@gmail.com', mobileNumber: '9123456780' },
          referredBusinessId: { name: 'Sri Murugan Stores', gstNumber: '33BBBBB2222B2Z2', phone: '9123456780', status: 'Approved', subscriptionStatus: 'active' },
          status: 'completed',
          points: 100,
          antiFraudChecks: { selfReferral: false, duplicateMobile: false, duplicateGST: false, duplicateBusiness: false },
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setReferrals(mockRefs);
    } finally {
      setReferralsLoading(false);
    }
  };

  const handleReferralModerate = async (referralId, action, rejectionReason = '') => {
    try {
      const activeToken = localStorage.getItem('ubt_token');
      const res = await fetch('http://localhost:5000/api/referrals/admin/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({ referralId, action, rejectionReason })
      });
      const data = await res.json();
      if (data.success) {
        setReferrals(prev => prev.map(r => r._id === referralId ? { ...r, status: action === 'approve' ? 'completed' : 'rejected', rejectionReason } : r));
        alert(`Referral successfully ${action}d!`);
      } else {
        alert(data.message || `Failed to ${action} referral.`);
      }
    } catch (err) {
      // Simulate offline update
      setReferrals(prev => prev.map(r => r._id === referralId ? { ...r, status: action === 'approve' ? 'completed' : 'rejected', rejectionReason } : r));
      alert(`Referral successfully ${action}d (simulated offline mode)!`);
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
      fetchReferrals();
    } catch (err) {
      localStorage.removeItem('ubt_user');
      localStorage.removeItem('ubt_token');
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'Referral Moderation') {
      fetchReferrals();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchSelectedBizBranches = async () => {
      if (!selectedBiz) {
        setSelectedBizBranches([]);
        return;
      }
      setSelectedBizBranchesLoading(true);
      try {
        const token = localStorage.getItem('ubt_token');
        if (!token || selectedBiz._id === 'UBT-10024') {
          // Fallback mock branches for Sri Murugan Stores or if offline
          const mockBranches = [
            {
              _id: 'mock-branch-1',
              businessId: 'UBT-10024',
              name: 'Sri Murugan Stores - Eripalayam Branch',
              address: 'Eripalayam Main Road, Udumalpet Main Town, Tamil Nadu - 642126',
              phone: '+91 94430 12345',
              googleMapsLocation: 'https://maps.google.com/?q=10.5912,77.2515',
              workingHours: '9:00 AM - 9:00 PM',
              branchManagerName: 'Murugan Jr.',
              status: 'Approved',
            },
            {
              _id: 'mock-branch-2',
              businessId: 'UBT-10024',
              name: 'Sri Murugan Stores - Dharapuram Road Branch',
              address: 'Dharapuram Road, Udumalpet Main Town, Tamil Nadu - 642126',
              phone: '+91 94430 54321',
              googleMapsLocation: 'https://maps.google.com/?q=10.584,77.252',
              workingHours: '9:00 AM - 8:30 PM',
              branchManagerName: 'Suresh Babu',
              status: 'Pending Verification',
            }
          ];
          setSelectedBizBranches(mockBranches);
          return;
        }

        const res = await fetch(`http://localhost:5000/api/branches/business/${selectedBiz._id}?all=true`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setSelectedBizBranches(data.data);
        }
      } catch (err) {
        console.error('Error fetching branches for selected business:', err);
      } finally {
        setSelectedBizBranchesLoading(false);
      }
    };

    fetchSelectedBizBranches();
  }, [selectedBiz]);

  const handleBranchStatusChange = async (branchId, newStatus) => {
    try {
      const token = localStorage.getItem('ubt_token');
      if (selectedBiz._id === 'UBT-10024') {
        // Mock branch status update
        setSelectedBizBranches(prev => prev.map(b => b._id === branchId ? { ...b, status: newStatus } : b));
        return;
      }

      const res = await fetch(`http://localhost:5000/api/admin/branches/${branchId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedBizBranches(prev => prev.map(b => b._id === branchId ? { ...b, status: newStatus } : b));
        
        // Also update the main business branch count in UI if status changed to/from Approved
        setBusinesses(prev => prev.map(b => {
          if (b._id === selectedBiz._id) {
            const oldBranch = selectedBizBranches.find(br => br._id === branchId);
            let diff = 0;
            if (oldBranch && oldBranch.status !== 'Approved' && newStatus === 'Approved') {
              diff = 1;
            } else if (oldBranch && oldBranch.status === 'Approved' && newStatus !== 'Approved') {
              diff = -1;
            }
            return { ...b, branchCount: (b.branchCount || 0) + diff };
          }
          return b;
        }));
      } else {
        alert(data.message || 'Failed to update branch status');
      }
    } catch (err) {
      console.error('Error changing branch status:', err);
      alert('Network error updating branch status');
    }
  };

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
      
      // Fetch admin subscriptions
      try {
        const subRes = await fetch('http://localhost:5000/api/subscriptions/admin/all', { headers });
        const subData = await subRes.json();
        if (subData.success) {
          setSubscriptions(subData.data);
        } else {
          setSubscriptions([]);
        }
      } catch (subErr) {
        console.error('Error loading admin subscriptions:', subErr);
        setSubscriptions([]);
      }

      // Fetch admin payments
      try {
        const payRes = await fetch('http://localhost:5000/api/payments/admin/all', { headers });
        const payData = await payRes.json();
        if (payData.success) {
          setPayments(payData.data);
        } else {
          setPayments([]);
        }
      } catch (payErr) {
        console.error('Error loading admin payments:', payErr);
        setPayments([]);
      }

      // Auto-calculate stats
      setReportsData({
        total: activeBiz.length,
        pending: activeBiz.filter(b => b.status === 'Pending Verification' || b.status === 'Under Review').length,
        active: activeBiz.filter(b => b.subscriptionStatus === 'active' && b.status === 'Approved').length,
        expired: activeBiz.filter(b => b.subscriptionStatus === 'expired').length
      });

      // Fetch dynamic seeded preset categories
      const categoriesRes = await fetch('http://localhost:5000/api/categories', { headers });
      const categoriesData = await categoriesRes.json();
      if (categoriesData.success) {
        setPresetCategories(categoriesData.data);
      }

      // Fetch pending custom category requests
      const pendingCatRes = await fetch('http://localhost:5000/api/admin/category-review/pending', { headers });
      const pendingCatData = await pendingCatRes.json();
      if (pendingCatData.success) {
        setPendingCategories(pendingCatData.data);
      }

    } catch (err) {
      console.error('Error hydrating admin platform datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  const resolveCategoryRequest = async (businessId, action, categoryId = null, newCategoryName = null, icon = null) => {
    try {
      const storedToken = localStorage.getItem('ubt_token');
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storedToken}` 
      };
      const res = await fetch('http://localhost:5000/api/admin/category-review/resolve', {
        method: 'POST',
        headers,
        body: JSON.stringify({ businessId, action, categoryId, newCategoryName, icon })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message || "Category request resolved successfully!");
        loadPlatformRealData();
      } else {
        alert(data.message || "Failed to resolve category request.");
      }
    } catch (err) {
      console.error(err);
      alert("Error resolving category request.");
    }
  };

  const updatePresetCategory = async (catId, payload) => {
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${catId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert("Category renamed successfully!");
        loadPlatformRealData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deletePresetCategory = async (catId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${catId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        alert("Category removed successfully!");
        loadPlatformRealData();
      }
    } catch (err) {
      console.error(err);
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

  const handleDeleteBusiness = async (bizId) => {
    if (window.confirm("Are you sure you want to permanently delete this listing? All reviews, blogs, and events matching will be cascade deleted!")) {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/businesses/${bizId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          alert('Listing and its cascaded assets deleted successfully!');
          loadPlatformRealData();
        } else {
          alert(data.message || 'Failed to delete listing.');
        }
      } catch (err) {
        console.error(err);
        // Fallback local mock delete
        setBusinesses(prev => prev.filter(b => b._id !== bizId));
        alert('Listing deleted successfully (simulated offline mode)!');
      }
    }
  };

  const handleManualSubscription = async (bizId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/businesses/${bizId}/activate-subscription`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token || localStorage.getItem('ubt_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        alert('Plan manually activated successfully for 30 days!');
        loadPlatformRealData();
      } else {
        alert(data.message || 'Failed to activate subscription.');
      }
    } catch (err) {
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
      alert('Plan manually activated successfully for 30 days (offline simulation)!');
    }
  };

  const handleSuspendSubscription = async (bizId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/businesses/${bizId}/suspend-subscription`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token || localStorage.getItem('ubt_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Action executed successfully!');
        loadPlatformRealData();
      } else {
        alert(data.message || 'Failed to update subscription status.');
      }
    } catch (err) {
      setBusinesses(prev => prev.map(b => {
        if (b._id === bizId) {
          const isSuspended = b.subscriptionStatus === 'suspended';
          return { 
            ...b, 
            subscriptionStatus: isSuspended ? 'none' : 'suspended',
            isPremium: false
          };
        }
        return b;
      }));
      alert('Subscription status updated successfully (offline simulation)!');
    }
  };

  const handleSendReminder = async (bizId) => {
    const businessObj = businesses.find(b => b._id === bizId);
    const businessName = businessObj ? businessObj.name : '';
    const defaultMsg = `Friendly reminder: Please renew your subscription for "${businessName}" to maintain premium visibility and access.`;
    const customMessage = window.prompt("Enter customized reminder text (leave empty to send default message):", defaultMsg);
    
    if (customMessage === null) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/businesses/${bizId}/send-reminder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('ubt_token')}`
        },
        body: JSON.stringify({ message: customMessage })
      });
      const data = await res.json();
      if (data.success) {
        alert('Subscription reminder sent successfully!');
      } else {
        alert(data.message || 'Failed to send subscription reminder.');
      }
    } catch (err) {
      alert('Subscription reminder successfully sent (offline simulation)!');
    }
  };

  const handleBroadcast = async () => {
    if (!newNotice.title || !newNotice.message) return;
    try {
      const res = await fetch('http://localhost:5000/api/admin/notifications/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('ubt_token')}`
        },
        body: JSON.stringify({
          title: newNotice.title,
          message: newNotice.message,
          type: newNotice.type
        })
      });
      const data = await res.json();
      if (data.success) {
        setNoticeSuccess(true);
        setNewNotice({ title: '', message: '', type: 'announcement' });
        setTimeout(() => setNoticeSuccess(false), 4000);
      } else {
        alert(data.message || 'Failed to broadcast system notification.');
      }
    } catch (err) {
      alert('Failed to broadcast system notification (network error).');
    }
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

  const handleEventDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        alert('Event successfully deleted!');
        loadPlatformRealData();
      } else {
        alert(data.message || 'Failed to delete event.');
      }
    } catch (err) {
      // Fallback local mock delete
      setEvents(prev => prev.filter(e => e._id !== eventId));
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
      <aside className={`bg-[#001c41] text-white flex flex-col justify-between transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'} shrink-0 relative overflow-hidden z-20 h-screen sticky top-0`}>
        <div className="flex flex-col gap-8 py-6 flex-1 overflow-y-auto">
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
              { id: 'Category Management', label: 'Categories', icon: <Grid className="h-5 w-5" /> },
              { id: 'Pending Approvals', label: 'Pending Approvals', icon: <ShieldAlert className="h-5 w-5" /> },
              { id: 'Blogs', label: 'Blogs Moderation', icon: <BookOpen className="h-5 w-5" /> },
              { id: 'Events', label: 'Events Moderation', icon: <Calendar className="h-5 w-5" /> },
              { id: 'Reviews', label: 'Reviews Feed', icon: <MessageSquare className="h-5 w-5" /> },
              { id: 'Testimonials', label: 'Testimonials Moderation', icon: <Smile className="h-5 w-5" /> },
              { id: 'Subscriptions', label: 'Subscriptions', icon: <CardIcon className="h-5 w-5" /> },
              { id: 'Notifications', label: 'Notifications Hub', icon: <Bell className="h-5 w-5" /> },
              { id: 'Reports', label: 'Reports & Trends', icon: <BarChart3 className="h-5 w-5" /> },
              { id: 'Queries', label: 'Queries Inbox', icon: <Mail className="h-5 w-5" /> },
              { id: 'Referral Moderation', label: 'Referral Moderation', icon: <Gift className="h-5 w-5" /> }
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
                          {businesses.filter(b => b.status === 'Pending Verification' || b.status === 'Under Review').length +
                           blogs.filter(b => b.status === 'Pending Approval').length +
                           events.filter(e => e.status === 'Pending Review').length +
                           appTestimonials.filter(t => t.status === 'Pending').length}
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
                            {appTestimonials.filter(t => t.status === 'Pending').length}
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
                              <th className="p-4.5">Branches</th>
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
                                <td className="p-4.5 font-bold text-slate-700 text-xs">
                                  {b.branchCount || 0} Branches
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
                                    <button
                                      onClick={() => handleDeleteBusiness(b._id)}
                                      className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10.5px] font-extrabold cursor-pointer transition-colors shadow-2xs"
                                    >
                                      Delete
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
                                <span className="text-[9.5px] text-slate-405 font-bold mt-1 block">
                                  Author: {b.authorName} • Date: {new Date(b.createdAt).toLocaleDateString()} • Category: <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider">{b.category || 'Business Tips'}</span>
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
                        {[...events]
                          .filter(e => e.status === 'Pending Review')
                          .sort((a, b) => getEventSortWeight(a) - getEventSortWeight(b) || new Date(a.date) - new Date(b.date))
                          .map(e => {
                            const isExpired = new Date(e.endDate || e.date) < new Date();
                            return (
                              <div key={e._id} className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 flex flex-col gap-4">
                                <div className="flex justify-between items-start gap-4">
                                  <div className="flex flex-col text-left font-sans">
                                    <span className="font-extrabold text-[#001c41] text-xs sm:text-[13px] leading-snug">{e.title}</span>
                                    <span className="text-[9.5px] text-slate-455 font-bold mt-1 block">
                                      Organizer: {e.organizer} • Date: {formatEventDateRange(e.date, e.endDate)} • Venue: {e.venue || 'To Be Declared'}
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
                                  <div className="flex gap-1.5 shrink-0 items-center">
                                    {isExpired && (
                                      <span className="px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide bg-red-50 border border-red-250 text-red-700">
                                        Expired
                                      </span>
                                    )}
                                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border ${
                                      e.status === 'Approved' ? 'bg-emerald-50 border-emerald-250 text-emerald-700' : 'bg-amber-50 border-amber-250 text-amber-600 animate-pulse'
                                    }`}>
                                      {e.status}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex justify-end gap-2 border-t border-slate-200/50 pt-3">
                                  <button 
                                    onClick={() => handleEventDelete(e._id)}
                                    className="mr-auto px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-650 font-extrabold text-[10.5px] rounded-xl cursor-pointer shadow-2xs"
                                  >
                                    Delete
                                  </button>
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
                            );
                          })}
                        {events.filter(e => e.status === 'Pending Review').length === 0 && (
                          <div className="p-8 text-center text-slate-400 text-xs font-bold bg-slate-50 rounded-2xl">
                            No events waiting for verification.
                          </div>
                        )}
                      </div>
                    )}

                    {auditSubTab === 'Testimonials' && (
                      <div className="flex flex-col gap-4">
                        {testimonialsLoading ? (
                          <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                            <RefreshCw className="h-6 w-6 text-emerald-600 animate-spin" />
                            <span className="text-[10px] font-bold">Loading Testimonials...</span>
                          </div>
                        ) : (
                          <>
                            {[...appTestimonials]
                              .sort((a, b) => {
                                const weight = (status) => status === 'Pending' ? 0 : status === 'Approved' ? 1 : 2;
                                return weight(a.status) - weight(b.status) || new Date(b.createdAt) - new Date(a.createdAt);
                              })
                              .map(t => (
                                <div key={t._id} className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left">
                                  <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center font-black text-[#027244] text-xs shrink-0 select-none uppercase">
                                      {(t.authorName || 'KA').slice(0, 2)}
                                    </div>
                                    <div className="flex flex-col">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-extrabold text-xs text-slate-800 leading-none">{t.authorName}</span>
                                        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wider">{t.role}</span>
                                        <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border ${
                                          t.status === 'Approved'
                                            ? 'bg-emerald-50 border-emerald-250 text-emerald-700'
                                            : t.status === 'Rejected'
                                              ? 'bg-red-50 border-red-200 text-red-650'
                                              : 'bg-amber-50 border-amber-250 text-amber-600 animate-pulse'
                                        }`}>
                                          {t.status}
                                        </span>
                                      </div>
                                      
                                      <div className="flex items-center gap-1 mt-1.5 text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                          <Star key={i} className={`h-3 w-3 ${i < (t.rating || 5) ? 'fill-current' : 'text-slate-205'}`} />
                                        ))}
                                        <span className="text-[9.5px] text-slate-400 font-bold ml-2">
                                          {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                                        </span>
                                      </div>

                                      <p className="text-[11.5px] text-slate-555 font-semibold mt-2 max-w-2xl leading-relaxed italic">
                                        "{t.text}"
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                    {t.status !== 'Approved' && (
                                      <button 
                                        onClick={() => handleTestimonialStatus(t._id, 'Approved')}
                                        className="px-2.5 py-1.5 bg-[#027244] hover:bg-[#005934] text-white rounded-lg text-[10.5px] font-extrabold cursor-pointer transition-colors shadow-2xs"
                                        title="Approve Testimonial"
                                      >
                                        Approve
                                      </button>
                                    )}
                                    {t.status !== 'Rejected' && (
                                      <button 
                                        onClick={() => handleTestimonialStatus(t._id, 'Rejected')}
                                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg text-[10.5px] font-extrabold cursor-pointer transition-colors"
                                        title="Reject Testimonial"
                                      >
                                        Reject
                                      </button>
                                    )}
                                    <button 
                                      onClick={() => handleTestimonialDelete(t._id)}
                                      className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer border border-slate-205"
                                      title="Delete Permanently"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            {appTestimonials.length === 0 && (
                              <div className="p-8 text-center text-slate-400 text-xs font-bold bg-slate-50 rounded-2xl">
                                No app testimonials have been submitted yet.
                              </div>
                            )}
                          </>
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
                            <th className="p-4.5">Branches</th>
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
                              <td className="p-4.5 font-bold text-slate-700 text-xs">
                                {b.branchCount || 0} Branches
                              </td>
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
                                  <button 
                                    onClick={() => handleDeleteBusiness(b._id)}
                                    className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10.5px] font-extrabold cursor-pointer transition-colors shadow-2xs"
                                  >
                                    Delete
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
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex flex-col">
                      <h3 className="font-extrabold text-[#001c41] text-base">Pending Approvals Desk</h3>
                      <span className="text-[10px] text-slate-450 font-semibold mt-0.5">Showcasing listings, community blogs, and events waiting for administrative approval</span>
                    </div>

                    {/* Pill tabs container */}
                    <div className="bg-slate-100/60 p-1 rounded-xl flex items-center self-start md:self-center overflow-x-auto shrink-0 border border-slate-200/30">
                      <button
                        onClick={() => setPendingSubTab('Businesses')}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          pendingSubTab === 'Businesses'
                            ? 'bg-[#027244] text-white shadow-sm shadow-emerald-950/15'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Businesses ({businesses.filter(b => b.status === 'Pending Verification' || b.status === 'Under Review').length})
                      </button>
                      <button
                        onClick={() => setPendingSubTab('Blogs')}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          pendingSubTab === 'Blogs'
                            ? 'bg-[#027244] text-white shadow-sm shadow-emerald-950/15'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Blogs ({blogs.filter(b => b.status === 'Pending Approval').length})
                      </button>
                      <button
                        onClick={() => setPendingSubTab('Events')}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          pendingSubTab === 'Events'
                            ? 'bg-[#027244] text-white shadow-sm shadow-emerald-950/15'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Events ({events.filter(e => e.status === 'Pending Review').length})
                      </button>
                      <button
                        onClick={() => setPendingSubTab('Testimonials')}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          pendingSubTab === 'Testimonials'
                            ? 'bg-[#027244] text-white shadow-sm shadow-emerald-950/15'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Testimonials ({appTestimonials.filter(t => t.status === 'Pending').length})
                      </button>
                      <button
                        onClick={() => setPendingSubTab('Categories')}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          pendingSubTab === 'Categories'
                            ? 'bg-[#027244] text-white shadow-sm shadow-emerald-950/15'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Categories ({pendingCategories.length})
                      </button>
                    </div>
                  </div>

                  {/* Sub-tab view: Businesses */}
                  {pendingSubTab === 'Businesses' && (
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
                  )}

                  {/* Sub-tab view: Blogs */}
                  {pendingSubTab === 'Blogs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {blogs.filter(b => b.status === 'Pending Approval').map(b => (
                        <div key={b._id} className="bg-white border border-slate-200 shadow-sm rounded-3xl p-5 flex flex-col justify-between gap-5 hover:shadow-md transition-shadow">
                          <div className="flex gap-4">
                            {b.coverImage && (
                              <div className="h-16 w-20 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                                <img src={b.coverImage} className="w-full h-full object-cover" alt="Blog Cover" />
                              </div>
                            )}
                            <div className="flex flex-col gap-1 text-left min-w-0 flex-1">
                              <h4 className="font-extrabold text-sm text-[#001c41] truncate leading-none">{b.title}</h4>
                              <span className="text-xs text-emerald-655 font-bold mt-1 leading-none">
                                Author: {b.authorName} • Category: <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider">{b.category || 'Business Tips'}</span>
                              </span>
                              <span className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1 font-semibold">
                                <Calendar className="h-3 w-3 text-slate-400 shrink-0" /> {new Date(b.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-550 font-semibold leading-relaxed line-clamp-3 text-justify">{b.content}</p>

                          <div className="flex justify-between items-center border-t border-slate-100 pt-3.5 gap-2">
                            <button 
                              onClick={() => { setSelectedBlogModal(b); setSuggestionText(b.revisionSuggestions || ''); }}
                              className="text-xs font-bold text-slate-550 hover:text-slate-800 flex items-center gap-0.5 cursor-pointer"
                            >
                              <Eye className="h-4 w-4 text-slate-400" /> View details
                            </button>
                            
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleBlogAction(b._id, 'Rejected')}
                                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-650 font-extrabold text-[10.5px] rounded-xl cursor-pointer"
                              >
                                Reject
                              </button>
                              <button 
                                onClick={() => handleBlogAction(b._id, 'Approved')}
                                className="px-4.5 py-2 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer shadow shadow-emerald-800/10"
                              >
                                Approve
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {blogs.filter(b => b.status === 'Pending Approval').length === 0 && (
                        <div className="col-span-2 bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 flex flex-col items-center gap-3">
                          <BookOpen className="h-10 w-10 text-emerald-600 animate-bounce" />
                          <span className="text-sm font-bold text-slate-800 font-sans">Queue Empty!</span>
                          <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs">There are no pending blog article submissions waiting for review today.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sub-tab view: Events */}
                  {pendingSubTab === 'Events' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[...events]
                        .filter(e => e.status === 'Pending Review')
                        .sort((a, b) => getEventSortWeight(a) - getEventSortWeight(b) || new Date(a.date) - new Date(b.date))
                        .map(e => {
                          const isExpired = new Date(e.endDate || e.date) < new Date();
                          return (
                            <div key={e._id} className="bg-white border border-slate-200 shadow-sm rounded-3xl p-5 flex flex-col justify-between gap-5 hover:shadow-md transition-shadow">
                              <div className="flex flex-col gap-1 text-left min-w-0">
                                <div className="flex justify-between items-start gap-4">
                                  <h4 className="font-extrabold text-sm text-[#001c41] truncate leading-none">{e.title}</h4>
                                  {isExpired && (
                                    <span className="px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide bg-red-50 border border-red-250 text-red-700 shrink-0">
                                      Expired
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-emerald-650 font-bold mt-1.5 leading-none">Organizer: {e.organizer}</span>
                              </div>

                              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-[10.5px] font-bold text-slate-600 flex flex-col gap-1.5">
                                <div>📅 Date: <span className="text-slate-800">{formatEventDateRange(e.date, e.endDate)}</span></div>
                                <div>📍 Venue: <span className="text-slate-800">{e.venue || 'To Be Declared'}</span></div>
                                <div>🎭 Category: <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">{e.category}</span></div>
                              </div>

                              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3.5">
                                <button 
                                  onClick={() => handleEventDelete(e._id)}
                                  className="mr-auto px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-650 font-extrabold text-[10.5px] rounded-xl cursor-pointer"
                                >
                                  Delete
                                </button>
                                <button 
                                  onClick={() => handleEventAction(e._id, 'Rejected')}
                                  className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-650 font-extrabold text-[10.5px] rounded-xl cursor-pointer"
                                >
                                  Reject
                                </button>
                                <button 
                                  onClick={() => handleEventAction(e._id, 'Approved')}
                                  className="px-4.5 py-2 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer shadow shadow-emerald-800/10"
                                >
                                  Approve
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      {events.filter(e => e.status === 'Pending Review').length === 0 && (
                        <div className="col-span-2 bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 flex flex-col items-center gap-3">
                          <Calendar className="h-10 w-10 text-emerald-600 animate-bounce" />
                          <span className="text-sm font-bold text-slate-800 font-sans">Queue Empty!</span>
                          <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs">There are no pending community events waiting for review today.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sub-tab view: Testimonials */}
                  {pendingSubTab === 'Testimonials' && (
                    <div className="flex flex-col gap-4">
                      {testimonialsLoading ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                          <RefreshCw className="h-6 w-6 text-emerald-600 animate-spin" />
                          <span className="text-[10px] font-bold">Loading Testimonials...</span>
                        </div>
                      ) : (
                        <>
                          {appTestimonials.filter(t => t.status === 'Pending').map(t => (
                            <div key={t._id} className="bg-white border border-slate-200 shadow-sm rounded-3xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left">
                              <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center font-black text-[#027244] text-xs shrink-0 select-none uppercase font-sans">
                                  {(t.authorName || 'KA').slice(0, 2)}
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2 flex-wrap font-sans">
                                    <span className="font-extrabold text-xs text-slate-800 leading-none">{t.authorName}</span>
                                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wider">{t.role}</span>
                                    <span className="px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border bg-amber-50 border-amber-250 text-amber-600 animate-pulse">
                                      {t.status}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1 mt-1.5 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`h-3 w-3 ${i < (t.rating || 5) ? 'fill-current' : 'text-slate-205'}`} />
                                    ))}
                                    <span className="text-[9.5px] text-slate-400 font-bold ml-2 font-sans">
                                      {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                                    </span>
                                  </div>

                                  <p className="text-[11.5px] text-slate-555 font-semibold mt-2 max-w-2xl leading-relaxed italic font-sans">
                                    "{t.text}"
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                <button 
                                  onClick={() => handleTestimonialStatus(t._id, 'Approved')}
                                  className="px-3.5 py-2 bg-[#027244] hover:bg-[#005934] text-white rounded-xl text-[10.5px] font-extrabold cursor-pointer transition-colors shadow shadow-emerald-800/10"
                                >
                                  Approve & Publish
                                </button>
                                <button 
                                  onClick={() => handleTestimonialStatus(t._id, 'Rejected')}
                                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-650 rounded-xl text-[10.5px] font-extrabold cursor-pointer transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          ))}
                          {appTestimonials.filter(t => t.status === 'Pending').length === 0 && (
                            <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 flex flex-col items-center gap-3">
                              <CheckCircle2 className="h-10 w-10 text-emerald-600 animate-bounce" />
                              <span className="text-sm font-bold text-slate-800 font-sans">Queue Empty!</span>
                              <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs">There are no pending testimonials waiting for review today.</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Sub-tab view: Categories */}
                  {pendingSubTab === 'Categories' && (
                    <div className="flex flex-col gap-4">
                      {pendingCategories.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 flex flex-col items-center gap-3">
                          <CheckCircle2 className="h-10 w-10 text-emerald-600 animate-bounce" />
                          <span className="text-sm font-bold text-slate-800 font-sans">Queue Empty!</span>
                          <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs">All custom category requests are resolved.</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {pendingCategories.map(biz => (
                            <div key={biz._id} className="bg-white border border-slate-200 shadow-sm rounded-3xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left">
                              <div className="flex flex-col text-left font-sans">
                                <div className="flex items-center gap-2">
                                  <span className="bg-amber-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-sm">Custom category request</span>
                                  <span className="text-[9px] font-extrabold text-slate-400">Biz Status: {biz.status}</span>
                                </div>
                                <span className="font-black text-sm mt-2 text-[#001c41]">"{biz.customCategoryName}"</span>
                                <span className="text-[10.5px] text-slate-400 font-semibold mt-1">Requested by business: <b className="text-slate-555">{biz.name}</b> ({biz.ownerId?.fullName || 'Owner'})</span>
                              </div>
                              
                              <div className="flex flex-wrap gap-2 items-center">
                                <select
                                  onChange={(e) => {
                                    const catId = e.target.value;
                                    if (!catId) return;
                                    const matched = presetCategories.find(c => c._id === catId);
                                    if (matched) {
                                      const confirmed = confirm(`Assign existing category "${matched.categoryName}" for "${biz.customCategoryName}"?`);
                                      if (confirmed) {
                                        resolveCategoryRequest(biz._id, 'assign', matched._id);
                                      }
                                    }
                                    e.target.value = "";
                                  }}
                                  className="py-1.5 px-3 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-[10px] font-extrabold cursor-pointer transition-colors outline-none font-sans"
                                >
                                  <option value="">-- Assign Existing Category --</option>
                                  {presetCategories.map(c => (
                                    <option key={c._id} value={c._id}>{c.categoryName}</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => {
                                    const isCreate = confirm(`Create genuinely new category "${biz.customCategoryName}"? It will auto-resolve the business mapping.`);
                                    if (isCreate) {
                                      resolveCategoryRequest(biz._id, 'create', null, biz.customCategoryName);
                                    }
                                  }}
                                  className="py-1.5 px-3 bg-[#027244] hover:bg-[#005934] text-white text-[10px] font-extrabold rounded-xl transition-colors cursor-pointer shadow-sm shadow-emerald-800/10 font-sans"
                                >
                                  Create & Map
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
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
                            <span className="text-[9.5px] text-slate-455 font-bold mt-1">
                              Author: {b.authorName} • {new Date(b.createdAt).toLocaleDateString()} • Category: <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider">{b.category || 'Business Tips'}</span>
                            </span>
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

              {activeTab === 'Events' && (
                <div className="flex flex-col gap-6 text-left">
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
                    <h3 className="font-extrabold text-[#001c41] text-base">Community Events Moderation</h3>
                    <span className="text-[10px] text-slate-455 font-semibold mt-0.5">Moderate event list sub-streams to maintain community relevance</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...events]
                      .sort((a, b) => getEventSortWeight(a) - getEventSortWeight(b) || new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
                      .map(e => {
                        const isExpired = new Date(e.endDate || e.date) < new Date();
                        return (
                          <div key={e._id} className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-2xs flex flex-col gap-4 justify-between">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex flex-col text-left">
                                <h4 className="font-extrabold text-sm text-[#001c41] leading-none">{e.title}</h4>
                                <span className="text-[9.5px] text-slate-400 font-bold mt-1.5 leading-none">Organizer: {e.organizer}</span>
                              </div>
                              <div className="flex gap-1.5 shrink-0 items-center">
                                {isExpired && (
                                  <span className="px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide bg-red-50 border border-red-250 text-red-700">
                                    Expired
                                  </span>
                                )}
                                <span className={`px-2 py-0.5 rounded text-[8.5px] font-black border ${
                                  e.status === 'Approved' ? 'bg-emerald-50 border-emerald-250 text-emerald-700' : 'bg-amber-50 border-amber-250 text-amber-600'
                                }`}>
                                  {e.status}
                                </span>
                              </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-[10.5px] font-bold text-slate-600 flex flex-col gap-1.5">
                              <div>📅 Date: <span className="text-slate-800">{formatEventDateRange(e.date, e.endDate)}</span></div>
                              <div>📍 Venue: <span className="text-slate-800">{e.venue || 'To Be Declared'}</span></div>
                              <div>🎭 Category: <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">{e.category}</span></div>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                              <button 
                                onClick={() => handleEventDelete(e._id)}
                                className="mr-auto px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-650 font-extrabold text-[10.5px] rounded-xl cursor-pointer"
                              >
                                Delete
                              </button>
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
                        );
                      })}
                  </div>
                </div>
              )}

              {/* TAB: REVIEWS FEED */}
              {activeTab === 'Reviews' && (
                <div className="flex flex-col gap-6 text-left">
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
                    <h3 className="font-extrabold text-[#001c41] text-base">Ratings & Reviews Moderation</h3>
                    <span className="text-[10px] text-slate-455 font-semibold mt-0.5">Purge spam, review duplicates, or filter inappropriate content</span>
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

              {/* TAB: TESTIMONIALS MODERATION */}
              {activeTab === 'Testimonials' && (
                <div className="flex flex-col gap-6 text-left">
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
                    <h3 className="font-extrabold text-[#001c41] text-base font-sans leading-tight">Testimonials Moderation Desk</h3>
                    <span className="text-[10px] text-slate-450 font-semibold mt-0.5">Audit community thoughts, publish reviews to home slider, or delete feedback</span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {testimonialsLoading ? (
                      <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                        <RefreshCw className="h-6 w-6 text-emerald-600 animate-spin" />
                        <span className="text-[10px] font-bold">Loading Testimonials...</span>
                      </div>
                    ) : (
                      <>
                        {[...appTestimonials]
                          .sort((a, b) => {
                            const weight = (status) => status === 'Pending' ? 0 : status === 'Approved' ? 1 : 2;
                            return weight(a.status) - weight(b.status) || new Date(b.createdAt) - new Date(a.createdAt);
                          })
                          .map(t => (
                            <div key={t._id} className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-2xs flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left">
                              <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center font-black text-[#027244] text-xs shrink-0 select-none uppercase font-sans">
                                  {(t.authorName || 'KA').slice(0, 2)}
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2 flex-wrap font-sans">
                                    <span className="font-extrabold text-xs text-slate-800 leading-none">{t.authorName}</span>
                                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wider">{t.role}</span>
                                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border ${
                                      t.status === 'Approved'
                                        ? 'bg-emerald-50 border-emerald-250 text-emerald-700'
                                        : t.status === 'Rejected'
                                          ? 'bg-red-50 border-red-200 text-red-650'
                                          : 'bg-amber-50 border-amber-250 text-amber-600 animate-pulse'
                                    }`}>
                                      {t.status}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1 mt-1.5 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`h-3 w-3 ${i < (t.rating || 5) ? 'fill-current' : 'text-slate-205'}`} />
                                    ))}
                                    <span className="text-[9.5px] text-slate-400 font-bold ml-2 font-sans">
                                      {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                                    </span>
                                  </div>

                                  <p className="text-[11.5px] text-slate-555 font-semibold mt-2 max-w-2xl leading-relaxed italic font-sans">
                                    "{t.text}"
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                {t.status !== 'Approved' && (
                                  <button 
                                    onClick={() => handleTestimonialStatus(t._id, 'Approved')}
                                    className="px-3.5 py-2 bg-[#027244] hover:bg-[#005934] text-white rounded-xl text-[10.5px] font-extrabold cursor-pointer transition-colors shadow shadow-emerald-800/10 font-sans"
                                  >
                                    Approve & Publish
                                  </button>
                                )}
                                {t.status !== 'Rejected' && (
                                  <button 
                                    onClick={() => handleTestimonialStatus(t._id, 'Rejected')}
                                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-650 rounded-xl text-[10.5px] font-extrabold cursor-pointer transition-colors font-sans"
                                  >
                                    Reject
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleTestimonialDelete(t._id)}
                                  className="h-8.5 w-8.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-650 flex items-center justify-center transition-colors cursor-pointer border border-slate-200"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        {appTestimonials.length === 0 && (
                          <div className="p-16 text-center text-slate-400 bg-white border border-slate-200 rounded-3xl">
                            No testimonials recorded.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: SUBSCRIPTIONS */}
              {activeTab === 'Subscriptions' && (
                <div className="flex flex-col gap-8 text-left animate-fadeIn">
                  
                  {/* Statistics Widgets Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
                    <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4.5 flex flex-col text-left">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Subscriptions</span>
                      <span className="text-xl font-black text-[#001c41] mt-1.5">{subscriptions.length} Records</span>
                    </div>
                    <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4.5 flex flex-col text-left">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Plans</span>
                      <span className="text-xl font-black text-emerald-600 mt-1.5">
                        {subscriptions.filter(s => s.status === 'active').length} Active
                      </span>
                    </div>
                    <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4.5 flex flex-col text-left">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-sans">Admin Revenue</span>
                      <span className="text-xl font-black text-[#001c41] mt-1.5">
                        ₹{payments.reduce((acc, p) => p.paymentStatus === 'Paid' || p.status === 'Paid' || p.status === 'captured' ? acc + p.amount : acc, 0)}
                      </span>
                    </div>
                    <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4.5 flex flex-col text-left">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-sans">Points Discounted</span>
                      <span className="text-xl font-black text-orange-650 mt-1.5">
                        ₹{subscriptions.reduce((acc, s) => acc + (s.referralDiscount || 0), 0)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="flex flex-col">
                        <h3 className="font-extrabold text-[#001c41] text-base">Subscription Billings & Billing Audit</h3>
                        <span className="text-[10px] text-slate-450 font-semibold mt-0.5">Review active premium accounts, inspect transaction histories, or manually override validity</span>
                      </div>
                    </div>

                    {/* Navigation bar for sub-tabs */}
                    <div className="flex gap-4 border-b border-slate-200 pb-3 mt-5">
                      <button 
                        onClick={() => setSubscriptionTab('override')}
                        className={`pb-2 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer border-b-2 px-1 border-solid ${
                          subscriptionTab === 'override' 
                            ? 'border-[#027244] text-[#027244]' 
                            : 'border-transparent text-slate-400 hover:text-slate-650'
                        }`}
                      >
                        Business Licenses (Override)
                      </button>
                      <button 
                        onClick={() => setSubscriptionTab('subscriptions')}
                        className={`pb-2 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer border-b-2 px-1 border-solid ${
                          subscriptionTab === 'subscriptions' 
                            ? 'border-[#027244] text-[#027244]' 
                            : 'border-transparent text-slate-400 hover:text-slate-650'
                        }`}
                      >
                        Platform Subscriptions
                      </button>
                      <button 
                        onClick={() => setSubscriptionTab('payments')}
                        className={`pb-2 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer border-b-2 px-1 border-solid ${
                          subscriptionTab === 'payments' 
                            ? 'border-[#027244] text-[#027244]' 
                            : 'border-transparent text-slate-400 hover:text-slate-650'
                        }`}
                      >
                        Payment Transactions
                      </button>
                    </div>

                    <div className="mt-5">
                      {/* SUBTAB 1: OVERRIDE */}
                      {subscriptionTab === 'override' && (
                        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                          <table className="w-full text-left text-xs font-semibold text-slate-650">
                            <thead className="bg-slate-50 border-b border-slate-200 text-[9px] font-black text-slate-450 uppercase tracking-widest">
                              <tr>
                                <th className="p-4">Business Name</th>
                                <th className="p-4">Plan Type</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Expiry Date</th>
                                <th className="p-4">Days Unsubscribed</th>
                                <th className="p-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {businesses.map(b => {
                                const getDaysUnsubscribed = (biz) => {
                                  if (biz.subscriptionStatus === 'active') return 'N/A (Active)';
                                  const dateToCompare = biz.subscriptionExpiry ? new Date(biz.subscriptionExpiry) : new Date(biz.createdAt || Date.now());
                                  const diffDays = Math.floor((new Date() - dateToCompare) / (1000 * 60 * 60 * 24));
                                  if (diffDays <= 0) return '0 days';
                                  return `${diffDays} days${biz.subscriptionExpiry ? '' : ' (since registration)'}`;
                                };

                                return (
                                  <tr key={b._id} className="hover:bg-slate-50/50">
                                    <td className="p-4 flex items-center gap-3">
                                      <div className="h-9 w-9 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                                        <img src={b.coverImageUrl} className="h-full w-full object-cover" alt={b.name} />
                                      </div>
                                      <div className="flex flex-col text-left">
                                        <span className="font-extrabold text-slate-800 text-xs leading-none">{b.name}</span>
                                        <a 
                                          href={`/businesses/${b._id}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[#027244] hover:text-[#005934] hover:underline font-black text-[10px] mt-1.5 flex items-center gap-1 w-fit cursor-pointer leading-none"
                                        >
                                          View Profile →
                                        </a>
                                      </div>
                                    </td>
                                    <td className="p-4">{b.subscriptionStatus === 'active' ? 'Premium Package' : 'Basic Tier'}</td>
                                    <td className="p-4 font-extrabold text-slate-800">
                                      {b.subscriptionStatus === 'active' ? '₹499 / Mon' : '₹0'}
                                    </td>
                                    <td className="p-4">
                                      <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wide border ${
                                        b.subscriptionStatus === 'active' 
                                          ? 'bg-emerald-50 border-emerald-250 text-emerald-700' 
                                          : (b.subscriptionStatus === 'suspended' ? 'bg-rose-50 border-rose-250 text-rose-700' : 'bg-slate-50 border-slate-200 text-slate-400')
                                      }`}>
                                        {b.subscriptionStatus}
                                      </span>
                                    </td>
                                    <td className="p-4 font-bold text-slate-500">
                                      {b.subscriptionExpiry ? new Date(b.subscriptionExpiry).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="p-4 font-bold text-slate-550">
                                      {getDaysUnsubscribed(b)}
                                    </td>
                                    <td className="p-4 text-right">
                                      <div className="flex gap-2 justify-end">
                                        <a 
                                          href={`/businesses/${b._id}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[9.5px] font-extrabold text-center leading-none shadow-xs flex items-center justify-center"
                                        >
                                          View Profile
                                        </a>
                                        {user?.role === 'superadmin' && (
                                          <button 
                                            onClick={() => handleManualSubscription(b._id)}
                                            disabled={b.subscriptionStatus === 'active'}
                                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[9.5px] rounded-lg cursor-pointer disabled:opacity-40 shadow-xs border-none"
                                          >
                                            Activate 30 Days
                                          </button>
                                        )}
                                        <button 
                                          onClick={() => handleSuspendSubscription(b._id)}
                                          className={`px-2.5 py-1.5 font-extrabold text-[9.5px] rounded-lg cursor-pointer shadow-xs border-none text-white ${
                                            b.subscriptionStatus === 'suspended' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-rose-600 hover:bg-rose-700'
                                          }`}
                                        >
                                          {b.subscriptionStatus === 'suspended' ? 'Reactivate' : 'Suspend'}
                                        </button>
                                        {b.subscriptionStatus !== 'active' && (
                                          <button 
                                            onClick={() => handleSendReminder(b._id)}
                                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[9.5px] rounded-lg cursor-pointer shadow-xs border-none"
                                          >
                                            Send Reminder
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* SUBTAB 2: SUBSCRIPTIONS LIST */}
                      {subscriptionTab === 'subscriptions' && (
                        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                          <table className="w-full text-left text-xs font-semibold text-slate-650">
                            <thead className="bg-slate-50 border-b border-slate-200 text-[9px] font-black text-slate-450 uppercase tracking-widest">
                              <tr>
                                <th className="p-4">Owner / Merchant</th>
                                <th className="p-4">Business</th>
                                <th className="p-4">Plan Name</th>
                                <th className="p-4">Amount Paid</th>
                                <th className="p-4">Discount Applied</th>
                                <th className="p-4">Validity Dates</th>
                                <th className="p-4">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {subscriptions.map(sub => {
                                const ownerName = sub.ownerId?.fullName || sub.ownerId?.name || 'Unknown';
                                const ownerEmail = sub.ownerId?.email || '';
                                const bizName = sub.businessId?.name || sub.businessId?.businessName || 'N/A';
                                const isActive = sub.status === 'active';
                                const isPending = sub.status === 'pending';
                                
                                return (
                                  <tr key={sub._id} className="hover:bg-slate-50/50">
                                    <td className="p-4 flex flex-col text-left">
                                      <span className="font-extrabold text-slate-800 text-xs sm:text-[13px]">{ownerName}</span>
                                      {ownerEmail && <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{ownerEmail}</span>}
                                    </td>
                                    <td className="p-4 font-bold text-slate-700">{bizName}</td>
                                    <td className="p-4 uppercase text-[10px] font-extrabold text-slate-800">{sub.planName || sub.plan}</td>
                                    <td className="p-4 font-black text-slate-800">₹{sub.amountPaid || sub.amount}</td>
                                    <td className="p-4 text-emerald-600 font-extrabold">₹{sub.referralDiscount || 0}</td>
                                    <td className="p-4 font-bold text-slate-500">
                                      <div className="flex flex-col text-[10.5px]">
                                        <span>S: {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : 'N/A'}</span>
                                        <span>E: {sub.expiryDate || sub.endDate ? new Date(sub.expiryDate || sub.endDate).toLocaleDateString() : 'N/A'}</span>
                                      </div>
                                    </td>
                                    <td className="p-4">
                                      <span className={`px-2.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border ${
                                        isActive 
                                          ? 'bg-emerald-50 border-emerald-250 text-emerald-700' 
                                          : isPending 
                                            ? 'bg-amber-50 border-amber-250 text-amber-600'
                                            : 'bg-rose-50 border-rose-250 text-rose-700'
                                      }`}>
                                        {sub.status}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                              {subscriptions.length === 0 && (
                                <tr>
                                  <td colSpan="7" className="p-8 text-center text-slate-400 text-xs font-bold leading-normal">
                                    No platform subscription records found.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* SUBTAB 3: PAYMENTS LIST */}
                      {subscriptionTab === 'payments' && (
                        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                          <table className="w-full text-left text-xs font-semibold text-slate-650">
                            <thead className="bg-slate-50 border-b border-slate-200 text-[9px] font-black text-slate-450 uppercase tracking-widest">
                              <tr>
                                <th className="p-4">Billing Date</th>
                                <th className="p-4">User / Merchant</th>
                                <th className="p-4">Business</th>
                                <th className="p-4">Order / Payment ID</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Method</th>
                                <th className="p-4">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {payments.map(pay => {
                                const userName = pay.userId?.fullName || pay.userId?.name || 'Unknown';
                                const userEmail = pay.userId?.email || '';
                                const bizName = pay.businessId?.name || pay.businessId?.businessName || (pay.eventId ? 'Event Posting Fee' : 'Platform Payment');
                                const isPaid = pay.paymentStatus === 'Paid' || pay.status === 'Paid' || pay.status === 'captured';
                                
                                return (
                                  <tr key={pay._id} className="hover:bg-slate-50/50">
                                    <td className="p-4 text-slate-500 font-bold font-sans">
                                      {pay.paymentDate ? new Date(pay.paymentDate).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="p-4 flex flex-col text-left">
                                      <span className="font-extrabold text-slate-800 text-xs sm:text-[13px]">{userName}</span>
                                      {userEmail && <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{userEmail}</span>}
                                    </td>
                                    <td className="p-4">
                                      <div className="flex flex-col text-left">
                                        <span className="font-bold text-slate-700">{bizName}</span>
                                        {pay.eventId && <span className="text-[9px] text-[#027244] font-black uppercase">Event listing</span>}
                                      </div>
                                    </td>
                                    <td className="p-4 font-mono text-[10px] text-slate-500">
                                      <div className="flex flex-col gap-0.5">
                                        <span>O: {pay.orderId || pay.razorpayOrderId}</span>
                                        {pay.paymentId && <span>P: {pay.paymentId || pay.razorpayPaymentId}</span>}
                                      </div>
                                    </td>
                                    <td className="p-4 font-black text-slate-800">₹{pay.amount}</td>
                                    <td className="p-4 text-slate-650">{pay.paymentMethod || 'UPI'}</td>
                                    <td className="p-4">
                                      <span className={`px-2.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border ${
                                        isPaid 
                                          ? 'bg-emerald-50 border-emerald-250 text-emerald-700' 
                                          : 'bg-rose-50 border-rose-250 text-rose-700'
                                      }`}>
                                        {isPaid ? 'Paid' : 'Failed'}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                              {payments.length === 0 && (
                                <tr>
                                  <td colSpan="7" className="p-8 text-center text-slate-400 text-xs font-bold leading-normal">
                                    No platform transaction records found.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
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
                      onClick={handleBroadcast}
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

              {/* TAB: REFERRAL MODERATION */}
              {activeTab === 'Referral Moderation' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn font-sans">
                  {/* Header Dashboard Banner */}
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col text-left font-sans">
                      <h3 className="font-extrabold text-[#001c41] text-base leading-tight">Referrals & Rewards Moderation</h3>
                      <span className="text-[10px] text-slate-400 font-semibold mt-1">Review referral credits request logs, verify anti-fraud flags, and manually audit reward balances</span>
                    </div>

                    {/* Filter controls */}
                    <div className="bg-slate-100/60 p-1 rounded-xl flex items-center shrink-0 border border-slate-200/30">
                      {['All', 'Pending', 'Completed', 'Rejected'].map(status => (
                        <button
                          key={status}
                          onClick={() => setReferralFilter(status)}
                          className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                            referralFilter === status
                              ? 'bg-[#027244] text-white shadow-sm shadow-emerald-950/15'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {status === 'All' ? 'All Referrals' : `${status}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary Metric Stats cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 font-sans">
                    <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-2xs text-left flex flex-col gap-1.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Total Referrals</span>
                      <span className="text-2xl font-black text-[#001c41]">{referrals.length}</span>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-2xs text-left flex flex-col gap-1.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Pending Review</span>
                      <span className="text-2xl font-black text-amber-600">{referrals.filter(r => r.status === 'pending').length}</span>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-2xs text-left flex flex-col gap-1.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Completed</span>
                      <span className="text-2xl font-black text-emerald-650">{referrals.filter(r => r.status === 'completed').length}</span>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-2xs text-left flex flex-col gap-1.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Rejected / Flagged</span>
                      <span className="text-2xl font-black text-rose-650">{referrals.filter(r => r.status === 'rejected').length}</span>
                    </div>
                  </div>

                  {/* Search and Quick Filters bar */}
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-5 flex flex-col sm:flex-row gap-4 justify-between items-center font-sans">
                    <div className="w-full sm:max-w-md bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2">
                      <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Search by Referrer or Referred Merchant name/email..."
                        value={referralSearch}
                        onChange={(e) => setReferralSearch(e.target.value)}
                        className="w-full bg-transparent text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Referrals Moderation List Table */}
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden font-sans">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black text-slate-450 uppercase tracking-wider text-left">
                            <th className="px-6 py-4">Referrer (Invited By)</th>
                            <th className="px-6 py-4">Referred User</th>
                            <th className="px-6 py-4">Referred Business</th>
                            <th className="px-6 py-4">Anti-Fraud Validation</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-655 font-semibold">
                          {referralsLoading ? (
                            <tr>
                              <td colSpan="6" className="text-center py-12 text-slate-400 font-semibold">
                                Loading referrals registry...
                              </td>
                            </tr>
                          ) : referrals
                            .filter(r => {
                              if (referralFilter === 'Pending') return r.status === 'pending';
                              if (referralFilter === 'Completed') return r.status === 'completed';
                              if (referralFilter === 'Rejected') return r.status === 'rejected';
                              return true;
                            })
                            .filter(r => {
                              const s = referralSearch.toLowerCase();
                              const referrerName = r.referrerId?.fullName || r.referrerId?.name || '';
                              const referrerEmail = r.referrerId?.email || '';
                              const referredName = r.referredUserId?.fullName || r.referredUserId?.name || '';
                              const referredEmail = r.referredUserId?.email || '';
                              const bizName = r.referredBusinessId?.name || '';
                              return (
                                referrerName.toLowerCase().includes(s) ||
                                referrerEmail.toLowerCase().includes(s) ||
                                referredName.toLowerCase().includes(s) ||
                                referredEmail.toLowerCase().includes(s) ||
                                bizName.toLowerCase().includes(s)
                              );
                            })
                            .map(r => {
                              const checks = r.antiFraudChecks || {};
                              const hasFlags = checks.selfReferral || checks.duplicateMobile || checks.duplicateGST || checks.duplicateBusiness;
                              return (
                                <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-6 py-4">
                                    <div className="flex flex-col text-left">
                                      <span className="font-extrabold text-slate-800">{r.referrerId?.fullName || 'UBT Member'}</span>
                                      <span className="text-[10px] text-slate-400 mt-0.5">{r.referrerId?.email || 'N/A'}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex flex-col text-left">
                                      <span className="font-extrabold text-slate-800">{r.referredUserId?.fullName || 'New Merchant'}</span>
                                      <span className="text-[10px] text-slate-400 mt-0.5">{r.referredUserId?.email || 'N/A'}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex flex-col text-left">
                                      <span className="font-extrabold text-slate-800">{r.referredBusinessId?.name || 'No business listed yet'}</span>
                                      {r.referredBusinessId?.gstNumber && (
                                        <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">GST: {r.referredBusinessId.gstNumber}</span>
                                      )}
                                      {r.referredBusinessId && (
                                        <div className="flex items-center gap-1.5 mt-1">
                                          <span className={`text-[8.5px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                            r.referredBusinessId.status === 'Approved'
                                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                                          }`}>
                                            {r.referredBusinessId.status}
                                          </span>
                                          <span className={`text-[8.5px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                            r.referredBusinessId.subscriptionStatus === 'active'
                                              ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                              : 'bg-slate-50 text-slate-550 border border-slate-100'
                                          }`}>
                                            {r.referredBusinessId.subscriptionStatus === 'active' ? 'Subscribed' : 'No Sub'}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                                      {checks.selfReferral && <span className="bg-rose-50 text-rose-650 border border-rose-100 text-[8.5px] font-extrabold px-1.5 py-0.5 rounded uppercase">Self Referral</span>}
                                      {checks.duplicateMobile && <span className="bg-amber-50 text-amber-650 border border-amber-100 text-[8.5px] font-extrabold px-1.5 py-0.5 rounded uppercase">Dup Phone</span>}
                                      {checks.duplicateGST && <span className="bg-red-50 text-red-650 border border-red-100 text-[8.5px] font-extrabold px-1.5 py-0.5 rounded uppercase">Dup GST</span>}
                                      {checks.duplicateBusiness && <span className="bg-orange-50 text-orange-655 border border-orange-100 text-[8.5px] font-extrabold px-1.5 py-0.5 rounded uppercase">Dup Name</span>}
                                      {!hasFlags && <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8.5px] font-extrabold px-1.5 py-0.5 rounded uppercase">Passed</span>}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[9.5px] font-black uppercase ${
                                      r.status === 'completed'
                                        ? 'bg-emerald-50 text-[#027244] border border-emerald-150'
                                        : r.status === 'rejected'
                                          ? 'bg-rose-50 text-rose-650 border border-rose-150'
                                          : 'bg-amber-50 text-amber-650 border border-amber-150'
                                    }`}>
                                      {r.status === 'completed' ? 'Approved' : r.status}
                                    </span>
                                    {r.rejectionReason && (
                                      <p className="text-[9px] text-rose-600 mt-1 max-w-[120px] truncate" title={r.rejectionReason}>
                                        Reason: {r.rejectionReason}
                                      </p>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                      {r.status !== 'completed' && (
                                        <button
                                          onClick={() => {
                                            if (confirm('Manually approve this referral and credit 100 points to the referrer?')) {
                                              handleReferralModerate(r._id, 'approve');
                                            }
                                          }}
                                          className="px-2.5 py-1.5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[10px] rounded-lg cursor-pointer transition-colors shadow-2xs"
                                        >
                                          Approve
                                        </button>
                                      )}
                                      {r.status !== 'rejected' && (
                                        <button
                                          onClick={() => {
                                            const reason = prompt('Please enter a rejection reason (optional):');
                                            if (reason !== null) {
                                              handleReferralModerate(r._id, 'reject', reason);
                                            }
                                          }}
                                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-650 font-extrabold text-[10px] rounded-lg cursor-pointer transition-colors"
                                        >
                                          Reject
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          {!referralsLoading && referrals.length === 0 && (
                            <tr>
                              <td colSpan="6" className="text-center py-16 text-slate-400">
                                <div className="flex flex-col items-center gap-2">
                                  <Gift className="h-8 w-8 text-slate-300" />
                                  <span className="text-xs font-bold text-slate-700">No Referrals Recorded</span>
                                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs font-semibold">No referrals have been recorded or submitted on the platform yet.</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: CATEGORY MANAGEMENT */}
              {activeTab === 'Category Management' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn">
                  
                  {/* Title Block */}
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col text-left">
                      <h3 className="font-extrabold text-slate-800 text-base leading-tight font-sans">Category Management Console</h3>
                      <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Seeded presets, custom requests vetting, automatic icon assignment, and category mergers.</span>
                    </div>
                  </div>

                  {/* Split Layout: Left side for requests & grid, Right side for operations */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
                    
                    {/* Left & Center: Requests and Category Lists */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                      
                      {/* Section 1: Pending Requests */}
                      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
                        <h4 className="font-extrabold text-xs uppercase tracking-wider mb-4 border-b pb-3 border-slate-100 flex items-center gap-2 text-slate-800">
                          <Clock className="h-4.5 w-4.5 text-amber-500 animate-spin-slow" /> Custom Category Requests ({pendingCategories.length})
                        </h4>
                        
                        {pendingCategories.length === 0 ? (
                          <div className="text-center py-10 text-slate-400 text-xs font-semibold flex flex-col items-center gap-2">
                            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                            <span>All custom category requests resolved!</span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4">
                            {pendingCategories.map(biz => (
                              <div key={biz._id} className="border border-slate-200 rounded-2xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                                <div className="flex flex-col text-left">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-amber-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-sm">Custom category request</span>
                                    <span className="text-[9px] font-extrabold text-slate-400">Biz Status: {biz.status}</span>
                                  </div>
                                  <span className="font-black text-sm mt-2 text-[#001c41]">"{biz.customCategoryName}"</span>
                                  <span className="text-[10.5px] text-slate-400 font-semibold mt-1">Requested by business: <b className="text-slate-555">{biz.name}</b> ({biz.ownerId?.fullName || 'Owner'})</span>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 items-center">
                                  <select
                                    onChange={(e) => {
                                      const catId = e.target.value;
                                      if (!catId) return;
                                      const matched = presetCategories.find(c => c._id === catId);
                                      if (matched) {
                                        const confirmed = confirm(`Assign existing category "${matched.categoryName}" for "${biz.customCategoryName}"?`);
                                        if (confirmed) {
                                          resolveCategoryRequest(biz._id, 'assign', matched._id);
                                        }
                                      }
                                      e.target.value = "";
                                    }}
                                    className="py-1.5 px-3 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-[10px] font-extrabold cursor-pointer transition-colors outline-none font-sans"
                                  >
                                    <option value="">-- Assign Existing Category --</option>
                                    {presetCategories.map(c => (
                                      <option key={c._id} value={c._id}>{c.categoryName}</option>
                                    ))}
                                  </select>
                                  <button
                                    onClick={() => {
                                      const isCreate = confirm(`Create genuinely new category "${biz.customCategoryName}"? It will auto-resolve the business mapping.`);
                                      if (isCreate) {
                                        resolveCategoryRequest(biz._id, 'create', null, biz.customCategoryName);
                                      }
                                    }}
                                    className="py-1.5 px-3 bg-[#027244] hover:bg-[#005934] text-white text-[10px] font-extrabold rounded-xl transition-colors cursor-pointer shadow-sm shadow-emerald-800/10 font-sans"
                                  >
                                    Create & Map
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Section 2: Preset Seeded Categories Grid */}
                      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
                        <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-100">
                          <h4 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 text-slate-800">
                            <Grid className="h-4.5 w-4.5 text-emerald-500" /> Preset Categories ({presetCategories.length})
                          </h4>
                          <span className="text-[10px] text-slate-500 font-bold">Sort: Alphabetical</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                          {presetCategories.map(cat => {
                            const count = businesses.filter(b => b.category === cat.categoryName || b.type === cat.categoryName).length;
                            return (
                              <div 
                                key={cat._id} 
                                className="border border-slate-200 rounded-2xl p-4 flex justify-between items-center transition-all bg-slate-50/50 hover:bg-slate-50"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-9 w-9 rounded-xl flex items-center justify-center font-black shrink-0 bg-emerald-50 text-[#027244] border border-emerald-100">
                                    <Store className="h-4.5 w-4.5" />
                                  </div>
                                  <div className="flex flex-col text-left min-w-0">
                                    <span className="font-extrabold text-xs truncate text-slate-800">{cat.categoryName}</span>
                                    <span className="text-[9px] text-slate-400 mt-1 font-semibold truncate leading-none">Slug: {cat.slug || cat.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</span>
                                    <span className="text-[9.5px] text-emerald-650 font-black mt-2 leading-none">{count} active businesses</span>
                                  </div>
                                </div>

                                <div className="flex gap-1.5 shrink-0">
                                  <button
                                    onClick={() => {
                                      const newName = prompt("Rename category:", cat.categoryName);
                                      if (!newName || newName === cat.categoryName) return;
                                      updatePresetCategory(cat._id, { categoryName: newName });
                                    }}
                                    className="h-7 w-7 rounded-lg border border-slate-355 hover:bg-slate-100 flex items-center justify-center cursor-pointer text-slate-550 font-extrabold text-[10px]"
                                    title="Edit Category Name"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to permanently delete category "${cat.categoryName}"? Businesses linked will stay fallback to "Others".`)) {
                                        deletePresetCategory(cat._id);
                                      }
                                    }}
                                    className="h-7 w-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 flex items-center justify-center cursor-pointer border border-rose-500/10"
                                    title="Delete Category"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions Column (Add Category & Merge Console) */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                      
                      {/* Action 1: Add Category Form */}
                      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-5">
                        <div>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider mb-1 text-slate-800">Add Preset Category</h4>
                          <span className="text-[10px] text-slate-400 font-semibold leading-relaxed">Add a new standard business classification instantly. Includes Levenshtein duplicate prevention warning.</span>
                        </div>

                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const targetName = e.target.categoryName.value.trim();
                            if (!targetName) return;

                            try {
                              // Duplicate prevention fuzzy check
                              const dupRes = await fetch('http://localhost:5000/api/categories/check-duplicate', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ categoryName: targetName })
                              });
                              const dupData = await dupRes.json();
                              if (dupData.success && dupData.isDuplicate) {
                                alert(dupData.message);
                                return;
                              }

                              // Create Category
                              const createRes = await fetch('http://localhost:5000/api/categories', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${localStorage.getItem('ubt_token')}`
                                },
                                body: JSON.stringify({ categoryName: targetName, description: 'Preset category created manually' })
                              });
                              if (createRes.ok) {
                                alert(`Category "${targetName}" created successfully!`);
                                e.target.reset();
                                loadPlatformRealData();
                              }
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="flex flex-col gap-4 text-left"
                        >
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest leading-none">Category Name *</label>
                            <input
                              type="text"
                              name="categoryName"
                              required
                              placeholder="e.g. Solar Solutions"
                              className="w-full border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244] bg-slate-50/50 text-[#001c41]"
                            />
                          </div>

                          <button
                            type="submit"
                            className="py-3 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                          >
                            Add Category
                          </button>
                        </form>
                      </div>

                      {/* Action 2: Merge Duplicate Categories Panel */}
                      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-5">
                        <div>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider mb-1 text-slate-800">Merge Categories Console</h4>
                          <span className="text-[10px] text-slate-400 font-semibold leading-relaxed">Combine similar or duplicate categories (e.g. "Restaurant" into "Restaurants"). Links all matching businesses to target and resolves source.</span>
                        </div>

                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const sourceId = e.target.sourceCategoryId.value;
                            const targetId = e.target.targetCategoryId.value;
                            if (!sourceId || !targetId) {
                              alert("Please select both source and target categories.");
                              return;
                            }
                            if (sourceId === targetId) {
                              alert("Source and target categories must be different.");
                              return;
                            }

                            if (confirm("Are you sure you want to merge these categories? This will remap all businesses linked to source category and permanently delete it!")) {
                              try {
                                const mergeRes = await fetch('http://localhost:5000/api/admin/categories/merge', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('ubt_token')}`
                                  },
                                  body: JSON.stringify({ sourceCategoryId: sourceId, targetCategoryId: targetId })
                                });
                                const data = await mergeRes.json();
                                if (data.success) {
                                  alert(data.message || "Categories successfully merged!");
                                  loadPlatformRealData();
                                } else {
                                  alert(data.message || "Merge execution failed.");
                                }
                              } catch (err) {
                                console.error(err);
                              }
                            }
                          }}
                          className="flex flex-col gap-4 text-left"
                        >
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest leading-none">Source Category (To Merge / Delete)</label>
                            <select
                              name="sourceCategoryId"
                              required
                              className="w-full border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244] cursor-pointer bg-slate-50/50 text-[#001c41]"
                            >
                              <option value="">-- Select Source --</option>
                              {presetCategories.map(c => (
                                <option key={c._id} value={c._id}>{c.categoryName}</option>
                              ))}
                            </select>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest leading-none">Target Category (To Keep / Direct To)</label>
                            <select
                              name="targetCategoryId"
                              required
                              className="w-full border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244] cursor-pointer bg-slate-50/50 text-[#001c41]"
                            >
                              <option value="">-- Select Target --</option>
                              {presetCategories.map(c => (
                                <option key={c._id} value={c._id}>{c.categoryName}</option>
                              ))}
                            </select>
                          </div>

                          <button
                            type="submit"
                            className="py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                          >
                            Execute Category Merger
                          </button>
                        </form>
                      </div>

                    </div>
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

              {/* Branches Sub-Section */}
              <div className="flex flex-col gap-3.5">
                <span className="font-extrabold text-xs text-slate-800 border-b border-slate-100 pb-1.5 uppercase tracking-wider">Registered Branches ({selectedBizBranches.length})</span>
                
                {selectedBizBranchesLoading ? (
                  <div className="flex items-center justify-center py-4 gap-2 text-xs text-slate-450 font-semibold">
                    <RefreshCw className="h-4 w-4 animate-spin text-emerald-600" />
                    <span>Loading branches...</span>
                  </div>
                ) : selectedBizBranches.length === 0 ? (
                  <span className="text-xs text-slate-400 font-bold italic py-1">No additional branches registered for this business.</span>
                ) : (
                  <div className="flex flex-col gap-3">
                    {selectedBizBranches.map((br) => (
                      <div key={br._id} className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-2.5 text-xs text-slate-600">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-extrabold text-slate-850 text-xs leading-tight">{br.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase shrink-0 border ${
                            br.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
                            br.status === 'Pending Verification' ? 'bg-amber-50 text-amber-700 border-amber-250 animate-pulse' :
                            br.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-250' :
                            'bg-red-50 text-red-700 border border-red-250'
                          }`}>
                            {br.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-col gap-1.5 font-semibold text-slate-500">
                          {br.branchManagerName && (
                            <div>
                              <span className="text-slate-400 text-[10px] uppercase font-bold mr-1">Manager:</span>
                              <span className="text-slate-700 font-bold">{br.branchManagerName}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold mr-1">Address:</span>
                            <span className="text-slate-700 font-bold">{br.address}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold mr-1">Phone:</span>
                            <span className="text-slate-750 font-bold">{br.phone}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold mr-1">Hours:</span>
                            <span className="text-slate-700 font-bold">{br.workingHours || '9:00 AM - 8:00 PM'}</span>
                          </div>
                        </div>

                        {/* Direct moderation actions for this branch */}
                        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-2.5 mt-1">
                          {br.status !== 'Approved' && (
                            <button
                              onClick={() => handleBranchStatusChange(br._id, 'Approved')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase cursor-pointer transition-colors shadow-2xs"
                            >
                              Approve
                            </button>
                          )}
                          {(br.status === 'Pending Verification' || br.status === 'Under Review') && (
                            <button
                              onClick={() => handleBranchStatusChange(br._id, 'Rejected')}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black uppercase cursor-pointer transition-colors shadow-2xs"
                            >
                              Reject
                            </button>
                          )}
                          {br.status === 'Approved' && (
                            <button
                              onClick={() => handleBranchStatusChange(br._id, 'Suspended')}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-black uppercase cursor-pointer transition-colors shadow-2xs"
                            >
                              Deactivate
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                      ? 'text-emerald-655'
                      : selectedBlogModal.status === 'Pending Approval' || selectedBlogModal.status === 'Needs Revision'
                        ? 'text-amber-600'
                        : selectedBlogModal.status === 'Rejected'
                          ? 'text-rose-600'
                          : 'text-slate-500'
                  }`}>{selectedBlogModal.status}</span> • Category: <strong className="text-emerald-700 uppercase">{selectedBlogModal.category || 'Business Tips'}</strong>
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
