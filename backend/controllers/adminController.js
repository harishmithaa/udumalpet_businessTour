const Business = require('../models/Business');
const Blog = require('../models/Blog');
const Event = require('../models/Event');
const Review = require('../models/Review');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AdminAction = require('../models/AdminAction');
const { sendSuccess, sendError } = require('../utils/responseHelper');

/**
 * Moderate business listings (approve, reject, suspend)
 */
const moderateBusiness = async (req, res, next) => {
  try {
    const { businessId, action, remarks } = req.body;

    const business = await Business.findById(businessId);
    if (!business) {
      return sendError(res, 404, 'Business listing not found');
    }

    let nextStatus = 'Pending Verification';
    let nextVerification = 'pending';

    if (action === 'approve') {
      nextStatus = 'Approved';
      nextVerification = 'approved';
    } else if (action === 'reject') {
      nextStatus = 'Rejected';
      nextVerification = 'rejected';
    } else if (action === 'suspend') {
      nextStatus = 'Suspended';
      nextVerification = 'suspended';
    } else if (action === 'reactivate') {
      nextStatus = 'Approved';
      nextVerification = 'approved';
    }

    business.status = nextStatus;
    business.verificationStatus = nextVerification;
    if (action === 'suspend') {
      business.subscriptionStatus = 'none';
      business.isPremium = false;
    }
    await business.save();

    // Log the administrative action audit trail
    await AdminAction.create({
      adminId: req.user._id,
      targetBusinessId: business._id,
      actionType: action,
      remarks: remarks || `Administrative status change to ${nextStatus}`
    });

    // Notify owner
    await Notification.create({
      userId: business.ownerId,
      businessId: business._id,
      title: `Listing Moderation Update`,
      message: `Your business directory "${business.name}" has been ${action}d. Remarks: ${remarks || 'None'}`,
      type: 'approval_status'
    });

    return sendSuccess(res, 200, `Business successfully ${action}d`, business);
  } catch (err) {
    next(err);
  }
};

/**
 * Moderate Blog articles (approve, reject)
 */
const moderateBlog = async (req, res, next) => {
  try {
    const { blogId, status, suggestions } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return sendError(res, 404, 'Blog post not found');
    }

    blog.status = status; // 'Approved', 'Rejected', 'Pending Approval', 'Needs Revision'
    if (status === 'Needs Revision') {
      blog.revisionSuggestions = suggestions || '';
      blog.revisionHistory.push({
        sender: req.user._id,
        senderName: req.user.fullName || req.user.name || 'Admin',
        senderRole: req.user.role || 'admin',
        message: suggestions || ''
      });
    }
    await blog.save();

    // Notify author
    await Notification.create({
      userId: blog.author,
      title: `Blog Moderation Update`,
      message: status === 'Needs Revision'
        ? `Your blog post "${blog.title}" requires revisions: "${suggestions}"`
        : `Your blog post "${blog.title}" has been reviewed and ${status.toLowerCase()} by moderation team.`,
      type: 'approval_status'
    });

    return sendSuccess(res, 200, `Blog article successfully updated to ${status}`, blog);
  } catch (err) {
    next(err);
  }
};

/**
 * Moderate Event listings (approve, reject)
 */
const moderateEvent = async (req, res, next) => {
  try {
    const { eventId, status } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return sendError(res, 404, 'Event listing not found');
    }

    event.status = status; // 'Approved', 'Rejected', 'Pending Review'
    await event.save();

    // Notify organizer
    if (event.ownerId) {
      await Notification.create({
        userId: event.ownerId,
        title: `Event Moderation Update`,
        message: `Your event flyer "${event.title}" has been reviewed and ${status.toLowerCase()} by moderation team.`,
        type: 'approval_status'
      });
    }

    return sendSuccess(res, 200, `Event flyer successfully ${status.toLowerCase()}`, event);
  } catch (err) {
    next(err);
  }
};

/**
 * Moderate user reviews (approve, hide, spam flags)
 */
const moderateReview = async (req, res, next) => {
  try {
    const { reviewId, action } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return sendError(res, 404, 'Review not found');
    }

    if (action === 'delete') {
      await Review.deleteOne({ _id: reviewId });
      return sendSuccess(res, 200, 'Review permanently deleted');
    }

    review.status = action; // 'approved', 'hidden', 'flagged', 'spam'
    await review.save();

    return sendSuccess(res, 200, `Review status updated to ${action}`, review);
  } catch (err) {
    next(err);
  }
};

/**
 * Moderate users directories (suspend, block/unblock)
 */
const moderateUser = async (req, res, next) => {
  try {
    const { userId, status } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, 404, 'User account not found');
    }

    user.status = status; // 'Active', 'Suspended'
    await user.save();

    // Sync status: if user suspended, suspend all their business directories
    if (status === 'Suspended') {
      await Business.updateMany(
        { ownerId: user._id },
        { status: 'Suspended', verificationStatus: 'suspended', isPremium: false, subscriptionStatus: 'none' }
      );
    }

    return sendSuccess(res, 200, `User account successfully marked as ${status}`, user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  moderateBusiness,
  moderateBlog,
  moderateEvent,
  moderateReview,
  moderateUser
};
