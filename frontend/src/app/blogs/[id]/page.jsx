import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, User, Heart, MessageSquare, Clock, Send, Trash2, RefreshCw, AlertCircle, ShieldCheck, Share2
} from 'lucide-react';

const mockBlogs = [
  {
    _id: 'blog_1',
    title: '10 Simple Habits for a Productive and Creative Life',
    content: 'Developing daily habits that support creativity and productivity can transform your personal and professional life. In this article, we explore actionable strategies like morning routines, mindful scheduling, time blocking, and minimizing digital distractions. Learn how small changes can lead to large shifts in focus, creative output, and overall mental well-being.',
    coverImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80',
    author: 'author_fallback_1',
    authorName: 'Ananth Sundar',
    status: 'Approved',
    showLikes: true,
    showComments: true,
    likes: ['user1', 'user2', 'user3'],
    comments: [
      { _id: 'c1', user: 'u1', userName: 'Karthik S.', text: 'Very practical advice! The section on digital distractions is highly relevant.', createdAt: new Date() },
      { _id: 'c2', user: 'u2', userName: 'Meena Devi', text: 'Loved the ideas for time blocking. Planning to try that soon.', createdAt: new Date() }
    ],
    createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'blog_2',
    title: 'The Art of Slow Living: Finding Peace in a Fast-Paced World',
    content: 'In a world that constantly encourages speed, choosing to slow down is a deliberate and rewarding act. Slow living is not about doing everything at a snail\'s pace; it is about doing things at the right pace. Discover how mindfulness, decluttering, appreciating nature, and taking periodic digital detoxes can help you reclaim your time, reduce stress, and savor the present moment.',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    author: 'author_fallback_2',
    authorName: 'Senthil Kumar',
    status: 'Approved',
    showLikes: true,
    showComments: true,
    likes: ['user1', 'user2'],
    comments: [
      { _id: 'c3', user: 'u3', userName: 'Vignesh R.', text: 'Decluttering is indeed key. Great breakdown of mindful practices.', createdAt: new Date() }
    ],
    createdAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'blog_3',
    title: 'A Beginner\'s Guide to Photography: Capturing Everyday Moments',
    content: 'Photography is more than just owning a camera; it is about learning how to see light, compose stories, and capture feelings. Whether you are using a smartphone or a professional DSLR, understanding basics like the rule of thirds, ambient light, and framing can elevate your shots. We share practical tips to help you capture everyday stories and preserve memories.',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    author: 'author_fallback_3',
    authorName: 'Priya Ramesh',
    status: 'Approved',
    showLikes: true,
    showComments: false,
    likes: ['user1', 'user4', 'user5', 'user6'],
    comments: [],
    createdAt: new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000)
  }
];

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [guestName, setGuestName] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

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

    fetchBlogDetails();
  }, [id]);

  const fetchBlogDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${id}`);
      const data = await res.json();
      if (data.success) {
        setBlog(data.data);
      } else {
        throw new Error('Not found');
      }
    } catch (err) {
      console.warn('Backend server offline, searching mock datasets.');
      const mockObj = mockBlogs.find(b => b._id === id);
      if (mockObj) {
        setBlog(mockObj);
      } else {
        setBlog(null);
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

      const res = await fetch(`http://localhost:5000/api/blogs/${id}/like`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ guestId })
      });
      const data = await res.json();
      if (data.success) {
        setBlog(prev => ({
          ...prev,
          likes: data.data
        }));
      }
    } catch (err) {
      // Mock toggle locally
      if (blog) {
        const identifier = (user?._id || user?.id) || localStorage.getItem('ubt_guest_id') || 'guest_temp';
        const isLiked = blog.likes.includes(identifier);
        const newLikes = isLiked 
          ? blog.likes.filter(uid => uid !== identifier)
          : [...blog.likes, identifier];
        setBlog(prev => ({
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

      const res = await fetch(`http://localhost:5000/api/blogs/${id}/comment`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setBlog(prev => ({
          ...prev,
          comments: data.data
        }));
        setCommentText('');
        setGuestName('');
      }
    } catch (err) {
      // Mock post locally
      const mockComment = {
        _id: 'mock_c_' + Math.random().toString(36).substr(2, 9),
        user: user ? (user._id || user.id) : undefined,
        userName: user ? user.fullName : (guestName.trim() || 'Anonymous Visitor'),
        text: commentText,
        createdAt: new Date()
      };
      setBlog(prev => ({
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
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${id}/comment/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBlog(prev => ({
          ...prev,
          comments: data.data
        }));
      }
    } catch (err) {
      // Mock delete locally
      setBlog(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c._id !== commentId)
      }));
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-3 text-slate-400 min-h-[70vh]">
        <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="text-xs font-bold">Loading full article...</span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-slate-200 shadow rounded-3xl text-center flex flex-col items-center gap-5">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm">Article Not Found</h3>
          <p className="text-xs text-slate-450 font-semibold leading-relaxed mt-1">
            The blog post you are looking for does not exist or has been deleted.
          </p>
        </div>
        <Link 
          to="/blogs" 
          className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow transition-transform hover:-translate-y-0.5"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  const currentGuestId = localStorage.getItem('ubt_guest_id');
  const isLiked = blog && (
    (user && (blog.likes.includes(user._id) || blog.likes.includes(user.id))) ||
    (!user && currentGuestId && blog.likes.includes(currentGuestId))
  );
  const words = blog.content.split(' ').length;
  const readTime = Math.max(Math.ceil(words / 150), 1);

  // Author comment delete permission helper
  const canDeleteComment = (comment) => {
    if (!user) return false;
    const currentUserId = user._id || user.id;
    if (!currentUserId) return false;
    const isCommentCreator = comment.user && comment.user.toString() === currentUserId.toString();
    const isBlogAuthor = blog.author && blog.author.toString() === currentUserId.toString();
    const isAdmin = ['admin', 'superadmin'].includes(user.role);
    return isCommentCreator || isBlogAuthor || isAdmin;
  };

  // Dynamic back navigation route depending on user context
  let backPath = "/blogs";
  let backLabel = "Back to Blogs";
  if (token && user) {
    if (user.role === 'admin') {
      backPath = "/admin";
      backLabel = "Back to Admin Dashboard";
    } else if (user.role === 'superadmin') {
      backPath = "/superadmin";
      backLabel = "Back to SuperAdmin Dashboard";
    } else {
      backPath = "/dashboard?tab=My Blogs";
      backLabel = "Back to My Blogs";
    }
  }

  return (
    <div className="w-full flex flex-col items-center bg-[#F8FAFC] pb-16 font-sans">
      
      {/* Container */}
      <div className="max-w-4xl w-full px-4 md:px-8 mt-8 flex flex-col gap-6 text-left">
        
        {/* Back Link */}
        <Link 
          to={backPath} 
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-blue-600 transition-colors py-1 hover:-translate-x-0.5 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" /> {backLabel}
        </Link>

        {/* Cover Landscape */}
        <div className="w-full h-[320px] md:h-[420px] rounded-3xl overflow-hidden border border-slate-200/60 shadow-md relative select-none">
          <img 
            src={blog.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'} 
            alt={blog.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
        </div>

        {/* Article Details Card */}
        <article className="bg-white border border-slate-200/80 shadow-lg rounded-[28px] p-6 md:p-10 flex flex-col gap-6 -mt-16 relative z-10 mx-2 md:mx-6">
          
          {/* Header info */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 border-b border-slate-100 pb-5">
            {blog.category && (
              <span className="bg-emerald-50 text-[#027244] border border-emerald-250 px-2.5 py-0.5 rounded-md text-[9.5px] font-black uppercase tracking-wider select-none">
                {blog.category}
              </span>
            )}
            <Link 
              to={`/profile/${blog.author || blog.authorId}`}
              className="flex items-center gap-1.5 text-slate-700 hover:text-[#027244] transition-colors group cursor-pointer"
            >
              <div className="h-6.5 w-6.5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-[9.5px] uppercase select-none border border-blue-100 shadow-2xs group-hover:bg-[#027244]/10 group-hover:text-[#027244] group-hover:border-[#027244]/20 transition-all">
                {blog.authorName.charAt(0)}
              </div>
              <span className="font-extrabold">Written by {blog.authorName}</span>
              <span className="text-[9.5px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md group-hover:bg-[#E6F4EA] group-hover:text-[#027244] transition-all ml-1.5">View Profile</span>
            </Link>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(blog.createdAt).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'})}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {readTime} Min Read
            </span>
            {blog.status !== 'Approved' && (
              <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ml-auto animate-pulse select-none">
                {blog.status}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#001c41] tracking-tight leading-snug">
            {blog.title}
          </h1>

          {/* Content */}
          <div className="text-slate-600 text-sm md:text-base font-medium leading-relaxed whitespace-pre-line flex flex-col gap-4 font-sans">
            {blog.content}
          </div>

          {/* 3. Interactions panel */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-4 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {blog.showLikes && (
                <>
                  <button 
                    onClick={handleLike}
                    disabled={likeLoading}
                    className={`py-2 px-5 rounded-2xl flex items-center gap-2.5 text-xs font-extrabold shadow-sm transition-all cursor-pointer border ${
                      isLiked 
                        ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100/60' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <Heart className={`h-4.5 w-4.5 transition-transform group-hover:scale-110 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
                    <span>{isLiked ? 'Liked' : 'Like Article'}</span>
                  </button>
                  <span className="text-slate-400 text-xs font-bold">{blog.likes.length} people liked this article</span>
                </>
              )}
            </div>
            
            <button
              onClick={handleShare}
              className="py-2 px-5 rounded-2xl flex items-center gap-2.5 text-xs font-extrabold shadow-sm transition-all cursor-pointer border bg-white border-blue-100 text-blue-900 hover:border-blue-300 relative"
            >
              {shareCopied ? (
                <span className="absolute -top-8 right-0 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap animate-fadeIn">
                  Copied!
                </span>
              ) : null}
              <Share2 className="h-4.5 w-4.5 text-blue-600" />
              <span>Share Article</span>
            </button>
          </div>

        </article>

        {/* 4. Comments Feed Section (If showComments is enabled) */}
        {blog.showComments && (
          <div className="bg-white border border-slate-200/80 shadow-md rounded-[28px] p-6 md:p-8 flex flex-col gap-6 mx-2 md:mx-6">
            
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <h3 className="font-extrabold text-sm text-[#001c41]">Comments ({blog.comments.length})</h3>
            </div>

            {/* Comments List */}
            <div className="flex flex-col divide-y divide-slate-100">
              {blog.comments.length === 0 ? (
                <div className="py-8 text-center text-slate-450 text-xs font-semibold leading-relaxed">
                  No comments yet. Share your thoughts and start the conversation!
                </div>
              ) : (
                blog.comments.map((comment) => (
                  <div key={comment._id} className="flex gap-4 py-4.5 first:pt-0 last:pb-0 group">
                    {/* Circle avatar */}
                    <div className="h-8.5 w-8.5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-extrabold text-[#001c41] text-xs shadow-inner uppercase shrink-0 select-none">
                      {comment.userName.charAt(0)}
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

                    {/* Trash Delete comment action button (Shown to comment creator or blog owner or admin) */}
                    {canDeleteComment(comment) && (
                      <button 
                        onClick={() => handleCommentDelete(comment._id)}
                        title="Delete comment"
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 text-slate-400 hover:text-red-650 cursor-pointer h-7 w-7 rounded-lg hover:bg-red-50 flex items-center justify-center shrink-0 self-start"
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
              {!token && (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Your Name (Optional)"
                    disabled={commentLoading}
                    className="w-full sm:w-1/3 border border-slate-200/70 p-2 px-4 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 bg-slate-50/20"
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
                  className="w-full border border-slate-200/70 p-3 px-4 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 bg-slate-50/20"
                />
                <button 
                  type="submit"
                  disabled={commentLoading || !commentText.trim()}
                  className="bg-[#001c41] hover:bg-[#0b1b3d] disabled:opacity-40 text-white rounded-xl h-11 w-11 flex items-center justify-center shrink-0 cursor-pointer shadow-md transition-colors"
                >
                  {commentLoading ? <RefreshCw className="h-4.5 w-4.5 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </form>

          </div>
        )}

      </div>

    </div>
  );
}
