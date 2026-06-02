import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  BookOpen, Search, Plus, Calendar, User, Heart, MessageSquare, Clock, X, CheckCircle, 
  AlertCircle, ArrowLeft, RefreshCw, Share2, Upload, Trash2, Briefcase, MapPin, 
  Sparkles, Calendar as CalIcon, Cpu, Activity, GraduationCap, Plane, Coffee, Tag, 
  ChevronDown, Check, ArrowUpDown, Star, Mail
} from 'lucide-react';

const STANDARD_CATEGORIES = [
  'Business Tips',
  'Local Guide',
  'Lifestyle',
  'Events',
  'Technology',
  'Health & Wellness',
  'Education',
  'Travel',
  'Food & Culture'
];

const getCategoryIcon = (catName) => {
  const name = catName?.toLowerCase() || '';
  if (name.includes('tips') || name.includes('business')) return <Briefcase className="h-3.5 w-3.5 text-amber-500" />;
  if (name.includes('guide') || name.includes('local')) return <MapPin className="h-3.5 w-3.5 text-blue-500" />;
  if (name.includes('lifestyle')) return <Sparkles className="h-3.5 w-3.5 text-purple-500" />;
  if (name.includes('event')) return <CalIcon className="h-3.5 w-3.5 text-rose-500" />;
  if (name.includes('tech')) return <Cpu className="h-3.5 w-3.5 text-indigo-500" />;
  if (name.includes('health') || name.includes('wellness')) return <Activity className="h-3.5 w-3.5 text-emerald-500" />;
  if (name.includes('education')) return <GraduationCap className="h-3.5 w-3.5 text-teal-500" />;
  if (name.includes('travel')) return <Plane className="h-3.5 w-3.5 text-sky-500" />;
  if (name.includes('food') || name.includes('culture')) return <Coffee className="h-3.5 w-3.5 text-orange-500" />;
  return <Tag className="h-3.5 w-3.5 text-slate-500" />;
};

const mockBlogs = [
  {
    _id: 'blog_1',
    title: '10 Marketing Tips for Small Businesses in Udumalpet',
    content: 'Developing daily habits that support creativity and productivity can transform your personal and professional life. In this article, we explore actionable strategies like morning routines, mindful scheduling, time blocking, and minimizing digital distractions. Learn how small changes can lead to large shifts in focus, creative output, and overall mental well-being.',
    coverImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80',
    authorName: 'Ananth Sundar',
    status: 'Approved',
    category: 'Business Tips',
    showLikes: true,
    showComments: true,
    likes: ['user1', 'user2', 'user3', 'user4', 'user5'],
    comments: [
      { _id: 'c1', userName: 'Karthik S.', text: 'Very practical advice! The section on digital distractions is highly relevant.', createdAt: new Date() },
      { _id: 'c2', userName: 'Meena Devi', text: 'Loved the ideas for time blocking. Planning to try that soon.', createdAt: new Date() }
    ],
    createdAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'blog_2',
    title: 'Top Places to Visit in Udumalpet This Weekend',
    content: 'In a world that constantly encourages speed, choosing to slow down is a deliberate and rewarding act. Slow living is not about doing everything at a snail\'s pace; it is about doing things at the right pace. Discover how mindfulness, decluttering, appreciating nature, and taking periodic digital detoxes can help you reclaim your time, reduce stress, and savor the present moment.',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    authorName: 'Senthil Kumar',
    status: 'Approved',
    category: 'Local Guide',
    showLikes: true,
    showComments: true,
    likes: ['user1', 'user2', 'user3'],
    comments: [
      { _id: 'c3', userName: 'Vignesh R.', text: 'Decluttering is indeed key. Great breakdown of mindful practices.', createdAt: new Date() }
    ],
    createdAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'blog_3',
    title: 'Upcoming Events in Udumalpet – June 2026',
    content: 'Photography is more than just owning a camera; it is about learning how to see light, compose stories, and capture feelings. Whether you are using a smartphone or a professional DSLR, understanding basics like the rule of thirds, ambient light, and framing can elevate your shots. We share practical tips to help you capture everyday stories and preserve memories.',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    authorName: 'Priya Ramesh',
    status: 'Approved',
    category: 'Events',
    showLikes: true,
    showComments: false,
    likes: ['user1', 'user4', 'user5', 'user6'],
    comments: [],
    createdAt: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'blog_4',
    title: 'How to Build a Strong Brand Identity for Your Business',
    content: 'Learn the essential steps to create a brand identity that stands out and builds trust with customers. Discover target audience research, logo guidelines, typography parameters, and communication guidelines that set your merchant profile apart from competitors in town.',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    authorName: 'Suresh Raina',
    status: 'Approved',
    category: 'Business Tips',
    showLikes: true,
    showComments: true,
    likes: ['u1', 'u2'],
    comments: [
      { _id: 'c4', userName: 'Lokesh T.', text: 'Very detailed advice on logos.', createdAt: new Date() }
    ],
    createdAt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'blog_5',
    title: 'Best Shopping Spots in Udumalpet',
    content: 'From traditional markets to modern department stores, explore the best spots in town to purchase authentic silks, home goods, and fresh agricultural produce straight from nearby farms.',
    coverImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    authorName: 'Meena Devi',
    status: 'Approved',
    category: 'Local Guide',
    showLikes: true,
    showComments: true,
    likes: ['u5'],
    comments: [],
    createdAt: new Date(new Date().getTime() - 9 * 24 * 60 * 60 * 1000)
  }
];

