import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Grid, Shield, Heart, Phone, Users, Star, ArrowRight, Check, ShieldCheck,
  ChevronLeft, ChevronRight, HelpCircle, Eye, MessageSquare, Play, Sparkles, X, Gift, Rocket,
  Hotel, Store, Wrench, HeartPulse, GraduationCap, Home as HouseIcon, Car, LayoutGrid,
  FileEdit, PhoneCall, Smile, Users2, Tv, Utensils, Building, ShoppingBag, Factory, 
  Briefcase, Compass, Sprout, CreditCard, Dumbbell
} from 'lucide-react';

const mockFeatured = [
  {
    _id: 'featured_1',
    name: 'Sri Murugan Stores',
    category: 'Departmental Stores',
    locality: 'Gandhi Nagar, Udumalpet',
    googleRating: 4.6,
    googleReviewsCount: 128,
    isPremium: true,
    isAddressVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80',
    phone: '+91 94430 12345',
    whatsapp: '+91 94430 12345',
    highlights: ['Quality Products', 'Good Service', 'Fair Prices'],
  },
  {
    _id: 'featured_2',
    name: 'Green Valley Hotel',
    category: 'Hotels & Restaurants',
    locality: 'Pollachi Road, Udumalpet',
    googleRating: 4.8,
    googleReviewsCount: 98,
    isPremium: true,
    isAddressVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
    phone: '+91 98945 99999',
    whatsapp: '+91 98945 99999',
    highlights: ['Pure Veg', 'Family Restaurant', 'AC Rooms'],
  },
  {
    _id: 'featured_3',
    name: 'R.K. Electricals',
    category: 'Electrical Services',
    locality: 'Pollachi Road, Udumalpet',
    googleRating: 4.7,
    googleReviewsCount: 84,
    isPremium: true,
    isAddressVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80',
    phone: '+91 98945 43100',
    whatsapp: '+91 98945 43100',
    highlights: ['On-time Service', 'Expert Technicians', 'Quality Materials'],
  },
  {
    _id: 'featured_4',
    name: 'City Hospital',
    category: 'Hospitals',
    locality: 'Udumalpet',
    googleRating: 4.5,
    googleReviewsCount: 206,
    isPremium: true,
    isAddressVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=500&q=80',
    phone: '+91 4252 223456',
    whatsapp: '+91 98425 22345',
    highlights: ['24x7 Service', 'Experienced Doctors', 'Pharmacy'],
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [categoryTerm, setCategoryTerm] = useState('All Categories');
  const [featuredBusinesses, setFeaturedBusinesses] = useState(mockFeatured);
  const [activeFaq, setActiveFaq] = useState(null);
  const faqScrollRef = useRef(null);
  const testimonialScrollRef = useRef(null);

  // Testimonials state
  const fallbackTestimonials = [
    {
      _id: 'mock_t_1',
      authorName: 'Karthik S.',
      role: 'Business Owner',
      rating: 5,
      text: 'Udumalpet Business Tour helped me get more local customers. The enquiries and calls have increased significantly. Highly recommended for all local businesses!'
    },
    {
      _id: 'mock_t_2',
      authorName: 'Aravind Swamy',
      role: 'Event Manager',
      rating: 5,
      text: 'Promoting local temple events and trade expos has never been this seamless. The user reach in Udumalpet and surrounding suburbs is absolutely incredible.'
    },
    {
      _id: 'mock_t_3',
      authorName: 'Deepa Ramakrishnan',
      role: 'Blog Writer',
      rating: 5,
      text: 'Writing about local hidden gems and historic places near Udumalpet has finally found the perfect audience. A beautifully optimized directory app!'
    }
  ];

  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  // Modal and submission state
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    authorName: '',
    role: 'Business Owner',
    text: '',
    rating: 5
  });
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [categoriesList, setCategoriesList] = useState([
    { 
      name: 'Hotels', 
      icon: (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="2" width="16" height="20" rx="2" fill="#E6F2ED" stroke="#027244" strokeWidth="2" />
          <rect x="7" y="5" width="3" height="3" rx="0.5" fill="#001c41" />
          <rect x="14" y="5" width="3" height="3" rx="0.5" fill="#001c41" />
          <rect x="7" y="10" width="3" height="3" rx="0.5" fill="#001c41" />
          <rect x="14" y="10" width="3" height="3" rx="0.5" fill="#001c41" />
          <path d="M9 16h6v6H9v-6z" fill="#027244" />
        </svg>
      ), 
      path: '/businesses?category=Hotels' 
    },
    { 
      name: 'Shops', 
      icon: (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9l1-5h16l1 5v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" fill="#E6F2ED" stroke="#027244" strokeWidth="2" />
          <path d="M3 9h18L20 4H4L3 9z" fill="#027244" />
          <path d="M6 9v2m4-2v2m4-2v2m4-2v2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="8" y="14" width="8" height="8" fill="#001c41" rx="1" />
        </svg>
      ), 
      path: '/businesses?category=Shops' 
    },
    { 
      name: 'Services', 
      icon: (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.7 4.3a3 3 0 00-4.2 0L12 7.8 7.8 3.6a3 3 0 00-4.2 4.2L7.8 12l-4.2 4.2a3 3 0 104.2 4.2L12 16.2l4.2 4.2a3 3 0 004.2-4.2L16.2 12l4.2-4.2a3 3 0 000-4.2z" fill="#E6F2ED" />
          <path d="M19.7 4.3a3 3 0 00-4.2 0L12 7.8 7.8 3.6a3 3 0 00-4.2 4.2l3.5 3.5-6.4 6.4a2 2 0 102.8 2.8l6.4-6.4 3.5 3.5a3 3 0 004.2-4.2L16.2 12l3.5-3.5a3 3 0 000-4.2z" stroke="#027244" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3" fill="#001c41" />
        </svg>
      ), 
      path: '/businesses?category=Services' 
    },
    { 
      name: 'Health', 
      icon: (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#E6F2ED" stroke="#027244" strokeWidth="2" />
          <path d="M12 6v10M7 11h10" stroke="#001c41" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ), 
      path: '/businesses?category=Health' 
    },
    { 
      name: 'Education', 
      icon: (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3L1 9l11 6 11-6-11-6z" fill="#027244" />
          <path d="M5 12.5V17c0 1.66 3.13 3 7 3s7-1.34 7-3v-4.5" fill="#E6F2ED" stroke="#027244" strokeWidth="2" />
          <path d="M17 11.5v5.5M12 15v5" stroke="#001c41" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ), 
      path: '/businesses?category=Education' 
    },
    { 
      name: 'Real Estate', 
      icon: (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 10.5V20a2 2 0 002 2h14a2 2 0 002-2v-9.5" fill="#E6F2ED" stroke="#027244" strokeWidth="2" />
          <path d="M12 3L2 12h3v8h14v-8h3L12 3z" fill="#027244" />
          <rect x="9" y="13" width="6" height="7" fill="#001c41" />
        </svg>
      ), 
      path: '/businesses?category=Real%20Estate' 
    },
    { 
      name: 'Automotive', 
      icon: (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 8h-1V5a2 2 0 00-2-2H8a2 2 0 00-2 2v3H5a3 3 0 00-3 3v6a2 2 0 002 2h1v2a2 2 0 002 2h1a2 2 0 002-2v-2h8v2a2 2 0 002 2h1a2 2 0 002-2v-2h1a2 2 0 002-2v-6a3 3 0 00-3-3z" fill="#E6F2ED" stroke="#027244" strokeWidth="2" />
          <rect x="5" y="10" width="14" height="4" fill="#001c41" rx="1" />
          <circle cx="6.5" cy="16.5" r="1.5" fill="#fff" />
          <circle cx="17.5" cy="16.5" r="1.5" fill="#fff" />
        </svg>
      ), 
      path: '/businesses?category=Automotive' 
    },
    { 
      name: 'More', 
      icon: (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#027244" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#001c41" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#001c41" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#027244" />
        </svg>
      ), 
      path: '/businesses?focus=categories' 
    }
  ]);

  useEffect(() => {
    const fetchFeaturedAndCounts = async () => {
      // 1. Fetch featured premium businesses
      try {
        const res = await fetch('http://localhost:5000/api/businesses?type=Premium');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setFeaturedBusinesses(data.data.slice(0, 4));
        }
      } catch (err) {
        console.warn('Backend server offline, running fallback featured businesses sync.');
      }

      // 2. Fetch all businesses to calculate category counts dynamically
      try {
        const res = await fetch('http://localhost:5000/api/businesses');
        const data = await res.json();
        if (data.success) {
          const counts = {};
          const availableCategories = [
            'Automotive', 'Beauty & Wellness', 'Education', 'Electronics', 'Food & Restaurants',
            'Health & Medical', 'Home Services', 'Real Estate', 'Shopping', 'Manufacturing',
            'Professional Services', 'Travel & Hospitality', 'Construction', 'Agriculture',
            'Finance & Insurance', 'Events & Entertainment', 'Sports & Fitness', 'Others'
          ];
          availableCategories.forEach(c => {
            counts[c] = 0;
          });
          data.data.forEach(biz => {
            if (counts[biz.category] !== undefined) {
              counts[biz.category]++;
            } else {
              counts[biz.category] = 1;
            }
          });
          updateDynamicCategories(counts);
        }
      } catch (err) {
        console.warn('API error, using standard fallback category counts.');
        const mockCounts = {
          'Automotive': 125,
          'Beauty & Wellness': 98,
          'Education': 87,
          'Electronics': 112,
          'Food & Restaurants': 156,
          'Health & Medical': 84,
          'Home Services': 142,
          'Real Estate': 76,
          'Shopping': 138,
          'Manufacturing': 64,
          'Professional Services': 118,
          'Travel & Hospitality': 61,
          'Construction': 92,
          'Agriculture': 53,
          'Finance & Insurance': 49,
          'Events & Entertainment': 57,
          'Sports & Fitness': 41,
          'Others': 38
        };
        updateDynamicCategories(mockCounts);
      }
    };

    const updateDynamicCategories = (counts) => {
      const availableCategories = [
        'Automotive', 'Beauty & Wellness', 'Education', 'Electronics', 'Food & Restaurants',
        'Health & Medical', 'Home Services', 'Real Estate', 'Shopping', 'Manufacturing',
        'Professional Services', 'Travel & Hospitality', 'Construction', 'Agriculture',
        'Finance & Insurance', 'Events & Entertainment', 'Sports & Fitness', 'Others'
      ];

      const iconMap = {
        'Automotive': (
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 8h-1V5a2 2 0 00-2-2H8a2 2 0 00-2 2v3H5a3 3 0 00-3 3v6a2 2 0 002 2h1v2a2 2 0 002 2h1a2 2 0 002-2v-2h8v2a2 2 0 002 2h1a2 2 0 002-2v-2h1a2 2 0 002-2v-6a3 3 0 00-3-3z" fill="#E6F2ED" stroke="#027244" strokeWidth="2" />
            <rect x="5" y="10" width="14" height="4" fill="#001c41" rx="1" />
            <circle cx="6.5" cy="16.5" r="1.5" fill="#fff" />
            <circle cx="17.5" cy="16.5" r="1.5" fill="#fff" />
          </svg>
        ),
        'Beauty & Wellness': <Sparkles className="h-7 w-7 text-pink-500" />,
        'Education': (
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L1 9l11 6 11-6-11-6z" fill="#027244" />
            <path d="M5 12.5V17c0 1.66 3.13 3 7 3s7-1.34 7-3v-4.5" fill="#E6F2ED" stroke="#027244" strokeWidth="2" />
            <path d="M17 11.5v5.5M12 15v5" stroke="#001c41" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
        'Electronics': <Tv className="h-7 w-7 text-emerald-500" />,
        'Food & Restaurants': (
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="2" width="16" height="20" rx="2" fill="#E6F2ED" stroke="#027244" strokeWidth="2" />
            <rect x="7" y="5" width="3" height="3" rx="0.5" fill="#001c41" />
            <rect x="14" y="5" width="3" height="3" rx="0.5" fill="#001c41" />
            <rect x="7" y="10" width="3" height="3" rx="0.5" fill="#001c41" />
            <rect x="14" y="10" width="3" height="3" rx="0.5" fill="#001c41" />
            <path d="M9 16h6v6H9v-6z" fill="#027244" />
          </svg>
        ),
        'Health & Medical': (
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#E6F2ED" stroke="#027244" strokeWidth="2" />
            <path d="M12 6v10M7 11h10" stroke="#001c41" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ),
        'Home Services': <HouseIcon className="h-7 w-7 text-teal-600" />,
        'Real Estate': (
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 10.5V20a2 2 0 002 2h14a2 2 0 002-2v-9.5" fill="#E6F2ED" stroke="#027244" strokeWidth="2" />
            <path d="M12 3L2 12h3v8h14v-8h3L12 3z" fill="#027244" />
            <rect x="9" y="13" width="6" height="7" fill="#001c41" />
          </svg>
        ),
        'Shopping': (
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9l1-5h16l1 5v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" fill="#E6F2ED" stroke="#027244" strokeWidth="2" />
            <path d="M3 9h18L20 4H4L3 9z" fill="#027244" />
            <path d="M6 9v2m4-2v2m4-2v2m4-2v2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="8" y="14" width="8" height="8" fill="#001c41" rx="1" />
          </svg>
        ),
        'Manufacturing': <Factory className="h-7 w-7 text-slate-600" />,
        'Professional Services': <Briefcase className="h-7 w-7 text-emerald-600" />,
        'Travel & Hospitality': <Compass className="h-7 w-7 text-purple-600" />,
        'Construction': <Wrench className="h-7 w-7 text-orange-600" />,
        'Agriculture': <Sprout className="h-7 w-7 text-green-600" />,
        'Finance & Insurance': <CreditCard className="h-7 w-7 text-blue-600" />,
        'Events & Entertainment': <Sparkles className="h-7 w-7 text-pink-500" />,
        'Sports & Fitness': <Dumbbell className="h-7 w-7 text-emerald-600" />,
        'Others': <LayoutGrid className="h-7 w-7 text-slate-500" />
      };

      const sorted = availableCategories
        .map(name => ({
          name,
          count: counts[name] || 0,
          icon: iconMap[name] || <LayoutGrid className="h-7 w-7 text-slate-500" />,
          path: `/businesses?category=${encodeURIComponent(name)}`
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 7);

      // 8th item is More pointing to Explore Categories
      sorted.push({
        name: 'More',
        icon: (
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#027244" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#001c41" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#001c41" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#027244" />
          </svg>
        ),
        path: '/businesses?focus=categories'
      });

      setCategoriesList(sorted);
    };

    const fetchTestimonials = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/testimonials');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          const merged = [...data.data];
          if (merged.length < 3) {
            fallbackTestimonials.forEach(fb => {
              if (merged.length < 3 && !merged.some(t => t.authorName === fb.authorName)) {
                merged.push(fb);
              }
            });
          }
          setTestimonials(merged);
        }
      } catch (err) {
        console.warn('Backend server offline, using fallback testimonials.');
      }
    };

    fetchFeaturedAndCounts();
    fetchTestimonials();

    // Check if the URL has ?testimonial=true and the user is logged in
    const params = new URLSearchParams(window.location.search);
    if (params.get('testimonial') === 'true') {
      const token = localStorage.getItem('ubt_token');
      if (token) {
        let loggedInName = '';
        let loggedInRole = 'Viewer';
        try {
          const storedUser = localStorage.getItem('ubt_user');
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            loggedInName = parsed.fullName || parsed.name || '';
            if (parsed.role === 'owner') {
              loggedInRole = 'Business Owner';
            } else if (parsed.role === 'editor' || parsed.role === 'blog_writer') {
              loggedInRole = 'Blog Writer';
            } else if (parsed.role === 'event_manager') {
              loggedInRole = 'Event Manager';
            } else if (parsed.role === 'viewer' || parsed.role === 'user') {
              loggedInRole = 'Viewer';
            }
          }
        } catch (e) {
          console.warn('Failed to parse ubt_user details:', e);
        }
        setNewTestimonial({
          authorName: loggedInName,
          role: loggedInRole,
          text: '',
          rating: 5,
        });
        setIsTestimonialModalOpen(true);
        navigate('/', { replace: true });
      }
    }
  }, [navigate]);

  const handlePrevTestimonial = () => {
    if (testimonials.length === 0) return;
    setTestimonialIdx(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    if (testimonials.length === 0) return;
    setTestimonialIdx(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleScrollFaqs = (direction) => {
    if (!faqScrollRef.current) return;
    const scrollAmount = direction === 'left' ? -350 : 350;
    faqScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleScrollTestimonials = (direction) => {
    if (!testimonialScrollRef.current) return;
    const scrollAmount = direction === 'left' ? -360 : 360;
    testimonialScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess('');
    setSubmitError('');
    setSubmitting(true);

    if (!newTestimonial.authorName.trim() || !newTestimonial.text.trim()) {
      setSubmitError('Please enter your name and thoughts.');
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('ubt_token');
      const res = await fetch('http://localhost:5000/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTestimonial),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess('Thank you! Your testimonial has been submitted and is pending administrator verification.');
        setNewTestimonial({
          authorName: '',
          role: 'Business Owner',
          text: '',
          rating: 5,
        });
        setTimeout(() => {
          setIsTestimonialModalOpen(false);
          setSubmitSuccess('');
        }, 3500);
      } else {
        setSubmitError(data.message || 'Failed to submit testimonial.');
      }
    } catch (err) {
      // Mock local queue submission for offline demo
      setSubmitSuccess('Offline Demo Mode: Review sent to Admin approval desk queue!');
      setNewTestimonial({
        authorName: '',
        role: 'Business Owner',
        text: '',
        rating: 5,
      });
      setTimeout(() => {
        setIsTestimonialModalOpen(false);
        setSubmitSuccess('');
      }, 3500);
    } finally {
        setSubmitting(false);
      }
    };

    const handleShareThoughtsClick = () => {
      const token = localStorage.getItem('ubt_token');
      if (!token) {
        navigate('/login?redirect=' + encodeURIComponent('/?testimonial=true'));
        return;
      }

      // Prepopulate name and role
      let loggedInName = '';
      let loggedInRole = 'Viewer';
      try {
        const storedUser = localStorage.getItem('ubt_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          loggedInName = parsed.fullName || parsed.name || '';
          
          if (parsed.role === 'owner') {
            loggedInRole = 'Business Owner';
          } else if (parsed.role === 'editor' || parsed.role === 'blog_writer') {
            loggedInRole = 'Blog Writer';
          } else if (parsed.role === 'event_manager') {
            loggedInRole = 'Event Manager';
          } else if (parsed.role === 'viewer' || parsed.role === 'user') {
            loggedInRole = 'Viewer';
          }
        }
      } catch (e) {
        console.warn('Failed to parse ubt_user details:', e);
      }

      setNewTestimonial({
        authorName: loggedInName,
        role: loggedInRole,
        text: '',
        rating: 5,
      });
      setSubmitSuccess('');
      setSubmitError('');
      setIsTestimonialModalOpen(true);
    };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let url = `/businesses?q=${encodeURIComponent(searchTerm)}`;
    if (locationTerm) url += `&locality=${encodeURIComponent(locationTerm)}`;
    if (categoryTerm && categoryTerm !== 'All Categories') url += `&category=${encodeURIComponent(categoryTerm)}`;
    navigate(url);
  };

  const handleCall = async (phone, name, bizId) => {
    if (bizId) {
      try {
        await fetch(`http://localhost:5000/api/businesses/${bizId}/click`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'call' })
        });
      } catch (err) {
        console.error('Failed to track call click:', err);
      }
    }
    window.open(`tel:${phone}`);
  };

  const handleWhatsApp = async (whatsapp, name, bizId) => {
    if (bizId) {
      try {
        await fetch(`http://localhost:5000/api/businesses/${bizId}/click`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'whatsapp' })
        });
      } catch (err) {
        console.error('Failed to track whatsapp click:', err);
      }
    }
    const cleanNum = whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNum}?text=Hello%20${encodeURIComponent(name)},%20I%20saw%20your%2520listing%20on%20Udumalpet%20Business%20Tour.`);
  };

  // Categories list is now dynamically defined and updated inside the Home component based on business counts.

  return (
    <div className="w-full flex flex-col items-center bg-[#F8FAFC]">
      
      {/* 1. Hero Section (Pixel Perfect Layout with User Uploaded Thirumoorthy Hills BG) */}
      <section className="w-full relative min-h-[500px] sm:min-h-[620px] bg-[#F8FAFC] flex items-center justify-center pt-4 pb-14 sm:pt-6 sm:pb-28 px-4 md:px-8 overflow-hidden z-0">
        
        {/* Background Image wrapper to prevent scaling blur on ultra-wide screens */}
        <div className="absolute inset-0 max-w-[1440px] mx-auto w-full h-full z-0 overflow-hidden">
          <img 
            src="/thirumoorthy_dam.png" 
            alt="Thirumoorthy Hills Background"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          />
          {/* Dynamic Gradient Overlay that smoothly blends image to transparent without washing details */}
          <div className="absolute inset-0 z-10 pointer-events-none select-none" style={{ background: "linear-gradient(to right, rgba(248, 250, 252, 0.35) 0%, rgba(248, 250, 252, 0.05) 70%, rgba(248, 250, 252, 0) 100%)" }} />
        </div>

        {/* Hero main body */}
        <div className="relative max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
          
          {/* Left panel: text & search */}
          <div className="lg:col-span-8 flex flex-col items-start text-left">
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#001c41] tracking-tight leading-tight max-w-2xl font-sans">
              Discover Trusted <br />
              Businesses in <br />
              <span className="text-[#027244]">Udumalpet</span>
            </h1>
            
            <p className="mt-5 text-[15px] md:text-[17px] text-slate-500 font-medium max-w-xl leading-relaxed">
              A trusted local platform to discover, connect and grow with verified businesses in and around Udumalpet.
            </p>

            {/* Onboarding CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
              <Link 
                to="/register?flow=early_access"
                id="join-early-access-btn"
                className="bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Rocket className="h-4.5 w-4.5 animate-pulse" />
                <span>Join Early Access</span>
              </Link>
              <Link 
                to="/register?flow=general"
                id="register-business-btn"
                className="bg-white hover:bg-slate-50 border-2 border-[#027244] text-[#027244] font-extrabold text-xs py-3.5 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Store className="h-4.5 w-4.5" />
                <span>Register Your Business</span>
              </Link>
            </div>

            {/* Shaking Referral Tag */}
            <button 
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-referral-modal'))}
              className="mt-6 bg-amber-400 hover:bg-amber-500 text-slate-900 text-[11px] font-black uppercase tracking-wider px-4 py-2.5 rounded-full shadow-md animate-shake border border-amber-500/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Gift className="h-4 w-4 text-[#027244] shrink-0 animate-bounce" />
              Refer other business & earn rewards!
            </button>

            {/* Rich horizontal search bar */}
            <form onSubmit={handleSearchSubmit} className="mt-4 md:mt-8 w-full bg-white border border-slate-200/80 rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl">
              <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="md:w-48 flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                <MapPin className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Location"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="md:w-48 flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 relative">
                <Grid className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <select
                  value={categoryTerm}
                  onChange={(e) => setCategoryTerm(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option>All Categories</option>
                  <option>Automotive</option>
                  <option>Beauty & Wellness</option>
                  <option>Education</option>
                  <option>Electronics</option>
                  <option>Food & Restaurants</option>
                  <option>Health & Medical</option>
                  <option>Home Services</option>
                  <option>Real Estate</option>
                  <option>Shopping</option>
                  <option>Manufacturing</option>
                  <option>Professional Services</option>
                  <option>Travel & Hospitality</option>
                  <option>Construction</option>
                  <option>Agriculture</option>
                  <option>Finance & Insurance</option>
                  <option>Events & Entertainment</option>
                  <option>Sports & Fitness</option>
                  <option>Others</option>
                </select>
              </div>

              <button type="submit" className="bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs py-3 px-8 rounded-xl transition-all shadow-md shrink-0 cursor-pointer">
                Search
              </button>
            </form>

            {/* Popular searches chips */}
            <div className="mt-6 flex flex-wrap items-center gap-3.5 text-xs font-bold">
              <span className="text-[#001c41]">Popular Searches:</span>
              {['Hotels', 'Shops', 'Services', 'Hospitals', 'Schools'].map((chip) => (
                <Link 
                  key={chip} 
                  to={`/businesses?category=${chip === 'Hospitals' ? 'Health' : chip === 'Schools' ? 'Education' : chip}`}
                  className="bg-white hover:bg-slate-50 border border-slate-200 py-1.5 px-3.5 rounded-lg transition-colors font-bold text-slate-600 shadow-sm hover:border-[#027244]"
                >
                  {chip}
                </Link>
              ))}
            </div>

          </div>

          {/* Right panel space to keep the layout grid balanced on desktop */}
          <div className="lg:col-span-4 hidden lg:block" />

        </div>

        {/* Wavy bottom divider curves */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,90.41,27.35,163.81,47.28,243.68,67.23,321.39,56.44Z" fill="#F8FAFC"></path>
          </svg>
        </div>
      </section>

      {/* 2. Four Trust Indicators Cards (Row as a single unified bar matching mockup) */}
      <section className="max-w-7xl w-full px-4 md:px-8 z-10 -mt-8">
        <div className="bg-white border border-slate-200/60 rounded-[20px] shadow-lg py-5 px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-slate-100">
          {[
            { icon: <ShieldCheck className="h-5.5 w-5.5 text-[#027244]" />, title: 'Verified Businesses', desc: 'All businesses are manually verified' },
            { icon: <HeartPulse className="h-5.5 w-5.5 text-[#027244]" />, title: 'Quality Service', desc: 'Top quality local businesses' },
            { icon: <Phone className="h-5.5 w-5.5 text-[#027244]" />, title: 'Easy to Connect', desc: 'Call, WhatsApp or Get Directions' },
            { icon: <Users2 className="h-5.5 w-5.5 text-[#027244]" />, title: 'Support Local', desc: 'Grow together with local businesses' }
          ].map((indicator, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-300 ${
                idx === 0 
                  ? 'lg:pr-6' 
                  : idx === 3 
                    ? 'lg:pl-6' 
                    : 'lg:px-6'
              }`}
            >
              <div className="h-11 w-11 rounded-full bg-[#E6F4EA] text-[#027244] flex items-center justify-center shrink-0 select-none">
                {indicator.icon}
              </div>
              <div className="flex flex-col gap-0.5 text-left">
                <span className="font-extrabold text-[#001c41] text-xs md:text-sm leading-tight">{indicator.title}</span>
                <span className="text-[12px] md:text-[13px] text-slate-500 font-medium leading-normal mt-0.5">{indicator.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Top Categories Section (Using premium vector icons) */}
      <section className="max-w-7xl w-full px-4 md:px-8 py-10 flex flex-col gap-8">
        <div className="flex justify-between items-end border-b border-slate-200/80 pb-3">
          <div>
            <h2 className="text-2xl font-extrabold text-[#001c41] tracking-tight">Top Categories</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Explore local businesses by specific industry</p>
          </div>
          <Link to="/businesses?focus=categories" className="text-xs font-bold text-[#027244] hover:text-[#005934] flex items-center gap-1">
            View All Categories <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-none snap-x snap-mandatory sm:grid sm:grid-cols-4 lg:grid-cols-8">
          {categoriesList.map((cat) => (
            <Link 
              key={cat.name} 
              to={cat.path}
              className="card-premium group rounded-2xl py-4.5 px-3 sm:py-6 sm:px-4 flex flex-col items-center justify-center gap-2.5 sm:gap-4 text-center cursor-pointer w-[calc(50%-8px)] min-w-[135px] shrink-0 snap-start sm:w-auto sm:shrink-0 md:shrink"
            >
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl select-none transition-transform duration-500 ease-out-expo group-hover:scale-110 [&>svg]:h-5.5 [&>svg]:w-5.5 sm:[&>svg]:h-7 sm:[&>svg]:w-7">
                {cat.icon}
              </div>
              <span className="text-xs sm:text-[17px] font-medium text-slate-700 transition-colors duration-300 group-hover:text-[#027244] line-clamp-1">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Businesses Section (With side chevrons!) */}
      <section className="max-w-7xl w-full px-4 md:px-8 py-12 flex flex-col gap-8 relative">
        <div className="flex justify-between items-end border-b border-slate-200/80 pb-3">
          <div>
            <h2 className="text-2xl font-extrabold text-[#001c41] tracking-tight">Featured Businesses</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Direct from our premium verified sponsors</p>
          </div>
          <Link to="/businesses?type=Premium" className="text-xs font-bold text-[#027244] hover:text-[#005934] flex items-center gap-1">
            View All Businesses <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Carousel buttons */}
        <button className="h-8 w-8 border border-slate-200 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center absolute left-1 top-1/2 -translate-y-1/2 shadow text-slate-400 z-10 hover:text-[#027244] cursor-pointer hidden xl:flex">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button className="h-8 w-8 border border-slate-200 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 shadow text-slate-400 z-10 hover:text-[#027244] cursor-pointer hidden xl:flex">
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="flex overflow-x-auto gap-5 pb-4 scrollbar-none snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {featuredBusinesses.map((biz) => {
            const isSubscribed = biz.subscriptionStatus === 'active';
            return (
              <div 
                key={biz._id} 
                className="card-premium group rounded-2xl overflow-hidden flex flex-col cursor-pointer relative w-[calc(50%-10px)] min-w-[145px] shrink-0 snap-start sm:w-auto sm:shrink"
                onClick={() => navigate(`/businesses/${biz._id}`)}
              >
                <div className="h-44 w-full overflow-hidden relative rounded-t-[15px]">
                  <div 
                    className="h-full w-full bg-cover bg-center transition-transform duration-700 ease-out-expo group-hover:scale-106 rounded-t-[15px]"
                    style={{ 
                      backgroundImage: `url('${biz.coverImageUrl}')`,
                      filter: !isSubscribed ? 'blur(6px) grayscale(30%)' : 'none'
                    }}
                  />
                </div>
                <div 
                  className="p-5 flex-grow flex flex-col justify-between gap-3.5 bg-white"
                  style={{
                    filter: !isSubscribed ? 'blur-[3.5px] select-none pointer-events-none' : 'none'
                  }}
                >
                  <div className="flex flex-col gap-1.5 text-left">
                    <h4 className="font-extrabold text-sm text-[#001c41] leading-tight transition-colors duration-300 group-hover:text-[#027244]">{biz.name}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{biz.category}</span>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(biz.address ? `${biz.name}, ${biz.address}` : `${biz.name}, ${biz.locality || ''}, Udumalpet`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold mt-1 hover:text-emerald-500 transition-colors cursor-pointer group"
                      title="View on Google Maps"
                    >
                      <MapPin className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-500 shrink-0" />
                      <span className="group-hover:underline">{biz.locality}</span>
                    </a>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
                        <span className="font-bold text-slate-700">{biz.googleRating.toFixed(1)}</span>
                        <span className="text-[10px] font-bold text-slate-400">({biz.googleReviewsCount})</span>
                      </div>

                      {/* Quick call and map location symbols */}
                      <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                        <a 
                          href={`tel:${biz.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="h-6 w-6 rounded-full bg-emerald-50 text-[#027244] border border-emerald-100/50 flex items-center justify-center hover:bg-emerald-100 transition-colors cursor-pointer"
                          title={`Call ${biz.name}`}
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(biz.address ? `${biz.name}, ${biz.address}` : `${biz.name}, ${biz.locality || ''}, Udumalpet`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="h-6 w-6 rounded-full bg-blue-50 text-blue-600 border border-blue-100/50 flex items-center justify-center hover:bg-blue-100 transition-colors cursor-pointer group"
                          title="View on Google Maps"
                        >
                          <MapPin className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                        </a>
                      </div>
                    </div>
                    <Link 
                      to={`/businesses/${biz._id}`}
                      className="text-[10px] font-bold text-[#027244] hover:underline flex items-center gap-0.5"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                {/* Glassmorphism Lock Overlay for Inactive Subscriptions */}
                {!isSubscribed && (
                  <div 
                    onClick={(e) => { e.stopPropagation(); navigate(`/businesses/${biz._id}`); }}
                    className="absolute inset-0 bg-slate-900/10 backdrop-blur-xs z-20 transition-all duration-300 hover:bg-slate-900/15 cursor-pointer"
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Statistics Sections Band (Exact theme color match) */}
      <section className="w-full bg-[#001c41] text-white py-8 sm:py-14 px-4 border-y border-[#001430]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 text-center">
          {[
            { value: '500+', label: 'Businesses Listed', icon: <Users2 className="h-5 w-5 text-emerald-400" /> },
            { value: '50+', label: 'Categories Covered', icon: <LayoutGrid className="h-5 w-5 text-emerald-400" /> },
            { value: '10K+', label: 'Happy Customers', icon: <Smile className="h-5 w-5 text-emerald-400" /> },
            { value: '100%', label: 'Local Support & Trust', icon: <Heart className="h-5 w-5 text-emerald-400" fill="currentColor" /> }
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-0.5 sm:gap-1">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-slate-900/60 flex items-center justify-center mb-1 border border-slate-800 shadow [&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-5 sm:[&>svg]:w-5">
                {stat.icon}
              </div>
              <span className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">{stat.value}</span>
              <span className="text-[9.5px] sm:text-[12px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5 sm:mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. How It Works Section (Connected with dashed lines) */}
      <section id="how-it-works" className="max-w-7xl w-full px-4 md:px-8 py-16 flex flex-col items-center gap-12">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-extrabold text-[#001c41] tracking-tight">How It Works</h2>
          <p className="text-sm text-slate-500 font-medium mt-2">Connecting local buyers with verified businesses in four easy steps</p>
        </div>

        <div className="w-full flex overflow-x-auto gap-4 pb-4 scrollbar-none snap-x snap-mandatory md:grid md:grid-cols-4 md:gap-8 relative">
          {[
            { 
              num: 1, 
              title: 'Search', 
              desc: 'Find the best businesses in Udumalpet', 
              icon: (
                <svg className="h-7 w-7 text-[#027244]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="#E6F2ED" />
                  <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M14 15l3 3m-2.5-4a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" stroke="#001c41" strokeWidth="2" />
                </svg>
              ) 
            },
            { 
              num: 2, 
              title: 'Explore', 
              desc: 'View details, reviews and compare options', 
              icon: (
                <svg className="h-7 w-7 text-[#027244]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="2.5" fill="#E6F2ED" />
                  <path d="M15 15l5 5" stroke="#001c41" strokeWidth="3" strokeLinecap="round" />
                  <path d="M8 10h4M10 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ) 
            },
            { 
              num: 3, 
              title: 'Connect', 
              desc: 'Call, WhatsApp or send enquiry easily', 
              icon: (
                <svg className="h-7 w-7 text-[#027244]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" fill="#E6F2ED" />
                  <path d="M14 2a5 5 0 015 5M13 5a2 2 0 012 2" stroke="#001c41" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) 
            },
            { 
              num: 4, 
              title: 'Grow Together', 
              desc: 'Support local businesses and grow together', 
              icon: (
                <svg className="h-7 w-7 text-[#027244]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" fill="#E6F2ED" />
                  <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="#E6F2ED" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#001c41" strokeWidth="2" />
                </svg>
              ) 
            }
          ].map((step, idx) => (
            <div key={step.num} className={`bg-white border border-slate-200/80 p-5 md:p-6 rounded-3xl shadow-sm hover:shadow-md transition-all relative flex flex-col items-center text-center gap-3.5 md:gap-4 ${idx < 3 ? 'step-connector' : ''} w-[240px] shrink-0 snap-start md:w-auto md:shrink`}>
              {/* Number Badge */}
              <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-[#027244] text-white font-extrabold flex items-center justify-center text-xs shadow z-10 border border-[#027244]">
                {step.num}
              </div>
              {/* Vector line icon */}
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-emerald-50/50 border border-emerald-100/50 flex items-center justify-center shadow-sm mt-1 z-10">
                {step.icon}
              </div>
              <h4 className="font-extrabold text-[#001c41] text-xs md:text-sm leading-none mt-1 z-10">{step.title}</h4>
              <p className="text-[11px] md:text-[13px] text-slate-500 leading-relaxed font-medium max-w-[190px] md:max-w-[200px] z-10">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>



      {/* 8. What People Say Section */}
      <section className="w-full bg-slate-50/50 py-16 px-4 border-t border-slate-200/50 relative">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-10 relative">
          
          <div className="w-full flex justify-between items-end">
            <div className="text-left">
              <h2 className="text-2xl font-extrabold text-[#001c41] tracking-tight">What People Say</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Real experiences shared by our core community member creators</p>
            </div>
            
            {/* Scroll Navigation Arrows */}
            <div className="flex gap-2 select-none">
              <button
                onClick={() => handleScrollTestimonials('left')}
                aria-label="Scroll left"
                className="h-8 w-8 border border-slate-200 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center shadow-xs text-slate-400 hover:text-[#027244] cursor-pointer transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleScrollTestimonials('right')}
                aria-label="Scroll right"
                className="h-8 w-8 border border-slate-200 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center shadow-xs text-slate-400 hover:text-[#027244] cursor-pointer transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div 
            ref={testimonialScrollRef}
            className="w-full flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden animate-fadeIn"
          >
            {testimonials.map((t, idx) => (
              <div 
                key={t._id || idx}
                className="min-w-[240px] sm:min-w-[340px] max-w-[340px] bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-6.5 flex flex-col justify-between gap-3 sm:gap-5 shrink-0 snap-start shadow-2xs hover:shadow-xs transition-all relative"
              >
                <div className="flex flex-col gap-2.5 sm:gap-4">
                  {/* Review stars */}
                  <div className="flex items-center text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current" />
                    ))}
                    {[...Array(5 - (t.rating || 5))].map((_, i) => (
                      <Star key={i + 10} className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-200" />
                    ))}
                  </div>
                  
                  <p className="text-slate-600 font-semibold italic text-[11px] sm:text-xs leading-relaxed">
                    "{t.text || ''}"
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 mt-1 border-t border-slate-100/70 pt-2.5 sm:pt-3.5">
                  <div className="h-7.5 w-7.5 sm:h-9 sm:w-9 rounded-full border border-slate-200 bg-[#E6F2ED] text-[#027244] font-black text-[9px] sm:text-[10px] flex items-center justify-center select-none shadow-2xs uppercase">
                    {(t.authorName || '').slice(0, 2)}
                  </div>
                  <div className="text-left flex flex-col gap-0.5">
                    <span className="font-extrabold text-[10px] sm:text-[11px] text-slate-800 leading-none">{t.authorName || ''}</span>
                    <span className="text-[7.5px] sm:text-[8.5px] font-bold text-[#027244] uppercase tracking-wider bg-emerald-50 border border-emerald-100 rounded-sm px-1.5 py-0.5 leading-none inline-block mt-0.5">
                      {t.role || 'Business Owner'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ask business owners, event managers, blog writers to share their thoughts */}
          <div className="flex flex-col items-center gap-3.5 mt-4">
            <span className="text-sm text-slate-500 font-medium">Are you a Business Owner, Event Manager, or Blog Writer using UBT?</span>
            <button
              onClick={handleShareThoughtsClick}
              className="bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              Share Your Thoughts About UBT
            </button>
          </div>
        </div>
      </section>

      {/* How It Works for Businesses Section (Connected with dashed lines) */}
      <section id="how-it-works-business" className="max-w-7xl w-full px-4 md:px-8 py-16 flex flex-col items-center gap-12 border-t border-slate-200/50">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-extrabold text-[#001c41] tracking-tight">Steps to Register</h2>
          <p className="text-sm text-slate-500 font-medium mt-2">Follow these simple steps to list and verify your business on Udumalpet Business Tour</p>
        </div>

        <div className="w-full flex overflow-x-auto gap-4 pb-4 scrollbar-none snap-x snap-mandatory md:grid md:grid-cols-4 md:gap-8 relative">
          {[
            { 
              num: 1, 
              title: 'Create Account', 
              desc: 'Sign up as a business owner in seconds with your basic contact info', 
              icon: (
                <svg className="h-7 w-7 text-[#027244]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" fill="#E6F2ED" />
                  <circle cx="12" cy="10" r="3" stroke="#001c41" strokeWidth="2" />
                  <path d="M6 17c0-2 2-3 6-3s6 1 6 3" stroke="#001c41" strokeWidth="2" strokeLinecap="round" />
                  <path d="M19 8h2m-1-1v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ) 
            },
            { 
              num: 2, 
              title: 'Choose Plan', 
              desc: 'Select a highly affordable Monthly or Annual subscription plan', 
              icon: (
                <svg className="h-7 w-7 text-[#027244]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2.5" fill="#E6F2ED" />
                  <path d="M3 10h18" stroke="#001c41" strokeWidth="2.5" />
                  <rect x="7" y="14" width="4" height="2" rx="0.5" fill="#001c41" />
                  <circle cx="16" cy="14" r="1.5" fill="currentColor" />
                </svg>
              ) 
            },
            { 
              num: 3, 
              title: 'Add Business Info', 
              desc: 'Provide your location, business category, working hours, and contact details', 
              icon: (
                <svg className="h-7 w-7 text-[#027244]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" fill="#E6F2ED" />
                  <path d="M12 11h4m-8 4h8M8 7h4" stroke="#001c41" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) 
            },
            { 
              num: 4, 
              title: 'Get Verified & Go Live', 
              desc: 'Submit your details for coordinator vetting to receive your verified badge and live status', 
              icon: (
                <svg className="h-7 w-7 text-[#027244]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" fill="#E6F2ED" />
                  <path d="M9 11l2 2 4-4" stroke="#001c41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) 
            }
          ].map((step, idx) => (
            <div key={step.num} className={`bg-white border border-slate-200/80 p-5 md:p-6 rounded-3xl shadow-sm hover:shadow-md transition-all relative flex flex-col items-center text-center gap-3.5 md:gap-4 ${idx < 3 ? 'step-connector' : ''} w-[240px] shrink-0 snap-start md:w-auto md:shrink`}>
              {/* Number Badge */}
              <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-[#027244] text-white font-extrabold flex items-center justify-center text-xs shadow z-10 border border-[#027244]">
                {step.num}
              </div>
              {/* Vector line icon */}
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-emerald-50/50 border border-emerald-100/50 flex items-center justify-center shadow-sm mt-1 z-10">
                {step.icon}
              </div>
              <h4 className="font-extrabold text-[#001c41] text-xs md:text-sm leading-none mt-1 z-10">{step.title}</h4>
              <p className="text-[11px] md:text-[13px] text-slate-500 leading-relaxed font-medium max-w-[190px] md:max-w-[200px] z-10">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faq" className="max-w-6xl w-full px-4 md:px-8 py-16 flex flex-col gap-12 border-t border-slate-200/50">
        
        {/* Header Block: Image left to FAQ heading + Scroll Navigation Arrows */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left">
            <div className="flex-shrink-0 select-none">
              <img 
                src="/faq_illustration.png" 
                alt="FAQ Illustration" 
                className="max-h-[100px] md:max-h-[140px] w-auto object-contain"
              />
            </div>
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#001c41] tracking-tight">Frequently Asked Questions</h2>
              <p className="text-sm text-slate-500 font-medium mt-2">Find quick answers to common queries about Udumalpet Business Tour</p>
            </div>
          </div>
          
          {/* Scroll Navigation Arrows */}
          <div className="flex gap-2 select-none shrink-0">
            <button
              onClick={() => handleScrollFaqs('left')}
              aria-label="Scroll FAQs left"
              className="h-8 w-8 border border-slate-200 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center shadow-xs text-slate-400 hover:text-[#027244] cursor-pointer transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleScrollFaqs('right')}
              aria-label="Scroll FAQs right"
              className="h-8 w-8 border border-slate-200 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center shadow-xs text-slate-400 hover:text-[#027244] cursor-pointer transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* FAQs horizontally scrollable wrapper */}
        <div 
          ref={faqScrollRef}
          className="w-full flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden animate-fadeIn"
        >
          {[
            {
              q: 'How do I register and list my business on UBT?',
              a: 'You can register easily by clicking the "List Your Business" button in the header or footer, creating an owner/merchant account, and filling in your business profile details like name, category, timing, address, and contact numbers.'
            },
            {
              q: 'Is it free to list my business, and what are the premium benefits?',
              a: 'A basic listing is submitted for verification. To unlock premium priority placement, receive direct customer leads via WhatsApp, show gallery media, and post unlimited free events, you can upgrade to our Monthly or Yearly Premium Plans starting at very affordable rates.'
            },
            {
              q: 'How do I get a verified badge for my business listing?',
              a: 'Our administration team audits all listings. Once you provide valid verification details (like address proof or GST registration) and active contact credentials, the team issues the "UDT Verified" badge on your profile, boosting customer trust.'
            },
            {
              q: 'How much does it cost to promote an event on UBT?',
              a: 'For active Premium Business subscribers, listing and promoting local events (sports, expos, temple festivals, meets) is 100% free! For non-subscribers or general accounts, a standard listing charge of ₹99 applies per event.'
            },
            {
              q: 'Can I write blog articles or write reviews for local vendors?',
              a: 'Yes! Anyone registered on UBT can post guiding articles/blogs about tourist attractions or hidden culinary spots in Udumalpet. You can also write star reviews and comments directly on any verified merchant profile.'
            }
          ].map((faq, idx) => (
            <div 
              key={idx} 
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-start bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-start select-none cursor-pointer"
            >
              <div className="flex justify-between items-start gap-2 w-full">
                <div className="flex gap-2">
                  <span className="h-5.5 w-5.5 rounded-full bg-emerald-50 text-[#027244] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                    Q
                  </span>
                  <h3 className="font-extrabold text-[14px] text-slate-800 leading-snug">
                    {faq.q}
                  </h3>
                </div>
                <ChevronRight className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-305 mt-1 ${activeFaq === idx ? 'rotate-90 text-[#027244]' : ''}`} />
              </div>
              <div 
                className={`overflow-hidden transition-all duration-300 ${activeFaq === idx ? 'max-h-[220px] opacity-100 mt-3 border-t border-slate-100 pt-3' : 'max-h-0 opacity-0'}`}
              >
                <div className="flex gap-2">
                  <span className="h-5.5 w-5.5 rounded-full bg-slate-50 text-slate-400 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-slate-100">
                    A
                  </span>
                  <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Submission Modal */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 bg-[#001c41]/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity animate-fadeIn text-left">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative border border-slate-100 flex flex-col gap-5 animate-scaleUp">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setIsTestimonialModalOpen(false);
                setSubmitSuccess('');
                setSubmitError('');
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 h-8 w-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="flex flex-col gap-1 text-left">
              <span className="text-[10px] font-black uppercase text-[#027244] tracking-wider">Community Voice</span>
              <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Share Your Experience</h3>
              <p className="text-xs text-slate-400 font-semibold font-sans">Tell the community how Udumalpet Business Tour (UBT) has helped you!</p>
            </div>

            {submitSuccess && (
              <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs font-semibold p-4 rounded-2xl flex items-center gap-2 shadow-xs">
                <Check className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>{submitSuccess}</span>
              </div>
            )}

            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-650 text-xs font-semibold p-4 rounded-2xl flex items-center gap-2 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-red-650 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {!submitSuccess && (
              <form onSubmit={handleTestimonialSubmit} className="flex flex-col gap-4 text-left">
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-extrabold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={newTestimonial.authorName}
                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, authorName: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:bg-white transition-all shadow-xs"
                  />
                </div>

                {/* Role dropdown */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-extrabold text-slate-700">Your Role</label>
                  <select
                    value={newTestimonial.role}
                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#027244] focus:bg-white transition-all shadow-xs cursor-pointer"
                  >
                    <option value="Business Owner">Business Owner</option>
                    <option value="Event Manager">Event Manager</option>
                    <option value="Blog Writer">Blog Writer</option>
                    <option value="Viewer">Viewer</option>
                    <option value="Other">Other Community Member</option>
                  </select>
                </div>

                {/* Rating selection (Stars) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Rating</label>
                  <div className="flex items-center gap-1.5 select-none">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewTestimonial(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={`h-6.5 w-6.5 transition-colors cursor-pointer ${
                            star <= newTestimonial.rating
                              ? 'text-amber-400 fill-current hover:scale-106'
                              : 'text-slate-200 hover:text-amber-300'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Thoughts Textarea */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-extrabold text-slate-700">Your Thoughts / Feedback</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share how this platform has helped your business or improved your experience..."
                    value={newTestimonial.text}
                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, text: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4.5 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#027244] focus:bg-white transition-all shadow-xs resize-none leading-relaxed"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs py-3 px-8 rounded-xl transition-all shadow-md shadow-emerald-900/10 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {submitting ? 'Submitting Review...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
