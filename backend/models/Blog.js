const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  userName: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'
  },
  thumbnail: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  authorName: {
    type: String,
    required: true
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
  },
  status: {
    type: String,
    enum: ['Pending Approval', 'Approved', 'Rejected', 'Needs Revision'],
    default: 'Pending Approval'
  },
  revisionSuggestions: {
    type: String,
    default: ''
  },
  revisionHistory: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      senderName: {
        type: String,
        required: true
      },
      senderRole: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  featured: {
    type: Boolean,
    default: false,
  },
  showLikes: {
    type: Boolean,
    default: true
  },
  showComments: {
    type: Boolean,
    default: true
  },
  likes: [
    {
      type: String
    }
  ],
  comments: [CommentSchema],
}, {
  timestamps: true
});

// Auto-sync backward compatibility fields and slug generation
BlogSchema.pre('save', async function() {
  if (this.author && !this.authorId) this.authorId = this.author;
  if (this.authorId && !this.author) this.author = this.authorId;
  
  if (this.coverImage && !this.thumbnail) this.thumbnail = this.coverImage;
  if (this.thumbnail && !this.coverImage) this.coverImage = this.thumbnail;
  
  if (this.title && this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
});

module.exports = mongoose.model('Blog', BlogSchema);
