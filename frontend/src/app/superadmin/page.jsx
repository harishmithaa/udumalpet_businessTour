import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, RefreshCw, Star, Check, X, AlertCircle, AlertTriangle, 
  ArrowRight, Eye, Grid, Shield, CreditCard, LayoutDashboard, Store, BookOpen, Calendar, 
  MessageSquare, CreditCard as CardIcon, Bell, BarChart3, Settings, LogOut, Search, User, 
  MapPin, ChevronRight, Landmark, Trash2, Mail, Globe, Award, ShieldAlert, CheckCircle2,
  Clock, Plus, Filter, Activity, Cpu, Database, Terminal, Users, BarChart, FileText, Ban,
  Play, Square, Layers, Sparkles, HelpCircle, Key, Lock, Phone, UserCheck, ShieldOff, CheckSquare,
  Utensils, Dumbbell, Plane, GraduationCap, Camera, Leaf, Building, Coins, ShoppingBag, Wrench
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  
  // Tab navigation state
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [recentRegTab, setRecentRegTab] = useState('Businesses');
  const [auditSubTab, setAuditSubTab] = useState('Businesses'); // Businesses | Blogs | Testimonials
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // User Profile details modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Dropdowns & theme states
  const [themeMode, setThemeMode] = useState('light'); // dark | light
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Extend Subscription Modal States
  const [showExtendSubModal, setShowExtendSubModal] = useState(false);
  const [selectedBizForExtend, setSelectedBizForExtend] = useState(null);
  const [extendDays, setExtendDays] = useState(30);

  // Support Ticket Modal States
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Edit Admin states
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);

  // Send Direct Notification to Merchant states
  const [merchantForNotice, setMerchantForNotice] = useState(null);
  const [showMerchantNoticeModal, setShowMerchantNoticeModal] = useState(false);
  const [merchantNoticeText, setMerchantNoticeText] = useState('');

  // Blog / Event Edit states
  const [editingBlog, setEditingBlog] = useState(null);
  const [showEditBlogModal, setShowEditBlogModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditEventModal, setShowEditEventModal] = useState(false);

  // Blog Moderation Modal State (for popup audit desk)
  const [selectedBlogModal, setSelectedBlogModal] = useState(null);
  const [suggestionText, setSuggestionText] = useState('');

  // Reviews moderation states
  const [suspendedUsers, setSuspendedUsers] = useState([]);

  // Custom states for forms
  const [newNotice, setNewNotice] = useState({ title: '', message: '', type: 'announcement' });
  const [noticeSuccess, setNoticeSuccess] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ fullName: '', email: '', permissions: 'Full' });
  const [newPlanPrice, setNewPlanPrice] = useState({ monthly: 499, yearly: 4999 });

  // Banner Image Management State
  const [banners, setBanners] = useState([
    { id: 'b1', title: 'Welcome to Udumalpet Business Tour', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80', subtitle: 'Explore the green wind farms, shops, and resorts of Udumalpet.', link: '/businesses', active: true },
    { id: 'b2', title: 'Discover Thirumoorthy Dam & Hills', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80', subtitle: 'Plan your ultimate local weekend getaways and scenic sightseeing.', link: '/about', active: true },
    { id: 'b3', title: 'Support Local Bazaar Traders', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80', subtitle: 'Find direct contact numbers, locality matching, and ratings.', link: '/businesses?category=Shops', active: true }
  ]);
  const [newBanner, setNewBanner] = useState({ title: '', image: '', subtitle: '', link: '/businesses', active: true });

  // Page Layout Customization State
  const [pageLayout, setPageLayout] = useState({
    directoryLayout: 'grid', // grid | list | masonry
    themeAccent: 'emerald', // emerald | blue | indigo | purple
    sidebarPosition: 'left', // left | top
    glassmorphism: true,
    fontFamily: 'sans' // sans | serif | mono
  });

  // Information Submission Form Configuration State (Informations getting page field config)
  const [submissionFields, setSubmissionFields] = useState({
    gstNumber: { label: 'GST Number', required: false, enabled: true },
    yearEstablished: { label: 'Year Established', required: true, enabled: true },
    employeeCount: { label: 'Employee Count Range', required: false, enabled: true },
    languagesKnown: { label: 'Languages Spoken', required: false, enabled: true },
    timings: { label: 'Business Opening Hours', required: true, enabled: true },
    website: { label: 'Website URL', required: false, enabled: true },
    brochure: { label: 'Upload PDF Catalog/Brochure', required: false, enabled: false }
  });
  const [formGuidelines, setFormGuidelines] = useState('Submit clear commercial details, locality coordinates, and contact details to get audited. Approved businesses get standard indexing, and active subscribers receive verified badges.');

  // Regular Users / Reviewers state
  const [regularUsers, setRegularUsers] = useState([
    { _id: 'usr_1', fullName: 'Arun Kumar', email: 'arun@gmail.com', mobileNumber: '+91 94432 11111', status: 'Active', role: 'user', createdAt: new Date('2025-01-15') },
    { _id: 'usr_2', fullName: 'Divya Pandian', email: 'divya@gmail.com', mobileNumber: '+91 98944 22222', status: 'Active', role: 'user', createdAt: new Date('2025-02-20') },
    { _id: 'usr_3', fullName: 'Spammer Bot', email: 'spambot@yahoo.com', mobileNumber: '+91 90000 00000', status: 'Suspended', role: 'user', createdAt: new Date('2025-03-05') }
  ]);
  const [merchantUserFilter, setMerchantUserFilter] = useState('merchants'); // merchants | regularUsers
  const [bizStatusFilter, setBizStatusFilter] = useState('All'); // All | Approved | Pending | Suspended | Premium | Expired
  const [merchantStatusFilter, setMerchantStatusFilter] = useState('All'); // All | Active | Suspended
  const [eventStatusFilter, setEventStatusFilter] = useState('All'); // All | Approved | Pending
  const [blogStatusFilter, setBlogStatusFilter] = useState('All'); // All | Approved | Pending
  const [platformSubTab, setPlatformSubTab] = useState('plans'); // plans | banners | layouts | fields
  const [newPlan, setNewPlan] = useState({ name: '', price: '', duration: '30 Days', type: 'Custom', isOffer: false, offerText: '' });

  // Access Control State
  const [permissionsMatrix, setPermissionsMatrix] = useState({
    superadmin: { businesses: true, blogs: true, events: true, subPlans: true, systemLogs: true, accessControl: true },
    admin: { businesses: true, blogs: true, events: true, subPlans: false, systemLogs: false, accessControl: false },
    owner: { businesses: false, blogs: false, events: false, subPlans: false, systemLogs: false, accessControl: false }
  });

  // Datasets states (Inherited from Admin)
  const [businesses, setBusinesses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [presetCategories, setPresetCategories] = useState([]);
  const [pendingCategories, setPendingCategories] = useState([]);

  // Mock Merchants state
  const [merchants, setMerchants] = useState([
    { _id: 'mer_1', fullName: 'Muthuvel S.', email: 'muthuvel@gmail.com', mobileNumber: '+91 94435 99999', status: 'Active', totalBusinesses: 2, createdAt: new Date('2025-01-05') },
    { _id: 'mer_2', fullName: 'Rajesh Kumar', email: 'rajesh@gmail.com', mobileNumber: '+91 98425 22345', status: 'Active', totalBusinesses: 1, createdAt: new Date('2025-02-10') },
    { _id: 'mer_3', fullName: 'Senthil Nathan', email: 'senthil@gmail.com', mobileNumber: '+91 97895 43210', status: 'Suspended', totalBusinesses: 1, createdAt: new Date('2025-03-01') }
  ]);

  // Mock Support Tickets state
  const [supportTickets, setSupportTickets] = useState([
    { _id: 'TKT-1024', user: 'muthuvel@gmail.com', issueType: 'Billing Failure', priority: 'High', status: 'Open', message: 'I was charged twice for the monthly plan. Please refund one payment.', createdAt: new Date(new Date().getTime() - 4 * 60 * 60 * 1000) },
    { _id: 'TKT-1025', user: 'rajesh@gmail.com', issueType: 'Badge Delay', priority: 'Medium', status: 'In Progress', message: 'I uploaded my documents 2 days ago but still do not see the UDT Verified badge.', createdAt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) },
    { _id: 'TKT-1026', user: 'senthil@gmail.com', issueType: 'Blog Moderation', priority: 'Low', status: 'Closed', message: 'My blog post was rejected. Can you explain why?', replyText: 'Hello, your blog post contained external advertisement links which violate our guidelines. It has been moderated.', createdAt: new Date(new Date().getTime() - 48 * 60 * 60 * 1000) }
  ]);

  // Platform pricing & settings
  const [plans, setPlans] = useState([
    { id: 'monthly', name: 'Monthly Premium Plan', price: 500, duration: '28 Days' },
    { id: 'yearly', name: 'Yearly Premium Plan', price: 4999, duration: '365 Days' }
  ]);

  // System status metrics
  const [systemMetrics, setSystemMetrics] = useState({
    uptime: '99.98%',
    cpuUsage: '14%',
    dbConn: 'Connected (Healthy)',
    apiLatency: '45ms'
  });

  // System activities logs
  const [systemLogs, setSystemLogs] = useState([
    { time: '11:42:15', event: 'Automatic expiry checker: Suspended 1 expired listing', type: 'system' },
    { time: '11:40:02', event: 'User superadmin@gmail.com authenticated successfully', type: 'info' },
    { time: '11:15:30', event: 'Database backup successfully uploaded to S3 grid', type: 'info' },
    { time: '10:55:12', event: 'Payment failed warning: Txn #pay_123456 aborted by gateway', type: 'warning' },
    { time: '10:14:02', event: 'API gateway operational and listening on PORT 5000', type: 'system' }
  ]);

  // Admins dataset states
  const [admins, setAdmins] = useState([
    { _id: 'adm_1', fullName: 'Haris R. (Co-Founder)', email: 'haris@ubt.com', role: 'admin', status: 'Active', permissions: 'Full', createdAt: new Date('2025-01-10') },
    { _id: 'adm_2', fullName: 'Ananth S. (Moderator)', email: 'ananth@ubt.com', role: 'admin', status: 'Active', permissions: 'Moderation Only', createdAt: new Date('2025-02-15') },
    { _id: 'adm_3', fullName: 'Local Clerk', email: 'clerk@ubt.com', role: 'admin', status: 'Suspended', permissions: 'Read Only', createdAt: new Date('2025-03-20') }
  ]);

  // Queries inbox state
  const [queries, setQueries] = useState([]);
  const [queriesLoading, setQueriesLoading] = useState(false);
  const [queriesError, setQueriesError] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [queryFilter, setQueryFilter] = useState('All'); // All | Pending | Replied
  const [supportSubTab, setSupportSubTab] = useState('tickets'); // tickets | queries
  const [querySearch, setQuerySearch] = useState('');

  // Modal State
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [showBizModal, setShowBizModal] = useState(false);

  // New Category Vetting States
  const [selectedPresetForAssign, setSelectedPresetForAssign] = useState('');
  const [selectedPresetForMerge, setSelectedPresetForMerge] = useState('');
  const [customNewCategoryName, setCustomNewCategoryName] = useState('');
  const [customNewCategoryIcon, setCustomNewCategoryIcon] = useState('Store');

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

  const fetchPlans = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/plans');
      const data = await res.json();
      if (data.success) {
        const mappedPlans = data.data.map(p => ({
          id: p._id,
          name: p.name,
          price: p.price,
          duration: `${p.durationDays} Days`,
          type: p.type,
          isOffer: p.isOffer,
          offerText: p.offerText,
          isActive: p.isActive,
          description: p.description
        }));
        setPlans(mappedPlans);
      }
    } catch (err) {
      console.warn('API error fetching plans, using local defaults.', err);
    }
  };


  const loadPlatformRealData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` };
      
      // 1. Fetch dashboard control stats & telemetry logs
      const statsRes = await fetch('http://localhost:5000/api/superadmin/dashboard-stats', { headers });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setSystemMetrics(statsData.data.metrics);
        setSystemLogs(statsData.data.systemLogs);
      }

      // 2. Fetch businesses list
      const bizRes = await fetch('http://localhost:5000/api/superadmin/businesses', { headers });
      const bizData = await bizRes.json();
      if (bizData.success) {
        const formattedBiz = bizData.data.map(b => ({
          ...b,
          ownerName: b.ownerId ? b.ownerId.fullName || b.ownerId.name || 'Merchant' : 'Merchant',
          ownerEmail: b.ownerId ? b.ownerId.email : '',
          googlePlaceId: b.googlePlaceId || '',
          googleRating: b.googleRating || 0,
          googleReviewsCount: b.googleReviewsCount || 0
        }));
        setBusinesses(formattedBiz);
      }

      // 3. Fetch users & accounts list
      const usersRes = await fetch('http://localhost:5000/api/superadmin/users', { headers });
      const usersData = await usersRes.json();
      if (usersData.success) {
        const allUsers = usersData.data;
        setMerchants(allUsers.filter(u => u.role === 'merchant' || u.role === 'owner'));
        setRegularUsers(allUsers.filter(u => u.role === 'visitor' || u.role === 'user'));
        setAdmins(allUsers.filter(u => u.role === 'admin' || u.role === 'superadmin'));
      }

      // 4. Fetch blog articles
      const blogsRes = await fetch('http://localhost:5000/api/superadmin/blogs', { headers });
      const blogsData = await blogsRes.json();
      if (blogsData.success) {
        setBlogs(blogsData.data);
      }

      // 5. Fetch events
      const evRes = await fetch('http://localhost:5000/api/superadmin/events', { headers });
      const evData = await evRes.json();
      if (evData.success) {
        setEvents(evData.data);
      }

      // 6. Fetch reviews feed
      const revRes = await fetch('http://localhost:5000/api/superadmin/reviews', { headers });
      const revData = await revRes.json();
      if (revData.success) {
        setReviews(revData.data);
      }

      // 7. Fetch subscription logs
      const subRes = await fetch('http://localhost:5000/api/superadmin/subscriptions', { headers });
      const subData = await subRes.json();
      if (subData.success) {
        setSubscriptions(subData.data);
      }

      // 8. Fetch support tickets
      const tktRes = await fetch('http://localhost:5000/api/superadmin/support-tickets', { headers });
      const tktData = await tktRes.json();
      if (tktData.success) {
        setSupportTickets(tktData.data);
      }

      // Fetch dynamic seeded preset categories
      const categoriesRes = await fetch('http://localhost:5000/api/categories', { headers });
      const categoriesData = await categoriesRes.json();
      if (categoriesData.success) {
        setPresetCategories(categoriesData.data);
      }

      // Fetch pending custom category requests
      const pendingCatRes = await fetch('http://localhost:5000/api/superadmin/category-review/pending', { headers });
      const pendingCatData = await pendingCatRes.json();
      if (pendingCatData.success) {
        setPendingCategories(pendingCatData.data);
      }

      // 9. Fetch dynamic customizer configurations
      const configRes = await fetch('http://localhost:5000/api/superadmin/config', { headers });
      const configData = await configRes.json();
      if (configData.success && configData.data) {
        const conf = configData.data;
        if (conf.pageLayout) setPageLayout(conf.pageLayout);
        if (conf.submissionFields) setSubmissionFields(conf.submissionFields);
        if (conf.formGuidelines) setFormGuidelines(conf.formGuidelines);
        if (conf.banners && conf.banners.length > 0) setBanners(conf.banners);
        if (conf.permissionsMatrix) setPermissionsMatrix(conf.permissionsMatrix);
      }

    } catch (err) {
      console.error('Error hydrating platform datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  const savePlatformSettings = async (updated) => {
    try {
      await fetch('http://localhost:5000/api/superadmin/config', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` 
        },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error('Error auto-persisting platform settings:', err);
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
      if (uObj.role !== 'superadmin') {
        navigate('/login?error=unauthorized');
        return;
      }
      setToken(storedToken);
      setUser(uObj);
      loadPlatformRealData();
      fetchQueries();
      fetchPlans();
    } catch (err) {
      localStorage.removeItem('ubt_user');
      localStorage.removeItem('ubt_token');
      navigate('/login');
    }
  }, []);

  // Debounced configurations persistence hook
  useEffect(() => {
    if (token) {
      const timeoutId = setTimeout(() => {
        savePlatformSettings({ pageLayout, submissionFields, formGuidelines, banners, permissionsMatrix });
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [pageLayout, submissionFields, formGuidelines, banners, permissionsMatrix]);

  // Levenshtein and Fuzzy Matching logic for Category Vetting
  const levenshteinDistance = (s1, s2) => {
    const m = s1.length;
    const n = s2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1].toLowerCase() === s2[j - 1].toLowerCase()) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,    // deletion
            dp[i][j - 1] + 1,    // insertion
            dp[i - 1][j - 1] + 1 // substitution
          );
        }
      }
    }
    return dp[m][n];
  };

  const checkFuzzySimilarity = (name1, name2) => {
    const n1 = name1.toLowerCase().trim();
    const n2 = name2.toLowerCase().trim();
    
    if (n1 === n2) return true;
    if (n1.includes(n2) || n2.includes(n1)) return true; // substring check
    
    const maxLen = Math.max(n1.length, n2.length);
    if (maxLen === 0) return true;
    const distance = levenshteinDistance(n1, n2);
    const similarity = 1 - distance / maxLen;
    return similarity > 0.75; // 75% similarity threshold
  };

  const mapKeywordToIcon = (categoryName) => {
    if (!categoryName) return 'Store';
    const name = categoryName.toLowerCase();
    if (name.includes('restaurant') || name.includes('food') || name.includes('cafe') || name.includes('bakery') || name.includes('sweet') || name.includes('catering') || name.includes('juice') || name.includes('tea')) {
      return 'Utensils';
    }
    if (name.includes('hospital') || name.includes('medical') || name.includes('clinic') || name.includes('pharmacy') || name.includes('doctor') || name.includes('physiotherapy') || name.includes('dental') || name.includes('veterinary')) {
      return 'Activity';
    }
    if (name.includes('gym') || name.includes('fitness') || name.includes('yoga') || name.includes('sports') || name.includes('dumbbell') || name.includes('athletic')) {
      return 'Dumbbell';
    }
    if (name.includes('travel') || name.includes('tour') || name.includes('rental') || name.includes('taxi') || name.includes('bus') || name.includes('vehicle') || name.includes('plane') || name.includes('flight')) {
      return 'Plane';
    }
    if (name.includes('school') || name.includes('college') || name.includes('education') || name.includes('tuition') || name.includes('academy') || name.includes('coaching') || name.includes('training') || name.includes('drive')) {
      return 'GraduationCap';
    }
    if (name.includes('photo') || name.includes('video') || name.includes('camera') || name.includes('shoot') || name.includes('media')) {
      return 'Camera';
    }
    if (name.includes('agri') || name.includes('farm') || name.includes('coconut') || name.includes('fertilizer') || name.includes('dairy') || name.includes('poultry') || name.includes('irrigation') || name.includes('leaf') || name.includes('plant')) {
      return 'Leaf';
    }
    if (name.includes('construct') || name.includes('build') || name.includes('estate') || name.includes('cement') || name.includes('steel') || name.includes('architect') || name.includes('borewell') || name.includes('home') || name.includes('house')) {
      return 'Building';
    }
    if (name.includes('finance') || name.includes('account') || name.includes('audit') || name.includes('tax') || name.includes('wallet') || name.includes('bank') || name.includes('money') || name.includes('gold') || name.includes('insurance')) {
      return 'Coins';
    }
    if (name.includes('shop') || name.includes('store') || name.includes('retail') || name.includes('market') || name.includes('garment') || name.includes('textile') || name.includes('bazaar') || name.includes('footwear') || name.includes('gift') || name.includes('stationery') || name.includes('furniture') || name.includes('jewel') || name.includes('mobile') || name.includes('computer') || name.includes('electronics')) {
      return 'ShoppingBag';
    }
    if (name.includes('beauty') || name.includes('parlour') || name.includes('salon') || name.includes('barber') || name.includes('spa') || name.includes('cosmetic') || name.includes('groom')) {
      return 'Sparkles';
    }
    if (name.includes('electric') || name.includes('plumb') || name.includes('carpenter') || name.includes('clean') || name.includes('pest') || name.includes('service') || name.includes('repair') || name.includes('ac')) {
      return 'Wrench';
    }
    return 'Store';
  };

  const renderIconByName = (iconName, className = "h-4 w-4") => {
    const IconComponents = {
      Utensils,
      Activity,
      Dumbbell,
      Plane,
      GraduationCap,
      Camera,
      Leaf,
      Building,
      Coins,
      ShoppingBag,
      Sparkles,
      Wrench,
      Store
    };
    const Comp = IconComponents[iconName] || Store;
    return <Comp className={className} />;
  };

  const getSuggestedMatches = (customName) => {
    if (!customName) return [];
    return presetCategories.filter(cat => checkFuzzySimilarity(customName, cat.categoryName));
  };

  // Sync category fields when business detail opens
  useEffect(() => {
    if (selectedBiz && selectedBiz.categoryStatus === 'Pending Review') {
      const customName = selectedBiz.customCategoryName || '';
      setCustomNewCategoryName(customName);
      setCustomNewCategoryIcon(mapKeywordToIcon(customName));
      setSelectedPresetForAssign('');
      setSelectedPresetForMerge('');
    }
  }, [selectedBiz]);

  const handleResolveCategory = async (bizId, action, categoryId = null, newCategoryName = '', icon = '') => {
    try {
      const res = await fetch('http://localhost:5000/api/superadmin/category-review/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}`
        },
        body: JSON.stringify({
          businessId: bizId,
          action,
          categoryId,
          newCategoryName,
          icon
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Category resolved successfully!');
        // Refresh data
        loadPlatformRealData();
        // Update selectedBiz state inline
        setSelectedBiz(prev => ({
          ...prev,
          categoryStatus: 'Normal',
          customCategoryName: null,
          category: data.data.category,
          categoryId: data.data.categoryId
        }));
      } else {
        alert(data.message || 'Failed to resolve category.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while resolving category.');
    }
  };

  // Super Admin action handlers
  const handleAdminStatusToggle = async (admId) => {
    const target = admins.find(a => a._id === admId);
    if (!target) return;
    const nextStatus = target.status === 'Active' ? 'Suspended' : 'Active';
    try {
      const res = await fetch(`http://localhost:5000/api/superadmin/users/${admId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` 
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        alert(`Admin status toggled successfully to ${nextStatus}!`);
        loadPlatformRealData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminCreation = async (e) => {
    e.preventDefault();
    if (!newAdmin.fullName || !newAdmin.email) return;
    try {
      const res = await fetch('http://localhost:5000/api/superadmin/admins', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` 
        },
        body: JSON.stringify({ 
          fullName: newAdmin.fullName, 
          email: newAdmin.email, 
          password: 'password123', 
          permissions: newAdmin.permissions 
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('New Admin role registered successfully! Default password is: password123');
        setNewAdmin({ fullName: '', email: '', permissions: 'Full' });
        loadPlatformRealData();
      } else {
        alert(data.message || 'Failed to generate admin desk.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePriceUpdate = async (planId, newPrice) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, price: Number(newPrice) } : p));
    
    try {
      const res = await fetch(`http://localhost:5000/api/plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}`
        },
        body: JSON.stringify({ price: Number(newPrice) })
      });
      const data = await res.json();
      if (data.success) {
        loadPlatformRealData();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.warn('API error persisting price change, kept in local state.', err);
    }
  };

  const handleAction = async (bizId, type) => {
    let nextStatus = 'Pending Verification';
    if (type === 'approve') nextStatus = 'Approved';
    if (type === 'reject') nextStatus = 'Rejected';
    if (type === 'suspend') nextStatus = 'Suspended';
    try {
      const res = await fetch(`http://localhost:5000/api/superadmin/businesses/${bizId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` 
        },
        body: JSON.stringify({ status: nextStatus, remarks: 'Super Admin moderation update' })
      });
      if (res.ok) {
        alert(`Listing marked as ${nextStatus} successfully!`);
        loadPlatformRealData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFeaturedToggle = async (bizId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/superadmin/businesses/${bizId}/featured`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` }
      });
      if (res.ok) {
        loadPlatformRealData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBusiness = async (bizId) => {
    if (window.confirm("Are you sure you want to permanently delete this listing? All reviews, blogs, and events matching will be cascade deleted!")) {
      try {
        const res = await fetch(`http://localhost:5000/api/superadmin/businesses/${bizId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` }
        });
        if (res.ok) {
          alert('Listing and its cascaded assets deleted successfully!');
          loadPlatformRealData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleExtendSubscription = async () => {
    if (!selectedBizForExtend) return;
    try {
      const res = await fetch(`http://localhost:5000/api/superadmin/businesses/${selectedBizForExtend._id}/extend-subscription`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` 
        },
        body: JSON.stringify({ days: extendDays })
      });
      if (res.ok) {
        alert(`Extended premium access for ${selectedBizForExtend.name} by ${extendDays} days successfully!`);
        setShowExtendSubModal(false);
        setSelectedBizForExtend(null);
        loadPlatformRealData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMerchantStatusToggle = async (merId) => {
    const target = merchants.find(m => m._id === merId) || regularUsers.find(r => r._id === merId);
    if (!target) return;
    const nextStatus = target.status === 'Active' ? 'Suspended' : 'Active';
    try {
      const res = await fetch(`http://localhost:5000/api/superadmin/users/${merId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` 
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        alert(`Account status updated to ${nextStatus}!`);
        loadPlatformRealData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlogAction = async (blogId, status, suggestions = '') => {
    try {
      const res = await fetch(`http://localhost:5000/api/superadmin/blogs/${blogId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` 
        },
        body: JSON.stringify({ status, suggestions })
      });
      if (res.ok) {
        loadPlatformRealData();
      }
    } catch (err) {
      console.error(err);
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
      const res = await fetch(`http://localhost:5000/api/superadmin/events/${eventId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        loadPlatformRealData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewAction = async (revId, action) => {
    try {
      if (action === 'delete') {
        const res = await fetch(`http://localhost:5000/api/superadmin/reviews/${revId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` }
        });
        if (res.ok) {
          loadPlatformRealData();
        }
      } else {
        const res = await fetch(`http://localhost:5000/api/superadmin/reviews/${revId}/status`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` 
          },
          body: JSON.stringify({ status: action })
        });
        if (res.ok) {
          loadPlatformRealData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTicketAction = async (ticketId, nextStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/superadmin/support-tickets/${ticketId}/reply`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` 
        },
        body: JSON.stringify({ replyText: 'Status moderate check', status: nextStatus })
      });
      if (res.ok) {
        loadPlatformRealData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTicketReply = async () => {
    if (!selectedTicket || !ticketReplyText.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/superadmin/support-tickets/${selectedTicket._id}/reply`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` 
        },
        body: JSON.stringify({ replyText: ticketReplyText })
      });
      if (res.ok) {
        alert('Reply recorded and ticket resolved/closed successfully!');
        setShowTicketModal(false);
        setTicketReplyText('');
        setSelectedTicket(null);
        loadPlatformRealData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ubt_token');
    localStorage.removeItem('ubt_user');
    navigate('/login');
  };

  const resolveCategoryRequest = async (businessId, action, categoryId = null, newCategoryName = null, icon = null) => {
    try {
      const res = await fetch('http://localhost:5000/api/superadmin/category-review/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}`
        },
        body: JSON.stringify({ businessId, action, categoryId, newCategoryName, icon })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "Category request resolved successfully!");
        loadPlatformRealData();
      } else {
        alert(data.message || "Failed to resolve request.");
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

  const handleSaveAdmin = async (e) => {
    e.preventDefault();
    if (!editingAdmin) return;
    try {
      const res = await fetch(`http://localhost:5000/api/superadmin/users/${editingAdmin._id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` 
        },
        body: JSON.stringify({ status: editingAdmin.status })
      });
      if (res.ok) {
        alert("Administrative account configurations saved.");
        setShowEditAdminModal(false);
        setEditingAdmin(null);
        loadPlatformRealData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMerchantNotice = async (e) => {
    e.preventDefault();
    if (!merchantForNotice || !merchantNoticeText.trim()) return;
    try {
      const res = await fetch('http://localhost:5000/api/superadmin/merchant-notice', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` 
        },
        body: JSON.stringify({ 
          email: merchantForNotice.email, 
          message: merchantNoticeText 
        })
      });
      if (res.ok) {
        alert("Direct alert warning notice dispatched successfully.");
        setShowMerchantNoticeModal(false);
        setMerchantForNotice(null);
        setMerchantNoticeText('');
        loadPlatformRealData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    if (!editingBlog) return;
    try {
      const res = await fetch(`http://localhost:5000/api/superadmin/blogs/${editingBlog._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` 
        },
        body: JSON.stringify({ 
          title: editingBlog.title, 
          content: editingBlog.content 
        })
      });
      if (res.ok) {
        alert("Blog article post updated.");
        setShowEditBlogModal(false);
        setEditingBlog(null);
        loadPlatformRealData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      const res = await fetch(`http://localhost:5000/api/superadmin/events/${editingEvent._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` 
        },
        body: JSON.stringify(editingEvent)
      });
      if (res.ok) {
        alert("Event flyer details successfully saved.");
        setShowEditEventModal(false);
        setEditingEvent(null);
        loadPlatformRealData();
      }
    } catch (err) {
      console.error(err);
    }
  };


  // Filtered resource search
  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.ownerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.email?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (bizStatusFilter === 'Approved') return b.status === 'Approved';
    if (bizStatusFilter === 'Pending') return b.status === 'Pending Verification' || b.status === 'Under Review';
    if (bizStatusFilter === 'Suspended') return b.status === 'Suspended';
    if (bizStatusFilter === 'Premium') return b.isPremium || b.subscriptionStatus === 'active';
    if (bizStatusFilter === 'Expired') return b.subscriptionStatus === 'expired';

    return true;
  });

  const filteredMerchants = merchants.filter(m => {
    const matchesSearch = m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (merchantStatusFilter === 'Active') return m.status === 'Active';
    if (merchantStatusFilter === 'Suspended') return m.status === 'Suspended';
    return true;
  });

  const getBlogStatusWeight = (status) => {
    if (status === 'Pending Approval') return 0;
    if (status === 'Needs Revision') return 1;
    if (status === 'Approved') return 2;
    if (status === 'Rejected') return 3;
    return 4;
  };

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) || b.author?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (blogStatusFilter === 'Approved') return b.status === 'Approved';
    if (blogStatusFilter === 'Pending') return b.status === 'Pending Review' || b.status === 'Pending Verification' || b.status === 'Pending Approval';
    return true;
  }).sort((a, b) => getBlogStatusWeight(a.status) - getBlogStatusWeight(b.status) || new Date(b.createdAt) - new Date(a.createdAt));

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (eventStatusFilter === 'Approved') return e.status === 'Approved';
    if (eventStatusFilter === 'Pending') return e.status === 'Pending Review' || e.status === 'Pending Verification';
    return true;
  });

  // 19 nav menu grouped specifications matching the reference dashboard exactly
  const sidebarSections = [
    {
      group: '',
      items: [
        { id: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5" /> }
      ]
    },
    {
      group: 'MANAGE',
      items: [
        { id: 'Businesses', label: 'Businesses', icon: <Store className="h-4.5 w-4.5" /> },
        { id: 'Category Management', label: 'Categories', icon: <Grid className="h-4.5 w-4.5" /> },
        { id: 'Events Moderation', label: 'Events', icon: <Calendar className="h-4.5 w-4.5" /> },
        { id: 'Blogs Moderation', label: 'Blog Posts', icon: <BookOpen className="h-4.5 w-4.5" /> },
        { id: 'Notifications', label: 'Offers & Promotions', icon: <Award className="h-4.5 w-4.5" /> },
        { id: 'Reviews Moderation', label: 'Reviews', icon: <MessageSquare className="h-4.5 w-4.5" /> },
        { id: 'Support Tickets', label: 'Leads / Enquiries', icon: <FileText className="h-4.5 w-4.5" /> },
        { id: 'Reports', label: 'Subscribers', icon: <Users className="h-4.5 w-4.5" /> }
      ]
    },
    {
      group: 'USER MANAGEMENT',
      items: [
        { id: 'Merchants', label: 'Users', icon: <User className="h-4.5 w-4.5" /> },
        { id: 'Access Control', label: 'Roles & Permissions', icon: <Key className="h-4.5 w-4.5" /> },
        { id: 'Admin Management', label: 'Admins', icon: <Shield className="h-4.5 w-4.5" /> }
      ]
    },
    {
      group: 'PAYMENTS & BILLING',
      items: [
        { id: 'Subscriptions', label: 'Subscriptions', icon: <CreditCard className="h-4.5 w-4.5" /> },
        { id: 'Revenue', label: 'Transactions', icon: <RefreshCw className="h-4.5 w-4.5" /> },
        { id: 'Refunds', label: 'Refunds', icon: <Ban className="h-4.5 w-4.5" /> }
      ]
    },
    {
      group: 'CONFIGURATION',
      items: [
        { id: 'Platform Settings', label: 'Settings', icon: <Settings className="h-4.5 w-4.5" /> },
        { id: 'Platform Settings', label: 'Pages & Content', icon: <Layers className="h-4.5 w-4.5" /> },
        { id: 'System Logs', label: 'System Logs', icon: <Terminal className="h-4.5 w-4.5" /> }
      ]
    },
    {
      group: '',
      items: [
        { id: 'Logout', label: 'Logout', icon: <LogOut className="h-4.5 w-4.5" /> }
      ]
    }
  ];

  return (
    <div className={`min-h-screen flex font-sans text-left transition-colors duration-300 ${
      themeMode === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-800'
    }`}>
      
      {/* 1. COLLAPSIBLE LEFT SIDEBAR */}
      <aside className={`text-white flex flex-col justify-between transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      } shrink-0 relative overflow-hidden z-20 shadow-[5px_0_25px_rgba(0,0,0,0.3)] border-r transition-colors duration-300 ${
        themeMode === 'dark' 
          ? 'bg-gradient-to-b from-[#060a13] via-[#0b111e] to-[#03060b] border-slate-800/80' 
          : 'bg-gradient-to-b from-[#001c41] via-[#002d62] to-[#00122d] border-[#027244]/20'
      } hidden md:flex`}>
        <div className="flex flex-col gap-6 py-6 overflow-y-auto max-h-[80vh]">
          {/* Logo brand with UBT Typography Branding */}
          <div className="px-6 flex flex-col gap-2 py-2 border-b border-slate-900/50">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed ? (
                <Link to="/" className="flex items-center select-none py-1">
                  <img src="/logo-dark.png" alt="Udumalpet Business Tour" className="h-10 w-auto object-contain" />
                </Link>
              ) : (
                <span className="text-sm font-black text-emerald-450 mx-auto">UBT</span>
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 rounded-lg px-2.5 py-1 w-fit shadow-[0_0_12px_rgba(99,102,241,0.15)] select-none animate-fadeIn mt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-450 shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-wider leading-none">Super Admin Console</span>
              </div>
            )}
          </div>

          <nav className="flex flex-col gap-4 px-3">
            {sidebarSections.map((section, secIdx) => (
              <div key={secIdx} className="flex flex-col gap-1 text-left">
                {section.group && !sidebarCollapsed && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-4 pt-3 pb-1 select-none text-left leading-none">
                    {section.group}
                  </span>
                )}
                {section.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'Logout') {
                        handleLogout();
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer group hover:shadow-[0_0_15px_rgba(2,114,68,0.15)] relative w-full ${
                      activeTab === item.id
                        ? 'bg-[#027244] text-white shadow-md shadow-[#013520]/15' 
                        : item.id === 'Logout'
                          ? 'text-rose-400 hover:bg-rose-950/20 hover:text-rose-350'
                          : 'text-slate-400 hover:bg-slate-900/40 hover:text-white'
                    }`}
                  >
                    <div className={`transition-transform duration-300 group-hover:scale-110 ${
                      activeTab === item.id
                        ? 'text-white' 
                        : item.id === 'Logout'
                          ? 'text-rose-455 group-hover:text-rose-350'
                          : 'text-slate-500 group-hover:text-emerald-450'
                    }`}>
                      {item.icon}
                    </div>
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer with System Health Pulse */}
        <div className="border-t border-slate-900/50 flex flex-col bg-slate-950/40 shrink-0">
          {!sidebarCollapsed && (
            <div className="mx-3 my-4 p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] font-extrabold text-slate-350 uppercase tracking-wider leading-none">System Status</span>
              </div>
              <div className="text-[11px] font-bold text-emerald-450 pl-4">All Systems Operational</div>
              <button
                onClick={() => alert("Checking server clusters health: 100% operational.")}
                className="mt-1 w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors cursor-pointer text-center"
              >
                View System Health
              </button>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full py-3.5 px-4 text-[10px] uppercase tracking-widest font-black text-slate-400 hover:text-white rounded-none hover:bg-slate-900/40 text-center shrink-0 cursor-pointer border-t border-slate-900/30"
          >
            {sidebarCollapsed ? '→' : '← Collapse Sidebar'}
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#001c41] text-white flex items-center justify-between px-4 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <img src="/logo-dark.png" alt="UBT" className="h-8 w-auto" />
          <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 rounded px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider select-none">
            SA
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="h-10 w-10 flex items-center justify-center text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-slate-950/80 backdrop-blur-xs flex pt-16 animate-fadeIn">
          <div className={`w-64 h-full flex flex-col justify-between py-6 px-4 animate-slideRight border-r ${
            themeMode === 'dark' 
              ? 'bg-gradient-to-b from-[#060a13] to-[#03060b] border-slate-800' 
              : 'bg-gradient-to-b from-[#001c41] to-[#00122d] border-emerald-500/20'
          }`}>
            <div className="flex flex-col gap-5 overflow-y-auto max-h-[85vh]">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-4">Moderation Directory</span>
              <nav className="flex flex-col gap-4">
                {sidebarSections.map((section, secIdx) => (
                  <div key={secIdx} className="flex flex-col gap-1">
                    {section.group && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-4 pt-3 pb-1 select-none text-left leading-none">
                        {section.group}
                      </span>
                    )}
                    {section.items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          if (item.id === 'Logout') {
                            handleLogout();
                          } else {
                            setActiveTab(item.id);
                          }
                        }}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-left w-full ${
                          activeTab === item.id
                            ? 'bg-[#027244] text-white shadow-md shadow-[#013520]/15'
                            : item.id === 'Logout'
                              ? 'text-rose-400 hover:bg-rose-950/20'
                              : 'text-slate-400 hover:bg-slate-900/40 hover:text-white'
                        }`}
                      >
                        <div className="shrink-0">{item.icon}</div>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </nav>
            </div>  </div>

          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* 2. MAIN APP SPACE */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen pt-16 md:pt-0">
        
        {/* Topbar navigation panel */}
        <header className={`h-[76px] border-b px-6 md:px-8 flex items-center justify-between z-10 sticky top-0 shrink-0 backdrop-blur-md transition-colors ${
          themeMode === 'dark' ? 'bg-[#090D1C]/90 border-slate-800' : 'bg-white/90 border-slate-200'
        }`}>
          <div className="flex items-center gap-6 flex-1 max-w-md">
            <h2 className={`font-black text-base leading-none tracking-tight hidden lg:block uppercase ${
              themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'
            }`}>{activeTab}</h2>
            <div className="relative flex items-center flex-1 max-w-xs">
              <Search className="h-4.5 w-4.5 text-slate-400 absolute left-3" />
              <input
                type="text"
                placeholder="Global search resource..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full border px-4 py-2 pl-10 rounded-xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-[#027244] transition-colors ${
                  themeMode === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-3.5 font-sans">
            {/* Quick Actions Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                className="h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-650 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shadow-md shadow-emerald-500/10"
              >
                <span>Actions</span>
                <Plus className={`h-4 w-4 transition-transform ${quickActionsOpen ? 'rotate-45' : ''}`} />
              </button>
              {quickActionsOpen && (
                <div className="absolute right-0 mt-2.5 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 flex flex-col gap-1 animate-fadeIn z-20 text-[#001c41]">
                  <button 
                    onClick={() => { setActiveTab('Admin Management'); setQuickActionsOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left hover:bg-slate-50 transition-colors w-full cursor-pointer"
                  >
                    <Shield className="h-4 w-4 text-emerald-600" />
                    <span>Create Sub-Admin</span>
                  </button>
                  <button 
                    onClick={() => { setActiveTab('Notifications'); setQuickActionsOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left hover:bg-slate-50 transition-colors w-full cursor-pointer"
                  >
                    <Bell className="h-4 w-4 text-blue-600" />
                    <span>Broadcast notice</span>
                  </button>
                  <button 
                    onClick={() => { setActiveTab('System Logs'); setQuickActionsOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left hover:bg-slate-50 transition-colors w-full cursor-pointer"
                  >
                    <Terminal className="h-4 w-4 text-purple-600" />
                    <span>Audit System Logs</span>
                  </button>
                </div>
              )}
            </div>

            {/* Dark/Light toggle slider */}
            <button 
              onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
              className={`h-10 w-10 border rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                themeMode === 'dark' ? 'border-slate-800 text-amber-400 bg-slate-900/60 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-100 bg-slate-50'
              }`}
              title="Toggle Theme Mode"
            >
              {themeMode === 'dark' ? <Sparkles className="h-4.5 w-4.5" /> : <Layers className="h-4.5 w-4.5" />}
            </button>

            {/* Notification Bell Panel */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`h-10 w-10 border rounded-full flex items-center justify-center relative transition-colors cursor-pointer ${
                  themeMode === 'dark' ? 'border-slate-800 text-slate-350 bg-slate-900/60 hover:bg-slate-800' : 'border-slate-200 text-slate-550 hover:bg-slate-50'
                }`}
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 animate-ping" />
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-2.5 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-4 flex flex-col gap-3 animate-fadeIn z-20 text-[#001c41]">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-extrabold text-xs">Recent Telemetry Alert</span>
                    <span className="text-[9px] bg-red-50 text-red-650 px-2 py-0.5 rounded font-black uppercase">Critical</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Failed transaction #pay_123456 aborted by gateway due to authorization timeout.</p>
                    <span className="text-[8.5px] text-slate-400 font-bold mt-1">10 minutes ago</span>
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-[1px] bg-slate-200/50" />

            {/* Profile Dropdown */}
            <div className="relative">
              <div 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 cursor-pointer select-none"
              >
                <div className="flex flex-col text-right hidden lg:flex leading-none self-center">
                  <span className={`font-extrabold text-xs ${themeMode === 'dark' ? 'text-slate-200' : 'text-[#001c41]'}`}>
                    {user?.fullName || 'Super Admin'}
                  </span>
                  <span className="text-[8px] text-amber-600 font-extrabold uppercase mt-1 tracking-wider bg-amber-50 border border-amber-100/50 px-2 py-0.5 rounded-full self-end leading-none">
                    superadmin
                  </span>
                </div>
                <div className="h-9 w-9 rounded-full bg-emerald-50 text-[#027244] border border-emerald-100 flex items-center justify-center font-black text-xs shadow-2xs">
                  SA
                </div>
              </div>
              
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-48 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 flex flex-col gap-1 animate-fadeIn z-20 text-[#001c41]">
                  <button 
                    onClick={() => { setActiveTab('Profile Settings'); setProfileDropdownOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left hover:bg-slate-50 transition-colors w-full cursor-pointer"
                  >
                    <User className="h-4 w-4 text-slate-500" />
                    <span>My Profile</span>
                  </button>
                  <button 
                    onClick={() => { setActiveTab('Platform Settings'); setProfileDropdownOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left hover:bg-slate-50 transition-colors w-full cursor-pointer"
                  >
                    <Settings className="h-4 w-4 text-slate-500" />
                    <span>Settings</span>
                  </button>
                  <div className="h-[1px] bg-slate-100 my-1" />
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left text-rose-500 hover:bg-rose-50 transition-colors w-full cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Workspace views content */}
        <div className="p-6 md:p-8 flex-grow">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-3 text-slate-400">
              <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
              <span className="text-xs font-extrabold uppercase tracking-widest">Hydrating dashboard statistics...</span>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-8">
                     {/* TAB 1: DASHBOARD */}
              {activeTab === 'Dashboard' && (
                <div className="flex flex-col gap-6 animate-fadeIn text-left font-sans text-slate-100">
                  
                  {/* Top Dashboard Header Row */}
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${themeMode === 'dark' ? 'border-slate-800/40' : 'border-slate-200'}`}>

                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-2">
                        <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-1.5 ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>

                          Super Admin Dashboard 
                          <ShieldCheck className="h-5 w-5 text-emerald-400 fill-emerald-400/10 shrink-0" />
                        </h2>
                      </div>
                      <p className="text-xs text-slate-400 font-semibold mt-1">Welcome back! Here's what's happening with your platform.</p>
                    </div>

                    {/* Datepicker Picker Mockup */}
                    <div className={`flex items-center gap-2 rounded-xl px-3 py-1.5 shadow-sm text-xs font-bold w-fit shrink-0 cursor-pointer border ${themeMode === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>

                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>May 29, 2025 - Jun 29, 2025</span>
                    </div>
                  </div>

                  {/* 6 HUD Summary Metric Cards Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                    {[
                      { title: 'Total Businesses', val: businesses.length || '1,248', desc: '+196 this month', pct: '+ 18.6%', icon: <Store className="h-5 w-5" />, color: 'from-purple-500/10 border-purple-500/20 text-purple-500', tabId: 'Businesses' },
                      { title: 'Active Businesses', val: businesses.filter(b => b.status === 'Approved').length || '1,082', desc: '86.7% of total', pct: '+ 16.3%', icon: <CheckCircle2 className="h-5 w-5" />, color: 'from-emerald-500/10 border-emerald-500/20 text-emerald-500', tabId: 'Businesses' },
                      { title: 'Total Users', val: (merchants.length + regularUsers.length) || '2,653', desc: '+487 this month', pct: '+ 22.5%', icon: <User className="h-5 w-5" />, color: 'from-amber-500/10 border-amber-500/20 text-amber-500', tabId: 'Merchants' },
                      { title: 'Events Listed', val: events.length || '246', desc: '+54 this month', pct: '+ 28.4%', icon: <Calendar className="h-5 w-5" />, color: 'from-pink-500/10 border-pink-500/20 text-pink-500', tabId: 'Events Moderation' },
                      { title: 'Blog Posts', val: blogs.length || '156', desc: '+37 this month', pct: '+ 31.2%', icon: <BookOpen className="h-5 w-5" />, color: 'from-blue-500/10 border-blue-500/20 text-blue-500', tabId: 'Blogs Moderation' },
                      { title: 'Total Revenue', val: subscriptions.length > 0 ? ('₹' + subscriptions.reduce((sum, s) => sum + (s.amount || 0), 0).toLocaleString('en-IN')) : '₹2,34,560', desc: '+₹38,720 this month', pct: '+ 19.8%', icon: <Coins className="h-5 w-5" />, color: 'from-cyan-500/10 border-cyan-500/20 text-cyan-500', tabId: 'Subscriptions' }
                    ].map((card, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => {
                          setActiveTab(card.tabId);
                          if (card.title === 'Active Businesses') {
                            setBizStatusFilter('Approved');
                          } else if (card.title === 'Total Businesses') {
                            setBizStatusFilter('All');
                          }
                        }}
                        className={`rounded-2xl p-4 shadow-sm border bg-gradient-to-br flex flex-col justify-between h-28 relative overflow-hidden cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-300 ${themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800/80 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 max-w-[100px] leading-tight">
                            {card.title}
                          </span>
                          <span className={`h-8 w-8 rounded-xl flex items-center justify-center shadow-sm ${themeMode === 'dark' ? 'bg-slate-950/50' : 'bg-slate-50 border border-slate-100'} ${card.color.split(' ')[2]}`}>

                            {card.icon}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5 mt-2">
                          <div className="flex items-baseline gap-1.5">
                            <span className={`text-lg font-black ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>{card.val}</span>
                            <span className={`text-[8.5px] font-black ${card.color.split(' ')[2]}`}>{card.pct}</span>
                          </div>
                          <span className="text-[8.5px] text-slate-500 font-bold">{card.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Analytics Dashboard Grid - Row 1 */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* Platform Overview Line Chart Widget */}
                    <div className={`lg:col-span-6 rounded-3xl border p-5 flex flex-col justify-between h-80 ${themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800/80 text-white' : 'bg-white border-slate-200 text-[#001c41] shadow-xs'}`}>

                      <div className={`flex justify-between items-center pb-2 border-b ${themeMode === 'dark' ? 'border-slate-800/30' : 'border-slate-100'}`}>

                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Platform Overview</span>
                        <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400">
                          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#027244]" /> Businesses</span>
                          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Users</span>
                          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-purple-500" /> Revenue (₹)</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex items-center gap-4 py-4">
                        {/* Custom Rendered SVG Line Chart */}
                        <div className="flex-1 h-full relative">
                          <svg className="w-full h-full" viewBox="0 0 400 150">
                            {/* Grid Lines */}
                            {[0, 25, 50, 75, 100].map((y, i) => (
                              <line key={i} x1="0" y1={y + 20} x2="400" y2={y + 20} stroke={themeMode === 'dark' ? '#334155' : '#e2e8f0'} strokeWidth="0.5" strokeDasharray="3 3" />
                            ))}
                            {/* Blue Line (Businesses) */}
                            <path d="M 10,120 Q 80,100 150,110 T 290,70 T 390,50" fill="none" stroke="#6366F1" strokeWidth="2.5" />
                            {/* Green Line (Users) */}
                            <path d="M 10,90 Q 80,85 150,60 T 290,50 T 390,30" fill="none" stroke="#10B981" strokeWidth="2.5" />
                            {/* Purple Line (Revenue) */}
                            <path d="M 10,60 Q 80,45 150,55 T 290,30 T 390,15" fill="none" stroke="#8B5CF6" strokeWidth="2.5" />
                            {/* Sparkles Markers */}
                            <circle cx="290" cy="70" r="4" fill="#6366F1" stroke="#0F172A" strokeWidth="1" />
                            <circle cx="290" cy="50" r="4" fill="#10B981" stroke="#0F172A" strokeWidth="1" />
                            <circle cx="290" cy="30" r="4" fill="#8B5CF6" stroke="#0F172A" strokeWidth="1" />
                          </svg>
                          <div className="flex justify-between text-[8px] text-slate-500 font-bold mt-1">
                            <span>May 29</span>
                            <span>Jun 5</span>
                            <span>Jun 12</span>
                            <span>Jun 19</span>
                            <span>Jun 26</span>
                          </div>
                        </div>
                        
                        {/* Metrics Table on the Right */}
                        <div className="w-36 shrink-0 border-l border-slate-800/40 pl-4 flex flex-col justify-center gap-3">
                          {[
                            { label: 'Total Views', val: '45,892', pct: '▲ 23.1%', color: 'text-[#027244]' },
                            { label: 'Total Leads', val: '3,182', pct: '▲ 17.7%', color: 'text-emerald-450' },
                            { label: 'WhatsApp Clicks', val: '1,827', pct: '▲ 21.4%', color: 'text-emerald-400' },
                            { label: 'Call Clicks', val: '1,355', pct: '▲ 16.2%', color: 'text-amber-500' }
                          ].map((metric, idx) => (
                            <div key={idx} className="flex flex-col gap-0.5 text-left">
                              <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest">{metric.label}</span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-xs font-black text-white">{metric.val}</span>
                                <span className={`text-[8px] font-bold ${metric.color}`}>{metric.pct}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Businesses by Category Donut Chart Widget */}
                    <div className={`lg:col-span-3 rounded-3xl border p-5 flex flex-col justify-between h-80 ${themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800/80 text-white' : 'bg-white border-slate-200 text-[#001c41] shadow-xs'}`}>

                      <div className={`flex justify-between items-center pb-2 border-b ${themeMode === 'dark' ? 'border-slate-800/30' : 'border-slate-100'}`}>

                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Businesses by Category</span>
                        <span className="text-[9px] font-black text-[#027244] cursor-pointer hover:underline uppercase tracking-widest">View All</span>
                      </div>
                      
                      <div className="flex-1 flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
                        {/* Donut SVG */}
                        <div className="relative h-28 w-28 shrink-0 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke={themeMode === 'dark' ? '#1E293B' : '#f1f5f9'} strokeWidth="2.5" />
                            {/* Segments: 28%, 18%, 12%, 10%, 9%, 7%, 16% */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeDasharray="28 72" strokeDashoffset="0" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="2.5" strokeDasharray="18 82" strokeDashoffset="-28" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="12 88" strokeDashoffset="-46" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#EC4899" strokeWidth="2.5" strokeDasharray="10 90" strokeDashoffset="-58" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeDasharray="9 91" strokeDashoffset="-68" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="7 93" strokeDashoffset="-77" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#64748B" strokeWidth="2.5" strokeDasharray="16 84" strokeDashoffset="-84" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-base font-black leading-none ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>1,248</span>
                            <span className="text-[8px] font-bold text-slate-500 mt-0.5">Total</span>
                          </div>
                        </div>

                        {/* Donut Legend */}
                        <div className="flex flex-col gap-1.5 text-left self-center">
                          {[
                            { label: 'Home Services', val: '28%', color: 'bg-[#027244]' },
                            { label: 'Food & Restaurants', val: '18%', color: 'bg-emerald-500' },
                            { label: 'Automotive', val: '12%', color: 'bg-amber-500' },
                            { label: 'Beauty & Wellness', val: '10%', color: 'bg-pink-500' },
                            { label: 'Shopping', val: '9%', color: 'bg-blue-500' },
                            { label: 'Education', val: '7%', color: 'bg-purple-500' },
                            { label: 'Others', val: '16%', color: 'bg-slate-500' }
                          ].map((leg, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
                              <span className={`h-1.5 w-1.5 rounded-full ${leg.color} shrink-0`} />
                              <span className="truncate max-w-[90px]">{leg.label}</span>
                              <span className={`ml-auto font-black ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>{leg.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pending Approvals Widget */}
                    <div className={`lg:col-span-3 rounded-3xl border p-5 flex flex-col justify-between h-80 ${themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800/80 text-white' : 'bg-white border-slate-200 text-[#001c41] shadow-xs'}`}>

                      <div className={`flex justify-between items-center pb-2 border-b ${themeMode === 'dark' ? 'border-slate-800/30' : 'border-slate-100'}`}>

                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Pending Approvals</span>
                        <span className="text-[9px] font-black text-[#027244] cursor-pointer hover:underline uppercase tracking-widest">View All</span>
                      </div>
                      
                      <div className="flex-1 flex flex-col gap-2.5 py-4">
                        {[
                          { 
                            label: 'Businesses', 
                            count: businesses.filter(b => b.status === 'Pending Verification' || b.status === 'Under Review').length, 
                            icon: <Store className="h-3.5 w-3.5" />, 
                            desc: 'New business registrations', 
                            color: 'text-[#027244] bg-[#027244]/10', 
                            tabId: 'Pending Verifications' 
                          },
                          { 
                            label: 'Events', 
                            count: events.filter(e => e.status === 'Pending Review' || e.status === 'Pending Verification').length, 
                            icon: <Calendar className="h-3.5 w-3.5" />, 
                            desc: 'Event listings', 
                            color: 'text-purple-400 bg-purple-500/10', 
                            tabId: 'Events Moderation' 
                          },
                          { 
                            label: 'Blog Posts', 
                            count: blogs.filter(b => b.status === 'Pending Review' || b.status === 'Pending Verification' || b.status === 'Pending Approval').length, 
                            icon: <BookOpen className="h-3.5 w-3.5" />, 
                            desc: 'Blog submissions', 
                            color: 'text-pink-400 bg-pink-500/10', 
                            tabId: 'Blogs Moderation' 
                          },
                          { 
                            label: 'Offers', 
                            count: pendingCategories.length, 
                            icon: <Award className="h-3.5 w-3.5" />, 
                            desc: 'Offers & promotions', 
                            color: 'text-amber-400 bg-amber-500/10', 
                            tabId: 'Category Management' 
                          },
                          { 
                            label: 'Reviews', 
                            count: reviews.filter(r => r.status === 'Pending' || r.status === 'flagged' || r.status === 'Reported').length || reviews.length, 
                            icon: <MessageSquare className="h-3.5 w-3.5" />, 
                            desc: 'Review reports', 
                            color: 'text-emerald-400 bg-emerald-500/10', 
                            tabId: 'Reviews Moderation' 
                          }
                        ].map((item, idx) => (
                          <div key={idx} 
                            onClick={() => {
                              setActiveTab(item.tabId);
                              if (item.label === 'Events') setEventStatusFilter('Pending');
                              if (item.label === 'Blog Posts') setBlogStatusFilter('Pending');
                            }}
                            className={`flex items-center justify-between p-2 rounded-xl border transition-colors cursor-pointer ${themeMode === 'dark' ? 'bg-slate-950/30 border-slate-850 hover:bg-slate-950/50' : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100/50'}`}>

                            <div className="flex items-center gap-2 text-left">
                              <span className={`h-7 w-7 rounded-lg flex items-center justify-center ${item.color}`}>
                                {item.icon}
                              </span>
                              <div className="flex flex-col">
                                <span className={`text-[10px] font-black leading-none ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{item.label}</span>

                                <span className="text-[8px] text-slate-500 font-semibold mt-0.5">{item.desc}</span>
                              </div>
                            </div>
                            <span className={`text-xs font-black px-2 py-0.5 border rounded-lg ${themeMode === 'dark' ? 'text-white bg-slate-900 border-slate-800' : 'text-[#027244] bg-emerald-500/10 border-emerald-500/20'}`}>{item.count}</span>

                          </div>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => {
                          setActiveTab('Businesses');
                          setBizStatusFilter('Pending');
                          setSearchQuery('');
                        }}
                        className="w-full py-2.5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl cursor-pointer transition-colors shadow shadow-emerald-950/15 uppercase tracking-wider text-center"
                      >
                        Review All Approvals
                      </button>
                    </div>

                  </div>

                  {/* Recent Registers & Transactions Grid - Row 2 */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* Recent Registrations Card */}
                    <div className={`lg:col-span-5 rounded-3xl border p-5 flex flex-col h-[26rem] ${themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800/80 text-white' : 'bg-white border-slate-200 text-[#001c41] shadow-xs'}`}>

                      <div className={`flex justify-between items-center pb-2 border-b ${themeMode === 'dark' ? 'border-slate-800/30' : 'border-slate-100'}`}>

                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Recent Registrations</span>
                        <span className="text-[9px] font-black text-[#027244] cursor-pointer hover:underline uppercase tracking-widest">View All</span>
                      </div>
                      
                      {/* Tabs inside Registrations */}
                      <div className="flex gap-2 py-3 border-b border-slate-800/20 text-[9.5px] font-black uppercase tracking-widest">
                        {['Businesses', 'Users', 'Events', 'Blog Posts'].map((tabName, tabIdx) => (
                          <span 
                            key={tabIdx} 
                            onClick={() => setRecentRegTab(tabName)}
                            className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${recentRegTab === tabName ? 'bg-[#027244]/15 text-[#027244] border border-emerald-500/20' : 'text-slate-400 hover:text-emerald-500'}`}
                          >
                            {tabName}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex-1 flex flex-col gap-3 py-3 overflow-y-auto pr-1">
                        {recentRegTab === 'Businesses' && (
                          (() => {
                            const getBizIcon = (category) => {
                              if (!category) return '🏢';
                              const cat = category.toLowerCase();
                              if (cat.includes('food') || cat.includes('restaurant')) return '🥗';
                              if (cat.includes('electrical') || cat.includes('electric') || cat.includes('service')) return '⚡';
                              if (cat.includes('automotive') || cat.includes('car')) return '🚗';
                              if (cat.includes('beauty') || cat.includes('parlour') || cat.includes('salon')) return '💇';
                              return '🏢';
                            };
                            const bizList = businesses.length > 0 ? businesses : [
                              { _id: 'mock_biz_1', name: 'Sri Lakshmi Electricals', category: 'Home Services', locality: 'Udumalpet', createdAt: new Date(), status: 'Pending Verification', ownerName: 'Muthuvel S.', gstNumber: '33ABCDE1234F1Z5', yearEstablished: '2015', email: 'srilakshmi@gmail.com', phone: '+91 94435 99999', website: 'srilakshmielectricals.com', pincode: '642126' },
                              { _id: 'mock_biz_2', name: 'Green Leaf Restaurant', category: 'Food & Restaurants', locality: 'Udumalpet', createdAt: new Date(Date.now() - 15*60*1000), status: 'Approved', ownerName: 'Rajesh Kumar', gstNumber: '33ABCDE1234F1Z5', yearEstablished: '2018', email: 'greenleaf@gmail.com', phone: '+91 98425 22345', website: 'greenleafrestaurant.com', pincode: '642126' },
                              { _id: 'mock_biz_3', name: 'Royal Car Care', category: 'Automotive', locality: 'Udumalpet', createdAt: new Date(Date.now() - 32*60*1000), status: 'Pending Verification', ownerName: 'Senthil Nathan', gstNumber: '33ABCDE1234F1Z5', yearEstablished: '2020', email: 'royalcarcare@gmail.com', phone: '+91 97895 43210', website: 'royalcarcare.com', pincode: '642126' },
                              { _id: 'mock_biz_4', name: 'Anu Beauty Parlour', category: 'Beauty & Wellness', locality: 'Udumalpet', createdAt: new Date(Date.now() - 60*60*1000), status: 'Approved', ownerName: 'Anu Pandian', gstNumber: '33ABCDE1234F1Z5', yearEstablished: '2016', email: 'anubeauty@gmail.com', phone: '+91 98944 22222', website: 'anubeautyparlour.com', pincode: '642126' },
                              { _id: 'mock_biz_5', name: 'Vetri Catering Service', category: 'Catering Services', locality: 'Udumalpet', createdAt: new Date(Date.now() - 120*60*1000), status: 'Pending Verification', ownerName: 'Vetrivel S.', gstNumber: '33ABCDE1234F1Z5', yearEstablished: '2012', email: 'vetricatering@gmail.com', phone: '+91 90000 00000', website: 'vetricaterers.com', pincode: '642126' }
                            ];
                            return bizList.slice(0, 5).map((reg, idx) => {
                              const timeStr = reg.createdAt ? new Date(reg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now';
                              return (
                                 <div key={idx} 
                                   onClick={() => { setSelectedBiz(reg); setShowBizModal(true); }}
                                   className={`flex items-center justify-between p-2.5 rounded-2xl border cursor-pointer hover:shadow-md hover:border-[#027244] transition-all ${themeMode === 'dark' ? 'bg-slate-950/20 border-slate-850' : 'bg-slate-50/50 border-slate-100'}`}>
                                   <div className="flex items-center gap-3 text-left">
                                     <span className={`h-9 w-9 rounded-xl border flex items-center justify-center text-sm shadow-inner ${themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-[#027244]'}`}>
                                       {getBizIcon(reg.category)}
                                     </span>
                                     <div className="flex flex-col">
                                       <span className={`text-xs font-black leading-none ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{reg.name}</span>
                                       <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-500 font-bold">
                                         <span>{reg.category}</span>
                                         <span>•</span>
                                         <span>{reg.locality || 'Udumalpet'}</span>
                                       </div>
                                     </div>
                                   </div>
                                   <div className="flex flex-col items-end gap-1.5">
                                     <span className="text-[8px] text-slate-500 font-bold">{timeStr}</span>
                                     <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                                       reg.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-450' : 'bg-amber-500/10 border-amber-500/25 text-amber-450'
                                     }`}>
                                       {reg.status}
                                     </span>
                                   </div>
                                 </div>
                               );
                             });
                           })()
                         )}

                         {recentRegTab === 'Users' && (
                           (() => {
                             const combinedUsers = [...merchants, ...regularUsers].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
                             const list = combinedUsers.length > 0 ? combinedUsers : [
                               { _id: 'usr_m1', fullName: 'Muthuvel S.', role: 'merchant', email: 'muthuvel@gmail.com', status: 'Active', createdAt: new Date() },
                               { _id: 'usr_m2', fullName: 'Arun Kumar', role: 'user', email: 'arun@gmail.com', status: 'Active', createdAt: new Date(Date.now() - 15*60*1000) },
                               { _id: 'usr_m3', fullName: 'Senthil Nathan', role: 'merchant', email: 'senthil@gmail.com', status: 'Suspended', createdAt: new Date(Date.now() - 32*60*1000) }
                             ];
                             return list.slice(0, 5).map((u, idx) => {
                               const timeStr = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Just now';
                               return (
                                 <div key={idx} 
                                   onClick={() => {
                                     setActiveTab('Merchants');
                                     setSearchQuery(u.email);
                                     setMerchantUserFilter(u.role === 'visitor' || u.role === 'user' ? 'regularUsers' : 'merchants');
                                   }}
                                   className={`flex items-center justify-between p-2.5 rounded-2xl border cursor-pointer hover:shadow-md hover:border-[#027244] transition-all ${themeMode === 'dark' ? 'bg-slate-950/20 border-slate-850' : 'bg-slate-50/50 border-slate-100'}`}>
                                   <div className="flex items-center gap-3 text-left">
                                     <span className={`h-9 w-9 rounded-xl border flex items-center justify-center text-sm shadow-inner ${themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-[#027244]'}`}>
                                       👤
                                     </span>
                                     <div className="flex flex-col">
                                       <span className={`text-xs font-black leading-none ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{u.fullName || u.name}</span>
                                       <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-500 font-bold">
                                         <span>{u.email}</span>
                                         <span>•</span>
                                         <span className="uppercase text-[8px] font-black">{u.role}</span>
                                       </div>
                                     </div>
                                   </div>
                                   <div className="flex flex-col items-end gap-1.5">
                                     <span className="text-[8px] text-slate-500 font-bold">{timeStr}</span>
                                     <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                                       u.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-450' : 'bg-rose-500/10 border-rose-500/25 text-rose-500'
                                     }`}>
                                       {u.status}
                                     </span>
                                   </div>
                                 </div>
                               );
                             });
                           })()
                         )}

                         {recentRegTab === 'Events' && (
                           (() => {
                             const eventList = events.length > 0 ? events : [
                               { _id: 'e1', title: 'Temple Car Festival 2025', category: 'Cultural', organizer: 'Mariamman Kovil', status: 'Pending Review', createdAt: new Date() },
                               { _id: 'e2', title: 'Wind Farms Expo 2025', category: 'Business', organizer: 'Coimbatore Chamber', status: 'Approved', createdAt: new Date(Date.now() - 3600000) }
                             ];
                             return eventList.slice(0, 5).map((reg, idx) => {
                               const timeStr = reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : 'Just now';
                               return (
                                 <div key={idx} 
                                   onClick={() => {
                                     setActiveTab('Events Moderation');
                                     setSearchQuery(reg.title);
                                   }}
                                   className={`flex items-center justify-between p-2.5 rounded-2xl border cursor-pointer hover:shadow-md hover:border-[#027244] transition-all ${themeMode === 'dark' ? 'bg-slate-950/20 border-slate-850' : 'bg-slate-50/50 border-slate-100'}`}>
                                   <div className="flex items-center gap-3 text-left">
                                     <span className={`h-9 w-9 rounded-xl border flex items-center justify-center text-sm shadow-inner ${themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-[#027244]'}`}>
                                       📅
                                     </span>
                                     <div className="flex flex-col">
                                       <span className={`text-xs font-black leading-none ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{reg.title}</span>
                                       <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-500 font-bold">
                                         <span>{reg.category || 'General'}</span>
                                         <span>•</span>
                                         <span>{reg.organizer}</span>
                                       </div>
                                     </div>
                                   </div>
                                   <div className="flex flex-col items-end gap-1.5">
                                     <span className="text-[8px] text-slate-500 font-bold">{timeStr}</span>
                                     <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                                       reg.status === 'Approved' || reg.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-450' : 'bg-amber-500/10 border-amber-500/25 text-amber-450'
                                     }`}>
                                       {reg.status}
                                     </span>
                                   </div>
                                 </div>
                               );
                             });
                           })()
                         )}

                         {recentRegTab === 'Blog Posts' && (
                           (() => {
                             const blogList = blogs.length > 0 ? blogs : [
                               { _id: 'b1', title: 'Top 10 Tourist Places in Udumalpet', authorName: 'Co-Founder Haris', status: 'Approved', createdAt: new Date() },
                               { _id: 'b2', title: 'Guide to Thirumoorthi Dam Waterfalls', authorName: 'Ananth S.', status: 'Pending Review', createdAt: new Date(Date.now() - 7200000) }
                             ];
                             return blogList.slice(0, 5).map((reg, idx) => {
                               const timeStr = reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : 'Just now';
                               return (
                                 <div key={idx} 
                                   onClick={() => {
                                     setActiveTab('Blogs Moderation');
                                     setSearchQuery(reg.title);
                                   }}
                                   className={`flex items-center justify-between p-2.5 rounded-2xl border cursor-pointer hover:shadow-md hover:border-[#027244] transition-all ${themeMode === 'dark' ? 'bg-slate-950/20 border-slate-850' : 'bg-slate-50/50 border-slate-100'}`}>
                                   <div className="flex items-center gap-3 text-left">
                                     <span className={`h-9 w-9 rounded-xl border flex items-center justify-center text-sm shadow-inner ${themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-[#027244]'}`}>
                                       📖
                                     </span>
                                     <div className="flex flex-col">
                                       <span className={`text-xs font-black leading-none ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{reg.title}</span>
                                       <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-500 font-bold">
                                         <span>By {reg.authorName || (reg.author && reg.author.fullName) || 'Admin'}</span>
                                       </div>
                                     </div>
                                   </div>
                                   <div className="flex flex-col items-end gap-1.5">
                                     <span className="text-[8px] text-slate-500 font-bold">{timeStr}</span>
                                     <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                                       reg.status === 'Approved' || reg.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-450' : 'bg-amber-500/10 border-amber-500/25 text-amber-450'
                                     }`}>
                                       {reg.status}
                                     </span>
                                   </div>
                                 </div>
                               );
                             });
                           })()
                         )}
                       </div>
                    </div>

                    {/* Recent Transactions Card */}
                    <div className={`lg:col-span-4 rounded-3xl border p-5 flex flex-col h-[26rem] ${themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800/80 text-white' : 'bg-white border-slate-200 text-[#001c41] shadow-xs'}`}>

                      <div className={`flex justify-between items-center pb-2 border-b ${themeMode === 'dark' ? 'border-slate-800/30' : 'border-slate-100'}`}>

                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Recent Transactions</span>
                        <span className="text-[9px] font-black text-[#027244] cursor-pointer hover:underline uppercase tracking-widest">View All</span>
                      </div>
                      
                      <div className="flex-1 overflow-x-auto py-3">
                        <table className={`w-full text-xs font-semibold ${themeMode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>

                          <thead>
                            <tr className={`text-[9px] text-slate-500 uppercase tracking-widest border-b text-left ${themeMode === 'dark' ? 'border-slate-800/30' : 'border-slate-100'}`}>

                              <th className="pb-2 font-black">ID</th>
                              <th className="pb-2 font-black">User / Business</th>
                              <th className="pb-2 font-black">Amount</th>
                              <th className="pb-2 font-black">Status</th>
                              <th className="pb-2 font-black text-right">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { id: 'TXN12548', name: 'Sri Lakshmi Electricals', amt: '₹49', status: 'Success', time: '2 mins ago' },
                              { id: 'TXN12547', name: 'Green Leaf Restaurant', amt: '₹49', status: 'Success', time: '15 mins ago' },
                              { id: 'TXN12546', name: 'Vetri Catering Service', amt: '₹99', status: 'Success', time: '32 mins ago' },
                              { id: 'TXN12545', name: 'Tech Solutions', amt: '₹49', status: 'Failed', time: '1 hour ago' },
                              { id: 'TXN12544', name: 'Anu Beauty Parlour', amt: '₹49', status: 'Success', time: '2 hours ago' }
                            ].map((txn, idx) => (
                              <tr key={idx} className={`border-b last:border-0 text-left ${themeMode === 'dark' ? 'border-slate-850 hover:bg-slate-950/20' : 'border-slate-100 hover:bg-slate-50'}`}>

                                <td className={`py-2.5 font-mono text-[9.5px] font-bold ${themeMode === 'dark' ? 'text-emerald-450' : 'text-[#001c41]'}`}>{txn.id}</td>

                                <td className={`py-2.5 font-bold max-w-[100px] truncate ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{txn.name}</td>

                                <td className={`py-2.5 font-extrabold ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{txn.amt}</td>

                                <td className="py-2.5">
                                  <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                                    txn.status === 'Success' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-rose-500/10 border-rose-500/25 text-rose-500'
                                  }`}>
                                    {txn.status}
                                  </span>
                                </td>
                                <td className="py-2.5 text-slate-550 text-[9.5px] text-right font-bold">{txn.time}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* System Summary Widget */}
                    <div className={`lg:col-span-3 rounded-3xl border p-5 flex flex-col justify-between h-[26rem] ${themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800/80 text-white' : 'bg-white border-slate-200 text-[#001c41] shadow-xs'}`}>

                      <div className={`flex justify-between items-center pb-2 border-b ${themeMode === 'dark' ? 'border-slate-800/30' : 'border-slate-100'}`}>

                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">System Summary</span>
                      </div>
                      
                      <div className="flex-1 flex flex-col gap-5 py-6">
                        
                        {/* Storage Usage */}
                        <div className="flex flex-col gap-1.5 text-left">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Storage Usage</span>
                            <span className={`font-extrabold ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>45.6 GB / 200 GB</span>
                          </div>
                          <div className={`h-2 w-full rounded-full overflow-hidden border ${themeMode === 'dark' ? 'bg-slate-850 border-slate-800/50' : 'bg-slate-100 border-slate-200'}`}>

                            <div className="h-full bg-[#027244] rounded-full" style={{ width: '22.8%' }} />
                          </div>
                          <span className="text-[8.5px] text-slate-500 font-bold self-end">22.8% Capacity Used</span>
                        </div>

                        {/* Server Uptime */}
                        <div className="flex flex-col gap-1.5 text-left">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Server Uptime</span>
                            <span className="text-emerald-400 font-extrabold">99.9%</span>
                          </div>
                          <div className={`h-2 w-full rounded-full overflow-hidden border ${themeMode === 'dark' ? 'bg-slate-850 border-slate-800/50' : 'bg-slate-100 border-slate-200'}`}>

                            <div className="h-full bg-emerald-500 rounded-full animate-pulse" style={{ width: '99.9%' }} />
                          </div>
                          <span className="text-[8.5px] text-slate-500 font-bold self-end">Nodes fully operational</span>
                        </div>

                        {/* Active Admins */}
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-t border-slate-850 pt-4">
                          <span>Active Admins</span>
                          <div className={`flex items-center gap-1.5 ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>

                            <span className="font-extrabold">4</span>
                            <span className="text-[8.5px] text-[#027244] hover:underline cursor-pointer font-black">View Online</span>
                          </div>
                        </div>

                        {/* Database Status */}
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-t border-slate-850 pt-4">
                          <span>Database Status</span>
                          <span className="text-emerald-400 flex items-center gap-1.5 font-extrabold">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                            Healthy
                          </span>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* Top Performers, Reports & Activity Grid - Row 3 */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* Top Performing Businesses Card */}
                    <div className={`lg:col-span-4 rounded-3xl border p-5 flex flex-col h-[24rem] ${themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800/80 text-white' : 'bg-white border-slate-200 text-[#001c41] shadow-xs'}`}>

                      <div className={`flex justify-between items-center pb-2 border-b ${themeMode === 'dark' ? 'border-slate-800/30' : 'border-slate-100'}`}>

                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Top Performing Businesses</span>
                        <span className="text-[9px] font-black text-[#027244] cursor-pointer hover:underline uppercase tracking-widest">View All</span>
                      </div>
                      
                      <div className="flex-1 flex flex-col gap-3 py-3 overflow-y-auto pr-1">
                        {[
                          { rank: 1, name: 'Green Leaf Restaurant', views: '4,256', rate: '4.8', leads: '126', sector: 'Food & Restaurants', icon: '🟢' },
                          { rank: 2, name: 'Sri Lakshmi Electricals', views: '3,782', rate: '4.6', leads: '98', sector: 'Electrical Services', icon: '⚡' },
                          { rank: 3, name: 'Royal Car Care', views: '3,421', rate: '4.7', leads: '87', sector: 'Automotive', icon: '🔵' }
                        ].map((top, idx) => (
                          <div key={idx} className={`flex items-center gap-3 p-2.5 rounded-2xl border ${themeMode === 'dark' ? 'bg-slate-950/20 border-slate-850' : 'bg-slate-50/50 border-slate-100'}`}>
                            <span className="text-sm font-black text-[#001c41] w-4 text-left">{top.rank}</span>
                            <span className={`h-8 w-8 rounded-xl border flex items-center justify-center text-sm shrink-0 shadow-inner ${themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                              {top.icon}
                            </span>
                            <div className="flex flex-col text-left flex-1 min-w-0">
                              <span className={`text-xs font-black truncate leading-none ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{top.name}</span>

                              <span className="text-[8px] text-slate-500 font-bold mt-1">{top.sector}</span>
                            </div>
                            <div className="flex items-center gap-3 text-right shrink-0">
                              <div className="flex flex-col gap-0.5">
                                <span className={`text-[10px] font-black ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{top.views}</span>

                                <span className="text-[8px] text-slate-500 font-bold">Views</span>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-black text-emerald-450">★ {top.rate}</span>
                                <span className="text-[8px] text-slate-500 font-bold">Rating</span>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-black text-[#027244]">{top.leads}</span>
                                <span className="text-[8px] text-slate-500 font-bold">Leads</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reports & Analytics Card */}
                    <div className={`lg:col-span-4 rounded-3xl border p-5 flex flex-col justify-between h-[24rem] ${themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800/80 text-white' : 'bg-white border-slate-200 text-[#001c41] shadow-xs'}`}>

                      <div className={`flex justify-between items-center pb-2 border-b ${themeMode === 'dark' ? 'border-slate-800/30' : 'border-slate-100'}`}>

                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Reports & Analytics</span>
                      </div>
                      
                      <div className="flex-1 grid grid-cols-2 gap-3 py-4">
                        {[
                          { title: 'Business Report', desc: 'Overview of all businesses', icon: <Store className="h-5 w-5 text-[#027244]" /> },
                          { title: 'User Report', desc: 'User registration analytics', icon: <BarChart className="h-5 w-5 text-emerald-400" /> },
                          { title: 'Revenue Report', desc: 'Financial & transaction reports', icon: <Landmark className="h-5 w-5 text-purple-400" /> },
                          { title: 'Lead Report', desc: 'Leads & enquiry analytics', icon: <FileText className="h-5 w-5 text-amber-400" /> }
                        ].map((rep, idx) => (
                          <div key={idx} onClick={() => alert(`Generating ${rep.title} dynamic summary data...`)} className={`rounded-2xl p-3 border hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between cursor-pointer ${themeMode === 'dark' ? 'bg-slate-950/30 border-slate-850 hover:bg-slate-950/60' : 'bg-slate-50/50 border-slate-200/60 hover:bg-slate-100/50 shadow-xs'}`}>
                            <span className={`h-8 w-8 rounded-lg border flex items-center justify-center ${themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                              {rep.icon}
                            </span>
                            <div className="flex flex-col gap-0.5 mt-2">
                              <span className={`text-[10px] font-black leading-tight ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{rep.title}</span>

                              <span className="text-[8px] text-slate-500 font-semibold mt-0.5 leading-tight">{rep.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => alert("Hydrating analytics suite summary...")}
                        className={`w-full py-2.5 font-extrabold text-[10.5px] rounded-xl cursor-pointer transition-all border uppercase tracking-widest text-center ${themeMode === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'}`}
                      >

                        View All Reports
                      </button>
                    </div>

                    {/* Quick Actions & Platform Activity Card */}
                    <div className={`lg:col-span-4 rounded-3xl border p-5 flex flex-col justify-between h-[24rem] ${themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800/80 text-white' : 'bg-white border-slate-200 text-[#001c41] shadow-xs'}`}>

                      <div className={`flex justify-between items-center pb-2 border-b ${themeMode === 'dark' ? 'border-slate-800/30' : 'border-slate-100'}`}>

                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Quick Actions & Logs</span>
                      </div>
                      
                      {/* Grid of Quick Action Buttons */}
                      <div className="grid grid-cols-4 gap-2.5 py-3">
                        {[
                          { label: 'Add Category', icon: <Plus className="h-4.5 w-4.5" />, onClick: () => setActiveTab('Category Management') },
                          { label: 'Add Admin', icon: <Shield className="h-4.5 w-4.5" />, onClick: () => setActiveTab('Admin Management') },
                          { label: 'Site Settings', icon: <Settings className="h-4.5 w-4.5" />, onClick: () => setActiveTab('Platform Settings') },
                          { label: 'Send Notice', icon: <Bell className="h-4.5 w-4.5" />, onClick: () => setActiveTab('Notifications') }
                        ].map((act, idx) => (
                          <div key={idx} onClick={act.onClick} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                            <span className={`h-9 w-9 rounded-full flex items-center justify-center transition-all border group-hover:text-[#027244] group-hover:border-[#027244] group-hover:bg-[#027244]/10 ${themeMode === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-550'}`}>

                              {act.icon}
                            </span>
                            <span className={`text-[7.5px] font-black uppercase tracking-wider text-center transition-colors ${themeMode === 'dark' ? 'text-slate-400 group-hover:text-white' : 'text-slate-550 group-hover:text-[#027244]'}`}>{act.label}</span>

                          </div>
                        ))}
                      </div>

                      {/* Log List */}
                      <div className="flex-1 flex flex-col gap-2 overflow-y-auto mt-2 text-left border-t border-slate-850 pt-3 pr-1">
                        {[
                          { log: 'New business "Sri Lakshmi Electricals" registered', time: '2 mins ago', color: 'text-[#027244] bg-[#027244]/10' },
                          { log: 'Event "Temple Festival 2025" submitted for approval', time: '15 mins ago', color: 'text-purple-400 bg-purple-500/10' },
                          { log: 'Blog post "Top 10 Places in Udumalpet" published', time: '1 hour ago', color: 'text-pink-400 bg-pink-500/10' },
                          { log: 'Payment of ₹49 received from Tech Solutions', time: '2 hours ago', color: 'text-emerald-400 bg-emerald-500/10' },
                          { log: 'Review reported for "XYZ Restaurant"', time: '3 hours ago', color: 'text-rose-455 bg-rose-500/10' }
                        ].map((actLog, idx) => (
                          <div key={idx} className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors ${themeMode === 'dark' ? 'bg-slate-950/10 hover:bg-slate-950/30' : 'bg-slate-50/50 hover:bg-slate-100/50 border border-slate-100/50'}`}>

                            <span className={`h-1.5 w-1.5 rounded-full ${actLog.color.split(' ')[0]} shrink-0`} />
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className={`text-[9.5px] font-bold truncate ${themeMode === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{actLog.log}</span>

                              <span className="text-[7.5px] text-slate-500 font-semibold">{actLog.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>

                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
                    
                    {/* Live system monitoring console - Terminal Shell style */}
                    <div className="lg:col-span-2 bg-[#030712] text-emerald-400 border border-emerald-500/20 rounded-[28px] p-6 shadow-[0_0_35px_rgba(16,185,129,0.08)] flex flex-col gap-4 max-h-[360px] overflow-y-auto font-mono">
                      <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                        {/* Terminal dots controls */}
                        <div className="flex items-center gap-6">
                          <div className="flex gap-1.5 shrink-0">
                            <span className="h-3 w-3 rounded-full bg-red-500/80 border border-red-650" />
                            <span className="h-3 w-3 rounded-full bg-yellow-500/80 border border-yellow-650" />
                            <span className="h-3 w-3 rounded-full bg-emerald-500/80 border border-emerald-650" />
                          </div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-450 flex items-center gap-1.5 select-none">
                            <Terminal className="h-3.5 w-3.5 text-emerald-450" />
                            ubt_telemetry_monitor.sh
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                          <span>Status: <b className="text-emerald-450 font-black">Matrix Online</b></span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2.5 text-[11px] select-all leading-relaxed text-left">
                        <div className="text-slate-500 select-none">root@ubt-server:~# tail -f /var/log/ubt/telemetry.log</div>
                        {systemLogs.map((log, idx) => (
                          <div key={idx} className="flex items-start gap-4">
                            <span className="text-slate-600 font-bold shrink-0">[{log.time}]</span>
                            <span className={
                              log.type === 'system' 
                                ? 'text-emerald-400 font-bold' 
                                : log.type === 'warning' 
                                  ? 'text-amber-400 font-bold' 
                                  : 'text-slate-350'
                            }>
                              {log.type === 'system' ? '⚙ SYSTEM: ' : (log.type === 'warning' ? '⚠ WARNING: ' : 'ℹ INFO: ')}
                              {log.event}
                            </span>
                          </div>
                        ))}
                        <div className="flex gap-1 select-none items-center text-emerald-500 animate-pulse mt-1">
                          <span>root@ubt-server:~#</span>
                          <span className="h-3.5 w-2 bg-emerald-450" />
                        </div>
                      </div>
                    </div>

                    {/* Platform quick settings */}
                    <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-[28px] p-6 shadow-sm flex flex-col gap-4 text-left text-[#001c41]">
                      <h3 className="font-black text-sm uppercase tracking-wider border-b border-slate-100 pb-3">Super Admin Actions</h3>
                      <div className="flex flex-col gap-3 font-sans">
                        <button 
                          onClick={() => setActiveTab('Platform Settings')}
                          className="py-2.5 px-4 bg-emerald-50 border border-emerald-150 hover:bg-emerald-100 text-[#027244] font-extrabold text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span>Adjust Pricing Plans</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setActiveTab('Access Control')}
                          className="py-2.5 px-4 bg-blue-50 border border-blue-150 hover:bg-blue-100 text-blue-700 font-extrabold text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span>Manage Admin Roles</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setActiveTab('Notifications')}
                          className="py-2.5 px-4 bg-purple-50 border border-purple-150 hover:bg-purple-100 text-purple-700 font-extrabold text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span>Dispatch Global Broadcast</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 2: BUSINESSES */}
              {activeTab === 'Businesses' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn">
                  
                  {/* Filter and stats row */}
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-5 flex flex-col gap-4 text-[#001c41] font-sans">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center w-full">
                      <div className="w-full md:max-w-md bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2">
                        <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Search listings by business name or owner email..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-transparent text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none"
                        />
                      </div>

                      <div className="flex gap-4 text-[10.5px] font-extrabold text-slate-500">
                        <span>Total Vetted: <b className="text-slate-800">{businesses.length}</b></span>
                        <span>Premium: <b className="text-amber-600">{businesses.filter(b => b.isPremium || b.subscriptionStatus === 'active').length}</b></span>
                        <span>Expired: <b className="text-rose-650">{businesses.filter(b => b.subscriptionStatus === 'expired').length}</b></span>
                      </div>
                    </div>

                    {/* Status filter pills row */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                      {[
                        { id: 'All', label: 'All Listings' },
                        { id: 'Approved', label: 'Approved (UDT Verified)' },
                        { id: 'Pending', label: 'Audit Queue (Pending)' },
                        { id: 'Premium', label: 'Active Premium' },
                        { id: 'Expired', label: 'Expired Plan' },
                        { id: 'Suspended', label: 'Suspended' }
                      ].map(pill => (
                        <button
                          key={pill.id}
                          type="button"
                          onClick={() => setBizStatusFilter(pill.id)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide border transition-all cursor-pointer whitespace-nowrap ${
                            bizStatusFilter === pill.id
                              ? 'bg-[#027244] border-[#027244] text-white shadow-xs'
                              : themeMode === 'dark'
                                ? 'border-slate-800 text-slate-450 hover:text-slate-200 hover:bg-slate-900/30'
                                : 'border-slate-200 text-slate-550 hover:text-slate-800 hover:bg-slate-55'
                          }`}
                        >
                          {pill.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Listings Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                    {filteredBusinesses.map(b => {
                      const isExpired = b.subscriptionStatus === 'expired';
                      return (
                        <div 
                          key={b._id}
                          className={`border shadow-xs rounded-[28px] overflow-hidden flex flex-col justify-between hover:shadow-md transition-all relative ${
                            themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div 
                            className="h-36 bg-slate-100 bg-cover bg-center shrink-0 relative"
                            style={{ backgroundImage: `url('${b.coverImageUrl}')` }}
                          >
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                              <div className="flex gap-1">
                                {b.featured && (
                                  <span className="bg-amber-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-0.5 select-none">
                                    <Sparkles className="h-2.5 w-2.5 fill-current" /> Featured
                                  </span>
                                )}
                                <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-lg shadow-sm select-none ${
                                  b.status === 'Approved' ? 'bg-[#027244] text-white' : (b.status === 'Rejected' ? 'bg-rose-650 text-white' : 'bg-amber-550 text-white')
                                }`}>
                                  {b.status}
                                </span>
                              </div>
                              {b.googlePlaceId && (
                                <span className="bg-blue-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-lg shadow-sm w-fit select-none">
                                  Google Linked
                                </span>
                              )}
                            </div>

                            {/* Top Right Trash Delete button */}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteBusiness(b._id); }}
                              className="absolute top-3 right-3 h-7 w-7 rounded-xl bg-red-650/90 hover:bg-red-650 text-white flex items-center justify-center shadow-md cursor-pointer z-10 transition-colors border border-red-500/10"
                              title="Delete Listing"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>

                            {isExpired && (
                              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center p-2 z-10">
                                <span className="bg-rose-650 text-white text-[9px] font-black uppercase px-3 py-1 rounded shadow">
                                  Subscription Expired
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className={`font-black text-sm leading-tight truncate ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>
                                  {b.name}
                                </h4>
                              </div>
                              <span className="text-[10px] text-slate-400 font-extrabold uppercase leading-none">
                                {b.category || 'Local Services'} • {b.type}
                              </span>
                              <span className="text-[9.5px] text-slate-400 font-semibold leading-relaxed">
                                Locality: <b className={themeMode === 'dark' ? 'text-slate-200' : 'text-slate-700'}>{b.locality} (Pincode: {b.pincode})</b>
                              </span>
                              <span className="text-[9.5px] text-slate-400 font-semibold leading-none">
                                Owner: {b.ownerName} ({b.ownerEmail})
                              </span>
                              <span className="text-[8.5px] text-slate-450 font-bold leading-none mt-1">
                                Registered: {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '01/10/2025'}
                              </span>
                            </div>

                            <div className={`flex flex-col gap-1.5 text-xs font-semibold border-t pt-3 ${
                              themeMode === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                            }`}>
                              <div className="flex justify-between">
                                <span>Google Rating Specs</span>
                                <span className={`font-bold flex items-center gap-0.5 ${themeMode === 'dark' ? 'text-slate-200' : 'text-[#001c41]'}`}>
                                  ★ {b.googleRating || 'N/A'} ({b.googleReviewsCount || '0'} reviews)
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Subscription Expiry</span>
                                <span className={`font-black ${isExpired ? 'text-rose-600' : 'text-[#027244]'}`}>
                                  {b.subscriptionExpiry ? new Date(b.subscriptionExpiry).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                            </div>

                            <div className={`grid grid-cols-2 gap-2 border-t pt-4 mt-1 ${
                              themeMode === 'dark' ? 'border-slate-800' : 'border-slate-100'
                            }`}>
                              <button 
                                onClick={() => { setSelectedBiz(b); setShowBizModal(true); }}
                                className={`py-2 border text-[10.5px] font-extrabold rounded-xl cursor-pointer text-center transition-colors ${
                                  themeMode === 'dark' 
                                    ? 'border-slate-800 hover:bg-slate-800/40 text-slate-300' 
                                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                                }`}
                              >
                                View Details
                              </button>
                              <button 
                                onClick={() => { setSelectedBizForExtend(b); setShowExtendSubModal(true); }}
                                className="py-2 border border-amber-250 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[10.5px] font-extrabold rounded-xl cursor-pointer text-center transition-colors"
                              >
                                Extend Sub
                              </button>
                              <button 
                                onClick={() => handleFeaturedToggle(b._id)}
                                className={`py-2 text-[10.5px] font-extrabold rounded-xl cursor-pointer text-center transition-colors ${
                                  b.featured 
                                    ? 'bg-slate-500/15 border border-slate-500/25 text-slate-400 hover:bg-slate-500/25'
                                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                                }`}
                              >
                                {b.featured ? 'Un-Feature' : 'Mark Featured'}
                              </button>
                              <button 
                                onClick={() => handleAction(b._id, b.status === 'Suspended' ? 'approve' : 'suspend')}
                                className={`py-2 text-[10.5px] font-extrabold rounded-xl cursor-pointer text-center transition-colors ${
                                  b.status === 'Suspended'
                                    ? 'bg-[#027244] hover:bg-[#005934] text-white shadow-xs'
                                    : 'bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-500'
                                }`}
                              >
                                {b.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                              </button>
                              
                              {/* Direct Approve/Reject for non-approved states */}
                              {b.status !== 'Approved' && (
                                <button
                                  onClick={() => handleAction(b._id, 'approve')}
                                  className="col-span-2 py-2 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer text-center transition-colors shadow-xs"
                                >
                                  Approve Listing
                                </button>
                              )}
                              {b.status === 'Approved' && (
                                <button
                                  onClick={() => handleAction(b._id, 'reject')}
                                  className="col-span-2 py-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-500 font-extrabold text-[10.5px] rounded-xl cursor-pointer text-center transition-colors"
                                >
                                  Reject Listing
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: PENDING VERIFICATIONS */}
              {activeTab === 'Pending Verifications' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn">
                  <div className={`border shadow-xs rounded-[28px] p-6 ${
                    themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                  }`}>
                    <h3 className="font-extrabold text-base leading-tight font-sans">Pending Audit Queue</h3>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Manual vetting required for registration documents, locality matching, and contact phone details.</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {businesses.filter(b => b.status === 'Pending Verification' || b.status === 'Under Review').map(b => (
                      <div 
                        key={b._id} 
                        className={`border shadow-xs rounded-[28px] p-5 flex flex-col justify-between gap-5 hover:shadow-md transition-all ${
                          themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                        }`}
                      >
                        <div className="flex gap-4">
                          <div className="h-16 w-16 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200/55">
                            <img src={b.coverImageUrl} className="h-full w-full object-cover" alt={b.name} />
                          </div>
                          <div className="flex flex-col gap-1 text-left min-w-0 flex-1">
                            <h4 className={`font-extrabold text-sm truncate leading-none ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>{b.name}</h4>
                            <span className="text-xs text-emerald-500 font-bold mt-1 leading-none">{b.type}</span>
                            <span className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1 font-semibold leading-relaxed">
                              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {b.address}
                            </span>
                          </div>
                        </div>

                        <div className={`flex justify-between items-center border-t pt-3.5 gap-2 ${
                          themeMode === 'dark' ? 'border-slate-800' : 'border-slate-100'
                        }`}>
                          <button 
                            onClick={() => { setSelectedBiz(b); setShowBizModal(true); }}
                            className="text-xs font-bold text-slate-450 hover:text-emerald-500 flex items-center gap-0.5 cursor-pointer transition-colors"
                          >
                            <Eye className="h-4 w-4" /> View Details & Vetting
                          </button>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleAction(b._id, 'reject')}
                              className="px-3.5 py-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-500 font-extrabold text-[10.5px] rounded-xl cursor-pointer transition-colors"
                            >
                              Reject
                            </button>
                            <button 
                              onClick={() => handleAction(b._id, 'approve')}
                              className="px-4.5 py-2 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer shadow shadow-emerald-800/10 transition-colors"
                            >
                              Approve Listing
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {businesses.filter(b => b.status === 'Pending Verification' || b.status === 'Under Review').length === 0 && (
                      <div className={`col-span-2 border rounded-[28px] p-16 text-center text-slate-400 flex flex-col items-center gap-3 ${
                        themeMode === 'dark' ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'
                      }`}>
                        <CheckCircle2 className="h-10 w-10 text-emerald-600 animate-bounce" />
                        <span className={`text-sm font-bold font-sans ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>Queue Clean!</span>
                        <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs">There are no pending business listings waiting for administrative approval today.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: CATEGORY MANAGEMENT */}
              {activeTab === 'Category Management' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn">
                  
                  {/* Title Block */}
                  <div className={`border shadow-xs rounded-[28px] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                    themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                  }`}>
                    <div className="flex flex-col text-left">
                      <h3 className="font-extrabold text-base leading-tight font-sans">Category Management Console</h3>
                      <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Seeded presets, custom requests vetting, automatic icon assignment, and category mergers.</span>
                    </div>
                  </div>

                  {/* Split Layout: Left side for requests & grid, Right side for operations */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
                    
                    {/* Left & Center: Requests and Category Lists */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                      
                      {/* Section 1: Pending Requests */}
                      <div className={`border shadow-xs rounded-[28px] p-6 ${
                        themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                      }`}>
                        <h4 className="font-extrabold text-xs uppercase tracking-wider mb-4 border-b pb-3 border-slate-200/10 flex items-center gap-2">
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
                              <div key={biz._id} className="border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/20">
                                <div className="flex flex-col text-left">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-amber-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-sm">Custom category request</span>
                                    <span className="text-[9px] font-extrabold text-slate-400">Biz Status: {biz.status}</span>
                                  </div>
                                  <span className={`font-black text-sm mt-2 ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>"{biz.customCategoryName}"</span>
                                  <span className="text-[10.5px] text-slate-400 font-semibold mt-1">Requested by business: <b className="text-slate-555">{biz.name}</b> ({biz.ownerId?.fullName || 'Owner'})</span>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 items-center">
                                  <button
                                    onClick={() => {
                                      const val = prompt(`Assign existing category for "${biz.customCategoryName}". Options listed in dropdown. Enter name:`);
                                      if (!val) return;
                                      const matched = presetCategories.find(c => c.categoryName.toLowerCase() === val.toLowerCase());
                                      if (!matched) {
                                        alert("Selected category does not exist in preset list.");
                                        return;
                                      }
                                      resolveCategoryRequest(biz._id, 'assign', matched._id);
                                    }}
                                    className="py-1.5 px-3 bg-slate-500/10 border border-slate-405/20 hover:bg-slate-500/25 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold rounded-xl transition-colors cursor-pointer"
                                  >
                                    Assign Existing
                                  </button>
                                  <button
                                    onClick={() => {
                                      const isCreate = confirm(`Create genuinely new category "${biz.customCategoryName}"? It will auto-resolve the business mapping.`);
                                      if (isCreate) {
                                        resolveCategoryRequest(biz._id, 'create', null, biz.customCategoryName);
                                      }
                                    }}
                                    className="py-1.5 px-3 bg-[#027244] hover:bg-[#005934] text-white text-[10px] font-extrabold rounded-xl transition-colors cursor-pointer shadow-sm shadow-emerald-800/10"
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
                      <div className={`border shadow-xs rounded-[28px] p-6 ${
                        themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                      }`}>
                        <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-200/10">
                          <h4 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
                            <Grid className="h-4.5 w-4.5 text-emerald-500" /> Preset Categories ({presetCategories.length})
                          </h4>
                          <span className="text-[10px] text-slate-500 font-bold">Sort: Alphabetical</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                          {presetCategories.map(cat => {
                            const count = businesses.filter(b => b.category === cat.categoryName).length;
                            return (
                              <div 
                                key={cat._id} 
                                className={`border rounded-2xl p-4 flex justify-between items-center transition-all ${
                                  themeMode === 'dark' ? 'bg-slate-950/20 border-slate-800 hover:border-slate-700' : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-black shrink-0 ${
                                    themeMode === 'dark' ? 'bg-slate-900 text-emerald-455 border border-slate-800' : 'bg-emerald-50 text-[#027244] border-emerald-100'
                                  }`}>
                                    <Store className="h-4.5 w-4.5" />
                                  </div>
                                  <div className="flex flex-col text-left min-w-0">
                                    <span className={`font-extrabold text-xs truncate ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{cat.categoryName}</span>
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
                                    className="h-7 w-7 rounded-lg border border-slate-350 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center cursor-pointer text-slate-550 dark:text-slate-300 font-extrabold text-[10px]"
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
                      <div className={`border shadow-xs rounded-[28px] p-6 flex flex-col gap-5 ${
                        themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                      }`}>
                        <div>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider mb-1">Add Preset Category</h4>
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
                              className={`w-full border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244] ${
                                themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-200' : 'bg-slate-50/50 border-slate-200 text-[#001c41]'
                              }`}
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
                      <div className={`border shadow-xs rounded-[28px] p-6 flex flex-col gap-5 ${
                        themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                      }`}>
                        <div>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider mb-1">Merge Categories Console</h4>
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
                                const mergeRes = await fetch('http://localhost:5000/api/superadmin/categories/merge', {
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
                              className={`w-full border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244] cursor-pointer ${
                                themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-200' : 'bg-slate-50/50 border-slate-200 text-[#001c41]'
                              }`}
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
                              className={`w-full border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244] cursor-pointer ${
                                themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-200' : 'bg-slate-50/50 border-slate-200 text-[#001c41]'
                              }`}
                            >
                              <option value="">-- Select Target --</option>
                              {presetCategories.map(c => (
                                <option key={c._id} value={c._id}>{c.categoryName}</option>
                              ))}
                            </select>
                          </div>

                          <button
                            type="submit"
                            className="py-3 bg-purple-650 hover:bg-purple-750 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                          >
                            Execute Category Merger
                          </button>
                        </form>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Merchants' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn">
                  <div className={`border shadow-xs rounded-[28px] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                    themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                  }`}>
                    <div className="flex flex-col text-left">
                      <h3 className="font-extrabold text-base leading-tight font-sans">User Directory Control</h3>
                      <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Suspend, block/unblock, or notify merchants and regular reviewers registered on UBT.</span>
                    </div>
                    {/* Toggles between Merchants and Regular Users */}
                    <div className="bg-slate-950/25 backdrop-blur-xs p-1 rounded-xl flex items-center border border-slate-800/30 font-sans">
                      <button
                        onClick={() => setMerchantUserFilter('merchants')}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          merchantUserFilter === 'merchants'
                            ? 'bg-[#027244] text-white shadow-sm shadow-emerald-950/15'
                            : 'text-slate-450 hover:text-slate-200'
                        }`}
                      >
                        Merchants
                      </button>
                      <button
                        onClick={() => setMerchantUserFilter('regularUsers')}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          merchantUserFilter === 'regularUsers'
                            ? 'bg-[#027244] text-white shadow-sm shadow-emerald-950/15'
                            : 'text-slate-450 hover:text-slate-200'
                        }`}
                      >
                        Regular Users
                      </button>
                    </div>
                  </div>

                  {/* Toggles between All, Active, and Suspended when merchantUserFilter is 'merchants' */}
                  {merchantUserFilter === 'merchants' && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                      {[
                        { id: 'All', label: 'All Merchants' },
                        { id: 'Active', label: 'Active Status' },
                        { id: 'Suspended', label: 'Suspended Status' }
                      ].map(pill => (
                        <button
                          key={pill.id}
                          type="button"
                          onClick={() => setMerchantStatusFilter(pill.id)}
                          className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black border transition-all cursor-pointer whitespace-nowrap ${
                            merchantStatusFilter === pill.id
                              ? 'bg-[#027244] border-[#027244] text-white shadow-xs'
                              : themeMode === 'dark'
                                ? 'border-slate-800 text-slate-450 hover:text-slate-200 hover:bg-slate-900/30'
                                : 'border-slate-200 text-slate-550 hover:text-slate-800 hover:bg-slate-55'
                          }`}
                        >
                          {pill.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {merchantUserFilter === 'merchants' ? (
                    <div className={`overflow-x-auto border rounded-[28px] ${
                      themeMode === 'dark' ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      <table className="w-full border-collapse text-left text-xs font-semibold text-slate-600">
                        <thead className={`uppercase text-[9px] font-black tracking-wider border-b ${
                          themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-450'
                        }`}>
                          <tr>
                            <th className="p-4.5">Merchant Name</th>
                            <th className="p-4.5">Contact Specs</th>
                            <th className="p-4.5">Subscription History</th>
                            <th className="p-4.5">Account Status</th>
                            <th className="p-4.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y font-medium ${themeMode === 'dark' ? 'divide-slate-800' : 'divide-slate-100'}`}>
                          {filteredMerchants.map(m => {
                            // Resolve active plans owned by this merchant dynamically
                            const merchantBiz = businesses.filter(b => b.ownerEmail === m.email);
                            
                            return (
                              <tr key={m._id} className={`transition-colors ${themeMode === 'dark' ? 'hover:bg-slate-900/30' : 'hover:bg-slate-50/50'}`}>
                                <td className="p-4.5 flex items-center gap-3">
                                  <div 
                                    onClick={() => { setSelectedUser(m); setShowUserModal(true); }}
                                    className={`h-9 w-9 rounded-full border flex items-center justify-center font-black text-xs shrink-0 cursor-pointer transition-all hover:scale-105 ${
                                      themeMode === 'dark' 
                                        ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750' 
                                        : 'bg-emerald-50 text-[#027244] border-emerald-100 hover:bg-emerald-100'
                                    }`}
                                    title="Click to view profile"
                                  >
                                    {m.fullName.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex flex-col text-left">
                                    <span 
                                      onClick={() => { setSelectedUser(m); setShowUserModal(true); }}
                                      className={`font-extrabold text-xs sm:text-[13px] cursor-pointer hover:underline hover:text-[#027244] transition-colors ${
                                        themeMode === 'dark' ? 'text-white hover:text-emerald-400' : 'text-slate-800'
                                      }`}
                                      title="Click to view profile"
                                    >
                                      {m.fullName}
                                    </span>
                                    <span className="text-[9.5px] text-slate-400 font-bold mt-1">Joined: {m.createdAt.toLocaleDateString()}</span>
                                  </div>
                                </td>
                                <td className="p-4.5">
                                  <div className={`flex flex-col gap-0.5 text-left ${themeMode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                    <span>{m.email}</span>
                                    <span className="text-slate-400 font-bold">{m.mobileNumber}</span>
                                  </div>
                                </td>
                                <td className="p-4.5 max-w-[220px] text-left">
                                  {merchantBiz.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                      {merchantBiz.map(b => (
                                        <span
                                          key={b._id}
                                          onClick={() => { setSelectedBiz(b); setShowBizModal(true); }}
                                          className={`px-2.5 py-1 rounded text-[9.5px] font-black cursor-pointer transition-all border shrink-0 ${
                                            b.subscriptionStatus === 'active' || b.isPremium
                                              ? 'bg-amber-500/10 border-amber-500/25 text-amber-650 hover:bg-amber-500/20'
                                              : 'bg-slate-500/10 border-slate-500/20 text-slate-600 hover:bg-slate-500/20'
                                          }`}
                                          title={`Click to view business profile: ${b.name}`}
                                        >
                                          {b.name}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 italic">No business directory</span>
                                  )}
                                </td>
                                <td className="p-4.5 text-left">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                                    m.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450' : 'bg-red-500/10 border-red-500/20 text-red-500 animate-pulse'
                                  }`}>
                                    {m.status}
                                  </span>
                                </td>
                                <td className="p-4.5 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => { setSelectedUser(m); setShowUserModal(true); }}
                                      className="px-3 py-1.5 bg-[#001c41] hover:bg-[#002d62] text-white rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors shadow-xs"
                                    >
                                      View Profile
                                    </button>
                                    <button 
                                      onClick={() => handleMerchantStatusToggle(m._id)}
                                      className={`px-3 py-1.5 rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors ${
                                        m.status === 'Active' 
                                          ? 'bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-500'
                                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                      }`}
                                    >
                                      {m.status === 'Active' ? 'Suspend' : 'Reactivate'}
                                    </button>
                                    <button 
                                      onClick={() => { setMerchantForNotice(m); setMerchantNoticeText(''); setShowMerchantNoticeModal(true); }}
                                      className="px-3 py-1.5 border border-emerald-500/25 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors"
                                    >
                                      Notify
                                    </button>
                                    <button 
                                      onClick={() => alert(`Reset password simulated for ${m.email}. System generated password: UBT_${Math.floor(Math.random()*90000 + 10000)}`)}
                                      className={`px-3 py-1.5 border rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors ${
                                        themeMode === 'dark' 
                                          ? 'border-slate-800 hover:bg-slate-800/40 text-slate-300' 
                                          : 'border-slate-200 hover:bg-slate-550 text-slate-700'
                                      }`}
                                    >
                                      Reset Pwd
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className={`overflow-x-auto border rounded-[28px] ${
                      themeMode === 'dark' ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      <table className="w-full border-collapse text-left text-xs font-semibold text-slate-600">
                        <thead className={`uppercase text-[9px] font-black tracking-wider border-b ${
                          themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-450'
                        }`}>
                          <tr>
                            <th className="p-4.5">User Profile</th>
                            <th className="p-4.5">Contact Specs</th>
                            <th className="p-4.5">Account Role</th>
                            <th className="p-4.5">Account Status</th>
                            <th className="p-4.5 text-right">Actions / Control</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y font-medium ${themeMode === 'dark' ? 'divide-slate-800' : 'divide-slate-100'}`}>
                          {regularUsers.map(u => (
                            <tr key={u._id} className={`transition-colors ${themeMode === 'dark' ? 'hover:bg-slate-900/30' : 'hover:bg-slate-50/50'}`}>
                              <td className="p-4.5 flex items-center gap-3">
                                <div 
                                  onClick={() => { setSelectedUser(u); setShowUserModal(true); }}
                                  className={`h-9 w-9 rounded-full border flex items-center justify-center font-black text-xs shrink-0 cursor-pointer transition-all hover:scale-105 ${
                                    themeMode === 'dark' 
                                      ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750' 
                                      : 'bg-blue-555/10 border-blue-500/20 text-blue-500 hover:bg-blue-500/20'
                                  }`}
                                  title="Click to view profile"
                                >
                                  {u.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col text-left">
                                  <span 
                                    onClick={() => { setSelectedUser(u); setShowUserModal(true); }}
                                    className={`font-extrabold text-xs sm:text-[13px] cursor-pointer hover:underline hover:text-blue-550 transition-colors ${
                                      themeMode === 'dark' ? 'text-white hover:text-blue-400' : 'text-slate-855'
                                    }`}
                                    title="Click to view profile"
                                  >
                                    {u.fullName}
                                  </span>
                                  <span className="text-[9.5px] text-slate-400 font-bold mt-1">Registered: {u.createdAt.toLocaleDateString()}</span>
                                </div>
                              </td>
                              <td className="p-4.5 text-left">
                                <div className="flex flex-col gap-0.5">
                                  <span className={themeMode === 'dark' ? 'text-slate-300' : 'text-slate-600'}>{u.email}</span>
                                  <span className="text-slate-400 font-bold">{u.mobileNumber}</span>
                                </div>
                              </td>
                              <td className="p-4.5 text-left">
                                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                                  themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                                }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="p-4.5 text-left">
                                <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase border ${
                                  u.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450' : 'bg-red-500/10 border-red-500/20 text-red-500 animate-pulse'
                                }`}>
                                  {u.status}
                                </span>
                              </td>
                              <td className="p-4.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => { setSelectedUser(u); setShowUserModal(true); }}
                                    className="px-3 py-1.5 bg-[#001c41] hover:bg-[#002d62] text-white rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors shadow-xs"
                                  >
                                    View Profile
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setRegularUsers(prev => prev.map(usr => {
                                        if (usr._id === u._id) {
                                          const nextStatus = usr.status === 'Active' ? 'Suspended' : 'Active';
                                          setSystemLogs(prevLogs => [
                                            { time: new Date().toLocaleTimeString(), event: `Toggled user ${usr.email} status to ${nextStatus}`, type: 'warning' },
                                            ...prevLogs
                                          ]);
                                          return { ...usr, status: nextStatus };
                                        }
                                        return usr;
                                      }));
                                    }}
                                    className={`px-3.5 py-1.5 rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors ${
                                      u.status === 'Active' 
                                        ? 'bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-500'
                                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    }`}
                                  >
                                    {u.status === 'Active' ? 'Block User' : 'Unblock User'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: ADMIN MANAGEMENT */}
              {activeTab === 'Admin Management' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn">
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Add Admin form */}
                    <div className={`border shadow-xs rounded-[28px] p-6 flex flex-col gap-5 font-sans ${
                      themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                    }`}>
                      <div>
                        <h3 className={`font-extrabold text-sm uppercase tracking-wider ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>Register Administrator</h3>
                        <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Generate roles to manage moderation sub-desks.</span>
                      </div>

                      <form onSubmit={handleAdminCreation} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest leading-none">Full Name *</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="Enter admin full name"
                            value={newAdmin.fullName}
                            onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
                            className={`w-full border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244] ${
                              themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-200' : 'bg-slate-50/50 border-slate-200 text-[#001c41]'
                            }`}
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Email Address *</label>
                          <input 
                            type="email" 
                            required 
                            placeholder="admin@ubt.com"
                            value={newAdmin.email}
                            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                            className={`w-full border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244] ${
                              themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-200' : 'bg-slate-50/50 border-slate-200 text-[#001c41]'
                            }`}
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Access Level Permission</label>
                          <select 
                            value={newAdmin.permissions}
                            onChange={(e) => setNewAdmin({ ...newAdmin, permissions: e.target.value })}
                            className={`w-full border px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244] cursor-pointer ${
                              themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-200' : 'bg-slate-50/50 border-slate-200 text-[#001c41]'
                            }`}
                          >
                            <option value="Full">Full Access (Audit, Modify)</option>
                            <option value="Moderation Only">Moderation Only (Blogs, Reviews)</option>
                            <option value="Read Only">Read Only (Telemetry/Audits view)</option>
                          </select>
                        </div>
                        <button 
                          type="submit"
                          disabled={!newAdmin.fullName || !newAdmin.email}
                          className="py-3 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 mt-2"
                        >
                          Register Role
                        </button>
                      </form>
                    </div>

                    {/* Admins list */}
                    <div className={`lg:col-span-2 border shadow-xs rounded-[28px] p-6 flex flex-col gap-4 font-sans ${
                      themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                    }`}>
                      <h3 className={`font-extrabold text-sm uppercase tracking-wider border-b pb-3 ${
                        themeMode === 'dark' ? 'border-slate-800 text-white' : 'border-slate-100 text-[#001c41]'
                      }`}>Active Administrative Staff</h3>
                      <div className={`overflow-x-auto border rounded-2xl ${
                        themeMode === 'dark' ? 'border-slate-800' : 'border-slate-200'
                      }`}>
                        <table className="w-full border-collapse text-left text-xs font-semibold text-slate-600">
                          <thead className={`uppercase text-[9px] font-black tracking-wider border-b ${
                            themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-400'
                          }`}>
                            <tr>
                              <th className="p-4.5">Administrator</th>
                              <th className="p-4.5">Role / Permission</th>
                              <th className="p-4.5">Status</th>
                              <th className="p-4.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y font-medium ${themeMode === 'dark' ? 'divide-slate-800' : 'divide-slate-100'}`}>
                            {admins.map(a => (
                              <tr key={a._id} className={`transition-colors ${themeMode === 'dark' ? 'hover:bg-slate-900/30' : 'hover:bg-slate-50/50'}`}>
                                <td className="p-4.5 flex items-center gap-3">
                                  <div className={`h-9 w-9 rounded-full border flex items-center justify-center font-black text-xs shrink-0 ${
                                    themeMode === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-[#001c41]'
                                  }`}>
                                    {a.fullName.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className={`font-extrabold text-xs sm:text-[13px] ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{a.fullName}</span>
                                    <span className="text-[9.5px] text-slate-400 font-bold mt-1">{a.email}</span>
                                  </div>
                                </td>
                                <td className="p-4.5">
                                  <div className="flex flex-col gap-0.5">
                                    <span className={`font-bold text-xs ${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Admin Desk</span>
                                    <span className={`text-[9.5px] font-extrabold uppercase mt-1 tracking-wider border px-2 py-0.5 rounded-full w-fit ${
                                      themeMode === 'dark' ? 'bg-slate-850 border-slate-800 text-slate-350' : 'bg-slate-100 border-slate-200 text-slate-500'
                                    }`}>
                                      {a.permissions}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4.5">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                                    a.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450' : 'bg-red-500/10 border-red-500/20 text-red-500 animate-pulse'
                                  }`}>
                                    {a.status}
                                  </span>
                                </td>
                                <td className="p-4.5 text-right">
                                  <div className="flex justify-end items-center gap-2">
                                    <button 
                                      onClick={() => handleAdminStatusToggle(a._id)}
                                      className={`px-3 py-1.5 rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors ${
                                        a.status === 'Active' 
                                          ? 'bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-500'
                                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                      }`}
                                    >
                                      {a.status === 'Active' ? 'Suspend' : 'Activate'}
                                    </button>
                                    <button 
                                      onClick={() => { setEditingAdmin(a); setShowEditAdminModal(true); }}
                                      className={`px-3 py-1.5 border rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors ${
                                        themeMode === 'dark' 
                                          ? 'border-slate-800 hover:bg-slate-800/40 text-slate-300' 
                                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                      }`}
                                    >
                                      Edit
                                    </button>
                                    <button 
                                      onClick={() => {
                                        if (window.confirm(`Are you sure you want to permanently remove admin ${a.fullName}?`)) {
                                          setAdmins(prev => prev.filter(adm => adm._id !== a._id));
                                          setSystemLogs(prev => [
                                            { time: new Date().toLocaleTimeString(), event: `SuperAdmin deleted administrative staff role: ${a.email}`, type: 'warning' },
                                            ...prev
                                          ]);
                                          alert("Administrator removed successfully.");
                                        }
                                      }}
                                      className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-500 rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors"
                                    >
                                      Remove
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
                </div>
              )}

              {/* TAB 6: BLOGS MODERATION */}
              {activeTab === 'Blogs Moderation' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn">
                  <div className={`border shadow-xs rounded-[28px] p-6 ${
                    themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                  }`}>
                    <h3 className="font-extrabold text-base leading-tight font-sans">Blogs Moderation Desk</h3>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Verify, approve, publish, or suspend merchant blog articles.</span>
                  </div>
                  {/* Status filter pills row */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                    {[
                      { id: 'All', label: 'All Blogs' },
                      { id: 'Approved', label: 'Approved & Active' },
                      { id: 'Pending', label: 'Pending Review' }
                    ].map(pill => (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => setBlogStatusFilter(pill.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide border transition-all cursor-pointer whitespace-nowrap ${
                          blogStatusFilter === pill.id
                            ? 'bg-[#027244] border-[#027244] text-white shadow-xs'
                            : themeMode === 'dark'
                              ? 'border-slate-800 text-slate-450 hover:text-slate-200 hover:bg-slate-900/30'
                              : 'border-slate-200 text-slate-550 hover:text-slate-800 hover:bg-slate-55'
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredBlogs.map(b => (
                      <div 
                        key={b._id} 
                        onClick={() => { setSelectedBlogModal(b); setSuggestionText(b.revisionSuggestions || ''); }}
                        className={`border rounded-[24px] p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-4 cursor-pointer text-left group ${
                          themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white hover:border-slate-700' : 'bg-white border-slate-200 text-[#001c41] hover:border-slate-350'
                        }`}
                      >
                        <div className="flex gap-4">
                          {b.coverImage && (
                            <div className="h-16 w-20 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shrink-0 select-none">
                              <img src={b.coverImage} className="w-full h-full object-cover" alt="Blog Cover" />
                            </div>
                          )}
                          <div className="flex flex-col min-w-0 text-left">
                            <span className="font-extrabold text-xs sm:text-[13px] leading-snug truncate group-hover:text-[#027244] transition-colors">{b.title}</span>
                            <span className="text-[9.5px] text-slate-400 font-bold mt-1">Author: {b.authorName} • {new Date(b.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-1">
                          <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border ${
                            b.status === 'Approved' 
                              ? 'bg-emerald-50 border-emerald-250 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400' 
                              : b.status === 'Pending Approval' || b.status === 'Needs Revision'
                                ? 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-400'
                                : b.status === 'Rejected'
                                  ? 'bg-rose-50 border-rose-200 text-rose-605 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-400'
                                  : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-750 dark:text-slate-400'
                          }`}>
                            {b.status}
                          </span>
                          <span className="text-[10.5px] font-extrabold text-[#027244] flex items-center gap-1 group-hover:underline">
                            Touch to Audit & Moderate →
                          </span>
                        </div>
                      </div>
                    ))}
                    {filteredBlogs.length === 0 && (
                      <div className={`col-span-2 border rounded-3xl p-16 text-center text-slate-450 flex flex-col items-center gap-3 ${
                        themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
                      }`}>
                        <BookOpen className="h-10 w-10 text-emerald-600 animate-pulse" />
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-sans">No Blogs Found</span>
                        <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs">There are no blog posts currently available in the moderation system.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 7: EVENTS MODERATION */}
              {activeTab === 'Events Moderation' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn">
                  <div className={`border shadow-xs rounded-[28px] p-6 ${
                    themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                  }`}>
                    <h3 className="font-extrabold text-base leading-tight font-sans">Events Moderation Desk</h3>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Vetting user promoting events, concert flyers, and seasonal local celebrations.</span>
                  </div>
                  {/* Status filter pills row */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                    {[
                      { id: 'All', label: 'All Events' },
                      { id: 'Approved', label: 'Approved & Active' },
                      { id: 'Pending', label: 'Pending Moderation' }
                    ].map(pill => (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => setEventStatusFilter(pill.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide border transition-all cursor-pointer whitespace-nowrap ${
                          eventStatusFilter === pill.id
                            ? 'bg-[#027244] border-[#027244] text-white shadow-xs'
                            : themeMode === 'dark'
                              ? 'border-slate-800 text-slate-450 hover:text-slate-200 hover:bg-slate-900/30'
                              : 'border-slate-200 text-slate-550 hover:text-slate-800 hover:bg-slate-55'
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-5 animate-fadeIn">
                    {filteredEvents.map(e => (
                      <div 
                        key={e._id} 
                        className={`border rounded-[28px] p-5 flex flex-col gap-4 font-sans ${
                          themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex flex-col text-left font-sans">
                            <div className="flex items-center gap-2">
                              <span className={`font-extrabold text-xs sm:text-[13px] leading-snug ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>{e.title}</span>
                              {e.featured && (
                                <span className="bg-amber-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-lg flex items-center gap-0.5 select-none shrink-0">
                                  <Sparkles className="h-2 w-2 fill-current" /> Featured
                                </span>
                              )}
                            </div>
                            <span className="text-[9.5px] text-slate-400 font-bold mt-1 block">
                              Organizer: {e.organizer} • Date: {e.date} • Venue: {e.venue}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border ${
                            e.status === 'Approved' ? 'bg-[#027244]/10 border-[#027244]/20 text-[#027244]' : 'bg-amber-550/10 border-amber-550/20 text-amber-550 animate-pulse'
                          }`}>
                            {e.status}
                          </span>
                        </div>
                        
                        <div className={`flex justify-between items-center border-t pt-3.5 gap-2 ${
                          themeMode === 'dark' ? 'border-slate-800' : 'border-slate-100'
                        }`}>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setEvents(prev => prev.map(item => item._id === e._id ? { ...item, featured: !item.featured } : item));
                              }}
                              className={`px-3 py-1.5 border rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors ${
                                e.featured
                                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-550'
                                  : themeMode === 'dark' ? 'border-slate-800 text-slate-400 hover:bg-slate-800/40' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {e.featured ? 'Un-Feature' : 'Feature Event'}
                            </button>
                            <button 
                              onClick={() => { setEditingEvent(e); setShowEditEventModal(true); }}
                              className={`px-3 py-1.5 border rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors ${
                                themeMode === 'dark' ? 'border-slate-800 text-slate-350 hover:bg-slate-800/40' : 'border-slate-200 text-slate-600 hover:bg-slate-550'
                              }`}
                            >
                              Edit Info
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm("Permanently delete this event?")) {
                                  setEvents(prev => prev.filter(item => item._id !== e._id));
                                  alert("Event deleted.");
                                }
                              }}
                              className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-500 rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors"
                            >
                              Delete
                            </button>
                          </div>

                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEventAction(e._id, 'Rejected')}
                              disabled={e.status === 'Rejected'}
                              className="px-3.5 py-1.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-500 font-extrabold text-[10.5px] rounded-xl cursor-pointer disabled:opacity-40 transition-colors"
                            >
                              Reject
                            </button>
                            <button 
                              onClick={() => handleEventAction(e._id, 'Approved')}
                              disabled={e.status === 'Approved'}
                              className="px-4.5 py-1.5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer disabled:opacity-40 transition-colors shadow shadow-emerald-800/10"
                            >
                              Approve & Publish
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: REVIEWS MODERATION */}
              {activeTab === 'Reviews Moderation' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn">
                  <div className={`border shadow-xs rounded-[28px] p-6 ${
                    themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                  }`}>
                    <h3 className="font-extrabold text-base leading-tight font-sans">Reviews Feed Moderation</h3>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Purge commercial spam reviews, target comments, and manage local testimonial flags.</span>
                  </div>

                  <div className="flex flex-col gap-4 font-sans">
                    {reviews.map(r => {
                      const isHidden = r.status === 'hidden';
                      const isSpam = r.status === 'flagged' || r.status === 'spam';
                      
                      return (
                        <div 
                          key={r._id} 
                          className={`border rounded-[28px] p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all ${
                            themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`h-10 w-10 rounded-full border flex items-center justify-center font-black text-xs shrink-0 ${
                              themeMode === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-600'
                            }`}>
                              {r.authorName.charAt(0)}
                            </div>
                            <div className="flex flex-col text-left font-sans">
                              <div className="flex items-center gap-2">
                                <span className={`font-extrabold text-xs leading-none ${themeMode === 'dark' ? 'text-white' : 'text-slate-805'}`}>
                                  {r.authorName} on {r.businessName}
                                </span>
                                {isHidden && (
                                  <span className="bg-slate-500/15 border border-slate-500/25 text-slate-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-lg leading-none">
                                    Hidden
                                  </span>
                                )}
                                {isSpam && (
                                  <span className="bg-rose-500/15 border border-rose-500/25 text-rose-500 text-[8px] font-black uppercase px-2 py-0.5 rounded-lg leading-none animate-pulse">
                                    Spam Flag
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <div className="flex text-amber-400 gap-0.5 shrink-0">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-3 w-3 ${i < r.rating ? 'fill-current' : 'text-slate-200'}`} />
                                  ))}
                                </div>
                                <span className="text-[9px] text-slate-400 font-bold ml-1">
                                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '01/10/2025'}
                                </span>
                              </div>
                              <p className={`text-[11.5px] font-semibold mt-2.5 max-w-2xl leading-relaxed ${
                                themeMode === 'dark' ? 'text-slate-350' : 'text-slate-550'
                              }`}>{r.text}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-4 md:mt-0 shrink-0 w-full md:w-auto justify-end">
                            <button 
                              onClick={() => {
                                setReviews(prev => prev.map(item => item._id === r._id ? { ...item, status: isHidden ? 'approved' : 'hidden' } : item));
                              }}
                              className={`px-3 py-1.5 border rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors ${
                                isHidden
                                  ? 'bg-[#027244]/15 border-[#027244]/25 text-[#027244]'
                                  : themeMode === 'dark' ? 'border-slate-800 text-slate-400 hover:bg-slate-800/40' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {isHidden ? 'Un-Hide' : 'Hide'}
                            </button>
                            <button 
                              onClick={() => {
                                setReviews(prev => prev.map(item => item._id === r._id ? { ...item, status: isSpam ? 'approved' : 'spam' } : item));
                              }}
                              className={`px-3 py-1.5 border rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors ${
                                isSpam
                                  ? 'bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold'
                                  : themeMode === 'dark' ? 'border-slate-800 text-slate-400 hover:bg-slate-800/40' : 'border-slate-200 text-slate-600 hover:bg-slate-550'
                              }`}
                            >
                              {isSpam ? 'Remove Spam Tag' : 'Mark Spam'}
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to suspend user ${r.authorName}? This will auto-spam all their reviews.`)) {
                                  setSuspendedUsers(prev => [...prev, r.authorName]);
                                  setReviews(prev => prev.map(item => item.authorName === r.authorName ? { ...item, status: 'spam' } : item));
                                  setSystemLogs(prev => [
                                    { time: new Date().toLocaleTimeString(), event: `SuperAdmin suspended user account: ${r.authorName}`, type: 'warning' },
                                    ...prev
                                  ]);
                                  alert(`User ${r.authorName} has been suspended.`);
                                }
                              }}
                              className="px-3 py-1.5 border border-purple-500/25 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors"
                            >
                              Suspend User
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm("Are you sure you want to permanently delete this review?")) {
                                  handleReviewAction(r._id, 'delete');
                                }
                              }}
                              className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 shadow-2xs transition-colors cursor-pointer border-none"
                              title="Delete Review"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 9: SUBSCRIPTIONS */}
              {activeTab === 'Subscriptions' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn">
                  <div className={`border shadow-xs rounded-[28px] p-6 ${
                    themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                  }`}>
                    <h3 className="font-extrabold text-base leading-tight font-sans">Active & Expired Premium Subscriptions</h3>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Overview of active premium subscription logs, renewal dates, and billing metrics.</span>
                  </div>

                  <div className={`overflow-x-auto border rounded-[28px] ${
                    themeMode === 'dark' ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <table className="w-full border-collapse text-left text-xs font-semibold text-slate-600">
                      <thead className={`uppercase text-[9px] font-black tracking-wider border-b ${
                        themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-450'
                      }`}>
                        <tr>
                          <th className="p-4.5">Business Name</th>
                          <th className="p-4.5">Plan Purchased</th>
                          <th className="p-4.5">Sales Amount</th>
                          <th className="p-4.5">Billing Expiry</th>
                          <th className="p-4.5">Status</th>
                          <th className="p-4.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y font-medium ${themeMode === 'dark' ? 'divide-slate-800' : 'divide-slate-100'}`}>
                        {subscriptions.map(s => (
                          <tr key={s._id} className={`transition-colors ${themeMode === 'dark' ? 'hover:bg-slate-900/30' : 'hover:bg-slate-50/50'}`}>
                            <td className={`p-4.5 font-extrabold text-xs sm:text-[13px] ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{s.businessName}</td>
                            <td className={`p-4.5 ${themeMode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{s.planType} Plan</td>
                            <td className={`p-4.5 font-bold ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>₹{s.amount}</td>
                            <td className={`p-4.5 ${themeMode === 'dark' ? 'text-slate-350' : 'text-slate-600'}`}>{new Date(s.expiryDate).toLocaleDateString()}</td>
                            <td className="p-4.5">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                                s.paymentStatus === 'Paid' 
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450' 
                                  : (s.paymentStatus === 'Refunded' ? 'bg-blue-500/10 border-blue-500/20 text-blue-450' : 'bg-red-500/10 border-red-500/20 text-red-550')
                              }`}>
                                {s.paymentStatus}
                              </span>
                            </td>
                            <td className="p-4.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {s.paymentStatus !== 'Paid' ? (
                                  <button
                                    onClick={async () => {
                                      try {
                                        const res = await fetch(`http://localhost:5000/api/superadmin/subscriptions/${s._id}/status`, {
                                          method: 'PUT',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${localStorage.getItem('ubt_token')}`
                                          },
                                          body: JSON.stringify({ status: 'active' })
                                        });
                                        if (res.ok) {
                                          alert("Subscription package plan activated successfully.");
                                          loadPlatformRealData();
                                        }
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-[#027244] hover:bg-[#005934] text-white rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors"
                                  >
                                    Activate
                                  </button>
                                ) : (
                                  <button
                                    onClick={async () => {
                                      try {
                                        const res = await fetch(`http://localhost:5000/api/superadmin/subscriptions/${s._id}/status`, {
                                          method: 'PUT',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${localStorage.getItem('ubt_token')}`
                                          },
                                          body: JSON.stringify({ status: 'expired' })
                                        });
                                        if (res.ok) {
                                          alert("Plan suspended successfully.");
                                          loadPlatformRealData();
                                        }
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-500 rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors"
                                  >
                                    Suspend
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    const biz = businesses.find(b => b.name === s.businessName);
                                    if (biz) {
                                      setSelectedBizForExtend(biz);
                                      setShowExtendSubModal(true);
                                    } else {
                                      alert("Manual business profile not found in local directories lists.");
                                    }
                                  }}
                                  className={`px-3 py-1.5 border rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors ${
                                    themeMode === 'dark' 
                                      ? 'border-slate-800 hover:bg-slate-800/40 text-slate-300' 
                                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                  }`}
                                >
                                  Extend
                                </button>
                                <button
                                  onClick={async () => {
                                    if (window.confirm(`Refund payment for ${s.businessName}?`)) {
                                      try {
                                        const res = await fetch(`http://localhost:5000/api/superadmin/subscriptions/${s._id}/refund`, {
                                          method: 'POST',
                                          headers: { 'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` }
                                        });
                                        if (res.ok) {
                                          alert("Payment refunded successfully.");
                                          loadPlatformRealData();
                                        }
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }
                                  }}
                                  disabled={s.paymentStatus === 'Refunded'}
                                  className="px-3 py-1.5 border border-purple-500/25 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors disabled:opacity-40"
                                >
                                  Refund
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 10: REVENUE */}
              {activeTab === 'Revenue' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn">
                  <div className={`border shadow-xs rounded-[28px] p-6 ${
                    themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                  }`}>
                    <h3 className="font-extrabold text-base leading-tight font-sans">Premium Billing Analytics</h3>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Monthly income growth and total listing subscriptions sales.</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
                    {/* SVG Premium Chart */}
                    <div className={`border rounded-[28px] p-6 shadow-sm flex flex-col gap-6 font-sans ${
                      themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Monthly Revenue Graph (₹)</span>
                        <span className="text-sm font-black text-[#027244]">Success rate: 98.6%</span>
                      </div>

                      <div className="w-full h-64 shrink-0 relative flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#027244" stopOpacity="0.4"/>
                              <stop offset="100%" stopColor="#027244" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                          {/* Area */}
                          <path d="M 0,200 L 0,160 Q 100,120 150,140 T 300,70 T 450,40 Q 480,30 500,45 L 500,200 Z" fill="url(#chartGrad)" />
                          {/* Line */}
                          <path d="M 0,160 Q 100,120 150,140 T 300,70 T 450,40 Q 480,30 500,45" stroke="#027244" strokeWidth="3" fill="none" />
                        </svg>
                        {/* Months labels */}
                        <div className={`absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[9px] font-extrabold uppercase tracking-wide py-1 ${
                          themeMode === 'dark' ? 'bg-slate-950/80 text-slate-400' : 'bg-white/80 text-slate-450'
                        }`}>
                          <span>Jan (₹15k)</span>
                          <span>Mar (₹35k)</span>
                          <span>May (₹75k)</span>
                          <span>Jul (₹115k)</span>
                          <span>Sep (₹145k)</span>
                        </div>
                      </div>
                    </div>

                    {/* Subscription Sales Bar Chart */}
                    <div className={`border rounded-[28px] p-6 shadow-sm flex flex-col gap-6 font-sans ${
                      themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Subscription Registrations (Plan ratio)</span>
                        <span className="text-sm font-black text-blue-500">Active Premium: {subscriptions.length}</span>
                      </div>

                      <div className="w-full h-64 shrink-0 relative flex items-end justify-around pb-6 pt-4">
                        {[
                          { label: 'Free Trial', val: 70, color: '#64748B' },
                          { label: 'Monthly Premium', val: 140, color: '#027244' },
                          { label: 'Yearly Super', val: 180, color: '#3B82F6' },
                          { label: 'Enterprise Custom', val: 40, color: '#8B5CF6' }
                        ].map((bar, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end w-12 sm:w-16">
                            <div className="text-[10px] font-black text-slate-400 mb-1">{bar.val} units</div>
                            <div 
                              className="w-8 sm:w-10 rounded-t-lg transition-all duration-500 hover:opacity-80"
                              style={{ 
                                height: `${(bar.val / 200) * 80}%`,
                                backgroundColor: bar.color,
                                boxShadow: `0 4px 12px ${bar.color}25`
                              }}
                            />
                            <span className="text-[9px] text-slate-400 font-extrabold text-center uppercase tracking-wide leading-tight mt-1">{bar.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 11: ANALYTICS */}
              {activeTab === 'Analytics' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn font-sans">
                  <div className={`border shadow-xs rounded-[28px] p-6 ${
                    themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                  }`}>
                    <h3 className="font-extrabold text-base leading-tight font-sans">Enterprise Platform Analytics</h3>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Category performance, locality view density ratios, and system active growth stats.</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
                    
                    {/* Category performance */}
                    <div className={`border rounded-[28px] p-6 shadow-sm flex flex-col gap-4 font-sans ${
                      themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                    }`}>
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Category breakdown ratio</h4>
                      <div className="flex flex-col gap-3.5 mt-2">
                        {[
                          { name: 'Food & Drinks', percentage: '60%', bg: 'bg-emerald-500' },
                          { name: 'Home Services', percentage: '45%', bg: 'bg-blue-500' },
                          { name: 'Resorts & Hotels', percentage: '30%', bg: 'bg-purple-500' },
                          { name: 'Shops & Stores', percentage: '20%', bg: 'bg-amber-500' }
                        ].map((cat, idx) => (
                          <div key={idx} className="flex flex-col gap-1 text-[11px] font-bold">
                            <div className="flex justify-between">
                              <span>{cat.name}</span>
                              <span className={themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'}>{cat.percentage}</span>
                            </div>
                            <div className={`h-1.5 w-full rounded-full overflow-hidden ${
                              themeMode === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                            }`}>
                              <div className={`h-full ${cat.bg} rounded-full`} style={{ width: cat.percentage }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Local traffic traffic */}
                    <div className={`border rounded-[28px] p-6 shadow-sm flex flex-col gap-4 font-sans ${
                      themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                    }`}>
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Locality view density</h4>
                      <div className="flex flex-col gap-3.5 mt-2">
                        {[
                          { name: 'Gandhi Nagar', percentage: '80%', bg: 'bg-emerald-500' },
                          { name: 'Pollachi Road', percentage: '65%', bg: 'bg-blue-500' },
                          { name: 'Dharapuram Road', percentage: '40%', bg: 'bg-purple-500' },
                          { name: 'Dhali Town', percentage: '15%', bg: 'bg-amber-500' }
                        ].map((loc, idx) => (
                          <div key={idx} className="flex flex-col gap-1 text-[11px] font-bold">
                            <div className="flex justify-between">
                              <span>{loc.name}</span>
                              <span className={themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'}>{loc.percentage}</span>
                            </div>
                            <div className={`h-1.5 w-full rounded-full overflow-hidden ${
                              themeMode === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                            }`}>
                              <div className={`h-full ${loc.bg} rounded-full`} style={{ width: loc.percentage }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Business Growth Line Graph */}
                    <div className={`border rounded-[28px] p-6 shadow-sm flex flex-col gap-4 font-sans ${
                      themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                    }`}>
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Monthly Registration Growth</h4>
                      <div className="w-full h-48 relative flex items-end mt-2">
                        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4"/>
                              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                          <path d="M 0,200 L 0,180 Q 80,150 160,110 T 320,60 T 480,20 L 500,25 L 500,200 Z" fill="url(#growthGrad)" />
                          <path d="M 0,180 Q 80,150 160,110 T 320,60 T 480,20 L 500,25" stroke="#3B82F6" strokeWidth="2.5" fill="none" />
                        </svg>
                        <div className={`absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[8px] font-extrabold uppercase tracking-wider py-1 ${
                          themeMode === 'dark' ? 'bg-slate-950/80 text-slate-400' : 'bg-white/80 text-slate-450'
                        }`}>
                          <span>Q1 (+12)</span>
                          <span>Q2 (+28)</span>
                          <span>Q3 (+56)</span>
                          <span>Q4 (+110)</span>
                        </div>
                      </div>
                    </div>

                    {/* Platform active users and Traffic */}
                    <div className={`border rounded-[28px] p-6 shadow-sm flex flex-col gap-4 font-sans ${
                      themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                    }`}>
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Daily active user sessions</h4>
                      <div className="flex items-center gap-6 mt-1 mb-2">
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-emerald-500">1,420</span>
                          <span className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider">Daily Visitors</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-blue-500">8,950</span>
                          <span className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider">Monthly Views</span>
                        </div>
                      </div>
                      <div className="w-full h-32 relative flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                          <path d="M 0,180 Q 120,130 250,140 T 500,40" stroke="#10B981" strokeWidth="2.5" fill="none" />
                          <path d="M 0,120 Q 120,80 250,95 T 500,20" stroke="#3B82F6" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                        </svg>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 12: NOTIFICATIONS */}
              {activeTab === 'Notifications' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn">
                  
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 text-[#001c41] font-sans">
                    <h3 className="font-extrabold text-base leading-tight">Broadcast Announcements Console</h3>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Broadcast Global Announcements, Maintenance warnings, or Expiry alerts to all registered business owners instantly.</span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm max-w-2xl text-[#001c41] font-sans flex flex-col gap-5">
                    {noticeSuccess && (
                      <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-2xl p-4 text-xs font-bold animate-fadeIn">
                        ✓ Broadcast notice dispatched successfully to all active merchant dashboards.
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Alert Category</label>
                      <select 
                        value={newNotice.type}
                        onChange={(e) => setNewNotice({ ...newNotice, type: e.target.value })}
                        className="w-full border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20"
                      >
                        <option value="announcement">Global Announcement</option>
                        <option value="maintenance">Maintenance Warning</option>
                        <option value="billing">Subscription Billing Reminder</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subject Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Scheduled System Upgrade Tonight"
                        value={newNotice.title}
                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                        className="w-full border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/20 focus:outline-none focus:border-[#027244]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Notification Body Message</label>
                      <textarea 
                        rows={4}
                        placeholder="Detail the announcement details inside town limits..."
                        value={newNotice.message}
                        onChange={(e) => setNewNotice({ ...newNotice, message: e.target.value })}
                        className="w-full border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/20 focus:outline-none focus:border-[#027244] resize-none leading-relaxed"
                      />
                    </div>

                    <button 
                      onClick={async () => {
                        if (!newNotice.title || !newNotice.message) return;
                        try {
                          const res = await fetch('http://localhost:5000/api/superadmin/broadcast', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${localStorage.getItem('ubt_token')}`
                            },
                            body: JSON.stringify({
                              title: newNotice.title,
                              message: newNotice.message,
                              type: newNotice.type
                            })
                          });
                          if (res.ok) {
                            setNoticeSuccess(true);
                            setNewNotice({ title: '', message: '', type: 'announcement' });
                            setTimeout(() => setNoticeSuccess(false), 4000);
                            loadPlatformRealData();
                          }
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      disabled={!newNotice.title || !newNotice.message}
                      className="py-3 px-6 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      Broadcast Message
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 13: PLATFORM SETTINGS */}
              {activeTab === 'Platform Settings' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn">
                  
                  {/* Tab header */}
                  <div className={`border shadow-xs rounded-[28px] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                    themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                  }`}>
                    <div className="flex flex-col text-left">
                      <h3 className="font-extrabold text-base leading-tight font-sans">UBT Platform Customizer</h3>
                      <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Adjust banners, customize directory layouts, manage fields requirements, and pricing models.</span>
                    </div>

                    {/* Sub tabs list */}
                    <div className="bg-slate-950/25 backdrop-blur-xs p-1 rounded-xl flex items-center border border-slate-800/30 font-sans overflow-x-auto max-w-full">
                      {[
                        { id: 'plans', label: 'Subscription Plans' },
                        { id: 'banners', label: 'Home Banners' },
                        { id: 'layouts', label: 'Page Layouts' },
                        { id: 'fields', label: 'Submission Fields' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setPlatformSubTab(tab.id)}
                          className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                            platformSubTab === tab.id
                              ? 'bg-[#027244] text-white shadow-sm shadow-emerald-950/15'
                              : 'text-slate-450 hover:text-slate-200'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sub-tab 1: Plans */}
                  {platformSubTab === 'plans' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans animate-fadeIn">
                      
                      {/* Subscription Pricing Adjustment */}
                      <div className={`lg:col-span-2 border rounded-[28px] p-6 shadow-sm flex flex-col gap-5 ${
                        themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                      }`}>
                        <div>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">Active Subscription Plans & Special Offers</h4>
                          <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Directly customize pricing structures, benefits tiers, and active promotional campaigns.</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {plans.map(p => (
                            <div key={p.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 bg-slate-50/30 dark:bg-slate-950/20 text-left flex flex-col justify-between gap-3 relative overflow-hidden">
                              {p.isOffer && (
                                <div className="absolute top-0 right-0 bg-amber-500 text-[8px] font-black text-slate-950 px-2 py-0.5 rounded-bl-lg uppercase tracking-wider select-none">
                                  {p.offerText || 'Special Offer'}
                                </div>
                              )}
                              <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-center pr-12">
                                  <span className={`font-black text-sm ${themeMode === 'dark' ? 'text-white' : 'text-slate-855'}`}>{p.name}</span>
                                </div>
                                <span className="text-[8.5px] uppercase font-black tracking-widest text-[#027244] bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-lg select-none self-start mt-1">{p.duration}</span>
                              </div>
                              <div className="flex flex-col gap-1.5 mt-1">
                                <label className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wide">Plan Price (₹)</label>
                                <input 
                                  type="number"
                                  value={p.price}
                                  onChange={(e) => handlePriceUpdate(p.id, e.target.value)}
                                  className="border border-slate-200 dark:border-slate-800 p-2 rounded-lg text-xs bg-white dark:bg-slate-900 focus:outline-none focus:border-[#027244] text-slate-805 dark:text-slate-205 font-black"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={async () => {
                                  if (!window.confirm(`Are you sure you want to remove/deactivate the plan "${p.name}"?`)) return;
                                  try {
                                    const res = await fetch(`http://localhost:5000/api/plans/${p.id}`, {
                                      method: 'DELETE',
                                      headers: {
                                        'Authorization': `Bearer ${localStorage.getItem('ubt_token')}`
                                      }
                                    });
                                    const data = await res.json();
                                    if (data.success) {
                                      alert(data.message);
                                      fetchPlans();
                                    } else {
                                      throw new Error(data.message);
                                    }
                                  } catch (err) {
                                    alert('Offline Simulation: Plan deactivated successfully.');
                                    setPlans(prev => prev.filter(item => item.id !== p.id));
                                  }
                                }}
                                className="text-red-500 hover:text-red-600 font-extrabold text-[9px] uppercase tracking-wider self-end mt-2 cursor-pointer transition-colors"
                              >
                                Deactivate / Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Register New Plan Form */}
                      <div className={`border rounded-[28px] p-6 shadow-sm flex flex-col gap-5 ${
                        themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                      }`}>
                        <div>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">Create Custom Plan / Offer</h4>
                          <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Deploy new subscription options or specialized offer campaigns for directory listings.</span>
                        </div>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!newPlan.name || !newPlan.price) return;
                            
                            const durationDays = parseInt(newPlan.duration) || 30;
                            const payload = {
                              name: newPlan.name,
                              type: newPlan.type || 'Custom',
                              price: Number(newPlan.price),
                              durationDays,
                              isOffer: !!newPlan.isOffer,
                              offerText: newPlan.offerText,
                              features: ['Premium Placement Badge', 'WhatsApp Button Link Active', 'UDT Verification Priority']
                            };

                            const submitPlan = async () => {
                              try {
                                const res = await fetch('http://localhost:5000/api/plans', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('ubt_token')}`
                                  },
                                  body: JSON.stringify(payload)
                                });
                                const data = await res.json();
                                if (data.success) {
                                  alert(`Subscription plan "${newPlan.name}" created successfully in database!`);
                                  fetchPlans();
                                } else {
                                  throw new Error(data.message);
                                }
                              } catch (err) {
                                console.warn('API error creating plan, adding locally.', err);
                                const customId = 'plan_' + Date.now();
                                setPlans(prev => [
                                  ...prev,
                                  { 
                                    id: customId, 
                                    name: newPlan.name, 
                                    price: Number(newPlan.price), 
                                    duration: newPlan.duration,
                                    type: newPlan.type || 'Custom',
                                    isOffer: !!newPlan.isOffer,
                                    offerText: newPlan.offerText,
                                    isActive: true
                                  }
                                ]);
                                alert(`Offline Simulation: Plan "${newPlan.name}" added successfully.`);
                              }
                            };
                            submitPlan();

                            setSystemLogs(prev => [
                              { time: new Date().toLocaleTimeString(), event: `SuperAdmin generated plan: "${newPlan.name}" for ₹${newPlan.price}`, type: 'info' },
                              ...prev
                            ]);
                            setNewPlan({ name: '', price: '', duration: '30 Days', type: 'Custom', isOffer: false, offerText: '' });
                          }}
                          className="flex flex-col gap-3.5 text-left"
                        >
                          <div className="flex flex-col gap-1">
                            <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest">Plan Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Quarterly Pro Boost"
                              value={newPlan.name}
                              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                              className="border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:border-[#027244] text-slate-800 dark:text-slate-200 font-semibold"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest">Price (₹) *</label>
                              <input
                                type="number"
                                required
                                placeholder="1499"
                                value={newPlan.price}
                                onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                                className="border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:border-[#027244] text-slate-805 dark:text-slate-205 font-black"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest">Duration *</label>
                              <select
                                value={newPlan.duration}
                                onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
                                className="border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:border-[#027244] text-slate-800 dark:text-slate-200 cursor-pointer font-bold"
                              >
                                <option value="15 Days">15 Days</option>
                                <option value="28 Days">28 Days (Monthly cycle)</option>
                                <option value="30 Days">30 Days</option>
                                <option value="90 Days">90 Days</option>
                                <option value="180 Days">180 Days</option>
                                <option value="365 Days">365 Days</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                            <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest">Plan Access Category</label>
                            <select
                              value={newPlan.type || 'Custom'}
                              onChange={(e) => setNewPlan({ ...newPlan, type: e.target.value })}
                              className="border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:border-[#027244] text-slate-800 dark:text-slate-200 cursor-pointer font-bold"
                            >
                              <option value="Custom">Custom Option Plan</option>
                              <option value="Monthly">Monthly Premium Override</option>
                              <option value="Yearly">Yearly Premium Override</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black leading-none">Publish as Special Offer</span>
                                <span className="text-[8.5px] text-slate-400 mt-1">Highlights this plan with a promotional ribbon badge.</span>
                              </div>
                              <input 
                                type="checkbox"
                                checked={!!newPlan.isOffer}
                                onChange={(e) => setNewPlan({ ...newPlan, isOffer: e.target.checked })}
                                className="h-4.5 w-4.5 text-[#027244] border-slate-300 focus:ring-[#027244] rounded-sm cursor-pointer"
                              />
                            </div>
                            {newPlan.isOffer && (
                              <div className="flex flex-col gap-1 mt-1 animate-fadeIn">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Offer Tag/Badge Text</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Save 20% Today"
                                  value={newPlan.offerText || ''}
                                  onChange={(e) => setNewPlan({ ...newPlan, offerText: e.target.value })}
                                  className="border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:border-[#027244] text-slate-800 dark:text-slate-200 font-semibold"
                                />
                              </div>
                            )}
                          </div>

                          <button
                            type="submit"
                            className="py-2.5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-colors shadow-md mt-1"
                          >
                            Deploy Plan / Offer
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Sub-tab 2: Home Banners */}
                  {platformSubTab === 'banners' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans animate-fadeIn">
                      
                      {/* Banner list layout */}
                      <div className={`lg:col-span-2 border rounded-[28px] p-6 shadow-sm flex flex-col gap-5 ${
                        themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                      }`}>
                        <div>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">Home Carousel Banner Slides</h4>
                          <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Toggle banner visibility or delete obsolete sliders.</span>
                        </div>
                        <div className="flex flex-col gap-4.5">
                          {banners.map(b => (
                            <div key={b.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 bg-slate-50/30 dark:bg-slate-950/20">
                              <div className="h-20 w-32 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0 shadow-2xs">
                                <img src={b.image} className="h-full w-full object-cover" alt={b.title} />
                              </div>
                              <div className="flex-1 flex flex-col text-left">
                                <div className="flex items-center gap-2">
                                  <span className={`font-black text-xs ${themeMode === 'dark' ? 'text-white' : 'text-slate-855'}`}>{b.title}</span>
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                    b.active ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20' : 'bg-slate-500/15 text-slate-400 border border-slate-600/20'
                                  }`}>
                                    {b.active ? 'Visible' : 'Hidden'}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1 leading-normal font-semibold max-w-md truncate">{b.subtitle}</span>
                                <span className="text-[8.5px] text-blue-505 font-bold mt-1">Link: {b.link}</span>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setBanners(prev => prev.map(item => item.id === b.id ? { ...item, active: !item.active } : item));
                                  }}
                                  className="px-2.5 py-1.5 border border-slate-350 dark:border-slate-800 rounded-xl font-extrabold text-[10px] hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer text-slate-500 dark:text-slate-300"
                                >
                                  {b.active ? 'Hide' : 'Show'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setBanners(prev => prev.filter(item => item.id !== b.id));
                                    setSystemLogs(prev => [
                                      { time: new Date().toLocaleTimeString(), event: `SuperAdmin deleted banner slide: "${b.title}"`, type: 'warning' },
                                      ...prev
                                    ]);
                                  }}
                                  className="px-2.5 py-1.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-500 rounded-xl font-extrabold text-[10px] cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Add new slide banner */}
                      <div className={`border rounded-[28px] p-6 shadow-sm flex flex-col gap-5 ${
                        themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                      }`}>
                        <div>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">Add Banner Slide</h4>
                          <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Publish dynamic slides onto the home page carousel header.</span>
                        </div>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!newBanner.title || !newBanner.image) return;
                            const nid = 'banner_' + Date.now();
                            setBanners(prev => [ ...prev, { ...newBanner, id: nid } ]);
                            setSystemLogs(prev => [
                              { time: new Date().toLocaleTimeString(), event: `SuperAdmin appended banner slide: "${newBanner.title}"`, type: 'info' },
                              ...prev
                            ]);
                            alert(`Banner slide "${newBanner.title}" added successfully!`);
                            setNewBanner({ title: '', image: '', subtitle: '', link: '/businesses', active: true });
                          }}
                          className="flex flex-col gap-3.5 text-left"
                        >
                          <div className="flex flex-col gap-1">
                            <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest">Banner Title *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Festival Season Offers in Udumalpet"
                              value={newBanner.title}
                              onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                              className="border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:border-[#027244] text-slate-805 dark:text-slate-205 font-bold"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest">Subtitle Overlay Message</label>
                            <input
                              type="text"
                              placeholder="e.g. Shop locally this Maari Amman kovil festival."
                              value={newBanner.subtitle}
                              onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                              className="border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:border-[#027244] text-slate-805 dark:text-slate-205 font-bold"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest">Banner Image URL *</label>
                            <input
                              type="text"
                              required
                              placeholder="https://images.unsplash.com/..."
                              value={newBanner.image}
                              onChange={(e) => setNewBanner({ ...newBanner, image: e.target.value })}
                              className="border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:border-[#027244] text-slate-805 dark:text-slate-205 font-semibold"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest">Action Link URL</label>
                            <input
                              type="text"
                              placeholder="/businesses?category=Shops"
                              value={newBanner.link}
                              onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                              className="border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:border-[#027244] text-slate-805 dark:text-slate-205 font-semibold"
                            />
                          </div>
                          <button
                            type="submit"
                            className="py-2.5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-colors shadow-md mt-1"
                          >
                            Publish Banner
                          </button>
                        </form>
                      </div>

                    </div>
                  )}

                  {/* Sub-tab 3: Page Layouts Customizer with live preview */}
                  {platformSubTab === 'layouts' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans animate-fadeIn text-left">
                      
                      {/* Theme Selector options */}
                      <div className={`border rounded-[28px] p-6 shadow-sm flex flex-col gap-5 ${
                        themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                      }`}>
                        <div>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">Accent Theme & Grid alignments</h4>
                          <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Toggle platform layout rules and color highlights.</span>
                        </div>

                        {/* Accent Theme color dots */}
                        <div className="flex flex-col gap-2">
                          <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest">Brand Accent Theme Highlight</label>
                          <div className="flex items-center gap-3.5 mt-1">
                            {[
                              { color: 'emerald', label: 'Emerald Green', hex: 'bg-emerald-500 ring-emerald-300' },
                              { color: 'blue', label: 'Cyber Blue', hex: 'bg-blue-500 ring-blue-300' },
                              { color: 'indigo', label: 'Royal Indigo', hex: 'bg-[#027244] ring-indigo-300' },
                              { color: 'purple', label: 'Mystic Violet', hex: 'bg-purple-500 ring-purple-300' }
                            ].map(theme => (
                              <button
                                key={theme.color}
                                type="button"
                                onClick={() => setPageLayout({ ...pageLayout, themeAccent: theme.color })}
                                className={`h-8 w-8 rounded-full border cursor-pointer transition-all ${theme.hex} ${
                                  pageLayout.themeAccent === theme.color
                                    ? 'ring-4 scale-110 border-white'
                                    : 'border-transparent opacity-75 hover:opacity-100 hover:scale-105'
                                }`}
                                title={theme.label}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Directory list align grid view options */}
                        <div className="flex flex-col gap-2.5">
                          <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest">Default Directory Layout Mode</label>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { id: 'grid', label: 'Masonry Grid' },
                              { id: 'list', label: 'Segment List' },
                              { id: 'compact', label: 'Compact Grid' }
                            ].map(mode => (
                              <button
                                key={mode.id}
                                type="button"
                                onClick={() => setPageLayout({ ...pageLayout, directoryLayout: mode.id })}
                                className={`py-2 px-3 border rounded-xl text-xs font-black cursor-pointer transition-colors text-center ${
                                  pageLayout.directoryLayout === mode.id
                                    ? 'bg-[#001c41] border-[#001c41] text-white'
                                    : themeMode === 'dark'
                                      ? 'border-slate-800 text-slate-400 hover:bg-slate-900/50'
                                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                                }`}
                              >
                                {mode.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Glassmorphism blur options */}
                        <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3">
                          <div className="flex flex-col text-left">
                            <span className="text-[11px] font-black leading-none">Glassmorphism Overlay Panels</span>
                            <span className="text-[9px] text-slate-400 mt-1 font-semibold">Enable smooth backdrop blur styling across components.</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPageLayout({ ...pageLayout, glassmorphism: !pageLayout.glassmorphism })}
                            className={`px-3 py-1.5 text-[10px] font-black rounded-lg cursor-pointer transition-colors ${
                              pageLayout.glassmorphism
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25'
                                : 'bg-slate-500/15 text-slate-400 border border-slate-500/10'
                            }`}
                          >
                            {pageLayout.glassmorphism ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                      </div>

                      {/* Live mock card preview matching layouts */}
                      <div className={`border rounded-[28px] p-6 shadow-sm flex flex-col gap-4.5 items-center justify-center ${
                        themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                      }`}>
                        <div className="text-left w-full">
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">Theme Preview (Live HUD)</h4>
                        </div>

                        {/* Interactive UI Mock Card */}
                        <div className={`w-full max-w-sm border rounded-3xl p-5 shadow-md flex flex-col gap-4 text-left transition-all ${
                          themeMode === 'dark' ? 'bg-[#0b111e]/90 border-slate-800/80' : 'bg-white border-slate-200'
                        } ${pageLayout.glassmorphism ? 'backdrop-blur-xs' : ''}`}>
                          <div className="h-32 w-full rounded-2xl overflow-hidden relative border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                            <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80" className="h-full w-full object-cover" alt="preview" />
                            <div className="absolute top-2.5 left-2.5">
                              <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-lg text-white shadow-xs select-none ${
                                pageLayout.themeAccent === 'emerald' ? 'bg-emerald-500' :
                                pageLayout.themeAccent === 'blue' ? 'bg-blue-500' :
                                pageLayout.themeAccent === 'indigo' ? 'bg-[#027244]' : 'bg-purple-500'
                              }`}>
                                Featured Profile
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <span className={`text-[10px] font-black uppercase tracking-wider ${
                              pageLayout.themeAccent === 'emerald' ? 'text-emerald-500' :
                              pageLayout.themeAccent === 'blue' ? 'text-blue-500' :
                              pageLayout.themeAccent === 'indigo' ? 'text-indigo-500' : 'text-purple-500'
                            }`}>
                              Resort & Hotels
                            </span>
                            <span className={`font-black text-sm leading-tight ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>Green Valley Resorts</span>
                            <span className="text-[10.5px] text-slate-400 mt-0.5">Thirumoorthi Hills, Udumalpet - 642112</span>
                          </div>

                          <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex text-amber-400 gap-0.5 text-xs">
                              ★ 4.8 <span className="text-[9.5px] text-slate-450">(98 Reviews)</span>
                            </div>
                            <button
                              type="button"
                              className={`py-1.5 px-3 rounded-lg text-[10px] font-black uppercase text-white cursor-default ${
                                pageLayout.themeAccent === 'emerald' ? 'bg-emerald-600' :
                                pageLayout.themeAccent === 'blue' ? 'bg-blue-600' :
                                pageLayout.themeAccent === 'indigo' ? 'bg-indigo-600' : 'bg-purple-600'
                              }`}
                            >
                              Explore →
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Sub-tab 4: Submission Fields Configuration ("informations getting page") */}
                  {platformSubTab === 'fields' && (
                    <div className="flex flex-col gap-6 text-left animate-fadeIn">
                      
                      {/* Form submission parameters table */}
                      <div className={`border rounded-[28px] p-6 shadow-sm flex flex-col gap-5 ${
                        themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                      }`}>
                        <div>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">Directory Registration Fields (Informations Getting page)</h4>
                          <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Toggle which informational variables are visible or required when merchants request a profile.</span>
                        </div>
                        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                          <table className="w-full text-left text-xs font-semibold text-slate-600 font-sans">
                            <thead className={`uppercase text-[9px] font-black tracking-wider border-b ${
                              themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                            }`}>
                              <tr>
                                <th className="p-4">Submission Parameter</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Required Parameter</th>
                                <th className="p-4 text-right">Interactive Toggles</th>
                              </tr>
                            </thead>
                            <tbody className={`divide-y font-medium ${themeMode === 'dark' ? 'divide-slate-800' : 'divide-slate-100'}`}>
                              {Object.entries(submissionFields).map(([key, field]) => (
                                <tr key={key} className={`transition-colors ${themeMode === 'dark' ? 'hover:bg-slate-900/20' : 'hover:bg-slate-50/50'}`}>
                                  <td className="p-4 font-bold">{field.label}</td>
                                  <td className="p-4">
                                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase ${
                                      field.enabled ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-500/15 text-slate-400 border border-slate-500/10'
                                    }`}>
                                      {field.enabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase ${
                                      field.required ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse' : 'bg-slate-500/15 text-slate-400 border border-slate-500/10'
                                    }`}>
                                      {field.required ? 'Required' : 'Optional'}
                                    </span>
                                  </td>
                                  <td className="p-4 text-right">
                                    <div className="flex justify-end items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSubmissionFields({
                                            ...submissionFields,
                                            [key]: { ...field, enabled: !field.enabled }
                                          });
                                        }}
                                        className={`px-3 py-1.5 text-[9.5px] font-black rounded-lg cursor-pointer transition-colors ${
                                          field.enabled 
                                            ? 'bg-rose-500/15 text-rose-500 hover:bg-rose-500/25'
                                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        }`}
                                      >
                                        {field.enabled ? 'Disable' : 'Enable'}
                                      </button>
                                      <button
                                        type="button"
                                        disabled={!field.enabled}
                                        onClick={() => {
                                          setSubmissionFields({
                                            ...submissionFields,
                                            [key]: { ...field, required: !field.required }
                                          });
                                        }}
                                        className="px-3 py-1.5 border border-slate-350 dark:border-slate-800 text-[9.5px] font-black rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-40"
                                      >
                                        Toggle Required
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Merchant guidelines information text */}
                      <div className={`border rounded-[28px] p-6 shadow-sm flex flex-col gap-4.5 ${
                        themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                      }`}>
                        <div>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">Form Guidelines Header Message</h4>
                          <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Specify instructions displayed on the top page header of the information entry page.</span>
                        </div>
                        <div className="flex flex-col gap-3">
                          <textarea
                            rows={4}
                            value={formGuidelines}
                            onChange={(e) => setFormGuidelines(e.target.value)}
                            className="w-full border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50/20 dark:bg-slate-900/50 focus:outline-none focus:border-[#027244] resize-none leading-relaxed"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSystemLogs(prev => [
                                { time: new Date().toLocaleTimeString(), event: `SuperAdmin adjusted form guideline tags: "${formGuidelines.substring(0, 30)}..."`, type: 'info' },
                                ...prev
                              ]);
                              alert("Information submission form guidelines updated successfully!");
                            }}
                            className="py-2.5 px-5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer self-start transition-colors"
                          >
                            Save Guidelines
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* TAB 14: SYSTEM LOGS */}
              {activeTab === 'System Logs' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn font-sans">
                  <div className={`border shadow-xs rounded-[28px] p-6 ${
                    themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                  }`}>
                    <h3 className="font-extrabold text-base leading-tight font-sans">Suspicious Events & Telemetry Logs</h3>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Inspect suspicious activity logs, API latency rates, and billing errors.</span>
                  </div>

                  <div className={`text-slate-300 border rounded-[28px] p-6 shadow-[0_0_35px_rgba(16,185,129,0.08)] flex flex-col gap-3 select-all max-h-[500px] overflow-y-auto leading-relaxed text-[11px] font-mono bg-[#030712] border-emerald-500/20`}>
                    <div className="text-slate-500 select-none pb-2 border-b border-slate-800/80 mb-2">root@ubt-server:~# journalctl -u ubt-service.service -n 100 --no-pager</div>
                    {systemLogs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <span className="text-slate-600 font-bold shrink-0">[{log.time}]</span>
                        <span className={
                          log.type === 'system' 
                            ? 'text-emerald-455 font-semibold' 
                            : log.type === 'warning' 
                              ? 'text-amber-400 font-semibold' 
                              : 'text-slate-350'
                        }>
                          {log.type === 'system' ? '⚙ SYSTEM: ' : (log.type === 'warning' ? '⚠ WARNING: ' : 'ℹ INFO: ')}
                          {log.event}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-start gap-4">
                      <span className="text-slate-600 font-bold shrink-0">[10:14:02]</span>
                      <span className="text-emerald-455 font-semibold">⚙ SYSTEM: API gateway operational and listening on PORT 5000</span>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="text-slate-600 font-bold shrink-0">[10:13:58]</span>
                      <span className="text-emerald-455 font-semibold">⚙ SYSTEM: MongoDB Atlas successfully established and synced</span>
                    </div>
                    <div className="flex gap-1 select-none items-center text-emerald-500 animate-pulse mt-2 pt-2 border-t border-slate-800/80">
                      <span>root@ubt-server:~#</span>
                      <span className="h-3.5 w-2 bg-emerald-450" />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 15: ACCESS CONTROL */}
              {activeTab === 'Access Control' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn">
                  <div className={`border shadow-xs rounded-[28px] p-6 ${
                    themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                  }`}>
                    <h3 className="font-extrabold text-base leading-tight font-sans">Role Permission Matrix</h3>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Toggle feature access boundaries and routing permissions for admins, superadmins, and business owners.</span>
                  </div>

                  <div className={`border rounded-[28px] p-6 font-sans overflow-x-auto ${
                    themeMode === 'dark' ? 'bg-slate-900/20 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                  }`}>
                    <table className="w-full border-collapse text-left text-xs font-semibold text-slate-600">
                      <thead className={`uppercase text-[9px] font-black tracking-wider border-b ${
                        themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-450'
                      }`}>
                        <tr>
                          <th className="p-4.5">Platform Module</th>
                          <th className="p-4.5 text-center">Super Admin</th>
                          <th className="p-4.5 text-center">Sub-Admin</th>
                          <th className="p-4.5 text-center">Business Owner</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y font-medium ${themeMode === 'dark' ? 'divide-slate-800' : 'divide-slate-100'}`}>
                        {[
                          { id: 'businesses', label: 'Directory Vetting & Auditing' },
                          { id: 'blogs', label: 'Blogs & Events Moderation' },
                          { id: 'events', label: 'Event Promotions Moderator' },
                          { id: 'subPlans', label: 'Adjust Subscription pricing/prices' },
                          { id: 'systemLogs', label: 'System Telemetry & Logs access' },
                          { id: 'accessControl', label: 'Modify Access Control permissions' }
                        ].map((module) => (
                          <tr key={module.id} className={`transition-colors ${themeMode === 'dark' ? 'hover:bg-slate-900/30' : 'hover:bg-slate-50/50'}`}>
                            <td className={`p-4.5 font-bold ${themeMode === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{module.label}</td>
                            <td className="p-4.5 text-center">
                              <CheckSquare className="h-4.5 w-4.5 text-emerald-600 mx-auto" />
                            </td>
                            <td className="p-4.5 text-center">
                              <input 
                                type="checkbox"
                                checked={permissionsMatrix.admin[module.id]}
                                onChange={(e) => {
                                  const updated = { ...permissionsMatrix.admin, [module.id]: e.target.checked };
                                  setPermissionsMatrix({ ...permissionsMatrix, admin: updated });
                                }}
                                className="h-4.5 w-4.5 text-[#027244] border-slate-300 dark:border-slate-700 rounded focus:ring-[#027244] cursor-pointer"
                              />
                            </td>
                            <td className="p-4.5 text-center">
                              <input 
                                type="checkbox"
                                checked={permissionsMatrix.owner[module.id]}
                                onChange={(e) => {
                                  const updated = { ...permissionsMatrix.owner, [module.id]: e.target.checked };
                                  setPermissionsMatrix({ ...permissionsMatrix, owner: updated });
                                }}
                                className="h-4.5 w-4.5 text-[#027244] border-slate-300 dark:border-slate-700 rounded focus:ring-[#027244] cursor-pointer"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 16: REPORTS */}
              {activeTab === 'Reports' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn">
                  <div className={`border shadow-xs rounded-[28px] p-6 ${
                    themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                  }`}>
                    <h3 className="font-extrabold text-base leading-tight font-sans">Growth & Audit Trends</h3>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Overview of platform registration stats, ratings counts, and verified listing ratios.</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                    <div className={`border rounded-[20px] p-5 shadow-2xs flex flex-col gap-3 ${
                      themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                    }`}>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Business Vetting Ratio</span>
                      <span className={`text-3xl font-black leading-none ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>80% Approved</span>
                      <div className={`h-2 w-full rounded-full overflow-hidden mt-1 ${themeMode === 'dark' ? 'bg-slate-850' : 'bg-slate-100'}`}>
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '80%' }} />
                      </div>
                    </div>
                    <div className={`border rounded-[20px] p-5 shadow-2xs flex flex-col gap-3 ${
                      themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                    }`}>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Premium Conversion Rate</span>
                      <span className={`text-3xl font-black leading-none ${themeMode === 'dark' ? 'text-emerald-450' : 'text-emerald-700'}`}>60% Boosted</span>
                      <div className={`h-2 w-full rounded-full overflow-hidden mt-1 ${themeMode === 'dark' ? 'bg-slate-850' : 'bg-slate-100'}`}>
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>
                    <div className={`border rounded-[20px] p-5 shadow-2xs flex flex-col gap-3 ${
                      themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                    }`}>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">purged reviews rate</span>
                      <span className={`text-3xl font-black leading-none ${themeMode === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>50% purges</span>
                      <div className={`h-2 w-full rounded-full overflow-hidden mt-1 ${themeMode === 'dark' ? 'bg-slate-850' : 'bg-slate-100'}`}>
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '50%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 17: SUPPORT TICKETS */}
              {activeTab === 'Support Tickets' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn">
                  <div className={`border shadow-xs rounded-[28px] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                    themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                  }`}>
                    <div className="flex flex-col text-left font-sans">
                      <h3 className="font-extrabold text-base leading-tight font-sans">Support & Queries Center</h3>
                      <span className="text-[10px] text-slate-400 font-semibold mt-1 block font-sans">Moderate merchant issues, billing failure disputes, customer messages, and support tickets.</span>
                    </div>
                    {/* Sub-tab Switcher */}
                    <div className="bg-slate-100/60 dark:bg-slate-950/60 p-1 rounded-xl flex items-center shrink-0 border border-slate-200/30">
                      <button
                        onClick={() => setSupportSubTab('tickets')}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          supportSubTab === 'tickets'
                            ? 'bg-[#027244] text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                        }`}
                      >
                        Merchant Tickets
                      </button>
                      <button
                        onClick={() => setSupportSubTab('queries')}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          supportSubTab === 'queries'
                            ? 'bg-[#027244] text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                        }`}
                      >
                        User Queries
                      </button>
                    </div>
                  </div>

                  {supportSubTab === 'tickets' ? (
                    <div className={`overflow-x-auto border rounded-[28px] ${
                      themeMode === 'dark' ? 'bg-slate-900/20 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                    }`}>
                      <table className="w-full border-collapse text-left text-xs font-semibold text-slate-600">
                        <thead className={`uppercase text-[9px] font-black tracking-wider border-b ${
                          themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-450'
                        }`}>
                          <tr>
                            <th className="p-4.5">Ticket ID</th>
                            <th className="p-4.5">User Address</th>
                            <th className="p-4.5">Issue Type</th>
                            <th className="p-4.5">Priority</th>
                            <th className="p-4.5">Status</th>
                            <th className="p-4.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y font-medium ${themeMode === 'dark' ? 'divide-slate-800' : 'divide-slate-100'}`}>
                          {supportTickets.map(t => (
                            <tr key={t._id} className={`transition-colors ${themeMode === 'dark' ? 'hover:bg-slate-900/30' : 'hover:bg-slate-50/50'}`}>
                              <td className={`p-4.5 font-extrabold text-xs sm:text-[13px] ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t._id}</td>
                              <td className={`p-4.5 ${themeMode === 'dark' ? 'text-slate-350' : 'text-slate-600'}`}>{t.user}</td>
                              <td className={`p-4.5 font-bold ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>{t.issueType}</td>
                              <td className="p-4.5">
                                <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase ${
                                  t.priority === 'High' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : (t.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/25')
                                }`}>
                                  {t.priority}
                                </span>
                              </td>
                              <td className="p-4.5">
                                <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase ${
                                  t.status === 'Open' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : (t.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20')
                                }`}>
                                  {t.status}
                                </span>
                              </td>
                              <td className="p-4.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => { setSelectedTicket(t); setShowTicketModal(true); }}
                                    className="px-3 py-1.5 bg-[#027244] hover:bg-[#005934] text-white rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors"
                                  >
                                    Reply
                                  </button>
                                  <button 
                                    onClick={() => handleTicketAction(t._id, 'Closed')}
                                    className={`px-3 py-1.5 border rounded-xl font-extrabold text-[10px] cursor-pointer transition-colors ${
                                      themeMode === 'dark' 
                                        ? 'border-slate-800 hover:bg-slate-800/40 text-slate-300' 
                                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                    }`}
                                  >
                                    Close
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6 font-sans">
                      {/* Tabs for query filter */}
                      <div className={`border shadow-xs rounded-[28px] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                        themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                      }`}>
                        <div className="flex flex-col text-left font-sans">
                          <h3 className="font-extrabold text-sm uppercase tracking-wider">User Queries Inbox</h3>
                          <span className="text-[10px] text-slate-400 font-semibold mt-1">Filter and view specific visitor messages and inquiries.</span>
                        </div>
                        <div className="bg-slate-100/60 dark:bg-slate-950/60 p-1 rounded-xl flex items-center shrink-0 border border-slate-200/30">
                          {['All', 'Pending', 'Replied'].map(status => (
                            <button
                              key={status}
                              onClick={() => setQueryFilter(status)}
                              className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                queryFilter === status
                                  ? 'bg-[#027244] text-white shadow-sm'
                                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
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
                          .map((q) => {
                            const isPending = q.status === 'Pending';
                            return (
                              <div
                                key={q._id}
                                className={`border shadow-sm hover:shadow-lg rounded-[28px] p-6 flex flex-col md:flex-row justify-between gap-6 transition-all ${
                                  themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
                                }`}
                              >
                                <div className="flex-1 flex flex-col gap-3">
                                  <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-3 ${
                                    themeMode === 'dark' ? 'border-slate-800' : 'border-slate-100'
                                  }`}>
                                    <div className="flex items-center gap-3">
                                      <div className={`h-9 w-9 rounded-full border flex items-center justify-center font-black text-xs shrink-0 ${
                                        themeMode === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-emerald-50 border-emerald-100 text-[#027244]'
                                      }`}>
                                        {q.name.charAt(0).toUpperCase()}
                                      </div>
                                      <div className="flex flex-col text-left">
                                        <span className={`font-extrabold text-xs sm:text-[13px] leading-tight ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{q.name}</span>
                                        <span className="text-[10px] text-slate-400 font-semibold mt-1 block">{q.email}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-[10.5px] text-slate-400 font-semibold flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        {new Date(q.createdAt).toLocaleString()}
                                      </span>
                                      <span className={`px-2.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border ${
                                        isPending ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                      }`}>
                                        {q.status}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="text-left flex flex-col gap-1.5 font-sans">
                                    <span className={`font-extrabold text-[13px] ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>{q.subject}</span>
                                    <p className={`text-xs font-semibold leading-relaxed mt-1 text-justify max-w-4xl ${themeMode === 'dark' ? 'text-slate-350' : 'text-slate-505'}`}>{q.message}</p>
                                  </div>

                                  {!isPending && q.replyMessage && (
                                    <div className={`border rounded-2xl p-4 text-left flex flex-col gap-2 mt-2 ${
                                      themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200/60'
                                    }`}>
                                      <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                        <span>✓ Admin Response</span>
                                        <span>{q.repliedAt ? new Date(q.repliedAt).toLocaleString() : ''}</span>
                                      </div>
                                      <p className={`text-xs font-bold leading-relaxed ${themeMode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{q.replyMessage}</p>
                                    </div>
                                  )}
                                </div>

                                <div className={`flex md:flex-col justify-end md:justify-center gap-2 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-5 shrink-0 md:w-36 font-sans ${
                                  themeMode === 'dark' ? 'border-slate-800' : 'border-slate-200'
                                }`}>
                                  {isPending ? (
                                    <button
                                      onClick={() => { setSelectedQuery(q); setShowReplyModal(true); }}
                                      className="w-full py-2 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                                    >
                                      <Mail className="h-3.5 w-3.5" />
                                      <span>Send Reply</span>
                                    </button>
                                  ) : (
                                    <span className={`w-full py-2 border font-extrabold text-[10px] rounded-xl flex items-center justify-center select-none text-center ${
                                      themeMode === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400 border-slate-200'
                                    }`}>
                                      Replied
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 18: PROFILE SETTINGS */}
              {activeTab === 'Profile Settings' && (
                <div className="flex flex-col gap-6 text-left animate-fadeIn">
                  <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 text-[#001c41] font-sans">
                    <h3 className="font-extrabold text-base leading-tight">Super Admin Profile Settings</h3>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Manage your login email credentials and secure password keys.</span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm max-w-xl text-[#001c41] font-sans flex flex-col gap-5">
                    <div className="flex flex-col gap-1 text-[11px] font-bold">
                      <span>Full Name</span>
                      <input 
                        type="text"
                        defaultValue={user?.fullName || 'Super Administrator'}
                        className="border border-slate-200 p-2.5 rounded-xl text-xs bg-slate-50 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1 text-[11px] font-bold">
                      <span>Contact Email Address</span>
                      <input 
                        type="email"
                        defaultValue={user?.email || 'superadmin@gmail.com'}
                        className="border border-slate-200 p-2.5 rounded-xl text-xs bg-slate-50 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1 text-[11px] font-bold">
                      <span>Change Password</span>
                      <input 
                        type="password"
                        placeholder="••••••••"
                        className="border border-slate-200 p-2.5 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#027244]"
                      />
                    </div>
                    <button 
                      onClick={() => alert('Credentials updated successfully!')}
                      className="py-3 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer mt-2"
                    >
                      Update Profile
                    </button>
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
          <div className={`w-full max-w-lg h-full shadow-2xl flex flex-col justify-between animate-slideLeft text-left font-sans ${
            themeMode === 'dark' ? 'bg-[#090D1C] text-slate-100 border-l border-slate-800' : 'bg-white text-[#001c41] border-l border-slate-200'
          }`}>
            
            {/* Modal Header */}
            <div className={`p-6 border-b flex justify-between items-center shrink-0 ${
              themeMode === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vetting Workspace</span>
                <h3 className={`font-extrabold text-base leading-tight mt-1 ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>
                  {selectedBiz.name}
                </h3>
              </div>
              <button 
                onClick={() => { setSelectedBiz(null); setShowBizModal(false); }}
                className={`h-8.5 w-8.5 rounded-full border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  themeMode === 'dark' ? 'border-slate-800 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-550 hover:bg-slate-100'
                }`}
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 font-sans">
              
              {/* Cover Image & Gallery Grid */}
              <div className="flex flex-col gap-2">
                <div className="h-44 bg-slate-100 rounded-3xl overflow-hidden shrink-0 border border-slate-200/50 relative">
                  <img src={selectedBiz.coverImageUrl} className="h-full w-full object-cover" alt={selectedBiz.name} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=150&q=80",
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&q=80",
                    "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=150&q=80"
                  ].map((url, i) => (
                    <div key={i} className="h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/20">
                      <img src={url} className="h-full w-full object-cover hover:scale-105 transition-transform cursor-pointer" alt="Preview" />
                    </div>
                  ))}
                </div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider text-right">Uploaded Shop Photos (3)</span>
              </div>

              {/* Owner Contact */}
              <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${
                themeMode === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Registered Owner Details</span>
                <div className="flex flex-col gap-2 text-xs font-semibold text-slate-400">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-500" />
                    <span className={themeMode === 'dark' ? 'text-slate-200' : 'text-slate-700'}>{selectedBiz.ownerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-500" />
                    <a href={`tel:${selectedBiz.phone}`} className="hover:underline text-blue-500 font-extrabold">{selectedBiz.phone || '+91 98945 43100'}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-500" />
                    <a href={`mailto:${selectedBiz.ownerEmail}`} className="hover:underline text-blue-500 font-extrabold">{selectedBiz.ownerEmail}</a>
                  </div>
                </div>
                {selectedBiz.ownerEmail && (
                  <button
                    onClick={() => {
                      setActiveTab('Merchants');
                      setSearchQuery(selectedBiz.ownerEmail);
                      setMerchantUserFilter('merchants');
                      setShowBizModal(false);
                      setSelectedBiz(null);
                    }}
                    className="mt-2 w-full py-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-[#027244] font-extrabold text-[10px] rounded-xl transition-all cursor-pointer text-center uppercase tracking-wider border border-emerald-500/20 flex items-center justify-center gap-1.5"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>Manage Owner User Profile</span>
                  </button>
                )}
              </div>

              {/* Category Information / Vetting Panel */}
              {selectedBiz.categoryStatus === 'Pending Review' && (
                <div className={`p-5 rounded-3xl border flex flex-col gap-4 shadow-sm relative overflow-hidden transition-all text-left ${
                  themeMode === 'dark' 
                    ? 'bg-slate-900/60 border-amber-500/25 bg-gradient-to-br from-amber-500/5 to-transparent' 
                    : 'bg-amber-500/5 border-amber-500/20'
                }`}>
                  <div className="flex items-center gap-2 border-b border-amber-500/10 pb-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none">Category Vetting Panel</span>
                      <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Merchant is requesting a custom category</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-400">
                    <div className="flex flex-col gap-0.5">
                      <span>Current Category</span>
                      <span className={`text-sm font-extrabold ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                        {selectedBiz.category || 'Others'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span>Requested Category</span>
                      <span className="text-sm font-extrabold text-amber-500 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        {selectedBiz.customCategoryName}
                      </span>
                    </div>
                  </div>

                  {/* Suggested Matches */}
                  <div className="flex flex-col gap-1.5 border-t border-slate-200/10 pt-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none">Suggested Matches</span>
                    <div className="flex flex-col gap-1.5 mt-1">
                      {getSuggestedMatches(selectedBiz.customCategoryName).length > 0 ? (
                        getSuggestedMatches(selectedBiz.customCategoryName).map(cat => (
                          <div key={cat._id} className={`flex items-center justify-between p-2 rounded-xl border text-xs font-semibold ${
                            themeMode === 'dark' ? 'bg-slate-950/40 border-slate-850 hover:bg-slate-950/60' : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-500/80 shrink-0">
                                {renderIconByName(cat.icon, "h-4 w-4")}
                              </span>
                              <span className={themeMode === 'dark' ? 'text-slate-200' : 'text-slate-700'}>{cat.categoryName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded-lg font-black uppercase">
                                Match
                              </span>
                              <button
                                onClick={() => handleResolveCategory(selectedBiz._id, 'assign', cat._id)}
                                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] rounded-lg cursor-pointer transition-colors uppercase tracking-wider shadow shadow-emerald-800/10"
                              >
                                Assign
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 italic">No similar preset categories found using fuzzy logic.</span>
                      )}
                    </div>
                  </div>

                  {/* Actions Accordion/Tabs */}
                  <div className="flex flex-col gap-2 border-t border-slate-200/10 pt-3 text-xs">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">Actions Workspace</span>
                    
                    {/* Option 1: Assign Existing */}
                    <div className={`p-3 rounded-2xl border flex flex-col gap-2 ${
                      themeMode === 'dark' ? 'bg-slate-950/30 border-slate-805' : 'bg-slate-50 border-slate-200/60'
                    }`}>
                      <div className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400">1. Assign Existing Category</div>
                      <div className="flex gap-2">
                        <select
                          value={selectedPresetForAssign}
                          onChange={(e) => setSelectedPresetForAssign(e.target.value)}
                          className={`flex-1 text-xs rounded-xl px-3 py-2 outline-none font-bold ${
                            themeMode === 'dark' ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-800'
                          }`}
                        >
                          <option value="">-- Choose Category --</option>
                          {presetCategories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                          ))}
                        </select>
                        <button
                          disabled={!selectedPresetForAssign}
                          onClick={() => handleResolveCategory(selectedBiz._id, 'assign', selectedPresetForAssign)}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer disabled:opacity-40 transition-colors uppercase tracking-wider"
                        >
                          Assign
                        </button>
                      </div>
                    </div>

                    {/* Option 2: Create New Category */}
                    <div className={`p-3 rounded-2xl border flex flex-col gap-2.5 ${
                      themeMode === 'dark' ? 'bg-slate-950/30 border-slate-805' : 'bg-slate-50 border-slate-200/60'
                    }`}>
                      <div className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400">2. Create New Category</div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Category Name"
                            value={customNewCategoryName}
                            onChange={(e) => {
                              setCustomNewCategoryName(e.target.value);
                              setCustomNewCategoryIcon(mapKeywordToIcon(e.target.value));
                            }}
                            className={`flex-1 text-xs rounded-xl px-3 py-2 outline-none font-bold ${
                              themeMode === 'dark' ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-800'
                            }`}
                          />
                          <select
                            value={customNewCategoryIcon}
                            onChange={(e) => setCustomNewCategoryIcon(e.target.value)}
                            className={`w-32 text-xs rounded-xl px-2 py-2 outline-none font-bold ${
                              themeMode === 'dark' ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-800'
                            }`}
                          >
                            {['Utensils', 'Activity', 'Dumbbell', 'Plane', 'GraduationCap', 'Camera', 'Leaf', 'Building', 'Coins', 'ShoppingBag', 'Sparkles', 'Wrench', 'Store'].map(ico => (
                              <option key={ico} value={ico}>{ico}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold px-1">
                          <span className="flex items-center gap-1">
                            Suggested Icon: 
                            <span className="text-amber-500 flex items-center gap-1 font-extrabold uppercase">
                              {renderIconByName(customNewCategoryIcon, "h-3.5 w-3.5 inline")} 
                              {customNewCategoryIcon}
                            </span>
                          </span>
                        </div>
                        <button
                          disabled={!customNewCategoryName.trim()}
                          onClick={() => handleResolveCategory(selectedBiz._id, 'create', null, customNewCategoryName, customNewCategoryIcon)}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer disabled:opacity-40 transition-colors uppercase tracking-wider"
                        >
                          Create & Link Category
                        </button>
                      </div>
                    </div>

                    {/* Option 3: Merge Category */}
                    <div className={`p-3 rounded-2xl border flex flex-col gap-2 ${
                      themeMode === 'dark' ? 'bg-slate-950/30 border-slate-805' : 'bg-slate-50 border-slate-200/60'
                    }`}>
                      <div className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400">3. Merge With Existing Category</div>
                      <div className="flex gap-2">
                        <select
                          value={selectedPresetForMerge}
                          onChange={(e) => setSelectedPresetForMerge(e.target.value)}
                          className={`flex-1 text-xs rounded-xl px-3 py-2 outline-none font-bold ${
                            themeMode === 'dark' ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-800'
                          }`}
                        >
                          <option value="">-- Choose Category to Merge --</option>
                          {presetCategories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                          ))}
                        </select>
                        <button
                          disabled={!selectedPresetForMerge}
                          onClick={() => handleResolveCategory(selectedBiz._id, 'merge', selectedPresetForMerge)}
                          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer disabled:opacity-40 transition-colors uppercase tracking-wider"
                        >
                          Merge
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Google Place Details */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none border-b border-slate-200/20 pb-1">Google Places Info</span>
                <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-400">
                  <div className="flex flex-col gap-0.5">
                    <span>Google Star Rating</span>
                    <span className={`text-sm font-black flex items-center gap-1 ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>
                      ★ {selectedBiz.googleRating || '4.5'}
                      <span className="text-slate-400 font-semibold text-[10px]">({selectedBiz.googleReviewsCount || '22'} reviews)</span>
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span>Google Place ID</span>
                    <span className="text-[10px] font-mono bg-slate-500/10 border border-slate-500/20 rounded px-1.5 py-0.5 w-fit leading-normal truncate max-w-full text-blue-500">
                      {selectedBiz.googlePlaceId || 'ChIJRKElectricals'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address Validation & Coordinates */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none border-b border-slate-200/20 pb-1">Coordinates & Address Validation</span>
                <div className="flex flex-col gap-2 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>Validation Status</span>
                    <span className="bg-emerald-500/15 text-emerald-500 text-[8px] font-black uppercase px-2 py-0.5 rounded-lg border border-emerald-500/25">
                      Coordinates Match Verified
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Locality Boundary</span>
                    <span className={themeMode === 'dark' ? 'text-slate-200' : 'text-slate-700'}>{selectedBiz.locality} (Pincode {selectedBiz.pincode})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Map Coordinates</span>
                    <span className="font-mono text-[10.5px] text-blue-500 font-bold">10.5844° N, 77.2474° E (Udumalpet)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Street Address</span>
                    <span className={`text-right max-w-[200px] leading-tight ${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                      {selectedBiz.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* GST & Year Established */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none border-b border-slate-200/20 pb-1">Taxation & Registration</span>
                <div className="flex flex-col gap-2 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>GSTIN Details</span>
                    <span className={`font-mono font-bold tracking-wider ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>
                      {selectedBiz.gstNumber || '33ABCDE1234F1Z5'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year Established</span>
                    <span className={themeMode === 'dark' ? 'text-slate-200' : 'text-slate-700'}>{selectedBiz.yearEstablished || '2012'}</span>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none border-b border-slate-200/20 pb-1">Daily Operations Timings</span>
                <div className={`p-4.5 rounded-2xl border flex flex-col gap-2 text-xs font-semibold ${
                  themeMode === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex justify-between border-b border-slate-200/10 pb-1.5">
                    <span>Monday - Saturday</span>
                    <span className="text-emerald-500">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-amber-500">9:00 AM - 1:00 PM (Half Day)</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none border-b border-slate-200/20 pb-1">Web & Social Connects</span>
                <div className="flex items-center gap-4 text-xs mt-1">
                  {selectedBiz.website && (
                    <a href={`https://${selectedBiz.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline text-blue-500 font-bold">
                      <Globe className="h-4 w-4" /> Website
                    </a>
                  )}
                  <a href="#fb" onClick={(e) => { e.preventDefault(); alert('Connecting to Facebook listing index...'); }} className="flex items-center gap-1 hover:text-blue-600 text-slate-400 transition-colors font-bold">
                    Facebook
                  </a>
                  <a href="#ig" onClick={(e) => { e.preventDefault(); alert('Connecting to Instagram listing index...'); }} className="flex items-center gap-1 hover:text-pink-500 text-slate-400 transition-colors font-bold">
                    Instagram
                  </a>
                </div>
              </div>

            </div>

            {/* Modal Action Footer */}
            <div className={`p-6 border-t flex flex-col gap-2 shrink-0 ${
              themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => { handleAction(selectedBiz._id, 'reject'); setShowBizModal(false); }}
                  disabled={selectedBiz.status === 'Rejected'}
                  className="py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-extrabold text-[11px] rounded-xl cursor-pointer disabled:opacity-40 text-center transition-colors border border-rose-500/25"
                >
                  Reject listing
                </button>
                <button 
                  onClick={() => { handleAction(selectedBiz._id, 'suspend'); setShowBizModal(false); }}
                  disabled={selectedBiz.status === 'Suspended'}
                  className="py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-550 font-extrabold text-[11px] rounded-xl cursor-pointer disabled:opacity-40 text-center transition-colors border border-amber-500/25"
                >
                  Suspend business
                </button>
                <button 
                  onClick={() => {
                    const remarks = window.prompt("Enter modification request comments:");
                    if (remarks) {
                      setSystemLogs(prev => [
                        { time: new Date().toLocaleTimeString(), event: `SuperAdmin requested modifications for ${selectedBiz.name}. Comments: ${remarks}`, type: 'warning' },
                        ...prev
                      ]);
                      alert("Modification details request sent to merchant mailbox.");
                      setShowBizModal(false);
                    }
                  }}
                  className="py-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 font-extrabold text-[11px] rounded-xl cursor-pointer text-center transition-colors border border-purple-500/25"
                >
                  Mod Request
                </button>
              </div>
              <button 
                onClick={() => window.open(`/businesses/${selectedBiz._id}`, '_blank')}
                className="w-full py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 font-extrabold text-[11px] rounded-xl cursor-pointer text-center transition-colors border border-blue-500/25 flex items-center justify-center gap-1.5"
              >
                <Eye className="h-4 w-4" />
                <span>View Public Landing Page</span>
              </button>
              <button 
                onClick={() => { handleAction(selectedBiz._id, 'approve'); setShowBizModal(false); }}
                disabled={selectedBiz.status === 'Approved'}
                className="w-full py-3 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl cursor-pointer disabled:opacity-40 text-center shadow shadow-emerald-800/10 transition-colors uppercase tracking-wider"
              >
                Approve & Publish listing
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. USER PROFILE DETAILS SLIDE-OVER MODAL */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-end p-0">
          <div className={`w-full max-w-lg h-full shadow-2xl flex flex-col justify-between animate-slideLeft text-left font-sans ${
            themeMode === 'dark' ? 'bg-[#090D1C] text-slate-100 border-l border-slate-800' : 'bg-white text-[#001c41] border-l border-slate-200'
          }`}>
            
            {/* Modal Header */}
            <div className={`p-6 border-b flex justify-between items-center shrink-0 ${
              themeMode === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3 text-left">
                <div className={`h-11 w-11 rounded-full border flex items-center justify-center font-black text-sm shrink-0 ${
                  themeMode === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-emerald-50 text-[#027244] border-emerald-100'
                }`}>
                  {selectedUser.fullName?.charAt(0).toUpperCase() || selectedUser.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">User Profile Workspace</span>
                  <h3 className={`font-extrabold text-base leading-tight mt-1.5 ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>
                    {selectedUser.fullName || selectedUser.name}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => { setSelectedUser(null); setShowUserModal(false); }}
                className={`h-8.5 w-8.5 rounded-full border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  themeMode === 'dark' ? 'border-slate-800 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-550 hover:bg-slate-100'
                }`}
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 font-sans">
              
              {/* Account Credentials Summary */}
              <div className={`p-4.5 rounded-2xl border flex flex-col gap-3.5 ${
                themeMode === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Account Credentials & Access</span>
                <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-400">
                  <div className="flex justify-between">
                    <span>Email Address</span>
                    <span className={`font-bold ${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{selectedUser.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contact Number</span>
                    <span className={`font-bold ${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{selectedUser.mobileNumber || selectedUser.phone || 'Not Specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Status</span>
                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase border ${
                      selectedUser.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450' : 'bg-red-500/10 border-red-500/20 text-red-500'
                    }`}>
                      {selectedUser.status || 'Active'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Authorization Role</span>
                    <span className="uppercase text-[9px] font-black tracking-wider text-slate-500 bg-slate-500/10 border border-slate-500/20 px-2 py-0.5 rounded">
                      {selectedUser.role}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Date</span>
                    <span className="font-bold text-slate-500">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Owned Directory Business Profiles */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none border-b border-slate-200/20 pb-1">Owned Directory Business Profiles</span>
                <div className="flex flex-col gap-3 mt-1">
                  {(() => {
                    const ownedBiz = businesses.filter(b => b.ownerEmail === selectedUser.email || b.ownerId === selectedUser._id || b.ownerId?._id === selectedUser._id);
                    if (ownedBiz.length > 0) {
                      return ownedBiz.map(biz => (
                        <div 
                          key={biz._id}
                          onClick={() => {
                            setSelectedBiz(biz);
                            setShowBizModal(true);
                            setShowUserModal(false);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer hover:border-[#027244] hover:shadow-sm transition-all flex items-center justify-between gap-3 text-left ${
                            themeMode === 'dark' ? 'bg-slate-900/20 border-slate-850' : 'bg-slate-50/50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="h-8 w-8 rounded-lg border flex items-center justify-center text-sm shrink-0 bg-white border-slate-200 text-[#027244]">
                              🏢
                            </span>
                            <div className="flex flex-col min-w-0">
                              <span className={`text-xs font-black truncate leading-none ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{biz.name}</span>
                              <span className="text-[9px] text-slate-400 mt-1 font-semibold truncate leading-none">{biz.category || 'Local Services'} • {biz.locality}</span>
                            </div>
                          </div>
                          <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                            biz.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-450' : 'bg-amber-500/10 border-amber-500/25 text-amber-450'
                          }`}>
                            {biz.status}
                          </span>
                        </div>
                      ));
                    } else {
                      return (
                        <div className={`p-5 rounded-2xl border text-center text-xs text-slate-500 italic leading-relaxed ${
                          themeMode === 'dark' ? 'border-slate-800' : 'border-slate-200 bg-slate-50/30'
                        }`}>
                          No business directory profiles registered under this account yet.
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>

              {/* Dynamic Associated Content Stats */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none border-b border-slate-200/20 pb-1">Dynamic Account Telemetry</span>
                <div className="grid grid-cols-3 gap-3.5 mt-1 font-sans text-center text-[#001c41]">
                  {[
                    { label: 'Events Posted', count: events.filter(e => e.ownerId?._id === selectedUser._id || e.ownerId === selectedUser._id || e.phone === selectedUser.mobileNumber).length, color: 'text-purple-650 bg-purple-50 border-purple-100' },
                    { label: 'Blogs Written', count: blogs.filter(b => b.author?._id === selectedUser._id || b.author === selectedUser._id || b.authorName === selectedUser.fullName).length, color: 'text-pink-600 bg-pink-50 border-pink-100' },
                    { label: 'Subscriptions', count: subscriptions.filter(s => s.ownerId?._id === selectedUser._id || s.ownerId === selectedUser._id).length, color: 'text-[#027244] bg-emerald-50 border-emerald-100' }
                  ].map((stat, i) => (
                    <div key={i} className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 ${themeMode === 'dark' ? 'bg-slate-900/20 border-slate-800' : stat.color}`}>
                      <span className={`text-base font-black leading-none ${themeMode === 'dark' ? 'text-white' : ''}`}>{stat.count}</span>
                      <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider leading-none mt-1">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Action Footer */}
            <div className={`p-6 border-t flex flex-col gap-2 shrink-0 ${
              themeMode === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => {
                    if (selectedUser.role === 'visitor' || selectedUser.role === 'user') {
                      setRegularUsers(prev => prev.map(usr => usr._id === selectedUser._id ? { ...usr, status: usr.status === 'Active' ? 'Suspended' : 'Active' } : usr));
                    } else {
                      handleMerchantStatusToggle(selectedUser._id);
                    }
                    setSelectedUser(prev => ({ ...prev, status: prev.status === 'Active' ? 'Suspended' : 'Active' }));
                  }}
                  className={`py-2.5 font-extrabold text-[11px] rounded-xl cursor-pointer text-center transition-colors border ${
                    selectedUser.status === 'Active'
                      ? 'bg-rose-500/10 border-rose-500/25 hover:bg-rose-500/20 text-rose-500'
                      : 'bg-emerald-600 border-emerald-500/20 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {selectedUser.status === 'Active' ? 'Block Account Profile' : 'Unblock Account Profile'}
                </button>
                <button 
                  onClick={() => {
                    setMerchantForNotice(selectedUser);
                    setMerchantNoticeText('');
                    setShowMerchantNoticeModal(true);
                    setShowUserModal(false);
                  }}
                  className="py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 font-extrabold text-[11px] rounded-xl cursor-pointer text-center transition-colors border border-blue-500/25"
                >
                  Send Direct Alert Notice
                </button>
              </div>
              <button 
                onClick={async () => {
                  if (confirm(`CRITICAL WARNING: Are you sure you want to permanently delete user account profile "${selectedUser.fullName || selectedUser.name}"? This will cascadingly delete ALL their registered businesses, blogs, reviews, and events! THIS IS IRREVERSIBLE!`)) {
                    try {
                      const res = await fetch(`http://localhost:5000/api/superadmin/users/${selectedUser._id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('ubt_token')}` }
                      });
                      if (res.ok) {
                        alert('Account profile and all cascade assets permanently purged.');
                        setShowUserModal(false);
                        setSelectedUser(null);
                        loadPlatformRealData();
                      }
                    } catch (err) {
                      console.error(err);
                      alert('Offline simulation: Account profile removed.');
                      if (selectedUser.role === 'visitor' || selectedUser.role === 'user') {
                        setRegularUsers(prev => prev.filter(usr => usr._id !== selectedUser._id));
                      } else {
                        setMerchants(prev => prev.filter(usr => usr._id !== selectedUser._id));
                      }
                      setShowUserModal(false);
                      setSelectedUser(null);
                    }
                  }
                }}
                className="w-full py-3 bg-red-650 hover:bg-red-750 text-white font-extrabold text-xs rounded-xl cursor-pointer text-center transition-colors shadow shadow-red-950/10 uppercase tracking-wider"
              >
                Permanently Purge & Delete Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EXTEND SUBSCRIPTION MODAL */}
      {showExtendSubModal && selectedBizForExtend && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn text-[#001c41]">
          <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-[24px] p-6 flex flex-col gap-5 text-left font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Extend Subscription Duration</h3>
              <button onClick={() => { setShowExtendSubModal(false); setSelectedBizForExtend(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Manually extend the premium listing subscription status for <b className="text-slate-800">{selectedBizForExtend.name}</b>.
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Days to Extend</label>
              <select 
                value={extendDays}
                onChange={(e) => setExtendDays(e.target.value)}
                className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-[#027244] cursor-pointer font-bold"
              >
                <option value={7}>7 Days (1 Week Extension)</option>
                <option value={30}>30 Days (1 Month Extension)</option>
                <option value={90}>90 Days (3 Months Extension)</option>
                <option value={365}>365 Days (1 Year Extension)</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <button 
                onClick={() => { setShowExtendSubModal(false); setSelectedBizForExtend(null); }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-extrabold rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleExtendSubscription}
                className="px-5 py-2 bg-[#027244] hover:bg-[#005934] text-white text-xs font-extrabold rounded-xl shadow-md"
              >
                Extend Sub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPPORT TICKET REPLY MODAL */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn text-[#001c41]">
          <div className="w-full max-w-lg bg-white border border-slate-200 shadow-2xl rounded-[24px] p-6 flex flex-col gap-5 text-left font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Reply Support Ticket</h3>
              <button onClick={() => { setShowTicketModal(false); setSelectedTicket(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-2 border border-slate-200">
              <div className="flex justify-between text-[9.5px] font-black text-slate-400 uppercase tracking-wider">
                <span>From: {selectedTicket.user}</span>
                <span>ID: {selectedTicket._id}</span>
              </div>
              <span className="font-bold text-slate-800 text-xs">Issue: {selectedTicket.issueType}</span>
              <p className="text-xs text-slate-550 leading-relaxed font-semibold mt-1 bg-white border border-slate-100 p-3 rounded-xl">
                "{selectedTicket.message}"
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Your Reply message *</label>
              <textarea 
                rows={4}
                required
                placeholder="Type resolution reply..."
                value={ticketReplyText}
                onChange={(e) => setTicketReplyText(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/20 focus:outline-none focus:border-[#027244] resize-none leading-relaxed"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => { setShowTicketModal(false); setSelectedTicket(null); }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-extrabold rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleTicketReply}
                disabled={!ticketReplyText.trim()}
                className="px-5 py-2 bg-[#027244] hover:bg-[#005934] text-white text-xs font-extrabold rounded-xl shadow-md disabled:opacity-50"
              >
                Send & Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPLY TO USER QUERY MODAL */}
      {showReplyModal && selectedQuery && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn text-[#001c41]">
          <div className="w-full max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-[28px] overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between shrink-0 font-sans">
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
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3 shrink-0 justify-end font-sans">
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

      {/* EDIT ADMIN MODAL */}
      {showEditAdminModal && editingAdmin && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn text-[#001c41]">
          <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-[24px] p-6 flex flex-col gap-5 text-left font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Edit Administrator</h3>
              <button onClick={() => { setShowEditAdminModal(false); setEditingAdmin(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <form onSubmit={handleSaveAdmin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Full Name *</label>
                <input 
                  type="text" 
                  required
                  value={editingAdmin.fullName}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, fullName: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/20 focus:outline-none focus:border-[#027244]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Email Address *</label>
                <input 
                  type="email" 
                  required
                  value={editingAdmin.email}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/20 focus:outline-none focus:border-[#027244]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Assign Role Privilege *</label>
                <select 
                  value={editingAdmin.role}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, role: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/20 focus:outline-none focus:border-[#027244]"
                >
                  <option value="admin">Administrator</option>
                  <option value="moderator">Content Moderator</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Scope Permissions *</label>
                <select 
                  value={editingAdmin.permissions}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, permissions: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/20 focus:outline-none focus:border-[#027244]"
                >
                  <option value="Full">Full Credentials</option>
                  <option value="Moderation Only">Moderation Desks Only</option>
                  <option value="Read Only">Read Only Viewer</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button 
                  type="button"
                  onClick={() => { setShowEditAdminModal(false); setEditingAdmin(null); }}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-extrabold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#027244] hover:bg-[#005934] text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEND MERCHANT NOTICE MODAL */}
      {showMerchantNoticeModal && merchantForNotice && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn text-[#001c41]">
          <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-[24px] p-6 flex flex-col gap-5 text-left font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Notify Merchant</h3>
              <button onClick={() => { setShowMerchantNoticeModal(false); setMerchantForNotice(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <form onSubmit={handleSendMerchantNotice} className="flex flex-col gap-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col gap-1">
                <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">Recipient Profile</span>
                <span className="font-bold text-slate-800 text-xs">{merchantForNotice.fullName}</span>
                <span className="text-[10px] text-slate-500 font-semibold">{merchantForNotice.email}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Notification Message *</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Type message text to be displayed in merchant dashboard notices feed..."
                  value={merchantNoticeText}
                  onChange={(e) => setMerchantNoticeText(e.target.value)}
                  className="w-full border border-slate-200 p-3.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/20 focus:outline-none focus:border-[#027244] resize-none leading-relaxed"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button 
                  type="button"
                  onClick={() => { setShowMerchantNoticeModal(false); setMerchantForNotice(null); }}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-extrabold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!merchantNoticeText.trim()}
                  className="px-5 py-2 bg-[#027244] hover:bg-[#005934] text-white text-xs font-extrabold rounded-xl shadow-md disabled:opacity-50 cursor-pointer"
                >
                  Send Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT BLOG MODAL */}
      {showEditBlogModal && editingBlog && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn text-[#001c41]">
          <div className="w-full max-w-lg bg-white border border-slate-200 shadow-2xl rounded-[24px] p-6 flex flex-col gap-5 text-left font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Edit Blog Post</h3>
              <button onClick={() => { setShowEditBlogModal(false); setEditingBlog(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <form onSubmit={handleSaveBlog} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Blog Title *</label>
                <input 
                  type="text" 
                  required
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/20 focus:outline-none focus:border-[#027244]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Author Name *</label>
                <input 
                  type="text" 
                  required
                  value={editingBlog.authorName}
                  onChange={(e) => setEditingBlog({ ...editingBlog, authorName: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/20 focus:outline-none focus:border-[#027244]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Article Content *</label>
                <textarea 
                  rows={6}
                  required
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full border border-slate-200 p-3.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/20 focus:outline-none focus:border-[#027244] resize-none leading-relaxed"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button 
                  type="button"
                  onClick={() => { setShowEditBlogModal(false); setEditingBlog(null); }}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-extrabold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#027244] hover:bg-[#005934] text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer"
                >
                  Save Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EVENT MODAL */}
      {showEditEventModal && editingEvent && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn text-[#001c41]">
          <div className="w-full max-w-lg bg-white border border-slate-200 shadow-2xl rounded-[24px] p-6 flex flex-col gap-5 text-left font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Edit Event Details</h3>
              <button onClick={() => { setShowEditEventModal(false); setEditingEvent(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <form onSubmit={handleSaveEvent} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Event Title *</label>
                <input 
                  type="text" 
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/20 focus:outline-none focus:border-[#027244]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Organizer / Venue *</label>
                <input 
                  type="text" 
                  required
                  value={editingEvent.organizer}
                  onChange={(e) => setEditingEvent({ ...editingEvent, organizer: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/20 focus:outline-none focus:border-[#027244]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Date *</label>
                  <input 
                    type="text" 
                    required
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/20 focus:outline-none focus:border-[#027244]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Venue location *</label>
                  <input 
                    type="text" 
                    required
                    value={editingEvent.venue}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                    className="w-full border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/20 focus:outline-none focus:border-[#027244]"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button 
                  type="button"
                  onClick={() => { setShowEditEventModal(false); setEditingEvent(null); }}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-extrabold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#027244] hover:bg-[#005934] text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 13. BLOG MODERATION DETAILED POPUP MODAL */}
      {selectedBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-2xl border shadow-2xl rounded-[28px] overflow-hidden flex flex-col max-h-[90vh] ${
            themeMode === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#001c41]'
          }`}>
            
            {/* Modal Header */}
            <div className={`p-6 border-b flex items-center justify-between shrink-0 ${
              themeMode === 'dark' ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="flex flex-col text-left">
                <h3 className="font-extrabold text-base font-sans">Blog Moderation Desk</h3>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Review full article content, draft suggestions or approve status.</span>
              </div>
              <button 
                onClick={() => { setSelectedBlogModal(null); setSuggestionText(''); }}
                className={`h-8 w-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                  themeMode === 'dark' ? 'border-slate-800 hover:bg-slate-850 text-slate-400' : 'border-slate-200 hover:bg-slate-550 text-slate-550'
                }`}
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
                      ? 'text-emerald-650 dark:text-emerald-400' 
                      : selectedBlogModal.status === 'Pending Approval' || selectedBlogModal.status === 'Needs Revision'
                        ? 'text-amber-600 dark:text-amber-400'
                        : selectedBlogModal.status === 'Rejected'
                          ? 'text-rose-600 dark:text-rose-455'
                          : 'text-slate-500 dark:text-slate-400'
                  }`}>{selectedBlogModal.status}</span>
                </span>
                <h2 className={`font-extrabold text-xl leading-tight font-sans ${themeMode === 'dark' ? 'text-white' : 'text-[#001c41]'}`}>{selectedBlogModal.title}</h2>
                
                {selectedBlogModal.author && (
                  <div className={`border p-3 rounded-2xl flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold ${
                    themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200/80 text-slate-600'
                  }`}>
                    <span>✍️ Author: <strong className={themeMode === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{selectedBlogModal.authorName}</strong></span>
                    <span>📧 {selectedBlogModal.author.email || 'N/A'}</span>
                    <span>📞 {selectedBlogModal.author.mobileNumber || selectedBlogModal.author.phone || 'N/A'}</span>
                    <span>Role: <strong className="text-emerald-500 uppercase">{selectedBlogModal.author.role || 'Writer'}</strong></span>
                  </div>
                )}
              </div>

              {/* Cover Image */}
              {selectedBlogModal.coverImage && (
                <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shrink-0 select-none shadow-3xs">
                  <img src={selectedBlogModal.coverImage} className="w-full h-full object-cover" alt="Full Blog Cover" />
                </div>
              )}

              {/* Article Content */}
              <div className="flex flex-col gap-2">
                <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest leading-none">Article content</span>
                <p className={`text-xs leading-relaxed font-semibold border p-4.5 rounded-2xl whitespace-pre-wrap text-justify ${
                  themeMode === 'dark' ? 'bg-slate-950/20 border-slate-800 text-slate-250' : 'bg-slate-50/40 border-slate-100 text-slate-655'
                }`}>
                  {selectedBlogModal.content}
                </p>
              </div>

              {/* Suggestions Panel */}
              <div className={`border-t pt-5 flex flex-col gap-3 ${
                themeMode === 'dark' ? 'border-slate-800' : 'border-slate-150'
              }`}>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none flex items-center gap-1.5">
                    💡 Revision Suggestions & Chat History
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-semibold mt-1">Discuss corrections or request changes with the writer.</span>
                </div>

                {/* Revision Chat History Stream */}
                {selectedBlogModal.revisionHistory && selectedBlogModal.revisionHistory.length > 0 && (
                  <div className={`flex flex-col gap-2.5 max-h-48 overflow-y-auto border rounded-2xl p-4.5 ${
                    themeMode === 'dark' 
                      ? 'bg-slate-950/40 border-slate-800' 
                      : 'bg-slate-50/50 border-slate-150'
                  }`}>
                    {selectedBlogModal.revisionHistory.map((item, idx) => {
                      const isAdmin = item.senderRole === 'admin' || item.senderRole === 'superadmin';
                      return (
                        <div 
                          key={idx} 
                          className={`flex flex-col max-w-[85%] rounded-2xl p-3 border text-xs leading-relaxed ${
                            isAdmin 
                              ? (themeMode === 'dark' 
                                  ? 'bg-amber-950/25 border-amber-900/40 self-end text-amber-250 text-right' 
                                  : 'bg-amber-55/15 border-amber-100 self-end text-amber-900 text-right') 
                              : (themeMode === 'dark' 
                                  ? 'bg-emerald-950/25 border-emerald-900/30 self-start text-emerald-250 text-left' 
                                  : 'bg-emerald-50/50 border-emerald-250/20 self-start text-[#001c41] text-left')
                          }`}
                        >
                          <div className={`flex items-center gap-3.5 mb-1 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                            <span className="font-extrabold text-[8.5px] uppercase tracking-wider opacity-60">
                              {item.senderName} ({isAdmin ? 'Admin' : 'Writer'})
                            </span>
                            <span className="text-[8.5px] opacity-40 font-bold">
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
                  className={`w-full border p-3.5 rounded-2xl text-xs font-semibold focus:outline-none resize-none leading-relaxed ${
                    themeMode === 'dark' 
                      ? 'bg-slate-950/20 border-slate-800 text-slate-200 focus:border-amber-500' 
                      : 'bg-slate-50/10 border-slate-200 text-slate-700 focus:border-amber-500'
                  }`}
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
                    className="px-5 py-2.5 bg-amber-550 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl cursor-pointer flex items-center gap-1 shadow-xs transition-colors"
                  >
                    Send Suggestions to Writer (Needs Revision)
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className={`p-6 border-t flex gap-3 shrink-0 justify-between items-center ${
              themeMode === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'
            }`}>
              <button 
                onClick={() => {
                  if (confirm("Are you sure you want to permanently delete this blog post? This action cannot be undone.")) {
                    handleBlogDelete(selectedBlogModal._id);
                    setSelectedBlogModal(null);
                  }
                }}
                className="px-4 py-2.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-500 font-extrabold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Delete Post
              </button>

              <div className="flex gap-2">
                <button 
                  onClick={() => { setSelectedBlogModal(null); setSuggestionText(''); }}
                  className={`px-4.5 py-2.5 border font-extrabold text-xs rounded-xl cursor-pointer transition-colors ${
                    themeMode === 'dark' ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    handleBlogAction(selectedBlogModal._id, 'Rejected');
                    setSelectedBlogModal(null);
                  }}
                  disabled={selectedBlogModal.status === 'Rejected'}
                  className={`px-4.5 py-2.5 border font-extrabold text-xs rounded-xl cursor-pointer disabled:opacity-40 transition-colors ${
                    themeMode === 'dark' ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850' : 'border-slate-200 bg-slate-100 text-slate-750 hover:bg-slate-200'
                  }`}
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
