import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search, MapPin, Grid, List, Star, ShieldCheck, HeartHandshake, PhoneCall, 
  Filter, RefreshCw, AlertCircle, Sparkles, Folder, Check, ArrowRight, ArrowLeft, 
  ChevronDown, ChevronUp, Users, Car, GraduationCap, Tv, Utensils, 
  HeartPulse, Home as HomeIcon, Building, ShoppingBag, Factory, Compass, 
  Wrench, Sprout, CreditCard, Dumbbell, Briefcase, Mail, Info, Clock,
  Activity, Leaf, Coins, Camera, Plane, Landmark, Store
} from 'lucide-react';
import AboutUsView from '../../components/AboutUsView';

const lucideIcons = {
  Search, MapPin, Grid, List, Star, ShieldCheck, HeartHandshake, PhoneCall, 
  Filter, RefreshCw, AlertCircle, Sparkles, Folder, Check, ArrowRight, ArrowLeft, 
  ChevronDown, ChevronUp, Users, Car, GraduationCap, Tv, Utensils, 
  HeartPulse, HomeIcon, Building, ShoppingBag, Factory, Compass, 
  Wrench, Sprout, CreditCard, Dumbbell, Briefcase, Mail, Info, Clock,
  Activity, Leaf, Coins, Camera, Plane, Landmark, Store
};

const renderCategoryIcon = (iconName, className = "h-4.5 w-4.5") => {
  const IconComp = lucideIcons[iconName] || Store;
  return <IconComp className={className} />;
};

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

const parentIconStringMap = {
  'Automotive': 'Car',
  'Beauty & Wellness': 'Sparkles',
  'Education': 'GraduationCap',
  'Electronics': 'Tv',
  'Food & Restaurants': 'Utensils',
  'Health & Medical': 'HeartPulse',
  'Home Services': 'HomeIcon',
  'Real Estate': 'Building',
  'Shopping': 'ShoppingBag',
  'Manufacturing': 'Factory',
  'Professional Services': 'Briefcase',
  'Travel & Hospitality': 'Compass',
  'Construction': 'Wrench',
  'Agriculture': 'Sprout',
  'Finance & Insurance': 'CreditCard',
  'Events & Entertainment': 'Sparkles',
  'Sports & Fitness': 'Dumbbell',
  'Others': 'Grid'
};

const availableLocalities = [
  'Gandhi Nagar', 
  'Pollachi Road', 
  'Palladam Road', 
  'Coimbatore Road', 
  'Madathukulam Road',
  'Dharapuram Road',
  'Palani Road',
  'Dhali Road',
  'Kaniyur Road'
];

const staticData = [
  {
    _id: 'biz_1',
    name: 'Sri Murugan Stores',
    category: 'Shopping',
    locality: 'Gandhi Nagar',
    pincode: '642126',
    googleRating: 4.6,
    googleReviewsCount: 128,
    isPremium: true,
    isAddressVerified: true,
    subscriptionStatus: 'active',
    coverImageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80',
    phone: '+91 94430 12345',
    whatsapp: '+91 94430 12345',
    highlights: ['Quality Products', 'Good Service', 'Fair Prices'],
  },
  {
    _id: 'biz_2',
    name: 'Green Valley Hotel',
    category: 'Food & Restaurants',
    locality: 'Pollachi Road',
    pincode: '642128',
    googleRating: 4.8,
    googleReviewsCount: 98,
    isPremium: true,
    isAddressVerified: true,
    subscriptionStatus: 'active',
    coverImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
    phone: '+91 98945 99999',
    whatsapp: '+91 98945 99999',
    highlights: ['Pure Veg', 'Family Restaurant', 'AC Rooms'],
  },
  {
    _id: 'biz_3',
    name: 'R.K. Electricals',
    category: 'Home Services',
    locality: 'Pollachi Road',
    pincode: '642126',
    googleRating: 4.7,
    googleReviewsCount: 84,
    isPremium: false,
    isAddressVerified: true,
    subscriptionStatus: 'active',
    coverImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80',
    phone: '+91 98945 43100',
    whatsapp: '+91 98945 43100',
    highlights: ['On-time Service', 'Expert Technicians', 'Warranty'],
  },
  {
    _id: 'biz_4',
    name: 'City Hospital',
    category: 'Health & Medical',
    locality: 'Dharapuram Road',
    pincode: '642126',
    googleRating: 4.5,
    googleReviewsCount: 206,
    isPremium: true,
    isAddressVerified: false,
    subscriptionStatus: 'active',
    coverImageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=500&q=80',
    phone: '+91 4252 223456',
    whatsapp: '+91 98425 22345',
    highlights: ['24x7 Service', 'Experienced Doctors', 'Pharmacy'],
  },
  {
    _id: 'biz_5',
    name: 'Siva Soft Solutions',
    category: 'Professional Services',
    locality: 'Gandhi Nagar',
    pincode: '642126',
    googleRating: 4.6,
    googleReviewsCount: 61,
    isPremium: false,
    isAddressVerified: true,
    subscriptionStatus: 'active',
    coverImageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80',
    phone: '+91 97895 43210',
    whatsapp: '+91 97895 43210',
    highlights: ['Web Development', 'Digital Marketing', 'Support'],
  },
  {
    _id: 'biz_6',
    name: 'Glamour Ladies Salon',
    category: 'Beauty & Wellness',
    locality: 'Coimbatore Road',
    pincode: '642126',
    googleRating: 4.4,
    googleReviewsCount: 53,
    isPremium: false,
    isAddressVerified: true,
    subscriptionStatus: 'expired',
    coverImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80',
    phone: '+91 98432 12345',
    whatsapp: '+91 98432 12345',
    highlights: ['Hair Styling', 'Skin Care', 'Bridal Makeup'],
  },
];

