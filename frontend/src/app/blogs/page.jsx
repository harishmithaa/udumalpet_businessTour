import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  BookOpen, Search, Plus, Calendar, User, Heart, MessageSquare, Clock, X, CheckCircle, AlertCircle, ArrowLeft, RefreshCw, Share2, Upload, Trash2
} from 'lucide-react';

const mockBlogs = [
  {
    _id: 'blog_1',
    title: '10 Simple Habits for a Productive and Creative Life',
    content: 'Developing daily habits that support creativity and productivity can transform your personal and professional life. In this article, we explore actionable strategies like morning routines, mindful scheduling, time blocking, and minimizing digital distractions. Learn how small changes can lead to large shifts in focus, creative output, and overall mental well-being.',
    coverImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80',
    authorName: 'Ananth Sundar',
    status: 'Approved',
    showLikes: true,
    showComments: true,
    likes: ['user1', 'user2', 'user3'],
    comments: [
      { _id: 'c1', userName: 'Karthik S.', text: 'Very practical advice! The section on digital distractions is highly relevant.', createdAt: new Date() },
      { _id: 'c2', userName: 'Meena Devi', text: 'Loved the ideas for time blocking. Planning to try that soon.', createdAt: new Date() }
    ],
    createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'blog_2',
    title: 'The Art of Slow Living: Finding Peace in a Fast-Paced World',
    content: 'In a world that constantly encourages speed, choosing to slow down is a deliberate and rewarding act. Slow living is not about doing everything at a snail\'s pace; it is about doing things at the right pace. Discover how mindfulness, decluttering, appreciating nature, and taking periodic digital detoxes can help you reclaim your time, reduce stress, and savor the present moment.',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    authorName: 'Senthil Kumar',
    status: 'Approved',
    showLikes: true,
    showComments: true,
    likes: ['user1', 'user2'],
    comments: [
      { _id: 'c3', userName: 'Vignesh R.', text: 'Decluttering is indeed key. Great breakdown of mindful practices.', createdAt: new Date() }
    ],
    createdAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'blog_3',
    title: 'A Beginner\'s Guide to Photography: Capturing Everyday Moments',
    content: 'Photography is more than just owning a camera; it is about learning how to see light, compose stories, and capture feelings. Whether you are using a smartphone or a professional DSLR, understanding basics like the rule of thirds, ambient light, and framing can elevate your shots. We share practical tips to help you capture everyday stories and preserve memories.',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    authorName: 'Priya Ramesh',
    status: 'Approved',
    showLikes: true,
    showComments: false,
    likes: ['user1', 'user4', 'user5', 'user6'],
    comments: [],
    createdAt: new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000)
  }
];

