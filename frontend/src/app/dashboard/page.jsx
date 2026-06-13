import { useState, useEffect, Suspense, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import MockGoogleMaps from '@/components/MockGoogleMaps';
import { 
  ShieldCheck, Sparkles, AlertTriangle, AlertCircle, Edit3, Image as ImageIcon, 
  RefreshCw, Star, CreditCard, ChevronRight, ChevronLeft, ArrowLeft, Activity, PhoneCall, 
  MessageSquare, Plus, CheckCircle, Info, Bell, ExternalLink, Globe,
  Copy, Check, Gift, Upload, HelpCircle, Briefcase, Mail, Settings, Menu, X, Trash2, Search, Lock,
  FileEdit, BookOpen, Heart, Eye, Calendar, Clock, MapPin, LogOut, Facebook, Instagram, Phone, Users, Move, Utensils
} from 'lucide-react';

const parentCategoryMapping = {
  'Shopping': [
    'Grocery Stores', 'Supermarkets', 'Vegetable & Fruit Shops', 'Textile & Garments', 
    'Footwear Shops', 'Jewelry Shops', 'Gift Shops', 'Stationery & Book Stores', 
    'Furniture Shops', 'Hardware Stores', 'Paint Stores', 'Pet Shops', 'Cosmetic Stores'
  ],
  'Electronics': [
    'Mobile Stores', 'Computer & Laptop Stores', 'Electronics & Appliances'
  ],
  'Food & Restaurants': [
    'Restaurants', 'Hotels & Lodges', 'Bakeries', 'Cafes & Tea Shops', 
    'Sweet Shops', 'Fast Food Centers', 'Catering Services', 'Juice & Ice Cream Parlors'
  ],
  'Health & Medical': [
    'Hospitals', 'Clinics', 'Dental Clinics', 'Pharmacies', 
    'Diagnostic Labs', 'Physiotherapy Centers', 'Veterinary Clinics'
  ],
  'Beauty & Wellness': [
    'Beauty Parlours', 'Salons & Barbers', 'Spa & Wellness Centers'
  ],
  'Education': [
    'Schools', 'Colleges', 'Tuition Centers', 'Coaching Institutes', 
    'Computer Training Centers', 'Driving Schools'
  ],
  'Automotive': [
    'Car Showrooms', 'Bike Showrooms', 'Automobile Service Centers', 
    'Car Wash Services', 'Tyre Shops', 'Spare Parts Dealers', 'Petrol Bunks'
  ],
  'Home Services': [
    'Electricians', 'Plumbers', 'Carpenters', 'AC Service & Repair', 
    'Home Cleaning Services', 'Interior Designers', 'Pest Control Services'
  ],
  'Real Estate': [
    'Real Estate Agencies'
  ],
  'Construction': [
    'Builders & Contractors', 'Construction Material Suppliers', 'Cement & Steel Dealers', 
    'Architects', 'Borewell Services'
  ],
  'Agriculture': [
    'Farm Equipment Dealers', 'Coconut Traders', 'Fertilizer & Pesticide Shops', 
    'Dairy Farms', 'Poultry Farms', 'Agricultural Consultants', 'Irrigation Equipment Suppliers'
  ],
  'Professional Services': [
    'Chartered Accountants', 'Auditors', 'Advocates / Lawyers', 'Tax Consultants'
  ],
  'Finance & Insurance': [
    'Insurance Agents', 'Financial Advisors'
  ],
  'Events & Entertainment': [
    'Event Organizers', 'Wedding Planners', 'Photography & Videography', 
    'Decoration Services', 'Sound & Lighting Services', 'Printing & Flex Services'
  ],
  'Travel & Hospitality': [
    'Travel Agencies', 'Tours & Travels', 'Vehicle Rentals', 'Taxi Services', 'Bus Operators'
  ],
  'Sports & Fitness': [
    'Gyms', 'Yoga Centers', 'Sports Academies', 'Sports Equipment Stores'
  ],
  'Others': [
    'Temples', 'Marriage Halls', 'Community Halls', 'Trusts & NGOs', 'Others'
  ]
};

const availableCategories = [
  'Automotive',
  'Beauty & Wellness',
  'Education',
  'Electronics',
  'Food & Restaurants',
  'Health & Medical',
  'Home Services',
  'Real Estate',
  'Shopping',
  'Manufacturing',
  'Professional Services',
  'Travel & Hospitality',
  'Construction',
  'Agriculture',
  'Finance & Insurance',
  'Events & Entertainment',
  'Sports & Fitness',
  'Others'
];

const getEventDefaultImage = (category) => {
  return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80';
};

function DashboardContent() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const formatEventDateRange = (startDate, endDate) => {
    if (!startDate) return 'N/A';
    const startStr = new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    if (!endDate) return startStr;
    const endStr = new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    if (startStr === endStr) return startStr;
    return `${startStr} - ${endStr}`;
  };
  
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);

  // Food Menu States
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState('');
  
  // Menu Item Modal States
  const [showMenuItemModal, setShowMenuItemModal] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState(null); // null for Add, object for Edit
  const [menuItemName, setMenuItemName] = useState('');
  const [menuItemPrice, setMenuItemPrice] = useState('');
  const [menuItemOfferPrice, setMenuItemOfferPrice] = useState('');
  const [menuItemIsVeg, setMenuItemIsVeg] = useState(true);
  const [menuItemIsAvailable, setMenuItemIsAvailable] = useState(true);
  const [menuItemDescription, setMenuItemDescription] = useState('');
  const [menuItemCategory, setMenuItemCategory] = useState('General');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [menuCategories, setMenuCategories] = useState([
    "General", "Starters", "Main Course", "Biryani", "Desserts", "Beverages", "Snacks", "Tiffin", "Meals"
  ]);
  const [menuItemSubmitLoading, setMenuItemSubmitLoading] = useState(false);
  const [menuItemError, setMenuItemError] = useState('');

  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      const defaultCategories = ["General", "Starters", "Main Course", "Biryani", "Desserts", "Beverages", "Snacks", "Tiffin", "Meals"];
      const customCats = menuItems.map(item => item.category).filter(Boolean);
      setMenuCategories(prev => {
        const combined = new Set([...prev, ...customCats]);
        return Array.from(combined);
      });
    }
  }, [menuItems]);

  const isFoodRelated = (category, customCategoryName) => {
    const cat = (category || '').toLowerCase();
    const sub = (customCategoryName || '').toLowerCase();
    
    const foodKeywords = [
      'food', 'restaurant', 'restarent', 'cafe', 'bakery', 'sweet', 'catering', 
      'juice', 'ice cream', 'parlor', 'hotel', 'dhaba', 'mess', 
      'biryani', 'pizza', 'burger', 'kitchen', 'canteen', 'sweets', 'tea',
      'beverage', 'stall', 'caterer', 'dining', 'eatery', 'baker'
    ];
    
    const foodCategories = [
      'Restaurants', 'Bakeries', 'Cafes & Tea Shops', 'Sweet Shops', 
      'Fast Food Centers', 'Catering Services', 'Juice & Ice Cream Parlors',
      'Food & Restaurants', 'Food & Drinks', 'Hotels & Restaurants'
    ];

    return (
      foodCategories.includes(category) ||
      foodKeywords.some(keyword => cat.includes(keyword) || sub.includes(keyword))
    );
  };
  const isGmbVerified = !!(business && (business.isAddressVerified || (business.googlePlaceId && business.googlePlaceId !== '') || (business.googleBusinessLink && business.googleBusinessLink !== '') || business.googleLinked));
  
  // Verification states
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyPlaceId, setVerifyPlaceId] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState('');

  const [primaryBusiness, setPrimaryBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Notifications states
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Dashboard states
  const [profileCompletion, setProfileCompletion] = useState(85);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Monthly');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [monthlyPrice, setMonthlyPrice] = useState(99);
  const [yearlyPrice, setYearlyPrice] = useState(999);
  
  // My Payment History states
  const [myPayments, setMyPayments] = useState([]);
  const [myPaymentsLoading, setMyPaymentsLoading] = useState(false);
  
  // Referral states
  const [referralStats, setReferralStats] = useState(null);
  const [referralsLoading, setReferralsLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [applyReferralPoints, setApplyReferralPoints] = useState(false);
  const [redeemPointsAmount, setRedeemPointsAmount] = useState(0);

  const handleVerifyGoogleBusiness = async () => {
    setVerifyLoading(true);
    setVerifyError('');
    setVerifySuccess('');
    try {
      // 1. Fetch place details using autofill endpoint
      const autofillRes = await fetch('http://localhost:5000/api/businesses/google-autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId: verifyPlaceId })
      });
      const autofillData = await autofillRes.json();
      if (!autofillData.success || !autofillData.data) {
        setVerifyError(autofillData.message || 'Failed to fetch details for the provided Place ID.');
        setVerifyLoading(false);
        return;
      }

      const googlePlace = autofillData.data;

      // 2. Verify the address matching
      const googlePincodeClean = googlePlace.pincode ? googlePlace.pincode.replace(/\s+/g, '') : '';
      const businessPincodeClean = business.pincode ? business.pincode.replace(/\s+/g, '') : '';
      
      let addressesMatch = false;
      if (googlePincodeClean && businessPincodeClean && googlePincodeClean.slice(0, 6) === businessPincodeClean.slice(0, 6)) {
        addressesMatch = true;
      } else {
        const addr1 = (googlePlace.address || '').toLowerCase().replace(/[^a-z0-9]/g, ' ');
        const addr2 = (business.address || '').toLowerCase().replace(/[^a-z0-9]/g, ' ');
        const words1 = addr1.split(' ').filter(w => w.length > 3);
        const words2 = addr2.split(' ').filter(w => w.length > 3);
        const common = words1.filter(w => words2.includes(w));
        if (common.length >= 2) {
          addressesMatch = true;
        }
      }

      if (!addressesMatch) {
        setVerifyError(`Address Mismatch! The address on Google Place does not match your registered business address. Pincode on Google: ${googlePlace.pincode || 'N/A'}, Registered Pincode: ${business.pincode || 'N/A'}`);
        setVerifyLoading(false);
        return;
      }

      // 3. Match successful! Sync with backend
      const storedToken = localStorage.getItem('ubt_token') || token;
      const syncRes = await fetch(`http://localhost:5000/api/businesses/${business._id}/sync-google`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`
        },
        body: JSON.stringify({
          googlePlaceId: googlePlace.googlePlaceId,
          googleRating: googlePlace.googleRating,
          googleReviewsCount: googlePlace.googleReviewsCount,
          googleReviews: googlePlace.googleReviews
        })
      });
      const syncData = await syncRes.json();
      if (syncData.success) {
        setVerifySuccess('Business address verified and linked successfully!');
        // Update local business state
        setBusiness(syncData.data);
        if (primaryBusiness && primaryBusiness._id === business._id) {
          setPrimaryBusiness(syncData.data);
        }
        setTimeout(() => {
          setShowVerifyModal(false);
          setVerifySuccess('');
          setVerifyPlaceId('');
        }, 2000);
      } else {
        setVerifyError(syncData.message || 'Failed to sync Google profile.');
      }
    } catch (err) {
      setVerifyError('An error occurred during verification. Please try again.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const getSelectedPlanPrice = () => {
    const activePlan = paymentPlans.find(p => p.name === selectedPlan || p.type === selectedPlan);
    return activePlan ? activePlan.price : 99;
  };

  const handleApplyReferralPointsToggle = (checked) => {
    setApplyReferralPoints(checked);
    if (checked) {
      const planPrice = getSelectedPlanPrice();
      const maxDiscountRupees = Math.round(planPrice * 0.1);
      const maxPointsAllowed = maxDiscountRupees * 10;
      
      const maxRed = referralStats ? Math.min(
        referralStats.referralPoints || 0,
        maxPointsAllowed
      ) : 0;
      setRedeemPointsAmount(maxRed);
    } else {
      setRedeemPointsAmount(0);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    if (applyReferralPoints) {
      const planPrice = paymentPlans.find(p => p.name === plan || p.type === plan)?.price || 99;
      const maxDiscountRupees = Math.round(planPrice * 0.1);
      const maxPointsAllowed = maxDiscountRupees * 10;
      
      const maxRed = referralStats ? Math.min(
        referralStats.referralPoints || 0,
        maxPointsAllowed
      ) : 0;
      setRedeemPointsAmount(prev => Math.min(prev, maxRed));
    }
  };

  const handleRedeemPointsChange = (e) => {
    const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
    const planPrice = getSelectedPlanPrice();
    const maxDiscountRupees = Math.round(planPrice * 0.1);
    const maxPointsAllowed = maxDiscountRupees * 10;
    
    const maxRed = referralStats ? Math.min(
      referralStats.referralPoints || 0,
      maxPointsAllowed
    ) : 0;
    
    if (e.target.value === '') {
      setRedeemPointsAmount('');
      return;
    }
    
    if (isNaN(val) || val < 0) {
      setRedeemPointsAmount(0);
    } else if (val > maxRed) {
      setRedeemPointsAmount(maxRed);
    } else {
      setRedeemPointsAmount(val);
    }
  };

  const getDiscountedPrice = (originalPrice) => {
    if (!applyReferralPoints) return originalPrice;
    const discount = Number(redeemPointsAmount || 0) * 0.10;
    const finalPrice = Math.max(0, originalPrice - discount);
    return finalPrice % 1 === 0 ? finalPrice : finalPrice.toFixed(2);
  };
  
  const [paymentPlans, setPaymentPlans] = useState([
    { _id: 'monthly', name: 'Monthly Premium Plan', type: 'Monthly', price: 99, durationDays: 28, features: ['Digital Visiting Card', 'Dedicated Landing Page', 'Event Posting', 'Business Blog Publishing'], isActive: true },
    { _id: 'yearly', name: 'Yearly Premium Plan', type: 'Yearly', price: 999, durationDays: 365, features: ['Digital Visiting Card', 'Dedicated Landing Page', 'Event Posting', 'Business Blog Publishing'], isActive: true, isOffer: true, offerText: 'Save 2 Months' }
  ]);

  const fetchPaymentPlans = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/plans');
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        const monthly = data.data.find(p => p.type === 'Monthly');
        const yearly = data.data.find(p => p.type === 'Yearly');
        if (monthly) setMonthlyPrice(monthly.price);
        if (yearly) setYearlyPrice(yearly.price);

        setPaymentPlans(data.data);
        if (yearly) {
          setSelectedPlan(yearly.name);
        } else {
          setSelectedPlan(data.data[0].name);
        }
      }
    } catch (err) {
      console.warn('API error fetching dynamic plans for checkout, using defaults.', err);
    }
  };
  
  // Blogs Dashboard states
  const [userBlogs, setUserBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [activeBlogComments, setActiveBlogComments] = useState(null); // stores blog ID currently viewing comments for
  const [showWriteBlogModal, setShowWriteBlogModal] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCover, setBlogCover] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogWriteLoading, setBlogWriteLoading] = useState(false);
  const [blogSuccess, setBlogSuccess] = useState('');
  const [blogError, setBlogError] = useState('');
  const [blogImageUploading, setBlogImageUploading] = useState(false);
  const [blogImageError, setBlogImageError] = useState('');
  const [replyTexts, setReplyTexts] = useState({});
  const [blogSubmitNote, setBlogSubmitNote] = useState('');
  const [blogCategory, setBlogCategory] = useState('Business Tips');
  const [blogCategoryOther, setBlogCategoryOther] = useState('');
 
  // Events Dashboard States
  const [userEvents, setUserEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  
  // Create Event Form States
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState('Sports');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventOrganizer, setEventOrganizer] = useState('');
  const [eventPhone, setEventPhone] = useState('');
  const [eventCoverUrl, setEventCoverUrl] = useState('');
  const [eventPaymentLink, setEventPaymentLink] = useState('');
  const [eventDuration, setEventDuration] = useState('');
  const [eventPrice, setEventPrice] = useState(0);
  
  const [eventSubmitLoading, setEventSubmitLoading] = useState(false);
  const [eventSuccess, setEventSuccess] = useState('');
  const [eventError, setEventError] = useState('');
  const [customEventCategory, setCustomEventCategory] = useState('');

  // Complete Event Wizard States
  const [showCompleteEventModal, setShowCompleteEventModal] = useState(false);
  const [completeEvent, setCompleteEvent] = useState(null);
  const [completeEventStep, setCompleteEventStep] = useState(1); // 1: Payment Checkout, 2: Further Details
  const [completeEventPhone, setCompleteEventPhone] = useState('');
  const [completeEventVenue, setCompleteEventVenue] = useState('');
  const [completeEventDescription, setCompleteEventDescription] = useState('');
  const [completeEventCoverUrl, setCompleteEventCoverUrl] = useState('');
  const [completeEventPaymentLink, setCompleteEventPaymentLink] = useState('');
  const [completeEventPaymentStatus, setCompleteEventPaymentStatus] = useState('Pending');
  const [completeEventPrice, setCompleteEventPrice] = useState(0);
  const [completeEventTime, setCompleteEventTime] = useState('');
  const [completeEventLoading, setCompleteEventLoading] = useState(false);
  const [completeEventError, setCompleteEventError] = useState('');
  const [completeEventSuccess, setCompleteEventSuccess] = useState('');
  const [completeEventImageUploading, setCompleteEventImageUploading] = useState(false);
  const [completeEventImageError, setCompleteEventImageError] = useState('');

  // Navigation Sidebar States
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('ubt_token');
    localStorage.removeItem('ubt_user');
    navigate('/login');
  };

  // Quick Photo upload states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedPhotosCount, setUploadedPhotosCount] = useState(4);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [photoGallery, setPhotoGallery] = useState([]);

  // Quick Edit states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTab, setEditTab] = useState('general'); // general | contact | specs | services
  const [modalMarginTop, setModalMarginTop] = useState(20);

  const openModalAtClickLevel = (e, modalSetter, estimatedHeight = 550) => {
    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const buttonTop = rect.top;
      const viewportHeight = window.innerHeight;
      const maxMargin = Math.max(20, viewportHeight - estimatedHeight - 40);
      const margin = Math.max(20, Math.min(buttonTop - 50, maxMargin));
      setModalMarginTop(margin);
    } else {
      setModalMarginTop(20);
    }
    modalSetter(true);
  };
  const [editFields, setEditFields] = useState({
    name: '',
    category: 'Services',
    type: '',
    requestedParentCategory: '',
    customCategoryName: '',
    categoryStatus: 'Normal',
    description: '',
    highlights: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    facebook: '',
    instagram: '',
    address: '',
    locality: '',
    pincode: '',
    yearEstablished: '',
    employeeCount: '',
    gstNumber: '',
    serviceArea: '',
    languagesKnown: '',
    services: '',
    brands: '',
    logoUrl: '',
    coverImageUrl: '',
    galleryUrls: '',
    timingsMon: '9:00 AM - 8:00 PM',
    timingsTue: '9:00 AM - 8:00 PM',
    timingsWed: '9:00 AM - 8:00 PM',
    timingsThu: '9:00 AM - 8:00 PM',
    timingsFri: '9:00 AM - 8:00 PM',
    timingsSat: '9:00 AM - 8:00 PM',
    timingsSun: '9:00 AM - 1:00 PM',
  });

  // Image upload states & handler
  const [logoUploading, setLogoUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Reposition cover states
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [tempOffset, setTempOffset] = useState(50);
  const [originalOffset, setOriginalOffset] = useState(50);
  const [isSavingPosition, setIsSavingPosition] = useState(false);

  const handleDashboardImageUpload = async (e, targetField) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError('');
    const activeToken = token || localStorage.getItem('ubt_token');

    if (targetField === 'logoUrl' || targetField === 'coverImageUrl') {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image file size must be less than 5MB.');
        return;
      }

      if (targetField === 'logoUrl') setLogoUploading(true);
      else setCoverUploading(true);

      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${activeToken}`
          },
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          setEditFields(prev => ({ ...prev, [targetField]: data.url }));
        } else {
          setUploadError(data.message || 'Failed to upload image.');
        }
      } catch (err) {
        console.error('Upload error:', err);
        setUploadError('Network error uploading image.');
      } finally {
        if (targetField === 'logoUrl') setLogoUploading(false);
        else setCoverUploading(false);
      }
    } else if (targetField === 'galleryUrls') {
      setGalleryUploading(true);
      const uploadedUrls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          setUploadError(`File ${file.name} is too large (max 5MB).`);
          continue;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
          const res = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${activeToken}`
            },
            body: formData
          });
          const data = await res.json();
          if (data.success) {
            uploadedUrls.push(data.url);
          }
        } catch (err) {
          console.error('Gallery upload error for file:', file.name, err);
        }
      }

      if (uploadedUrls.length > 0) {
        setEditFields(prev => {
          const currentUrls = prev.galleryUrls 
            ? prev.galleryUrls.split(',').map(s => s.trim()).filter(Boolean)
            : [];
          const combined = [...currentUrls, ...uploadedUrls];
          return { ...prev, galleryUrls: combined.join(', ') };
        });
      }
      setGalleryUploading(false);
    }
  };

  const handleDashboardLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Logo photo size is too large (max 2MB).');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    try {
      setUploadError('');
      setLogoUploading(true);
      const activeToken = token || localStorage.getItem('ubt_token');
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${activeToken}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        await saveInlineFields({ logoUrl: data.url });
        setEditFields(prev => ({ ...prev, logoUrl: data.url }));
      } else {
        setUploadError(data.message || 'Failed to upload logo.');
      }
    } catch (err) {
      console.error('Upload logo error:', err);
      setUploadError('Failed to upload logo. Make sure server is running.');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleDashboardCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Cover photo size is too large (max 5MB).');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    try {
      setUploadError('');
      setCoverUploading(true);
      const activeToken = token || localStorage.getItem('ubt_token');
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${activeToken}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        await saveInlineFields({ coverImageUrl: data.url });
        setEditFields(prev => ({ ...prev, coverImageUrl: data.url }));
      } else {
        setUploadError(data.message || 'Failed to upload cover image.');
      }
    } catch (err) {
      console.error('Upload cover error:', err);
      setUploadError('Failed to upload cover image. Make sure server is running.');
    } finally {
      setCoverUploading(false);
    }
  };

  const handleDashboardSavePosition = async () => {
    setIsSavingPosition(true);
    try {
      await saveInlineFields({ coverImageOffset: tempOffset });
      setOriginalOffset(tempOffset);
      setIsRepositioning(false);
    } catch (err) {
      console.error('Failed to save position:', err);
    } finally {
      setIsSavingPosition(false);
    }
  };

  const handleDashboardCancelPosition = () => {
    setIsRepositioning(false);
    setBusiness(prev => ({ ...prev, coverImageOffset: originalOffset }));
  };

  // Branch management states
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchesError, setBranchesError] = useState('');
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  
  const initialBranchForm = {
    name: '',
    address: '',
    phone: '',
    googleMapsLocation: '',
    googleBusinessLink: '',
    workingHours: '9:00 AM - 8:00 PM',
    branchManagerName: '',
    latitude: 10.5891,
    longitude: 77.2412,
    isPrimary: false
  };
  const [branchForm, setBranchForm] = useState(initialBranchForm);
  const [branchFormError, setBranchFormError] = useState('');
  const [branchSubmitLoading, setBranchSubmitLoading] = useState(false);

  // Profile settings state
  const [profileFields, setProfileFields] = useState({
    fullName: '',
    email: '',
    website: '',
    instagram: '',
    facebook: ''
  });
  const [profileFieldsLoading, setProfileFieldsLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password change state
  const [pwdFields, setPwdFields] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [pwdFieldsLoading, setPwdFieldsLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');

  // Sub-settings navigation states
  const [activeSettingsSubTab, setActiveSettingsSubTab] = useState(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  // Banner notification on return from Add Business
  const [successBanner, setSuccessBanner] = useState('');
  const [copied, setCopied] = useState(false);

  // Dynamic States for completed tabs (Reviews, Leads, and promotions)
  const [selectedLeadIdx, setSelectedLeadIdx] = useState(0);
  const [leadReplyText, setLeadReplyText] = useState('');
  const [leadFilter, setLeadFilter] = useState('All');
  const [leadsList, setLeadsList] = useState([
    { name: 'Suresh Kumar', category: 'Electrical Wiring', phone: '+91 97865 43210', time: '2 mins ago', initial: 'S', color: 'bg-blue-100 text-blue-600' },
    { name: 'Ramesh Babu', category: 'Switch Board Repair', phone: '+91 94423 56789', time: '15 mins ago', initial: 'R', color: 'bg-green-100 text-green-600' },
    { name: 'Kavin Prakash', category: 'Inverter Installation', phone: '+91 91500 67890', time: '1 hour ago', initial: 'K', color: 'bg-purple-100 text-purple-600' },
    { name: 'Vijay Anand', category: 'Fan Installation', phone: '+91 95678 12345', time: '2 hours ago', initial: 'V', color: 'bg-amber-100 text-amber-600' },
    { name: 'Meena Devi', category: 'General Service', phone: '+91 99945 67890', time: '3 hours ago', initial: 'M', color: 'bg-slate-100 text-slate-600' }
  ]);
  
  const [reviewFilter, setReviewFilter] = useState('All');
  const [reviewSourceFilter, setReviewSourceFilter] = useState('All');
  const [reviewSearch, setReviewSearch] = useState('');
  const [replyingReviewId, setReplyingReviewId] = useState(null);
  const [reviewReplyText, setReviewReplyText] = useState('');
  const [reviewResponses, setReviewResponses] = useState({});
  const [localReviews, setLocalReviews] = useState([
    { id: '1', authorName: 'Karthik M', rating: 5, time: '2 days ago', text: 'Excellent service and very professional team. Highly recommended in Udumalpet!', source: 'local', status: 'approved' },
    { id: '2', authorName: 'Priya S', rating: 5, time: '5 days ago', text: 'Quick response and quality work. Solved the problem on the same day.', source: 'local', status: 'approved' },
    { id: '3', authorName: 'Suresh Kumar', rating: 4, time: '1 week ago', text: 'Good service but pricing was a little bit high. Highly satisfied with overall support.', source: 'local', status: 'approved' },
    { id: '4', authorName: 'Subramanian K', rating: 5, time: '2 weeks ago', text: 'Excellent quick service in the center of Udumalpet. Staff was polite.', source: 'google', status: 'approved' },
    { id: '5', authorName: 'Manoj Kumar', rating: 4, time: '3 weeks ago', text: 'Cooperative staff and wide range of items. Highly helpful in emergency wiring issues.', source: 'google', status: 'approved' },
  ]);

  const [offersList, setOffersList] = useState([
    { id: '1', title: 'Festival Special Ghee Roast', description: 'Buy 2 Get 1 Free on all special ghee roast items. Valid on dining.', rate: 'Buy 2 Get 1', expiry: '2026-06-30', active: true, banner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80' },
    { id: '2', title: 'Monsoon Discount Campaign', description: 'Flat 10% Off on all electrical installation services. Safe & verified engineers.', rate: '10% OFF', expiry: '2026-07-15', active: true, banner: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80' },
  ]);
  const [showAddOffer, setShowAddOffer] = useState(false);
  const [newOfferFields, setNewOfferFields] = useState({ title: '', description: '', rate: '', expiry: '', banner: '' });
  const [previewTab, setPreviewTab] = useState('overview');
  const [offerImageUploading, setOfferImageUploading] = useState(false);
  const [offerImageError, setOfferImageError] = useState('');

  const handleOfferBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setOfferImageError('Image file size must be less than 5MB.');
      return;
    }

    setOfferImageUploading(true);
    setOfferImageError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem('ubt_token')}`
        },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setNewOfferFields(prev => ({ ...prev, banner: data.url || data.fileUrl }));
      } else {
        setOfferImageError(data.message || 'Failed to upload image.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setOfferImageError('Network error uploading image.');
    } finally {
      setOfferImageUploading(false);
    }
  };

  const saveInlineFields = async (fields) => {
    const activeToken = token || localStorage.getItem('ubt_token');
    if (!business || !business._id || !activeToken) return;
    try {
      const res = await fetch(`http://localhost:5000/api/businesses/${business._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (data.success) {
        setBusiness(data.data);
      }
    } catch (err) {
      console.warn('Failed to save fields inline, updating locally', err);
      setBusiness(prev => ({
        ...prev,
        ...fields
      }));
    }
  };

  const updateOffers = async (newOffers) => {
    setOffersList(newOffers);
    await saveInlineFields({ offers: newOffers });
  };

  const fetchNotifications = async (authToken) => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data.filter(n => !n.isRead));
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const fetchMyPayments = async () => {
    const activeToken = token || localStorage.getItem('ubt_token');
    if (!activeToken) return;
    setMyPaymentsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/payments/my-history', {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setMyPayments(data.data);
      }
    } catch (err) {
      console.error('Error fetching payment history:', err);
    } finally {
      setMyPaymentsLoading(false);
    }
  };

  useEffect(() => {
    const activeToken = token || localStorage.getItem('ubt_token');
    if (activeToken && activeTab === 'Subscription & Billing') {
      fetchMyPayments();
    }
  }, [token, activeTab]);

  useEffect(() => {
    const businessTabs = [
      'Dashboard', 
      'Business Details', 
      'Branches', 
      'Menu', 
      'Photos & Media', 
      'Reviews & Reputation', 
      'Leads & Enquiries', 
      'Subscription & Billing', 
      'Offers & Promotions', 
      'Referral & Rewards'
    ];
    if (!loading && !business && businessTabs.includes(activeTab)) {
      setActiveTab('My Business');
    }
  }, [business, activeTab, loading]);

  const markAllRead = async () => {
    if (!token) return;
    try {
      await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications([]);
      setShowNotifications(false);
    } catch (err) {
      console.error('Failed to mark all read:', err);
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
      const parsedUser = JSON.parse(storedUser);
      // Allow merchant, owner, admin, superadmin, and visitor roles
      if (
        parsedUser.role !== 'merchant' &&
        parsedUser.role !== 'owner' &&
        parsedUser.role !== 'admin' &&
        parsedUser.role !== 'superadmin' &&
        parsedUser.role !== 'visitor'
      ) {
        // Access Denied: Redirect non-registered users to login with an error code
        navigate('/login?error=unauthorized');
        return;
      }
      setToken(storedToken);
      setUser(parsedUser);
      setProfileFields({
        fullName: parsedUser.fullName || '',
        email: parsedUser.email || '',
        website: parsedUser.website || '',
        instagram: parsedUser.instagram || '',
        facebook: parsedUser.facebook || ''
      });
      fetchUserBusiness(storedToken);
      fetchPaymentPlans();
      fetchNotifications(storedToken);
    } catch (err) {
      navigate('/login');
    }

    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }

    if (searchParams.get('message') === 'listing_created') {
      setSuccessBanner('Your business has been successfully submitted and is currently "Pending Verification". Upgrade to Premium below to activate instantly!');
    } else if (searchParams.get('message') === 'profile_updated') {
      setSuccessBanner('Your business profile details have been successfully updated and saved!');
    }
  }, [searchParams]);

  const fetchUserBusiness = async (authToken) => {
    setLoading(true);
    try {
      // Find businesses owned by the current logged-in user
      const res = await fetch('http://localhost:5000/api/businesses/my-business', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      
      if (data.success) {
        if (data.data) {
          const userBiz = data.data;
          setBusiness(userBiz);
          setPrimaryBusiness(userBiz);
          if (userBiz.offers) {
            setOffersList(userBiz.offers);
          } else {
            setOffersList([]);
          }
          fetchBranches(authToken, userBiz._id);
          fetchLeads(authToken, userBiz._id);
          fetchReviews(authToken, userBiz._id);
          if (isFoodRelated(userBiz.category, userBiz.customCategoryName)) {
            fetchMenu(authToken, userBiz._id);
          }
          setEditFields({
            name: userBiz.name || '',
            category: userBiz.category || 'Services',
            type: userBiz.type || '',
            requestedParentCategory: userBiz.requestedParentCategory || '',
            customCategoryName: userBiz.customCategoryName || '',
            categoryStatus: userBiz.categoryStatus || 'Normal',
            description: userBiz.description || '',
            highlights: Array.isArray(userBiz.highlights) ? userBiz.highlights.join(', ') : '',
            phone: userBiz.phone || '',
            whatsapp: userBiz.whatsapp || '',
            email: userBiz.email || '',
            website: userBiz.website || '',
            facebook: userBiz.facebook || '',
            instagram: userBiz.instagram || '',
            address: userBiz.address || '',
            locality: userBiz.locality || '',
            pincode: userBiz.pincode || '',
            yearEstablished: userBiz.yearEstablished || '',
            employeeCount: userBiz.employeeCount || '',
            gstNumber: userBiz.gstNumber || '',
            serviceArea: userBiz.serviceArea || '',
            languagesKnown: userBiz.languagesKnown || '',
             services: Array.isArray(userBiz.services) ? userBiz.services.join(', ') : '',
            brands: Array.isArray(userBiz.brands) ? userBiz.brands.join(', ') : '',
            logoUrl: userBiz.logoUrl || '',
            coverImageUrl: userBiz.coverImageUrl || '',
            galleryUrls: Array.isArray(userBiz.galleryUrls) ? userBiz.galleryUrls.join(', ') : '',
            timingsMon: userBiz.timings?.Monday || '9:00 AM - 8:00 PM',
            timingsTue: userBiz.timings?.Tuesday || '9:00 AM - 8:00 PM',
            timingsWed: userBiz.timings?.Wednesday || '9:00 AM - 8:00 PM',
            timingsThu: userBiz.timings?.Thursday || '9:00 AM - 8:00 PM',
            timingsFri: userBiz.timings?.Friday || '9:00 AM - 8:00 PM',
            timingsSat: userBiz.timings?.Saturday || '9:00 AM - 8:00 PM',
            timingsSun: userBiz.timings?.Sunday || '9:00 AM - 1:00 PM',
          });
          // Initialize photo gallery from business data
          const galleryArr = Array.isArray(userBiz.galleryUrls) 
            ? userBiz.galleryUrls 
            : (typeof userBiz.galleryUrls === 'string' ? userBiz.galleryUrls.split(',').map(s => s.trim()).filter(Boolean) : []);
          setPhotoGallery(galleryArr);
          setUploadedPhotosCount(galleryArr.length);
          
          // Calculate completeness percentage based on filled fields
          let score = 30; // base score for basic details
          if (userBiz.yearEstablished) score += 10;
          if (userBiz.gstNumber) score += 10;
          if (userBiz.services && userBiz.services.length > 0) score += 15;
          if (userBiz.brands && userBiz.brands.length > 0) score += 10;
          if (userBiz.logoUrl) score += 10;
          if (userBiz.coverImageUrl) score += 10;
          if (userBiz.galleryUrls && userBiz.galleryUrls.length > 2) score += 5;
          setProfileCompletion(Math.min(score, 100));
        } else {
          setBusiness(null);
          if (!searchParams.get('tab')) {
            setActiveTab('My Business');
          }
        }
      } else {
        throw new Error('Fallback required');
      }
    } catch (err) {
      console.warn('Backend server offline, falling back to offline simulation.');
      
      // Gorgeous mock fallback: match Sri Murugan Stores from reference design exactly!
      const mockBiz = {
        _id: 'UBT-10024',
        name: 'Sri Murugan Stores',
        category: 'Restaurants',
        type: 'Vegetarian Restaurant',
        description: 'Sri Murugan Stores is a premium departmental store in Gandhi Nagar, Udumalpet offering fresh organic grocery items, dry fruits, fresh pulses and household commodities.',
        phone: '+91 94430 12345',
        whatsapp: '+91 94430 12345',
        locality: 'Gandhi Nagar',
        pincode: '642126',
        googleRating: 4.7,
        googleReviewsCount: 68,
        status: 'Approved',
        subscriptionStatus: 'active', 
        subscriptionExpiry: new Date(new Date().getTime() + 23 * 24 * 60 * 60 * 1000), // 23 days remaining
        isPremium: true,
        logoUrl: '',
        offers: [
          { id: '1', title: 'Festival Special Ghee Roast', description: 'Buy 2 Get 1 Free on all special ghee roast items. Valid on dining.', rate: 'Buy 2 Get 1', expiry: '2026-06-30', active: true, banner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80' },
          { id: '2', title: 'Monsoon Discount Campaign', description: 'Flat 10% Off on all electrical installation services. Safe & verified engineers.', rate: '10% OFF', expiry: '2026-07-15', active: true, banner: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80' },
        ]
      };
      setBusiness(mockBiz);
      setPrimaryBusiness(mockBiz);
      setOffersList(mockBiz.offers);
      fetchBranches(authToken, mockBiz._id);
      fetchLeads(authToken, mockBiz._id);
      fetchReviews(authToken, mockBiz._id);
      if (isFoodRelated('Restaurants', 'Vegetarian Restaurant')) {
        fetchMenu(authToken, mockBiz._id);
      }
      setEditFields({
        name: mockBiz.name || '',
        category: mockBiz.category || 'Services',
        type: mockBiz.type || '',
        requestedParentCategory: mockBiz.requestedParentCategory || '',
        customCategoryName: mockBiz.customCategoryName || '',
        categoryStatus: mockBiz.categoryStatus || 'Normal',
        description: mockBiz.description || '',
        highlights: Array.isArray(mockBiz.highlights) ? mockBiz.highlights.join(', ') : '',
        phone: mockBiz.phone || '',
        whatsapp: mockBiz.whatsapp || '',
        email: mockBiz.email || '',
        website: mockBiz.website || '',
        facebook: mockBiz.facebook || '',
        instagram: mockBiz.instagram || '',
        address: mockBiz.address || '',
        locality: mockBiz.locality || '',
        pincode: mockBiz.pincode || '',
        yearEstablished: mockBiz.yearEstablished || '',
        employeeCount: mockBiz.employeeCount || '',
        gstNumber: mockBiz.gstNumber || '',
        serviceArea: mockBiz.serviceArea || '',
        languagesKnown: mockBiz.languagesKnown || '',
        services: Array.isArray(mockBiz.services) ? mockBiz.services.join(', ') : '',
        brands: Array.isArray(mockBiz.brands) ? mockBiz.brands.join(', ') : '',
        logoUrl: mockBiz.logoUrl || '',
        coverImageUrl: mockBiz.coverImageUrl || '',
        galleryUrls: Array.isArray(mockBiz.galleryUrls) ? mockBiz.galleryUrls.join(', ') : '',
        timingsMon: mockBiz.timings?.Monday || '9:00 AM - 8:00 PM',
        timingsTue: mockBiz.timings?.Tuesday || '9:00 AM - 8:00 PM',
        timingsWed: mockBiz.timings?.Wednesday || '9:00 AM - 8:00 PM',
        timingsThu: mockBiz.timings?.Thursday || '9:00 AM - 8:00 PM',
        timingsFri: mockBiz.timings?.Friday || '9:00 AM - 8:00 PM',
        timingsSat: mockBiz.timings?.Saturday || '9:00 AM - 8:00 PM',
        timingsSun: mockBiz.timings?.Sunday || '9:00 AM - 1:00 PM',
      });
      // Initialize photo gallery from mock business data
      const mockGalleryArr = Array.isArray(mockBiz.galleryUrls) 
        ? mockBiz.galleryUrls 
        : (typeof mockBiz.galleryUrls === 'string' ? mockBiz.galleryUrls.split(',').map(s => s.trim()).filter(Boolean) : []);
      setPhotoGallery(mockGalleryArr);
      setUploadedPhotosCount(mockGalleryArr.length);
      setProfileCompletion(90);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async (authToken, businessId) => {
    if (!businessId) return;
    const activeToken = authToken || token || localStorage.getItem('ubt_token');
    try {
      if (!activeToken || businessId === 'UBT-10024') {
        throw new Error('Offline mock mode');
      }
      const res = await fetch(`http://localhost:5000/api/leads/business/${businessId}`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        const colors = [
          'bg-blue-100 text-blue-600',
          'bg-green-100 text-green-600',
          'bg-purple-100 text-purple-600',
          'bg-amber-100 text-amber-600',
          'bg-slate-100 text-slate-600'
        ];
        const formatted = data.data.map((lead, idx) => {
          const createdAt = new Date(lead.createdAt);
          const timeStr = createdAt.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          return {
            _id: lead._id,
            name: lead.name,
            phone: lead.phone,
            message: lead.message,
            category: business?.category || 'General Service',
            time: timeStr,
            initial: (lead.name || 'L').charAt(0).toUpperCase(),
            color: colors[idx % colors.length],
            reply: lead.reply || '',
            responded: lead.status === 'Responded' || !!lead.reply
          };
        });
        setLeadsList(formatted);
      }
    } catch (err) {
      console.warn('Using fallback mock leads due to error or mock business id:', err.message);
      setLeadsList([
        { name: 'Suresh Kumar', category: 'Electrical Wiring', phone: '+91 97865 43210', time: '2 mins ago', initial: 'S', color: 'bg-blue-100 text-blue-600', reply: '', responded: false },
        { name: 'Ramesh Babu', category: 'Switch Board Repair', phone: '+91 94423 56789', time: '15 mins ago', initial: 'R', color: 'bg-green-100 text-green-600', reply: '', responded: false },
        { name: 'Kavin Prakash', category: 'Inverter Installation', phone: '+91 91500 67890', time: '1 hour ago', initial: 'K', color: 'bg-purple-100 text-purple-600', reply: '', responded: false },
        { name: 'Vijay Anand', category: 'Fan Installation', phone: '+91 95678 12345', time: '2 hours ago', initial: 'V', color: 'bg-amber-100 text-amber-600', reply: '', responded: false },
        { name: 'Meena Devi', category: 'General Service', phone: '+91 99945 67890', time: '3 hours ago', initial: 'M', color: 'bg-slate-100 text-slate-600', reply: '', responded: false }
      ]);
    }
  };

  const fetchBranches = async (authToken, businessId) => {
    setBranchesLoading(true);
    setBranchesError('');
    try {
      if (!authToken || businessId === 'UBT-10024') {
        throw new Error('Offline mock mode');
      }
      const res = await fetch(`http://localhost:5000/api/branches/business/${businessId}?all=true`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setBranches(data.data);
        // If branchId URL param is set, auto-switch to that branch using the full handleSwitchBusiness flow
        const branchIdParam = new URLSearchParams(window.location.search).get('branchId');
        if (branchIdParam) {
          // Use a short delay to ensure setBranches has settled first
          setTimeout(() => {
            handleSwitchBusiness(branchIdParam);
            setActiveTab('Business Details');
          }, 150);
        }
      } else {
        setBranchesError(data.message || 'Failed to fetch branches');
        throw new Error(data.message || 'Failed to fetch branches');
      }
    } catch (err) {
      console.warn('Using fallback mock branches due to error or mock business id:', err.message);
      // Gorgeous mock fallback branches
      const mockBranches = [
        {
          _id: 'mock-branch-1',
          businessId: 'UBT-10024',
          name: 'Sri Murugan Stores - Eripalayam Branch',
          address: 'Eripalayam Main Road, Udumalpet Main Town, Tamil Nadu - 642126',
          phone: '+91 94430 12345',
          googleMapsLocation: 'https://maps.google.com/?q=10.5912,77.2515',
          googleBusinessLink: 'https://business.google.com',
          workingHours: '9:00 AM - 9:00 PM',
          branchManagerName: 'Murugan Jr.',
          latitude: 10.5912,
          longitude: 77.2515,
          status: 'Approved',
          isPrimary: false
        },
        {
          _id: 'mock-branch-2',
          businessId: 'UBT-10024',
          name: 'Sri Murugan Stores - Dharapuram Road Branch',
          address: 'Dharapuram Road, Udumalpet Main Town, Tamil Nadu - 642126',
          phone: '+91 94430 54321',
          googleMapsLocation: 'https://maps.google.com/?q=10.584,77.252',
          googleBusinessLink: '',
          workingHours: '9:00 AM - 8:30 PM',
          branchManagerName: 'Suresh Babu',
          latitude: 10.584,
          longitude: 77.252,
          status: 'Pending Verification',
          isPrimary: false
        }
      ];
      setBranches(mockBranches);
    } finally {
      setBranchesLoading(false);
    }
  };

  const fetchReviews = async (authToken, businessId) => {
    if (!businessId) return;
    const activeToken = authToken || token || localStorage.getItem('ubt_token');
    try {
      if (!activeToken || businessId === 'UBT-10024') {
        throw new Error('Offline mock mode');
      }
      const res = await fetch(`http://localhost:5000/api/reviews/${businessId}`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        const formatted = data.data.map(r => ({
          id: r._id,
          authorName: r.authorName,
          rating: r.rating,
          text: r.text,
          createdAt: r.createdAt,
          replyText: r.replyText || '',
          replied: !!r.replyText
        }));
        setLocalReviews(formatted);
      }
    } catch (err) {
      console.warn('Using fallback mock reviews:', err.message);
    }
  };

  const applyBusinessToState = (targetBiz) => {
    setBusiness(targetBiz);
    const activeToken = token || localStorage.getItem('ubt_token');
    fetchLeads(activeToken, targetBiz._id);
    fetchReviews(activeToken, targetBiz._id);
    if (isFoodRelated(targetBiz.category, targetBiz.customCategoryName)) {
      fetchMenu(activeToken, targetBiz._id);
    }
    setOffersList(targetBiz.offers || []);

    // Sync photo gallery from the switched business
    const switchedGallery = Array.isArray(targetBiz.galleryUrls) ? targetBiz.galleryUrls
      : (typeof targetBiz.galleryUrls === 'string' ? targetBiz.galleryUrls.split(',').map(s => s.trim()).filter(Boolean) : []);
    setPhotoGallery(switchedGallery);
    setUploadedPhotosCount(switchedGallery.length);

    setEditFields({
      name: targetBiz.name || '',
      category: targetBiz.category || 'Services',
      type: targetBiz.type || '',
      requestedParentCategory: targetBiz.requestedParentCategory || '',
      customCategoryName: targetBiz.customCategoryName || '',
      categoryStatus: targetBiz.categoryStatus || 'Normal',
      description: targetBiz.description || '',
      highlights: Array.isArray(targetBiz.highlights) ? targetBiz.highlights.join(', ') : '',
      phone: targetBiz.phone || '',
      whatsapp: targetBiz.whatsapp || '',
      email: targetBiz.email || '',
      website: targetBiz.website || '',
      facebook: targetBiz.facebook || '',
      instagram: targetBiz.instagram || '',
      address: targetBiz.address || '',
      locality: targetBiz.locality || '',
      pincode: targetBiz.pincode || '',
      yearEstablished: targetBiz.yearEstablished || '',
      employeeCount: targetBiz.employeeCount || '',
      gstNumber: targetBiz.gstNumber || '',
      serviceArea: targetBiz.serviceArea || '',
      languagesKnown: targetBiz.languagesKnown || '',
      services: Array.isArray(targetBiz.services) ? targetBiz.services.join(', ') : '',
      brands: Array.isArray(targetBiz.brands) ? targetBiz.brands.join(', ') : '',
      logoUrl: targetBiz.logoUrl || '',
      coverImageUrl: targetBiz.coverImageUrl || '',
      galleryUrls: Array.isArray(targetBiz.galleryUrls) ? targetBiz.galleryUrls.join(', ') : '',
      timingsMon: targetBiz.timings?.Monday || '9:00 AM - 8:00 PM',
      timingsTue: targetBiz.timings?.Tuesday || '9:00 AM - 8:00 PM',
      timingsWed: targetBiz.timings?.Wednesday || '9:00 AM - 8:00 PM',
      timingsThu: targetBiz.timings?.Thursday || '9:00 AM - 8:00 PM',
      timingsFri: targetBiz.timings?.Friday || '9:00 AM - 8:00 PM',
      timingsSat: targetBiz.timings?.Saturday || '9:00 AM - 8:00 PM',
      timingsSun: targetBiz.timings?.Sunday || '9:00 AM - 1:00 PM',
    });
  };

  const handleSwitchBusiness = async (bizId) => {
    if (!bizId || (business && business._id === bizId)) return;
    setLoading(true);
    try {
      const activeToken = token || localStorage.getItem('ubt_token');

      // If switching back to primary business, use the cached primary data
      if (primaryBusiness && bizId === primaryBusiness._id) {
        applyBusinessToState(primaryBusiness);
        setLoading(false);
        return;
      }

      // Always fetch fresh full data for a branch from the API
      try {
        const res = await fetch(`http://localhost:5000/api/businesses/${bizId}`, {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        const data = await res.json();
        if (data.success && data.data) {
          const fullBiz = data.data;
          // Inherit subscription from parent if this is a branch
          if (fullBiz.parentBusinessId && primaryBusiness) {
            fullBiz.subscriptionStatus = primaryBusiness.subscriptionStatus;
            fullBiz.subscriptionExpiry = primaryBusiness.subscriptionExpiry;
            fullBiz.isPremium = primaryBusiness.isPremium;
          }
          applyBusinessToState(fullBiz);
          // Also update the branches array entry with fresh data
          setBranches(prev => prev.map(b => b._id === bizId ? fullBiz : b));
          return;
        }
      } catch (apiErr) {
        console.warn('Could not fetch fresh branch data, using cache:', apiErr.message);
      }

      // Fallback: use cached branch data from branches array
      const cachedBranch = branches.find(b => b._id === bizId);
      if (cachedBranch) {
        applyBusinessToState(cachedBranch);
      }
    } catch (err) {
      console.error('Error switching business:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBranchModal = (branch = null) => {
    setBranchFormError('');
    if (branch) {
      setEditingBranch(branch);
      setBranchForm({
        name: branch.name || '',
        address: branch.address || '',
        phone: branch.phone || '',
        googleMapsLocation: branch.googleMapsLocation || '',
        googleBusinessLink: branch.googleBusinessLink || '',
        workingHours: branch.workingHours || '9:00 AM - 8:00 PM',
        branchManagerName: branch.branchManagerName || '',
        latitude: branch.latitude || 10.5891,
        longitude: branch.longitude || 77.2412,
        isPrimary: branch.isPrimary || false
      });
    } else {
      setEditingBranch(null);
      setBranchForm({
        name: '',
        address: '',
        phone: '',
        googleMapsLocation: '',
        googleBusinessLink: '',
        workingHours: '9:00 AM - 8:00 PM',
        branchManagerName: '',
        latitude: 10.5891,
        longitude: 77.2412,
        isPrimary: false
      });
    }
    setShowBranchModal(true);
  };

  const handleBranchFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBranchForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBranchAddressSelect = (selectedData) => {
    setBranchForm(prev => ({
      ...prev,
      address: selectedData.address,
      latitude: selectedData.coordinates.lat,
      longitude: selectedData.coordinates.lng
    }));
  };

  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    if (!branchForm.name || !branchForm.address || !branchForm.phone) {
      setBranchFormError('Name, Address, and Phone are required.');
      return;
    }
    setBranchSubmitLoading(true);
    setBranchFormError('');

    try {
      if (business._id === 'UBT-10024') {
        // Mock branch creation/updating
        const updatedBranch = {
          _id: editingBranch ? editingBranch._id : `mock-branch-${Date.now()}`,
          businessId: business._id,
          name: branchForm.name,
          address: branchForm.address,
          phone: branchForm.phone,
          googleMapsLocation: branchForm.googleMapsLocation || `https://maps.google.com/?q=${branchForm.latitude},${branchForm.longitude}`,
          googleBusinessLink: branchForm.googleBusinessLink,
          workingHours: branchForm.workingHours,
          branchManagerName: branchForm.branchManagerName,
          latitude: Number(branchForm.latitude) || 10.5891,
          longitude: Number(branchForm.longitude) || 77.2412,
          status: editingBranch ? editingBranch.status : 'Pending Verification',
          isPrimary: branchForm.isPrimary
        };

        if (editingBranch) {
          setBranches(prev => prev.map(b => b._id === editingBranch._id ? updatedBranch : b));
        } else {
          setBranches(prev => [updatedBranch, ...prev]);
        }
        setShowBranchModal(false);
        setBranchSubmitLoading(false);
        return;
      }

      // Real branch API call
      const url = editingBranch 
        ? `http://localhost:5000/api/branches/${editingBranch._id}` 
        : 'http://localhost:5000/api/branches';
      const method = editingBranch ? 'PUT' : 'POST';

      const bodyData = {
        ...branchForm,
        businessId: business._id,
        latitude: Number(branchForm.latitude),
        longitude: Number(branchForm.longitude)
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });

      const data = await res.json();
      if (data.success) {
        if (editingBranch) {
          setBranches(prev => prev.map(b => b._id === editingBranch._id ? data.data : b));
        } else {
          setBranches(prev => [data.data, ...prev]);
        }
        setShowBranchModal(false);
      } else {
        setBranchFormError(data.message || 'Failed to submit branch');
      }
    } catch (err) {
      console.error('Error submitting branch:', err);
      setBranchFormError('Network error. Failed to submit branch.');
    } finally {
      setBranchSubmitLoading(false);
    }
  };

  const handleBranchDelete = async (branchId) => {
    if (!window.confirm('Are you sure you want to delete this branch?')) return;

    try {
      if (business._id === 'UBT-10024') {
        // Mock branch deletion
        setBranches(prev => prev.filter(b => b._id !== branchId));
        return;
      }

      // Real branch deletion
      const res = await fetch(`http://localhost:5000/api/branches/${branchId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBranches(prev => prev.filter(b => b._id !== branchId));
      } else {
        alert(data.message || 'Failed to delete branch');
      }
    } catch (err) {
      console.error('Error deleting branch:', err);
      alert('Network error. Failed to delete branch.');
    }
  };

  const fetchMenu = async (authToken, businessId) => {
    if (!businessId) return;
    const activeToken = authToken || token || localStorage.getItem('ubt_token');
    setMenuLoading(true);
    setMenuError('');
    try {
      if (!activeToken || businessId === 'UBT-10024' || String(businessId).startsWith('biz_')) {
        throw new Error('Offline mock mode');
      }
      const res = await fetch(`http://localhost:5000/api/menu/${businessId}`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMenuItems(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch menu items');
      }
    } catch (err) {
      console.warn('Using mock menu items due to error or mock business id:', err.message);
      setMenuItems([
        {
          _id: 'menu_mock_1',
          businessId: businessId,
          name: 'Special South Indian Meals',
          price: 150,
          offerPrice: 120,
          isVeg: true,
          isAvailable: true,
          description: 'A traditional banana leaf meal with rice, sambar, rasam, kootu, poriyal, appalam, and sweet payasam.',
          category: 'Meals'
        },
        {
          _id: 'menu_mock_2',
          businessId: businessId,
          name: 'Udumalpet Special Mutton Biryani',
          price: 280,
          offerPrice: 250,
          isVeg: false,
          isAvailable: true,
          description: 'Aromatic seeraga samba biryani cooked with tender local lamb chops and spices, served with raita and brinjal curry.',
          category: 'Biryani'
        },
        {
          _id: 'menu_mock_3',
          businessId: businessId,
          name: 'Paneer Butter Masala',
          price: 180,
          offerPrice: null,
          isVeg: true,
          isAvailable: true,
          description: 'Rich and creamy cottage cheese chunks simmered in a mildly spiced onion-tomato gravy with butter.',
          category: 'Gravies'
        },
        {
          _id: 'menu_mock_4',
          businessId: businessId,
          name: 'Ghee Onion Rava Dosa',
          price: 110,
          offerPrice: 99,
          isVeg: true,
          isAvailable: false,
          description: 'Crispy semolina crepe with finely chopped onions, flavored with pure ghee, served with three chutneys and hot sambar.',
          category: 'Tiffin'
        }
      ]);
    } finally {
      setMenuLoading(false);
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    if (!menuItemName || menuItemPrice === '') {
      setMenuItemError('Item Name and Price are required.');
      return;
    }

    setMenuItemSubmitLoading(true);
    setMenuItemError('');

    let finalCategory = menuItemCategory;
    if (isCustomCategory) {
      if (!customCategoryName.trim()) {
        setMenuItemError('Please specify the custom category name.');
        setMenuItemSubmitLoading(false);
        return;
      }
      finalCategory = customCategoryName.trim();
    }

    const bodyData = {
      name: menuItemName,
      price: Number(menuItemPrice),
      offerPrice: menuItemOfferPrice !== '' && menuItemOfferPrice !== null && menuItemOfferPrice !== undefined ? Number(menuItemOfferPrice) : null,
      isVeg: menuItemIsVeg,
      isAvailable: menuItemIsAvailable,
      description: '', // description removed
      category: finalCategory || 'General'
    };

    const activeToken = token || localStorage.getItem('ubt_token');

    try {
      if (finalCategory && !menuCategories.includes(finalCategory)) {
        setMenuCategories(prev => [...prev, finalCategory]);
      }

      if (business._id === 'UBT-10024' || String(business._id).startsWith('biz_')) {
        const updatedItem = {
          _id: currentMenuItem ? currentMenuItem._id : `menu_mock_${Date.now()}`,
          businessId: business._id,
          ...bodyData
        };

        if (currentMenuItem) {
          setMenuItems(prev => prev.map(item => item._id === currentMenuItem._id ? updatedItem : item));
        } else {
          setMenuItems(prev => [updatedItem, ...prev]);
        }
        setShowMenuItemModal(false);
        resetMenuItemForm();
        return;
      }

      const url = currentMenuItem 
        ? `http://localhost:5000/api/menu/${currentMenuItem._id}`
        : `http://localhost:5000/api/menu/${business._id}`;
      const method = currentMenuItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`
        },
        body: JSON.stringify(bodyData)
      });

      const data = await res.json();
      if (data.success) {
        if (finalCategory && !menuCategories.includes(finalCategory)) {
          setMenuCategories(prev => [...prev, finalCategory]);
        }
        if (currentMenuItem) {
          setMenuItems(prev => prev.map(item => item._id === currentMenuItem._id ? data.data : item));
        } else {
          setMenuItems(prev => [data.data, ...prev]);
        }
        setShowMenuItemModal(false);
        resetMenuItemForm();
      } else {
        setMenuItemError(data.message || 'Failed to save menu item.');
      }
    } catch (err) {
      console.error('Error submitting menu item:', err);
      const updatedItem = {
        _id: currentMenuItem ? currentMenuItem._id : `menu_mock_${Date.now()}`,
        businessId: business._id,
        ...bodyData
      };
      if (currentMenuItem) {
        setMenuItems(prev => prev.map(item => item._id === currentMenuItem._id ? updatedItem : item));
      } else {
        setMenuItems(prev => [updatedItem, ...prev]);
      }
      setShowMenuItemModal(false);
      resetMenuItemForm();
    } finally {
      setMenuItemSubmitLoading(false);
    }
  };

  const resetMenuItemForm = () => {
    setCurrentMenuItem(null);
    setMenuItemName('');
    setMenuItemPrice('');
    setMenuItemOfferPrice('');
    setMenuItemIsVeg(true);
    setMenuItemIsAvailable(true);
    setMenuItemDescription('');
    setMenuItemCategory('General');
    setIsCustomCategory(false);
    setCustomCategoryName('');
    setMenuItemError('');
  };

  const handleMenuDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;

    const activeToken = token || localStorage.getItem('ubt_token');

    try {
      if (business._id === 'UBT-10024' || String(business._id).startsWith('biz_')) {
        setMenuItems(prev => prev.filter(item => item._id !== itemId));
        return;
      }

      const res = await fetch(`http://localhost:5000/api/menu/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setMenuItems(prev => prev.filter(item => item._id !== itemId));
      } else {
        alert(data.message || 'Failed to delete menu item');
      }
    } catch (err) {
      console.error('Error deleting menu item:', err);
      setMenuItems(prev => prev.filter(item => item._id !== itemId));
    }
  };

  const handleToggleAvailability = async (item) => {
    const updatedStatus = !item.isAvailable;
    const activeToken = token || localStorage.getItem('ubt_token');

    try {
      if (business._id === 'UBT-10024' || String(business._id).startsWith('biz_')) {
        setMenuItems(prev => prev.map(i => i._id === item._id ? { ...i, isAvailable: updatedStatus } : i));
        return;
      }

      const res = await fetch(`http://localhost:5000/api/menu/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`
        },
        body: JSON.stringify({ isAvailable: updatedStatus })
      });
      const data = await res.json();
      if (data.success) {
        setMenuItems(prev => prev.map(i => i._id === item._id ? data.data : i));
      } else {
        alert(data.message || 'Failed to update availability');
      }
    } catch (err) {
      console.error('Error toggling availability:', err);
      setMenuItems(prev => prev.map(i => i._id === item._id ? { ...i, isAvailable: updatedStatus } : i));
    }
  };

  const handleOpenMenuItemModal = (item = null) => {
    setMenuItemError('');
    if (item) {
      setCurrentMenuItem(item);
      setMenuItemName(item.name || '');
      setMenuItemPrice(item.price || '');
      setMenuItemOfferPrice(item.offerPrice || '');
      setMenuItemIsVeg(item.isVeg !== undefined ? item.isVeg : true);
      setMenuItemIsAvailable(item.isAvailable !== undefined ? item.isAvailable : true);
      setMenuItemDescription(item.description || '');
      
      const defaultCategories = ["General", "Starters", "Main Course", "Biryani", "Desserts", "Beverages", "Snacks", "Tiffin", "Meals"];
      if (item.category && !defaultCategories.includes(item.category)) {
        setIsCustomCategory(true);
        setCustomCategoryName(item.category);
        setMenuItemCategory(item.category);
      } else {
        setIsCustomCategory(false);
        setCustomCategoryName('');
        setMenuItemCategory(item.category || 'General');
      }
    } else {
      resetMenuItemForm();
    }
    setShowMenuItemModal(true);
  };

  const fetchUserBlogs = async () => {
    const activeToken = token || localStorage.getItem('ubt_token');
    if (!activeToken) return;
    setBlogsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/blogs/my-blogs', {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setUserBlogs(data.data);
      } else {
        throw new Error('Backend failed');
      }
    } catch (err) {
      console.warn('Backend server offline, loading mock blogs for dashboard.');
      // Generate realistic user mock blogs carrying user ID
      const userMockList = [
        {
          _id: 'blog_1',
          title: 'A Local’s Ultimate Guide to Thirumoorthy Hills & Dam',
          content: 'Thirumoorthy Hills, located about 20 km from Udumalpet, is a pristine tourism spot...',
          coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
          authorName: user?.fullName || 'Ananth Sundar',
          status: 'Approved',
          showLikes: true,
          showComments: true,
          likes: ['u1', 'u2', 'u3'],
          comments: [
            { _id: 'c1', user: 'u1', userName: 'Karthik S.', text: 'This is my favorite spot in Udumalpet! Panchalinga falls trek is amazing.', createdAt: new Date() },
            { _id: 'c2', user: 'u2', userName: 'Meena Devi', text: 'Very detailed guide! Planning to visit next Sunday.', createdAt: new Date() }
          ],
          createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
        }
      ];
      setUserBlogs(userMockList);
    } finally {
      setBlogsLoading(false);
    }
  };

  const handleToggleBlogOption = async (blogId, option, currentValue) => {
    const targetValue = !currentValue;
    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ [option]: targetValue })
      });
      const data = await res.json();
      if (data.success) {
        setUserBlogs(prev => prev.map(b => b._id === blogId ? data.data : b));
      }
    } catch (err) {
      // Mock toggle on offline fallback
      setUserBlogs(prev => prev.map(b => b._id === blogId ? { ...b, [option]: targetValue } : b));
    }
  };

  const handleCommentDeleteDashboard = async (blogId, commentId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${blogId}/comment/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUserBlogs(prev => prev.map(b => b._id === blogId ? { ...b, comments: data.data } : b));
      }
    } catch (err) {
      // Mock delete on offline fallback
      setUserBlogs(prev => prev.map(b => {
        if (b._id === blogId) {
          return { ...b, comments: b.comments.filter(c => c._id !== commentId) };
        }
        return b;
      }));
    }
  };

  const handleCommentApproveDashboard = async (blogId, commentId) => {
    try {
      const activeToken = token || localStorage.getItem('ubt_token');
      const res = await fetch(`http://localhost:5000/api/blogs/${blogId}/comment/${commentId}/approve`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${activeToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setUserBlogs(prev => prev.map(b => b._id === blogId ? { ...b, comments: data.data } : b));
      }
    } catch (err) {
      console.error('Error approving comment:', err);
      setUserBlogs(prev => prev.map(b => b._id === blogId ? {
        ...b,
        comments: b.comments.map(c => c._id === commentId ? { ...c, approved: true } : c)
      } : b));
    }
  };

  const handleEditBlogClick = (blog) => {
    setEditingBlogId(blog._id);
    setBlogTitle(blog.title || '');
    setBlogCover(blog.coverImage || '');
    setBlogContent(blog.content || '');
    
    // Set categories state
    if (blog.category) {
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
      if (STANDARD_CATEGORIES.includes(blog.category)) {
        setBlogCategory(blog.category);
        setBlogCategoryOther('');
      } else {
        setBlogCategory('Other');
        setBlogCategoryOther(blog.category);
      }
    } else {
      setBlogCategory('Business Tips');
      setBlogCategoryOther('');
    }

    setBlogSuccess('');
    setBlogError('');
    setShowWriteBlogModal(true);
  };

  const handleCloseWriteBlogModal = () => {
    setShowWriteBlogModal(false);
    setEditingBlogId(null);
    setBlogTitle('');
    setBlogCover('');
    setBlogContent('');
    setBlogCategory('Business Tips');
    setBlogCategoryOther('');
    setBlogSuccess('');
    setBlogError('');
    setBlogSubmitNote('');
  };

  const handleBlogImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setBlogImageError('Image file size must be less than 5MB.');
      return;
    }

    setBlogImageUploading(true);
    setBlogImageError('');
    setBlogError('');

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
        setBlogCover(data.url);
      } else {
        setBlogImageError(data.message || 'Failed to upload image.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setBlogImageError('Network error uploading image. Using a premium placeholder instead.');
      setBlogCover('https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80');
    } finally {
      setBlogImageUploading(false);
    }
  };

  const handleWriteBlogDashboard = async (e) => {
    e.preventDefault();
    setBlogWriteLoading(true);
    setBlogSuccess('');
    setBlogError('');

    if (!blogTitle.trim() || !blogContent.trim()) {
      setBlogError('Please enter both title and content.');
      setBlogWriteLoading(false);
      return;
    }

    const finalCategory = blogCategory === 'Other' ? blogCategoryOther.trim() : blogCategory;

    if (!finalCategory) {
      setBlogError('Please specify a category.');
      setBlogWriteLoading(false);
      return;
    }

    try {
      const url = editingBlogId 
        ? `http://localhost:5000/api/blogs/${editingBlogId}`
        : 'http://localhost:5000/api/blogs';
      const method = editingBlogId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('ubt_token')}`
        },
        body: JSON.stringify({
          title: blogTitle,
          content: blogContent,
          coverImage: blogCover || undefined,
          category: finalCategory,
          submissionNote: editingBlogId ? (blogSubmitNote || 'Article re-submitted with corrections.') : undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setBlogSuccess(editingBlogId 
          ? 'Your blog post has been successfully updated and re-submitted for admin review!'
          : 'Your blog post has been submitted and is pending review by administrators!');
        setBlogTitle('');
        setBlogCover('');
        setBlogContent('');
        setBlogCategory('Business Tips');
        setBlogCategoryOther('');
        setBlogSubmitNote('');
        setEditingBlogId(null);
        fetchUserBlogs();
        setTimeout(() => {
          setShowWriteBlogModal(false);
          setBlogSuccess('');
        }, 5000);
      } else {
        setBlogError(data.message || 'Failed to submit blog post.');
      }
    } catch (err) {
      // Mock submit locally
      if (editingBlogId) {
        setUserBlogs(prev => prev.map(b => b._id === editingBlogId ? { 
          ...b, 
          title: blogTitle, 
          content: blogContent, 
          coverImage: blogCover || b.coverImage, 
          category: finalCategory,
          status: 'Pending Approval',
          revisionSuggestions: ''
        } : b));
        setBlogSuccess('Mock Mode: Blog post successfully updated and re-submitted!');
      } else {
        const mockPost = {
          _id: 'mock_dashboard_' + Math.random().toString(36).substr(2, 9),
          title: blogTitle,
          content: blogContent,
          coverImage: blogCover || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
          authorName: user?.fullName || 'UBT Writer',
          category: finalCategory,
          status: 'Pending Approval',
          showLikes: true,
          showComments: true,
          likes: [],
          comments: [],
          createdAt: new Date()
        };
        setUserBlogs(prev => [mockPost, ...prev]);
        setBlogSuccess('Mock Mode: Blog post successfully submitted to the pending approval review queue!');
      }
      setBlogTitle('');
      setBlogCover('');
      setBlogContent('');
      setBlogCategory('Business Tips');
      setBlogCategoryOther('');
      setBlogSubmitNote('');
      setEditingBlogId(null);
      setTimeout(() => {
        setShowWriteBlogModal(false);
        setBlogSuccess('');
      }, 5000);
    } finally {
      setBlogWriteLoading(false);
    }
  };

  const handleSendRevisionComment = async (blogId) => {
    const messageText = replyTexts[blogId];
    if (!messageText || !messageText.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${blogId}/revision-comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('ubt_token')}`
        },
        body: JSON.stringify({ message: messageText })
      });
      const data = await res.json();
      if (data.success) {
        setReplyTexts(prev => ({ ...prev, [blogId]: '' }));
        fetchUserBlogs();
      } else {
        alert(data.message || 'Failed to send comment.');
      }
    } catch (err) {
      alert('Error sending revision comment.');
    }
  };

  useEffect(() => {
    if (token && activeTab === 'My Blogs') {
      fetchUserBlogs();
    }
  }, [token, activeTab]);

  const fetchUserEvents = async () => {
    if (!token) return;
    setEventsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/events/my-events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUserEvents(data.data);
      } else {
        throw new Error('Backend failed');
      }
    } catch (err) {
      console.warn('Backend server offline, loading mock events for dashboard.');
      const mockList = [
        {
          _id: 'evt_1',
          title: 'Sri Murugan Stores Mega Expo 2026',
          category: 'Business',
          description: 'A grand exhibition showcase highlighting fresh organic products, dry fruits, and household goods at Sri Murugan Stores.',
          date: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000),
          time: 'Saturday, 10:00 AM',
          venue: 'Gandhi Nagar, Udumalpet',
          organizer: 'Sri Murugan Stores',
          phone: '+91 94430 12345',
          price: 0,
          coverImageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80',
          duration: '1 Day'
        }
      ];
      setUserEvents(mockList);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleCreateEventDashboard = async (e) => {
    e.preventDefault();
    setEventSubmitLoading(true);
    setEventSuccess('');
    setEventError('');

    const finalCategory = eventCategory === 'Others' ? (customEventCategory.trim() || 'Others') : eventCategory;

    // Validate only basic details
    if (!eventTitle.trim() || !eventDate || !eventEndDate || !eventOrganizer || !eventDuration) {
      setEventError('Please enter all required fields.');
      setEventSubmitLoading(false);
      return;
    }

    try {
      const price = business && business.subscriptionStatus === 'active' ? 0 : 99;

      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: eventTitle,
          category: finalCategory,
          date: eventDate,
          endDate: eventEndDate,
          time: 'TBD',
          organizer: eventOrganizer,
          duration: eventDuration,
          price: 0,
          paymentLink: ''
        })
      });
      const data = await res.json();
      if (data.success) {
        const createdEvent = data.data;
        
        // Reset basic fields
        setEventTitle('');
        setEventDescription('');
        setEventDate('');
        setEventEndDate('');
        setEventTime('');
        setEventVenue('');
        setEventOrganizer('');
        setEventPhone('');
        setEventCoverUrl('');
        setEventPaymentLink('');
        setEventDuration('');
        fetchUserEvents();

        // Close first modal
        setShowCreateEventModal(false);

        // Initiate payment gateway or free waiver
        setCompleteEvent(createdEvent);
        setCompleteEventPhone(createdEvent.phone || '');
        setCompleteEventVenue(createdEvent.venue || '');
        setCompleteEventDescription(createdEvent.description || '');
        setCompleteEventCoverUrl(createdEvent.coverImageUrl || '');
        setCompleteEventPaymentLink(createdEvent.paymentLink || '');
        setCompleteEventPaymentStatus(createdEvent.paymentStatus || 'Pending');
        setCompleteEventPrice(createdEvent.price || 0);
        setCompleteEventTime(createdEvent.time || '');
        setEventPrice(0);
        setEventPaymentLink('');
        setCompleteEventError('');
        setCompleteEventSuccess('');
        setCompleteEventLoading(false);

        if (price === 0) {
          // Premium users don't need checkout screen, notify and submit for review
          alert('Premium active! Event successfully registered and submitted for admin review.');
        } else {
          // Standard charge checkout
          setCompleteEventStep(1);
          setShowCompleteEventModal(true);
        }
      } else {
        setEventError(data.message || 'Failed to submit event.');
      }
    } catch (err) {
      const price = business && business.subscriptionStatus === 'active' ? 0 : 99;
      const mockEvt = {
        _id: 'mock_evt_' + Math.random().toString(36).substr(2, 9),
        title: eventTitle,
        category: finalCategory,
        date: new Date(eventDate),
        endDate: new Date(eventEndDate),
        time: 'TBD',
        organizer: eventOrganizer,
        duration: eventDuration,
        price: 0,
        paymentLink: '',
        status: 'Pending Review',
        paymentStatus: price === 0 ? 'Free' : 'Pending',
        isCompleted: false
      };
      
      setUserEvents(prev => [mockEvt, ...prev]);

      setEventTitle('');
      setEventDescription('');
      setEventDate('');
      setEventEndDate('');
      setEventTime('');
      setEventVenue('');
      setEventOrganizer('');
      setEventPhone('');
      setEventCoverUrl('');
      setEventPaymentLink('');
      setEventDuration('');
      
      setShowCreateEventModal(false);

      setCompleteEvent(mockEvt);
      setCompleteEventPhone(mockEvt.phone || '');
      setCompleteEventVenue(mockEvt.venue || '');
      setCompleteEventDescription(mockEvt.description || '');
      setCompleteEventCoverUrl(mockEvt.coverImageUrl || '');
      setCompleteEventPaymentLink(mockEvt.paymentLink || '');
      setCompleteEventPaymentStatus(mockEvt.paymentStatus || 'Pending');
      setCompleteEventPrice(mockEvt.price || 0);
      setCompleteEventTime(mockEvt.time || '');
      setEventPrice(0);
      setEventPaymentLink('');
      setCompleteEventError('');
      setCompleteEventSuccess('');
      setCompleteEventLoading(false);

      if (price === 0) {
        alert('Mock Mode: Premium active! Event registered and submitted for review.');
      } else {
        setCompleteEventStep(1);
        setShowCompleteEventModal(true);
      }
    } finally {
      setEventSubmitLoading(false);
    }
  };

  const fetchReferralStats = async () => {
    setReferralsLoading(true);
    try {
      const activeToken = token || localStorage.getItem('ubt_token');
      const res = await fetch('http://localhost:5000/api/referrals/my-stats', {
        headers: {
          Authorization: `Bearer ${activeToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setReferralStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch referral stats:', err);
    } finally {
      setReferralsLoading(false);
    }
  };

  useEffect(() => {
    if (token && activeTab === 'Referral & Rewards') {
      fetchReferralStats();
    }
  }, [token, activeTab]);

  useEffect(() => {
    if (token && activeTab === 'Events') {
      fetchUserEvents();
    }
  }, [token, activeTab]);

  useEffect(() => {
    if (token && activeTab === 'Settings') {
      fetchUserBlogs();
      fetchUserEvents();
    }
  }, [token, activeTab]);

  useEffect(() => {
    if (token && activeTab === 'Menu' && business) {
      fetchMenu(token, business._id);
    }
  }, [token, activeTab, business]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileFieldsLoading(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: profileFields.fullName,
          email: profileFields.email,
          website: profileFields.website,
          instagram: profileFields.instagram,
          facebook: profileFields.facebook
        })
      });

      const data = await res.json();
      if (data.success) {
        setProfileSuccess('Profile details successfully updated!');
        const resUser = data.user || data.data;
        const updatedUser = { 
          ...user, 
          fullName: resUser.fullName || resUser.name, 
          email: resUser.email,
          website: resUser.website,
          instagram: resUser.instagram,
          facebook: resUser.facebook
        };
        setUser(updatedUser);
        localStorage.setItem('ubt_user', JSON.stringify(updatedUser));
      } else {
        setProfileError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileSuccess('Mock Mode: Profile credentials updated successfully!');
      const updatedUser = { 
        ...user, 
        fullName: profileFields.fullName, 
        email: profileFields.email,
        website: profileFields.website,
        instagram: profileFields.instagram,
        facebook: profileFields.facebook
      };
      setUser(updatedUser);
      localStorage.setItem('ubt_user', JSON.stringify(updatedUser));
    } finally {
      setProfileFieldsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdSuccess('');
    setPwdError('');

    if (pwdFields.newPassword !== pwdFields.confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }

    setPwdFieldsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: pwdFields.currentPassword,
          newPassword: pwdFields.newPassword
        })
      });

      const data = await res.json();
      if (data.success) {
        setPwdSuccess('Password changed successfully!');
        setPwdFields({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPwdError(data.message || 'Failed to change password.');
      }
    } catch (err) {
      setPwdSuccess('Mock Mode: Password changed successfully!');
      setPwdFields({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } finally {
      setPwdFieldsLoading(false);
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
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setUserBlogs(prev => prev.filter(b => b._id !== blogId));
        alert('Blog post removed successfully.');
      }
    } catch (err) {
      setUserBlogs(prev => prev.filter(b => b._id !== blogId));
      alert('Mock Mode: Blog post deleted.');
    }
  };

  const handleEventDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to permanently delete this event listing? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setUserEvents(prev => prev.filter(e => e._id !== eventId));
        alert('Event successfully removed.');
      }
    } catch (err) {
      setUserEvents(prev => prev.filter(e => e._id !== eventId));
      alert('Mock Mode: Event listing deleted.');
    }
  };

  const handleOpenCompleteEvent = async (evt) => {
    setCompleteEvent(evt);
    setCompleteEventPhone(evt.phone || '');
    setCompleteEventVenue(evt.venue || '');
    setCompleteEventDescription(evt.description || '');
    setCompleteEventCoverUrl(evt.coverImageUrl || '');
    setCompleteEventPaymentLink(evt.paymentLink || '');
    setCompleteEventPaymentStatus(evt.paymentStatus || 'Pending');
    setCompleteEventPrice(evt.price || 0);
    setCompleteEventTime(evt.time || '');
    setCompleteEventError('');
    setCompleteEventSuccess('');
    setCompleteEventLoading(true);
    setShowCompleteEventModal(true);

    try {
      const activeToken = token || localStorage.getItem('ubt_token');
      const res = await fetch('http://localhost:5000/api/events/check-subscription', {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      const data = await res.json();
      if (data.success && data.hasActiveSubscription) {
        evt.paymentStatus = 'Free';
        setCompleteEventPaymentStatus('Free');
        setCompleteEventStep(2);
      } else {
        setCompleteEventStep(evt.paymentStatus === 'Paid' || evt.paymentStatus === 'Free' ? 2 : 1);
      }
    } catch (err) {
      setCompleteEventStep(evt.paymentStatus === 'Paid' || evt.paymentStatus === 'Free' ? 2 : 1);
    } finally {
      setCompleteEventLoading(false);
    }
  };

  const handleEventCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setCompleteEventImageError('Image file size must be less than 5MB.');
      return;
    }

    setCompleteEventImageUploading(true);
    setCompleteEventImageError('');
    setCompleteEventError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const activeToken = token || localStorage.getItem('ubt_token');
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${activeToken}`
        },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setCompleteEventCoverUrl(data.url);
      } else {
        setCompleteEventImageError(data.message || 'Failed to upload image.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setCompleteEventImageError('Network error uploading image. Using a placeholder instead.');
      setCompleteEventCoverUrl(getEventDefaultImage(completeEvent?.category));
    } finally {
      setCompleteEventImageUploading(false);
    }
  };

  const handleEventPaymentCheckout = async (evtId) => {
    setCompleteEventLoading(true);
    setCompleteEventError('');
    const activeToken = token || localStorage.getItem('ubt_token');
    
    try {
      const orderRes = await fetch('http://localhost:5000/api/payments/create-event-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ eventId: evtId }),
      });
      const orderData = await orderRes.json();
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }
 
      if (orderData.amount === 0 || orderData.orderId === 'free_listing') {
        const verifyRes = await fetch('http://localhost:5000/api/payments/verify-event-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeToken}`,
          },
          body: JSON.stringify({
            eventId: evtId,
            razorpayOrderId: 'free_listing',
            razorpayPaymentId: 'pay_free_waived',
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setCompleteEventPaymentStatus('Free');
          fetchUserEvents();
          if (completeEvent && completeEvent.status === 'Approved') {
            setCompleteEventStep(2);
          } else {
            setCompleteEventSuccess('Free listing applied! Your event has been submitted for admin approval.');
            setTimeout(() => {
              setShowCompleteEventModal(false);
              setCompleteEvent(null);
              setCompleteEventSuccess('');
            }, 3000);
          }
        } else {
          throw new Error(verifyData.message || 'Sandbox payment verification failed.');
        }
      } else {
        const isRazorpayScriptLoaded = () => {
          return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };
 
        await isRazorpayScriptLoaded();
 
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Udumalpet Business Tour',
          description: 'Event Listing Fee',
          order_id: orderData.orderId,
          handler: async function (response) {
            try {
              setCompleteEventLoading(true);
              const verifyRes = await fetch('http://localhost:5000/api/payments/verify-event-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${activeToken}`,
                },
                body: JSON.stringify({
                  eventId: evtId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                setCompleteEventPaymentStatus('Paid');
                fetchUserEvents();
                fetchMyPayments();
                if (completeEvent && completeEvent.status === 'Approved') {
                  setCompleteEventStep(2);
                } else {
                  setCompleteEventSuccess('Payment verified successfully! Your event has been submitted for admin review.');
                  setTimeout(() => {
                    setShowCompleteEventModal(false);
                    setCompleteEvent(null);
                    setCompleteEventSuccess('');
                  }, 3000);
                }
              } else {
                setCompleteEventError('Payment verification failed.');
              }
            } catch (err) {
              setCompleteEventError('Signature verification connection failed.');
            } finally {
              setCompleteEventLoading(false);
            }
          },
          prefill: {
            name: user?.fullName || '',
            email: user?.email || '',
            contact: user?.mobileNumber || '',
          },
          theme: {
            color: '#027244',
          },
        };
 
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      }
    } catch (err) {
      console.warn('Razorpay popup blocked/failed, using Sandbox payment verification fallback...', err);
      try {
        const mockOrderId = 'order_mock_' + Math.random().toString(36).substr(2, 9);
        const mockPaymentId = 'pay_mock_' + Math.random().toString(36).substr(2, 9);
        
        const verifyRes = await fetch('http://localhost:5000/api/payments/verify-event-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeToken}`,
          },
          body: JSON.stringify({
            eventId: evtId,
            razorpayOrderId: mockOrderId,
            razorpayPaymentId: mockPaymentId,
            razorpaySignature: '',
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setCompleteEventPaymentStatus('Paid');
          fetchUserEvents();
          fetchMyPayments();
          if (completeEvent && completeEvent.status === 'Approved') {
            setCompleteEventStep(2);
          } else {
            setCompleteEventSuccess('Sandbox Payment verified! Your event has been submitted for admin review.');
            setTimeout(() => {
              setShowCompleteEventModal(false);
              setCompleteEvent(null);
              setCompleteEventSuccess('');
            }, 3000);
          }
        } else {
          setCompleteEventError(verifyData.message || 'Sandbox payment verification failed.');
        }
      } catch (innerErr) {
        setCompleteEventError('Sandbox payment verification connection failed.');
      }
    } finally {
      setCompleteEventLoading(false);
    }
  };

  const handleEventPaymentSkip = async (evtId) => {
    setCompleteEventLoading(true);
    setCompleteEventError('');
    const activeToken = token || localStorage.getItem('ubt_token');
    
    try {
      const verifyRes = await fetch('http://localhost:5000/api/payments/verify-event-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({
          eventId: evtId,
          razorpayOrderId: 'order_mock_skip_' + Math.random().toString(36).substr(2, 9),
          razorpayPaymentId: 'pay_mock_skip_' + Math.random().toString(36).substr(2, 9),
        }),
      });
      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setCompleteEventPaymentStatus('Paid');
        fetchUserEvents();
        
        if (completeEvent && completeEvent.status === 'Approved') {
          setCompleteEventStep(2);
        } else {
          setCompleteEventSuccess('Payment skipped! Your event has been submitted for admin review.');
          setTimeout(() => {
            setShowCompleteEventModal(false);
            setCompleteEvent(null);
            setCompleteEventSuccess('');
          }, 3000);
        }
      } else {
        setCompleteEventError(verifyData.message || 'Payment skip verification failed.');
      }
    } catch (err) {
      console.warn('Skip payment fallback local verification...', err);
      setCompleteEventPaymentStatus('Paid');
      if (completeEvent && completeEvent.status === 'Approved') {
        setCompleteEventStep(2);
      } else {
        setCompleteEventSuccess('Mock Mode: Payment skipped! Submitted for admin review.');
        setTimeout(() => {
          setShowCompleteEventModal(false);
          setCompleteEvent(null);
          setCompleteEventSuccess('');
        }, 3000);
      }
    } finally {
      setCompleteEventLoading(false);
    }
  };

  const handleCancelEventPayment = async (evtId) => {
    if (!evtId) return;
    if (String(evtId).startsWith('mock_evt_')) {
      setUserEvents(prev => prev.filter(evt => evt._id !== evtId));
      return;
    }
    try {
      const activeToken = token || localStorage.getItem('ubt_token');
      await fetch(`http://localhost:5000/api/events/${evtId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${activeToken}`
        }
      });
      fetchUserEvents();
    } catch (err) {
      console.error('Error deleting unpaid event:', err);
      setUserEvents(prev => prev.filter(evt => evt._id !== evtId));
    }
  };

  const handlePublishEventDetails = async (e) => {
    e.preventDefault();
    if (!completeEventVenue || !completeEventPhone || !completeEventDescription) {
      setCompleteEventError('Location address, helpline phone and description are required.');
      return;
    }

    setCompleteEventLoading(true);
    setCompleteEventError('');
    setCompleteEventSuccess('');
    const activeToken = token || localStorage.getItem('ubt_token');

    try {
      const res = await fetch(`http://localhost:5000/api/events/${completeEvent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`
        },
        body: JSON.stringify({
          venue: completeEventVenue,
          phone: completeEventPhone,
          description: completeEventDescription,
          coverImageUrl: completeEventCoverUrl,
          paymentLink: completeEventPaymentLink,
          isCompleted: true,
          paymentStatus: completeEventPaymentStatus,
          price: completeEventPrice,
          time: completeEventTime
        })
      });

      const data = await res.json();
      if (data.success) {
        setCompleteEventSuccess('Event listed successfully! It is now live in the directory.');
        fetchUserEvents();
        setTimeout(() => {
          setShowCompleteEventModal(false);
          setCompleteEvent(null);
        }, 3000);
      } else {
        setCompleteEventError(data.message || 'Failed to update event details.');
      }
    } catch (err) {
      setUserEvents(prev => prev.map(evt => evt._id === completeEvent._id ? {
        ...evt,
        venue: completeEventVenue,
        phone: completeEventPhone,
        description: completeEventDescription,
        coverImageUrl: completeEventCoverUrl || getEventDefaultImage(completeEvent?.category),
        paymentLink: completeEventPaymentLink,
        isCompleted: true,
        paymentStatus: completeEventPaymentStatus,
        price: completeEventPrice,
        time: completeEventTime
      } : evt));

      setCompleteEventSuccess('Mock Mode: Event listed successfully!');
      setTimeout(() => {
        setShowCompleteEventModal(false);
        setCompleteEvent(null);
      }, 3000);
    } finally {
      setCompleteEventLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== 'DELETE') {
      alert('Please type DELETE to confirm your registration removal.');
      return;
    }

    if (!window.confirm('WARNING: Are you absolutely sure you want to permanently deregister and delete your UBT account? This will permanently delete your profile, business listings, events, and blogs. This action is irreversible.')) {
      return;
    }
    if (!window.confirm('CONFIRM ACCOUNT DELETION: Click OK to proceed with permanent registration removal.')) {
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/delete', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        localStorage.removeItem('ubt_token');
        localStorage.removeItem('ubt_user');
        navigate('/register');
      }
    } catch (err) {
      alert('Mock Mode: Account successfully de-registered. Purging local storage session.');
      localStorage.removeItem('ubt_token');
      localStorage.removeItem('ubt_user');
      navigate('/register');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!business) return;
 
    setLoading(true);

    const postData = {
      name: editFields.name,
      category: editFields.category,
      type: editFields.type,
      requestedParentCategory: editFields.requestedParentCategory,
      customCategoryName: editFields.customCategoryName,
      categoryStatus: editFields.categoryStatus,
      description: editFields.description,
      phone: editFields.phone,
      whatsapp: editFields.whatsapp,
      email: editFields.email,
      website: editFields.website,
      facebook: editFields.facebook,
      instagram: editFields.instagram,
      address: editFields.address,
      locality: editFields.locality,
      pincode: editFields.pincode,
      yearEstablished: editFields.yearEstablished ? Number(editFields.yearEstablished) : undefined,
      employeeCount: editFields.employeeCount,
      gstNumber: editFields.gstNumber,
      serviceArea: editFields.serviceArea,
      languagesKnown: editFields.languagesKnown,
      services: typeof editFields.services === 'string' ? editFields.services.split(',').map(s => s.trim()).filter(Boolean) : (editFields.services || []),
      brands: typeof editFields.brands === 'string' ? editFields.brands.split(',').map(b => b.trim()).filter(Boolean) : (editFields.brands || []),
      highlights: typeof editFields.highlights === 'string' ? editFields.highlights.split(',').map(h => h.trim()).filter(Boolean) : (editFields.highlights || []),
      logoUrl: editFields.logoUrl,
      coverImageUrl: editFields.coverImageUrl,
      galleryUrls: typeof editFields.galleryUrls === 'string' ? editFields.galleryUrls.split(',').map(g => g.trim()).filter(Boolean) : (editFields.galleryUrls || []),
      isAddressVerified: true,
      timings: {
        Monday: editFields.timingsMon,
        Tuesday: editFields.timingsTue,
        Wednesday: editFields.timingsWed,
        Thursday: editFields.timingsThu,
        Friday: editFields.timingsFri,
        Saturday: editFields.timingsSat,
        Sunday: editFields.timingsSun,
      }
    };

    try {
      const res = await fetch(`http://localhost:5000/api/businesses/${business._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      if (data.success) {
        setBusiness(data.data);
        // Sync photo gallery from updated business data
        const updatedGallery = Array.isArray(data.data.galleryUrls) ? data.data.galleryUrls
          : (typeof data.data.galleryUrls === 'string' ? data.data.galleryUrls.split(',').map(s => s.trim()).filter(Boolean) : []);
        setPhotoGallery(updatedGallery);
        setUploadedPhotosCount(updatedGallery.length);
        
        // Also update the branches list in state if this is a branch
        if (data.data.parentBusinessId) {
          setBranches(prev => prev.map(b => b._id === data.data._id ? data.data : b));
        }

        setShowEditModal(false);
      } else {
        throw new Error('Fallback required');
      }
    } catch (err) {
      // Mock update locally on fallback
      setBusiness(prev => {
        const updatedMock = {
          ...prev,
          ...postData,
          _id: prev._id
        };
        if (updatedMock.parentBusinessId) {
          setBranches(prevBr => prevBr.map(b => b._id === updatedMock._id ? updatedMock : b));
        }
        return updatedMock;
      });
      setShowEditModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
    try {
      // Save current photoGallery (already uploaded) to backend
      await saveInlineFields({ galleryUrls: photoGallery });
      // Update editFields to reflect saved gallery
      setEditFields(prev => ({ ...prev, galleryUrls: photoGallery.join(', ') }));
      setBusiness(prev => ({ ...prev, galleryUrls: photoGallery }));
      setShowUploadModal(false);
    } catch (err) {
      console.error('Error saving gallery:', err);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleGalleryFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadLoading(true);
    const activeToken = token || localStorage.getItem('ubt_token');
    const uploadedUrls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        continue;
      }
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${activeToken}` },
          body: formData
        });
        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        }
      } catch (err) {
        console.error('Gallery upload error:', err);
      }
    }
    if (uploadedUrls.length > 0) {
      setPhotoGallery(prev => {
        const combined = [...prev, ...uploadedUrls];
        setUploadedPhotosCount(combined.length);
        return combined;
      });
    }
    setUploadLoading(false);
  };

  const handlePaymentCheckout = async (planOverride) => {
    if (!business) return;

    const planToUse = planOverride || selectedPlan;
    setPaymentLoading(true);
    setError('');

    try {
      // 1. Create order on backend
      const orderRes = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessId: business._id,
          planType: planToUse,
          applyReferralPoints: applyReferralPoints,
          redeemPointsAmount: Number(redeemPointsAmount || 0)
        }),
      });
      const orderData = await orderRes.json();
      
      if (!orderData.success) {
        setError('Failed to initialize Razorpay checkout.');
        setPaymentLoading(false);
        return;
      }

      // If points fully cover payment (amount is 0)
      if (orderData.amount === 0) {
        const verifyRes = await fetch('http://localhost:5000/api/payments/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            businessId: business._id,
            planType: planToUse,
            razorpayOrderId: orderData.orderId,
            razorpayPaymentId: 'pay_points_redeemed_' + Date.now(),
            razorpaySignature: '',
            applyReferralPoints: true,
            redeemPointsAmount: Number(redeemPointsAmount || 0)
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setBusiness(verifyData.business);
          setPaymentSuccess(true);
          setShowRenewModal(false);
          fetchReferralStats();
          setTimeout(() => setPaymentSuccess(false), 4000);
        } else {
          setError(verifyData.message || 'Points redemption failed.');
        }
        setPaymentLoading(false);
        return;
      }

      // Check if Razorpay Script is loaded
      const isRazorpayScriptLoaded = () => {
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      await isRazorpayScriptLoaded();

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Udumalpet Business Tour',
        description: `${planToUse} Premium Subscription`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // 2. Verify payment on backend
            const verifyRes = await fetch('http://localhost:5000/api/payments/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                businessId: business._id,
                planType: planToUse,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                applyReferralPoints: applyReferralPoints,
                redeemPointsAmount: Number(redeemPointsAmount || 0)
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setBusiness(verifyData.business);
              setPaymentSuccess(true);
              setShowRenewModal(false);
              fetchReferralStats();
              fetchMyPayments();
              setTimeout(() => setPaymentSuccess(false), 4000);
            } else {
              setError('Payment verification failed.');
            }
          } catch (verifyErr) {
            console.error('Error verifying payment:', verifyErr);
            setError('Payment verification server error.');
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: user.fullName,
          email: user.email,
          contact: user.mobileNumber,
        },
        theme: {
          color: '#027244', 
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.warn('Razorpay popup blocked/failed, finalizing database via local Sandbox payment verification...', err);
      try {
        const mockOrderId = 'order_mock_' + Math.random().toString(36).substr(2, 9);
        const mockPaymentId = 'pay_mock_' + Math.random().toString(36).substr(2, 9);
        
        const verifyRes = await fetch('http://localhost:5000/api/payments/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            businessId: business._id,
            planType: planToUse,
            razorpayOrderId: mockOrderId,
            razorpayPaymentId: mockPaymentId,
            razorpaySignature: '',
            applyReferralPoints: applyReferralPoints,
            redeemPointsAmount: Number(redeemPointsAmount || 0)
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setBusiness(verifyData.business);
          setPaymentSuccess(true);
          setShowRenewModal(false);
          fetchReferralStats();
          fetchMyPayments();
          setTimeout(() => setPaymentSuccess(false), 4000);
        } else {
          setError(verifyData.message || 'Sandbox payment verification failed.');
        }
      } catch (mockErr) {
        console.error('Mock verification error:', mockErr);
        setError('Sandbox verification failed.');
      } finally {
        setPaymentLoading(false);
      }
    }
  };

  const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return 0;
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  };

  const copyReviewLink = () => {
    navigator.clipboard.writeText('https://g.page/r/CfLKj12345ABC/review');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyProfileLink = () => {
    if (!business || !business._id) {
      alert("Business details not loaded yet.");
      return;
    }
    const url = `${window.location.origin}/businesses/${business._id}`;
    navigator.clipboard.writeText(url);
    alert("Business profile link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-3 text-slate-400 min-h-screen bg-slate-50">
        <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
        <span className="text-xs font-extrabold tracking-wide">Syncing your dashboard dashboard...</span>
      </div>
    );
  }

  // Safe defaults if business is null (standard user has no listing)
  const isExpired = business ? business.subscriptionStatus === 'expired' : false;
  const daysLeft = business ? getDaysRemaining(business.subscriptionExpiry) : 0;
  const isMandatorySubscription = business && business.status === 'Approved' && business.subscriptionStatus !== 'active';

  // Mock items aligned with the exact design mockup!
  const mockLeads = [
    { name: 'Suresh Kumar', category: 'Electrical Wiring', phone: '+91 97865 43210', time: '2 mins ago', initial: 'S', color: 'bg-blue-100 text-blue-600' },
    { name: 'Ramesh Babu', category: 'Switch Board Repair', phone: '+91 94423 56789', time: '15 mins ago', initial: 'R', color: 'bg-green-100 text-green-600' },
    { name: 'Kavin Prakash', category: 'Inverter Installation', phone: '+91 91500 67890', time: '1 hour ago', initial: 'K', color: 'bg-purple-100 text-purple-600' },
    { name: 'Vijay Anand', category: 'Fan Installation', phone: '+91 95678 12345', time: '2 hours ago', initial: 'V', color: 'bg-amber-100 text-amber-600' },
    { name: 'Meena Devi', category: 'General Service', phone: '+91 99945 67890', time: '3 hours ago', initial: 'M', color: 'bg-slate-100 text-slate-600' }
  ];

  // Dynamic sidebarLinks based on whether they have registered a business listing
  const sidebarLinks = [
    ...(business ? [
      { label: 'Dashboard', icon: <Briefcase className="h-4 w-4" /> },
      { label: 'Business Details', icon: <Edit3 className="h-4 w-4" /> },
      { label: 'Branches', icon: <MapPin className="h-4 w-4" /> },
      ...(isFoodRelated(business.category, business.customCategoryName) ? [
        { label: 'Menu', icon: <Utensils className="h-4 w-4" /> }
      ] : []),
      { label: 'Photos & Media', icon: <ImageIcon className="h-4 w-4" /> },
      { label: 'Reviews & Reputation', icon: <Star className="h-4 w-4" /> },
      { label: 'Leads & Enquiries', icon: <Mail className="h-4 w-4" />, badge: 18 },
      { label: 'Subscription & Billing', icon: <CreditCard className="h-4 w-4" /> },
      { label: 'Offers & Promotions', icon: <Sparkles className="h-4 w-4" /> },
      { label: 'Referral & Rewards', icon: <Gift className="h-4 w-4" /> }
    ] : [
      { label: 'My Business', icon: <Briefcase className="h-4 w-4" /> }
    ]),
    { label: 'Events', icon: <Calendar className="h-4 w-4" /> },
    { label: 'My Blogs', icon: <FileEdit className="h-4 w-4" /> },
    { label: 'Settings', icon: <Settings className="h-4 w-4" /> },
    { label: 'Help & Support', icon: <HelpCircle className="h-4 w-4" /> },
    { label: 'Logout', icon: <LogOut className="h-4 w-4" />, onClick: handleLogout },
  ];

  const displayEvents = userEvents.filter(evt => evt.paymentStatus !== 'Pending');

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] flex font-sans leading-relaxed selection:bg-emerald-500 selection:text-white">
      
      {/* 1. LEFT NAVIGATION SIDEBAR */}
      <aside className={`w-[270px] bg-[#001c41] text-slate-300 flex flex-col shrink-0 border-r border-slate-800 transition-transform duration-300 z-50 fixed lg:static inset-y-0 left-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-0 hidden lg:flex'}`}>
        
        {/* Logo block */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center select-none py-1 overflow-hidden shrink-0">
            <img src="/logo-dark.png" alt="Udumalpet Business Tour" className="h-10.5 w-auto object-contain" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Business Identity Card */}
        {business && (
          <div className="p-4.5 bg-slate-900/40 border border-slate-800/60 rounded-2xl m-4.5 flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center font-extrabold text-[#001c41] text-sm shadow-inner uppercase select-none shrink-0">
              {(business.name || 'B').charAt(0)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <h4 className="font-extrabold text-white text-xs leading-snug truncate">{business.name}</h4>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                {isGmbVerified ? (
                  <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-900/60 px-1.5 py-0.5 rounded text-[8.5px] font-extrabold inline-flex items-center gap-1 shrink-0">
                    <svg className="h-2.5 w-2.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.8 17 5 19 5a1 1 0 0 1 1 1z" fill="currentColor" />
                      <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg> UDT Verified
                  </span>
                ) : business.status === 'Approved' ? (
                  <span className="bg-blue-950/80 text-blue-400 border border-blue-900/60 px-1.5 py-0.5 rounded text-[8.5px] font-extrabold inline-flex items-center gap-0.5 shrink-0">
                    <Check className="h-2.5 w-2.5" /> Approved
                  </span>
                ) : business.status === 'Under Review' ? (
                  <span className="bg-blue-950/80 text-blue-400 border border-blue-900/60 px-1.5 py-0.5 rounded text-[8.5px] font-extrabold inline-flex items-center gap-0.5 shrink-0 animate-pulse">
                    <AlertCircle className="h-2.5 w-2.5" /> Under Review
                  </span>
                ) : business.status === 'Suspended' ? (
                  <span className="bg-red-950/80 text-red-400 border border-red-900/60 px-1.5 py-0.5 rounded text-[8.5px] font-extrabold inline-flex items-center gap-0.5 shrink-0">
                    <AlertCircle className="h-2.5 w-2.5" /> Suspended
                  </span>
                ) : business.status === 'Rejected' ? (
                  <span className="bg-rose-950/80 text-rose-455 border border-rose-900/60 px-1.5 py-0.5 rounded text-[8.5px] font-extrabold inline-flex items-center gap-0.5 shrink-0">
                    <AlertCircle className="h-2.5 w-2.5" /> Rejected
                  </span>
                ) : (
                  <span className="bg-amber-950/80 text-amber-400 border border-amber-900/60 px-1.5 py-0.5 rounded text-[8.5px] font-extrabold inline-flex items-center gap-0.5 shrink-0">
                    <AlertCircle className="h-2.5 w-2.5" /> Pending Vetting
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5 overflow-y-auto">
          {sidebarLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (link.onClick) {
                  link.onClick();
                } else {
                  setSearchParams({ tab: link.label });
                }
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[11.5px] font-extrabold transition-all hover:bg-slate-800/40 hover:text-white cursor-pointer ${
                activeTab === link.label && !link.onClick
                  ? 'bg-[#027244] text-white shadow-md shadow-emerald-900/20' 
                  : link.label === 'Logout'
                    ? 'text-rose-400 hover:bg-rose-950/20 hover:text-rose-350'
                    : 'text-slate-400 hover:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={
                  activeTab === link.label && !link.onClick 
                    ? 'text-emerald-300' 
                    : link.label === 'Logout'
                      ? 'text-rose-455 group-hover:text-rose-350'
                      : 'text-slate-500 group-hover:text-slate-300'
                }>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="bg-red-500 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full select-none">
                  {link.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Upgrade Plan Callout Widget */}
        {business && (
          <div className="m-4.5 p-4 bg-slate-900/40 border border-slate-850 rounded-2xl flex flex-col gap-2 relative overflow-hidden shadow-sm">
            <div className="absolute -right-8 -top-8 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            <h5 className="text-[11px] font-extrabold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 fill-current" /> Upgrade Your Plan
            </h5>
            <p className="text-[10px] text-slate-400 font-bold leading-normal">
              Get more visibility, leads and grow your business faster.
            </p>
            <button 
              onClick={(e) => openModalAtClickLevel(e, setShowRenewModal, 650)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-extrabold rounded-xl transition-all shadow-md shadow-emerald-950/20 cursor-pointer mt-1"
            >
              Upgrade Now
            </button>
          </div>
        )}

        {/* Need Help Helpline Card */}
        <div className="px-4.5 pb-6 border-t border-slate-800 pt-4 flex flex-col gap-1.5 shrink-0 bg-slate-950/20">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <PhoneCall className="h-3 w-3" /> Need Help?
          </span>
          <p className="text-[10px] text-slate-400 font-semibold leading-normal">
            Our support team is here to help you.
          </p>
          <a href="tel:+911234567890" className="text-xs text-emerald-400 hover:text-emerald-300 font-extrabold flex items-center gap-1 transition-colors mt-0.5">
            +91 12345 67890
          </a>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden" />
      )}

      {/* 2. MAIN LAYOUT CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* Top Header bar */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-xs">
          
          {/* Breadcrumb Left Header block */}
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 cursor-pointer">
              <Menu className="h-4.5 w-4.5" />
            </button>
            <div className="flex flex-col text-left">
              <h2 className="text-[#001c41] text-base md:text-lg font-extrabold tracking-tight">Dashboard</h2>
              <span className="text-slate-400 text-[10px] md:text-xs font-semibold tracking-wide mt-0.5">
                Welcome back! Here's what's happening with your business.
              </span>
            </div>
          </div>

          {/* Active Business/Branch Switcher */}
          {primaryBusiness && branches && branches.length > 0 && (
            <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-150 rounded-xl px-2.5 py-1.5 shadow-3xs animate-fadeIn max-w-[150px] sm:max-w-none">
              <span className="text-[9.5px] text-[#027244] font-black uppercase tracking-wider font-sans hidden md:inline">Active Office:</span>
              <select
                value={business?._id || ''}
                onChange={(e) => {
                  handleSwitchBusiness(e.target.value);
                  setActiveTab('Business Details');
                }}
                className="bg-transparent border-none text-xs font-black text-[#001c41] outline-none cursor-pointer pr-3 font-sans max-w-full"
              >
                <option value={primaryBusiness._id}>{primaryBusiness.name} (Main Office)</option>
                {branches.map((br) => (
                  <option key={br._id} value={br._id}>{br.name} (Branch)</option>
                ))}
              </select>
            </div>
          )}

          {/* Right Header tools */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            {business && (
              <Link 
                to={`/businesses/${business._id}`}
                target="_blank"
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {business.parentBusinessId ? 'View Branch Profile' : 'View Business Profile'}
                </span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}

            {/* Notification bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-slate-500 transition-colors cursor-pointer group"
              >
                <Bell className="h-4 w-4 group-hover:scale-105 transition-transform" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white text-[9px] font-extrabold text-white flex items-center justify-center select-none animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-2.5 z-50 text-slate-800 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                    <span className="font-extrabold text-xs text-slate-700">Notifications ({notifications.length})</span>
                    {notifications.length > 0 && (
                      <button onClick={markAllRead} className="text-emerald-600 hover:text-emerald-700 hover:underline text-[10px] font-bold cursor-pointer border-none bg-transparent">
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-5 text-center text-slate-400 text-xs font-semibold">No new notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n._id} className="p-3.5 border-b border-slate-50 hover:bg-slate-50/50 text-[11px] font-semibold leading-relaxed text-left flex flex-col gap-1">
                          <p className="text-slate-600 m-0">{n.message}</p>
                          <span className="text-[9px] text-slate-400 font-bold">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar dropdown summary */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.fullName || 'User'} 
                  className="h-8.5 w-8.5 rounded-full border border-slate-200 object-cover bg-slate-50"
                />
              ) : (
                <div className="h-8.5 w-8.5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 text-xs font-black select-none uppercase">
                  {(user?.fullName || user?.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
              )}
              <div className="flex flex-col text-left hidden sm:flex">
                <span className="text-xs font-extrabold text-slate-800 leading-none">{user?.fullName}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  {user?.role === 'admin' ? 'Administrator' : (business ? 'Business Owner' : 'Writer / Member')}
                </span>
              </div>
            </div>
          </div>

        </header>

        {/* Scrollable Workspace Panels */}
        <main className="flex-grow overflow-y-auto px-6 py-6 max-w-7xl w-full mx-auto flex flex-col gap-6">
          
          {/* Banner notification updates */}
          {successBanner && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-3xl p-5 shadow-sm flex items-start gap-4 animate-fadeIn">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 flex flex-col gap-1 text-left">
                <span className="font-extrabold text-xs text-slate-800">Registration Details Synced!</span>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">{successBanner}</p>
                <button onClick={() => setSuccessBanner('')} className="text-[10px] font-bold text-emerald-600 hover:underline mt-2 self-start cursor-pointer">
                  Dismiss alert
                </button>
              </div>
            </div>
          )}

          {/* Business Verification Status Alert Banners */}
          {business && !isExpired && (
            <>
              {business.status === 'Pending Verification' && (
                <div className="bg-amber-50 border border-amber-200 text-amber-805 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn text-left">
                  <div className="flex items-start gap-3.5">
                    <AlertTriangle className="h-5.5 w-5.5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-extrabold text-xs text-slate-800">Verification Pending</span>
                      <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                        Your listing is successfully submitted. It will become live globally in the directory as soon as the administrators verify your business details.
                      </p>
                      {business.googlePlaceId && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="bg-blue-100 text-blue-700 border border-blue-200 text-[8.5px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-0.5 shadow-2xs">
                            ⚡ Google Connected — Faster Approval Active
                          </span>
                          <span className="text-[9.5px] font-extrabold text-slate-450">High-trust priority queue active!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {business.status === 'Under Review' && (
                <div className="bg-blue-50 border border-blue-200 text-blue-805 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn text-left">
                  <div className="flex items-start gap-3.5">
                    <RefreshCw className="h-5.5 w-5.5 text-blue-500 shrink-0 mt-0.5 animate-spin" />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-extrabold text-xs text-slate-800">Profile Under Review</span>
                      <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                        An auditor is currently reviewing your registration documents, locality, and contact details. Vetting usually completes within 2-4 hours.
                      </p>
                      {business.googlePlaceId && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="bg-blue-100 text-blue-700 border border-blue-200 text-[8.5px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-0.5 shadow-2xs">
                            ⚡ Google Connected — Faster Approval Active
                          </span>
                          <span className="text-[9.5px] font-extrabold text-slate-450">Vetting priority enabled.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {business.status === 'Suspended' && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-shake text-left">
                  <div className="flex items-start gap-3.5">
                    <AlertCircle className="h-5.5 w-5.5 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-extrabold text-xs text-slate-800">Listing Suspended</span>
                      <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                        This profile has been suspended by the administrators due to auditing terms or unresolved complaints. Please reach out to customer support to resolve.
                      </p>
                    </div>
                  </div>
                  <a href="tel:+911234567890" className="bg-red-650 hover:bg-red-700 text-white font-extrabold text-[10.5px] py-2 px-5 rounded-xl transition-all shadow-sm shrink-0 uppercase tracking-wide">
                    Helpline Support
                  </a>
                </div>
              )}

              {business.status === 'Rejected' && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn text-left">
                  <div className="flex items-start gap-3.5">
                    <AlertCircle className="h-5.5 w-5.5 text-rose-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-extrabold text-xs text-slate-800">Audit Rejected</span>
                      <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                        Your registration has been rejected because of mismatched parameters, incorrect locality inputs, or invalid GST formats. Edit details below and resubmit.
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setShowEditModal(true)} className="bg-slate-100 hover:bg-slate-200 border border-slate-350 text-slate-700 font-extrabold text-[10.5px] py-2 px-5 rounded-xl transition-all shadow-sm shrink-0 uppercase tracking-wide">
                    Edit Profile
                  </button>
                </div>
              )}
            </>
          )}

          {isExpired && (
            <div className="bg-red-650 text-white border-none rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse text-left">
              <div className="flex items-start gap-3.5">
                <AlertTriangle className="h-5.5 w-5.5 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-extrabold text-xs">Profile Visibility Locked!</span>
                  <p className="text-[11px] text-red-100 font-bold leading-relaxed">
                    Subscription expired. Store images are blurred, rank is reduced, and WhatsApp contact buttons are hidden. Renew today!
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => openModalAtClickLevel(e, setShowRenewModal, 650)} 
                className="bg-white text-red-700 font-extrabold text-[10.5px] py-2 px-5 rounded-xl hover:bg-slate-100 transition-colors uppercase shrink-0 cursor-pointer shadow-sm"
              >
                Renew Subscription
              </button>
            </div>
          )}

          {paymentSuccess && (
            <div className="bg-emerald-600 text-white border-none rounded-3xl p-4 shadow flex items-center gap-3.5 animate-fadeIn text-left">
              <CheckCircle className="h-5.5 w-5.5 shrink-0" />
              <div className="flex flex-col">
                <span className="font-extrabold text-xs">Payment Verified!</span>
                <span className="text-[11px] text-emerald-100 font-bold">Your premium subscription is activated immediately. Visibility fully restored!</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: BUSINESS OWNER DASHBOARD (KPI CARDS, LEADS, AND AUDITS) */}
          {/* ========================================================================= */}
          {activeTab === 'Dashboard' && business && (
            <>
              {/* 3. KPI CARDS ROW (6 Horizontal premium aligned widgets) */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                
                {/* Total Leads */}
                <div className="card-premium p-4.5 rounded-2xl flex items-center gap-3.5 bg-white">
                  <div className="h-10.5 w-10.5 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden min-w-0">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest truncate">Total Leads</span>
                    <span className="text-xl font-extrabold text-slate-800 leading-none mt-1">{leadsList.length}</span>
                    <span className="text-[9px] font-extrabold text-emerald-600 flex items-center gap-0.5 mt-1.5">
                      ↑ 18% this month
                    </span>
                  </div>
                </div>

                {/* Call Clicks */}
                <div className="card-premium p-4.5 rounded-2xl flex items-center gap-3.5 bg-white">
                  <div className="h-10.5 w-10.5 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <PhoneCall className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden min-w-0">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest truncate">Call Clicks</span>
                    <span className="text-xl font-extrabold text-slate-800 leading-none mt-1">{business.callClicks ?? 46}</span>
                    <span className="text-[9px] font-extrabold text-emerald-600 flex items-center gap-0.5 mt-1.5">
                      ↑ 12% this month
                    </span>
                  </div>
                </div>

                {/* WhatsApp Clicks */}
                <div className="card-premium p-4.5 rounded-2xl flex items-center gap-3.5 bg-white">
                  <div className="h-10.5 w-10.5 rounded-xl bg-emerald-55/15 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden min-w-0">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest truncate">WhatsApp Clicks</span>
                    <span className="text-xl font-extrabold text-slate-800 leading-none mt-1">{business.whatsappClicks ?? 82}</span>
                    <span className="text-[9px] font-extrabold text-emerald-600 flex items-center gap-0.5 mt-1.5">
                      ↑ 22% this month
                    </span>
                  </div>
                </div>

                {/* Website Clicks */}
                <div className="card-premium p-4.5 rounded-2xl flex items-center gap-3.5 bg-white">
                  <div className="h-10.5 w-10.5 rounded-xl bg-teal-50 text-teal-650 flex items-center justify-center shrink-0">
                    <Globe className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden min-w-0">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest truncate">Website Clicks</span>
                    <span className="text-xl font-extrabold text-slate-800 leading-none mt-1">{business.websiteClicks ?? 24}</span>
                    <span className="text-[9px] font-extrabold text-emerald-600 flex items-center gap-0.5 mt-1.5">
                      ↑ 15% this month
                    </span>
                  </div>
                </div>

                {/* Social Clicks */}
                <div className="card-premium p-4.5 rounded-2xl flex items-center gap-3.5 bg-white">
                  <div className="h-10.5 w-10.5 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                    <Users className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden min-w-0">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest truncate">Social Clicks</span>
                    <span className="text-xl font-extrabold text-slate-800 leading-none mt-1">
                      {((business.facebookClicks || 0) + (business.instagramClicks || 0)) || 56}
                    </span>
                    <span className="text-[9px] font-extrabold text-emerald-600 flex items-center gap-0.5 mt-1.5">
                      ↑ 19% this month
                    </span>
                  </div>
                </div>

                {/* Average Rating */}
                <div className="card-premium p-4.5 rounded-2xl flex items-center gap-3.5 bg-white">
                  <div className="h-10.5 w-10.5 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                    <Star className="h-4.5 w-4.5 fill-current" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden min-w-0">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest truncate">Average Rating</span>
                    <span className="text-xl font-extrabold text-slate-800 leading-none mt-1">4.7</span>
                    <span className="text-[9px] font-bold text-slate-400 mt-1.5 truncate">
                      (68 Reviews)
                    </span>
                  </div>
                </div>

                {/* Listing Status */}
                <div className="card-premium p-4.5 rounded-2xl flex items-center gap-3.5 bg-white">
                  <div className={`h-10.5 w-10.5 rounded-xl flex items-center justify-center shrink-0 ${
                    isGmbVerified ? 'bg-emerald-50 text-emerald-600' :
                    business.status === 'Approved' ? 'bg-blue-50 text-blue-600' :
                    business.status === 'Under Review' ? 'bg-blue-50 text-blue-600 animate-pulse' :
                    business.status === 'Suspended' ? 'bg-red-50 text-red-650' :
                    business.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-500'
                  }`}>
                    {isGmbVerified ? (
                      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.8 17 5 19 5a1 1 0 0 1 1 1z" fill="currentColor" />
                        <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : business.status === 'Approved' ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex flex-col text-left overflow-hidden min-w-0">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest truncate">Listing Status</span>
                    <span className={`text-[15px] font-extrabold leading-none mt-1.5 truncate ${
                      isGmbVerified ? 'text-[#027244]' :
                      business.status === 'Approved' ? 'text-blue-650' :
                      business.status === 'Under Review' ? 'text-blue-650' :
                      business.status === 'Suspended' ? 'text-red-650' :
                      business.status === 'Rejected' ? 'text-rose-600' : 'text-amber-550'
                    }`}>
                      {isGmbVerified ? 'Verified' : 
                       business.status === 'Approved' ? 'Approved' : 
                       business.status === 'Under Review' ? 'In Review' : 
                       business.status === 'Suspended' ? 'Suspended' : 
                       business.status === 'Rejected' ? 'Rejected' : 'Pending'}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 mt-1.5 truncate">
                      {isGmbVerified ? 'Your listing is verified' :
                       business.status === 'Approved' ? 'Your business is live' :
                       business.status === 'Under Review' ? 'Auditing in progress' :
                       business.status === 'Suspended' ? 'Profile locked' :
                       business.status === 'Rejected' ? 'Needs modifications' : 'Awaiting verification'}
                    </span>
                    {!isGmbVerified && (
                      <button
                        onClick={() => setShowVerifyModal(true)}
                        className="mt-2 text-[9px] bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-2.5 py-1 rounded-lg transition-all shadow-sm shadow-emerald-700/10 cursor-pointer inline-flex items-center gap-1 self-start select-none"
                      >
                        Verify Now
                      </button>
                    )}
                  </div>
                </div>

                {/* Plan Renewal */}
                <div className="card-premium p-4.5 rounded-2xl flex items-center gap-3.5 bg-white">
                  <div className="h-10.5 w-10.5 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <CreditCard className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden min-w-0">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest truncate">Plan Renewal</span>
                    <span className={`text-sm md:text-[13px] font-extrabold mt-1 leading-none truncate ${isExpired ? 'text-red-600' : 'text-slate-800'}`}>
                      {isExpired ? 'Expired' : `${daysLeft} Days left`}
                    </span>
                    <span className="text-[8.5px] font-bold text-slate-400 mt-1.5 truncate">
                      {business.subscriptionExpiry ? new Date(business.subscriptionExpiry).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'}) : 'N/A'}
                    </span>
                  </div>
                </div>

              </div>

              {/* 4. MAIN WIDGETS COLUMN LAYOUT GRID (3-Column Desktop Grid) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* LEFT & CENTER 2-COLUMNS: Leads widget & reviews subgrid */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  
                  {/* Card A: Recent Leads detailed panel */}
                  <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-6 flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <div className="flex flex-col text-left">
                        <h3 className="font-extrabold text-sm text-[#001c41]">Recent Leads</h3>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Enquiries submitted by customers recently</span>
                      </div>
                      <button className="text-[10px] font-extrabold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer uppercase">
                        View All
                      </button>
                    </div>

                    {/* Leads list stream */}
                    <div className="flex flex-col divide-y divide-slate-100">
                      {mockLeads.map((lead, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 first:pt-0 last:pb-0 gap-3">
                          <div className="flex items-center gap-3.5">
                            <div className={`h-9 w-9 rounded-full ${lead.color} flex items-center justify-center font-extrabold text-xs shadow-inner shrink-0 select-none`}>
                              {lead.initial}
                            </div>
                            <div className="flex flex-col text-left min-w-0">
                              <span className="font-extrabold text-slate-800 text-xs truncate leading-snug">{lead.name}</span>
                              <span className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-none">{lead.category}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-6 self-stretch sm:self-auto shrink-0 pl-12 sm:pl-0">
                            <a 
                              href={`tel:${lead.phone}`}
                              className="text-[10.5px] font-bold text-slate-600 hover:text-emerald-600 flex items-center gap-1.5 transition-colors cursor-pointer group bg-slate-50 hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-slate-200/60"
                            >
                              <PhoneCall className="h-3 w-3 text-slate-400 group-hover:text-emerald-600" />
                              <span>{lead.phone}</span>
                            </a>
                            <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wide">
                              {lead.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Wide View All Leads CTA Button */}
                    <button 
                      onClick={() => setSearchParams({ tab: 'Leads & Enquiries' })}
                      className="w-full mt-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      View All Active Leads <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Secondary Subgrid (Reviews & Google Sync) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Card B.1: Reviews & Reputation */}
                    <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-6 flex flex-col">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                        <div className="flex flex-col text-left">
                          <h3 className="font-extrabold text-sm text-[#001c41]">Reviews & Reputation</h3>
                          <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Rating scores aggregate summary</span>
                        </div>
                        <button 
                          onClick={() => setSearchParams({ tab: 'Reviews & Reputation' })}
                          className="text-[10px] font-extrabold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer uppercase"
                        >
                          View All
                        </button>
                      </div>

                      {/* Ratings layout comparison */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-[#F8FAFC] border border-slate-200/60 p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1">
                          <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider">Your Rating</span>
                          <span className="text-xl font-extrabold text-slate-800 mt-0.5">4.7</span>
                          <div className="flex items-center text-amber-400 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-2.5 w-2.5 fill-current" />
                            ))}
                          </div>
                          <span className="text-[8.5px] text-slate-400 font-semibold mt-0.5">Based on 68 reviews</span>
                        </div>

                        <div className="bg-[#F8FAFC] border border-slate-200/60 p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1">
                          <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider font-sans flex items-center gap-1">
                            <span className="text-blue-500">G</span>oogle Rating
                          </span>
                          <span className="text-xl font-extrabold text-slate-800 mt-0.5">4.6</span>
                          <div className="flex items-center text-amber-400 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-2.5 w-2.5 fill-current ${i === 4 ? 'text-slate-200' : ''}`} />
                            ))}
                          </div>
                          <span className="text-[8.5px] text-slate-400 font-semibold mt-0.5">Based on 128 reviews</span>
                        </div>
                      </div>

                      {/* Recent reviews stream block */}
                      <div className="flex flex-col gap-3.5 border-t border-slate-100 pt-4 text-left">
                        <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">Recent Reviews</span>
                        
                        {[
                          { author: 'Karthik M', r: 5, time: '2 days ago', body: 'Excellent service and very professional team.' },
                          { author: 'Priya S', r: 5, time: '5 days ago', body: 'Quick response and quality work. Highly recommended!' }
                        ].map((rev, idx) => (
                          <div key={idx} className="flex flex-col gap-1 first:pt-0 last:pb-0">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-extrabold text-slate-700">{rev.author}</span>
                              <span className="text-[9px] font-semibold text-slate-400">{rev.time}</span>
                            </div>
                            <div className="flex items-center text-amber-400 gap-0.5">
                              {[...Array(rev.r)].map((_, i) => (
                                <Star key={i} className="h-2.5 w-2.5 fill-current" />
                              ))}
                            </div>
                            <p className="text-[10.5px] text-slate-500 leading-normal font-semibold mt-0.5">
                              "{rev.body}"
                            </p>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => setSearchParams({ tab: 'Reviews & Reputation' })}
                        className="w-full mt-4 py-2.5 border border-slate-200 text-slate-600 font-extrabold text-[10.5px] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Manage Reviews
                      </button>
                    </div>

                    {/* Card B.2: Google Reviews Connected */}
                    <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-6 flex flex-col text-left justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                          <h3 className="font-extrabold text-sm text-[#001c41]">Google Reviews</h3>
                          <span className="bg-emerald-50 text-[#027244] border border-emerald-100 px-2 py-0.5 rounded-full text-[8.5px] font-extrabold inline-flex items-center gap-1 shrink-0 select-none">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Connected
                          </span>
                        </div>
                        <p className="text-slate-500 text-[10.5px] font-semibold leading-relaxed">
                          Your Google Business Profile is connected. We are showing your latest Google reviews.
                        </p>
                        <span className="text-[9.5px] text-slate-400 font-bold block mt-1.5">
                          Last synced: 29 May 2025, 10:30 AM
                        </span>
                      </div>

                      {/* Actions Links with logo labels */}
                      <div className="flex flex-col gap-2.5">
                        <a 
                          href="https://google.com" 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 hover:border-emerald-500 rounded-xl text-slate-700 hover:text-[#001c41] text-[10.5px] font-extrabold flex items-center justify-between transition-all"
                        >
                          <span className="flex items-center gap-2">
                            <span className="h-5 w-5 bg-white shadow-xs border border-slate-200 rounded flex items-center justify-center font-bold text-blue-500 text-[11px]">G</span>
                            View on Google
                          </span>
                          <ExternalLink className="h-3 w-3 text-slate-450" />
                        </a>

                        <button 
                          onClick={() => setShowUploadModal(true)}
                          className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 hover:border-emerald-500 rounded-xl text-slate-700 hover:text-[#001c41] text-[10.5px] font-extrabold flex items-center justify-between transition-all cursor-pointer text-left"
                        >
                          <span className="flex items-center gap-2">
                            <span className="h-5 w-5 bg-white shadow-xs border border-slate-200 rounded flex items-center justify-center text-amber-500 text-[11px]">★</span>
                            Get More Reviews
                          </span>
                          <ExternalLink className="h-3 w-3 text-slate-450" />
                        </button>
                      </div>

                      {/* Review Link Sync input and copy clip */}
                      <div className="flex flex-col gap-1 pt-1">
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Review Link</span>
                        <div className="flex items-center gap-2 border border-slate-200/70 rounded-xl p-1 bg-slate-50 mt-1">
                          <input 
                            type="text" 
                            readOnly
                            value="https://g.page/r/CfLKj12345ABC/review"
                            className="w-full bg-transparent text-[11px] font-semibold text-slate-600 px-2 focus:outline-none"
                          />
                          <button 
                            onClick={copyReviewLink}
                            className="h-7 w-7 rounded-lg bg-[#027244] hover:bg-[#005934] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs transition-colors"
                          >
                            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* RIGHT COLUMN (1/3 WIDTH): Quick actions panel & Subscription checklist */}
                <div className="lg:col-span-1 flex flex-col gap-6 text-left">
                  
                  {/* Card C: Quick Actions Widget */}
                  <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-6 flex flex-col gap-4">
                    <div className="flex flex-col">
                      <h3 className="font-extrabold text-sm text-[#001c41]">Quick Actions</h3>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Instantly manage and update your profile</span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {[
                        { label: 'Edit Business Details', icon: <Edit3 className="h-4 w-4 text-emerald-600" />, desc: 'Update your business information', action: (e) => { setEditTab('general'); openModalAtClickLevel(e, setShowEditModal, 650); } },
                        { label: 'Upload Photos', icon: <ImageIcon className="h-4 w-4 text-blue-600" />, desc: 'Add or update photos & videos', action: (e) => openModalAtClickLevel(e, setShowUploadModal, 400) },
                        { label: 'Add Offer / Promotion', icon: <Sparkles className="h-4 w-4 text-amber-500" />, desc: 'Create new offers for customers', action: () => { setSearchParams({ tab: 'Offers & Promotions' }); setShowAddOffer(true); } },
                        { label: 'Share Your Profile', icon: <Globe className="h-4 w-4 text-purple-600" />, desc: 'Share your profile with customers', action: copyProfileLink }
                      ].map((act, idx) => (
                        <button 
                          key={idx}
                          onClick={act.action}
                          className="card-premium group rounded-2xl flex items-center justify-between cursor-pointer w-full p-3 bg-slate-50/50 hover:bg-slate-100/50 border border-slate-200/80 shadow-2xs text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8.5 w-8.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
                              {act.icon}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-extrabold text-slate-800 text-xs truncate leading-snug group-hover:text-emerald-700 transition-colors">{act.label}</span>
                              <span className="text-[9.5px] text-slate-400 font-semibold leading-none mt-1 truncate">{act.desc}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card D: Subscription & Plan Widget */}
                  <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex flex-col">
                        <h3 className="font-extrabold text-sm text-[#001c41]">Subscription & Plan</h3>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Review plan limits and visibilities</span>
                      </div>
                      <button className="text-[10px] font-extrabold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer uppercase">
                        View Details
                      </button>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <div className="flex justify-between items-center bg-[#F8FAFC] border border-slate-200/60 p-3 rounded-xl">
                        <span className="text-[10.5px] font-bold text-slate-500">Current Plan</span>
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-extrabold select-none uppercase tracking-wide border ${
                          business.subscriptionStatus === 'active' 
                            ? 'bg-emerald-50 text-[#027244] border-emerald-100' 
                            : 'bg-amber-50 text-amber-700 border-amber-200/60'
                        }`}>
                          {business.subscriptionStatus === 'active' ? 'Pro Plan' : 'Inactive Plan'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center bg-[#F8FAFC] border border-slate-200/60 p-3 rounded-xl">
                        <span className="text-[10.5px] font-bold text-slate-500">Renewal Date</span>
                        <span className="text-xs font-extrabold text-slate-700">
                          {business.subscriptionExpiry ? new Date(business.subscriptionExpiry).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'}) : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Plan Checklist Benefits */}
                    <div className="flex flex-col gap-1 border-t border-slate-100 pt-3">
                      <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Benefits Included</span>
                      {[
                        { label: 'Business Visibility', val: 'Featured' },
                        { label: 'Leads Per Month', val: 'Unlimited' },
                        { label: 'Photos Allowed', val: 'Up to 50' },
                        { label: 'Support', val: 'Priority Support' }
                      ].map((benefit, idx) => (
                        <div key={idx} className="flex items-center justify-between py-1.5 text-xs font-semibold text-slate-600">
                          <div className="flex items-center gap-2.5">
                            <div className="h-4.5 w-4.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-extrabold shrink-0 select-none">
                              ✓
                            </div>
                            <span>{benefit.label}</span>
                          </div>
                          <span className="font-extrabold text-slate-800 text-[11px]">{benefit.val}</span>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={(e) => openModalAtClickLevel(e, setShowRenewModal, 650)}
                      className="w-full mt-2 py-3 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow-md transition-all shadow-emerald-700/10 cursor-pointer"
                    >
                      Manage Subscription
                    </button>
                  </div>

                </div>

              </div>

              {/* 5. GROW YOUR BUSINESS FOOTER BANNER */}
              <div className="w-full bg-[#EBF5FF] border border-blue-100 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 bg-blue-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/10">
                    <Sparkles className="h-5 w-5 fill-current text-blue-100" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-extrabold text-xs text-[#001c41]">Grow Your Business</span>
                    <p className="text-[11px] text-slate-550 font-bold leading-relaxed">
                      Keep your profile updated, respond to leads quickly and collect more reviews to rank higher in search results.
                    </p>
                  </div>
                </div>
                <button className="bg-white hover:bg-slate-55 border border-slate-200 text-slate-700 font-extrabold text-[10.5px] py-2.5 px-5 rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer">
                  View Tips & Guide
                </button>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* TAB: INLINE BUSINESS PROFILE PREVIEW WITH QUICK EDIT SHORTCUTS */}
          {/* ========================================================================= */}
          {activeTab === 'Business Details' && business && (() => {
            const displayGallery = Array.from(new Set(
              business.galleryUrls 
                ? (typeof business.galleryUrls === 'string' 
                    ? business.galleryUrls.split(',').map(s => s.trim()).filter(Boolean) 
                    : business.galleryUrls)
                : []
            )).filter(Boolean);
            const galleryCount = displayGallery.length;
            const mainImage = business.coverImageUrl || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80";
            const remainingCount = Math.max(0, galleryCount - 5);
            const isExpired = business.subscriptionStatus === 'expired';

            return (
              <div className="flex flex-col gap-6 text-left animate-fadeIn font-sans bg-[#F8FAFC]">
                
                {/* Expiry Warning Header Banner */}
                {isExpired && (
                  <div className="w-full bg-red-655 text-white font-extrabold text-xs py-3.5 px-4 text-center rounded-2xl shadow flex items-center justify-center gap-2 animate-pulse">
                    <AlertCircle className="h-4.5 w-4.5" />
                    <span>Your subscription has expired. Please renew it to restore profile visibility.</span>
                  </div>
                )}

                {/* Branch Profile Banner - shows when viewing a branch */}
                {business.parentBusinessId && primaryBusiness && (
                  <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 text-xs py-3 px-4 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                        <Briefcase className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="font-extrabold block text-[11px]">
                          Branch Profile — {business.locality || business.address || business.name}
                        </span>
                        <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
                          Under: {primaryBusiness.name}
                          {business.phone && <span className="text-slate-400 ml-2">· {business.phone}</span>}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleSwitchBusiness(primaryBusiness._id);
                        setActiveTab('Business Details');
                      }}
                      className="shrink-0 py-1.5 px-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ArrowLeft className="h-3 w-3" /> Main Business
                    </button>
                  </div>
                )}

                {/* Premium Header Banner (Cover Image) */}
                <section className="w-full relative bg-slate-900 text-white py-12 px-6 rounded-3xl overflow-hidden border border-slate-800/20">
                  {/* Background Image vertical offset positioning */}
                  <div 
                    className="absolute inset-0 bg-cover" 
                    style={{ 
                      backgroundImage: `url('${mainImage}')`,
                      backgroundPosition: `center ${business.coverImageOffset ?? 50}%`,
                      opacity: 0.85
                    }} 
                  />
                  {/* Sleek dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/15" />
                  
                  <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-6 z-10 animate-fadeIn">
                    <div className="flex flex-col gap-3 text-left w-full">
                      {/* Breadcrumbs */}
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Dashboard</span>
                        <span className="text-slate-600">&gt;</span>
                        <span className="text-emerald-450">My Business Profile</span>
                        <span className="text-slate-600">&gt;</span>
                        <span className="text-slate-200">{business.name}</span>
                      </div>
                      
                      {/* Title Block with Logo and Verified Badge */}
                      <div className="flex items-center gap-4 mt-2 flex-wrap text-left">
                        {business.logoUrl ? (
                          <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl border border-white/20 overflow-hidden bg-white shadow-md shrink-0 flex items-center justify-center relative group">
                            <img src={business.logoUrl} alt={`${business.name} Logo`} className="h-full w-full object-cover" />
                            <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[9px] font-black uppercase tracking-wider select-none text-center p-1">
                              <Upload className="h-4 w-4 mb-1 animate-bounce" />
                              <span>Change Logo</span>
                              <input type="file" accept="image/*" onChange={handleDashboardLogoUpload} className="hidden" />
                            </label>
                          </div>
                        ) : (
                          <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl border border-white/20 overflow-hidden bg-gradient-to-tr from-emerald-500 to-teal-650 shadow-md shrink-0 flex items-center justify-center font-extrabold text-white text-xl uppercase relative group">
                            {business.name ? business.name.charAt(0) : 'B'}
                            <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[9px] font-black uppercase tracking-wider select-none text-center p-1">
                              <Upload className="h-4 w-4 mb-1 animate-bounce" />
                              <span>Upload Logo</span>
                              <input type="file" accept="image/*" onChange={handleDashboardLogoUpload} className="hidden" />
                            </label>
                          </div>
                        )}
                        <div className="flex flex-col gap-1.5 justify-center">
                          <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-sans">{business.name}</h1>
                            {isGmbVerified && (
                              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-400/25 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm shrink-0">
                                <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.8 17 5 19 5a1 1 0 0 1 1 1z" fill="currentColor" />
                                  <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg> Verified Business
                              </span>
                            )}
                            {branches.length > 0 && (
                              <span className="bg-blue-500/10 text-blue-400 border border-blue-400/25 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm shrink-0">
                                {branches.length + 1} Branches
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Website and Social Media links below Business Name */}
                      {(business.website || business.facebook || business.instagram) && (
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-300">
                          {business.website && (
                            <a 
                              href={business.website.startsWith('http') ? business.website : `https://${business.website}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
                            >
                              <Globe className="h-3.5 w-3.5" />
                              <span>Website</span>
                            </a>
                          )}
                          {business.facebook && (
                            <a 
                              href={business.facebook.startsWith('http') ? business.facebook : `https://${business.facebook}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-450 hover:text-blue-300 flex items-center gap-1.5"
                              title="Facebook Profile"
                            >
                              <Facebook className="h-3.5 w-3.5" />
                              <span>Facebook</span>
                            </a>
                          )}
                          {business.instagram && (
                            <a 
                              href={business.instagram.startsWith('http') ? business.instagram : `https://instagram.com/${business.instagram.replace('@', '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-pink-400 hover:text-pink-300 flex items-center gap-1.5"
                              title="Instagram Profile"
                            >
                              <Instagram className="h-3.5 w-3.5" />
                              <span>Instagram</span>
                            </a>
                          )}
                        </div>
                      )}

                      {/* Premium Rating and Specs Pills */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 mt-2">
                        <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                          <div className="flex text-amber-400 shrink-0 gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(business.googleRating ?? 4.5) ? 'fill-current' : 'text-slate-700'}`} />
                            ))}
                          </div>
                          <span className="font-black text-white ml-1">{(business.googleRating ?? 4.5).toFixed(1)}</span>
                          <span className="text-[10px] text-slate-405">({localReviews.length} Reviews)</span>
                        </div>
                        <span className="text-slate-600">•</span>
                        <span className="text-emerald-450 font-bold bg-emerald-500/5 border border-emerald-500/15 px-2.5 py-1 rounded-lg">{business.type}</span>
                        <span className="text-slate-600">•</span>
                        <div className="flex items-center gap-1.5 text-slate-350">
                          <MapPin className="h-4 w-4 text-emerald-550" />
                          <span>{business.locality}, Udumalpet, Tamil Nadu - {business.pincode}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 mt-4 md:mt-0 flex-wrap">
                      <button 
                        type="button"
                        onClick={() => {
                          if (!isRepositioning) {
                            setOriginalOffset(business.coverImageOffset ?? 50);
                            setTempOffset(business.coverImageOffset ?? 50);
                          }
                          setIsRepositioning(!isRepositioning);
                        }}
                        className="h-9 px-3.5 bg-emerald-500/20 border border-emerald-500/35 hover:bg-emerald-500/35 text-emerald-450 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer font-bold text-xs"
                      >
                        <Move className="h-4 w-4" /> {isRepositioning ? 'Done Repositioning' : 'Reposition Cover'}
                      </button>
                      <label className="h-9 px-3.5 bg-blue-500/20 border border-blue-500/35 hover:bg-blue-500/35 text-blue-450 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer font-bold text-xs select-none m-0">
                        <Upload className="h-4 w-4" /> Edit Cover
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleDashboardCoverUpload} 
                          className="hidden" 
                        />
                      </label>
                      <button 
                        type="button"
                        onClick={() => {
                          setEditTab('general');
                          setShowEditModal(true);
                        }}
                        className="h-9 px-4.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider hover:scale-[1.02]"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-slate-950" /> Edit Details
                      </button>
                    </div>
                  </div>

                  {/* Reposition Slider Overlay */}
                  {isRepositioning && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-slate-700/80 rounded-2xl py-3 px-5 z-20 flex items-center gap-4 shadow-xl backdrop-blur-md w-full max-w-sm">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider shrink-0 flex items-center gap-1">
                        <Move className="h-3.5 w-3.5 text-emerald-550" /> Reposition
                      </span>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={tempOffset} 
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTempOffset(val);
                          setBusiness(prev => ({ ...prev, coverImageOffset: val }));
                        }}
                        className="flex-1 accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                      />
                      <span className="text-xs font-black text-white w-8 text-right">{tempOffset}%</span>
                      <div className="flex gap-1.5 shrink-0">
                        <button 
                          type="button"
                          onClick={handleDashboardSavePosition}
                          disabled={isSavingPosition}
                          className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-[9px] rounded-lg transition-colors cursor-pointer uppercase tracking-wider"
                        >
                          {isSavingPosition ? 'Saving' : 'Save'}
                        </button>
                        <button 
                          type="button"
                          onClick={handleDashboardCancelPosition}
                          className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-[9px] rounded-lg transition-colors cursor-pointer uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </section>

                {/* Subtabs navigation bar */}
                <div className="w-full bg-white border border-slate-200/85 z-20 shadow-2xs rounded-2xl">
                  <div className="flex overflow-x-auto gap-8 px-6">
                    {[
                      { id: 'overview', label: 'Overview' },
                      { id: 'services', label: 'Services' },
                      { id: 'photos', label: `Photos (${galleryCount})` },
                      { id: 'reviews', label: `Reviews (${localReviews.length})` },
                      { id: 'offers', label: `Offers (${offersList.length})` },
                      { id: 'about', label: 'About' },
                      ...((branches.length > 0) ? [{ id: 'branches', label: `Branches (${branches.length + 1})` }] : []),
                      { id: 'map', label: 'Map & Location' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPreviewTab(tab.id)}
                        className={`py-4 text-xs font-black border-b-2 uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                          previewTab === tab.id 
                            ? 'border-emerald-600 text-emerald-600' 
                            : 'border-transparent text-slate-455 hover:text-slate-605'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mt-2">
                  
                  {/* Left Column (Overview, gallery, details, reviews) */}
                  <div className="lg:col-span-2 flex flex-col gap-6">
                    
                    {/* TAB 1: OVERVIEW */}
                    {previewTab === 'overview' && (
                      <div className="flex flex-col gap-6 animate-fadeIn text-left">
                        
                        {/* About description */}
                        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-3.5 relative group">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                            <h3 className="text-base font-extrabold text-slate-800 font-sans">About {business.name}</h3>
                            <button
                              type="button"
                              onClick={() => {
                                setEditTab('about');
                                setShowEditModal(true);
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#027244] transition-colors cursor-pointer border-none flex items-center gap-1 text-[11px] font-bold"
                              title="Edit About & Highlights"
                            >
                              <Edit3 className="h-3.5 w-3.5" /> Edit
                            </button>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed text-justify font-medium">{business.description || "No description provided yet."}</p>
                          
                          {/* Highlights tags - dynamic from business.highlights */}
                          <div className="flex flex-wrap gap-2.5 mt-2">
                            {(Array.isArray(business.highlights) && business.highlights.length > 0
                              ? business.highlights
                              : ['On-time Service', 'Expert Technicians', 'Quality Materials', 'Affordable Pricing']
                            ).map((tag) => (
                              <span key={tag} className="bg-emerald-50/50 border border-emerald-100 text-emerald-700 text-[10px] font-bold py-1.5 px-3 rounded-xl flex items-center gap-1.5">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Specifications block */}
                        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                            <h3 className="text-base font-extrabold text-slate-800 font-sans">Business Information</h3>
                            <button
                              type="button"
                              onClick={() => {
                                setEditTab('specs');
                                setShowEditModal(true);
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#027244] transition-colors cursor-pointer border-none flex items-center gap-1 text-[11px] font-bold"
                              title="Edit Specifications"
                            >
                              <Edit3 className="h-3.5 w-3.5" /> Edit
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-6 text-slate-700 text-xs">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-xl bg-slate-100 text-slate-500 shrink-0">
                                <Briefcase className="h-4.5 w-4.5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Business Type</span>
                                <span className="font-extrabold text-slate-800 mt-1">{business.type}</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-xl bg-slate-100 text-slate-500 shrink-0">
                                <Clock className="h-4.5 w-4.5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Working Hours</span>
                                <span className="font-extrabold text-slate-800 mt-1">Mon - Sat: {business.timings?.Monday || '9:00 AM - 8:00 PM'}</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 border-t border-slate-100 pt-3.5 md:border-t-0 md:pt-0">
                              <div className="p-2 rounded-xl bg-slate-100 text-slate-500 shrink-0">
                                <Calendar className="h-4.5 w-4.5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Year Established</span>
                                <span className="font-extrabold text-slate-800 mt-1">{business.yearEstablished || '2012'}</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 border-t border-slate-100 pt-3.5 md:border-t-0 md:pt-0">
                              <div className="p-2 rounded-xl bg-slate-100 text-slate-500 shrink-0">
                                <Globe className="h-4.5 w-4.5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Languages Known</span>
                                <span className="font-extrabold text-slate-800 mt-1">{business.languagesKnown || 'Tamil, English'}</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 border-t border-slate-100 pt-3.5">
                              <div className="p-2 rounded-xl bg-slate-100 text-slate-500 shrink-0">
                                <Users className="h-4.5 w-4.5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Employees</span>
                                <span className="font-extrabold text-slate-800 mt-1">{business.employeeCount || '10 - 20'}</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 border-t border-slate-100 pt-3.5">
                              <div className="p-2 rounded-xl bg-slate-100 text-slate-500 shrink-0">
                                <MapPin className="h-4.5 w-4.5" />
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Service Area</span>
                                <span className="font-extrabold text-slate-800 mt-1 leading-relaxed">{business.serviceArea || 'Udumalpet limits'}</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 border-t border-slate-100 pt-3.5 md:col-span-2">
                              <div className="p-2 rounded-xl bg-slate-100 text-slate-500 shrink-0">
                                <ShieldCheck className="h-4.5 w-4.5" />
                              </div>
                              <div className="flex flex-col font-sans">
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">GSTIN Number</span>
                                <span className="font-extrabold text-slate-800 mt-1 tracking-wide">{business.gstNumber || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Collage gallery */}
                        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                            <h3 className="text-base font-extrabold text-slate-800 font-sans">Photos & Gallery</h3>
                            <button
                              type="button"
                              onClick={() => {
                                setEditTab('services');
                                setShowEditModal(true);
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#027244] transition-colors cursor-pointer border-none flex items-center gap-1 text-[11px] font-bold"
                              title="Edit Gallery"
                            >
                              <Edit3 className="h-3.5 w-3.5" /> Edit
                            </button>
                          </div>
                          
                          {galleryCount === 0 ? (
                            <div className="w-full bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3.5 mt-1 animate-fadeIn">
                              <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#027244]">
                                <ImageIcon className="h-5.5 w-5.5" />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-slate-800 font-extrabold text-xs">No photos uploaded yet</span>
                                <span className="text-[11px] text-slate-400 font-semibold">Showcase your storefront and work by uploading gallery photos.</span>
                              </div>
                            </div>
                          ) : galleryCount === 1 ? (
                            <div className="grid grid-cols-1 gap-3 mt-1 h-60 animate-fadeIn">
                              <div 
                                className="rounded-[20px] bg-cover bg-center border border-slate-200 shadow-2xs relative overflow-hidden"
                                style={{ backgroundImage: `url('${displayGallery[0]}')` }}
                              />
                            </div>
                          ) : galleryCount === 2 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1 h-60 animate-fadeIn">
                              {displayGallery.slice(0, 2).map((url, idx) => (
                                <div 
                                  key={idx}
                                  className="rounded-[20px] bg-cover bg-center border border-slate-200 shadow-2xs relative overflow-hidden"
                                  style={{ backgroundImage: `url('${url}')` }}
                                />
                              ))}
                            </div>
                          ) : galleryCount === 3 ? (
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-1 h-60 animate-fadeIn">
                              <div 
                                className="md:col-span-3 rounded-[20px] bg-cover bg-center border border-slate-200 shadow-2xs relative overflow-hidden"
                                style={{ backgroundImage: `url('${displayGallery[0]}')` }}
                              />
                              <div className="md:col-span-2 grid grid-rows-2 gap-3 h-full">
                                {displayGallery.slice(1, 3).map((url, idx) => (
                                  <div 
                                    key={idx}
                                    className="rounded-[16px] bg-cover bg-center border border-slate-200 shadow-3xs relative overflow-hidden"
                                    style={{ backgroundImage: `url('${url}')` }}
                                  />
                                ))}
                              </div>
                            </div>
                          ) : galleryCount === 4 ? (
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-1 h-60 animate-fadeIn">
                              <div 
                                className="md:col-span-3 rounded-[20px] bg-cover bg-center border border-slate-200 shadow-2xs relative overflow-hidden"
                                style={{ backgroundImage: `url('${displayGallery[0]}')` }}
                              />
                              <div className="md:col-span-2 grid grid-rows-2 gap-3 h-full">
                                <div 
                                  className="rounded-[16px] bg-cover bg-center border border-slate-200 shadow-3xs relative overflow-hidden"
                                  style={{ backgroundImage: `url('${displayGallery[1]}')` }}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                  {displayGallery.slice(2, 4).map((url, idx) => (
                                    <div 
                                      key={idx}
                                      className="rounded-[16px] bg-cover bg-center border border-slate-200 shadow-3xs relative overflow-hidden"
                                      style={{ backgroundImage: `url('${url}')` }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-1 h-60 animate-fadeIn">
                              <div 
                                className="md:col-span-3 rounded-[20px] bg-cover bg-center border border-slate-200 shadow-2xs relative overflow-hidden"
                                style={{ backgroundImage: `url('${displayGallery[0]}')` }}
                              />
                              <div className="md:col-span-2 grid grid-cols-2 gap-3 h-full">
                                {displayGallery.slice(1, 5).map((url, idx) => {
                                  const isLast = idx === 3;
                                  const moreCount = galleryCount - 5;
                                  return (
                                    <div 
                                      key={idx}
                                      className="rounded-[16px] bg-cover bg-center border border-slate-200 shadow-3xs relative overflow-hidden"
                                      style={{ backgroundImage: `url('${url}')` }}
                                    >
                                      {isLast && moreCount > 0 && (
                                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-white text-center select-none animate-fadeIn">
                                          <span className="text-base font-black">+{moreCount}</span>
                                          <span className="text-[8px] font-black uppercase mt-0.5">More</span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                    {/* TAB 2: SERVICES */}
                    {previewTab === 'services' && (
                      <div className="flex flex-col gap-5 animate-fadeIn text-left">
                        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                            <h3 className="text-base font-extrabold text-slate-800 font-sans">Our Complete Services</h3>
                            <button
                              type="button"
                              onClick={() => {
                                setEditTab('services');
                                setShowEditModal(true);
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#027244] transition-colors cursor-pointer border-none flex items-center gap-1 text-[11px] font-bold"
                              title="Edit Services"
                            >
                              <Edit3 className="h-3.5 w-3.5" /> Edit
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-2">
                            {(Array.isArray(business.services) ? business.services : []).map((service, idx) => (
                              <div key={idx} className="bg-slate-50/55 border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shadow-3xs">
                                <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                                <span className="text-xs font-bold text-slate-700">{service}</span>
                              </div>
                            ))}
                          </div>

                          {business.brands && Array.isArray(business.brands) && business.brands.length > 0 && (
                            <div className="flex flex-col gap-2.5 mt-6 border-t border-slate-100 pt-5 text-left">
                              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Authorized Brand Partnerships</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {business.brands.map((b, idx) => (
                                  <span key={idx} className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 shadow-3xs">{b}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* TAB 3: PHOTOS */}
                    {previewTab === 'photos' && (
                      <div className="flex flex-col gap-5 animate-fadeIn text-left">
                        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                            <h3 className="text-base font-extrabold text-slate-800 font-sans">Photo Gallery ({galleryCount})</h3>
                            <button
                              type="button"
                              onClick={() => {
                                setEditTab('services');
                                setShowEditModal(true);
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#027244] transition-colors cursor-pointer border-none flex items-center gap-1 text-[11px] font-bold"
                              title="Edit Photos"
                            >
                              <Edit3 className="h-3.5 w-3.5" /> Edit
                            </button>
                          </div>
                          
                          {galleryCount === 0 ? (
                            <div className="w-full bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-3.5 mt-2 animate-fadeIn max-w-sm mx-auto">
                              <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#027244]">
                                <ImageIcon className="h-5.5 w-5.5" />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-slate-800 font-extrabold text-xs">No photos uploaded yet</span>
                                <span className="text-[11px] text-slate-400 font-semibold">Add gallery photos to showcase your business storefront and work.</span>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                              {displayGallery.map((url, idx) => (
                                <div 
                                  key={idx} 
                                  className="h-36 rounded-2xl bg-cover bg-center border border-slate-200 shadow-3xs relative overflow-hidden hover:shadow-xs transition-shadow" 
                                  style={{ backgroundImage: `url('${url}')` }} 
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* TAB 4: REVIEWS */}
                    {previewTab === 'reviews' && (
                      <div className="flex flex-col gap-6 animate-fadeIn text-left">
                        
                        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-5">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <h3 className="text-base font-extrabold text-slate-800 font-sans">Customer Ratings & Synced Feedback</h3>
                            <button
                              type="button"
                              onClick={() => setSearchParams({ tab: 'Reviews & Reputation' })}
                              className="shrink-0 py-2 px-3.5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[11px] rounded-xl flex items-center gap-1.5 transition-all shadow cursor-pointer border-none"
                            >
                              <Star className="h-3.5 w-3.5" /> Manage
                            </button>
                          </div>
                          
                          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-3xs">
                            <div className="text-center flex flex-col gap-1 shrink-0 bg-white border border-slate-250 p-4 rounded-xl shadow-3xs min-w-[120px]">
                              <span className="text-4xl font-black text-slate-800 leading-none">{(business.googleRating ?? 4.5).toFixed(1)}</span>
                              <div className="flex text-amber-400 gap-0.5 justify-center mt-1.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(business.googleRating ?? 4.5) ? 'fill-current' : 'text-slate-200'}`} />
                                ))}
                              </div>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">Out of 5 Stars</span>
                            </div>
                            
                            <div className="flex-1 flex flex-col gap-2 text-[11px] font-bold text-slate-600 w-full">
                              {[
                                { stars: 5, pct: '74%', count: 62 },
                                { stars: 4, pct: '19%', count: 16 },
                                { stars: 3, pct: '5%', count: 4 },
                                { stars: 2, pct: '1%', count: 1 },
                                { stars: 1, pct: '1%', count: 1 }
                              ].map((dist) => (
                                <div key={dist.stars} className="flex items-center gap-3">
                                  <span className="w-4 text-right text-slate-400">{dist.stars}★</span>
                                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-450" style={{ width: dist.pct }} />
                                  </div>
                                  <span className="w-12 text-slate-400 text-right font-semibold">{dist.count}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col gap-4 mt-2">
                            <span className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">Local Customer Feedback Stream ({localReviews.length})</span>
                            
                            {localReviews.map((rev, idx) => (
                              <div key={idx} className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-2.5 text-left">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2.5">
                                    <div className="h-7 w-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[10px] font-black text-emerald-700 uppercase">
                                      {(rev.authorName || 'R').charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-extrabold text-xs text-slate-800 leading-none">{rev.authorName || 'Anonymous'}</span>
                                      <span className={`text-[8.5px] font-bold uppercase tracking-widest mt-1 block ${rev.source === 'google' ? 'text-amber-600' : 'text-slate-455'}`}>
                                        {rev.source === 'google' ? 'Synced Google Review' : 'Verified Customer'}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center text-amber-400 gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`} />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-[11.5px] text-slate-550 font-medium leading-relaxed mt-0.5 text-justify">{rev.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}

                    {/* TAB 5: OFFERS */}
                    {previewTab === 'offers' && (
                      <div className="flex flex-col gap-5 animate-fadeIn text-left font-sans">
                        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                            <h3 className="text-base font-extrabold text-slate-800 font-sans">Active Promotional Offers</h3>
                            <button
                              type="button"
                              onClick={() => setSearchParams({ tab: 'Offers & Promotions' })}
                              className="text-[#027244] hover:text-[#005934] font-extrabold text-xs flex items-center gap-0.5 transition-colors border-none bg-transparent cursor-pointer"
                            >
                              Manage <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex flex-col gap-4 mt-2">
                            {offersList.length > 0 ? (
                              offersList.map((campaign, oIdx) => {
                                const gradients = [
                                  'from-emerald-500 to-teal-600',
                                  'from-blue-500 to-indigo-600',
                                  'from-purple-500 to-pink-600',
                                  'from-amber-500 to-orange-600'
                                ];
                                const gradient = gradients[oIdx % gradients.length];
                                return (
                                  <div key={campaign.id || oIdx} className={`bg-gradient-to-r ${gradient} border border-emerald-500/20 shadow rounded-2xl p-5 text-white flex justify-between items-center relative overflow-hidden`}>
                                    <div className="flex flex-col gap-0.5 text-left relative z-10">
                                      <span className="bg-white/20 text-[8.5px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider self-start">Special Promotion</span>
                                      <h4 className="text-base font-black mt-2">{campaign.title}</h4>
                                      <p className="text-[11.5px] text-white/95 font-medium mt-1 leading-relaxed max-w-sm">{campaign.description}</p>
                                      {campaign.expiry && (
                                        <span className="text-[9px] text-white/70 font-semibold mt-2">Expires on: {campaign.expiry}</span>
                                      )}
                                    </div>
                                    <div className="bg-white text-slate-800 font-black text-xs py-2 px-4 rounded-xl flex flex-col items-center justify-center shrink-0 shadow relative z-10 border border-slate-100 min-w-[80px]">
                                      <span className="text-[8.5px] text-slate-400 font-black uppercase tracking-wider leading-none">Deal</span>
                                      <span className="text-[13px] mt-1 text-slate-800 font-black">{campaign.rate}</span>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="py-8 text-center text-slate-400 font-bold text-xs">
                                No active offers. Launch flyers inside the Offers tab!
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 6: ABOUT */}
                    {previewTab === 'about' && (
                      <div className="flex flex-col gap-5 animate-fadeIn text-left font-sans">
                        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                            <h3 className="text-base font-extrabold text-slate-800 font-sans">About {business.name}</h3>
                            <button
                              type="button"
                              onClick={() => {
                                setEditTab('about');
                                setShowEditModal(true);
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#027244] transition-colors cursor-pointer border-none flex items-center gap-1 text-[11px] font-bold"
                              title="Edit About & Highlights"
                            >
                              <Edit3 className="h-3.5 w-3.5" /> Edit
                            </button>
                          </div>
                          
                          <div className="flex flex-col gap-3 text-slate-500 font-medium text-xs sm:text-[13px] leading-relaxed text-justify mt-1.5">
                            <p>
                              Founded in {business.yearEstablished || '2012'}, {business.name} has grown to become one of the premier departmental stores inside Udumalpet. We provide top-class local solutions to residential housings, retail shopping complexes, and large-scale industrial systems.
                            </p>
                            <p>
                              Our teams hold verified registrations, professional certificates, and are highly vetted by UBT administration to offer maximum safety and quality operations.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: BRANCHES */}
                    {previewTab === 'branches' && (
                      <div className="flex flex-col gap-5 animate-fadeIn text-left font-sans">
                        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <div>
                              <h3 className="text-base font-extrabold text-slate-800 font-sans">Our Branches</h3>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSearchParams({ tab: 'Branches' })}
                              className="shrink-0 py-2 px-3.5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[11px] rounded-xl flex items-center gap-1.5 transition-all shadow cursor-pointer border-none"
                            >
                              <Users className="h-3.5 w-3.5" /> Manage Branches
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {branches.map((branch, index) => (
                              <div key={branch._id || index} className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl flex flex-col gap-3 shadow-3xs text-left">
                                <div className="border-b border-slate-200/60 pb-1.5">
                                  <h4 className="font-extrabold text-slate-800 text-xs">{branch.name}</h4>
                                  <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 block">{branch.branchManagerName ? `Manager: ${branch.branchManagerName}` : 'Branch Office'}</span>
                                </div>
                                <div className="flex flex-col gap-2 text-[11px] font-semibold text-slate-500">
                                  <a 
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${branch.name}, ${branch.address}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-2 hover:text-emerald-600 transition-colors cursor-pointer group"
                                    title="Open in Google Maps"
                                  >
                                    <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <span className="group-hover:underline">{branch.address}</span>
                                  </a>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                    <span className="text-slate-800 font-bold">{branch.phone}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: MAP & LOCATION */}
                    {previewTab === 'map' && (
                      <div className="flex flex-col gap-5 animate-fadeIn text-left">
                        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <h3 className="text-base font-extrabold text-slate-800 font-sans">Map & Directions</h3>
                            <a
                              href={
                                business
                                  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address ? `${business.name}, ${business.address}` : `${business.name}, Udumalpet`)}`
                                  : '#'
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 py-2 px-3.5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[11px] rounded-xl flex items-center gap-1.5 transition-all shadow"
                            >
                              <MapPin className="h-3.5 w-3.5" /> Get Directions
                            </a>
                          </div>
                          {/* Leaflet OSM embed via iframe - zero API key, fully free */}
                          <div className="h-80 w-full rounded-2xl border border-slate-200 bg-slate-100 relative overflow-hidden shadow-3xs">
                            <iframe
                              title="Interactive Business Map"
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              loading="lazy"
                              src={`https://www.openstreetmap.org/export/embed.html?bbox=${(business.coordinates?.lng || 77.2412) - 0.01},${(business.coordinates?.lat || 10.5891) - 0.01},${(business.coordinates?.lng || 77.2412) + 0.01},${(business.coordinates?.lat || 10.5891) + 0.01}&layer=mapnik&marker=${business.coordinates?.lat || 10.5891},${business.coordinates?.lng || 77.2412}`}
                              className="absolute top-0 left-0 w-full h-[calc(100%+28px)] opacity-95 border-0"
                            />
                          </div>
                          <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                            <MapPin className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest">Business Location</span>
                              <span className="text-xs font-bold text-slate-700 mt-1">{business.address || `${business.locality || 'Gandhi Nagar'}, Udumalpet, Tamil Nadu - ${business.pincode || '642126'}`}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Right Column (Sticky Contact and Hours Card) */}
                  <div className="lg:col-span-1 flex flex-col gap-6">
                    
                    {/* Contact Business Card */}
                    <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4 text-left relative group">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="font-extrabold text-sm text-[#001c41] uppercase tracking-wider">Contact Details</span>
                        <button 
                          type="button"
                          onClick={() => {
                            setEditTab('contact');
                            setShowEditModal(true);
                          }}
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-[#027244] transition-colors cursor-pointer border-none flex items-center gap-0.5 text-[10px] font-bold"
                          title="Edit Contact"
                        >
                          <Edit3 className="h-3 w-3" /> Edit
                        </button>
                      </div>

                      <div className="flex flex-col gap-3.5 text-xs font-bold text-slate-705">
                        <div className="flex items-start gap-2.5">
                          <Phone className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] text-slate-450 font-extrabold uppercase tracking-widest">Phone</span>
                            <span className="text-slate-800 font-extrabold">{business.phone}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 border-t border-slate-100 pt-3.5">
                          <Mail className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] text-slate-450 font-extrabold uppercase tracking-widest">Email Address</span>
                            <span className="text-slate-800 font-extrabold">{business.email || 'N/A'}</span>
                          </div>
                        </div>

                        {business.website && (
                          <div className="flex items-start gap-2.5 border-t border-slate-100 pt-3.5">
                            <Globe className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[9px] text-slate-450 font-extrabold uppercase tracking-widest">Website</span>
                              <a 
                                href={business.website.startsWith('http') ? business.website : `https://${business.website}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-emerald-700 hover:text-emerald-800 font-extrabold hover:underline mt-1 break-all"
                              >
                                {business.website}
                              </a>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-2.5 border-t border-slate-100 pt-3.5">
                          <MapPin className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] text-slate-450 font-extrabold uppercase tracking-widest">Location Address</span>
                            <span className="text-slate-650 font-medium leading-relaxed">{business.address || 'Udumalpet'}</span>
                          </div>
                        </div>

                        {/* Facebook and Instagram links directly below Location Address under "Connect with them:" */}
                        {(business.facebook || business.instagram) && (
                          <div className="flex flex-col gap-2 border-t border-slate-100 pt-3.5">
                            <span className="text-[9px] text-slate-455 font-extrabold uppercase tracking-widest">Connect with them:</span>
                            <div className="flex items-center gap-3 mt-1">
                              {business.facebook && (
                                <a 
                                  href={business.facebook.startsWith('http') ? business.facebook : `https://${business.facebook}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="h-8 w-8 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full flex items-center justify-center transition-colors"
                                  title="Facebook Profile"
                                >
                                  <Facebook className="h-4 w-4" />
                                </a>
                              )}
                              {business.instagram && (
                                <a 
                                  href={business.instagram.startsWith('http') ? business.instagram : `https://instagram.com/${business.instagram.replace('@', '')}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="h-8 w-8 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-full flex items-center justify-center transition-colors"
                                  title="Instagram Profile"
                                >
                                  <Instagram className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timings / Business Hours */}
                    <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4 text-left relative group">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="font-extrabold text-sm text-[#001c41] flex items-center gap-2">
                          <Clock className="h-4.5 w-4.5 text-slate-500" /> Business Hours
                        </span>
                        <button 
                          type="button"
                          onClick={() => {
                            setEditTab('specs');
                            setShowEditModal(true);
                          }}
                          className="p-1.5 hover:bg-slate-100 text-slate-405 hover:text-[#027244] rounded-xl transition-colors cursor-pointer border-none flex items-center justify-center shrink-0"
                          title="Edit Timings"
                        >
                          <Edit3 className="h-4 w-4" /> Edit
                        </button>
                      </div>

                      <div className="flex flex-col gap-2.5 text-xs font-bold text-slate-605 text-left">
                        {business.timings && typeof business.timings === 'object' && !Array.isArray(business.timings) ? (
                          Object.entries(business.timings).map(([day, time]) => (
                            <div key={day} className="flex justify-between border-b border-slate-50 pb-2 last:border-b-0">
                              <span className="text-slate-400 font-semibold">{day}</span>
                              <span className={`font-black ${String(time || '').toLowerCase().includes('closed') ? 'text-rose-550' : 'text-slate-800'}`}>{String(time || 'Closed')}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-550 font-semibold text-center">
                            {typeof business.timings === 'string' ? business.timings : 'No timings configured yet.'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Share Circular Icons */}
                    <div className="bg-white border border-slate-200 shadow-sm rounded-[24px] p-6 flex flex-col gap-3.5 text-left">
                      <span className="font-extrabold text-sm text-slate-805">Share Profile</span>
                      <div className="flex items-center gap-3 mt-1.5 justify-start">
                        <button className="h-8 w-8 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded-full flex items-center justify-center text-slate-600 transition-colors cursor-pointer">
                          <Facebook className="h-4 w-4" />
                        </button>
                        <button className="h-8 w-8 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded-full flex items-center justify-center text-slate-600 transition-colors cursor-pointer">
                          <MessageSquare className="h-4 w-4 text-slate-650" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(`http://localhost:3000/businesses/${business._id}`);
                            alert("Profile link copied!");
                          }}
                          className="h-8 w-8 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded-full flex items-center justify-center text-slate-600 transition-colors cursor-pointer font-bold text-xs"
                        >
                          <Globe className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* TAB: DASHBOARD NOT LISTED YET (INLINE BUSINESS OWNER CTA) */}
          {/* ========================================================================= */}
          {activeTab === 'My Business' && !business && (
            <div className="max-w-md w-full bg-white border border-slate-200 shadow-xl rounded-[28px] p-8 text-center flex flex-col items-center gap-6 mx-auto my-12 animate-fadeIn">
              <div className="h-15 w-15 bg-emerald-50 text-[#027244] rounded-2xl flex items-center justify-center border border-emerald-100 animate-pulse">
                <Briefcase className="h-7 w-7" />
              </div>
              <div className="flex flex-col gap-1.5 items-center">
                <h3 className="font-extrabold text-slate-800 text-base leading-tight">Still no business registered!</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Hello, {user?.fullName || 'Writer'}! You have not registered any business listing on Udumalpet Business Tour (UBT) yet. Register now to list your business and unlock customer leads.
                </p>
              </div>
              <button 
                onClick={() => navigate('/add-business')}
                className="w-full py-3.5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow-md transition-all shadow-emerald-700/10 cursor-pointer"
              >
                Register Business Now
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: EVENTS MANAGEMENT DASHBOARD */}
          {/* ========================================================================= */}
          {activeTab === 'Events' && (
            <div className="flex flex-col gap-6 text-left animate-fadeIn">
              
              {/* Header card */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-[#001c41] text-base">Events Management Desk</h3>
                  <span className="text-[10px] text-slate-450 font-semibold mt-0.5">List and announce matches, storefront expos, and community summits in Udumalpet</span>
                </div>
                <button 
                  onClick={() => setShowCreateEventModal(true)}
                  className="bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer border border-emerald-700/10"
                >
                  <Plus className="h-4.5 w-4.5" /> List New Event
                </button>
              </div>

              {/* Events Content Stream */}
              {eventsLoading ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-450 flex flex-col items-center gap-2.5 shadow-sm">
                  <RefreshCw className="h-7 w-7 text-emerald-600 animate-spin" />
                  <span className="text-xs font-bold">Retrieving your listed events...</span>
                </div>
              ) : displayEvents.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-450 flex flex-col items-center gap-4 shadow-sm max-w-md mx-auto my-6 animate-fadeIn">
                  <div className="h-15 w-15 bg-emerald-50 text-[#027244] rounded-2xl flex items-center justify-center border border-emerald-100 animate-pulse">
                    <Calendar className="h-7 w-7" />
                  </div>
                  <div className="flex flex-col gap-1.5 text-center items-center">
                    <h4 className="font-extrabold text-slate-800 text-base leading-tight">Still no events listed!</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Hello, {user?.fullName || 'Writer'}! Announce local business expos, seasonal discounts, or training meets. Register events now to showcase them in the website.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowCreateEventModal(true)}
                    className="w-full py-3.5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow-md transition-all shadow-emerald-700/10 cursor-pointer"
                  >
                    List Event Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayEvents.map((evt) => (
                    <div key={evt._id} className="card-premium rounded-3xl overflow-hidden bg-white flex flex-col border border-slate-200 shadow-sm">
                      <div 
                        className="h-36 bg-cover bg-center shrink-0 relative"
                        style={{ backgroundImage: `url('${evt.coverImageUrl || getEventDefaultImage(evt.category)}')` }}
                      >
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs border border-slate-100 px-2 py-0.5 rounded text-[8px] font-black uppercase text-slate-700 shadow-2xs">
                          {evt.category}
                        </div>
                        <div className="absolute top-3 right-3 shadow-2xs">
                          {(() => {
                            const statusLower = evt.status?.toLowerCase();
                            const isExpired = new Date(evt.endDate || evt.date) < new Date();
                            return (
                              <div className="flex gap-1 items-center">
                                {isExpired && (
                                  <span className="bg-red-100 border border-red-300 text-red-700 px-2 py-0.5 rounded text-[8.5px] font-black uppercase select-none">Expired</span>
                                )}
                                {(() => {
                                  if (statusLower === 'pending review' || statusLower === 'pending') {
                                    return <span className="bg-amber-100 border border-amber-300 text-amber-800 px-2 py-0.5 rounded text-[8.5px] font-black uppercase">Pending Approval</span>;
                                  }
                                  if (statusLower === 'rejected') {
                                    return <span className="bg-red-100 border border-red-300 text-red-800 px-2 py-0.5 rounded text-[8.5px] font-black uppercase">Rejected</span>;
                                  }
                                  if (statusLower === 'approved' && !evt.isCompleted) {
                                    return <span className="bg-blue-100 border border-blue-300 text-blue-800 px-2 py-0.5 rounded text-[8.5px] font-black uppercase">Awaiting Details</span>;
                                  }
                                  if (statusLower === 'approved' && evt.isCompleted) {
                                    return <span className="bg-[#027244] text-white px-2 py-0.5 rounded text-[8.5px] font-black uppercase">Published</span>;
                                  }
                                  return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[8.5px] font-black uppercase">{evt.status}</span>;
                                })()}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between text-left gap-4">
                        <div className="flex flex-col gap-2">
                          <h4 className="font-extrabold text-slate-800 text-sm leading-tight line-clamp-1">{evt.title}</h4>
                          <p className="text-slate-550 text-[10.5px] font-semibold line-clamp-2 leading-relaxed">
                            {evt.description || 'Provide description, location, contact, and cover image to publish this event.'}
                          </p>
                        </div>
                        
                        <div className="flex flex-col gap-3 border-t border-slate-100 pt-3">
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col gap-1 text-[10px] text-slate-450 font-semibold">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span>{formatEventDateRange(evt.date, evt.endDate)}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span>{evt.time}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span className="truncate max-w-[120px]">{evt.venue || 'To Be Declared'}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleEventDelete(evt._id)}
                              className="py-1.5 px-2.5 bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 font-extrabold text-[9.5px] rounded-lg cursor-pointer transition-colors flex items-center gap-1 shrink-0 shadow-2xs"
                            >
                              <Trash2 className="h-3 w-3" /> Delete
                            </button>
                          </div>

                          {/* If payment is pending, allow paying listing fee before admin approval */}
                          {evt.paymentStatus === 'Pending' && (
                            <button
                              onClick={() => handleOpenCompleteEvent(evt)}
                              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                            >
                              <CreditCard className="h-4 w-4" /> Pay Listing Fee (₹99)
                            </button>
                          )}

                          {/* If payment is verified/paid, show waiting for admin approval if not yet approved */}
                          {evt.paymentStatus !== 'Pending' && (evt.status?.toLowerCase() === 'pending review' || evt.status?.toLowerCase() === 'pending') && (
                            <button
                              disabled
                              className="w-full py-2 bg-slate-100 border border-slate-200 text-slate-400 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed mt-1"
                            >
                              <Clock className="h-4 w-4 text-slate-400" /> Waiting for Admin Approval
                            </button>
                          )}

                          {/* If payment is verified, allow completing details only after admin approval */}
                          {evt.paymentStatus !== 'Pending' && evt.status?.toLowerCase() === 'approved' && !evt.isCompleted && (
                            <button
                              onClick={() => handleOpenCompleteEvent(evt)}
                              className="w-full py-2 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                            >
                              <Edit3 className="h-4 w-4" /> Complete Event Details
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: PHOTOS & MEDIA MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'Photos & Media' && business && (
            <div className="flex flex-col gap-6 text-left animate-fadeIn">

              {/* Header */}
              <div className="bg-gradient-to-r from-white via-white to-blue-50/20 border border-slate-200 shadow-xs rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-[#001c41] text-base md:text-lg tracking-tight font-sans">Photos & Media Manager</h3>
                  <span className="text-[11px] text-slate-450 font-semibold mt-1">Upload and manage your business logo, cover image, and photo gallery</span>
                </div>
                <button
                  onClick={() => { setEditTab('services'); setShowEditModal(true); }}
                  className="bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer border border-emerald-700/10"
                >
                  <Upload className="h-4.5 w-4.5" /> Open Full Editor
                </button>
              </div>

              {uploadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {uploadError}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Logo Upload Card */}
                <div className="bg-white border border-slate-200 shadow-xs rounded-3xl p-6 flex flex-col gap-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="font-extrabold text-slate-800 text-sm">Business Logo</h4>
                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Square logo shown on your listing card. (Max 5MB)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                      {editFields.logoUrl ? (
                        <img src={editFields.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-slate-300" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <label className="cursor-pointer">
                        <div className={`py-2.5 px-4 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl text-[11px] font-extrabold text-slate-700 flex items-center gap-2 transition-colors ${logoUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                          {logoUploading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                          {logoUploading ? 'Uploading...' : 'Upload Logo'}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleDashboardImageUpload(e, 'logoUrl')}
                          className="hidden"
                          disabled={logoUploading}
                        />
                      </label>
                      {editFields.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setEditFields(prev => ({ ...prev, logoUrl: '' }))}
                          className="text-[10px] text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" /> Remove Logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cover Image Upload Card */}
                <div className="bg-white border border-slate-200 shadow-xs rounded-3xl p-6 flex flex-col gap-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="font-extrabold text-slate-800 text-sm">Cover / Banner Image</h4>
                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Landscape image shown as your profile banner. (Max 5MB)</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {editFields.coverImageUrl ? (
                      <div className="h-32 rounded-2xl overflow-hidden border border-slate-200 relative group">
                        <img src={editFields.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => setEditFields(prev => ({ ...prev, coverImageUrl: '' }))}
                            className="bg-red-600 text-white rounded-xl py-1.5 px-3 text-[10px] font-extrabold flex items-center gap-1 shadow cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" /> Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-32 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-slate-300" />
                      </div>
                    )}
                    <label className="cursor-pointer">
                      <div className={`py-2.5 px-4 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl text-[11px] font-extrabold text-slate-700 flex items-center gap-2 transition-colors w-fit ${coverUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                        {coverUploading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                        {coverUploading ? 'Uploading...' : 'Upload Cover Image'}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleDashboardImageUpload(e, 'coverImageUrl')}
                        className="hidden"
                        disabled={coverUploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Gallery Photos Full Section */}
              <div className="bg-white border border-slate-200 shadow-xs rounded-3xl p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">Photo Gallery</h4>
                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">
                      {editFields.galleryUrls ? editFields.galleryUrls.split(',').filter(Boolean).length : 0} photos uploaded · Up to 50 photos allowed
                    </span>
                  </div>
                  <label className={`cursor-pointer ${galleryUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                    <div className="py-2.5 px-4 bg-[#027244] hover:bg-[#005934] text-white rounded-xl text-[11px] font-extrabold flex items-center gap-2 transition-colors shadow-md">
                      {galleryUploading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                      {galleryUploading ? 'Uploading...' : 'Add Photos'}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleDashboardImageUpload(e, 'galleryUrls')}
                      className="hidden"
                      disabled={galleryUploading}
                    />
                  </label>
                </div>

                {/* Gallery Grid */}
                {editFields.galleryUrls && editFields.galleryUrls.split(',').map(s => s.trim()).filter(Boolean).length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {editFields.galleryUrls.split(',').map(s => s.trim()).filter(Boolean).map((url, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-3xs bg-slate-100">
                        <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              const currentUrls = editFields.galleryUrls.split(',').map(s => s.trim()).filter(Boolean);
                              const updated = currentUrls.filter((_, uIdx) => uIdx !== idx);
                              setEditFields(prev => ({ ...prev, galleryUrls: updated.join(', ') }));
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white h-8 w-8 rounded-xl flex items-center justify-center shadow cursor-pointer"
                            title="Delete this photo"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="absolute bottom-1 left-1 bg-slate-900/70 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-lg select-none">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}

                    {/* Add more slot */}
                    <label className={`aspect-square rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-emerald-50/30 transition-all ${galleryUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                      <Plus className="h-6 w-6 text-slate-400" />
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wide">Add More</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleDashboardImageUpload(e, 'galleryUrls')}
                        className="hidden"
                        disabled={galleryUploading}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center gap-4 bg-slate-50 hover:bg-slate-100 transition-colors text-center">
                      <div className="h-14 w-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center">
                        <ImageIcon className="h-7 w-7 text-blue-500" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-700 text-sm block">No photos uploaded yet</span>
                        <span className="text-[11px] text-slate-400 font-semibold mt-1 block">Click to select photos from your device (PNG, JPG, max 5MB each)</span>
                      </div>
                      <div className="py-2.5 px-6 bg-[#027244] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2">
                        <Upload className="h-4 w-4" /> Upload Photos
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleDashboardImageUpload(e, 'galleryUrls')}
                      className="hidden"
                      disabled={galleryUploading}
                    />
                  </label>
                )}

                {/* Save changes note */}
                {(editFields.logoUrl !== (business.logoUrl || '') || editFields.coverImageUrl !== (business.coverImageUrl || '') || editFields.galleryUrls !== (Array.isArray(business.galleryUrls) ? business.galleryUrls.join(', ') : (business.galleryUrls || ''))) && (
                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-4 bg-emerald-50/50 rounded-2xl px-4 py-3 border border-emerald-100">
                    <span className="text-[11px] font-extrabold text-emerald-700 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" /> Changes detected — save to update your profile
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        const galleryArr = editFields.galleryUrls
                          ? editFields.galleryUrls.split(',').map(s => s.trim()).filter(Boolean)
                          : [];
                        await saveInlineFields({
                          logoUrl: editFields.logoUrl,
                          coverImageUrl: editFields.coverImageUrl,
                          galleryUrls: galleryArr,
                        });
                      }}
                      className="shrink-0 py-2.5 px-5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Save Changes
                    </button>
                  </div>
                )}
              </div>

              {/* Tips Card */}
              <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 flex items-start gap-4">
                <div className="h-9 w-9 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <Info className="h-4.5 w-4.5 text-blue-600" />
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <span className="font-extrabold text-blue-800 text-xs">Photo Tips for Better Visibility</span>
                  <ul className="text-[10.5px] text-blue-700 font-semibold leading-relaxed list-disc list-inside mt-0.5 space-y-0.5">
                    <li>Use bright, well-lit photos of your store, products, or work</li>
                    <li>Upload a clear logo — square format works best (e.g. 400×400px)</li>
                    <li>Cover image should be landscape (e.g. 1200×400px)</li>
                    <li>More photos = higher search ranking on the directory</li>
                  </ul>
                </div>
              </div>

            </div>
          )}

             {/* ========================================================================= */}
          {/* TAB: REVIEWS & REPUTATION DASHBOARD */}
          {/* ========================================================================= */}
          {activeTab === 'Reviews & Reputation' && (
            <div className="flex flex-col gap-6 text-left animate-fadeIn">
              
              {/* Header card with subtle gradient background */}
              <div className="bg-gradient-to-r from-white via-white to-emerald-50/15 border border-slate-200 shadow-xs rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-[#001c41] text-base md:text-lg tracking-tight font-sans">Reviews & Reputation Management</h3>
                  <span className="text-[11px] text-slate-450 font-semibold mt-1">Audit local platform feedback, monitor rating metrics, sync Google Reviews, and reply to customers</span>
                </div>
                <button 
                  onClick={copyReviewLink}
                  className="bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-emerald-700/10 shrink-0 flex items-center gap-2 cursor-pointer border border-emerald-700/10 btn-active-press"
                >
                  <Star className="h-4.5 w-4.5 fill-current" /> Get More Reviews
                </button>
              </div>

              {/* Stats overview cards grid using card-premium class */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Aggregate rating card */}
                <div className="card-premium p-6 rounded-3xl flex items-center gap-4.5 bg-white">
                  <div className="h-14 w-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center font-extrabold text-[#001c41] text-2xl shadow-inner uppercase shrink-0">
                    4.8
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Overall Rating</span>
                    <div className="flex items-center text-amber-400 gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10.5px] text-slate-450 font-bold mt-1">Based on 68 local & Google reviews</span>
                  </div>
                </div>

                {/* Local vs Google rating card */}
                <div className="card-premium p-6 rounded-3xl flex flex-col justify-center text-left gap-1 bg-white">
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500">
                    <span>Local platform reviews</span>
                    <span className="text-slate-800">4.7 / 5.0 (24 reviews)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '94%' }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 mt-2.5">
                    <span className="flex items-center gap-1">
                      <span className="text-blue-500 font-bold">G</span>oogle synced reviews
                    </span>
                    <span className="text-slate-800">4.8 / 5.0 (44 reviews)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: '96%' }} />
                  </div>
                </div>

                {/* Rating breakdown metrics */}
                <div className="card-premium p-6 rounded-3xl flex flex-col justify-center gap-1.5 bg-white text-left">
                  <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400">
                    <span className="uppercase tracking-wider">Reputation Level</span>
                    <span className="bg-emerald-55/15 text-[#027244] border border-emerald-100 px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase">
                      Excellent (Top 5%)
                    </span>
                  </div>
                  <p className="text-slate-550 text-[10.5px] font-semibold leading-relaxed mt-1">
                    Your response rate is <strong>98%</strong> with an average response time of <strong>12 mins</strong>. Maintaining this boosts search ranking placement!
                  </p>
                </div>
              </div>

              {/* Reviews Table/Feed List with filters */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden flex flex-col">
                
                {/* Header Filter Actions */}
                <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-55/40">
                  <div className="flex flex-wrap items-center gap-2">
                    
                    {/* Rating filters */}
                    <select 
                      value={reviewFilter} 
                      onChange={(e) => setReviewFilter(e.target.value)}
                      className="border border-slate-200 bg-white rounded-xl py-2 px-3 text-xs font-bold text-slate-600 focus:outline-emerald-600 focus:ring-1 focus:ring-emerald-100 cursor-pointer"
                    >
                      <option value="All">All Ratings</option>
                      <option value="5">5 Stars only</option>
                      <option value="4">4 Stars & Above</option>
                      <option value="3">3 Stars & Below</option>
                    </select>

                    {/* Source filters */}
                    <select 
                      value={reviewSourceFilter} 
                      onChange={(e) => setReviewSourceFilter(e.target.value)}
                      className="border border-slate-200 bg-white rounded-xl py-2 px-3 text-xs font-bold text-slate-600 focus:outline-emerald-600 focus:ring-1 focus:ring-emerald-100 cursor-pointer"
                    >
                      <option value="All">All Sources</option>
                      <option value="local">Local Platform</option>
                      <option value="google">Google Reviews</option>
                    </select>
                  </div>

                  {/* Search reviews bar */}
                  <div className="w-full md:w-68 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Search review text..."
                      value={reviewSearch}
                      onChange={(e) => setReviewSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-emerald-600 font-semibold"
                    />
                  </div>
                </div>

                {/* Reviews Stream Container */}
                <div className="flex flex-col divide-y divide-slate-100 p-6">
                  {localReviews
                    .filter(r => {
                      if (reviewFilter !== 'All') {
                        const stars = Number(reviewFilter);
                        if (stars === 5 && r.rating !== 5) return false;
                        if (stars === 4 && r.rating < 4) return false;
                        if (stars === 3 && r.rating > 3) return false;
                      }
                      if (reviewSourceFilter !== 'All' && r.source !== reviewSourceFilter) return false;
                      if (reviewSearch && !r.text.toLowerCase().includes(reviewSearch.toLowerCase()) && !r.authorName.toLowerCase().includes(reviewSearch.toLowerCase())) return false;
                      return true;
                    })
                    .map((rev) => (
                      <div key={rev.id} className="py-5.5 first:pt-0 last:pb-0 flex flex-col md:flex-row gap-4 justify-between items-start text-left hover:bg-slate-50/20 px-2 rounded-2xl transition-colors">
                        <div className="flex-1 flex gap-3.5">
                          <div className="h-10.5 w-10.5 rounded-full bg-emerald-50 border border-emerald-150/60 flex items-center justify-center text-emerald-800 font-extrabold text-sm shadow-xs uppercase select-none shrink-0">
                            {(rev.authorName || 'R').charAt(0)}
                          </div>
                          
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-slate-800 text-sm leading-tight">{rev.authorName}</span>
                              <span className="text-[10px] font-semibold text-slate-400">{rev.time}</span>
                              
                              {/* Source badge */}
                              {rev.source === 'google' ? (
                                <span className="bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-0.5 select-none leading-none">
                                  Google Sync
                                </span>
                              ) : (
                                <span className="bg-emerald-50 text-[#027244] border border-emerald-100 px-1.5 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-0.5 select-none leading-none">
                                  UBT Local
                                </span>
                              )}
                            </div>

                            {/* Stars rating */}
                            <div className="flex items-center text-amber-400 gap-0.5">
                              {[...Array(Math.round(Number(rev.rating) || 5))].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-current" />
                              ))}
                              {[...Array(5 - Math.round(Number(rev.rating) || 5))].map((_, i) => (
                                <Star key={i} className="h-3 w-3 text-slate-150" />
                              ))}
                            </div>

                            <p className="text-slate-600 text-xs font-semibold leading-relaxed mt-1">
                              "{rev.text}"
                            </p>

                            {/* Show administrative responses if exists */}
                            {reviewResponses[rev.id] && (
                              <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-2xl mt-3 ml-2 flex gap-3 animate-fadeIn">
                                <div className="h-6.5 w-6.5 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[9.5px] font-black shrink-0 shadow-2xs">
                                  R
                                </div>
                                <div className="flex flex-col text-left">
                                  <span className="text-[10px] font-extrabold text-[#001c41]">Owner Response</span>
                                  <p className="text-slate-500 text-[11px] font-semibold mt-1 leading-relaxed">
                                    {reviewResponses[rev.id]}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Response textbox if active */}
                            {replyingReviewId === rev.id && (
                              <div className="flex flex-col gap-2.5 mt-3 ml-2 w-full max-w-lg animate-fadeIn">
                                <textarea
                                  placeholder="Type your reply to the customer..."
                                  value={reviewReplyText}
                                  onChange={(e) => setReviewReplyText(e.target.value)}
                                  className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:outline-emerald-600 font-semibold"
                                  rows={3}
                                />
                                <div className="flex gap-2 justify-start">
                                  <button
                                    onClick={() => {
                                      if (reviewReplyText.trim()) {
                                        setReviewResponses({ ...reviewResponses, [rev.id]: reviewReplyText });
                                        setReviewReplyText('');
                                        setReplyingReviewId(null);
                                      }
                                    }}
                                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10.5px] rounded-xl shadow-xs cursor-pointer btn-active-press"
                                  >
                                    Submit Reply
                                  </button>
                                  <button
                                    onClick={() => setReplyingReviewId(null)}
                                    className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-550 font-extrabold text-[10.5px] rounded-xl cursor-pointer btn-active-press"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Moderation actions */}
                        <div className="flex flex-row md:flex-col gap-1.5 shrink-0 self-end md:self-start mt-3 md:mt-0 pl-14 md:pl-0">
                          {!reviewResponses[rev.id] && replyingReviewId !== rev.id && (
                            <button 
                              onClick={() => setReplyingReviewId(rev.id)}
                              className="py-1.5 px-3 border border-slate-200 text-slate-600 font-extrabold text-[10.5px] rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5 hover:border-emerald-600 hover:text-emerald-700"
                            >
                              <MessageSquare className="h-3.5 w-3.5" /> Reply
                            </button>
                          )}
                          
                          <button 
                            onClick={() => {
                              const updated = localReviews.filter(r => r.id !== rev.id);
                              setLocalReviews(updated);
                            }}
                            className="py-1.5 px-3 border border-red-100 text-red-500 font-extrabold text-[10.5px] rounded-lg hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Spam
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

             {/* ========================================================================= */}
          {/* TAB: LEADS & ENQUIRIES DASHBOARD */}
          {/* ========================================================================= */}
          {activeTab === 'Leads & Enquiries' && (
            <div className="flex flex-col gap-6 text-left animate-fadeIn">
              
              {/* Header card with UBT premium soft gradient */}
              <div className="bg-gradient-to-r from-white via-white to-emerald-50/15 border border-slate-200 shadow-xs rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-[#001c41] text-base md:text-lg tracking-tight font-sans">Customer Leads & Enquiries Inbox</h3>
                  <span className="text-[11px] text-slate-450 font-semibold mt-1">Aggregate direct customer inquiries, receive phone callback requests, and initiate instant WhatsApp replies</span>
                </div>
                <div className="bg-emerald-55/15 text-[#027244] border border-emerald-100 px-3.5 py-1.5 rounded-2xl text-[11px] font-black uppercase inline-flex items-center gap-1.5 shrink-0 select-none shadow-xs font-sans">
                  <Mail className="h-3.5 w-3.5" /> 18 Active Enquiries
                </div>
              </div>

              {/* Main List-Detail Inbox Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
                
                {/* Left Panel: Leads Inbox List (col-span-5) */}
                <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col overflow-hidden max-h-[600px]">
                  <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
                    <span className="text-[10.5px] font-extrabold text-slate-550 uppercase tracking-wider">Inbox Stream</span>
                    
                    {/* Inbox Filters */}
                    <div className="flex gap-1.5">
                      {['All', 'Urgent', 'Responded'].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setLeadFilter(filter)}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer btn-active-press ${leadFilter === filter ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Leads stream scrolling list */}
                  <div className="flex-grow overflow-y-auto divide-y divide-slate-100">
                    {leadsList
                      .filter(l => {
                        if (leadFilter === 'Urgent' && l.name !== 'Suresh Kumar' && l.name !== 'Kavin Prakash') return false;
                        if (leadFilter === 'Responded' && !l.responded) return false;
                        return true;
                      })
                      .map((lead) => {
                        const originalIdx = leadsList.findIndex(l => l.name === lead.name);
                        const isSelected = selectedLeadIdx === originalIdx;
                        
                        return (
                          <button
                            key={lead.name}
                            onClick={() => setSelectedLeadIdx(originalIdx)}
                            className={`w-full p-4 flex items-center gap-3.5 text-left border-l-4 transition-all hover:bg-slate-50/70 border-r-0 border-y-0 cursor-pointer ${isSelected ? 'bg-emerald-55/5 border-l-[#027244] border-r-0 border-y-0 shadow-2xs' : 'border-l-transparent'}`}
                          >
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-extrabold text-xs shadow-xs shrink-0 select-none uppercase ${lead.color || 'bg-slate-100 text-slate-600'}`}>
                              {lead.initial}
                            </div>
                            
                            <div className="flex-grow flex flex-col overflow-hidden">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-extrabold text-slate-800 truncate leading-snug">{lead.name}</span>
                                <span className="text-[9px] font-semibold text-slate-400 shrink-0">{lead.time}</span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">{lead.category}</span>
                              
                              <div className="flex items-center gap-1.5 mt-1.5">
                                {lead.name === 'Suresh Kumar' || lead.name === 'Kavin Prakash' ? (
                                  <span className="bg-rose-50 text-rose-600 border border-rose-100/60 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wide leading-none">
                                    Urgent Callback
                                  </span>
                                ) : (
                                  <span className="bg-blue-50 text-blue-600 border border-blue-100/60 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wide leading-none">
                                    General Query
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </div>

                </div>

                {/* Right Panel: Lead Full Detail View (col-span-7) */}
                <div className="lg:col-span-7 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col overflow-hidden min-h-[400px]">
                  
                  {selectedLeadIdx !== null && leadsList[selectedLeadIdx] ? (
                    (() => {
                      const activeLead = leadsList[selectedLeadIdx];
                      return (
                        <div className="flex flex-col h-full divide-y divide-slate-100">
                          
                          {/* Lead Profile Header */}
                          <div className="p-6 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                              <div className={`h-12 w-12 rounded-full flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0 select-none uppercase ${activeLead.color}`}>
                                {activeLead.initial}
                              </div>
                              <div className="flex flex-col text-left font-sans">
                                <h4 className="font-extrabold text-slate-800 text-sm md:text-base leading-snug">{activeLead.name}</h4>
                                <span className="text-[10px] text-slate-450 font-semibold mt-0.5">Enquiry Category: {activeLead.category}</span>
                                <span className="text-[9.5px] text-slate-400 font-bold mt-0.5">Received via Website Link • {activeLead.time}</span>
                              </div>
                            </div>

                            {/* Direct Contact WhatsApp with spring Tactile press */}
                            <a 
                              href={`https://wa.me/${activeLead.phone.replace(/[^0-9]/g, '')}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10.5px] py-2.5 px-4.5 rounded-xl shadow-md hover:shadow-emerald-700/10 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer btn-active-press border border-emerald-700/10"
                            >
                              <MessageSquare className="h-3.5 w-3.5 fill-current" /> WhatsApp Contact
                            </a>
                          </div>

                          {/* Enquiry Text Details */}
                          <div className="p-6 flex-grow flex flex-col gap-5 text-left">
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Customer Message</span>
                              <div className="bg-[#F8FAFC] border border-slate-200/60 p-4.5 rounded-2xl mt-1.5 relative overflow-hidden shadow-3xs">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#027244]" />
                                <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                                  "Hello! I saw your shop profile on Udumalpet Business Tour. I am looking to get service support for <strong>{activeLead.category}</strong>. Please reach out to me callback immediately or text back on WhatsApp. My details are verified."
                                </p>
                              </div>
                            </div>

                            {/* Callback details grid */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="border border-slate-200 p-3.5 rounded-2xl flex flex-col gap-0.5 text-left bg-slate-50/30">
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Mobile Number</span>
                                <span className="text-xs font-extrabold text-slate-800">{activeLead.phone}</span>
                              </div>
                              <div className="border border-slate-200 p-3.5 rounded-2xl flex flex-col gap-0.5 text-left bg-slate-50/30">
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Status Tracker</span>
                                <span className="text-xs font-extrabold text-rose-500 flex items-center gap-1.5 mt-0.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" /> Pending Response
                                </span>
                              </div>
                            </div>

                            {/* Show simulated replies if exists */}
                            {activeLead.reply && (
                              <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4 mt-2 animate-fadeIn">
                                <span className="text-[9.5px] font-extrabold text-[#027244] uppercase tracking-widest leading-none">Your Reply</span>
                                <div className="bg-emerald-50/30 border border-emerald-100 p-4 rounded-2xl mt-1 flex gap-2.5">
                                  <div className="h-6 w-6 rounded-full bg-[#027244] text-white flex items-center justify-center text-[9px] font-black shrink-0 shadow-2xs">
                                    R
                                  </div>
                                  <p className="text-slate-600 text-xs font-semibold leading-normal">
                                    {activeLead.reply}
                                  </p>
                                </div>
                              </div>
                            )}

                          </div>

                          {/* Quick reply action box with premium button tactile feedback */}
                          {!activeLead.reply && (
                            <div className="p-6 bg-slate-50/40 flex flex-col gap-3">
                              <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest leading-none text-left">Quick Response Box</span>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Type your response email or text..."
                                  value={leadReplyText}
                                  onChange={(e) => setLeadReplyText(e.target.value)}
                                  className="flex-grow border border-slate-200 rounded-xl px-4 py-3 text-xs bg-white focus:outline-emerald-600 font-semibold shadow-3xs"
                                />
                                <button
                                  onClick={async () => {
                                    if (!leadReplyText.trim()) return;
                                    if (activeLead._id) {
                                      const activeToken = token || localStorage.getItem('ubt_token');
                                      try {
                                        const res = await fetch(`http://localhost:5000/api/leads/${activeLead._id}/reply`, {
                                          method: 'PUT',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Bearer ${activeToken}`
                                          },
                                          body: JSON.stringify({ reply: leadReplyText })
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                          const updatedList = [...leadsList];
                                          updatedList[selectedLeadIdx] = {
                                            ...activeLead,
                                            reply: leadReplyText,
                                            responded: true
                                          };
                                          setLeadsList(updatedList);
                                          setLeadReplyText('');
                                          return;
                                        }
                                      } catch (err) {
                                        console.warn('Failed to reply via API, applying offline fallback updates', err);
                                      }
                                    }
                                    
                                    // Offline fallback update
                                    const updatedList = [...leadsList];
                                    updatedList[selectedLeadIdx] = {
                                      ...activeLead,
                                      reply: leadReplyText,
                                      responded: true
                                    };
                                    setLeadsList(updatedList);
                                    setLeadReplyText('');
                                  }}
                                  className="py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-all border border-slate-800 btn-active-press"
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      );
                    })()
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center gap-3.5 text-slate-450 p-8 my-12 animate-fadeIn">
                      <Mail className="h-8 w-8 text-slate-300" />
                      <span className="text-xs font-extrabold tracking-wide max-w-xs text-center leading-relaxed">Select a customer lead from the inbox to begin instant WhatsApp responses.</span>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: OFFERS & PROMOTIONS DASHBOARD */}
          {/* ========================================================================= */}
          {activeTab === 'Offers & Promotions' && (
            <div className="flex flex-col gap-6 text-left animate-fadeIn">
              
              {/* Header card with UBT premium soft gradient */}
              <div className="bg-gradient-to-r from-white via-white to-emerald-50/15 border border-slate-200 shadow-xs rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-[#001c41] text-base md:text-lg tracking-tight font-sans">Discount Campaigns & Offers</h3>
                  <span className="text-[11px] text-slate-450 font-semibold mt-1">Publish live custom discounts, festival campaign flyers, and BOGO deals to drive town engagement</span>
                </div>
                <button 
                  onClick={() => setShowAddOffer(true)}
                  className="bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-emerald-700/10 shrink-0 flex items-center gap-2 cursor-pointer border border-emerald-700/10 btn-active-press"
                >
                  <Plus className="h-4.5 w-4.5" /> Launch New Offer
                </button>
              </div>

              {/* Add offer modal/inline form if active */}
              {showAddOffer && (
                <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-md border-t-4 border-t-emerald-600 flex flex-col gap-4 animate-slideDown max-w-xl text-left">
                  <h4 className="font-extrabold text-slate-800 text-sm tracking-tight font-sans">Launch New Deal Flyer</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10.5px] font-extrabold text-slate-500">Offer Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Festival Special discount"
                        value={newOfferFields.title}
                        onChange={(e) => setNewOfferFields({ ...newOfferFields, title: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs bg-slate-50/50 focus:outline-emerald-600 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10.5px] font-extrabold text-slate-500">Rate / Deal Code</label>
                      <input
                        type="text"
                        placeholder="e.g. 15% OFF / Buy 1 Get 1"
                        value={newOfferFields.rate}
                        onChange={(e) => setNewOfferFields({ ...newOfferFields, rate: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs bg-slate-50/50 focus:outline-emerald-600 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10.5px] font-extrabold text-slate-500">Description</label>
                    <textarea
                      placeholder="Describe what customers get and how to redeem it..."
                      value={newOfferFields.description}
                      onChange={(e) => setNewOfferFields({ ...newOfferFields, description: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50/50 focus:outline-emerald-650 font-semibold resize-none"
                      rows={2.5}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10.5px] font-extrabold text-slate-500">Campaign Expiry Date</label>
                      <input
                        type="date"
                        value={newOfferFields.expiry}
                        onChange={(e) => setNewOfferFields({ ...newOfferFields, expiry: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50/50 focus:outline-emerald-600 font-semibold cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10.5px] font-extrabold text-slate-500">Deal Banner Image</label>
                      {newOfferFields.banner ? (
                        <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 p-2 flex items-center justify-between gap-3 group">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <img 
                              src={newOfferFields.banner} 
                              alt="Banner preview" 
                              className="h-14 w-20 object-cover rounded-lg border border-slate-200/60 shadow-2xs"
                            />
                            <div className="flex flex-col min-w-0 flex-1 text-left">
                              <span className="text-[11px] font-bold text-slate-700">Banner Selected</span>
                              <span className="text-[9px] text-slate-400 font-semibold truncate">{newOfferFields.banner}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNewOfferFields(prev => ({ ...prev, banner: '' }))}
                            className="p-2 hover:bg-red-50 text-slate-450 hover:text-red-650 rounded-xl transition-colors cursor-pointer border-none flex items-center justify-center shrink-0"
                            title="Remove Image"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      ) : (
                        <div className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-colors bg-slate-50/20 relative ${offerImageUploading ? 'border-emerald-300 bg-emerald-50/5' : 'border-slate-200 hover:bg-slate-50/40'}`}>
                          {offerImageUploading ? (
                            <div className="flex flex-col items-center gap-2">
                              <RefreshCw className="h-6 w-6 text-[#027244] animate-spin" />
                              <span className="text-[10px] font-bold text-slate-500">Uploading banner...</span>
                            </div>
                          ) : (
                            <>
                              <div className="h-8 w-8 bg-slate-50 text-slate-500 border border-slate-100 rounded-xl flex items-center justify-center shadow-3xs">
                                <Upload className="h-4 w-4" />
                              </div>
                              <div className="text-center flex flex-col items-center">
                                <span className="text-[11px] font-extrabold text-slate-700">Click to upload banner</span>
                                <span className="text-[9px] text-slate-455 font-bold mt-0.5">PNG, JPG up to 5MB</span>
                              </div>
                              <input 
                                type="file" 
                                accept="image/*"
                                id="dashboard-offer-banner-upload"
                                onChange={handleOfferBannerUpload}
                                className="hidden"
                              />
                              <label 
                                htmlFor="dashboard-offer-banner-upload"
                                className="absolute inset-0 w-full h-full cursor-pointer"
                              />
                            </>
                          )}
                        </div>
                      )}
                      {offerImageError && (
                        <span className="text-[9.5px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {offerImageError}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-start mt-2">
                    <button
                      onClick={() => {
                        if (newOfferFields.title && newOfferFields.description) {
                          const launched = {
                            id: Date.now().toString(),
                            title: newOfferFields.title,
                            description: newOfferFields.description,
                            rate: newOfferFields.rate || 'Special Deal',
                            expiry: newOfferFields.expiry || '2026-06-30',
                            active: true,
                            banner: newOfferFields.banner || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80'
                          };
                          updateOffers([launched, ...offersList]);
                          setNewOfferFields({ title: '', description: '', rate: '', expiry: '', banner: '' });
                          setShowAddOffer(false);
                        }
                      }}
                      className="py-2.5 px-6 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-emerald-700/10 cursor-pointer btn-active-press border border-emerald-700/10"
                    >
                      Publish Deal Campaign
                    </button>
                    <button
                      onClick={() => setShowAddOffer(false)}
                      className="py-2.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-xl cursor-pointer btn-active-press"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Deals campaign grid using card-premium styling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offersList.map((campaign) => (
                  <div key={campaign.id} className="card-premium rounded-3xl overflow-hidden flex flex-col relative bg-white">
                    <div 
                      className="h-36 bg-cover bg-center shrink-0 relative smooth-img-container"
                      style={{ backgroundImage: `url('${campaign.banner}')` }}
                    >
                      <div className="absolute inset-0 bg-slate-950/20" />
                      <div className="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1 rounded-xl text-xs font-black uppercase shadow-md select-none tracking-wide">
                        {campaign.rate}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col gap-2 text-left justify-between flex-1">
                      <div className="flex flex-col gap-1.5">
                        <h4 className="font-extrabold text-[#001c41] text-sm md:text-base leading-snug">{campaign.title}</h4>
                        <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                          {campaign.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-3">
                        <span className="text-[10px] text-slate-450 font-bold">Campaign Expiry: {campaign.expiry}</span>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const updated = offersList.map(c => c.id === campaign.id ? { ...c, active: !c.active } : c);
                              updateOffers(updated);
                            }}
                            className={`py-1.5 px-3 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer btn-active-press ${campaign.active ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-emerald-50 hover:bg-emerald-100 text-[#027244]'}`}
                          >
                            {campaign.active ? 'Pause' : 'Activate'}
                          </button>
                          <button
                            onClick={() => {
                              const updated = offersList.filter(c => c.id !== campaign.id);
                              updateOffers(updated);
                            }}
                            className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-black uppercase cursor-pointer btn-active-press"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: MENU DASHBOARD */}
          {/* ========================================================================= */}
          {activeTab === 'Menu' && (
            <div className="flex flex-col gap-6 text-left animate-fadeIn font-sans">
              
              {/* Header card with subtle gradient background */}
              <div className="bg-gradient-to-r from-white via-white to-emerald-50/15 border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-[#001c41] text-base md:text-lg tracking-tight">Food Menu Management</h3>
                  <span className="text-[11px] text-slate-455 font-semibold mt-1">Manage your food menu items, categories, pricing, discounts, and availability in real time</span>
                </div>
                <button 
                  onClick={() => handleOpenMenuItemModal()}
                  className="bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer border border-emerald-700/10 btn-active-press"
                >
                  <Plus className="h-4.5 w-4.5" /> Add Menu Item
                </button>
              </div>

              {/* Menu Items Desk Content */}
              {menuLoading ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-455 flex flex-col items-center gap-2.5 shadow-sm">
                  <RefreshCw className="h-7 w-7 text-emerald-600 animate-spin" />
                  <span className="text-xs font-bold">Synchronizing your food menu desk...</span>
                </div>
              ) : menuItems.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-455 flex flex-col items-center gap-4 shadow-sm max-w-md mx-auto my-6">
                  <div className="h-14 w-14 bg-emerald-55/15 text-[#027244] rounded-2xl flex items-center justify-center border border-emerald-100/50 animate-pulse">
                    <Utensils className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">No Menu Items Listed</h4>
                    <p className="text-xs text-slate-455 font-semibold leading-relaxed mt-1.5">
                      Get started by listing your restaurant's delicious dishes so customers can view and order them directly.
                    </p>
                  </div>
                  <button 
                    onClick={() => handleOpenMenuItemModal()}
                    className="w-full py-2.5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow cursor-pointer"
                  >
                    Add Your First Item
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Category-grouped Items View */}
                  {(() => {
                    const categories = [...new Set(menuItems.map(item => item.category || 'General'))];
                    return categories.map(cat => {
                      const itemsInCat = menuItems.filter(item => (item.category || 'General') === cat);
                      return (
                        <div key={cat} className="flex flex-col gap-4">
                          <h4 className="font-extrabold text-slate-800 text-sm md:text-base border-l-4 border-[#027244] pl-3 capitalize">{cat}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {itemsInCat.map(item => {
                              const discountPercent = item.offerPrice 
                                ? Math.round(((item.price - item.offerPrice) / item.price) * 100)
                                : 0;
                              return (
                                <div key={item._id} className={`card-premium rounded-3xl p-5 flex flex-col justify-between gap-4 bg-white border border-slate-200 transition-all duration-300 relative ${!item.isAvailable ? 'opacity-75' : ''}`}>
                                  <div className="flex flex-col gap-2.5 text-left">
                                    <div className="flex justify-between items-start gap-2">
                                      <div className="flex items-center gap-2">
                                        <div className={`h-4.5 w-4.5 border-2 flex items-center justify-center p-0.5 rounded shrink-0 select-none ${item.isVeg ? 'border-emerald-600' : 'border-red-600'}`}>
                                          <div className={`h-2 w-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${item.isVeg ? 'text-emerald-700' : 'text-red-700'}`}>
                                          {item.isVeg ? 'Veg' : 'Non-Veg'}
                                        </span>
                                      </div>
                                      
                                      <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider select-none ${
                                        item.isAvailable 
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-250/30' 
                                          : 'bg-rose-50 text-rose-700 border border-rose-250/30'
                                      }`}>
                                        {item.isAvailable ? 'Available' : 'Out of Stock'}
                                      </span>
                                    </div>

                                    <div className="flex flex-col">
                                      <h5 className="font-extrabold text-sm text-[#001c41] leading-snug">{item.name}</h5>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 mt-2">
                                    <div className="flex flex-col text-left">
                                      {item.offerPrice ? (
                                        <div className="flex flex-col">
                                          <div className="flex items-center gap-2">
                                            <span className="text-base font-extrabold text-slate-800">₹{item.offerPrice}</span>
                                            <span className="text-[10px] bg-rose-50 border border-rose-100 text-rose-600 font-extrabold px-1.5 py-0.5 rounded">
                                              {discountPercent}% OFF
                                            </span>
                                          </div>
                                          <span className="text-[10px] text-slate-400 font-bold line-through">M.R.P: ₹{item.price}</span>
                                        </div>
                                      ) : (
                                        <span className="text-base font-extrabold text-slate-850">₹{item.price}</span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleAvailability(item)}
                                        className={`py-1.5 px-2.5 rounded-lg text-[9.5px] font-black uppercase transition-all cursor-pointer ${
                                          item.isAvailable 
                                            ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200' 
                                            : 'bg-emerald-50 hover:bg-emerald-100 text-[#027244] border border-emerald-200'
                                        }`}
                                      >
                                        {item.isAvailable ? 'Mark Out' : 'Mark In'}
                                      </button>
                                      
                                      <button
                                        type="button"
                                        onClick={() => handleOpenMenuItemModal(item)}
                                        className="p-1.5 border border-slate-200 hover:border-slate-350 text-slate-600 hover:text-emerald-700 bg-slate-50/50 hover:bg-slate-100/50 rounded-xl transition-all cursor-pointer"
                                        title="Edit Item"
                                      >
                                        <Edit3 className="h-3.5 w-3.5" />
                                      </button>
                                      
                                      <button
                                        type="button"
                                        onClick={() => handleMenuDelete(item._id)}
                                        className="p-1.5 border border-rose-200 hover:border-rose-350 text-rose-655 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                                        title="Delete Item"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: BRANCHES DASHBOARD */}
          {/* ========================================================================= */}
          {activeTab === 'Branches' && (
            <div className="flex flex-col gap-6 text-left animate-fadeIn font-sans">
              
              {/* Header card */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-[#001c41] text-base">Branches Management Desk</h3>
                  <span className="text-[10px] text-slate-450 font-semibold mt-0.5">Add or manage multiple branches under your business profile. Single branches default to your main profile details.</span>
                </div>
                <button 
                  onClick={() => navigate('/add-business?mode=branch')}
                  className="bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer border border-emerald-700/10"
                >
                  <Plus className="h-4.5 w-4.5" /> Add New Branch
                </button>
              </div>

              {/* Branches Content Stream */}
              {branchesLoading ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-450 flex flex-col items-center gap-2.5 shadow-sm">
                  <RefreshCw className="h-7 w-7 text-emerald-600 animate-spin" />
                  <span className="text-xs font-bold">Retrieving your listed branches...</span>
                </div>
              ) : branches.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-450 flex flex-col items-center gap-4 shadow-sm max-w-md mx-auto my-6 animate-fadeIn">
                  <div className="h-15 w-15 bg-emerald-50 text-[#027244] rounded-2xl flex items-center justify-center border border-emerald-100 animate-pulse">
                    <MapPin className="h-7 w-7" />
                  </div>
                  <div className="flex flex-col gap-1.5 text-center items-center">
                    <h4 className="font-extrabold text-slate-800 text-base leading-tight">No branches added yet</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      By default, UBT uses your primary business details. If you have additional retail outlets, warehouses, or service centers, register them as branches to show them on your public profile!
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/add-business?mode=branch')}
                    className="w-full py-3.5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow-md transition-all shadow-emerald-700/10 cursor-pointer"
                  >
                    Add Branch Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {branches.map((branch) => (
                    <div key={branch._id} className="card-premium rounded-3xl bg-white border border-slate-200 shadow-sm p-6 flex flex-col justify-between text-left gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-extrabold text-slate-800 text-sm">{branch.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase shrink-0 ${
                            branch.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            branch.status === 'Pending Verification' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            branch.status === 'Under Review' ? 'bg-blue-50 text-blue-755 border border-blue-200' :
                            branch.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {branch.status}
                          </span>
                        </div>
                        {branch.branchManagerName && (
                          <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5 mt-0.5">
                            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px]">Manager</span>
                            <span>{branch.branchManagerName}</span>
                          </div>
                        )}
                        <hr className="border-slate-100 my-2" />
                        <div className="flex flex-col gap-2 text-xs text-slate-600">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                            <span>{branch.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <PhoneCall className="h-4 w-4 text-slate-400 shrink-0" />
                            <span>{branch.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                            <span>{branch.workingHours || '9:00 AM - 8:00 PM'}</span>
                          </div>
                          <div className="flex items-center gap-4 text-[10px] text-slate-450 mt-1">
                            <span>Lat: {branch.latitude?.toFixed(4) || '10.5891'}</span>
                            <span>Lng: {branch.longitude?.toFixed(4) || '77.2412'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mt-2 border-t border-slate-100 pt-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/businesses/${branch._id}`}
                            target="_blank"
                            className="flex-1 py-2 border border-[#027244] text-[#027244] hover:bg-emerald-50/30 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <ExternalLink className="h-3.5 w-3.5" /> View Profile
                          </Link>
                          <button
                            onClick={() => {
                              handleSwitchBusiness(branch._id);
                              setActiveTab('Business Details');
                            }}
                            className="flex-1 py-2 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm border-none"
                          >
                            <Settings className="h-3.5 w-3.5" /> Manage Branch
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenBranchModal(branch)}
                            className="flex-1 py-2 border border-slate-200 hover:border-slate-350 text-slate-700 hover:bg-slate-50 font-extrabold text-[11px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Edit3 className="h-3 w-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleBranchDelete(branch._id)}
                            className="flex-1 py-2 border border-rose-200 hover:border-rose-350 text-rose-600 hover:bg-rose-50/30 font-extrabold text-[11px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: MY BLOGS DASHBOARD (ANYONE CAN ACCESS WITHOUT PAYMENT) */}
          {/* ========================================================================= */}
          {activeTab === 'My Blogs' && (
            <div className="flex flex-col gap-6 text-left animate-fadeIn">
              
              {/* Header card */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-[#001c41] text-base">My Articles Dashboard</h3>
                  <span className="text-[10px] text-slate-450 font-semibold mt-0.5">Manage your stories, comments, likes, and article visibilities</span>
                </div>
                <button 
                  onClick={() => setShowWriteBlogModal(true)}
                  className="bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer border border-emerald-700/10"
                >
                  <Plus className="h-4.5 w-4.5" /> Write New Blog
                </button>
              </div>

              {/* Blogs Content Stream */}
              {blogsLoading ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-450 flex flex-col items-center gap-2.5 shadow-sm">
                  <RefreshCw className="h-7 w-7 text-emerald-600 animate-spin" />
                  <span className="text-xs font-bold">Synchronizing your articles dashboard...</span>
                </div>
              ) : userBlogs.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-450 flex flex-col items-center gap-4 shadow-sm max-w-md mx-auto my-6">
                  <div className="h-14 w-14 bg-emerald-50 text-[#027244] rounded-2xl flex items-center justify-center border border-emerald-100 animate-pulse">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">No Articles Registered</h4>
                    <p className="text-xs text-slate-450 font-semibold leading-relaxed mt-1.5">
                      You haven’t authored any blog posts on UBT yet. Write and share your first story to get published!
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowWriteBlogModal(true)}
                    className="w-full py-2.5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-transform hover:-translate-y-0.5 animate-pulse"
                  >
                    Write Your First Post
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  
                  {/* Blogs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userBlogs.map((blog) => {
                      const commentsCount = blog.comments ? blog.comments.length : 0;
                      const likesCount = blog.likes ? blog.likes.length : 0;

                      return (
                        <div key={blog._id} className="card-premium rounded-3xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden bg-white">
                          
                          {/* Inner core info */}
                          <div className="flex gap-4">
                            <div className="h-16 w-16 rounded-2xl overflow-hidden shrink-0 border border-slate-100 select-none">
                              <img 
                                src={blog.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'} 
                                className="w-full h-full object-cover" 
                                alt={blog.title} 
                              />
                            </div>
                            <div className="flex flex-col min-w-0 text-left">
                              {/* Status Badge */}
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[8.5px] font-extrabold uppercase tracking-wide border ${
                                  blog.status === 'Approved'
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    : blog.status === 'Rejected'
                                      ? 'bg-red-50 border-red-200 text-red-650'
                                      : blog.status === 'Needs Revision'
                                        ? 'bg-amber-50 border-amber-300 text-amber-800 font-black animate-pulse'
                                        : 'bg-slate-50 border-slate-200 text-slate-500 animate-pulse'
                                }`}>
                                  {blog.status}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">
                                  {new Date(blog.createdAt).toLocaleDateString()}
                                </span>
                              </div>

                              <h4 className="font-extrabold text-sm text-[#001c41] mt-1.5 leading-snug truncate">
                                {blog.title}
                              </h4>

                              {((blog.status === 'Needs Revision') || (blog.status === 'Pending Approval' && blog.revisionHistory && blog.revisionHistory.length > 0)) && (
                                <div className={`mt-2.5 border rounded-2xl p-4 text-[11px] font-semibold leading-relaxed text-left flex flex-col gap-3 animate-fadeIn w-full ${
                                  blog.status === 'Needs Revision' 
                                    ? 'bg-amber-50/70 border-amber-200/60 text-amber-900' 
                                    : 'bg-emerald-50/20 border-emerald-200/30 text-emerald-900'
                                }`}>
                                  <div className="flex items-start gap-1.5 border-b border-slate-205/30 pb-2">
                                    <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${blog.status === 'Needs Revision' ? 'text-amber-600' : 'text-[#027244]'}`} />
                                    <span className={`font-extrabold uppercase tracking-wider text-[9.5px] ${blog.status === 'Needs Revision' ? 'text-amber-950' : 'text-emerald-950'}`}>
                                      {blog.status === 'Needs Revision' ? '⚠️ Revision Chat & Discussion' : '💬 Active Vetting - Revision Chat History'}
                                    </span>
                                  </div>

                                  {/* Chat bubble list */}
                                  {blog.revisionHistory && blog.revisionHistory.length > 0 ? (
                                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1 bg-white/40 border border-slate-200/30 p-2.5 rounded-xl">
                                      {blog.revisionHistory.map((item, idx) => {
                                        const isAdmin = item.senderRole === 'admin' || item.senderRole === 'superadmin';
                                        return (
                                          <div 
                                            key={idx} 
                                            className={`flex flex-col max-w-[85%] rounded-2xl p-2.5 border text-[10.5px] ${
                                              isAdmin 
                                                ? 'bg-amber-100/50 border-amber-200/40 self-start text-left text-amber-950' 
                                                : 'bg-emerald-50/50 border-emerald-250/20 self-end text-right text-[#001c41]'
                                            }`}
                                          >
                                            <span className="text-[7.5px] font-black uppercase text-slate-400 tracking-wider mb-0.5">
                                              {item.senderName} ({isAdmin ? 'Admin' : 'You'})
                                            </span>
                                            <p className="font-semibold whitespace-pre-wrap leading-snug">{item.message}</p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div className="bg-white/40 border border-amber-200/30 p-2.5 rounded-xl text-[10.5px]">
                                      <span className="text-[7.5px] font-black uppercase text-slate-400 tracking-wider mb-0.5">Moderator suggestion</span>
                                      <p className="font-semibold whitespace-pre-wrap leading-snug">{blog.revisionSuggestions}</p>
                                    </div>
                                  )}

                                  {/* Reply chat input */}
                                  <div className="flex gap-2 mt-0.5">
                                    <input
                                      type="text"
                                      placeholder="Explain changes or reply..."
                                      className="flex-1 bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-[10.5px] font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100"
                                      value={replyTexts[blog._id] || ''}
                                      onChange={(e) => setReplyTexts(prev => ({ ...prev, [blog._id]: e.target.value }))}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          handleSendRevisionComment(blog._id);
                                        }
                                      }}
                                    />
                                    <button
                                      onClick={() => handleSendRevisionComment(blog._id)}
                                      className={`px-3 py-2 text-white font-extrabold text-[10px] rounded-xl cursor-pointer transition-colors shadow-2xs ${
                                        blog.status === 'Needs Revision' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#027244] hover:bg-[#005934]'
                                      }`}
                                    >
                                      Send
                                    </button>
                                  </div>

                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Option Toggles (Likes / Comments visibility switches) */}
                          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/60 flex flex-col gap-2.5 text-xs font-bold text-slate-700">
                            
                            {/* Likes toggle */}
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-1.5">
                                <Heart className={`h-4 w-4 ${blog.showLikes ? 'fill-current text-rose-500' : 'text-slate-400'}`} />
                                <span>Show Likes ({likesCount})</span>
                              </span>
                              <button 
                                onClick={() => handleToggleBlogOption(blog._id, 'showLikes', blog.showLikes)}
                                className={`h-5.5 w-10.5 rounded-full p-0.5 transition-colors duration-250 cursor-pointer ${blog.showLikes ? 'bg-emerald-600' : 'bg-slate-300'}`}
                              >
                                <div className={`h-4.5 w-4.5 rounded-full bg-white shadow transform transition-transform duration-250 ${blog.showLikes ? 'translate-x-5' : 'translate-x-0'}`} />
                              </button>
                            </div>

                            {/* Comments toggle */}
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-1.5">
                                <MessageSquare className={`h-4 w-4 ${blog.showComments ? 'fill-current text-blue-500' : 'text-slate-400'}`} />
                                <span>Show Comments ({commentsCount})</span>
                              </span>
                              <button 
                                onClick={() => handleToggleBlogOption(blog._id, 'showComments', blog.showComments)}
                                className={`h-5.5 w-10.5 rounded-full p-0.5 transition-colors duration-250 cursor-pointer ${blog.showComments ? 'bg-emerald-600' : 'bg-slate-300'}`}
                              >
                                <div className={`h-4.5 w-4.5 rounded-full bg-white shadow transform transition-transform duration-250 ${blog.showComments ? 'translate-x-5' : 'translate-x-0'}`} />
                              </button>
                            </div>

                          </div>

                          {/* Action footer */}
                          <div className="flex items-center justify-between border-t border-slate-100 pt-3 gap-2">
                            <Link 
                              to={`/blogs/${blog._id}`} 
                              className="text-[10px] font-extrabold text-[#027244] hover:text-[#005934] flex items-center gap-1 leading-none group cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-400 shrink-0" /> View <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform shrink-0" />
                            </Link>

                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={() => handleEditBlogClick(blog)}
                                title="Edit / Correct Post"
                                className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-[#027244] font-extrabold text-[9.5px] rounded-lg transition-all cursor-pointer flex items-center gap-0.5 border border-emerald-100/10 shadow-2xs"
                              >
                                <Edit3 className="h-3 w-3" /> Edit / Correct
                              </button>
                              <button 
                                onClick={() => handleBlogDelete(blog._id)}
                                title="Delete Blog"
                                className="py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-650 font-extrabold text-[9.5px] rounded-lg transition-all cursor-pointer flex items-center gap-0.5 border border-red-100/10 shadow-2xs"
                              >
                                <Trash2 className="h-3 w-3" /> Delete
                              </button>
                              <button 
                                onClick={() => setActiveBlogComments(activeBlogComments === blog._id ? null : blog._id)}
                                className="text-[10px] font-extrabold text-slate-500 hover:text-[#001c41] bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer leading-none"
                              >
                                {activeBlogComments === blog._id ? 'Hide Comments' : 'Moderate Comments'}
                              </button>
                            </div>
                          </div>

                          {/* Inline Comments moderation sub-stream */}
                          {activeBlogComments === blog._id && (
                            <div className="mt-3 border-t border-slate-200 pt-3 flex flex-col gap-3 max-h-56 overflow-y-auto animate-fadeIn text-left">
                              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Comment Moderation Feed</span>
                              {(!blog.comments || blog.comments.length === 0) ? (
                                <span className="text-[10.5px] text-slate-400 font-semibold leading-relaxed py-2">No comments left on this article yet.</span>
                              ) : (
                                <div className="flex flex-col gap-2">
                                  {blog.comments.map((comment) => (
                                    <div key={comment._id} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex justify-between items-start gap-2">
                                      <div className="flex flex-col text-left text-[11px] leading-snug">
                                        <span className="font-extrabold text-slate-700">
                                          {comment.userName} 
                                          <span className="text-[9px] text-slate-400 font-medium ml-1.5">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                          <span className={`ml-2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${comment.approved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/30' : 'bg-amber-50 text-amber-800 border border-amber-250/30'}`}>
                                            {comment.approved ? 'Approved' : 'Pending Approval'}
                                          </span>
                                        </span>
                                        <p className="text-slate-550 font-semibold mt-1 leading-normal">{comment.text}</p>
                                      </div>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        {!comment.approved && (
                                          <button 
                                            onClick={() => handleCommentApproveDashboard(blog._id, comment._id)}
                                            title="Approve Comment"
                                            className="h-6 px-2 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center cursor-pointer transition-all border border-emerald-200/50 shadow-2xs text-[9.5px] font-extrabold shrink-0 gap-1"
                                          >
                                            <Check className="h-3 w-3" /> Approve
                                          </button>
                                        )}
                                        <button 
                                          onClick={() => handleCommentDeleteDashboard(blog._id, comment._id)}
                                          title="Delete Comment"
                                          className="h-6 w-6 rounded bg-red-50 text-red-650 hover:bg-red-100 flex items-center justify-center cursor-pointer transition-colors shadow-2xs shrink-0 border border-red-100/50"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>

                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: SETTINGS PANEL */}
          {/* ========================================================================= */}
          {activeTab === 'Settings' && (
            <div className="w-full flex flex-col gap-6 text-left animate-fadeIn">
              
              {activeSettingsSubTab === null ? (
                /* DIRECTORY MODE: Clean list of settings options */
                <div className="flex flex-col gap-6 max-w-4xl w-full mx-auto">
                  {/* Header Card */}
                  <div className="bg-white border border-slate-200/80 shadow-xs rounded-[24px] p-6 md:p-8 flex flex-col gap-1 text-left">
                    <h3 className="font-extrabold text-[#001c41] text-xl md:text-2xl tracking-tight font-sans">Settings & Account Control</h3>
                    <p className="text-xs md:text-sm text-slate-400 font-semibold mt-1">Manage your personal credentials, active blog/event creations, and account registration status.</p>
                  </div>

                  {/* Directory Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    
                    {/* Option 1: Profile Details */}
                    <button
                      onClick={() => setActiveSettingsSubTab('profile')}
                      className="w-full text-left p-6 md:p-8 bg-white border border-slate-200/85 hover:border-emerald-500 rounded-[24px] hover:shadow-lg transition-all duration-300 flex items-center justify-between group cursor-pointer hover:-translate-y-1 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                      <div className="flex items-start gap-4.5">
                        <div className="p-3.5 rounded-xl bg-emerald-55/15 text-[#027244] group-hover:bg-emerald-100 transition-colors shrink-0">
                          <Info className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="font-extrabold text-sm md:text-base text-[#001c41] font-sans group-hover:text-[#027244] transition-colors leading-snug">Profile Details</h4>
                          <p className="text-xs text-slate-400 font-semibold mt-1.5 leading-relaxed">Update your full name, email contact address, and personal identifier information.</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-350 group-hover:text-[#027244] group-hover:translate-x-1.5 transition-all shrink-0 ml-4" />
                    </button>

                    {/* Option 2: Change Password */}
                    <button
                      onClick={() => setActiveSettingsSubTab('password')}
                      className="w-full text-left p-6 md:p-8 bg-white border border-slate-200/85 hover:border-blue-500 rounded-[24px] hover:shadow-lg transition-all duration-300 flex items-center justify-between group cursor-pointer hover:-translate-y-1 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
                      <div className="flex items-start gap-4.5">
                        <div className="p-3.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors shrink-0">
                          <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="font-extrabold text-sm md:text-base text-[#001c41] font-sans group-hover:text-blue-700 transition-colors leading-snug">Security & Credentials</h4>
                          <p className="text-xs text-slate-400 font-semibold mt-1.5 leading-relaxed">Update your secure login credentials, password fields, and validation safety.</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-350 group-hover:text-blue-600 group-hover:translate-x-1.5 transition-all shrink-0 ml-4" />
                    </button>

                    {/* Option 3: Manage Content */}
                    <button
                      onClick={() => setActiveSettingsSubTab('content')}
                      className="w-full text-left p-6 md:p-8 bg-white border border-slate-200/85 hover:border-purple-500 rounded-[24px] hover:shadow-lg transition-all duration-300 flex items-center justify-between group cursor-pointer hover:-translate-y-1 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
                      <div className="flex items-start gap-4.5">
                        <div className="p-3.5 rounded-xl bg-purple-50 text-purple-650 group-hover:bg-purple-100 transition-colors shrink-0">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="font-extrabold text-sm md:text-base text-[#001c41] font-sans group-hover:text-purple-700 transition-colors leading-snug">Moderate & Manage Content</h4>
                          <p className="text-xs text-slate-400 font-semibold mt-1.5 leading-relaxed">Moderate your submitted community events, comments feedback, and blog stories.</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-350 group-hover:text-purple-650 group-hover:translate-x-1.5 transition-all shrink-0 ml-4" />
                    </button>

                    {/* Option 4: Danger Zone */}
                    <button
                      onClick={() => setActiveSettingsSubTab('danger')}
                      className="w-full text-left p-6 md:p-8 bg-white border border-slate-200/85 hover:border-red-500 rounded-[24px] hover:shadow-lg transition-all duration-300 flex items-center justify-between group cursor-pointer hover:-translate-y-1 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
                      <div className="flex items-start gap-4.5">
                        <div className="p-3.5 rounded-xl bg-red-55/15 text-red-650 group-hover:bg-red-100 transition-colors shrink-0">
                          <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="font-extrabold text-sm md:text-base text-red-750 font-sans group-hover:text-red-700 transition-colors leading-snug">Danger Zone</h4>
                          <p className="text-xs text-slate-400 font-semibold mt-1.5 leading-relaxed">Deregister and permanently terminate your UBT membership and business listings.</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-350 group-hover:text-red-600 group-hover:translate-x-1.5 transition-all shrink-0 ml-4" />
                    </button>

                  </div>
                </div>
              ) : (
                /* FOCUSED VIEW: Renders only the clicked setting context cleanly */
                <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
                  
                  {/* Premium back navigation bar */}
                  <button
                    onClick={() => {
                      setActiveSettingsSubTab(null);
                      setProfileSuccess('');
                      setProfileError('');
                      setPwdSuccess('');
                      setPwdError('');
                    }}
                    className="self-start flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-[#027244] transition-all cursor-pointer group py-2"
                  >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to settings</span>
                  </button>

                  {/* Focused Form Card */}
                  <div className="w-full bg-white border border-slate-200/80 shadow-md rounded-[32px] p-8 md:p-10 relative overflow-hidden">
                    
                    {/* SUBTAB 1: Profile Details Form */}
                    {activeSettingsSubTab === 'profile' && (
                      <div className="w-full flex flex-col gap-6 animate-fadeIn">
                        <div className="flex flex-col border-b border-slate-100 pb-4 text-left">
                          <h4 className="font-extrabold text-lg text-[#001c41] font-sans">Profile Details</h4>
                          <p className="text-xs text-slate-400 font-semibold mt-1">Update your name and contact email address below</p>
                        </div>

                        {profileSuccess && (
                          <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs font-semibold p-4 rounded-2xl flex items-center gap-2 shadow-xs leading-relaxed">
                            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                            <span>{profileSuccess}</span>
                          </div>
                        )}

                        {profileError && (
                          <div className="bg-red-50 border border-red-200 text-red-655 text-xs font-semibold p-4 rounded-2xl flex items-center gap-2 shadow-xs leading-relaxed">
                            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                            <span>{profileError}</span>
                          </div>
                        )}

                        <form onSubmit={handleProfileUpdate} className="flex flex-col gap-5 text-left">
                          <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                            <input
                              type="text"
                              required
                              value={profileFields.fullName}
                              onChange={(e) => setProfileFields(prev => ({ ...prev, fullName: e.target.value }))}
                              className="w-full border border-slate-200/70 px-4.5 py-3.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none bg-slate-50/20 shadow-2xs font-sans"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                            <input
                              type="email"
                              required
                              value={profileFields.email}
                              onChange={(e) => setProfileFields(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full border border-slate-200/70 px-4.5 py-3.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none bg-slate-50/20 shadow-2xs font-sans"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Website URL (Optional)</label>
                            <input
                              type="url"
                              value={profileFields.website || ''}
                              onChange={(e) => setProfileFields(prev => ({ ...prev, website: e.target.value }))}
                              placeholder="e.g. www.mybusiness.com"
                              className="w-full border border-slate-200/70 px-4.5 py-3.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none bg-slate-50/20 shadow-2xs font-sans"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Instagram Handle (Optional)</label>
                            <input
                              type="text"
                              value={profileFields.instagram || ''}
                              onChange={(e) => setProfileFields(prev => ({ ...prev, instagram: e.target.value }))}
                              placeholder="e.g. @mybusiness"
                              className="w-full border border-slate-200/70 px-4.5 py-3.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none bg-slate-50/20 shadow-2xs font-sans"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Facebook Page Link (Optional)</label>
                            <input
                              type="text"
                              value={profileFields.facebook || ''}
                              onChange={(e) => setProfileFields(prev => ({ ...prev, facebook: e.target.value }))}
                              placeholder="e.g. facebook.com/mybusiness"
                              className="w-full border border-slate-200/70 px-4.5 py-3.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none bg-slate-50/20 shadow-2xs font-sans"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={profileFieldsLoading}
                            className="mt-4 py-3.5 px-8 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-emerald-800/10 cursor-pointer disabled:opacity-50 self-start"
                          >
                            {profileFieldsLoading ? 'Saving Profile Changes...' : 'Save Profile Changes'}
                          </button>
                        </form>
                      </div>
                    )}

                    {/* SUBTAB 2: Change Password Form */}
                    {activeSettingsSubTab === 'password' && (
                      <div className="w-full flex flex-col gap-6 animate-fadeIn">
                        <div className="flex flex-col border-b border-slate-100 pb-4 text-left">
                          <h4 className="font-extrabold text-lg text-[#001c41] font-sans">Change Password</h4>
                          <p className="text-xs text-slate-400 font-semibold mt-1">Update your secure login credentials below</p>
                        </div>

                        {pwdSuccess && (
                          <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs font-semibold p-4 rounded-2xl flex items-center gap-2 shadow-xs leading-relaxed">
                            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                            <span>{pwdSuccess}</span>
                          </div>
                        )}

                        {pwdError && (
                          <div className="bg-red-50 border border-red-200 text-red-655 text-xs font-semibold p-4 rounded-2xl flex items-center gap-2 shadow-xs leading-relaxed">
                            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                            <span>{pwdError}</span>
                          </div>
                        )}

                        <form onSubmit={handlePasswordChange} className="flex flex-col gap-5 text-left">
                          <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                            <input
                              type="password"
                              required
                              placeholder="Enter current password"
                              value={pwdFields.currentPassword}
                              onChange={(e) => setPwdFields(prev => ({ ...prev, currentPassword: e.target.value }))}
                              className="w-full border border-slate-200/70 px-4.5 py-3.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none bg-slate-50/20 shadow-2xs font-sans"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                              <input
                                type="password"
                                required
                                placeholder="Enter new password"
                                value={pwdFields.newPassword}
                                onChange={(e) => setPwdFields(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="w-full border border-slate-200/70 px-4.5 py-3.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none bg-slate-50/20 shadow-2xs font-sans"
                              />
                            </div>

                            <div className="flex flex-col gap-2">
                              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                              <input
                                type="password"
                                required
                                placeholder="Confirm new password"
                                value={pwdFields.confirmPassword}
                                onChange={(e) => setPwdFields(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full border border-slate-200/70 px-4.5 py-3.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none bg-slate-50/20 shadow-2xs font-sans"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={pwdFieldsLoading}
                            className="mt-4 py-3.5 px-8 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-emerald-800/10 cursor-pointer disabled:opacity-50 self-start"
                          >
                            {pwdFieldsLoading ? 'Updating Credentials...' : 'Update Password'}
                          </button>
                        </form>
                      </div>
                    )}

                    {/* SUBTAB 3: Manage Content Activity List */}
                    {activeSettingsSubTab === 'content' && (
                      <div className="w-full flex flex-col gap-6 animate-fadeIn text-left">
                        <div className="flex flex-col border-b border-slate-100 pb-4">
                          <h4 className="font-extrabold text-lg text-[#001c41] font-sans">Moderate & Manage Content</h4>
                          <p className="text-xs text-slate-400 font-semibold mt-1">Moderate or remove your submitted events and articles</p>
                        </div>

                        {/* Events sub-list */}
                        <div className="flex flex-col gap-3">
                          <span className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider leading-none">Your Listed Events ({displayEvents.length})</span>
                          {displayEvents.length === 0 ? (
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-xs font-semibold text-slate-400 leading-relaxed">
                              No events listed yet.
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
                              {displayEvents.map(evt => {
                                const isExpired = new Date(evt.endDate || evt.date) < new Date();
                                return (
                                  <div key={evt._id} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 p-4 rounded-2xl flex justify-between items-center gap-4 transition-all">
                                    <div className="flex flex-col min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="font-extrabold text-slate-755 text-xs truncate leading-snug">{evt.title}</span>
                                        {isExpired && (
                                          <span className="bg-red-50 border border-red-200 text-red-700 px-1.5 py-0.5 rounded text-[8px] font-black uppercase select-none shrink-0">Expired</span>
                                        )}
                                      </div>
                                      <span className="text-[9.5px] text-slate-405 font-bold mt-1 uppercase tracking-wide">
                                        {evt.category} • {formatEventDateRange(evt.date, evt.endDate)}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => handleEventDelete(evt._id)}
                                      className="h-9 w-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-650 flex items-center justify-center cursor-pointer transition-colors shadow-2xs shrink-0"
                                    >
                                      <Trash2 className="h-4.5 w-4.5" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Blogs sub-list */}
                        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 mt-2">
                          <span className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider leading-none">Your Written Blogs ({userBlogs.length})</span>
                          {userBlogs.length === 0 ? (
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-xs font-semibold text-slate-400 leading-relaxed">
                              No articles written yet.
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
                              {userBlogs.map(blog => (
                                <div key={blog._id} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 p-4 rounded-2xl flex justify-between items-center gap-4 transition-all">
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-extrabold text-slate-755 text-xs truncate leading-snug">{blog.title}</span>
                                    <span className="text-[9.5px] text-slate-405 font-bold mt-1 uppercase tracking-wide">
                                      {blog.status} • {new Date(blog.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => handleBlogDelete(blog._id)}
                                    className="h-9 w-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-655 flex items-center justify-center cursor-pointer transition-colors shadow-2xs shrink-0"
                                  >
                                    <Trash2 className="h-4.5 w-4.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* SUBTAB 4: Danger Zone - De-register account */}
                    {activeSettingsSubTab === 'danger' && (
                      <div className="w-full flex flex-col gap-6 animate-fadeIn text-left">
                        <div className="flex flex-col border-b border-slate-100 pb-4">
                          <h4 className="font-extrabold text-lg text-red-700 font-sans">Danger Zone</h4>
                          <p className="text-xs text-slate-400 font-semibold mt-1">Deregister and permanently terminate your UBT membership</p>
                        </div>

                        <div className="bg-rose-50 border border-rose-200 rounded-[20px] p-5 md:p-6 flex items-start gap-4">
                          <AlertTriangle className="h-6 w-6 text-red-650 shrink-0 mt-0.5" />
                          <div className="flex flex-col gap-1.5 text-left leading-normal">
                            <span className="font-extrabold text-red-900 text-xs tracking-tight">Warning: Deletion is Permanent!</span>
                            <p className="text-red-750 text-[11px] leading-relaxed font-semibold">
                              Deleting your account will permanently wipe your UBT registration, delete your business profile, remove all uploaded photos/media, erase listed community events, and purge all your authored blogs. There is no recovery option.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                          <span className="text-xs text-slate-550 font-bold">To confirm profile termination, type "DELETE" below:</span>
                          <input
                            type="text"
                            placeholder="Type DELETE"
                            value={deleteConfirmationText}
                            onChange={(e) => setDeleteConfirmationText(e.target.value)}
                            className="w-full max-w-md border border-slate-200/70 px-4.5 py-3.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none bg-slate-50/20 shadow-2xs font-sans uppercase"
                          />
                        </div>

                        <button
                          onClick={handleDeleteAccount}
                          disabled={deleteConfirmationText !== 'DELETE'}
                          className="self-start py-3.5 px-8 bg-red-650 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all shadow-red-700/10 cursor-pointer disabled:opacity-50"
                        >
                          Delete Account & Clear Registrations
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: HELP & SUPPORT PANEL */}
          {/* ========================================================================= */}
          {activeTab === 'Help & Support' && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 text-center flex flex-col items-center gap-5 max-w-md mx-auto my-12 animate-fadeIn text-left">
              <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-150">
                <Info className="h-6 w-6" />
              </div>
              <div className="text-center">
                <h3 className="font-extrabold text-slate-800 text-base">Help & Support Panel</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-2">
                  Configure your email alerts, manage subscription cycles, or contact the UBT helpdesk for dedicated assistance.
                </p>
              </div>
              <a 
                href="mailto:udumalpetbusinesstour@gmail.com"
                className="w-full py-3 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow-md text-center transition-transform hover:-translate-y-0.5"
              >
                Contact Administrator via Mail
              </a>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: REFERRAL & REWARDS MODULE */}
          {/* ========================================================================= */}
          {activeTab === 'Referral & Rewards' && (
            <div className="flex flex-col gap-8 animate-fadeIn text-left font-sans text-[#001c41]">
              
              {/* Hero Banner Banner */}
              <div className="bg-gradient-to-r from-[#001c41] to-[#027244] rounded-[32px] p-8 text-white relative overflow-hidden shadow flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
                <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
                <div className="flex flex-col gap-2.5 max-w-xl z-10 text-left">
                  <span className="bg-white/10 border border-white/20 text-emerald-300 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full w-fit">
                    UBT Referral & Rewards Program
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                    Refer. Earn. Save.
                  </h2>
                  <p className="text-xs md:text-sm text-slate-200 font-medium leading-relaxed mt-1">
                    Refer new businesses to UBT and earn referral points. Redeem your points and get discounts on your subscription renewal.
                  </p>
                </div>
                
                {/* Rewards Balance Badge */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 flex flex-col items-center justify-center shrink-0 min-w-[210px] z-10 shadow-md">
                  <Gift className="h-7 w-7 text-amber-300 animate-pulse mb-1.5" />
                  <span className="text-[9px] uppercase font-black text-slate-300 tracking-wider">Available Points Balance</span>
                  <span className="text-2xl font-black mt-1 text-white">{referralStats?.referralPoints || 0} POINTS</span>
                  <span className="text-[11px] font-bold text-emerald-300 mt-1">₹{referralStats?.referralCredits || 0} Credit Value</span>
                </div>
              </div>

              {/* Stats & Invite Sharing Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Share referral code */}
                <div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4 text-left">
                  <h3 className="font-extrabold text-[#001c41] text-sm md:text-base tracking-tight">Your Unique Referral Link</h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Share your invite link with other local merchants in Udumalpet. When they register, make their subscription payment, and get approved, you'll earn 100 points!
                  </p>

                  <div className="flex gap-2.5 items-center mt-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={referralStats?.referralLink || ''} 
                      className="flex-grow border border-slate-200 px-4 py-3 rounded-xl text-xs font-extrabold text-slate-700 bg-slate-50 focus:outline-none"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(referralStats?.referralLink || '');
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="px-4 py-3 bg-[#027244] hover:bg-[#005934] text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                    </button>
                  </div>

                  {/* Social quick share links */}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wide">Quick Share:</span>
                    <a 
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Grow your business! Register on Udumalpet Business Trust (UBT) and get listed in the premium local directory. Use my link to register: " + (referralStats?.referralLink || ""))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-250 bg-emerald-50/50 hover:bg-emerald-55/20 rounded-lg text-xs font-black text-emerald-600 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Share on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Rewards Summary panel */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col justify-between text-left gap-4">
                  <h3 className="font-extrabold text-[#001c41] text-sm md:text-base tracking-tight">Referral Analytics</h3>
                  
                  <div className="flex flex-col gap-2 mt-1">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-xs font-semibold text-slate-500">Total Referrals</span>
                      <span className="text-xs font-extrabold text-slate-800">{referralStats?.referrals?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-xs font-semibold text-slate-500">Successful Claims</span>
                      <span className="text-xs font-extrabold text-[#027244]">
                        {referralStats?.referrals?.filter(r => r.status === 'completed').length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs font-semibold text-slate-500">Pending Approvals</span>
                      <span className="text-xs font-extrabold text-amber-600">
                        {referralStats?.referrals?.filter(r => r.status === 'pending').length || 0}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => openModalAtClickLevel(e, setShowRenewModal, 650)}
                    className="w-full py-3 bg-[#001c41] hover:bg-[#002d62] text-white text-xs font-extrabold rounded-xl transition-all shadow-sm cursor-pointer active:scale-98"
                  >
                    Redeem Available Credit
                  </button>
                </div>
              </div>

              {/* Steps & Point Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* How it works */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-5 text-left">
                  <h3 className="font-extrabold text-[#001c41] text-sm md:text-base tracking-tight">How It Works</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                    {[
                      { step: '01', title: 'Get Referral Link', desc: 'Login to your dashboard and get your unique referral link or code.' },
                      { step: '02', title: 'Share With Others', desc: 'Share your link with your friends, family or any business owner around you.' },
                      { step: '03', title: 'They Join UBT', desc: 'When they register and subscribe to any paid plan, the referral is successful.' },
                      { step: '04', title: 'You Earn Points', desc: 'You earn referral points (100 Points = ₹10 Credit) which you can redeem.' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <span className="h-7 w-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center font-extrabold text-emerald-600 text-xs shrink-0 select-none">
                          {item.step}
                        </span>
                        <div className="flex flex-col gap-0.5 text-left">
                          <h4 className="font-extrabold text-slate-800 text-xs">{item.title}</h4>
                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conversion Grid */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4 text-left">
                  <h3 className="font-extrabold text-[#001c41] text-sm md:text-base tracking-tight">Earn More, Save More</h3>
                  <div className="overflow-hidden border border-slate-100 rounded-xl mt-1">
                    <table className="w-full border-collapse text-xs font-semibold text-slate-600">
                      <thead className="bg-slate-50 border-b border-slate-100 text-[9.5px] uppercase font-black text-slate-400">
                        <tr>
                          <th className="p-3 text-left">Successful Referrals</th>
                          <th className="p-3 text-left">Points Earned</th>
                          <th className="p-3 text-left">Credit Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { refs: '1 Business', pts: '100 Points', val: '₹10 Credit' },
                          { refs: '5 Businesses', pts: '500 Points', val: '₹50 Credit' },
                          { refs: '10 Businesses', pts: '1000 Points', val: '₹100 Credit' },
                          { refs: '20 Businesses', pts: '2000 Points', val: '₹200 Credit' },
                          { refs: '50 Businesses', pts: '5000 Points', val: '₹500 Credit' }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3 font-extrabold text-slate-800">{row.refs}</td>
                            <td className="p-3 text-slate-500 font-semibold">{row.pts}</td>
                            <td className="p-3 text-[#027244] font-black">{row.val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Referral logs history */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4 text-left">
                <h3 className="font-extrabold text-[#001c41] text-sm md:text-base tracking-tight">Referrals Log</h3>
                
                {referralsLoading ? (
                  <div className="py-8 text-center text-slate-450 flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Syncing referrals log...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full border-collapse text-left text-xs font-semibold text-slate-650">
                      <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[9px] font-black text-slate-400 tracking-wider">
                        <tr>
                          <th className="p-4">Referred Merchant</th>
                          <th className="p-4">Business Listing</th>
                          <th className="p-4">Registered Date</th>
                          <th className="p-4">Rules Status</th>
                          <th className="p-4">Points Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {referralStats?.referrals?.map(r => {
                          const isCompleted = r.status === 'completed';
                          const isRejected = r.status === 'rejected';
                          const bizName = r.referredBusinessId?.name || 'Incomplete Draft';
                          const bizStatus = r.referredBusinessId?.status || 'Pending Vetting';
                          const subStatus = r.referredBusinessId?.subscriptionStatus || 'none';
                          
                          return (
                            <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 flex flex-col text-left">
                                <span className="font-extrabold text-slate-800 text-xs sm:text-[13px]">{r.referredUserId?.fullName || r.referredUserId?.name || 'Referred Merchant'}</span>
                                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{r.referredUserId?.email || r.referredUserId?.phone}</span>
                              </td>
                              <td className="p-4 font-bold text-slate-700">{bizName}</td>
                              <td className="p-4 text-slate-500 font-bold">
                                {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col gap-1 text-[10.5px]">
                                  <div className="flex items-center gap-1">
                                    <span>{r.referredBusinessId ? "✅ Business Registered" : "❌ Business Pending"}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span>{subStatus === 'active' ? "✅ Paid Subscription" : "❌ Subscription Pending"}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span>{bizStatus === 'Approved' ? "✅ Approved by Admin" : "❌ Approval Pending"}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`px-2.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border ${
                                  isCompleted
                                    ? 'bg-emerald-50 border-emerald-250 text-emerald-700'
                                    : isRejected
                                      ? 'bg-red-50 border-red-200 text-red-650'
                                      : 'bg-amber-50 border-amber-250 text-amber-600'
                                }`}>
                                  {isCompleted ? `+${r.points} Points` : isRejected ? '0 (Rejected)' : '0 (Pending)'}
                                </span>
                                {isRejected && r.rejectionReason && (
                                  <span className="text-[9px] text-red-500 font-semibold block mt-1.5 leading-normal max-w-xs">{r.rejectionReason}</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        {(!referralStats?.referrals || referralStats.referrals.length === 0) && (
                          <tr>
                            <td colSpan="5" className="p-8 text-center text-slate-400 text-xs font-bold leading-normal">
                              You haven't referred any businesses yet. Share your invite link above to start earning!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Subscription & Billing' && (
            <div className="flex flex-col gap-8 animate-fadeIn text-left font-sans text-[#001c41]">
              
              {/* Subscription Status Hero Banner */}
              <div className="bg-gradient-to-r from-[#001c41] to-[#027244] rounded-[32px] p-8 text-white relative overflow-hidden shadow flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 animate-fadeIn">
                <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
                <div className="flex flex-col gap-2.5 max-w-xl z-10 text-left">
                  <span className="bg-white/10 border border-white/20 text-emerald-300 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full w-fit">
                    Subscription Details
                  </span>
                  <h2 className="text-3xl font-black tracking-tight leading-tight">
                    Manage Your Business Subscription
                  </h2>
                  <p className="text-xs md:text-sm text-slate-200 font-medium leading-relaxed mt-1">
                    Your premium subscription ensures that your business listing is active, visible to customers, and allows you to post events for free.
                  </p>
                </div>
                
                {/* Subscription Badge */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 flex flex-col items-center justify-center shrink-0 min-w-[210px] z-10 shadow-md">
                  <CreditCard className="h-7 w-7 text-amber-300 mb-1.5" />
                  <span className="text-[9px] uppercase font-black text-slate-300 tracking-wider">Status</span>
                  <span className={`text-xl font-black mt-1 uppercase ${business?.subscriptionStatus === 'active' ? 'text-emerald-300 animate-pulse' : 'text-red-300'}`}>
                    {business?.subscriptionStatus === 'active' ? 'Active Pro' : 'Expired / Inactive'}
                  </span>
                  {business?.subscriptionExpiry && (
                    <span className="text-[11px] font-bold text-slate-200 mt-1">
                      {isExpired ? 'Expired' : `${daysLeft} Days Remaining`}
                    </span>
                  )}
                </div>
              </div>

              {/* Status details & billing renew trigger */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Plan Overview Card */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4 text-left">
                  <h3 className="font-extrabold text-[#001c41] text-sm md:text-base tracking-tight">Plan Summary</h3>
                  <div className="flex flex-col gap-2 mt-1">
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                      <span className="text-xs font-semibold text-slate-500">Plan Name</span>
                      <span className="text-xs font-extrabold text-slate-800 uppercase">
                        {business?.subscriptionPlan || (business?.subscriptionStatus === 'active' ? 'Pro Plan' : 'No Active Plan')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                      <span className="text-xs font-semibold text-slate-500">Start Date</span>
                      <span className="text-xs font-extrabold text-slate-800">
                        {business?.subscriptionStart ? new Date(business.subscriptionStart).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                      <span className="text-xs font-semibold text-slate-500">Expiry Date</span>
                      <span className="text-xs font-extrabold text-slate-800">
                        {business?.subscriptionExpiry ? new Date(business.subscriptionExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-xs font-semibold text-slate-500">Billing Interval</span>
                      <span className="text-xs font-extrabold text-slate-800">
                        {business?.subscriptionPlan?.toLowerCase().includes('year') ? 'Yearly' : 'Monthly'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Benefits / Pricing rules summary */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4 text-left">
                  <h3 className="font-extrabold text-[#001c41] text-sm md:text-base tracking-tight">Active Benefits</h3>
                  <ul className="flex flex-col gap-2.5 text-xs text-slate-650 font-semibold mt-1">
                    <li className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                      <span>Premium business public listing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                      <span className="text-emerald-700 font-extrabold">Free Event Postings (Normally ₹99/Event)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                      <span>WhatsApp Click-To-Chat Lead generation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                      <span>Review collection & Business Dashboards</span>
                    </li>
                  </ul>
                </div>

                {/* Quick actions panel */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col justify-between text-left gap-4">
                  <div>
                    <h3 className="font-extrabold text-[#001c41] text-sm md:text-base tracking-tight">Renew or Upgrade</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-2">
                      Renew your current plan or upgrade to get longer period validity. Apply your earned referral points at checkout to receive up to 10% discount.
                    </p>
                  </div>
                  <button 
                    onClick={(e) => openModalAtClickLevel(e, setShowRenewModal, 650)}
                    className="w-full py-3 bg-[#027244] hover:bg-[#005934] text-white text-xs font-extrabold rounded-xl transition-all shadow-sm cursor-pointer active:scale-98 text-center flex items-center justify-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Renew / Upgrade Subscription</span>
                  </button>
                </div>
              </div>

              {/* Payment history log */}
              <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4 text-left">
                <h3 className="font-extrabold text-[#001c41] text-sm md:text-base tracking-tight">Billing & Payment History</h3>
                
                {myPaymentsLoading ? (
                  <div className="py-8 text-center text-slate-450 flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="h-6 w-6 animate-spin text-[#027244]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Loading payment history...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full border-collapse text-left text-xs font-semibold text-slate-650">
                      <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[9px] font-black text-slate-450 tracking-wider">
                        <tr>
                          <th className="p-4">Billing Date</th>
                          <th className="p-4">Plan / Description</th>
                          <th className="p-4">Amount Paid</th>
                          <th className="p-4">Discount</th>
                          <th className="p-4">Order & Payment IDs</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {myPayments?.map(p => {
                          const isSuccess = p.paymentStatus === 'Paid' || p.status === 'Paid' || p.status === 'captured';
                          
                          return (
                            <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 text-slate-500 font-bold">
                                {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col text-left">
                                  <span className="font-extrabold text-slate-800 text-xs sm:text-[13px] uppercase">
                                    {p.subscriptionId?.planName || p.subscriptionId?.plan || (p.eventId ? 'Event Posting Fee' : 'Business Listing Subscription')}
                                  </span>
                                  {p.eventId && (
                                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate max-w-xs">
                                      Event: {p.eventId.title}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 font-black text-slate-800">
                                ₹{p.amount || 0}
                              </td>
                              <td className="p-4 text-emerald-600 font-bold">
                                {p.subscriptionId?.referralDiscount ? `₹${p.subscriptionId.referralDiscount}` : '₹0'}
                              </td>
                              <td className="p-4 font-mono text-[10px] text-slate-500">
                                <div className="flex flex-col gap-0.5">
                                  <span>O: {p.orderId || p.razorpayOrderId}</span>
                                  {p.paymentId && <span>P: {p.paymentId || p.razorpayPaymentId}</span>}
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`px-2.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border ${
                                  isSuccess
                                    ? 'bg-emerald-50 border-emerald-250 text-emerald-700'
                                    : 'bg-red-50 border-red-200 text-red-650'
                                }`}>
                                  {isSuccess ? 'Paid Success' : 'Failed'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                        {(!myPayments || myPayments.length === 0) && (
                          <tr>
                            <td colSpan="6" className="p-8 text-center text-slate-400 text-xs font-bold leading-normal">
                              No billing history records found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE MODALS */}
      {/* ========================================================================= */}

      {/* MODAL 1: Subscription Renewal with Razorpay */}
      {(showRenewModal || isMandatorySubscription) && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div 
            style={{ marginTop: `${modalMarginTop}px` }}
            className="max-w-4xl w-full bg-white border border-slate-200 shadow-2xl rounded-[32px] p-6 md:p-8 flex flex-col gap-6 animate-scaleUp text-left max-h-[90vh] overflow-y-auto scrollbar-none relative"
          >
            
            {/* Close button */}
            {!isMandatorySubscription && (
              <button 
                onClick={() => setShowRenewModal(false)} 
                className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 h-8 w-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors z-10"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            )}

            {isMandatorySubscription && (
              <div className="bg-emerald-50 border border-emerald-250 rounded-2xl p-4.5 text-xs text-[#027244] font-semibold flex items-start gap-2.5 shadow-sm animate-fadeIn">
                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-grow flex flex-col gap-1">
                  <span className="font-extrabold text-slate-800 text-xs">Congratulations! Verified by Admin</span>
                  <p className="text-slate-600 text-[10.5px] leading-relaxed">
                    Your business <strong>"{business?.name}"</strong> has been successfully vetted, approved, and verified by the administrators!
                  </p>
                  <p className="text-slate-500 text-[9.5px] leading-relaxed mt-1">
                    To list your business live in the public directory, capture customer calls, and activate your WhatsApp lead button, please select a subscription plan below.
                  </p>
                </div>
              </div>
            )}

            <div className="text-center flex flex-col items-center gap-1">
              <span className="text-[10px] font-black uppercase text-[#027244] tracking-wider">Premium Access</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#001c41] tracking-tight">Choose Your Plan</h2>
              <p className="text-xs text-slate-400 font-semibold max-w-md mt-1">Select the subscription package that best fits your business goals</p>
            </div>

            {/* Quick business & subscription stats overview banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full bg-[#F8FAFC] border border-slate-200/60 p-4.5 rounded-2xl">
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Current Plan</span>
                <span className={`text-xs font-black mt-1.5 w-fit px-2 py-0.5 rounded uppercase tracking-wide border ${
                  business?.subscriptionStatus === 'active' 
                    ? 'bg-emerald-50 text-[#027244] border-emerald-100' 
                    : 'bg-amber-50 text-amber-700 border-amber-200/60'
                }`}>
                  {business?.subscriptionStatus === 'active' ? 'Active Pro Plan' : 'Inactive Plan'}
                </span>
              </div>
              <div className="flex flex-col text-left sm:border-l sm:border-slate-200 sm:pl-4">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Listing Status</span>
                <span className={`text-xs font-black mt-1.5 w-fit px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                  business?.status === 'Approved'
                    ? 'bg-emerald-50 text-[#027244] border-emerald-100'
                    : 'bg-amber-50 text-amber-700 border-amber-200/60'
                }`}>
                  {business?.status || 'Pending Vetting'}
                </span>
              </div>
              <div className="flex flex-col text-left sm:border-l sm:border-slate-200 sm:pl-4">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Referral Points</span>
                <span className="text-xs font-extrabold text-slate-800 mt-1.5">
                  {referralStats?.referralPoints || 0} Points (₹{referralStats?.referralCredits || 0} Credits)
                </span>
              </div>
            </div>

            <>
            {referralStats && referralStats.referralPoints > 0 && (
              <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-2xl p-4.5 flex flex-col gap-3.5 max-w-md mx-auto w-full shadow-2xs mt-2 mb-2 transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-100/50 border border-emerald-250/30 rounded-xl flex items-center justify-center text-emerald-600 shadow-2xs">
                      <Gift className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col text-left font-sans">
                      <span className="text-xs font-extrabold text-slate-800">Redeem Referral Points</span>
                      <span className="text-[10px] text-slate-500 font-semibold mt-0.5">
                        Available: {referralStats.referralPoints} points (₹{referralStats.referralCredits})
                      </span>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={applyReferralPoints} 
                    onChange={(e) => handleApplyReferralPointsToggle(e.target.checked)}
                    className="h-5 w-5 border-slate-300 rounded-md text-emerald-600 focus:ring-emerald-500 cursor-pointer transition-colors"
                  />
                </div>

                {applyReferralPoints && (
                  <div className="pt-3 border-t border-dashed border-emerald-100 flex flex-col gap-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Points to Redeem</label>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-extrabold text-[#027244]">₹{(Number(redeemPointsAmount || 0) * 0.10).toFixed(2)}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">discount</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-grow">
                        <input
                          type="number"
                          min="0"
                          max={referralStats ? Math.min(referralStats.referralPoints, Math.round(getSelectedPlanPrice() * 0.1) * 10) : 0}
                          value={redeemPointsAmount}
                          onChange={handleRedeemPointsChange}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-xs font-extrabold text-slate-800 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-500/30 transition-all shadow-inner"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const maxRed = referralStats ? Math.min(referralStats.referralPoints, Math.round(getSelectedPlanPrice() * 0.1) * 10) : 0;
                            setRedeemPointsAmount(maxRed);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-250/40 text-[#027244] text-[9.5px] font-black px-2 py-1 rounded-lg uppercase tracking-wide transition-colors cursor-pointer"
                        >
                          Max
                        </button>
                      </div>
                    </div>

                    <span className="text-[9.5px] text-slate-400 font-semibold leading-relaxed text-left block">
                      You can redeem up to {referralStats ? Math.min(referralStats.referralPoints, Math.round(getSelectedPlanPrice() * 0.1) * 10) : 0} points for this plan. (1 point = ₹0.10)
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Toggle selector */}
            <div className="flex justify-center mt-2">
              <div className="bg-slate-100 border border-slate-200 p-1 rounded-full flex items-center gap-1 w-fit shadow-inner">
                {paymentPlans.map((p) => (
                  <button
                    key={p._id || p.id}
                    type="button"
                    onClick={() => handlePlanSelect(p.name)}
                    className={`py-2 px-6 rounded-full text-xs font-black transition-all cursor-pointer ${
                      selectedPlan === p.name
                        ? 'bg-[#027244] text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {p.name.replace(' Subscription', '').replace(' Plan', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 w-full">
              {paymentPlans.map((p) => {
                const isSelected = selectedPlan === p.name || (selectedPlan === 'Monthly' && p.type === 'Monthly') || (selectedPlan === 'Yearly' && p.type === 'Yearly');
                const defaultFeatures = [
                  'Digital Visiting Card',
                  'Dedicated Landing Page',
                  'Event Posting',
                  'Business Blog Publishing'
                ];
                const featuresToUse = defaultFeatures;

                return (
                  <div 
                    key={p._id || p.id}
                    onClick={() => handlePlanSelect(p.name)}
                    className={`bg-white border-2 rounded-[24px] p-6 flex flex-col justify-between items-center text-center shadow-md relative transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'border-[#027244] ring-2 ring-emerald-100 bg-emerald-50/5'
                        : 'border-slate-250 hover:border-[#027244]/50'
                    }`}
                  >
                    {/* Popular / Offer Badge */}
                    {(p.isOffer || p.type === 'Yearly') && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#027244] text-white text-[9px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow">
                        {p.type === 'Yearly' && !p.isOffer ? 'Most Popular' : (p.offerText || 'Special Offer')}
                      </div>
                    )}

                    {/* Ribbon */}
                    {p.isOffer && p.offerText && (
                      <div className="absolute top-0 right-0 overflow-hidden w-24 h-24 pointer-events-none rounded-tr-3xl">
                        <div className="absolute top-4 -right-8 w-28 bg-amber-400 text-slate-900 font-extrabold text-[8px] tracking-wider py-1.5 uppercase text-center rotate-45 shadow-sm">
                          {p.offerText}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col items-center gap-4 w-full">
                      {/* Icon */}
                      <div className="h-12 w-12 rounded-full bg-emerald-50 border border-emerald-100 text-[#027244] flex items-center justify-center shadow-inner">
                        <Calendar className="h-5.5 w-5.5" />
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <h3 className="font-extrabold text-slate-800 text-base">{p.name}</h3>
                        <div className="flex items-baseline justify-center gap-1.5 mt-1">
                          <span className="text-3xl font-extrabold text-[#001c41]">
                            ₹{getDiscountedPrice(p.price)}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">/ {p.durationDays} Days</span>
                        </div>
                        {p.type === 'Yearly' && (
                          <div className="flex items-center justify-center gap-2 text-[10px] font-black mt-0.5">
                            <span className="text-slate-400 line-through">₹{monthlyPrice * 12}</span>
                            <span className="text-[#027244] bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5">Save ₹{(monthlyPrice * 12) - p.price}</span>
                          </div>
                        )}
                        {p.description && (
                          <p className="text-[11px] text-slate-400 font-semibold mt-1">{p.description}</p>
                        )}
                      </div>
                      
                      <div className="w-full border-t border-dashed border-slate-200 my-2" />
                      
                      {/* Features */}
                      <div className="flex flex-col gap-3.5 items-start w-full px-2 text-xs text-slate-655 font-semibold">
                        {featuresToUse.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2.5 text-left">
                            <CheckCircle className="h-4 w-4 text-[#027244] shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePaymentCheckout(p.name);
                      }}
                      className={`mt-8 py-3 transition-all w-full rounded-xl font-extrabold text-xs cursor-pointer shadow-md active:scale-98 ${
                        isSelected
                          ? 'bg-[#027244] hover:bg-[#005934] text-white'
                          : 'bg-white hover:bg-emerald-50 border border-[#027244] text-[#027244] hover:text-[#005934]'
                      }`}
                    >
                      {paymentLoading && selectedPlan === p.name ? 'Initializing...' : `Start ${p.type} Plan`}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Everything You Get Bottom Section */}
            <div className="w-full border-t border-slate-100 pt-6 mt-4 flex flex-col gap-4 text-center">
              <h3 className="font-extrabold text-[#001c41] text-sm md:text-base tracking-tight">Everything You Get</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {[
                  {
                    icon: <CreditCard className="h-5 w-5 text-[#027244]" />,
                    title: 'Digital Visiting Card',
                    desc: 'Professional digital profile with all your business information and contact details.'
                  },
                  {
                    icon: <Globe className="h-5 w-5 text-[#027244]" />,
                    title: 'Dedicated Landing Page',
                    desc: 'Your own business page with a unique link to share with customers.'
                  },
                  {
                    icon: <Calendar className="h-5 w-5 text-[#027244]" />,
                    title: 'Event Posting',
                    desc: 'Promote your events, offers, workshops and get more visibility.'
                  },
                  {
                    icon: <BookOpen className="h-5 w-5 text-[#027244]" />,
                    title: 'Business Blog Publishing',
                    desc: 'Write blogs about your business, share knowledge and build trust.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-4 flex flex-col items-center text-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 text-[#027244] flex items-center justify-center shadow-xs">
                      {item.icon}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-extrabold text-slate-800 text-xs leading-snug">{item.title}</span>
                      <span className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>

          </div>
        </div>
      )}

      {/* MODAL 1.5: Google My Business Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-md w-full bg-white border border-slate-200 shadow-2xl rounded-[32px] p-6 md:p-8 flex flex-col gap-6 animate-scaleUp text-left relative">
            
            {/* Close button */}
            <button 
              onClick={() => {
                setShowVerifyModal(false);
                setVerifyError('');
                setVerifySuccess('');
                setVerifyPlaceId('');
              }} 
              className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 h-8 w-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors z-10"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="flex flex-col gap-2">
              <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-inner">
                <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.8 17 5 19 5a1 1 0 0 1 1 1z" fill="currentColor" />
                  <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 tracking-tight mt-2">Verify Your Business Listing</h3>
              <p className="text-slate-550 text-xs font-semibold leading-relaxed">
                Provide your Google Place ID to link your Google Business Profile. We will check that the addresses match and instantly verify your profile.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Google Place ID</label>
                <input
                  type="text"
                  placeholder="e.g. ChIJnUv03E3NqTsRHR_zk-gs78w"
                  value={verifyPlaceId}
                  onChange={(e) => setVerifyPlaceId(e.target.value)}
                  className="py-3 px-4 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold w-full focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                />
              </div>

              {verifyError && (
                <div className="bg-red-50 border border-red-200 text-red-650 rounded-2xl p-4 text-xs font-semibold flex items-start gap-2.5 shadow-sm animate-shake">
                  <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                  <span>{verifyError}</span>
                </div>
              )}

              {verifySuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 text-xs font-semibold flex items-start gap-2.5 shadow-sm animate-fadeIn">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{verifySuccess}</span>
                </div>
              )}

              <button
                type="button"
                disabled={verifyLoading || !verifyPlaceId}
                onClick={handleVerifyGoogleBusiness}
                className="py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-emerald-700/20 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {verifyLoading ? 'Verifying...' : 'Verify & Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Profile Details Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div 
            style={{ marginTop: `${modalMarginTop}px` }}
            className="max-w-2xl w-full bg-white border border-slate-200 shadow-2xl rounded-[32px] p-6 md:p-8 flex flex-col gap-5 animate-scaleUp text-left max-h-[85vh] overflow-y-auto scrollbar-none font-sans"
          >
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Edit Business Details</h3>
                <p className="text-slate-400 text-[10px] font-semibold mt-1">Keep your entire business profile up-to-date.</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 font-extrabold text-xs cursor-pointer p-1">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Nested Subtabs inside the modal */}
            <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
              {[
                { id: 'general', label: 'General Info' },
                { id: 'about', label: 'About & Highlights' },
                { id: 'contact', label: 'Contact & Location' },
                { id: 'specs', label: 'Specifications & Hours' },
                { id: 'services', label: 'Services & Media' }
              ].map(subTab => (
                <button
                  type="button"
                  key={subTab.id}
                  onClick={() => setEditTab(subTab.id)}
                  className={`py-2 px-3 text-[10.5px] font-black uppercase tracking-wider border-b-2 shrink-0 cursor-pointer transition-all ${
                    editTab === subTab.id ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {subTab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-5 mt-2">
              
              {/* TAB: GENERAL */}
              {editTab === 'general' && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Business Name</label>
                    <input 
                      type="text" 
                      value={editFields.name}
                      onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                      placeholder="e.g. Sri Murugan Stores"
                      required
                      className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Main Category */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Main Category</label>
                      <select 
                        value={availableCategories.includes(editFields.requestedParentCategory) ? editFields.requestedParentCategory : (editFields.requestedParentCategory ? 'Others' : '')}
                        onChange={(e) => {
                          const parentVal = e.target.value;
                          let subVal = '';
                          
                          if (parentVal && parentVal !== 'Others') {
                            const subs = parentCategoryMapping[parentVal] || [];
                            subVal = subs[0] || '';
                          } else if (parentVal === 'Others') {
                            subVal = 'Others';
                          }

                          setEditFields({
                            ...editFields,
                            requestedParentCategory: parentVal === 'Others' ? '' : parentVal,
                            category: subVal,
                            customCategoryName: '',
                            categoryStatus: parentVal === 'Others' ? 'Pending Review' : 'Normal'
                          });
                        }}
                        className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20 cursor-pointer"
                      >
                        <option value="">-- Choose Main Category --</option>
                        {availableCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Subcategory */}
                    {editFields.requestedParentCategory !== '' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Subcategory</label>
                        <select 
                          value={(parentCategoryMapping[availableCategories.includes(editFields.requestedParentCategory) ? editFields.requestedParentCategory : 'Others'] || []).includes(editFields.category) ? editFields.category : (editFields.category ? 'Others' : '')}
                          onChange={(e) => {
                            const subVal = e.target.value;
                            const isCustomParent = !availableCategories.includes(editFields.requestedParentCategory);
                            setEditFields({
                              ...editFields,
                              category: subVal,
                              customCategoryName: '',
                              categoryStatus: (subVal === 'Others' || isCustomParent) ? 'Pending Review' : 'Normal'
                            });
                          }}
                          className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20 cursor-pointer"
                        >
                          <option value="">-- Choose Subcategory --</option>
                          {(parentCategoryMapping[availableCategories.includes(editFields.requestedParentCategory) ? editFields.requestedParentCategory : 'Others'] || []).map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                          <option value="Others">Others (Custom Category)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Custom Input Rows if selected "Others" */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Specify Custom Main Category */}
                    {(editFields.requestedParentCategory === '' || !availableCategories.includes(editFields.requestedParentCategory)) && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Specify Custom Main Category</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Tourism Services"
                          value={availableCategories.includes(editFields.requestedParentCategory) ? '' : editFields.requestedParentCategory}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditFields({
                              ...editFields,
                              requestedParentCategory: val,
                              category: 'Others',
                              categoryStatus: 'Pending Review'
                            });
                          }}
                          className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                        />
                      </div>
                    )}

                    {/* Specify Custom Subcategory */}
                    {editFields.category === 'Others' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Specify Custom Subcategory</label>
                        <input 
                          type="text" 
                          placeholder="e.g. EV Charging Station"
                          value={editFields.customCategoryName || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditFields({
                              ...editFields,
                              customCategoryName: val,
                              categoryStatus: 'Pending Review'
                            });
                          }}
                          className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                        />
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB: ABOUT & HIGHLIGHTS */}
              {editTab === 'about' && (
                <div className="flex flex-col gap-5 animate-fadeIn">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Business Description</label>
                    <textarea 
                      rows={5}
                      value={editFields.description}
                      onChange={(e) => setEditFields({ ...editFields, description: e.target.value })}
                      placeholder="Describe your business, services, and unique value..."
                      required
                      className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20 resize-none leading-relaxed"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Verified Highlights (Green Ticks)</label>
                    <input
                      type="text"
                      value={editFields.highlights}
                      onChange={(e) => setEditFields({ ...editFields, highlights: e.target.value })}
                      placeholder="e.g. On-time Service, Expert Technicians, Quality Materials, Affordable Pricing"
                      className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                    />
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Enter comma-separated highlights shown as green verified badges under your business description.</p>
                  </div>
                  {/* Preview */}
                  {editFields.highlights && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Preview</span>
                      <div className="flex flex-wrap gap-2">
                        {editFields.highlights.split(',').map(h => h.trim()).filter(Boolean).map((tag, i) => (
                          <span key={i} className="bg-emerald-50/50 border border-emerald-100 text-emerald-700 text-[10px] font-bold py-1.5 px-3 rounded-xl flex items-center gap-1.5">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: CONTACT & LOCATION */}
              {editTab === 'contact' && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Phone Number</label>
                      <input 
                        type="text" 
                        value={editFields.phone}
                        onChange={(e) => setEditFields({ ...editFields, phone: e.target.value })}
                        placeholder="e.g. +91 94430 12345"
                        required
                        className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">WhatsApp Number</label>
                      <input 
                        type="text" 
                        value={editFields.whatsapp}
                        onChange={(e) => setEditFields({ ...editFields, whatsapp: e.target.value })}
                        placeholder="e.g. +91 94430 12345"
                        className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Email Address</label>
                      <input 
                        type="email" 
                        value={editFields.email}
                        onChange={(e) => setEditFields({ ...editFields, email: e.target.value })}
                        placeholder="e.g. store@gmail.com"
                        className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Website Address</label>
                      <input 
                        type="text" 
                        value={editFields.website}
                        onChange={(e) => setEditFields({ ...editFields, website: e.target.value })}
                        placeholder="e.g. www.store.in"
                        className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Facebook URL</label>
                      <input 
                        type="text" 
                        value={editFields.facebook || ''}
                        onChange={(e) => setEditFields({ ...editFields, facebook: e.target.value })}
                        placeholder="e.g. facebook.com/store"
                        className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Instagram URL</label>
                      <input 
                        type="text" 
                        value={editFields.instagram || ''}
                        onChange={(e) => setEditFields({ ...editFields, instagram: e.target.value })}
                        placeholder="e.g. instagram.com/store"
                        className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Street / Block / Address</label>
                    <input 
                      type="text" 
                      value={editFields.address}
                      onChange={(e) => setEditFields({ ...editFields, address: e.target.value })}
                      placeholder="e.g. Gandhi Nagar Main Road, Udumalpet"
                      required
                      className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Locality</label>
                      <input 
                        type="text" 
                        value={editFields.locality}
                        onChange={(e) => setEditFields({ ...editFields, locality: e.target.value })}
                        placeholder="e.g. Gandhi Nagar"
                        required
                        className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Pincode</label>
                      <input 
                        type="text" 
                        value={editFields.pincode}
                        onChange={(e) => setEditFields({ ...editFields, pincode: e.target.value })}
                        placeholder="e.g. 642126"
                        required
                        className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SPECIFICATIONS & HOURS */}
              {editTab === 'specs' && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Year of Establishment</label>
                      <input 
                        type="number" 
                        value={editFields.yearEstablished}
                        onChange={(e) => setEditFields({ ...editFields, yearEstablished: e.target.value })}
                        placeholder="e.g. 2012"
                        className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Employee Count</label>
                      <input 
                        type="text" 
                        value={editFields.employeeCount}
                        onChange={(e) => setEditFields({ ...editFields, employeeCount: e.target.value })}
                        placeholder="e.g. 10 - 20"
                        className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Languages Known</label>
                      <input 
                        type="text" 
                        value={editFields.languagesKnown}
                        onChange={(e) => setEditFields({ ...editFields, languagesKnown: e.target.value })}
                        placeholder="e.g. Tamil, English"
                        className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">GST Number</label>
                      <input 
                        type="text" 
                        value={editFields.gstNumber}
                        onChange={(e) => setEditFields({ ...editFields, gstNumber: e.target.value })}
                        placeholder="e.g. 33ABCDE1234F1Z5"
                        className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Service Area Limits</label>
                    <input 
                      type="text" 
                      value={editFields.serviceArea}
                      onChange={(e) => setEditFields({ ...editFields, serviceArea: e.target.value })}
                      placeholder="e.g. Udumalpet, Pollachi, Palladam, Madathukulam"
                      className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                    />
                  </div>

                  {/* Business Hours Timing inputs */}
                  <div className="flex flex-col gap-2.5 mt-2 border-t border-slate-100 pt-4">
                    <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest">Daily Operating Timings</span>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
                      {[
                        { day: 'Mon', key: 'timingsMon' },
                        { day: 'Tue', key: 'timingsTue' },
                        { day: 'Wed', key: 'timingsWed' },
                        { day: 'Thu', key: 'timingsThu' },
                        { day: 'Fri', key: 'timingsFri' },
                        { day: 'Sat', key: 'timingsSat' },
                        { day: 'Sun', key: 'timingsSun' }
                      ].map(dayObj => (
                        <div key={dayObj.key} className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-black text-slate-450 uppercase">{dayObj.day}</label>
                          <input
                            type="text"
                            value={editFields[dayObj.key]}
                            onChange={(e) => setEditFields({ ...editFields, [dayObj.key]: e.target.value })}
                            placeholder="e.g. 9:00 AM - 8:00 PM"
                            className="w-full border border-slate-200 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-700 focus:outline-none bg-slate-50/50"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SERVICES & MEDIA */}
              {editTab === 'services' && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Services Offered (Comma Separated)</label>
                    <textarea 
                      rows={3}
                      value={editFields.services}
                      onChange={(e) => setEditFields({ ...editFields, services: e.target.value })}
                      placeholder="e.g. Home Wiring, Electrical Repairs, CCTV Setup"
                      className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20 resize-none leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Brands Authorized (Comma Separated)</label>
                    <input 
                      type="text" 
                      value={editFields.brands}
                      onChange={(e) => setEditFields({ ...editFields, brands: e.target.value })}
                      placeholder="e.g. Havells, Finolex, Legrand, Syska"
                      className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                    />
                  </div>

                  {/* Upload Error display */}
                  {uploadError && (
                    <div className="p-3 bg-red-50 text-red-700 border border-red-200 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2 animate-fadeIn">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Logo Image Direct Upload */}
                  <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
                    <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Business Logo</label>
                    <div className="flex items-center gap-4.5">
                      <div className="h-16 w-16 rounded-2xl border-2 border-slate-200 overflow-hidden shrink-0 bg-slate-55 flex items-center justify-center relative group">
                        <img 
                          src={editFields.logoUrl || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150&q=80"} 
                          alt="Logo Preview" 
                          className="h-full w-full object-cover"
                        />
                        {logoUploading && (
                          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                            <RefreshCw className="h-5 w-5 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5 text-left">
                        <label className="bg-white border border-slate-250 hover:bg-slate-50 text-slate-700 font-extrabold text-[10.5px] py-2.5 px-4.5 rounded-xl cursor-pointer shadow-3xs inline-flex items-center gap-1.5">
                          <Plus className="h-3.5 w-3.5" />
                          <span>{logoUploading ? 'Uploading...' : 'Choose File'}</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleDashboardImageUpload(e, 'logoUrl')} 
                            className="hidden" 
                            disabled={logoUploading}
                          />
                        </label>
                        <span className="text-[9.5px] text-slate-400 font-semibold">Square JPG/PNG (Max 5MB)</span>
                      </div>
                    </div>
                  </div>

                  {/* Cover Image Direct Upload */}
                  <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
                    <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Profile Cover Image</label>
                    <div className="flex flex-col gap-3">
                      <div className="h-32 w-full rounded-2xl border border-slate-200 overflow-hidden bg-slate-55 relative flex items-center justify-center">
                        <img 
                          src={editFields.coverImageUrl || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80"} 
                          alt="Cover Preview" 
                          className="w-full h-full object-cover"
                        />
                        {coverUploading && (
                          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                            <RefreshCw className="h-6 w-6 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="bg-white border border-slate-250 hover:bg-slate-50 text-slate-700 font-extrabold text-[10.5px] py-2.5 px-4.5 rounded-xl cursor-pointer shadow-3xs inline-flex items-center gap-1.5">
                          <Plus className="h-3.5 w-3.5" />
                          <span>{coverUploading ? 'Uploading...' : 'Upload Cover File'}</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleDashboardImageUpload(e, 'coverImageUrl')} 
                            className="hidden" 
                            disabled={coverUploading}
                          />
                        </label>
                        <span className="text-[9.5px] text-slate-400 font-semibold">Landscape landscape works best (Max 5MB)</span>
                      </div>
                    </div>
                  </div>

                  {/* Gallery Images Multi-Upload Grid */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Store / Work Photos</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-1">
                      {/* Existing Uploaded Gallery Previews */}
                      {editFields.galleryUrls 
                        ? editFields.galleryUrls.split(',').map(s => s.trim()).filter(Boolean).map((url, idx) => (
                          <div key={idx} className="h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-55 relative group">
                            <img src={url} alt="Gallery item" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const currentUrls = editFields.galleryUrls.split(',').map(s => s.trim()).filter(Boolean);
                                const updated = currentUrls.filter((_, uIdx) => uIdx !== idx);
                                setEditFields({ ...editFields, galleryUrls: updated.join(', ') });
                              }}
                              className="absolute top-1 right-1 h-5 w-5 bg-red-650 hover:bg-red-750 text-white rounded-full flex items-center justify-center shadow transition-colors cursor-pointer border-none"
                              title="Delete photo"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))
                        : null
                      }

                      {/* Add Gallery Photos Dropzone/Selector */}
                      <label className={`h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-550 flex flex-col items-center justify-center text-center cursor-pointer p-2 gap-1 transition-all bg-slate-50/30 ${galleryUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                        {galleryUploading ? (
                          <RefreshCw className="h-5 w-5 text-emerald-600 animate-spin" />
                        ) : (
                          <>
                            <Plus className="h-5 w-5 text-slate-400" />
                            <span className="text-[9.5px] font-black text-slate-450 uppercase tracking-wide">Add Photos</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          onChange={(e) => handleDashboardImageUpload(e, 'galleryUrls')} 
                          className="hidden" 
                          disabled={galleryUploading}
                        />
                      </label>
                    </div>
                    <span className="text-[9.5px] text-slate-400 font-semibold mt-1">Select one or more store images to upload directly (Max 5MB per file)</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-4 border-t border-slate-100 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[11px] rounded-xl cursor-pointer uppercase tracking-wide transition-colors"
                >
                  Cancel
                </button>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={editTab === 'general'}
                    onClick={() => {
                      const tabs = ['general', 'about', 'contact', 'specs', 'services'];
                      const idx = tabs.indexOf(editTab);
                      if (idx > 0) setEditTab(tabs[idx - 1]);
                    }}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-extrabold text-[11px] rounded-xl cursor-pointer uppercase tracking-wide transition-all flex items-center gap-1"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Back
                  </button>

                  <button
                    type="button"
                    disabled={editTab === 'services'}
                    onClick={() => {
                      const tabs = ['general', 'about', 'contact', 'specs', 'services'];
                      const idx = tabs.indexOf(editTab);
                      if (idx < tabs.length - 1) setEditTab(tabs[idx + 1]);
                    }}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-extrabold text-[11px] rounded-xl cursor-pointer uppercase tracking-wide transition-all flex items-center gap-1"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </button>

                  <button 
                    type="submit"
                    className="py-3 px-6 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[11px] rounded-xl cursor-pointer shadow-md shadow-emerald-800/10 uppercase tracking-wide transition-colors"
                  >
                    Save Details
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Branch Modal */}
      {showBranchModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white border border-slate-200 shadow-2xl rounded-[32px] p-6 md:p-8 flex flex-col gap-5 animate-scaleUp text-left max-h-[85vh] overflow-y-auto scrollbar-none font-sans">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">{editingBranch ? 'Edit Branch' : 'Add New Branch'}</h3>
                <p className="text-slate-400 text-[10px] font-semibold mt-1">Provide branch details below. Edited or new branches will require admin approval.</p>
              </div>
              <button onClick={() => setShowBranchModal(false)} className="text-slate-400 hover:text-slate-600 font-extrabold text-xs cursor-pointer p-1">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {branchFormError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{branchFormError}</span>
              </div>
            )}

            <form onSubmit={handleBranchSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Branch Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={branchForm.name}
                    onChange={handleBranchFormChange}
                    placeholder="e.g. Sri Murugan Stores - Eripalayam"
                    required
                    className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Contact Number</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={branchForm.phone}
                    onChange={handleBranchFormChange}
                    placeholder="e.g. +91 94430 12345"
                    required
                    className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Branch Manager Name (Optional)</label>
                  <input 
                    type="text" 
                    name="branchManagerName"
                    value={branchForm.branchManagerName}
                    onChange={handleBranchFormChange}
                    placeholder="e.g. John Doe"
                    className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Working Hours</label>
                  <input 
                    type="text" 
                    name="workingHours"
                    value={branchForm.workingHours}
                    onChange={handleBranchFormChange}
                    placeholder="e.g. 9:00 AM - 8:00 PM"
                    className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                  />
                </div>
              </div>

              {/* Use MockGoogleMaps component for address search & autocomplete */}
              <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100 flex flex-col gap-4">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Location & Coordinates</span>
                
                <MockGoogleMaps 
                  pincode={business?.pincode || '642126'}
                  initialAddress={branchForm.address}
                  onAddressSelect={handleBranchAddressSelect}
                />

                <div className="flex flex-col gap-1 mt-1">
                  <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Full Address (Fallback / Display)</label>
                  <textarea 
                    name="address"
                    value={branchForm.address}
                    onChange={handleBranchFormChange}
                    placeholder="Type branch address..."
                    required
                    rows={2}
                    className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Latitude</label>
                    <input 
                      type="number" 
                      step="any"
                      name="latitude"
                      value={branchForm.latitude}
                      onChange={handleBranchFormChange}
                      required
                      className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Longitude</label>
                    <input 
                      type="number" 
                      step="any"
                      name="longitude"
                      value={branchForm.longitude}
                      onChange={handleBranchFormChange}
                      required
                      className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Google Maps Location Link (Optional)</label>
                  <input 
                    type="url" 
                    name="googleMapsLocation"
                    value={branchForm.googleMapsLocation}
                    onChange={handleBranchFormChange}
                    placeholder="e.g. https://maps.google.com/?q=..."
                    className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest">Google Business Profile Link (Optional)</label>
                  <input 
                    type="url" 
                    name="googleBusinessLink"
                    value={branchForm.googleBusinessLink}
                    onChange={handleBranchFormChange}
                    placeholder="e.g. https://business.google.com/r/..."
                    className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:ring-1 focus:ring-emerald-100 bg-slate-50/20"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end border-t border-slate-100 pt-4 mt-2">
                <button 
                  type="button" 
                  onClick={() => setShowBranchModal(false)}
                  className="px-6 py-3 border border-slate-250 hover:bg-slate-50 text-slate-500 font-extrabold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={branchSubmitLoading}
                  className="bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs py-3 px-8 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {branchSubmitLoading && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingBranch ? 'Save Changes' : 'Register Branch'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Photos Gallery & Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div 
            style={{ marginTop: `${modalMarginTop}px` }}
            className="max-w-lg w-full bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 flex flex-col gap-5 animate-scaleUp text-left"
          >
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Upload Photos & Media</h3>
                <p className="text-slate-400 text-[10px] font-semibold mt-1">Upload photos to show off your products and store environment.</p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600 font-extrabold text-xs cursor-pointer p-1">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Drag and Drop Zone */}
            <form onSubmit={handlePhotoUpload} className="flex flex-col gap-4">
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-extrabold text-slate-800 block">Drag and drop your photos here</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">Or click to select files from your computer (PNG, JPG, max 5MB)</span>
                </div>
                <input 
                  type="file" 
                  multiple
                  className="hidden" 
                  id="file-selector"
                  onChange={handleGalleryFileUpload}
                />
                <label 
                  htmlFor="file-selector"
                  className="mt-1 py-1.5 px-4 border border-slate-200 rounded-lg text-[10.5px] font-extrabold text-slate-600 hover:bg-white transition-colors shadow-2xs cursor-pointer select-none"
                >
                  Choose Files
                </label>
              </div>

              {/* Photos Gallery Listing */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest leading-none">
                  Currently Uploaded ({uploadedPhotosCount} Photos)
                </span>
                
                <div className="grid grid-cols-4 gap-2.5">
                  {photoGallery.map((img, i) => (
                    <div key={i} className="h-16 rounded-xl overflow-hidden border border-slate-200 relative group select-none">
                      <img src={img} alt="Store" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                        <button 
                          type="button"
                          onClick={() => {
                            setPhotoGallery(photoGallery.filter((_, idx) => idx !== i));
                            setUploadedPhotosCount(prev => Math.max(prev - 1, 0));
                          }}
                          className="h-6 w-6 rounded bg-red-650 hover:bg-red-700 text-white flex items-center justify-center shadow-xs cursor-pointer transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <label 
                    htmlFor="file-selector"
                    className="h-16 border-2 border-dashed border-slate-200 rounded-xl hover:border-emerald-300 transition-colors flex items-center justify-center text-slate-400 hover:text-emerald-600 bg-slate-50/50 cursor-pointer shadow-2xs"
                  >
                    {uploadLoading ? <RefreshCw className="h-5 w-5 animate-spin text-emerald-600" /> : <Plus className="h-5 w-5" />}
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-2 border-t border-slate-100 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[10.5px] rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button 
                  type="submit"
                  disabled={uploadLoading}
                  className="py-2.5 px-6 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer shadow-md shadow-emerald-800/10 flex items-center gap-1.5 disabled:opacity-60"
                >
                  {uploadLoading && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>Save Media Gallery</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Dashboard Write Blog Post Modal */}
      {showWriteBlogModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 flex flex-col gap-5 animate-scaleUp text-left max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">
                  {editingBlogId ? 'Edit & Correct Blog Post' : 'Write a Blog Post'}
                </h3>
                <p className="text-slate-450 text-[10px] font-semibold mt-1">
                  {editingBlogId 
                    ? 'Refine title, update media cover or body text and re-submit for admin audit.'
                    : 'Publish local insights, travel tips, culinary reviews, or farming advice.'}
                </p>
              </div>
              <button 
                onClick={handleCloseWriteBlogModal} 
                className="text-slate-400 hover:text-slate-600 font-extrabold p-1 cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {blogSuccess ? (
              <div className="bg-emerald-50 border border-emerald-250 rounded-2xl p-5 flex flex-col items-center gap-4 text-center py-8">
                <CheckCircle className="h-12 w-12 text-emerald-600 animate-bounce" />
                <div className="flex flex-col gap-1">
                  <span className="font-extrabold text-slate-800 text-sm">Blog Successfully Submitted!</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">{blogSuccess}</p>
                </div>
                <button 
                  onClick={handleCloseWriteBlogModal}
                  className="mt-2 py-2 px-6 bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Close Wizard
                </button>
              </div>
            ) : (
              <form onSubmit={handleWriteBlogDashboard} className="flex flex-col gap-4">
                
                {blogError && (
                  <div className="bg-red-50 border border-red-200 text-red-650 rounded-xl p-3 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />
                    <span>{blogError}</span>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Blog Title</label>
                  <input 
                    type="text" 
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="e.g. Traditional Food Messes in Udumalpet"
                    required
                    maxLength={100}
                    className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20"
                  />
                </div>

                {/* Category Selection Dropdown */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Category</label>
                  <select
                    value={blogCategory}
                    onChange={(e) => {
                      setBlogCategory(e.target.value);
                      if (e.target.value !== 'Other') {
                        setBlogCategoryOther('');
                      }
                    }}
                    className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20 cursor-pointer"
                  >
                    {[
                      'Business Tips',
                      'Local Guide',
                      'Lifestyle',
                      'Events',
                      'Technology',
                      'Health & Wellness',
                      'Education',
                      'Travel',
                      'Food & Culture'
                    ].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Other">Other (Type custom category...)</option>
                  </select>
                </div>

                {blogCategory === 'Other' && (
                  <div className="flex flex-col gap-1 animate-fadeIn">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Custom Category Name</label>
                    <input 
                      type="text" 
                      value={blogCategoryOther}
                      onChange={(e) => setBlogCategoryOther(e.target.value)}
                      placeholder="e.g. Traditional Farming"
                      required
                      maxLength={30}
                      className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20"
                    />
                    
                    {/* Auto-suggest if it matches existing */}
                    {(() => {
                      const trimmed = blogCategoryOther.trim();
                      if (!trimmed) return null;
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
                                setBlogCategory(matched);
                                setBlogCategoryOther('');
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
                  
                  {blogCover ? (
                    <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 p-2 flex items-center justify-between gap-3 group">
                      <div className="flex items-center gap-3">
                        <img 
                          src={blogCover} 
                          alt="Cover preview" 
                          className="h-14 w-20 object-cover rounded-lg border border-slate-200/60 shadow-2xs"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">Cover Image Selected</span>
                          <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[200px]">{blogCover}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBlogCover('')}
                        className="p-2 hover:bg-red-50 text-slate-450 hover:text-red-650 rounded-xl transition-colors cursor-pointer border-none flex items-center justify-center shrink-0"
                        title="Remove Image"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ) : (
                    <div className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 transition-colors bg-slate-50/20 ${blogImageUploading ? 'border-emerald-300 bg-emerald-50/5' : 'border-slate-200 hover:bg-slate-50/40'}`}>
                      {blogImageUploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <RefreshCw className="h-7 w-7 text-[#027244] animate-spin" />
                          <span className="text-[11px] font-bold text-slate-500">Uploading image to secure storage...</span>
                        </div>
                      ) : (
                        <>
                          <div className="h-9 w-9 bg-slate-50 text-slate-500 border border-slate-100 rounded-xl flex items-center justify-center shadow-3xs">
                            <Upload className="h-4.5 w-4.5" />
                          </div>
                          <div className="text-center flex flex-col items-center">
                            <span className="text-xs font-extrabold text-slate-700">Choose a cover image</span>
                            <span className="text-[10px] text-slate-455 font-bold mt-0.5">PNG, JPG, JPEG, WEBP (Max 5MB)</span>
                          </div>
                          <input 
                            type="file" 
                            accept="image/*"
                            id="dashboard-blog-image-upload"
                            onChange={handleBlogImageUpload}
                            className="hidden"
                          />
                          <label 
                            htmlFor="dashboard-blog-image-upload"
                            className="py-1.5 px-4 border border-slate-200 hover:border-slate-300 rounded-xl text-[10.5px] font-extrabold text-slate-600 hover:bg-white transition-all cursor-pointer shadow-3xs hover:shadow-2xs select-none"
                          >
                            Select File
                          </label>
                        </>
                      )}
                    </div>
                  )}

                  {blogImageError && (
                    <span className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {blogImageError}
                    </span>
                  )}
                </div>

                 <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Blog Content</label>
                  <textarea 
                    rows={6}
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    placeholder="Describe your article insights in rich detail..."
                    required
                    className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20 resize-none leading-relaxed"
                  />
                </div>

                {editingBlogId && (
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Message to Moderator (Optional)</label>
                    <input 
                      type="text" 
                      value={blogSubmitNote}
                      onChange={(e) => setBlogSubmitNote(e.target.value)}
                      placeholder="Explain your changes to the review team (e.g. Fixed typo in first paragraph)"
                      className="w-full border border-slate-200/70 p-3 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-1 border-t border-slate-100 pt-4">
                  <button 
                    type="button"
                    onClick={handleCloseWriteBlogModal}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-755 font-extrabold text-[10.5px] rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={blogWriteLoading || blogImageUploading}
                    className="py-2.5 px-6 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer shadow-md shadow-emerald-800/10 flex items-center gap-2 disabled:opacity-60"
                  >
                    {(blogWriteLoading || blogImageUploading) && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                    <span>{editingBlogId ? 'Save & Re-submit' : 'Submit Blog Post'}</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* MODAL 3: List New Event Modal */}
      {showCreateEventModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 flex flex-col gap-4 animate-scaleUp text-left max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">List a New Event</h3>
                <p className="text-slate-400 text-[10px] font-semibold mt-1">Announce match updates, summits, expos, or training camps.</p>
              </div>
              <button 
                onClick={() => {
                  setShowCreateEventModal(false);
                  setEventError('');
                  setEventSuccess('');
                }} 
                className="text-slate-400 hover:text-slate-600 font-extrabold text-xs cursor-pointer p-1"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {business && business.subscriptionStatus === 'active' ? (
              <div className="bg-emerald-50 border border-emerald-250 rounded-2xl p-4 text-[10.5px] text-[#027244] font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Active Premium Subscription detected! You can list this event for 100% Free (no standard ₹99 charge).</span>
              </div>
              ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-[10.5px] text-amber-800 font-semibold flex items-center gap-2 animate-pulse">
                <Info className="h-4 w-4 text-amber-600 shrink-0" />
                <span>No active premium subscription detected. A standard ₹99 publishing fee applies to launch this event.</span>
              </div>
            )}

            {eventSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fadeIn">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                <span>{eventSuccess}</span>
              </div>
            )}

            {eventError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2 shadow-sm animate-shake">
                <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />
                <span>{eventError}</span>
              </div>
            )}

            {!eventSuccess && (
              <form onSubmit={handleCreateEventDashboard} className="flex flex-col gap-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Event Title *</label>
                    <input 
                      type="text" 
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      placeholder="e.g. Udumalpet Marathon 2026"
                      required
                      className="w-full border border-slate-200/70 p-2.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Category *</label>
                    <select 
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value)}
                      className="w-full border border-slate-200/70 p-2.5 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20 cursor-pointer"
                    >
                      {['Sports', 'Festival', 'Business', 'Music', 'Education', 'Health', 'Others'].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {eventCategory === 'Others' && (
                  <div className="flex flex-col gap-1 animate-fadeIn">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Custom Category Name *</label>
                    <input 
                      type="text" 
                      value={customEventCategory}
                      onChange={(e) => setCustomEventCategory(e.target.value)}
                      placeholder="e.g. Workshop, Seminar, Conference"
                      required
                      className="w-full border border-slate-200/70 p-2.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Start Date *</label>
                    <input 
                      type="date" 
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                      className="w-full border border-slate-200/70 p-2.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">End Date *</label>
                    <input 
                      type="date" 
                      value={eventEndDate}
                      onChange={(e) => setEventEndDate(e.target.value)}
                      required
                      className="w-full border border-slate-200/70 p-2.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Duration *</label>
                    <input 
                      type="text" 
                      value={eventDuration}
                      onChange={(e) => setEventDuration(e.target.value)}
                      placeholder="e.g. 1 Day, 3 Hours"
                      required
                      className="w-full border border-slate-200/70 p-2.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Organizer Name *</label>
                  <input 
                    type="text" 
                    value={eventOrganizer}
                    onChange={(e) => setEventOrganizer(e.target.value)}
                    placeholder="e.g. Sports Club"
                    required
                    className="w-full border border-slate-200/70 p-2.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-1 border-t border-slate-100 pt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowCreateEventModal(false);
                      setEventError('');
                    }}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-755 font-extrabold text-[10.5px] rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={eventSubmitLoading}
                    className="py-2.5 px-6 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer shadow-md shadow-emerald-800/10 flex items-center gap-2 disabled:opacity-60"
                  >
                    {eventSubmitLoading && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                    <span>{business && business.subscriptionStatus === 'active' ? 'Publish Event for Free' : 'Publish & Pay ₹99'}</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* MODAL 5: Pay & Complete Event Listing Modal */}
      {showCompleteEventModal && completeEvent && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white border border-slate-200 shadow-2xl rounded-3xl p-7 flex flex-col gap-5 animate-scaleUp text-left max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-3.5">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base md:text-lg">
                  List Your Event - {completeEventStep === 1 ? 'Secure Checkout' : 'Additional Details'}
                </h3>
                <p className="text-slate-450 text-[10.5px] font-semibold mt-1">
                  {completeEventStep === 1 
                    ? 'Step 1 of 2: Complete the listing charge to verify and unlock detail submission.' 
                    : 'Step 2 of 2: Provide location, contact info, optional registration link, and cover image.'}
                </p>
              </div>
              <button 
                onClick={() => {
                  if (completeEventStep === 1) {
                    handleCancelEventPayment(completeEvent._id);
                  }
                  setShowCompleteEventModal(false);
                  setCompleteEvent(null);
                }} 
                className="text-slate-400 hover:text-slate-600 font-extrabold text-xs cursor-pointer p-1"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {completeEventError && (
              <div className="bg-red-50 border border-red-200 text-red-650 rounded-xl p-3 text-xs font-semibold flex items-center gap-2 animate-shake">
                <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />
                <span>{completeEventError}</span>
              </div>
            )}

            {completeEventSuccess && (
              <div className="bg-emerald-50 border border-emerald-250 rounded-xl p-3 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                <span>{completeEventSuccess}</span>
              </div>
            )}

            {/* STEP 1: PAYMENT CHECKOUT */}
            {completeEventStep === 1 && !completeEventSuccess && (
              <div className="flex flex-col gap-5">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-[11px] text-amber-850 font-semibold flex items-center gap-2.5">
                  <Info className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                  <span>No active premium business subscription detected. A standard ₹99 publishing fee applies.</span>
                </div>

                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 flex justify-between items-center text-xs font-bold shadow-3xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-slate-800 font-extrabold text-sm">{completeEvent.title}</span>
                    <span className="text-slate-450 uppercase text-[9.5px] mt-0.5 tracking-wider">{completeEvent.category} Event</span>
                  </div>
                  <span className="text-[#027244] font-black text-xl">₹99</span>
                </div>

                <div className="flex flex-col gap-3.5 text-xs text-slate-600 font-semibold">
                  <div className="flex items-center gap-2.5 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                    <Lock className="h-4.5 w-4.5 text-[#027244] shrink-0" />
                    <span className="text-[10px] text-emerald-800 leading-normal">Your payment is encrypted and fully secure. Standard charges apply.</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400">Listing Standard Fee</span>
                    <span>₹99.00</span>
                  </div>
                  <div className="flex justify-between text-slate-850 font-black text-sm pt-1">
                    <span>Grand Total</span>
                    <span>₹99.00</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-2 border-t border-slate-100 pt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      if (completeEventStep === 1) {
                        handleCancelEventPayment(completeEvent._id);
                      }
                      setShowCompleteEventModal(false);
                      setCompleteEvent(null);
                    }}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[10.5px] rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                   <button 
                    type="button"
                    onClick={() => handleEventPaymentSkip(completeEvent._id)}
                    disabled={completeEventLoading}
                    className="py-2.5 px-4 bg-amber-50 hover:bg-amber-100 border border-amber-250 text-amber-800 font-extrabold text-[10.5px] rounded-xl cursor-pointer transition-colors disabled:opacity-50"
                  >
                    Skip Now
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleEventPaymentCheckout(completeEvent._id)}
                    disabled={completeEventLoading}
                    className="py-2.5 px-6 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    {completeEventLoading && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                    <span>Pay ₹99 & Continue</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ADDITIONAL DETAILS WITH COVER IMAGE UPLOAD */}
            {completeEventStep === 2 && !completeEventSuccess && (
              <form onSubmit={handlePublishEventDetails} className="flex flex-col gap-4">
                
                {/* PAYMENT VERIFIED BADGE */}
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-[10.5px] text-[#027244] font-semibold">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-amber-500 fill-current shrink-0" />
                    <span>Payment verified successfully! Please fill in further details to publish your event.</span>
                  </div>
                  <span className="bg-[#027244] text-white font-black text-[9px] uppercase tracking-wider px-2.5 py-1 rounded shadow-2xs">
                    {completeEventPaymentStatus} verified
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Location / Venue Address *</label>
                  <input 
                    type="text" 
                    value={completeEventVenue}
                    onChange={(e) => setCompleteEventVenue(e.target.value)}
                    placeholder="e.g. Sri Krishna Mahal, Palani Road, Udumalpet"
                    required
                    className="w-full border border-slate-200/70 p-2.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Helpline Phone *</label>
                    <input 
                      type="tel" 
                      value={completeEventPhone}
                      onChange={(e) => setCompleteEventPhone(e.target.value)}
                      placeholder="e.g. +91 98422 33445"
                      required
                      className="w-full border border-slate-200/70 p-2.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Registration / Payment Link (Optional)</label>
                    <input 
                      type="url" 
                      value={completeEventPaymentLink}
                      onChange={(e) => setCompleteEventPaymentLink(e.target.value)}
                      placeholder="e.g. https://tickets.udumalpetevents.in"
                      className="w-full border border-slate-200/70 p-2.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Registration Fee / Ticket Price (₹) *</label>
                    <input 
                      type="number" 
                      min="0"
                      value={completeEventPrice}
                      onChange={(e) => setCompleteEventPrice(Number(e.target.value))}
                      placeholder="e.g. 0 for Free, 99 for Ticket"
                      required
                      className="w-full border border-slate-200/70 p-2.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Event Timings / Hours *</label>
                    <input 
                      type="text" 
                      value={completeEventTime}
                      onChange={(e) => setCompleteEventTime(e.target.value)}
                      placeholder="e.g. Sunday, 6:00 AM"
                      required
                      className="w-full border border-slate-200/70 p-2.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] bg-slate-50/20"
                    />
                  </div>
                </div>

                {/* COVER IMAGE UPLOAD (MANDATORY REQUIREMENT FROM USER SPEC) */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Cover Image</label>
                  
                  {completeEventCoverUrl ? (
                    <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 p-2 flex items-center justify-between gap-3 group">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img 
                          src={completeEventCoverUrl} 
                          alt="Cover preview" 
                          className="h-14 w-20 object-cover rounded-lg border border-slate-200/60 shadow-2xs"
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-xs font-bold text-slate-700">Cover Image Selected</span>
                          <span className="text-[10px] text-slate-400 font-semibold truncate">{completeEventCoverUrl}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCompleteEventCoverUrl('')}
                        className="p-2 hover:bg-red-50 text-slate-450 hover:text-red-650 rounded-xl transition-colors cursor-pointer border-none flex items-center justify-center shrink-0"
                        title="Remove Image"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ) : (
                    <div className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 transition-colors bg-slate-50/20 ${completeEventImageUploading ? 'border-emerald-300 bg-emerald-50/5' : 'border-slate-200 hover:bg-slate-50/40'}`}>
                      {completeEventImageUploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <RefreshCw className="h-7 w-7 text-[#027244] animate-spin" />
                          <span className="text-[11px] font-bold text-slate-500">Uploading cover image...</span>
                        </div>
                      ) : (
                        <>
                          <div className="h-9 w-9 bg-slate-50 text-slate-500 border border-slate-100 rounded-xl flex items-center justify-center shadow-3xs">
                            <Upload className="h-4.5 w-4.5" />
                          </div>
                          <div className="text-center flex flex-col items-center">
                            <span className="text-xs font-extrabold text-slate-700">Upload cover image</span>
                            <span className="text-[10px] text-slate-455 font-bold mt-0.5">PNG, JPG, JPEG, WEBP (Max 5MB)</span>
                          </div>
                          <input 
                            type="file" 
                            accept="image/*"
                            id="complete-event-image-upload"
                            onChange={handleEventCoverUpload}
                            className="hidden"
                          />
                          <label 
                            htmlFor="complete-event-image-upload"
                            className="py-1.5 px-4 border border-slate-200 hover:border-slate-300 rounded-xl text-[10.5px] font-extrabold text-slate-600 hover:bg-white transition-all cursor-pointer shadow-3xs hover:shadow-2xs select-none"
                          >
                            Select File
                          </label>
                        </>
                      )}
                    </div>
                  )}

                  {completeEventImageError && (
                    <span className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {completeEventImageError}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Event Description *</label>
                  <textarea 
                    rows={4}
                    value={completeEventDescription}
                    onChange={(e) => setCompleteEventDescription(e.target.value)}
                    placeholder="Provide detailed description of schedules, guidelines, guest details, etc..."
                    required
                    className="w-full border border-slate-200/70 p-2.5 rounded-xl text-xs font-semibold text-slate-755 focus:outline-none focus:border-[#027244] bg-slate-50/20 resize-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-between items-center mt-2 border-t border-slate-100 pt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowCompleteEventModal(false);
                      setCompleteEvent(null);
                    }}
                    className="py-2.5 px-5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-[10.5px] rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={completeEventLoading || completeEventImageUploading}
                    className="py-2.5 px-6 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer shadow-md shadow-emerald-800/10 flex items-center gap-2 disabled:opacity-60"
                  >
                    {completeEventLoading && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                    <span>Complete & Launch Event</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* MODAL 6: Add / Edit Menu Item Modal */}
      {showMenuItemModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-md w-full bg-white border border-slate-200 shadow-2xl rounded-[32px] p-6 md:p-8 flex flex-col gap-6 animate-scaleUp text-left relative">
            
            <button 
              onClick={() => {
                setShowMenuItemModal(false);
                resetMenuItemForm();
              }} 
              className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 h-8 w-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors z-10"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="flex flex-col gap-2">
              <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-inner">
                <Utensils className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 tracking-tight mt-2">
                {currentMenuItem ? 'Edit Menu Item' : 'Add Food Menu Item'}
              </h3>
              <p className="text-slate-550 text-xs font-semibold leading-relaxed">
                {currentMenuItem 
                  ? 'Update details, pricing, discount, and availability status of this food item.' 
                  : 'Add a new food dish or drink to your business profile digital menu.'}
              </p>
            </div>

            <form onSubmit={handleMenuSubmit} className="flex flex-col gap-4">
              
              {menuItemError && (
                <div className="bg-red-50 border border-red-250 text-red-655 rounded-xl p-3 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />
                  <span>{menuItemError}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Item Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Masala Dosa, Chicken Biryani"
                  value={menuItemName}
                  onChange={(e) => setMenuItemName(e.target.value)}
                  required
                  className="py-3 px-4 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold w-full focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Original Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 150"
                    value={menuItemPrice}
                    onChange={(e) => setMenuItemPrice(e.target.value)}
                    required
                    className="py-3 px-4 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold w-full focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Offer Price (₹) (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 120"
                    value={menuItemOfferPrice}
                    onChange={(e) => setMenuItemOfferPrice(e.target.value)}
                    className="py-3 px-4 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold w-full focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Menu Category *</label>
                  <select
                    value={isCustomCategory ? 'Others' : menuItemCategory}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'Others') {
                        setIsCustomCategory(true);
                        setMenuItemCategory('');
                      } else {
                        setIsCustomCategory(false);
                        setMenuItemCategory(val);
                      }
                    }}
                    className="py-3 px-4 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold w-full focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 cursor-pointer"
                  >
                    {menuCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Others">Others (Type Custom...)</option>
                  </select>

                  {isCustomCategory && (
                    <input
                      type="text"
                      placeholder="Enter custom category"
                      value={customCategoryName}
                      onChange={(e) => {
                        setCustomCategoryName(e.target.value);
                        setMenuItemCategory(e.target.value);
                      }}
                      className="mt-2 py-2.5 px-4 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold w-full focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Diet Type *</label>
                  <div className="flex items-center gap-4 py-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-655 cursor-pointer">
                      <input
                        type="radio"
                        name="menuItemIsVeg"
                        checked={menuItemIsVeg === true}
                        onChange={() => setMenuItemIsVeg(true)}
                        className="h-4.5 w-4.5 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span>Veg</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-655 cursor-pointer">
                      <input
                        type="radio"
                        name="menuItemIsVeg"
                        checked={menuItemIsVeg === false}
                        onChange={() => setMenuItemIsVeg(false)}
                        className="h-4.5 w-4.5 text-red-655 focus:ring-rose-500 cursor-pointer"
                      />
                      <span>Non-Veg</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Item Description (Optional) removed */}

              <div className="flex items-center gap-2.5 py-1 text-left">
                <input
                  type="checkbox"
                  id="menuItemIsAvailable"
                  checked={menuItemIsAvailable}
                  onChange={(e) => setMenuItemIsAvailable(e.target.checked)}
                  className="h-5 w-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="menuItemIsAvailable" className="text-xs font-bold text-slate-705 cursor-pointer select-none">
                  Available & In Stock
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenuItemModal(false);
                    resetMenuItemForm();
                  }}
                  className="py-2.5 px-5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-[10.5px] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={menuItemSubmitLoading}
                  className="py-2.5 px-6 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer shadow-md shadow-emerald-800/10 flex items-center gap-2 disabled:opacity-60"
                >
                  {menuItemSubmitLoading && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>{currentMenuItem ? 'Save Changes' : 'Add to Menu'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="py-32 flex flex-col items-center justify-center gap-3 text-slate-400 animate-pulse min-h-screen bg-slate-50">
        <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
        <span className="text-xs font-bold">Loading your workspace...</span>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
