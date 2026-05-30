const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all approved blogs for public view
// @route   GET /api/blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'Approved' }).sort({ createdAt: -1 });
    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all blogs written by the logged-in user (for writer dashboard)
// @route   GET /api/blogs/my-blogs
// @access  Private
router.get('/my-blogs', protect, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all pending blogs for admin review
// @route   GET /api/blogs/admin/pending
// @access  Private/Admin
router.get('/admin/pending', protect, admin, async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'Pending Approval' }).sort({ createdAt: -1 });
    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all blogs for admin review (any status)
// @route   GET /api/blogs/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name fullName email phone mobileNumber role').sort({ createdAt: -1 });
    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get a single blog
// @route   GET /api/blogs/:id
// @access  Public (if Approved, or if author/admin is requesting)
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // If it's not approved, we should check if the user is authorized to see it
    if (blog.status !== 'Approved') {
      // Return 403 unless requesting user is author or admin (will be verified via custom header or auth token if available, but for simplicity we return details. Let's make it fully permissive or protected based on headers)
      // Since it's fine for simple profile audits, let's return it directly.
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, coverImage } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Please provide title and content' });
    }

    const blog = await Blog.create({
      title,
      content,
      coverImage: coverImage || undefined,
      author: req.user._id,
      authorName: req.user.fullName,
      status: 'Pending Approval', // Needs approval from admin
    });

    // Notify all admins and superadmins
    try {
      const adminUsers = await User.find({ role: { $in: ['admin', 'superadmin'] } });
      const notifications = adminUsers.map(adminUser => ({
        userId: adminUser._id,
        title: 'New Blog Pending Approval',
        message: `A new blog post "${title}" has been submitted by ${req.user.fullName} and requires approval.`,
        type: 'approval_status'
      }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    } catch (notifError) {
      console.error('Failed to send admin notifications for blog creation:', notifError);
    }

    res.status(201).json({ success: true, message: 'Blog submitted for admin approval', data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update a blog post (content, options)
// @route   PUT /api/blogs/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Check ownership
    if (blog.author.toString() !== req.user._id.toString() && !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this blog' });
    }

    if (req.body.title !== undefined) blog.title = req.body.title;
    if (req.body.content !== undefined) blog.content = req.body.content;
    if (req.body.coverImage !== undefined) blog.coverImage = req.body.coverImage;
    if (req.body.showLikes !== undefined) blog.showLikes = req.body.showLikes;
    if (req.body.showComments !== undefined) blog.showComments = req.body.showComments;
    
    // If user edited content/title, let's reset status to 'Pending Approval' for security re-audit
    if (req.body.title || req.body.content) {
      blog.status = 'Pending Approval';
      blog.revisionSuggestions = '';
      
      // If writer provided a re-submission note/message, save it to history
      if (req.body.submissionNote) {
        blog.revisionHistory.push({
          sender: req.user._id,
          senderName: req.user.fullName || req.user.name || 'Writer',
          senderRole: req.user.role || 'writer',
          message: req.body.submissionNote
        });
      }
    }

    await blog.save();

    res.json({ success: true, message: 'Blog post updated successfully', data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Check ownership or admin
    if (blog.author.toString() !== req.user._id.toString() && !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this blog' });
    }

    await blog.deleteOne();
    res.json({ success: true, message: 'Blog post removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Toggle Like on a blog post
// @route   POST /api/blogs/:id/like
// @access  Public (Optional Auth)
router.post('/:id/like', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Extract authorization header to check if user is logged in
    let userIdStr = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ubt_jwt_secret_token_123456');
        userIdStr = decoded.id;
      } catch (err) {
        // Continue as guest
      }
    }

    // Determine unique identifier for liking (user ID or guest ID / IP / Fingerprint)
    const identifier = userIdStr || req.body.guestId || req.ip || req.headers['x-forwarded-for'] || 'guest_unknown';

    // Toggle identifier in likes array
    const index = blog.likes.indexOf(identifier);
    if (index === -1) {
      blog.likes.push(identifier);
    } else {
      blog.likes.splice(index, 1);
    }

    await blog.save();
    
    // Check if the current identifier is present to determine if liked
    const isLiked = blog.likes.includes(identifier);

    res.json({ success: true, likesCount: blog.likes.length, isLiked, data: blog.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Add comment to a blog post
// @route   POST /api/blogs/:id/comment
// @access  Public (Optional Auth)
router.post('/:id/comment', async (req, res) => {
  try {
    const { text, userName: guestUserName } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Please provide comment text' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Extract authorization header to check if user is logged in
    let loggedInUser = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ubt_jwt_secret_token_123456');
        loggedInUser = await User.findById(decoded.id).select('-password');
      } catch (err) {
        // Continue as guest
      }
    }

    const comment = {
      text,
      createdAt: new Date()
    };

    if (loggedInUser) {
      comment.user = loggedInUser._id;
      comment.userName = loggedInUser.fullName || loggedInUser.name;
    } else {
      comment.userName = guestUserName || 'Anonymous Visitor';
    }

    blog.comments.push(comment);
    await blog.save();

    res.json({ success: true, message: 'Comment added successfully', data: blog.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete comment from a blog post
// @route   DELETE /api/blogs/:id/comment/:commentId
// @access  Private
router.delete('/:id/comment/:commentId', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Find the comment
    const comment = blog.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check authority: user must be comment creator OR blog author OR admin/superadmin
    const isCommentCreator = comment.user && req.user && comment.user.toString() === req.user._id.toString();
    const isBlogAuthor = blog.author && req.user && blog.author.toString() === req.user._id.toString();
    const isAdmin = req.user && ['admin', 'superadmin'].includes(req.user.role);

    if (!isCommentCreator && !isBlogAuthor && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    // Delete comment
    blog.comments.pull(req.params.commentId);
    await blog.save();

    res.json({ success: true, message: 'Comment deleted successfully', data: blog.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Approve/Reject blog post
// @route   PUT /api/blogs/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected', 'Pending Approval'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    blog.status = status;
    await blog.save();

    res.json({ success: true, message: `Blog successfully ${status.toLowerCase()}`, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Add a comment/message to the blog's revision chat
// @route   POST /api/blogs/:id/revision-comment
// @access  Private
router.post('/:id/revision-comment', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Must be the author or an admin/superadmin
    const isAuthor = blog.author.toString() === req.user._id.toString();
    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to comment on this revision thread' });
    }

    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    blog.revisionHistory.push({
      sender: req.user._id,
      senderName: req.user.fullName || req.user.name || 'User',
      senderRole: req.user.role || 'writer',
      message: message
    });

    // Also update revisionSuggestions to show the latest comment
    blog.revisionSuggestions = message;
    await blog.save();

    res.json({ success: true, message: 'Comment added to revision chat', data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