export default function BlogsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedBlogId, setCopiedBlogId] = useState(null);
  
  // Auth state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Write Modal States
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [writeLoading, setWriteLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    // Check auth
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
          coverImage: coverImage || undefined
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccessMsg('Your blog has been successfully submitted and is awaiting admin approval. Once approved, it will be published publicly!');
        setTitle('');
        setCoverImage('');
        setContent('');
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
      setTitle('');
      setCoverImage('');
      setContent('');
      setTimeout(() => {
        setShowWriteModal(false);
        setSuccessMsg('');
      }, 5000);
    } finally {
      setWriteLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col items-center bg-[#F8FAFC]">
      
      {/* 1. Header Banner */}
      <section 
        className="w-full relative py-12 px-4 md:px-8 bg-cover bg-center text-white overflow-hidden shadow-md"
        style={{ backgroundImage: "linear-gradient(to bottom, rgba(0, 28, 65, 0.8), rgba(0, 28, 65, 0.95)), url('/thirumoorthy_hills.png')" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto flex flex-col items-center z-10 text-left">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-slate-350 font-bold self-start mt-2">
            <Link to="/" className="hover:text-emerald-450 transition-colors">Home</Link>
            <span className="text-slate-500">&gt;</span>
            <span className="text-slate-150">Blogs</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-4 self-start font-sans">
            Udumalpet Business & Local Stories
          </h1>
          
          <p className="text-slate-350 text-xs font-semibold self-start mt-1.5 leading-relaxed max-w-2xl">
            Write about your business, share your experiences, or discover stories about Udumalpet to connect with the local community.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="mt-8 w-full bg-white border border-slate-200 shadow-xl rounded-2xl p-2 flex gap-2 max-w-3xl">
            <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
              <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search articles or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none"
              />
            </div>
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

      {/* 2. Blog Directory stream */}
      <section className="max-w-7xl w-full px-4 md:px-8 py-12 flex flex-col gap-8 min-h-[50vh]">
        <div className="flex justify-between items-center border-b border-slate-200/80 pb-3">
          <h2 className="text-xl font-extrabold text-[#001c41] tracking-tight">Recent Articles</h2>
          <span className="text-xs text-slate-450 font-bold">{filteredBlogs.length} articles found</span>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2.5 text-slate-400">
            <RefreshCw className="h-7 w-7 text-blue-600 animate-spin" />
            <span className="text-xs font-bold">Synchronizing regional articles...</span>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-20 bg-white border border-slate-200 shadow-sm rounded-3xl text-center p-8 flex flex-col items-center gap-5 max-w-md mx-auto">
            <div className="h-14 w-14 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">No Articles Found</h3>
              <p className="text-xs text-slate-450 font-semibold leading-relaxed mt-1.5">
                We couldn't find any articles matching your search criteria. Be the first to share an insight!
              </p>
            </div>
            <button 
              onClick={handleWriteClick}
              className="py-2.5 px-6 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-transform hover:-translate-y-0.5"
            >
              Write a Blog Post Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => {
              // Calculate rough read time
              const words = blog.content.split(' ').length;
              const readTime = Math.max(Math.ceil(words / 150), 1);

              return (
                <article key={blog._id} className="card-premium group rounded-2xl overflow-hidden flex flex-col cursor-pointer bg-white">
                  <Link to={`/blogs/${blog._id}`} className="h-48 w-full overflow-hidden block">
                    <img 
                      src={blog.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'} 
                      alt={blog.title} 
                      className="w-full h-full object-cover transition-transform duration-750 ease-out-expo group-hover:scale-105"
                    />
                  </Link>

                  <div className="p-6 flex-grow flex flex-col justify-between gap-5 text-left">
                    <div className="flex flex-col gap-3">
                      
                      {/* Date & read time header */}
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(blog.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {readTime} Min Read
                        </span>
                      </div>

                      <h3 className="font-extrabold text-base text-[#001c41] group-hover:text-[#027244] transition-colors leading-snug">
                        <Link to={`/blogs/${blog._id}`}>
                          {blog.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                        {blog.content}
                      </p>

                    </div>

                    {/* Author & Interactions footer */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">
                      
                      {/* Author badge */}
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-[10px] uppercase select-none border border-blue-100 shadow-2xs">
                          {blog.authorName.charAt(0)}
                        </div>
                        <span className="font-extrabold text-slate-800 text-xs truncate max-w-[120px]">{blog.authorName}</span>
                      </div>

                      {/* Toggles counters */}
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        {blog.showLikes && (
                          <span className="flex items-center gap-1 font-extrabold text-rose-500">
                            <Heart className="h-3.5 w-3.5 fill-rose-50" />
                            {blog.likes.length}
                          </span>
                        )}
                        {blog.showComments && (
                          <span className="flex items-center gap-1 font-extrabold text-blue-500">
                            <MessageSquare className="h-3.5 w-3.5 fill-blue-50" />
                            {blog.comments.length}
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
                      </div>

                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

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
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">{successMsg}</p>
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
                    rows={8}
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
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[10.5px] rounded-xl cursor-pointer"
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
