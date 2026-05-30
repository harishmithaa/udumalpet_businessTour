import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, ArrowRight, Upload, Sparkles, CheckCircle2, ChevronRight, Eye, RefreshCw, AlertCircle, AlertTriangle, Lock, Briefcase, Lightbulb, Headset, Phone, Mail, Clock, Search } from 'lucide-react';
import MockGoogleMaps from '@/components/MockGoogleMaps';

const steps = [
  { id: 1, name: 'Basic Info' },
  { id: 2, name: 'Business Details' },
  { id: 3, name: 'Contact & Location' },
  { id: 4, name: 'Photos & Media' },
  { id: 5, name: 'Review & Submit' },
];

export default function AddBusiness() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'Grocery Stores',
    customCategoryName: '',
    categoryStatus: 'Normal',
    type: 'Individual / Sole Proprietor',
    description: '',
    yearEstablished: '',
    employeeCount: '1 - 5',
    gstNumber: '',
    services: '',
    brands: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    locality: '',
    city: 'Udumalpet',
    state: 'Tamil Nadu',
    pincode: '', // Starts empty to force validation in Step 1
    isAddressVerified: false,
    logoUrl: '',
    coverImageUrl: '',
    galleryUrls: [],
    googlePlaceId: '',
    googleRating: 0,
    googleReviewsCount: 0,
    googleReviews: [],
    coordinates: { lat: 10.585, lng: 77.251 },
    timings: {
      Monday: '9:00 AM - 8:00 PM',
      Tuesday: '9:00 AM - 8:00 PM',
      Wednesday: '9:00 AM - 8:00 PM',
      Thursday: '9:00 AM - 8:00 PM',
      Friday: '9:00 AM - 8:00 PM',
      Saturday: '9:00 AM - 8:00 PM',
      Sunday: '9:00 AM - 1:00 PM',
    },
  });

  // Pincode Verification State (If pincode is empty, show check screen)
  const [isPincodeVerified, setIsPincodeVerified] = useState(false);

  // Sync isPincodeVerified when draft is loaded
  useEffect(() => {
    if (formData.pincode) {
      setIsPincodeVerified(true);
    }
  }, [formData.pincode]);

  // Fetch categories dynamically on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/categories');
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data)) {
          setDbCategories(data.data);
        }
      } catch (err) {
        console.error('Error fetching categories from backend:', err);
      }
    };
    fetchCategories();
  }, []);

  // Photo uploads simulation states
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  // Auto fill input state
  const [googleQuery, setGoogleQuery] = useState('');
  const [autofillLoading, setAutofillLoading] = useState(false);
  const [autofillSuccess, setAutofillSuccess] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Category management dynamic states
  const [dbCategories, setDbCategories] = useState([]);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [categoryWarning, setCategoryWarning] = useState('');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const fetchUserBusinessFromServer = async (authToken) => {
    try {
      const res = await fetch('http://localhost:5000/api/businesses/my-business', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      
      if (data.success && data.data) {
        const biz = data.data;
        
        // Check if there are local unsaved edits for this business
        const localEditDraft = localStorage.getItem('ubt_edit_draft');
        if (localEditDraft) {
          try {
            const parsedLocal = JSON.parse(localEditDraft);
            if (parsedLocal._id === biz._id) {
              populateDraft(parsedLocal);
              if (biz.subscriptionStatus === 'active') {
                setIsEditing(true);
                setIsPincodeVerified(true);
              }
              return;
            }
          } catch (e) {
            console.error('Error parsing local edit draft:', e);
          }
        }

        populateDraft(biz);
        if (biz.subscriptionStatus === 'active') {
          setIsEditing(true);
          setIsPincodeVerified(true);
        }
      }
    } catch (err) {
      console.warn('Failed to load user business from server:', err);
    }
  };

  const populateDraft = (draft) => {
    setFormData((prev) => ({
      ...prev,
      ...draft,
      services: Array.isArray(draft.services) ? draft.services.join(', ') : (draft.services || ''),
      brands: Array.isArray(draft.brands) ? draft.brands.join(', ') : (draft.brands || ''),
    }));
    if (draft.category) {
      if (draft.category === 'Others') {
        setCategorySearchQuery(draft.customCategoryName || '');
      } else {
        setCategorySearchQuery(draft.category);
      }
    }
    if (draft.logoUrl) setLogoFile('draft_logo.png');
    if (draft.coverImageUrl) setCoverFile('draft_cover.png');
    if (draft.galleryUrls && draft.galleryUrls.length > 0) {
      setGalleryFiles(draft.galleryUrls.map((url, i) => `draft_gallery_${i}.png`));
    }
  };

  const saveDraft = async (updatedData) => {
    try {
      if (isEditing) {
        // Save editing state locally so they don't lose progress if they refresh/leave,
        // but don't overwrite the live backend database yet.
        localStorage.setItem('ubt_edit_draft', JSON.stringify(updatedData));
        return;
      }

      const storedToken = localStorage.getItem('ubt_token') || token;
      if (!storedToken) return;

      const servicesList = updatedData.services && typeof updatedData.services === 'string'
        ? updatedData.services.split(',').map(s => s.trim())
        : updatedData.services;
      const brandsList = updatedData.brands && typeof updatedData.brands === 'string'
        ? updatedData.brands.split(',').map(b => b.trim())
        : updatedData.brands;

      const payload = {
        ...updatedData,
        services: servicesList,
        brands: brandsList,
      };

      await fetch('http://localhost:5000/api/businesses/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Failed to auto-save draft to server:', err);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('ubt_token');
    const storedUser = localStorage.getItem('ubt_user');
    
    if (!storedToken || !storedUser) {
      // Force login before listing a business!
      navigate('/login');
    } else {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));

        // Read step parameter if any
        const stepParam = parseInt(searchParams.get('step'));
        if (stepParam >= 1 && stepParam <= 5) {
          setCurrentStep(stepParam);
        }

        const storedDraft = localStorage.getItem('ubt_draft_business');
        if (storedDraft) {
          try {
            const draft = JSON.parse(storedDraft);
            populateDraft(draft);
            localStorage.removeItem('ubt_draft_business');
          } catch (e) {
            console.error('Error loading draft business:', e);
          }
        } else {
          fetchUserBusinessFromServer(storedToken);
        }
      } catch (err) {
        console.error('Failed to parse user details from localStorage:', err);
        localStorage.removeItem('ubt_user');
        localStorage.removeItem('ubt_token');
        navigate('/login');
      }
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const allCategories = [
    ...(dbCategories.length > 0 ? dbCategories.map(c => c.categoryName).filter(name => name !== 'Others') : [
      'Grocery Stores', 'Supermarkets', 'Vegetable & Fruit Shops', 'Textile & Garments', 'Footwear Shops',
      'Mobile Stores', 'Computer & Laptop Stores', 'Electronics & Appliances', 'Jewelry Shops', 'Gift Shops',
      'Stationery & Book Stores', 'Furniture Shops', 'Hardware Stores', 'Paint Stores', 'Pet Shops',
      'Restaurants', 'Hotels & Lodges', 'Bakeries', 'Cafes & Tea Shops', 'Sweet Shops', 'Fast Food Centers',
      'Catering Services', 'Juice & Ice Cream Parlors', 'Hospitals', 'Clinics', 'Dental Clinics', 'Pharmacies',
      'Diagnostic Labs', 'Physiotherapy Centers', 'Veterinary Clinics', 'Beauty Parlours', 'Salons & Barbers',
      'Spa & Wellness Centers', 'Cosmetic Stores', 'Schools', 'Colleges', 'Tuition Centers', 'Coaching Institutes',
      'Computer Training Centers', 'Driving Schools', 'Car Showrooms', 'Bike Showrooms', 'Automobile Service Centers',
      'Car Wash Services', 'Tyre Shops', 'Spare Parts Dealers', 'Petrol Bunks', 'Electricians', 'Plumbers',
      'Carpenters', 'AC Service & Repair', 'Home Cleaning Services', 'Interior Designers', 'Pest Control Services',
      'Builders & Contractors', 'Real Estate Agencies', 'Construction Material Suppliers', 'Cement & Steel Dealers',
      'Architects', 'Borewell Services', 'Farm Equipment Dealers', 'Coconut Traders', 'Fertilizer & Pesticide Shops',
      'Dairy Farms', 'Poultry Farms', 'Agricultural Consultants', 'Irrigation Equipment Suppliers', 'Chartered Accountants',
      'Auditors', 'Advocates / Lawyers', 'Tax Consultants', 'Insurance Agents', 'Financial Advisors', 'Event Organizers',
      'Wedding Planners', 'Photography & Videography', 'Decoration Services', 'Sound & Lighting Services', 'Printing & Flex Services',
      'Travel Agencies', 'Tours & Travels', 'Vehicle Rentals', 'Taxi Services', 'Bus Operators', 'Gyms', 'Yoga Centers',
      'Sports Academies', 'Sports Equipment Stores', 'Temples', 'Marriage Halls', 'Community Halls', 'Trusts & NGOs'
    ]),
    'Others'
  ];

  const handleCategorySearchChange = (val) => {
    setCategorySearchQuery(val);
    setShowCategoryDropdown(true);

    if (!val.trim()) {
      const updated = {
        ...formData,
        category: '',
        customCategoryName: '',
        categoryStatus: 'Normal'
      };
      setFormData(updated);
      saveDraft(updated);
      setCategorySuggestions([]);
      setCategoryWarning('');
      return;
    }

    const exactMatch = allCategories.find(c => c.toLowerCase() === val.trim().toLowerCase() && c !== 'Others');
    if (exactMatch) {
      const updated = {
        ...formData,
        category: exactMatch,
        customCategoryName: '',
        categoryStatus: 'Normal'
      };
      setFormData(updated);
      saveDraft(updated);
      setCategorySuggestions([]);
      setCategoryWarning('');
    } else if (val.trim().toLowerCase() === 'others') {
      const updated = {
        ...formData,
        category: 'Others',
        customCategoryName: formData.customCategoryName || '',
        categoryStatus: formData.customCategoryName?.trim() ? 'Pending Review' : 'Normal'
      };
      setFormData(updated);
      saveDraft(updated);
    } else {
      const updated = {
        ...formData,
        category: 'Others',
        customCategoryName: val,
        categoryStatus: 'Pending Review'
      };
      setFormData(updated);
      saveDraft(updated);
      handleCustomCategoryChange(val);
    }
  };

  const handleCustomCategoryChange = async (val) => {
    const updated = {
      ...formData,
      customCategoryName: val,
      categoryStatus: val.trim() ? 'Pending Review' : 'Normal'
    };
    setFormData(updated);
    saveDraft(updated);

    if (!val.trim()) {
      setCategorySuggestions([]);
      setCategoryWarning('');
      return;
    }

    try {
      // 1. Fetch autocomplete suggestions
      const suggestionsRes = await fetch(`http://localhost:5000/api/categories/autocomplete/suggestions?q=${encodeURIComponent(val)}`);
      const suggestionsData = await suggestionsRes.json();
      if (suggestionsData.success && Array.isArray(suggestionsData.data)) {
        setCategorySuggestions(suggestionsData.data);
      } else {
        setCategorySuggestions([]);
      }

      // 2. Fetch duplicate warnings
      const duplicateRes = await fetch('http://localhost:5000/api/categories/check-duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName: val })
      });
      const duplicateData = await duplicateRes.json();
      if (duplicateData.success && duplicateData.isDuplicate) {
        setCategoryWarning(duplicateData.message);
      } else {
        setCategoryWarning('');
      }
    } catch (err) {
      console.error('Error conducting category search:', err);
    }
  };

  const selectSuggestedCategory = (catName) => {
    const updated = {
      ...formData,
      category: catName,
      customCategoryName: '',
      categoryStatus: 'Normal'
    };
    setFormData(updated);
    saveDraft(updated);
    setCategorySuggestions([]);
    setCategoryWarning('');
  };

  // Google Places API auto-fill simulator
  const handleGoogleAutofill = async (e) => {
    e.preventDefault();
    if (!googleQuery) return;

    setAutofillLoading(true);
    setError('');
    setAutofillSuccess(false);

    try {
      const res = await fetch('http://localhost:5000/api/businesses/google-autofill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nameOrUrl: googleQuery }),
      });
      const data = await res.json();
      if (data.success) {
        const d = data.data;
        const updated = {
          ...formData,
          name: d.name,
          address: d.address,
          phone: d.phone,
          whatsapp: d.whatsapp,
          email: d.email || formData.email,
          locality: d.locality,
          pincode: d.pincode,
          isAddressVerified: d.isAddressVerified,
          yearEstablished: d.yearEstablished,
          employeeCount: d.employeeCount,
          services: d.services.join(', '),
          brands: d.brands.join(', '),
          googlePlaceId: d.googlePlaceId,
          googleRating: d.googleRating,
          googleReviewsCount: d.googleReviewsCount,
          googleReviews: d.googleReviews,
          coordinates: d.coordinates,
          timings: d.timings,
          logoUrl: `https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150&q=80`, // default abstract logo
          coverImageUrl: `https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80`, // default shop cover
          galleryUrls: [
            'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80',
          ],
        };
        setFormData(updated);
        
        // Mock files list to satisfy photos validation
        setLogoFile('google_autofill_logo.png');
        setCoverFile('google_autofill_cover.png');
        setGalleryFiles(['gallery1.png', 'gallery2.png', 'gallery3.png']);

        setAutofillSuccess(true);
        saveDraft(updated);
      }
    } catch (err) {
      setError('Google Business lookup failed. Try manual entry.');
    } finally {
      setAutofillLoading(false);
    }
  };

  const handleAddressSelect = (addrDetails) => {
    const updated = {
      ...formData,
      address: addrDetails.address,
      locality: addrDetails.locality,
      coordinates: addrDetails.coordinates,
      isAddressVerified: addrDetails.isVerified,
    };
    setFormData(updated);
    saveDraft(updated);
  };

  const handleLogoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0].name);
      const updated = { ...formData, logoUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150&q=80' };
      setFormData(updated);
      saveDraft(updated);
    }
  };

  const handleCoverUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0].name);
      const updated = { ...formData, coverImageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80' };
      setFormData(updated);
      saveDraft(updated);
    }
  };

  const handleGalleryUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map(f => f.name);
      setGalleryFiles(prev => [...prev, ...names]);
      const updated = {
        ...formData,
        galleryUrls: [
          'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80',
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80',
        ]
      };
      setFormData(updated);
      saveDraft(updated);
    }
  };

  const validateStep = () => {
    setError('');
    if (currentStep === 1) {
      if (!formData.name || !formData.description) {
        setError('Business Name and description are mandatory.');
        return false;
      }
      if (!formData.pincode) {
        setError('You must select and validate a valid Udumalpet area pincode to proceed.');
        return false;
      }
      if (formData.category === 'Others' && (!formData.customCategoryName || !formData.customCategoryName.trim())) {
        setError('Please enter your custom business category name.');
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.phone || !formData.whatsapp) {
        setError('Phone number and WhatsApp are mandatory.');
        return false;
      }
    } else if (currentStep === 4) {
      // Validate photos: logo, cover, and gallery. Minimum 3 gallery/photos required.
      const totalPhotos = (logoFile ? 1 : 0) + (coverFile ? 1 : 0) + galleryFiles.length;
      if (totalPhotos < 3) {
        setError('Minimum 3 images are required for profile (Logo + Cover + Gallery). Please upload more photos.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      saveDraft(formData);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setError('');
    saveDraft(formData);
    setCurrentStep((prev) => prev - 1);
  };

  const handleFormSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      // Parse list strings to arrays
      const servicesList = formData.services && typeof formData.services === 'string'
        ? formData.services.split(',').map(s => s.trim())
        : (formData.services || []);
      const brandsList = formData.brands && typeof formData.brands === 'string'
        ? formData.brands.split(',').map(b => b.trim())
        : (formData.brands || []);

      const payload = {
        ...formData,
        services: servicesList,
        brands: brandsList,
      };

      const url = isEditing
        ? `http://localhost:5000/api/businesses/${formData._id}`
        : 'http://localhost:5000/api/businesses';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.removeItem('ubt_draft_business');
        localStorage.removeItem('ubt_edit_draft');

        // Sync local storage user cached session to merchant role
        const cachedUser = localStorage.getItem('ubt_user');
        if (cachedUser) {
          try {
            const parsed = JSON.parse(cachedUser);
            if (parsed.role === 'visitor') {
              parsed.role = 'merchant';
              localStorage.setItem('ubt_user', JSON.stringify(parsed));
            }
          } catch (e) {
            console.error('Failed to sync local user role update:', e);
          }
        }

        if (isEditing) {
          navigate('/dashboard?message=profile_updated');
        } else {
          // Successfully submitted! Redirect to dashboard
          navigate('/dashboard?message=listing_created');
        }
      } else {
        setError(data.message || 'Failed to submit business listing.');
      }
    } catch (err) {
      setError('Connection failed. Server might be offline.');
    } finally {
      setLoading(false);
    }
  };

  if (!isPincodeVerified) {
    return (
      <div className="w-full min-h-[85vh] bg-slate-50 py-16 px-4 md:px-8 font-sans flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl flex flex-col gap-6 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col gap-2 text-center items-center">
            <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-inner">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight mt-2">Location Eligibility Check</h2>
            <p className="text-slate-450 text-xs font-semibold leading-relaxed px-2">
              Udumalpet Business Tour accepts listings situated strictly within the Udumalpet (UDT) region. Please select your pincode to begin.
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Select Business Pincode <span className="text-red-500">*</span></label>
              <select
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full py-3 px-4 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 cursor-pointer"
              >
                <option value="">-- Choose Pincode --</option>
                <option value="642126">642126 - Udumalpet Main Town (Head Post Office, Bazaar, East, South, Eripalayam)</option>
                <option value="642207">642207 - Pungamuthur (Erisinampatti, Devanurpudur, Vilamarathupatti, Udukkampalayam)</option>
                <option value="642154">642154 - Bodipatti & Gandhi Nagar (Andiyagoundanur, Kuralkuttai, Thumbalapatti, Elayamuthur)</option>
                <option value="642112">642112 - Dhali (Thirumoorthi Nagar, Jallipatti, Manupatti, Kurichikottai)</option>
                <option value="642205">642205 - Pethappampatti (Kongalnagaram, Poosaripatti, Pudupalayam, Dhottampatti, Vadugapalayam)</option>
                <option value="642122">642122 - Poolankinar (Anthiyur, Ganapathipalayam, Kodingium, Senjellappagoundenpudur)</option>
                <option value="642204">642204 - Komaralingam & Kolumam (Rudrapalayam, Samarayapatti, Pappankulam, Uralpatti)</option>
                <option value="642201">642201 - Gudimangalam (Amandakadavoo, Kondampatti, Kottamangalam, Periapatti)</option>
                <option value="642203">642203 - Kaniyur (Kadathur, Myvadi, Karatholuvu, Thungavi, Metrathi)</option>
                <option value="642102">642102 - Amaravathi Nagar (Kallapuram, Amaravathi Dam area)</option>
                <option value="642128">642128 - Venkatesa Mills (S V Puram)</option>
                <option value="642113">642113 - Madathukulam (Solamadevi, Sarkarkannadipudur)</option>
                <option value="642206">642206 - Poolavadi (Aathukinathupatti, Munduvelampatti)</option>
                <option value="642132">642132 - Valavadi (Dheepalapatti, Sundakkampalayam)</option>
                <option value="642111">642111 - Agrahara Kannadiputhur (Krishnapuram)</option>
              </select>
            </div>

            {/* Note */}
            <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-4.5 text-xs text-amber-800 leading-relaxed font-semibold">
              <span className="font-extrabold text-amber-900 block mb-0.5">ℹ️ Only UDT Pincodes Allowed</span>
              Businesses registered outside Udumalpet division postal zones are automatically rejected by our administrators during the vetting phase.
            </div>

            {error && (
              <div className="text-red-650 text-xs font-semibold bg-red-50 border border-red-200 p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="py-3.5 px-5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={() => {
                  if (!formData.pincode) {
                    setError("Please select a pincode to verify eligibility.");
                    return;
                  }
                  setError("");
                  setIsPincodeVerified(true);
                  // Save draft immediately with verified pincode
                  saveDraft({ ...formData });
                }}
                className="py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-emerald-700/20 cursor-pointer flex items-center justify-center gap-1.5 flex-grow"
              >
                Verify Pincode & Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[90vh] bg-slate-50 font-sans pb-16">
      {/* Scenic Banner Header */}
      <div className="w-full bg-[#001c41] py-16 px-4 md:px-8 relative overflow-hidden text-white font-sans text-center md:text-left select-none border-b border-slate-800 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay z-0"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001736] via-[#001c41]/90 to-[#027244]/40 z-0" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold uppercase tracking-wider justify-center md:justify-start">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-slate-500" />
            <span className="text-slate-200">{isEditing ? 'Edit Profile' : 'Add Business'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
            {isEditing ? 'Edit Your Business Profile' : 'Add Your Business'}
          </h1>
          <p className="text-slate-300 text-sm font-semibold max-w-xl">
            {isEditing
              ? 'Update your business details, photos, and timings to keep your customers informed.'
              : 'Join Udumalpet Business Tour, showcase your products and services, and connect with thousands of local customers.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Form & Stepper (lg:col-span-2) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Step-by-Step progress indicators */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                <div 
                  className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
                
                {steps.map((step) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = step.id < currentStep;
                  return (
                    <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
                      <div 
                        className={`h-9 w-9 rounded-full font-bold text-xs flex items-center justify-center border shadow transition-all ${
                          isCompleted 
                            ? 'bg-emerald-600 border-emerald-600 text-white' 
                            : isActive 
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-600 ring-4 ring-emerald-100' 
                              : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        {isCompleted ? '✓' : step.id}
                      </div>
                      <span className={`text-[10px] md:text-xs font-bold ${isActive ? 'text-slate-800' : 'text-slate-405'}`}>
                        {step.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Global Error Banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-650 rounded-2xl p-4 text-xs font-semibold flex items-start gap-2.5 shadow-sm animate-shake">
                <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Body Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm flex flex-col gap-6">
              
              {/* STEP 1: Basic Info */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-6 animate-fadeIn">
                  {/* Google Autofill Banner */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 fill-current animate-spin-slow" /> Google Place Auto-Fill
                      </span>
                      <h4 className="font-extrabold text-slate-800 text-sm">Save time with Google Business!</h4>
                      <p className="text-slate-400 text-xs font-semibold">Enter your business name or Google Maps URL to auto-populate the form instantly.</p>
                    </div>
                    <div className="flex items-center gap-2.5 w-full md:w-auto relative">
                      <input
                        type="text"
                        placeholder="Enter Business Name..."
                        value={googleQuery}
                        onChange={(e) => setGoogleQuery(e.target.value)}
                        className="py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-xs font-semibold w-full md:w-60 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                      />
                      <button 
                        onClick={handleGoogleAutofill}
                        disabled={autofillLoading}
                        className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-70 flex items-center gap-1.5"
                      >
                        {autofillLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Auto-Fill'}
                      </button>
                    </div>
                  </div>

                  {autofillSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-3.5 text-xs font-semibold flex items-center gap-2.5 animate-slideDown">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      <span>Success! Google Business details loaded beautifully. Verify and click next!</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-5">
                    <div className="border-b border-slate-100 pb-3 flex flex-col gap-1">
                      <h3 className="text-lg font-extrabold text-slate-805">1. Basic Information</h3>
                      <p className="text-slate-400 text-xs font-semibold">Tell us the basic details about your business.</p>
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Business Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your business name"
                        className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 relative">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Business Category <span className="text-red-500">*</span></label>
                      
                      <div className="relative">
                        <input
                          type="text"
                          value={categorySearchQuery}
                          onFocus={() => setShowCategoryDropdown(true)}
                          onChange={(e) => handleCategorySearchChange(e.target.value)}
                          placeholder="Search or type a new custom category..."
                          className="w-full py-2.5 pl-3.5 pr-10 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                        />
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400">
                          <Search className="h-4 w-4" />
                        </div>
                      </div>

                      {showCategoryDropdown && (
                        <>
                          <div className="fixed inset-0 z-20 cursor-default" onClick={() => setShowCategoryDropdown(false)} />
                          
                          <div className="absolute top-[100%] left-0 w-full bg-white border border-slate-200 rounded-xl shadow-xl mt-1 overflow-hidden z-30 flex flex-col max-h-60 overflow-y-auto animate-scaleUp">
                            {allCategories.filter(cat => cat.toLowerCase().includes(categorySearchQuery.toLowerCase())).length > 0 ? (
                              allCategories.filter(cat => cat.toLowerCase().includes(categorySearchQuery.toLowerCase())).map(cat => (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() => {
                                    const updated = {
                                      ...formData,
                                      category: cat,
                                      customCategoryName: cat === 'Others' ? (formData.customCategoryName || '') : '',
                                      categoryStatus: cat === 'Others' && formData.customCategoryName?.trim() ? 'Pending Review' : 'Normal'
                                    };
                                    setFormData(updated);
                                    saveDraft(updated);
                                    setCategorySearchQuery(cat);
                                    setCategorySuggestions([]);
                                    setCategoryWarning('');
                                    setShowCategoryDropdown(false);
                                  }}
                                  className="w-full text-left py-2.5 px-4 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-between border-b border-slate-50 last:border-b-0 cursor-pointer"
                                >
                                  <span>{cat}</span>
                                  <span className="text-[9px] text-slate-400 bg-slate-100 py-0.5 px-2.5 rounded-full font-bold">Select</span>
                                </button>
                              ))
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = {
                                    ...formData,
                                    category: 'Others',
                                    customCategoryName: categorySearchQuery,
                                    categoryStatus: 'Pending Review'
                                  };
                                  setFormData(updated);
                                  saveDraft(updated);
                                  setCategorySearchQuery('Others');
                                  setShowCategoryDropdown(false);
                                }}
                                className="w-full text-left py-2.5 px-4 hover:bg-blue-50/50 text-blue-700 text-xs font-bold transition-all flex items-center justify-between cursor-pointer border-none"
                              >
                                <div className="flex flex-col text-left">
                                  <span className="text-[9px] text-blue-800 font-extrabold uppercase leading-none">Register as custom category</span>
                                  <span className="text-xs font-black text-slate-800 mt-1">"{categorySearchQuery}"</span>
                                </div>
                                <span className="text-[9px] bg-blue-100 text-blue-800 font-extrabold px-2.5 py-0.5 rounded-full">Select</span>
                              </button>
                            )}
                          </div>
                        </>
                      )}

                      {formData.category === 'Others' && (
                        <div className="flex flex-col gap-1.5 mt-2 animate-fadeIn relative text-left">
                          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Enter Your Custom Category <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="customCategoryName"
                            value={formData.customCategoryName || ''}
                            onChange={(e) => handleCustomCategoryChange(e.target.value)}
                            placeholder="e.g. Drone Services, EV Charging Station, Solar Energy Solutions"
                            className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                          />
                          
                          {categorySuggestions.length > 0 && (
                            <div className="absolute top-[100%] left-0 w-full bg-white border border-slate-200 rounded-xl shadow-lg mt-1 overflow-hidden z-25 flex flex-col max-h-48 overflow-y-auto text-left">
                              <span className="text-[10px] text-slate-400 font-extrabold uppercase bg-slate-50 py-1.5 px-3 border-b border-slate-100">Did you mean one of these existing categories?</span>
                              {categorySuggestions.map(sug => (
                                <button
                                  key={sug._id}
                                  type="button"
                                  onClick={() => selectSuggestedCategory(sug.categoryName)}
                                  className="w-full text-left py-2 px-3 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-between border-b border-slate-50 last:border-b-0 cursor-pointer"
                                >
                                  <span>{sug.categoryName}</span>
                                  <span className="text-[10px] text-emerald-600 bg-emerald-50 py-0.5 px-2 rounded-full font-extrabold">Select</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {categoryWarning && (
                            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs font-semibold flex items-center gap-2.5 mt-2 animate-fadeIn text-left">
                              <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />
                              <span>{categoryWarning}</span>
                            </div>
                          )}

                          <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-4 mt-3 flex flex-col gap-1.5 text-xs text-left animate-fadeIn">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-blue-900">Category Status:</span>
                              <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide">
                                Pending Review
                              </span>
                            </div>
                            <p className="text-blue-750 font-semibold leading-relaxed">
                              "Your custom category request will be dynamically verified and approved/linked by superadmin upon publication."
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Business Type <span className="text-red-500">*</span></label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-1.5">
                        {['Individual / Sole Proprietor', 'Company / LLP', 'Partnership', 'Other'].map((typeOption) => (
                          <label 
                            key={typeOption} 
                            className={`flex items-center gap-2.5 p-3.5 border rounded-2xl cursor-pointer text-xs font-bold transition-all ${
                              formData.type === typeOption 
                                ? 'bg-emerald-50/40 border-emerald-600 text-emerald-850 shadow-sm' 
                                : 'bg-white border-slate-200 hover:border-slate-350 text-slate-500'
                            }`}
                          >
                            <input
                              type="radio"
                              name="type"
                              value={typeOption}
                              checked={formData.type === typeOption}
                              onChange={handleInputChange}
                              className="accent-emerald-600 h-4 w-4"
                            />
                            <span>{typeOption}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Short Business Description <span className="text-red-500">*</span></label>
                        <span className="text-[10px] text-slate-405 font-extrabold">{formData.description.length} / 250</span>
                      </div>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        maxLength={250}
                        placeholder="Write a short description about your business..."
                        className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 resize-none"
                      />
                    </div>

                    {/* Udumalpet Pincode Badge */}
                    <div className="flex justify-between items-center bg-emerald-50/30 border border-emerald-200/60 p-4.5 rounded-2xl mt-3 select-none">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">Verified Location Pincode</span>
                        <span className="text-xs text-slate-700 font-bold">{formData.pincode} - Udumalpet Area Eligible</span>
                      </div>
                      <button
                        onClick={() => {
                          setIsPincodeVerified(false);
                          setFormData(prev => ({ ...prev, pincode: '' }));
                        }}
                        className="py-1.5 px-3.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-[11px] rounded-xl transition-colors cursor-pointer"
                      >
                        Change Pincode
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 2: Business Details */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3 flex flex-col gap-1">
                    <h3 className="text-lg font-extrabold text-slate-800">2. Business Details</h3>
                    <p className="text-slate-400 text-xs font-semibold">Provide more information about your business.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Year of Establishment</label>
                      <select
                        name="yearEstablished"
                        value={formData.yearEstablished}
                        onChange={handleInputChange}
                        className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="">Select year</option>
                        {Array.from({ length: 2026 - 1950 + 1 }, (_, i) => 2026 - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Number of Employees</label>
                      <select
                        name="employeeCount"
                        value={formData.employeeCount}
                        onChange={handleInputChange}
                        className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="">Select range</option>
                        {['1 - 5', '5 - 10', '10 - 20', '20 - 50', '50 - 100', '100+'].map(ec => (
                          <option key={ec} value={ec}>{ec}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">GST Number (Optional)</label>
                      <input
                        type="text"
                        name="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleInputChange}
                        placeholder="Enter GST number"
                        className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Services / Products Offered *</label>
                    <span className="text-[10px] text-slate-400 font-bold -mt-1 block">Select the services or products you offer (Comma Separated)</span>
                    <input
                      type="text"
                      name="services"
                      value={formData.services}
                      onChange={handleInputChange}
                      placeholder="e.g. Retail, Wholesale, Electrician"
                      className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Brands We Deal With (Optional)</label>
                    <input
                      type="text"
                      name="brands"
                      value={formData.brands}
                      onChange={handleInputChange}
                      placeholder="Enter brands (e.g., Havells, Philips, LG)"
                      className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Contact & Location */}
              {currentStep === 3 && (
                <div className="flex flex-col gap-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3 flex flex-col gap-1">
                    <h3 className="text-lg font-extrabold text-slate-800">3. Contact & Location</h3>
                    <p className="text-slate-400 text-xs font-semibold">Help customers find and contact you easily.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Phone Number <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">WhatsApp Number</label>
                      <input
                        type="text"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="Enter WhatsApp number"
                        className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Email Address <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Business Address <span className="text-red-500">*</span></label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Enter complete address"
                      className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Area / Locality <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="locality"
                        value={formData.locality}
                        onChange={handleInputChange}
                        placeholder="Enter area or locality"
                        className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">City / Town</label>
                      <div className="relative">
                        <input
                          type="text"
                          disabled
                          value="Udumalpet"
                          className="w-full py-2.5 pl-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-bold cursor-not-allowed"
                        />
                        <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">State</label>
                      <div className="relative">
                        <input
                          type="text"
                          disabled
                          value="Tamil Nadu"
                          className="w-full py-2.5 pl-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-bold cursor-not-allowed"
                        />
                        <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Pincode <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="text"
                          disabled
                          value={formData.pincode}
                          className="w-full py-2.5 pl-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-bold cursor-not-allowed"
                        />
                        <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-6 select-none">
                      <input
                        type="checkbox"
                        id="showOnMap"
                        className="accent-emerald-600 h-4.5 w-4.5 cursor-pointer rounded border-slate-300"
                        defaultChecked
                      />
                      <label htmlFor="showOnMap" className="text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1">
                        Show exact address on map
                        <span className="text-slate-400 text-[10px] cursor-help">ⓘ</span>
                      </label>
                    </div>
                  </div>

                  {/* Autocomplete maps */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 mt-2 flex flex-col gap-4">
                    <div className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-slate-800">Map & Address Autocomplete Lookup</span>
                        <span className="text-[10px] text-slate-450 font-bold">Please select matching address from autocomplete suggestions below to verify details.</span>
                      </div>
                    </div>
                    <MockGoogleMaps
                      pincode={formData.pincode}
                      onAddressSelect={handleAddressSelect}
                      initialAddress={formData.address}
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Photos & Media */}
              {currentStep === 4 && (
                <div className="flex flex-col gap-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3 flex flex-col gap-1">
                    <h3 className="text-lg font-extrabold text-slate-800">4. Photos & Brand Media</h3>
                    <p className="text-slate-400 text-xs font-semibold">Upload high-quality photos of your shop storefront, logo, products, and services.</p>
                  </div>
                  
                  <div className="bg-emerald-50/50 border border-emerald-200/50 text-emerald-800 rounded-2xl p-4.5 text-xs font-semibold flex items-center gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                    <span>Upload a minimum of 3 images total (Logo, Cover, or Gallery) to successfully verify your listing details.</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    {/* Logo & Cover Upload */}
                    <div className="flex flex-col gap-5 border border-slate-200/80 rounded-2xl p-5">
                      <h4 className="font-extrabold text-sm text-slate-800">Brand Identity Icons</h4>
                      
                      {/* Logo */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Business Logo</span>
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 bg-slate-55 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xs select-none">
                            {logoFile ? '✓ Logo' : 'Logo'}
                          </div>
                          <label className="py-2.5 px-4 border border-slate-300 hover:bg-slate-50 font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm text-slate-700">
                            Choose File
                            <input type="file" onChange={handleLogoUpload} className="hidden" />
                          </label>
                        </div>
                      </div>

                      {/* Cover */}
                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Main Cover Image</span>
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-32 bg-slate-55 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xs select-none">
                            {coverFile ? '✓ Cover Loaded' : 'Cover'}
                          </div>
                          <label className="py-2.5 px-4 border border-slate-300 hover:bg-slate-50 font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm text-slate-700">
                            Choose File
                            <input type="file" onChange={handleCoverUpload} className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Gallery Images Upload */}
                    <div className="flex flex-col gap-5 border border-slate-200/80 rounded-2xl p-5 justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-800">Gallery Photos</h4>
                        <p className="text-slate-450 text-xs mt-1 leading-normal font-semibold">Upload photos of your storefront, interiors, products, or catalogs.</p>
                      </div>

                      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl transition-colors cursor-pointer bg-slate-50/50">
                        <Upload className="h-8 w-8 text-slate-400 mb-2" />
                        <label className="font-bold text-xs text-emerald-600 hover:underline cursor-pointer select-none">
                          Click to upload gallery photos
                          <input type="file" multiple onChange={handleGalleryUpload} className="hidden" />
                        </label>
                      </div>

                      {/* Uploaded files count badge */}
                      <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs text-slate-600 font-semibold">
                        <span className="font-bold">Total uploaded photos:</span>
                        <span className="bg-emerald-600 text-white font-extrabold px-2.5 py-0.5 rounded-full">
                          {(logoFile ? 1 : 0) + (coverFile ? 1 : 0) + galleryFiles.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Review & Submit */}
              {currentStep === 5 && (
                <div className="flex flex-col gap-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3 flex flex-col gap-1">
                    <h3 className="text-lg font-extrabold text-slate-800">5. Review & Submit</h3>
                    <p className="text-slate-400 text-xs font-semibold">Review your information carefully before submitting.</p>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200/80 text-amber-850 rounded-2xl p-4.5 text-xs font-semibold flex items-start gap-2.5 shadow-sm">
                    <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>Review your information carefully before submitting. Upon submission, your profile status becomes <strong>"Pending Verification"</strong> until audited by our administrators.</span>
                  </div>

                  {/* Beautiful interactive preview layout */}
                  <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest leading-none">UBT Live Preview</span>
                        <span className="font-extrabold text-lg leading-tight mt-1">{formData.name || 'Your Business Name'}</span>
                        <span className="text-xs text-slate-400 font-semibold">{formData.locality}, Udumalpet</span>
                      </div>
                      <span className="bg-amber-550 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                        Pending Vetting
                      </span>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wider">Description</span>
                          <p className="font-semibold text-slate-700 leading-relaxed text-justify">{formData.description || 'No description provided yet.'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-1.5">
                          <div>
                            <span className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wider">Established</span>
                            <p className="font-extrabold text-slate-700 text-[11px] mt-0.5">{formData.yearEstablished || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wider">GST Registered</span>
                            <p className="font-extrabold text-slate-700 text-[11px] mt-0.5">{formData.gstNumber || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl p-4.5">
                        <div className="flex justify-between border-b border-slate-200 pb-1.5">
                          <span className="font-bold">Select Pincode:</span>
                          <span className="font-extrabold text-slate-800">{formData.pincode}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-1.5">
                          <span className="font-bold">Phone contact:</span>
                          <span className="font-extrabold text-slate-800">{formData.phone}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-1.5">
                          <span className="font-bold">WhatsApp:</span>
                          <span className="font-extrabold text-slate-800">{formData.whatsapp}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold">Address status:</span>
                          <span className="text-emerald-600 font-extrabold">✓ Verified Address</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="border-t border-slate-100 pt-6 mt-4 flex justify-between items-center bg-white">
                {currentStep > 1 ? (
                  <button 
                    onClick={handleBack}
                    className="py-3.5 px-5 border border-slate-300 hover:bg-slate-50 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer text-slate-700"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsPincodeVerified(false);
                      setFormData(prev => ({ ...prev, pincode: '' }));
                    }}
                    className="py-3.5 px-5 border border-slate-350 hover:bg-slate-50 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer text-slate-700"
                  >
                    <ArrowLeft className="h-4 w-4" /> Change Pincode
                  </button>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      saveDraft(formData);
                      alert("Progress saved as a draft successfully!");
                    }}
                    className="py-3.5 px-5 border border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-800 font-extrabold text-xs rounded-xl transition-all cursor-pointer bg-white"
                  >
                    Save & Continue Later
                  </button>

                  {currentStep < steps.length ? (
                    <button 
                      onClick={handleNext}
                      className="py-3.5 px-6 bg-[#027244] hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow shadow-emerald-700/20 cursor-pointer"
                    >
                      Save & Continue <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={handleFormSubmit}
                      disabled={loading}
                      className="py-3.5 px-8 bg-[#027244] hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow shadow-emerald-700/25 cursor-pointer disabled:opacity-70"
                    >
                      {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      <span>{isEditing ? 'Save Profile Changes' : 'Submit & List Business'}</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

              {/* Right Column: Sidebar (lg:col-span-1) */}
          <div className="flex flex-col gap-6 select-none">
            
            {/* Card 1: Why List Your Business? */}
            <div className="bg-[#f4faf6] border border-[#e1f2eb] rounded-[24px] p-6 flex flex-col gap-4 font-sans select-none">
              <h4 className="font-extrabold text-[#0f3c22] text-[15px] flex items-center gap-2.5">
                <Briefcase className="h-[22px] w-[22px] text-[#137333] shrink-0" />
                Why List Your Business?
              </h4>
              <ul className="flex flex-col gap-3.5 mt-1">
                {[
                  'Reach thousands of local customers',
                  'Get more leads and enquiries',
                  'Build trust with verified profile',
                  'Showcase your services and offers',
                  'Grow your business in Udumalpet'
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-[18px] w-[18px] text-white fill-[#137333] stroke-[3px] shrink-0 mt-0.5" />
                    <span className="leading-relaxed text-slate-700 font-semibold text-xs">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 2: Tips for Better Listing */}
            <div className="bg-[#f5f8ff] border border-[#e3ecfc] rounded-[24px] p-6 flex flex-col gap-4 font-sans select-none">
              <h4 className="font-extrabold text-[#083c75] text-[15px] flex items-center gap-2.5">
                <Lightbulb className="h-[22px] w-[22px] text-[#1A73E8] shrink-0" />
                Tips for Better Listing
              </h4>
              <ul className="flex flex-col gap-3.5 mt-1">
                {[
                  'Use your real business name',
                  'Add clear description of services',
                  'Upload high-quality photos',
                  'Add correct contact information',
                  'Keep your business hours updated'
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-[18px] w-[18px] text-white fill-[#1A73E8] stroke-[3px] shrink-0 mt-0.5" />
                    <span className="leading-relaxed text-slate-700 font-semibold text-xs">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 3: Need Help? */}
            <div className="bg-[#fffbf7] border border-[#ffe8d6] rounded-[24px] p-6 flex flex-col gap-4 font-sans select-none">
              <div className="flex flex-col gap-1">
                <h4 className="font-extrabold text-[#001c41] text-[15px] flex items-center gap-2.5">
                  <Headset className="h-[22px] w-[22px] text-[#ea580c] shrink-0" />
                  Need Help?
                </h4>
                <p className="text-slate-500 font-semibold text-xs leading-normal ml-[32px] -mt-0.5">
                  We're here to help you list your business.
                </p>
              </div>
              
              <div className="flex flex-col gap-3.5 mt-2">
                <div className="flex items-center gap-3">
                  <Phone className="h-[18px] w-[18px] text-[#ea580c] shrink-0" />
                  <span className="text-slate-700 font-bold text-xs">+91 12345 67890</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-[18px] w-[18px] text-[#ea580c] shrink-0" />
                  <a href="mailto:info@udumalpet.co.in" className="text-slate-700 font-bold text-xs hover:text-[#027244] transition-colors">
                    info@udumalpet.co.in
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-[18px] w-[18px] text-[#ea580c] shrink-0" />
                  <span className="text-slate-700 font-bold text-xs">Mon - Sat: 9:00 AM - 8:00 PM</span>
                </div>
              </div>
            </div>

            {/* Card 4: Your Progress */}
            <div className="bg-[#f9fafb] border border-[#eef1f6] rounded-[24px] p-6 flex flex-col gap-4 font-sans select-none">
              <h4 className="font-extrabold text-[#001c41] text-[15px]">Your Progress</h4>
              <div className="flex flex-col gap-2">
                <div className="text-xs font-semibold text-slate-500">
                  Step {currentStep} of 5 Completed
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-grow h-2 bg-slate-200/70 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#137333] transition-all duration-300 rounded-full" 
                      style={{ width: `${currentStep * 20}%` }}
                    />
                  </div>
                  <span className="text-[#001c41] font-black text-xs min-w-[32px] text-right">
                    {currentStep * 20}%
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3.5 mt-2">
                {steps.map((step) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = step.id < currentStep;
                  return (
                    <div key={step.id} className="flex items-center gap-3">
                      <div 
                        className={`h-6 w-6 rounded-full flex items-center justify-center border font-bold text-[10px] shrink-0 transition-all ${
                          isCompleted || isActive
                            ? 'bg-[#137333] border-[#137333] text-white shadow-sm' 
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        {isCompleted ? '✓' : step.id}
                      </div>
                      <span className={`text-xs font-bold transition-colors ${
                        isActive 
                          ? 'text-[#137333]' 
                          : isCompleted 
                            ? 'text-[#001c41]' 
                            : 'text-slate-400'
                      }`}>
                        {step.name === 'Basic Info' ? 'Basic Information' : step.name === 'Contact & Location' ? 'Contact & Location' : step.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