export default function BlogsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTyped, setSearchTyped] = useState('');
  const [copiedBlogId, setCopiedBlogId] = useState(null);
  
  // Filtering & Sorting
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Recent'); // Recent | Popular | Discussed
  const [visibleCount, setVisibleCount] = useState(5);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Auth state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Write Modal States
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategoryOption, setSelectedCategoryOption] = useState('Business Tips');
  const [customCategory, setCustomCategory] = useState('');
  
  const [writeLoading, setWriteLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('ubt_user');
    const storedToken = localStorage.getItem('ubt_token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        if (searchParams.get('write') === 'true') {
          setShowWriteModal(true);
        }
      } catch (err) {
        console.error('Failed to parse ubt_user details from localStorage:', err);
        localStorage.removeItem('ubt_user');
        localStorage.removeItem('ubt_token');
      }
    }

    fetchBlogs();
  }, [searchParams]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/blogs');
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data);
      } else {
        throw new Error('Backend failed');
      }
    } catch (err) {
      console.warn('Backend server offline, loading mock tourism blog posts.');
      setBlogs(mockBlogs);
    } finally {
      setLoading(false);
    }
  };

  const handleWriteClick = () => {
    if (!token) {
      navigate(`/login?redirect=${encodeURIComponent('/blogs?write=true')}&from=blogs`);
      return;
    }
    setShowWriteModal(true);
  };

  const handleShareClick = (e, blogId) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/blogs/${blogId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedBlogId(blogId);
    setTimeout(() => setCopiedBlogId(null), 2000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image file size must be less than 5MB.');
      return;
    }

    setImageUploading(true);
    setImageError('');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setCoverImage(data.url);
      } else {
        setImageError(data.message || 'Failed to upload image.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setImageError('Network error uploading image. Using a premium placeholder instead.');
      setCoverImage('https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80');
    } finally {
      setImageUploading(false);
    }
  };

  const handleWriteSubmit = async (e) => {
    e.preventDefault();
    setWriteLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    if (!title.trim() || !content.trim()) {
      setErrorMsg('Please enter both a title and blog content.');
      setWriteLoading(false);
      return;
    }

    const finalCategory = selectedCategoryOption === 'Other' ? customCategory.trim() : selectedCategoryOption;

    if (!finalCategory) {
      setErrorMsg('Please provide a category.');
      setWriteLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          coverImage: coverImage || undefined,
          category: finalCategory
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccessMsg('Your blog has been successfully submitted and is awaiting admin approval. Once approved, it will be published publicly!');
        setTitle('');
        setCoverImage('');
        setContent('');
        setSelectedCategoryOption('Business Tips');
        setCustomCategory('');
        fetchBlogs();
        setTimeout(() => {
          setShowWriteModal(false);
          setSuccessMsg('');
        }, 5000);
      } else {
        setErrorMsg(data.message || 'Failed to submit blog post.');
      }
    } catch (err) {
      // Mock local submission for offline demo
      setSuccessMsg('Mock Mode: Your blog post has been sent to the admin approval queue! In full backend deployment, the post is saved as "Pending Approval" in MongoDB.');
      
      const newMockBlog = {
        _id: 'mock_b_' + Date.now(),
        title,
        content,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
        authorName: user?.fullName || 'Guest Writer',
        status: 'Approved', // Auto approve in mock mode for instant user review
        category: finalCategory,
        showLikes: true,
        showComments: true,
        likes: [],
        comments: [],
        createdAt: new Date()
      };

      setBlogs(prev => [newMockBlog, ...prev]);
      setTitle('');
      setCoverImage('');
      setContent('');
      setSelectedCategoryOption('Business Tips');
      setCustomCategory('');
      
      setTimeout(() => {
        setShowWriteModal(false);
        setSuccessMsg('');
      }, 5000);
    } finally {
      setWriteLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchTyped);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await res.json();
      if (data.success) {
        setSubscribed(true);
        setNewsletterEmail('');
        setTimeout(() => setSubscribed(false), 5000);
      } else {
        alert(data.message || 'Subscription failed. Please check your email and try again.');
      }
    } catch (err) {
      console.warn('Backend server offline, simulating offline newsletter subscription.');
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  // Get active lists
  const approvedBlogs = blogs.filter(blog => blog.status === 'Approved');

  // Categories Counts Calculation
  const categoryCounts = {};
  STANDARD_CATEGORIES.forEach(cat => {
    categoryCounts[cat] = approvedBlogs.filter(b => b.category === cat).length;
  });
  // Calculate dynamic counts for user-defined categories
  approvedBlogs.forEach(blog => {
    if (blog.category && !STANDARD_CATEGORIES.includes(blog.category)) {
      categoryCounts[blog.category] = (categoryCounts[blog.category] || 0) + 1;
    }
  });

  // Extract all active categories (standard + custom with at least 1 post)
  const activeCategoriesList = [
    ...STANDARD_CATEGORIES,
    ...Object.keys(categoryCounts).filter(cat => !STANDARD_CATEGORIES.includes(cat))
  ];

  // Filtering blogs
  const filteredBlogs = approvedBlogs.filter(blog => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.category && blog.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      activeCategory === 'All' || 
      (blog.category && blog.category.toLowerCase() === activeCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  // Sorting blogs
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortBy === 'Popular') {
      return (b.likes?.length || 0) - (a.likes?.length || 0);
    }
    if (sortBy === 'Discussed') {
      return (b.comments?.length || 0) - (a.comments?.length || 0);
    }
    // Default: 'Recent'
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Featured Blogs: take first 3 approved blogs
  const featuredBlogs = approvedBlogs.slice(0, 3);

  // Popular Blogs for Sidebar (Sorted by Likes)
  const popularBlogs = [...approvedBlogs]
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 5);

  return (
    <div className="w-full flex flex-col items-center bg-[#F8FAFC] pb-16 font-sans">
      
      {/* 1. Header Banner */}
      <section 
        className="w-full relative py-16 px-4 md:px-8 bg-cover bg-center text-white overflow-hidden shadow-md"
        style={{ backgroundImage: "linear-gradient(to bottom, rgba(0, 28, 65, 0.82), rgba(0, 28, 65, 0.95)), url('/thirumoorthy_hills.png')" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto flex flex-col items-center z-10 text-center">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300/80 font-bold mt-2">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <span className="text-slate-500">&gt;</span>
            <span className="text-white">Blog</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-5 font-sans">
            Blog & Insights
          </h1>
          
          <p className="text-slate-300 text-sm font-semibold mt-2.5 leading-relaxed max-w-2xl">
            Discover helpful stories, local insights, business tips and updates from Udumalpet and beyond.
          </p>

          <form onSubmit={handleSearchSubmit} className="mt-8 w-full bg-white border border-slate-200 shadow-xl rounded-2xl p-2.5 flex gap-2.5 max-w-3xl">
            <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search articles, topics or keywords..."
                value={searchTyped}
                onChange={(e) => setSearchTyped(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button 
              type="submit"
              className="bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs py-3 px-8 rounded-xl transition-all shadow-md shrink-0 cursor-pointer border-none"
            >
              Search
            </button>
            <button 
              type="button"
              onClick={handleWriteClick}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer border border-amber-600/10"
            >
              <Plus className="h-4 w-4" /> Write a Blog
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Wrap */}
      <div className="max-w-7xl w-full px-4 md:px-8 mt-12 flex flex-col gap-12">
        
        {/* 2. Featured Articles Section (Only shown when viewing all categories and no active search filter) */}
        {activeCategory === 'All' && !searchQuery && featuredBlogs.length > 0 && (
          <section className="w-full flex flex-col gap-6 text-left animate-fadeIn">
            <h2 className="text-xl font-extrabold text-[#001c41] tracking-tight">Featured Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBlogs.map(blog => {
                const words = blog.content.split(' ').length;
                const readTime = Math.max(Math.ceil(words / 150), 1);
                
                return (
                  <article key={blog._id} className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col cursor-pointer" onClick={() => navigate(`/blogs/${blog._id}`)}>
                    <div className="h-48 overflow-hidden bg-slate-100">
                      <img src={blog.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt={blog.title} />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase text-[#027244] tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                          {blog.category || 'Local Guide'}
                        </span>
                        <h3 className="text-sm font-extrabold text-[#001c41] leading-snug line-clamp-2 hover:text-[#027244] transition-colors">{blog.title}</h3>
                        <p className="text-xs text-slate-500 font-semibold line-clamp-3 leading-relaxed mt-1">{blog.content}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-t border-slate-50 pt-3 mt-1">
                        <span>{new Date(blog.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                        <span>•</span>
                        <span>{readTime} Min Read</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. Two-Column Stream Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Latest Articles list */}
          <div className="lg:col-span-2 flex flex-col gap-8 text-left">
            
            {/* Filter Tabs & Sorting Header */}
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-xl font-extrabold text-[#001c41] tracking-tight">Latest Articles</h2>
                  <span className="text-xs text-slate-450 font-bold">{sortedBlogs.length} articles found</span>
                </div>
                
                {/* Categories Tab navigation */}
                <div className="flex items-center gap-1.5 flex-wrap mt-2 overflow-x-auto pb-1 select-none">
                  {['All', ...STANDARD_CATEGORIES.slice(0, 4)].map(catName => (
                    <button
                      key={catName}
                      onClick={() => { setActiveCategory(catName); setVisibleCount(5); }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                        activeCategory === catName 
                          ? 'bg-[#027244] text-white shadow-xs' 
                          : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {catName}
                    </button>
                  ))}
                  
                  {/* More Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center gap-1 ${
                        !['All', ...STANDARD_CATEGORIES.slice(0, 4)].includes(activeCategory) ? 'border-[#027244] text-[#027244]' : ''
                      }`}
                    >
                      <span>{['All', ...STANDARD_CATEGORIES.slice(0, 4)].includes(activeCategory) ? 'More' : activeCategory}</span>
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    
                    {isMoreMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setIsMoreMenuOpen(false)} />
                        <div className="absolute right-0 mt-1.5 bg-white border border-slate-200 shadow-xl rounded-xl py-2 w-48 z-30 animate-fadeIn">
                          {activeCategoriesList.slice(5).map(catName => (
                            <button
                              key={catName}
                              onClick={() => {
                                setActiveCategory(catName);
                                setVisibleCount(5);
                                setIsMoreMenuOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 flex items-center justify-between ${
                                activeCategory === catName ? 'text-[#027244] bg-emerald-50/50' : 'text-slate-650'
                              }`}
                            >
                              <span>{catName}</span>
                              {activeCategory === catName && <Check className="h-3.5 w-3.5 text-[#027244]" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sorting Widget */}
            <div className="flex items-center gap-2 self-end text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-1.5 w-fit shadow-3xs select-none">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-extrabold text-[#001c41] focus:outline-none cursor-pointer"
              >
                <option value="Recent">Most Recent</option>
                <option value="Popular">Most Popular</option>
                <option value="Discussed">Most Discussed</option>
              </select>
            </div>

            {/* List block */}
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-2.5 text-slate-450 w-full">
                <RefreshCw className="h-7 w-7 text-emerald-600 animate-spin" />
                <span className="text-xs font-bold">Synchronizing regional articles...</span>
              </div>
            ) : sortedBlogs.length === 0 ? (
              <div className="py-16 bg-white border border-slate-200 shadow-sm rounded-3xl text-center p-8 flex flex-col items-center gap-5 w-full">
                <div className="h-14 w-14 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">No Articles Found</h3>
                  <p className="text-xs text-slate-450 font-semibold leading-relaxed mt-1.5">
                    We couldn't find any articles matching your criteria in this category. Be the first to publish one!
                  </p>
                </div>
                <button 
                  onClick={handleWriteClick}
                  className="py-2.5 px-6 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-all"
                >
                  Write a Blog Post Now
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6 w-full">
                {sortedBlogs.slice(0, visibleCount).map((blog) => {
                  const words = blog.content.split(' ').length;
                  const readTime = Math.max(Math.ceil(words / 150), 1);

                  return (
                    <article key={blog._id} className="bg-white border border-slate-200/80 rounded-[24px] overflow-hidden p-5 shadow-2xs hover:shadow-sm transition-shadow flex flex-col md:flex-row gap-5 cursor-pointer group" onClick={() => navigate(`/blogs/${blog._id}`)}>
                      
                      {/* Left side Image */}
                      <div className="w-full md:w-56 h-36 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100 relative">
                        <img 
                          src={blog.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'} 
                          alt={blog.title} 
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                      </div>

                      {/* Right side contents */}
                      <div className="flex-1 flex flex-col justify-between gap-4 text-left">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <span className="text-[9.5px] font-black uppercase text-[#027244] tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                              {blog.category || 'Business Tips'}
                            </span>
                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(blog.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {readTime} Min Read
                              </span>
                            </div>
                          </div>

                          <h3 className="font-extrabold text-base text-[#001c41] group-hover:text-[#027244] transition-colors leading-snug">
                            {blog.title}
                          </h3>

                          <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-2">
                            {blog.content}
                          </p>
                        </div>

                        {/* Author & Actions bar */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 text-xs font-semibold text-slate-600">
                          
                          {/* Author badge */}
                          <div className="flex items-center gap-2">
                            <div className="h-6.5 w-6.5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-[9px] uppercase border border-blue-100 shadow-3xs">
                              {blog.authorName.charAt(0)}
                            </div>
                            <span className="font-extrabold text-slate-700 text-xs truncate max-w-[110px]">{blog.authorName}</span>
                          </div>

                          <div className="flex items-center gap-4 text-[10.5px] text-slate-400">
                            {blog.showLikes && (
                              <span className="flex items-center gap-1 font-black text-rose-500">
                                <Heart className="h-3.5 w-3.5 fill-rose-50" />
                                {blog.likes?.length || 0}
                              </span>
                            )}
                            {blog.showComments && (
                              <span className="flex items-center gap-1 font-black text-blue-500">
                                <MessageSquare className="h-3.5 w-3.5 fill-blue-50" />
                                {blog.comments?.length || 0}
                              </span>
                            )}
                            <button
                              onClick={(e) => handleShareClick(e, blog._id)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600 cursor-pointer relative flex items-center justify-center transition-colors border-none"
                              title="Share Article"
                            >
                              {copiedBlogId === blog._id ? (
                                <span className="absolute -top-7 right-0 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap animate-fadeIn">
                                  Copied!
                                </span>
                              ) : null}
                              <Share2 className="h-3.5 w-3.5" />
                            </button>
                            
                            <button 
                              onClick={() => navigate(`/blogs/${blog._id}`)}
                              className="py-1 px-3 border border-[#027244] hover:bg-emerald-50 text-[#027244] text-[10px] font-black rounded-lg cursor-pointer transition-colors ml-1"
                            >
                              Read More
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Load More Button */}
            {sortedBlogs.length > visibleCount && (
              <button
                onClick={() => setVisibleCount(prev => prev + 5)}
                className="py-3 bg-white border border-slate-200 hover:bg-slate-50 text-[#001c41] font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-transform hover:-translate-y-0.5 mt-2 w-full max-w-xs mx-auto"
              >
                <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                <span>Load More Articles</span>
              </button>
            )}

          </div>

          {/* Right Column: Sidebar Widgets */}
          <div className="flex flex-col gap-6 text-left">
            
            {/* Widget 1: Categories Counts */}
            <div className="bg-white border border-slate-200/80 shadow-sm rounded-3xl p-5">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-extrabold text-slate-800 text-sm">Categories</h3>
                <button onClick={() => setActiveCategory('All')} className="text-xs font-extrabold text-[#027244] hover:underline cursor-pointer">
                  View All
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                {activeCategoriesList.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setVisibleCount(5); }}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      activeCategory === cat 
                        ? 'bg-emerald-50/50 text-[#027244] font-extrabold border border-emerald-100/50' 
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {getCategoryIcon(cat)}
                      <span>{cat}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      activeCategory === cat ? 'bg-[#027244] text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {categoryCounts[cat] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Widget 2: Popular Posts */}
            <div className="bg-white border border-slate-200/80 shadow-sm rounded-3xl p-5">
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-extrabold text-slate-800 text-sm">Popular Posts</h3>
              </div>

              <div className="flex flex-col gap-4">
                {popularBlogs.map(blog => (
                  <div key={blog._id} className="flex gap-3 cursor-pointer group" onClick={() => navigate(`/blogs/${blog._id}`)}>
                    <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
                      <img src={blog.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <h4 className="text-xs font-extrabold text-slate-700 leading-snug line-clamp-2 group-hover:text-[#027244] transition-colors">
                        {blog.title}
                      </h4>
                      <span className="text-[9px] font-bold text-slate-400">
                        {new Date(blog.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                      </span>
                    </div>
                  </div>
                ))}
                {popularBlogs.length === 0 && (
                  <span className="text-xs text-slate-400 font-semibold py-4 text-center">No popular posts yet.</span>
                )}
              </div>
            </div>

            {/* Widget 3: Newsletter Subscription */}
            <div className="bg-[#001c41] text-white border border-slate-900 shadow-sm rounded-3xl p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-60 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col gap-4">
                <div className="h-9 w-9 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-center text-emerald-450 shrink-0 shadow-2xs">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                
                <div>
                  <h3 className="font-extrabold text-sm text-white leading-tight">Subscribe to Our Newsletter</h3>
                  <span className="text-[10px] text-slate-350 font-bold mt-1.5 block leading-relaxed">
                    Get the latest articles and community insights delivered directly to your inbox.
                  </span>
                </div>

                {subscribed ? (
                  <div className="bg-emerald-950/20 border border-emerald-800 text-emerald-400 p-3 rounded-xl text-[10.5px] font-extrabold text-center animate-fadeIn">
                    ✓ Thank you! You've subscribed successfully.
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800 focus:border-[#027244] p-3 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="py-2.5 px-4 bg-[#027244] hover:bg-[#005934] text-white rounded-xl text-xs font-black cursor-pointer shadow-sm border-none transition-transform hover:-translate-y-0.5"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
                <span className="text-[9px] text-slate-400 font-bold self-center">No spam. Unsubscribe anytime.</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* WRITE A BLOG WIZARD MODAL */}
      {/* ========================================================================= */}
      {showWriteModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 flex flex-col gap-5 animate-scaleUp text-left max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Write a Blog Post</h3>
                <p className="text-slate-450 text-[10px] font-semibold mt-1">Write about your business or write local stories about Udumalpet.</p>
              </div>
              <button 
                onClick={() => setShowWriteModal(false)} 
                className="text-slate-400 hover:text-slate-600 font-extrabold p-1 cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {successMsg ? (
              <div className="bg-blue-50 border border-blue-250 rounded-2xl p-5 flex flex-col items-center gap-4 text-center py-8">
                <CheckCircle className="h-12 w-12 text-blue-600 animate-bounce" />
                <div className="flex flex-col gap-1">
                  <span className="font-extrabold text-slate-800 text-sm">Blog Successfully Submitted!</span>
                  <p className="text-xs text-slate-650 leading-relaxed font-semibold">{successMsg}</p>
                </div>
                <button 
                  onClick={() => setShowWriteModal(false)}
                  className="mt-2 py-2 px-6 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Return to Blogs
                </button>
              </div>
            ) : (
              <form onSubmit={handleWriteSubmit} className="flex flex-col gap-4">
                
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-650 rounded-xl p-3 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Blog Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. A Weekend Guide to Panchalinga Waterfalls"
                    required
                    maxLength={100}
                    className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 bg-slate-50/20"
                  />
                </div>

                {/* Category Selector */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Category</label>
                  <select
                    value={selectedCategoryOption}
                    onChange={(e) => {
                      setSelectedCategoryOption(e.target.value);
                      if (e.target.value !== 'Other') {
                        setCustomCategory('');
                      }
                    }}
                    className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 bg-slate-50/20 cursor-pointer"
                  >
                    {STANDARD_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Other">Other (Type custom category...)</option>
                  </select>
                </div>

                {selectedCategoryOption === 'Other' && (
                  <div className="flex flex-col gap-1 animate-fadeIn">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Custom Category Name</label>
                    <input 
                      type="text" 
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="e.g. Eco Tourism"
                      required
                      maxLength={30}
                      className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 bg-slate-50/20"
                    />
                    
                    {/* Auto-suggest if it matches existing */}
                    {(() => {
                      const trimmed = customCategory.trim();
                      if (!trimmed) return null;
                      const matched = STANDARD_CATEGORIES.find(c => c.toLowerCase() === trimmed.toLowerCase());
                      if (matched) {
                        return (
                          <div className="bg-amber-50 border border-amber-250 text-slate-700 text-[10px] font-bold p-3 rounded-xl flex items-center justify-between gap-3 mt-1.5 animate-fadeIn">
                            <div className="flex items-center gap-1.5">
                              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                              <span>It looks like you typed <strong>"{matched}"</strong>, which already exists.</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCategoryOption(matched);
                                setCustomCategory('');
                              }}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded font-black text-[9px] cursor-pointer"
                            >
                              Choose "{matched}"
                            </button>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Cover Image</label>
                  
                  {coverImage ? (
                    <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 p-2 flex items-center justify-between gap-3 group">
                      <div className="flex items-center gap-3">
                        <img 
                          src={coverImage} 
                          alt="Cover preview" 
                          className="h-14 w-20 object-cover rounded-lg border border-slate-200/60 shadow-2xs"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">Cover Image Selected</span>
                          <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[200px]">{coverImage}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCoverImage('')}
                        className="p-2 hover:bg-red-50 text-slate-450 hover:text-red-650 rounded-xl transition-colors cursor-pointer border-none flex items-center justify-center shrink-0"
                        title="Remove Image"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ) : (
                    <div className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 transition-colors bg-slate-50/20 ${imageUploading ? 'border-blue-300 bg-blue-50/5' : 'border-slate-200 hover:bg-slate-50/40'}`}>
                      {imageUploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <RefreshCw className="h-7 w-7 text-blue-600 animate-spin" />
                          <span className="text-[11px] font-bold text-slate-500">Uploading image to secure storage...</span>
                        </div>
                      ) : (
                        <>
                          <div className="h-9 w-9 bg-slate-50 text-slate-500 border border-slate-100 rounded-xl flex items-center justify-center shadow-3xs">
                            <Upload className="h-4.5 w-4.5" />
                          </div>
                          <div className="text-center flex flex-col items-center">
                            <span className="text-xs font-extrabold text-slate-700">Choose a cover image</span>
                            <span className="text-[10px] text-slate-450 font-bold mt-0.5">PNG, JPG, JPEG, WEBP (Max 5MB)</span>
                          </div>
                          <input 
                            type="file" 
                            accept="image/*"
                            id="blog-image-upload"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label 
                            htmlFor="blog-image-upload"
                            className="py-1.5 px-4 border border-slate-200 hover:border-slate-300 rounded-xl text-[10.5px] font-extrabold text-slate-600 hover:bg-white transition-all cursor-pointer shadow-3xs hover:shadow-2xs select-none"
                          >
                            Select File
                          </label>
                        </>
                      )}
                    </div>
                  )}

                  {imageError && (
                    <span className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {imageError}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Blog Content</label>
                  <textarea 
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write details about your business, local guides, or stories about Udumalpet here..."
                    required
                    className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 bg-slate-50/20 resize-none leading-relaxed"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3.5 text-[10px] font-semibold text-slate-600 leading-relaxed text-left flex items-start gap-2.5">
                  <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-800 block mb-0.5">Approval Process:</strong>
                    Listing blogs is **100% Free** with no subscription constraint! After submission, it will immediately enter the secure admin approval desk. The platform administrator will review it for quality, and publish it on the main feeds shortly.
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-1 border-t border-slate-100 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowWriteModal(false)}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-755 font-extrabold text-[10.5px] rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={writeLoading || imageUploading}
                    className="py-2.5 px-6 bg-[#001c41] hover:bg-[#0b1b3d] text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer shadow-md shadow-blue-800/10 flex items-center gap-2 disabled:opacity-60"
                  >
                    {(writeLoading || imageUploading) && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                    <span>Submit Blog Post</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