function BusinessesList() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search & Filter state variables
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
  const [selectedLocality, setSelectedLocality] = useState(searchParams.get('locality') || 'All Localities');
  
  // Sidebar checkbox states
  const [checkedCategories, setCheckedCategories] = useState({});
  const [checkedLocalities, setCheckedLocalities] = useState({});
  const [selectedRating, setSelectedRating] = useState(null);
  const [verifiedFilter, setVerifiedFilter] = useState(false);
  const [premiumFilter, setPremiumFilter] = useState(false);

  // Sidebar live text searches
  const [categorySearchText, setCategorySearchText] = useState('');
  const [localitySearchText, setLocalitySearchText] = useState('');
  const [showAllLocalities, setShowAllLocalities] = useState(false);

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('list'); // list | grid
  const [sortBy, setSortBy] = useState('Most Relevant');
  const [categoryCounts, setCategoryCounts] = useState({});
  const [categoriesSearchQuery, setCategoriesSearchQuery] = useState('');
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [selectedCategoryInExplore, setSelectedCategoryInExplore] = useState(searchParams.get('category') || null);
  const [selectedSubcategoryInExplore, setSelectedSubcategoryInExplore] = useState(searchParams.get('subcategory') || null);
  const [showTop7Only, setShowTop7Only] = useState(false);
  const [dbCategories, setDbCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Contact form state variables
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(null);
  const [contactError, setContactError] = useState('');

  const getParentCategory = (subName) => {
    for (const [parent, subs] of Object.entries(parentCategoryMapping)) {
      if (subs.some(sub => sub.toLowerCase() === subName.toLowerCase())) {
        return parent;
      }
    }
    // Try fuzzy match
    for (const [parent, subs] of Object.entries(parentCategoryMapping)) {
      if (parent.toLowerCase().includes(subName.toLowerCase()) || subName.toLowerCase().includes(parent.toLowerCase())) {
        return parent;
      }
    }
    return 'Others';
  };

  const handleCategoryClick = async (categoryName) => {
    navigate(`/businesses?category=${encodeURIComponent(categoryName)}`);
    
    // Background view increment
    try {
      await fetch('http://localhost:5000/api/categories/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName })
      });
    } catch (err) {
      console.warn('Failed to increment category view:', err);
    }
  };

  const handleHotCategoryClick = async (categoryName, parentCatName) => {
    const parent = parentCatName || getParentCategory(categoryName);
    navigate(`/businesses?focus=categories&category=${encodeURIComponent(parent)}&subcategory=${encodeURIComponent(categoryName)}`);
    
    // Background view increment
    try {
      await fetch('http://localhost:5000/api/categories/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName })
      });
      
      setDbCategories(prev => prev.map(c => 
        c.categoryName === categoryName ? { ...c, views: (c.views || 0) + 1 } : c
      ));
    } catch (err) {
      console.warn('Failed to increment category view:', err);
    }
  };

  useEffect(() => {
    const focusParam = searchParams.get('focus');
    if (focusParam === 'categories') {
      const catParam = searchParams.get('category');
      const subParam = searchParams.get('subcategory');
      setSelectedCategoryInExplore(catParam || null);
      setSelectedSubcategoryInExplore(subParam || null);
    } else {
      setSelectedCategoryInExplore(null);
      setSelectedSubcategoryInExplore(null);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchDbCategories = async () => {
      setCategoriesLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/categories');
        const data = await res.json();
        if (data.success) {
          setDbCategories(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories from database:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchDbCategories();
  }, []);

  useEffect(() => {
    const fetchAllCounts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/businesses');
        const data = await res.json();
        if (data.success) {
          setAllBusinesses(data.data);
          const counts = {};
          availableCategories.forEach(c => {
            counts[c] = 0;
          });
          data.data.forEach(biz => {
            const parentCat = getParentCategory(biz.category || '');
            if (counts[parentCat] !== undefined) {
              counts[parentCat]++;
            } else {
              counts[parentCat] = 1;
            }
          });
          setCategoryCounts(counts);
        }
      } catch (err) {
        console.warn('API error, using mockup standard fallback counts.');
        setAllBusinesses(staticData);
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
        setCategoryCounts(mockCounts);
      }
    };
    fetchAllCounts();
  }, []);

  useEffect(() => {
    // Populate checked category if passed in url params
    const cat = searchParams.get('category');
    if (cat) setCheckedCategories({ [cat]: true });

    // Populate checked locality if passed in url params
    const loc = searchParams.get('locality');
    if (loc) setCheckedLocalities({ [loc]: true });

    fetchBusinesses();
  }, [searchParams]);

  const fetchBusinesses = async () => {
    setLoading(true);
    setError('');
    try {
      // Build API query string
      let url = 'http://localhost:5000/api/businesses?';
      
      const q = searchParams.get('q');
      if (q) url += `q=${encodeURIComponent(q)}&`;
      
      const cat = searchParams.get('category');
      if (cat && cat !== 'All Categories') url += `category=${encodeURIComponent(cat)}&`;
      
      const loc = searchParams.get('locality');
      if (loc && loc !== 'All Localities') url += `locality=${encodeURIComponent(loc)}&`;

      if (verifiedFilter) url += 'verified=true&';
      if (premiumFilter) url += 'type=Premium&';

      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        let results = data.data;

        // Apply rating filter manually on client side if checked
        if (selectedRating) {
          results = results.filter(b => b.googleRating >= selectedRating);
        }

        // Apply sorting manually based on selection
        if (sortBy === 'Highest Rating') {
          results.sort((a, b) => b.googleRating - a.googleRating);
        } else if (sortBy === 'Newest') {
          results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setBusinesses(results);
      }
    } catch (err) {
      console.warn('API error, loading realistic backup businesses list.');
      // Use global staticData constant

      // Apply search queries manually for fallback
      let results = [...staticData];
      const q = searchParams.get('q');
      if (q) {
        results = results.filter(b => b.name.toLowerCase().includes(q.toLowerCase()) || b.highlights.some(h => h.toLowerCase().includes(q.toLowerCase())));
      }
      const cat = searchParams.get('category');
      if (cat && cat !== 'All Categories') {
        const subcategories = parentCategoryMapping[cat];
        if (subcategories) {
          results = results.filter(b => b.category === cat || subcategories.some(sub => sub.toLowerCase() === (b.category || '').toLowerCase()));
        } else {
          results = results.filter(b => b.category === cat);
        }
      }
      const loc = searchParams.get('locality');
      if (loc && loc !== 'All Localities') {
        results = results.filter(b => b.locality === loc);
      }
      if (verifiedFilter) {
        results = results.filter(b => (b.googlePlaceId && b.googlePlaceId !== '') || (b.googleBusinessLink && b.googleBusinessLink !== '') || b.googleLinked);
      }
      if (premiumFilter) {
        results = results.filter(b => b.isPremium);
      }
      if (selectedRating) {
        results = results.filter(b => b.googleRating >= selectedRating);
      }
      
      // Sort manually
      results.sort((a, b) => {
        // Active Premium rank boost
        const aPrem = a.isPremium && a.subscriptionStatus === 'active';
        const bPrem = b.isPremium && b.subscriptionStatus === 'active';
        if (aPrem && !bPrem) return -1;
        if (!aPrem && bPrem) return 1;

        // Active vs Expired
        const aActive = a.subscriptionStatus === 'active';
        const bActive = b.subscriptionStatus === 'active';
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;

        return b.googleRating - a.googleRating;
      });

      setBusinesses(results);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    triggerQueryUpdate();
  };

  const triggerQueryUpdate = (newCat, newLoc) => {
    let url = `/businesses?q=${encodeURIComponent(searchTerm)}`;
    
    // category filter
    const cat = newCat !== undefined ? newCat : selectedCategory;
    if (cat && cat !== 'All Categories') url += `&category=${encodeURIComponent(cat)}`;
    
    // locality filter
    const loc = newLoc !== undefined ? newLoc : selectedLocality;
    if (loc && loc !== 'All Localities') url += `&locality=${encodeURIComponent(loc)}`;

    navigate(url);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedLocality('All Localities');
    setCheckedCategories({});
    setCheckedLocalities({});
    setSelectedRating(null);
    setVerifiedFilter(false);
    setPremiumFilter(false);
    navigate('/businesses');
  };

  const handleCategoryCheckbox = (cat, checked) => {
    if (cat === 'All Categories') {
      if (checked) {
        setCheckedCategories({});
        setSelectedCategory('All Categories');
        triggerQueryUpdate('All Categories', undefined);
      }
    } else {
      const updated = { ...checkedCategories, [cat]: checked };
      setCheckedCategories(updated);
      const active = Object.keys(updated).find(key => updated[key] && key !== 'All Categories');
      if (active) {
        setSelectedCategory(active);
        triggerQueryUpdate(active, undefined);
      } else {
        setSelectedCategory('All Categories');
        triggerQueryUpdate('All Categories', undefined);
      }
    }
  };

  const handleLocalityCheckbox = (loc, checked) => {
    if (loc === 'Udumalpet') {
      if (checked) {
        setCheckedLocalities({});
        setSelectedLocality('All Localities');
        triggerQueryUpdate(undefined, 'All Localities');
      }
    } else {
      const updated = { ...checkedLocalities, [loc]: checked };
      setCheckedLocalities(updated);
      const active = Object.keys(updated).find(key => updated[key] && key !== 'Udumalpet');
      if (active) {
        setSelectedLocality(active);
        triggerQueryUpdate(undefined, active);
      } else {
        setSelectedLocality('All Localities');
        triggerQueryUpdate(undefined, 'All Localities');
      }
    }
  };

  const handleCall = (phone, name) => {
    window.open(`tel:${phone}`);
  };

  const handleWhatsApp = (whatsapp, name) => {
    const cleanNum = whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNum}?text=Hello%20${encodeURIComponent(name)},%20I%20saw%20your%20listing%20on%20Udumalpet%20Business%20Tour.`);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactSuccess(null);
    setContactError('');
    try {
      const res = await fetch('http://localhost:5000/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject,
          message: contactMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setContactSuccess(true);
        setContactName('');
        setContactEmail('');
        setContactSubject('');
        setContactMessage('');
      } else {
        setContactError(data.message || 'Failed to send message.');
      }
    } catch (err) {
      setContactError('Server connection error. Please try again later.');
    } finally {
      setContactSubmitting(false);
    }
  };

  // Filter lists based on text searches
  const filteredCategories = availableCategories.filter(c => 
    c.toLowerCase().includes(categorySearchText.toLowerCase())
  );
  
  const filteredLocalities = availableLocalities.filter(l => 
    l.toLowerCase().includes(localitySearchText.toLowerCase())
  );

  const displayedLocalities = showAllLocalities 
    ? filteredLocalities 
    : filteredLocalities.slice(0, 5);

  const focusParam = searchParams.get('focus');
  const isCategoriesView = focusParam === 'categories';
  const isAboutView = focusParam === 'about';
  const isContactView = focusParam === 'contact';

  const isTermsView = focusParam === 'terms';
  const isPrivacyView = focusParam === 'privacy';
  const isRefundView = focusParam === 'refund';
  const isGuidelinesView = focusParam === 'guidelines';

  if (isTermsView || isPrivacyView || isRefundView || isGuidelinesView) {
    const docTitle = isTermsView 
      ? 'Terms & Conditions' 
      : isPrivacyView 
        ? 'Privacy Policy' 
        : isRefundView 
          ? 'Refund Policy' 
          : 'Business Guidelines';

    const docSub = isTermsView
      ? 'Understand your rights and responsibilities when using Udumalpet Business Tour.'
      : isPrivacyView
        ? 'Learn how we collect, store, protect, and use your personal data.'
        : isRefundView
          ? 'Review our terms regarding payment processing, plans renewal, and refund requests.'
          : 'Read the rules, quality standards, and verification guidelines for listing businesses.';

    return (
      <div className="w-full flex flex-col items-center bg-[#F8FAFC]">
        {/* Header Banner */}
        <section 
          className="w-full relative min-h-[260px] bg-slate-950 text-white py-10 px-4 md:px-8 border-b border-slate-800 bg-cover bg-center"
          style={{ backgroundImage: "linear-gradient(to bottom, rgba(0, 28, 65, 0.85), rgba(0, 28, 65, 0.98)), url('/thirumoorthy_hills.png')" }}
        >
          <div className="relative max-w-7xl mx-auto flex flex-col items-center z-10 text-left">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold self-start mt-2">
              <Link to="/" className="hover:text-emerald-450 transition-colors">Home</Link>
              <span className="text-slate-505">&gt;</span>
              <span className="text-slate-100">{docTitle}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-4 self-start font-sans">
              {docTitle}
            </h1>
            <p className="text-slate-350 text-xs font-semibold self-start mt-1.5 leading-relaxed max-w-2xl">
              {docSub}
            </p>
          </div>
        </section>

        {/* Content sections */}
        <section className="max-w-4xl w-full px-4 md:px-8 py-12 text-left">
          <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 flex flex-col gap-6 font-sans">
            <h3 className="font-extrabold text-[#001c41] text-base border-b border-slate-100 pb-3">
              Official {docTitle} — Last Updated: May 30, 2026
            </h3>
            
            {isTermsView && (
              <div className="flex flex-col gap-4 text-xs font-semibold text-slate-600 leading-relaxed">
                <p>Welcome to Udumalpet Business Tour (UBT). By accessing or using our directory platform, you agree to comply with and be bound by the following terms and conditions.</p>
                
                <h4 className="font-extrabold text-slate-800 text-sm mt-2">1. Use of the Directory</h4>
                <p>This directory is designed to connect local buyers with verified businesses in Udumalpet. You agree to use the platform only for lawful purposes. Any automated queries, scraping, or indexing of merchant details without prior written consent is strictly prohibited.</p>
                
                <h4 className="font-extrabold text-slate-800 text-sm mt-2">2. Business Owner Responsibilities</h4>
                <p>Merchant owners must ensure all registered information (business name, contact phone, whatsapp, cover image, and category) is accurate, up-to-date, and genuine. Uploading misleading names, copycat logos, or fraudulent ratings violates our platform guidelines and may lead to account suspension.</p>
                
                <h4 className="font-extrabold text-slate-800 text-sm mt-2">3. User Ratings & Review Conduct</h4>
                <p>Reviewers must provide honest, factual experiences. We do not tolerate spam reviews, promotional links, or abusive language. The administration reserves the right to moderate, flag, or delete any content that violates community standards.</p>
              </div>
            )}

            {isPrivacyView && (
              <div className="flex flex-col gap-4 text-xs font-semibold text-slate-600 leading-relaxed">
                <p>At Udumalpet Business Tour, your privacy is our core priority. This Policy describes how we handle the personal information collected on our platform.</p>
                
                <h4 className="font-extrabold text-slate-800 text-sm mt-2">1. Information We Collect</h4>
                <p>We collect data (name, email, phone number, password) during registration. For merchants, we collect and publish business-related data (GST numbers, timings, category classifications, and logo files) to display on the public directory listings.</p>
                
                <h4 className="font-extrabold text-slate-800 text-sm mt-2">2. How We Protect Your Data</h4>
                <p>Your session tokens are stored securely in localStorage, and critical credentials like passwords are encrypted in our database. We do not sell or rent user contact details to third-party advertisers.</p>
                
                <h4 className="font-extrabold text-slate-800 text-sm mt-2">3. Cookies & Session Storage</h4>
                <p>We utilize standard browser cookies and local storage tokens (`ubt_token`, `ubt_user`) to keep you logged in and deliver custom dashboard states.</p>
              </div>
            )}

            {isRefundView && (
              <div className="flex flex-col gap-4 text-xs font-semibold text-slate-600 leading-relaxed">
                <p>Our payment terms outline the billing cycles and refund policies for paid premium listings on Udumalpet Business Tour.</p>
                
                <h4 className="font-extrabold text-slate-800 text-sm mt-2">1. Subscription Renewals</h4>
                <p>Premium plans (Monthly and Yearly) are activated instantly upon successful payment completion. These subscriptions do not automatically auto-charge your credit card or bank account. You must manually renew upon expiry to keep listings active.</p>
                
                <h4 className="font-extrabold text-slate-800 text-sm mt-2">2. Cancellation & Refunds</h4>
                <p>Since premium listings are processed and activated instantly to increase visibility, all subscription payments are non-refundable. You can choose to cancel or let your subscription expire at any point without incurring cancellation penalties.</p>
              </div>
            )}

            {isGuidelinesView && (
              <div className="flex flex-col gap-4 text-xs font-semibold text-slate-600 leading-relaxed">
                <p>These quality guidelines ensure all listings on Udumalpet Business Tour remain professional, helpful, and safe for the public.</p>
                
                <h4 className="font-extrabold text-slate-800 text-sm mt-2">1. Listing Verification Standards</h4>
                <p>All newly registered business profiles go through manual review. To get the "UDT Verified" badge, you must provide valid business registration (GST/licensing) and establish active call/WhatsApp connections.</p>
                
                <h4 className="font-extrabold text-slate-800 text-sm mt-2">2. Prohibited Content</h4>
                <p>Do not post misleading prices, copycat listings, or copyright-infringing cover photos. Event promotions must represent legitimate public activities with real organizer contacts.</p>
              </div>
            )}

            <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-2">
              <Link 
                to="/businesses" 
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#027244] bg-slate-100 hover:bg-emerald-50/50 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Business Directory
              </Link>
              <Link 
                to="/" 
                className="py-2.5 px-5 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (isAboutView) {
    return <AboutUsView />;
  }

  if (isContactView) {
    return (
      <div className="w-full flex flex-col items-center bg-[#F8FAFC]">
        {/* Header Banner */}
        <section 
          className="w-full relative min-h-[260px] bg-slate-950 text-white py-10 px-4 md:px-8 border-b border-slate-800 bg-cover bg-center"
          style={{ backgroundImage: "linear-gradient(to bottom, rgba(0, 28, 65, 0.85), rgba(0, 28, 65, 0.98)), url('/thirumoorthy_hills.png')" }}
        >
          <div className="relative max-w-7xl mx-auto flex flex-col items-center z-10 text-left">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold self-start mt-2">
              <Link to="/" className="hover:text-emerald-450 transition-colors">Home</Link>
              <span className="text-slate-505">&gt;</span>
              <span className="text-slate-100">Contact Us</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-4 self-start font-sans">
              Contact Support
            </h1>
            <p className="text-slate-350 text-xs font-semibold self-start mt-1.5 leading-relaxed max-w-2xl">
              Have questions about registration, verified badges, or advertising options? We are here to help.
            </p>
          </div>
        </section>

        {/* Content sections */}
        <section className="max-w-4xl w-full px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Left Column: Form (3 cols) */}
          <div className="md:col-span-3 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 text-left flex flex-col gap-5">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">Send Us a Message</h3>
              <p className="text-slate-450 text-[10px] font-semibold mt-1">Provide your details and inquiry, and our team will email or call you back shortly.</p>
            </div>

            {contactSuccess && (
              <div className="bg-emerald-50 border border-emerald-250 text-[#027244] rounded-2xl p-4.5 text-xs font-extrabold animate-fadeIn select-none leading-relaxed">
                ✓ Thank you for reaching out! A support representative will review your query and reply shortly.
              </div>
            )}

            {contactError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-650 rounded-2xl p-4.5 text-xs font-extrabold animate-fadeIn select-none leading-relaxed">
                ✗ {contactError}
              </div>
            )}
            
            <form 
              onSubmit={handleContactSubmit}
              className="flex flex-col gap-4.5"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Full Name *</span>
                <input 
                  type="text" 
                  required 
                  placeholder="Enter your full name" 
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="h-10 px-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email Address *</span>
                <input 
                  type="email" 
                  required 
                  placeholder="Enter your email address" 
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="h-10 px-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Subject *</span>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Inquiring about Verified Badge / Listing assistance" 
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="h-10 px-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244]" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Inquiry Message *</span>
                <textarea 
                  required 
                  rows="4" 
                  placeholder="Detail your question or requirement..." 
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="py-2.5 px-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#027244] resize-none" 
                />
              </div>

              <button 
                type="submit" 
                disabled={contactSubmitting}
                className="h-11 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-2 flex items-center justify-center cursor-pointer disabled:opacity-50"
              >
                {contactSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Right Column: Details (2 cols) */}
          <div className="md:col-span-2 flex flex-col gap-6 text-left">
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-5">
              <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-2.5">Local Contact Info</h3>
              
              <div className="flex gap-3.5 items-start">
                <div className="h-8.5 w-8.5 rounded-full bg-emerald-50 text-[#027244] border border-emerald-100/50 flex items-center justify-center shrink-0 shadow-2xs">
                  <PhoneCall className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-extrabold text-slate-450 uppercase leading-none">Call Us</span>
                  <a href="tel:+919443512345" className="text-xs text-slate-800 font-extrabold hover:underline mt-1 leading-normal">+91 94435 12345</a>
                  <a href="tel:+914252223456" className="text-xs text-slate-800 font-extrabold hover:underline leading-none">+91 4252 223456</a>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="h-8.5 w-8.5 rounded-full bg-emerald-50 text-[#027244] border border-emerald-100/50 flex items-center justify-center shrink-0 shadow-2xs">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase leading-none">Email Us</span>
                  <a href="mailto:udumalpetbusinesstour@gmail.com" className="text-xs text-slate-800 font-extrabold hover:underline mt-1 leading-normal">udumalpetbusinesstour@gmail.com</a>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="h-8.5 w-8.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100/50 flex items-center justify-center shrink-0 shadow-2xs">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase leading-none">Office Hours</span>
                  <span className="text-xs text-slate-600 font-semibold mt-1 leading-normal">Mon - Sat: 9:00 AM - 6:00 PM</span>
                  <span className="text-[10px] text-slate-500 font-bold leading-none">Sunday Closed</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4">
              <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-2.5">Office Address</h3>
              <div className="flex gap-3 items-start">
                <MapPin className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                  12, Bazaar Street,<br />
                  Near Head Post Office,<br />
                  Udumalpet - 642126,<br />
                  Tamil Nadu, India.
                </p>
              </div>
            </div>
          </div>

        </section>
      </div>
    );
  }

  const categoryDetails = [
    { name: 'Automotive', icon: <Car className="h-4.5 w-4.5 text-red-500" />, bg: 'bg-red-50' },
    { name: 'Beauty & Wellness', icon: <Sparkles className="h-4.5 w-4.5 text-pink-500" />, bg: 'bg-pink-50' },
    { name: 'Education', icon: <GraduationCap className="h-4.5 w-4.5 text-blue-500" />, bg: 'bg-blue-50' },
    { name: 'Electronics', icon: <Tv className="h-4.5 w-4.5 text-emerald-500" />, bg: 'bg-emerald-50' },
    { name: 'Food & Restaurants', icon: <Utensils className="h-4.5 w-4.5 text-amber-500" />, bg: 'bg-amber-50' },
    { name: 'Health & Medical', icon: <HeartPulse className="h-4.5 w-4.5 text-red-500" />, bg: 'bg-red-50' },
    { name: 'Home Services', icon: <HomeIcon className="h-4.5 w-4.5 text-teal-500" />, bg: 'bg-teal-50' },
    { name: 'Real Estate', icon: <Building className="h-4.5 w-4.5 text-indigo-500" />, bg: 'bg-indigo-50' },
    { name: 'Shopping', icon: <ShoppingBag className="h-4.5 w-4.5 text-amber-500" />, bg: 'bg-amber-50' },
    { name: 'Manufacturing', icon: <Factory className="h-4.5 w-4.5 text-slate-500" />, bg: 'bg-slate-50' },
    { name: 'Professional Services', icon: <Briefcase className="h-4.5 w-4.5 text-emerald-500" />, bg: 'bg-emerald-50' },
    { name: 'Travel & Hospitality', icon: <Compass className="h-4.5 w-4.5 text-purple-500" />, bg: 'bg-purple-50' },
    { name: 'Construction', icon: <Wrench className="h-4.5 w-4.5 text-orange-500" />, bg: 'bg-orange-50' },
    { name: 'Agriculture', icon: <Sprout className="h-4.5 w-4.5 text-green-500" />, bg: 'bg-green-50' },
    { name: 'Finance & Insurance', icon: <CreditCard className="h-4.5 w-4.5 text-blue-500" />, bg: 'bg-blue-50' },
    { name: 'Events & Entertainment', icon: <Sparkles className="h-4.5 w-4.5 text-pink-500" />, bg: 'bg-pink-50' },
    { name: 'Sports & Fitness', icon: <Dumbbell className="h-4.5 w-4.5 text-emerald-500" />, bg: 'bg-emerald-50' },
    { name: 'Others', icon: <Grid className="h-4.5 w-4.5 text-slate-500" />, bg: 'bg-slate-50' }
  ];

  if (isCategoriesView) {
    const hotCategories = [...dbCategories]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10);

    const isSearching = categoriesSearchQuery.trim() !== '';
    const searchResults = isSearching 
      ? dbCategories.filter(cat => 
          cat.categoryName.toLowerCase().includes(categoriesSearchQuery.toLowerCase()) ||
          (cat.description && cat.description.toLowerCase().includes(categoriesSearchQuery.toLowerCase()))
        )
      : [];

    const relatedSubcategories = selectedCategoryInExplore
      ? dbCategories.filter(cat => 
          cat.parentCategory?.toLowerCase() === selectedCategoryInExplore.toLowerCase()
        )
      : [];

    const exploreSubcatNames = selectedCategoryInExplore
      ? dbCategories
          .filter(cat => cat.parentCategory?.toLowerCase() === selectedCategoryInExplore.toLowerCase())
          .map(cat => cat.categoryName.toLowerCase())
      : [];

    const filteredExploreBusinesses = allBusinesses.filter(biz => {
      const bizCat = biz.category?.toLowerCase();
      if (selectedSubcategoryInExplore && selectedSubcategoryInExplore !== 'All') {
        return bizCat === selectedSubcategoryInExplore.toLowerCase();
      } else {
        return bizCat === selectedCategoryInExplore?.toLowerCase() || exploreSubcatNames.includes(bizCat);
      }
    });

    return (
      <div className="w-full flex flex-col items-center bg-[#F8FAFC]">
        {/* Header Banner */}
        <section 
          className="w-full relative min-h-[260px] bg-slate-950 text-white py-10 px-4 md:px-8 border-b border-slate-800 bg-cover bg-center"
          style={{ backgroundImage: "linear-gradient(to bottom, rgba(0, 28, 65, 0.8), rgba(0, 28, 65, 0.95)), url('/thirumoorthy_hills.png')" }}
        >
          <div className="relative max-w-7xl mx-auto flex flex-col items-center z-10 text-left">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold self-start mt-2">
              <Link to="/" className="hover:text-emerald-450 transition-colors">Home</Link>
              <span className="text-slate-505">&gt;</span>
              <span className="text-slate-100">Categories</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-4 self-start font-sans">
              Explore Categories
            </h1>
            <p className="text-slate-350 text-xs font-semibold self-start mt-1.5 leading-relaxed">
              Find local businesses and specialized services in Udumalpet
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="mt-8 w-full bg-white border border-slate-200 shadow-xl rounded-2xl p-2 flex gap-2 max-w-3xl">
              <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search for categories or services..."
                  value={categoriesSearchQuery}
                  onChange={(e) => setCategoriesSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </form>
          </div>
        </section>

        {/* Main Two-Column Split Grid */}
        <section className="max-w-7xl w-full px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Main categories grid, search results, or subcategory drilldown */}
          <div className="lg:col-span-3 flex flex-col gap-6">
               {isSearching ? (
              // Search Results View
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <span className="font-extrabold text-sm text-[#001c41]">
                    Search Results for "{categoriesSearchQuery}" ({searchResults.length})
                  </span>
                  <button 
                    onClick={() => setCategoriesSearchQuery('')}
                    className="text-xs font-bold text-[#027244] hover:underline"
                  >
                    Clear Search
                  </button>
                </div>

                {searchResults.length === 0 ? (
                  <div className="bg-white border border-slate-200/60 rounded-3xl py-14 px-6 text-center shadow-sm flex flex-col items-center justify-center gap-4 text-slate-400">
                    <AlertCircle className="h-10 w-10 text-slate-350" />
                    <div>
                      <h4 className="font-extrabold text-slate-700 text-base leading-none">No categories found</h4>
                      <p className="text-xs text-slate-400 font-semibold mt-2">Try searching with other keywords or browse our catalog.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-left">
                    {searchResults.map((cat) => {
                      const count = allBusinesses.filter(b => b.category?.toLowerCase() === cat.categoryName.toLowerCase()).length;
                      return (
                        <div 
                          key={cat._id}
                          onClick={() => handleCategoryClick(cat.categoryName)}
                          className="card-premium group rounded-3xl p-6 cursor-pointer flex flex-col justify-between h-36 relative overflow-hidden bg-white border border-slate-200/65 hover:border-[#027244]"
                        >
                          <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-slate-50 rounded-full group-hover:bg-emerald-50/40 transition-colors duration-500 pointer-events-none" />
                          <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-500 group-hover:scale-110">
                            {renderCategoryIcon(cat.icon, "h-4.5 w-4.5 text-[#027244]")}
                          </div>
                          <div className="flex flex-col z-10 mt-3">
                            <span className="font-extrabold text-[#001c41] text-[13px] leading-snug group-hover:text-[#027244] transition-colors duration-300 truncate">
                              {cat.categoryName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-extrabold mt-1 uppercase tracking-wide leading-none">
                              {count} Business{count !== 1 ? 'es' : ''}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              // Main explorer states (State A, State B, State C)
              <div className="flex flex-col gap-6">
                {!selectedCategoryInExplore ? (
                  // State A: Parent category grid
                  <>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <span className="font-extrabold text-sm text-[#001c41]">
                        Browse by Parent Category
                      </span>
                      <span className="text-[10.5px] text-slate-400 font-bold">Select a parent category to view subcategories</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-left animate-fadeIn">
                      {categoryDetails.map((cat, idx) => {
                        const count = categoryCounts[cat.name] || 0;
                        return (
                          <div 
                            key={idx}
                            onClick={() => navigate(`/businesses?focus=categories&category=${encodeURIComponent(cat.name)}`)}
                            className="card-premium group rounded-3xl p-6 cursor-pointer flex flex-col justify-between h-36 relative overflow-hidden bg-white border border-slate-200/65 hover:border-[#027244] transition-all"
                          >
                            <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-slate-50 rounded-full group-hover:bg-emerald-50/40 transition-colors duration-500 pointer-events-none" />
                            <div className={`h-10 w-10 rounded-full ${cat.bg} flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-500 group-hover:scale-110`}>
                              {cat.icon}
                            </div>
                            <div className="flex flex-col z-10 mt-3">
                              <span className="font-extrabold text-[#001c41] text-[13px] leading-snug group-hover:text-[#027244] transition-colors duration-300 truncate">
                                {cat.name}
                              </span>
                              <span className="text-[10px] text-slate-450 font-extrabold mt-1 uppercase tracking-wide leading-none flex items-center gap-1">
                                <span>{count} Listings</span>
                                <span>•</span>
                                <span className="text-emerald-600 font-bold hover:underline">Explore →</span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : !selectedSubcategoryInExplore ? (
                  // State B: Subcategories grid (drilldown) under selected parent category.
                  // Occupies the entire right-side content pane.
                  <>
                    <div className="flex flex-col gap-4 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => navigate('/businesses?focus=categories')}
                          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#027244] bg-slate-100 hover:bg-emerald-50/50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" /> Back to Categories
                        </button>
                        <div className="h-4 w-px bg-slate-200" />
                        <h2 className="font-extrabold text-base text-[#001c41] flex items-center gap-2">
                          {renderCategoryIcon(parentIconStringMap[selectedCategoryInExplore], "h-5 w-5 text-[#027244]")}
                          {selectedCategoryInExplore}
                        </h2>
                      </div>
                      <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                        Select a subcategory to browse local listings under {selectedCategoryInExplore}.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left animate-fadeIn">
                      {/* "All" parent category card first */}
                      {(() => {
                        const totalCount = categoryCounts[selectedCategoryInExplore] || 0;
                        const parentIconStr = parentIconStringMap[selectedCategoryInExplore] || 'Store';
                        return (
                          <div 
                            onClick={() => navigate(`/businesses?focus=categories&category=${encodeURIComponent(selectedCategoryInExplore)}&subcategory=All`)}
                            className="bg-white border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-emerald-100 hover:bg-emerald-50/30 transition-all duration-300 group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-9 w-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-[#027244] group-hover:scale-110 transition-transform duration-300">
                                {renderCategoryIcon(parentIconStr, "h-4.5 w-4.5 text-[#027244]")}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-slate-700 group-hover:text-[#027244] transition-colors truncate">
                                  All {selectedCategoryInExplore}
                                </span>
                                <span className="text-[9px] text-slate-400 font-semibold mt-0.5 leading-none">
                                  {totalCount} active listing{totalCount !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                            <span className="text-[9px] font-extrabold text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded shrink-0">
                              All
                            </span>
                          </div>
                        );
                      })()}

                      {/* Other related subcategories */}
                      {relatedSubcategories.map((cat) => {
                        const count = allBusinesses.filter(b => b.category?.toLowerCase() === cat.categoryName.toLowerCase()).length;
                        return (
                          <div 
                            key={cat._id}
                            onClick={() => navigate(`/businesses?focus=categories&category=${encodeURIComponent(selectedCategoryInExplore)}&subcategory=${encodeURIComponent(cat.categoryName)}`)}
                            className="bg-white border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-emerald-100 hover:bg-emerald-50/30 transition-all duration-300 group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-100/50 flex items-center justify-center shrink-0 text-[#027244] group-hover:scale-110 transition-transform duration-300">
                                {renderCategoryIcon(cat.icon, "h-4.5 w-4.5 text-[#027244]")}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-slate-700 group-hover:text-[#027244] transition-colors truncate">
                                  {cat.categoryName}
                                </span>
                                <span className="text-[9px] text-slate-400 font-semibold mt-0.5 leading-none">
                                  {count} active listing{count !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                            <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded shrink-0">
                              👁 {cat.views || 0}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  // State C: Business listings list under the selected subcategory.
                  // Replaces the subcategories grid entirely.
                  <>
                    <div className="flex flex-col gap-4 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => navigate(`/businesses?focus=categories&category=${encodeURIComponent(selectedCategoryInExplore)}`)}
                          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#027244] bg-slate-100 hover:bg-emerald-50/50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" /> Back to {selectedCategoryInExplore}
                        </button>
                        <div className="h-4 w-px bg-slate-200" />
                        <h2 className="font-extrabold text-base text-[#001c41]">
                          {selectedSubcategoryInExplore === 'All' ? `All ${selectedCategoryInExplore}` : selectedSubcategoryInExplore}
                        </h2>
                      </div>
                      <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                        Found {filteredExploreBusinesses.length} active listing{filteredExploreBusinesses.length !== 1 ? 's' : ''} in {selectedSubcategoryInExplore === 'All' ? selectedCategoryInExplore : selectedSubcategoryInExplore}.
                      </p>
                    </div>

                    {filteredExploreBusinesses.length === 0 ? (
                      <div className="bg-white border border-slate-200/60 rounded-3xl py-16 px-6 text-center shadow-sm flex flex-col items-center justify-center gap-4 text-slate-400">
                        <AlertCircle className="h-10 w-10 text-slate-350" />
                        <div>
                          <h4 className="font-extrabold text-slate-700 text-base leading-none">No listings found</h4>
                          <p className="text-xs text-slate-400 font-semibold mt-2">There are currently no registered businesses under this subcategory.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-5">
                        {filteredExploreBusinesses.map((biz) => {
                          const isExpired = biz.subscriptionStatus === 'expired';
                          const isSubscribed = biz.subscriptionStatus === 'active';
                          return (
                            <div
                              key={biz._id}
                              className="relative card-premium group rounded-3xl overflow-hidden flex flex-col md:flex-row cursor-pointer"
                              onClick={() => navigate(`/businesses/${biz._id}`)}
                            >
                              {/* Cover image (Blurred if subscription is expired!) */}
                              <div className="shrink-0 overflow-hidden relative h-48 md:w-64 rounded-l-[23px]">
                                <div 
                                  className="h-full w-full bg-cover bg-center transition-transform duration-750 ease-out-expo group-hover:scale-105 rounded-l-[23px]"
                                  style={{
                                    backgroundImage: `url('${biz.coverImageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80"}')`,
                                    filter: !isSubscribed ? 'blur(6px) grayscale(30%)' : 'none'
                                  }}
                                />
                                {/* Badge (Verified / Premium / Google Linked) */}
                                {!isExpired && (
                                  <div className="absolute top-3 left-3 flex flex-wrap gap-1 z-10">
                                    {biz.isPremium && (
                                      <div className="bg-white border border-amber-100 px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                                        <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-current" />
                                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider">Premium</span>
                                      </div>
                                    )}
                                    {((biz.googlePlaceId && biz.googlePlaceId !== '') || (biz.googleBusinessLink && biz.googleBusinessLink !== '') || biz.googleLinked) && (
                                      <div className="bg-white border border-emerald-100 px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                                        <ShieldCheck className="h-3.5 w-3.5 text-[#027244]" />
                                        <span className="text-[9px] font-black text-[#027244] uppercase tracking-wider font-sans">UDT Verified</span>
                                      </div>
                                    )}
                                    {biz.googlePlaceId && (
                                      <div className="bg-white border border-blue-100 px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                                        <svg className="h-3.5 w-3.5 text-blue-500 fill-current" viewBox="0 0 24 24">
                                          <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 12.24 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.746-.08-1.32-.176-1.886H12.24z"/>
                                        </svg>
                                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-wider font-sans">Google Linked</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                                {isExpired && (
                                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center text-center p-2 text-white z-10">
                                    <span className="bg-red-650 text-[9px] font-extrabold uppercase px-2 py-1 rounded shadow">
                                      Subscription Expired
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Content Body */}
                              <div 
                                className="p-6 flex-1 flex flex-col md:flex-row justify-between gap-5 text-left"
                                style={{
                                  filter: !isSubscribed ? 'blur-[3.5px] select-none pointer-events-none' : 'none'
                                }}
                              >
                                <div className="flex flex-col gap-2">
                                  <Link
                                    to={`/businesses/${biz._id}`}
                                    className="font-black text-[19px] text-[#001c41] hover:text-[#027244] transition-colors leading-tight"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {biz.name}
                                  </Link>
                                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 mt-0.5">
                                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                                    <span>{biz.locality}, Udumalpet</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-slate-450 font-bold mt-0.5 select-none w-fit">
                                    <Folder className="h-3.5 w-3.5 text-[#027244] shrink-0" />
                                    <span>{biz.category}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-0.5 text-slate-600 text-xs">
                                    <div className="flex text-amber-400 shrink-0">
                                      {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-3 w-3 ${i < Math.floor(biz.googleRating || 0) ? 'fill-current' : 'text-slate-200'}`} />
                                      ))}
                                    </div>
                                    <span className="font-extrabold">{(biz.googleRating || 0).toFixed(1)}</span>
                                    <span className="text-[10px] text-slate-500 font-bold">({biz.googleReviewsCount || 0})</span>
                                  </div>
                                  {Array.isArray(biz.highlights) && (
                                    <div className="flex flex-wrap items-center gap-4 mt-2">
                                      {biz.highlights.map((h, i) => (
                                        <div key={i} className="flex items-center gap-1 text-[11px] text-[#027244] font-semibold">
                                          <span className="h-4 w-4 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center text-[9px] font-extrabold shrink-0">✓</span>
                                          <span>{h}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Right Panel Actions */}
                                <div className="flex flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0 md:w-36">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleCall(biz.phone, biz.name); }}
                                    className="py-2.5 w-full border border-[#027244] hover:bg-emerald-50 text-[#027244] font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <PhoneCall className="h-3.5 w-3.5" />
                                    <span>Call</span>
                                  </button>
                                  {!isExpired ? (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleWhatsApp(biz.whatsapp, biz.name); }}
                                      className="py-2.5 w-full bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                                    >
                                      <span>WhatsApp</span>
                                    </button>
                                  ) : (
                                    <span className="py-2.5 w-full bg-slate-100 text-slate-400 border border-slate-200 font-extrabold text-[10px] rounded-xl flex items-center justify-center select-none text-center leading-none">
                                      WhatsApp Locked
                                    </span>
                                  )}
                                  <Link
                                    to={`/businesses/${biz._id}`}
                                    className="py-2.5 w-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-555 font-extrabold text-xs rounded-xl flex items-center justify-center transition-colors text-center font-bold"
                                    onClick={(e) => e.stopPropagation()}
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
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Hot Categories (Always Present, Sticky) */}
          <aside className="lg:col-span-1 text-left">
            <div className="bg-white border border-slate-200/60 shadow-md rounded-[28px] p-6 flex flex-col gap-5 sticky top-6">
              <div className="flex flex-col border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-[#001c41] flex items-center gap-1.5">
                  <span className="text-amber-500">🔥</span> Hot Categories
                </h3>
                <span className="text-[9.5px] text-slate-400 font-semibold mt-0.5">Most viewed classifications</span>
              </div>

              {categoriesLoading && dbCategories.length === 0 ? (
                <div className="flex flex-col gap-3.5 py-4 animate-pulse">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-10 bg-slate-100 rounded-xl w-full" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-[560px] overflow-y-auto pr-1">
                  {hotCategories.map((cat) => {
                    const count = allBusinesses.filter(b => b.category?.toLowerCase() === cat.categoryName.toLowerCase()).length;
                    return (
                      <div 
                        key={cat._id}
                        onClick={() => handleHotCategoryClick(cat.categoryName, cat.parentCategory)}
                        className="flex items-center justify-between cursor-pointer group p-2.5 rounded-xl border border-transparent hover:border-emerald-100 hover:bg-emerald-50/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-100/50 flex items-center justify-center shrink-0 text-[#027244] group-hover:scale-110 transition-transform duration-300">
                            {renderCategoryIcon(cat.icon, "h-4 w-4 text-[#027244]")}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-slate-700 group-hover:text-[#027244] transition-colors truncate">
                              {cat.categoryName}
                            </span>
                            <span className="text-[9px] text-slate-400 font-semibold mt-0.5 leading-none">
                              {count} active listing{count !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded shrink-0">
                          👁 {cat.views || 0}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center bg-[#F8FAFC]">
      {/* Search Header Banner */}
      <section 
        className="w-full relative min-h-[260px] bg-slate-950 text-white py-10 px-4 md:px-8 border-b border-slate-800 bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(to bottom, rgba(0, 28, 65, 0.8), rgba(0, 28, 65, 0.95)), url('/thirumoorthy_hills.png')" }}
      >
        <div className="relative max-w-7xl mx-auto flex flex-col items-center z-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold self-start mt-2">
            <Link to="/" className="hover:text-[#f97316] transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-slate-100">Businesses</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-4 self-start font-sans">
            Businesses in Udumalpet
          </h1>
          <p className="text-slate-350 text-xs font-semibold self-start mt-1.5 leading-relaxed">
            Discover, compare and connect with the best local businesses.
          </p>
          
          <form onSubmit={handleSearchSubmit} className="mt-8 w-full bg-white border border-slate-200 shadow-xl rounded-2xl p-2 flex flex-col md:flex-row gap-2 max-w-5xl">
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
                value={selectedLocality === 'All Localities' ? '' : selectedLocality}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedLocality(val || 'All Localities');
                }}
                className="w-full bg-transparent text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="md:w-48 flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 relative">
              <Grid className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option>All Categories</option>
                {availableCategories.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs py-3 px-8 rounded-xl transition-all shadow-md shrink-0 cursor-pointer">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Two-column Content Grid */}
      <section className="max-w-7xl w-full px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filters */}
        <aside className="lg:col-span-1 bg-white border border-slate-200/80 shadow-md rounded-3xl p-6 flex flex-col gap-6 h-max">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="font-extrabold text-sm text-[#001c41] flex items-center gap-1.5">
              <Filter className="h-4.5 w-4.5 text-[#027244]" /> Filter Businesses
            </span>
            <button onClick={handleResetFilters} className="text-[10px] font-bold text-[#027244] hover:underline cursor-pointer">
              Reset All
            </button>
          </div>

          {/* Category Checkboxes */}
          <div className="flex flex-col gap-2.5 border-b border-slate-100 pb-5">
            <h4 className="font-extrabold text-xs text-[#001c41] uppercase tracking-wider">Category</h4>
            
            {/* Live Search Category Box */}
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search category" 
                value={categorySearchText}
                onChange={(e) => setCategorySearchText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#027244]"
              />
            </div>

            <div className="flex flex-col gap-2 mt-2 max-h-56 overflow-y-auto pr-1">
              {/* All Categories Checkbox */}
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedCategory === 'All Categories'}
                  onChange={(e) => handleCategoryCheckbox('All Categories', e.target.checked)}
                  className="h-4 w-4 text-[#027244] border-slate-300 rounded focus:ring-[#027244]"
                />
                <span>All Categories</span>
              </label>

              {filteredCategories.map((c) => (
                <label key={c} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!checkedCategories[c]}
                    onChange={(e) => handleCategoryCheckbox(c, e.target.checked)}
                    className="h-4 w-4 text-[#027244] border-slate-300 rounded focus:ring-[#027244]"
                  />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location Area Checkboxes */}
          <div className="flex flex-col gap-2.5 border-b border-slate-100 pb-5">
            <h4 className="font-extrabold text-xs text-[#001c41] uppercase tracking-wider">Location</h4>
            
            {/* Live Search Location Box */}
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search location" 
                value={localitySearchText}
                onChange={(e) => setLocalitySearchText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#027244]"
              />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              {/* Udumalpet checkbox acting as parent/all */}
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedLocality === 'All Localities'}
                  onChange={(e) => handleLocalityCheckbox('Udumalpet', e.target.checked)}
                  className="h-4 w-4 text-[#027244] border-slate-300 rounded focus:ring-[#027244]"
                />
                <span>Udumalpet</span>
              </label>

              {displayedLocalities.map((l) => (
                <label key={l} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!checkedLocalities[l]}
                    onChange={(e) => handleLocalityCheckbox(l, e.target.checked)}
                    className="h-4 w-4 text-[#027244] border-slate-300 rounded focus:ring-[#027244]"
                  />
                  <span>{l}</span>
                </label>
              ))}

              {filteredLocalities.length > 5 && (
                <button 
                  onClick={() => setShowAllLocalities(!showAllLocalities)}
                  className="text-[#027244] hover:text-[#005934] font-extrabold text-[10px] flex items-center gap-0.5 mt-1 cursor-pointer bg-transparent border-none text-left"
                >
                  {showAllLocalities ? (
                    <>Show Less <ChevronUp className="h-3.5 w-3.5" /></>
                  ) : (
                    <>Show More <ChevronDown className="h-3.5 w-3.5" /></>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Ratings Filters Checkboxes */}
          <div className="flex flex-col gap-2.5 border-b border-slate-100 pb-5">
            <h4 className="font-extrabold text-xs text-[#001c41] uppercase tracking-wider">Rating</h4>
            <div className="flex flex-col gap-2.5 mt-1">
              {[4, 3, 2, 1].map((r) => (
                <label key={r} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={selectedRating === r}
                    onChange={() => setSelectedRating(selectedRating === r ? null : r)}
                    className="h-4 w-4 text-[#027244] border-slate-300 rounded focus:ring-[#027244]"
                  />
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < r ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <span>({r} & above)</span>
                </label>
              ))}
            </div>
          </div>

          {/* Business verified/premium visibility toggle */}
          <div className="flex flex-col gap-2.5 pb-4">
            <h4 className="font-extrabold text-xs text-[#001c41] uppercase tracking-wider">Business Type</h4>
            <div className="flex flex-col gap-2.5 mt-1">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={verifiedFilter}
                  onChange={(e) => { setVerifiedFilter(e.target.checked); triggerQueryUpdate(); }}
                  className="h-4 w-4 text-[#027244] border-slate-300 rounded focus:ring-[#027244]"
                />
                <span>Verified Businesses</span>
              </label>
              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={premiumFilter}
                  onChange={(e) => { setPremiumFilter(e.target.checked); triggerQueryUpdate(); }}
                  className="h-4 w-4 text-[#027244] border-slate-300 rounded focus:ring-[#027244]"
                />
                <span>Premium Businesses</span>
              </label>
            </div>
          </div>

          {/* Apply Filters Green Button */}
          <button 
            onClick={() => fetchBusinesses()}
            className="w-full bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md shrink-0 cursor-pointer text-center"
          >
            Apply Filters
          </button>
        </aside>

        {/* Right Main Results Grid */}
        <main className="lg:col-span-3 flex flex-col gap-6">
          {/* Filters summary and sorting bar */}
          <div className="bg-white border border-slate-200 shadow-sm p-4.5 rounded-3xl flex justify-between items-center text-xs font-semibold text-slate-600">
            <span>
              Showing {businesses.length} result{businesses.length !== 1 ? 's' : ''} in Udumalpet
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); triggerQueryUpdate(); }}
                  className="py-1 px-2 border border-slate-300 bg-white rounded cursor-pointer font-bold focus:outline-none"
                >
                  <option>Most Relevant</option>
                  <option>Highest Rating</option>
                  <option>Newest</option>
                </select>
              </div>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-[#027244] text-white' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Grid className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-[#027244] text-white' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Cards Loading state */}
          {loading && (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <RefreshCw className="h-8 w-8 text-[#027244] animate-spin" />
              <span className="text-xs font-bold">Scanning local directory...</span>
            </div>
          )}

          {/* Empty Results state */}
          {!loading && businesses.length === 0 && (
            <div className="bg-white border border-slate-200/60 rounded-3xl py-16 px-6 text-center shadow-sm flex flex-col items-center justify-center gap-4 text-slate-400">
              <AlertCircle className="h-10 w-10 text-slate-300" />
              <div>
                <h4 className="font-extrabold text-slate-700 text-base leading-none">No businesses found</h4>
                <p className="text-xs text-slate-400 font-semibold mt-2">Try resetting your category or location filters above.</p>
              </div>
              <button onClick={handleResetFilters} className="py-2.5 px-6 bg-[#027244] hover:bg-[#005934] text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer mt-2">
                Clear Filters
              </button>
            </div>
          )}

          {/* Cards rendering List / Grid */}
          {!loading && businesses.length > 0 && (
            <div className={viewMode === 'list' ? 'flex flex-col gap-5' : 'grid grid-cols-1 md:grid-cols-3 gap-6'}>
              {businesses.map((biz) => {
                const isExpired = biz.subscriptionStatus === 'expired';
                const isSubscribed = biz.subscriptionStatus === 'active';
                
                return (
                  <div
                    key={biz._id}
                    className={`relative card-premium group rounded-3xl overflow-hidden flex cursor-pointer ${
                      viewMode === 'list' ? 'flex-col md:flex-row' : 'flex-col min-h-[460px]'
                    }`}
                  >
                    {/* Cover image (Blurred if subscription is expired!) */}
                    <div
                      className={`shrink-0 overflow-hidden relative ${
                        viewMode === 'list' ? 'h-48 md:w-64 rounded-l-[23px]' : 'h-56 w-full rounded-t-[23px]'
                      }`}
                    >
                      <div 
                        className={`h-full w-full bg-cover bg-center transition-transform duration-750 ease-out-expo group-hover:scale-105 ${
                          viewMode === 'list' ? 'rounded-l-[23px]' : 'rounded-t-[23px]'
                        }`}
                        style={{
                          backgroundImage: `url('${biz.coverImageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80"}')`,
                          filter: !isSubscribed ? 'blur(4px) grayscale(30%)' : 'none'
                        }}
                      />
                      {/* Badge (Verified / Premium / Google Linked) */}
                      {!isExpired && (
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1 z-10">
                          {biz.isPremium && (
                            <div className="bg-white border border-amber-100 px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                              <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-current" />
                              <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider">Premium</span>
                            </div>
                          )}
                          
                          {((biz.googlePlaceId && biz.googlePlaceId !== '') || (biz.googleBusinessLink && biz.googleBusinessLink !== '') || biz.googleLinked) && (
                            <div className="bg-white border border-emerald-100 px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                              <ShieldCheck className="h-3.5 w-3.5 text-[#027244]" />
                              <span className="text-[9px] font-black text-[#027244] uppercase tracking-wider font-sans">UDT Verified</span>
                            </div>
                          )}

                          {biz.googlePlaceId && (
                            <div className="bg-white border border-blue-100 px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                              <svg className="h-3.5 w-3.5 text-blue-500 fill-current" viewBox="0 0 24 24">
                                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 12.24 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.746-.08-1.32-.176-1.886H12.24z"/>
                              </svg>
                              <span className="text-[9px] font-black text-blue-600 uppercase tracking-wider font-sans">Google Linked</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Subscription expired lock overlay */}
                      {isExpired && (
                        <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center text-center p-2 text-white z-10">
                          <span className="bg-red-650 text-[9px] font-extrabold uppercase px-2 py-1 rounded shadow">
                            Subscription Expired
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Body */}
                    <div 
                      className="p-6 flex-1 flex flex-col md:flex-row justify-between gap-5"
                      style={{
                        filter: !isSubscribed ? 'blur-[3.5px] select-none pointer-events-none' : 'none'
                      }}
                    >
                      <div className="flex flex-col gap-2">
                        {/* Title */}
                        <Link
                          to={`/businesses/${biz._id}`}
                          className="font-black text-[19px] text-[#001c41] hover:text-[#027244] transition-colors leading-tight"
                        >
                          {biz.name}
                        </Link>

                        {/* Locality */}
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 mt-0.5">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>{biz.locality}, Udumalpet</span>
                        </div>

                        {/* Category */}
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            const parent = getParentCategory(biz.category);
                            navigate(`/businesses?focus=categories&category=${encodeURIComponent(parent)}`);
                          }}
                          className="flex items-center gap-1.5 text-xs text-slate-455 font-bold mt-0.5 hover:text-[#027244] hover:underline cursor-pointer transition-colors duration-200 select-none group/badge w-fit"
                        >
                          <Folder className="h-3.5 w-3.5 text-[#027244] shrink-0 transition-transform group-hover/badge:scale-110" />
                          <span>{biz.category}</span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mt-0.5 text-slate-600 text-xs">
                          <div className="flex text-amber-400 shrink-0">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < Math.floor(biz.googleRating || 0) ? 'fill-current' : 'text-slate-200'}`} />
                            ))}
                          </div>
                          <span className="font-extrabold">{(biz.googleRating || 0).toFixed(1)}</span>
                          <span className="text-[10px] text-slate-450 font-bold">({biz.googleReviewsCount || 0})</span>
                        </div>

                        {/* Highlights Chips */}
                        {Array.isArray(biz.highlights) && (
                          <div className="flex flex-wrap items-center gap-4 mt-2">
                            {biz.highlights.map((h, i) => (
                              <div key={i} className="flex items-center gap-1 text-[11px] text-[#027244] font-semibold">
                                <span className="h-4 w-4 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center text-[9px] font-extrabold shrink-0">✓</span>
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right Panel Actions */}
                      <div className="flex flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0 md:w-36">
                        {/* Call button */}
                        <button
                          onClick={() => handleCall(biz.phone, biz.name)}
                          className="py-2.5 w-full border border-[#027244] hover:bg-emerald-50 text-[#027244] font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <PhoneCall className="h-3.5 w-3.5" />
                          <span>Call</span>
                        </button>
                        
                        {/* WhatsApp button - HIDDEN on expired subscriptions! */}
                        {!isExpired ? (
                          <button
                            onClick={() => handleWhatsApp(biz.whatsapp, biz.name)}
                            className="py-2.5 w-full bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                          >
                            <span>WhatsApp</span>
                          </button>
                        ) : (
                          <span className="py-2.5 w-full bg-slate-100 text-slate-400 border border-slate-200 font-extrabold text-[10px] rounded-xl flex items-center justify-center select-none text-center leading-none">
                            WhatsApp Locked
                          </span>
                        )}

                        <Link
                          to={`/businesses/${biz._id}`}
                          className="py-2.5 w-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-555 font-extrabold text-xs rounded-xl flex items-center justify-center transition-colors text-center"
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
          )}

          {/* Pagination Component exactly like mockup */}
          <div className="flex justify-center items-center gap-1.5 mt-10 select-none">
            <button className="h-9 w-9 rounded-lg bg-[#027244] text-white font-extrabold text-xs flex items-center justify-center shadow">1</button>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center justify-center transition-colors">2</button>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center justify-center transition-colors">3</button>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center justify-center transition-colors">4</button>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center justify-center transition-colors">5</button>
            <span className="text-slate-400 px-1 text-xs">...</span>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center justify-center transition-colors">21</button>
            <button className="px-3 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center justify-center transition-colors">Next</button>
          </div>
        </main>
      </section>

      {/* Footer Trust Bar & Business Callout (Combined in one gorgeous container as per mockup crop) */}
      <div className="max-w-7xl w-full border border-slate-200/80 bg-white rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 mt-12 shadow-sm font-sans">
        
        {/* Left Col (Col-span-9): Solid Navy Blue panel with 4 trust columns separated by lines */}
        <div className="lg:col-span-9 bg-[#001c41] text-white p-7 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {[
            {
              icon: (
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              ),
              title: 'Verified Businesses',
              desc: 'All businesses are manually verified'
            },
            {
              icon: (
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 11 2 2 4-4" />
                </svg>
              ),
              title: 'Safe & Trusted',
              desc: 'Connect with reliable local businesses'
            },
            {
              icon: (
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  <path d="M14 2h.01M18 2h.01M16 6h.01" strokeWidth="3" />
                </svg>
              ),
              title: 'Easy to Connect',
              desc: 'Call, WhatsApp or get directions instantly'
            },
            {
              icon: (
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              ),
              title: 'Grow Together',
              desc: 'Support local and grow the community'
            }
          ].map((item, idx) => (
            <div key={idx} className={`flex flex-col items-center text-center gap-2 px-2 ${idx < 3 ? 'sm:border-r border-slate-700/60' : ''}`}>
              <div className="text-white shrink-0 mb-1">
                {item.icon}
              </div>
              <span className="font-extrabold text-white text-xs leading-none">{item.title}</span>
              <span className="text-[10px] text-slate-350 font-semibold leading-normal mt-1 max-w-[130px]">{item.desc}</span>
            </div>
          ))}
        </div>

        {/* Right Col (Col-span-3): White panel with Left-aligned Owner Callout & List Business Green Button */}
        <div className="lg:col-span-3 bg-white p-7 flex flex-col justify-center items-start gap-3.5 pl-8 border-t lg:border-t-0 lg:border-l border-slate-200/80">
          <div className="flex flex-col gap-1 text-left">
            <span className="font-black text-[#001c41] text-sm">Are you a business owner?</span>
            <span className="text-slate-500 text-[10.5px] font-semibold leading-relaxed max-w-[200px]">
              List your business and reach thousands of local customers.
            </span>
          </div>
          <Link 
            to="/add-business" 
            className="bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs py-2.5 px-6 rounded-xl transition-all shadow shrink-0"
          >
            List Your Business
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function BusinessesingsPage() {
  return (
    <Suspense fallback={
      <div className="py-32 flex flex-col items-center justify-center gap-2 text-slate-400">
        <RefreshCw className="h-6 w-6 animate-spin text-[#027244]" />
        <span className="text-xs font-semibold">Loading platform...</span>
      </div>
    }>
      <BusinessesList />
    </Suspense>
  );
}
