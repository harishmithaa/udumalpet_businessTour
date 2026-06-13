import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, ArrowRight, Upload, Sparkles, CheckCircle2, ChevronRight, Eye, RefreshCw, AlertCircle, AlertTriangle, Lock, Briefcase, Lightbulb, Headset, Phone, Mail, Clock, Search, BookOpen } from 'lucide-react';
import MockGoogleMaps from '@/components/MockGoogleMaps';
import ChoosePlan from '../choose-plan/page';

const steps = [
  { id: 1, name: 'Basic Info' },
  { id: 2, name: 'Business Details' },
  { id: 3, name: 'Contact & Location' },
  { id: 4, name: 'Photos & Media' },
  { id: 5, name: 'Choose Plan' },
  { id: 6, name: 'Review & Submit' },
];

const branchSteps = [
  { id: 1, name: 'Basic Info' },
  { id: 2, name: 'Branch Details' },
  { id: 3, name: 'Contact & Location' },
  { id: 4, name: 'Photos & Media' },
];

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

const isFoodRelated = (category, customCategoryName) => {
  if (!category) return false;
  const foodCategories = [
    'Restaurants', 'Bakeries', 'Cafes & Tea Shops', 'Sweet Shops', 
    'Fast Food Centers', 'Catering Services', 'Juice & Ice Cream Parlors',
    'Food & Restaurants', 'Food & Drinks', 'Hotels & Restaurants'
  ];
  if (foodCategories.includes(category)) {
    return true;
  }
  if (category === 'Others' && customCategoryName) {
    const customLower = customCategoryName.toLowerCase();
    const foodKeywords = [
      'food', 'restaurant', 'cafe', 'bakery', 'sweet', 'catering', 
      'juice', 'ice cream', 'parlor', 'hotel', 'dhaba', 'mess', 
      'biryani', 'pizza', 'burger', 'kitchen', 'canteen', 'sweets', 'tea'
    ];
    return foodKeywords.some(keyword => customLower.includes(keyword));
  }
  return false;
};

export default function AddBusiness() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Branches wizard states
  const [isBranchMode, setIsBranchMode] = useState(false);
  const [branchStep, setBranchStep] = useState(1);
  const [editingBranchIndex, setEditingBranchIndex] = useState(null);
  const [branchLogoFile, setBranchLogoFile] = useState(null);
  const [branchCoverFile, setBranchCoverFile] = useState(null);
  const [branchGalleryFiles, setBranchGalleryFiles] = useState([]);
  const [branchForm, setBranchForm] = useState({
    name: '',
    category: 'Grocery Stores',
    customCategoryName: '',
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
    website: '',
    facebook: '',
    instagram: '',
    address: '',
    locality: '',
    city: 'Udumalpet',
    state: 'Tamil Nadu',
    pincode: '',
    isAddressVerified: false,
    logoUrl: '',
    coverImageUrl: '',
    galleryUrls: [],
    googleBusinessLink: '',
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

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'Grocery Stores',
    customCategoryName: '',
    requestedParentCategory: 'Shopping',
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
    website: '',
    facebook: '',
    instagram: '',
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
    googleBusinessLink: '',
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
    branches: [],
  });

  const [isCustomLocality, setIsCustomLocality] = useState(false);
  const [isBranchCustomLocality, setIsBranchCustomLocality] = useState(false);

  // Sync locality type classification based on value borders
  useEffect(() => {
    if (formData.locality) {
      if (!availableLocalities.includes(formData.locality)) {
        setIsCustomLocality(true);
      } else {
        setIsCustomLocality(false);
      }
    }
  }, [formData.locality]);

  useEffect(() => {
    if (branchForm.locality) {
      if (!availableLocalities.includes(branchForm.locality)) {
        setIsBranchCustomLocality(true);
      } else {
        setIsBranchCustomLocality(false);
      }
    }
  }, [branchForm.locality]);

  const [isPincodeVerified, setIsPincodeVerified] = useState(false);
  const [eligibilityMethod, setEligibilityMethod] = useState('google'); // 'google' | 'pincode'

  // Main Google autofill states (eligibility screen)
  const [gmbQuery, setGmbQuery] = useState('');
  const [gmbSuggestions, setGmbSuggestions] = useState([]);
  const [showGmbDropdown, setShowGmbDropdown] = useState(false);
  const [gmbAutofillLoading, setGmbAutofillLoading] = useState(false);
  const [gmbAutofillSuccess, setGmbAutofillSuccess] = useState(false);
  const [gmbImportedReviews, setGmbImportedReviews] = useState([]);

  // Branch eligibility gating states
  const [isBranchEligibilityVerified, setIsBranchEligibilityVerified] = useState(false);
  const [branchEligibilityMethod, setBranchEligibilityMethod] = useState('google');
  const [branchGoogleQuery, setBranchGoogleQuery] = useState('');
  const [branchGoogleSuggestions, setBranchGoogleSuggestions] = useState([]);
  const [showBranchGoogleDropdown, setShowBranchGoogleDropdown] = useState(false);
  const [selectedBranchPlaceId, setSelectedBranchPlaceId] = useState(null);
  const [branchAutofillLoading, setBranchAutofillLoading] = useState(false);
  const [branchAutofillSuccess, setBranchAutofillSuccess] = useState(false);
  const [branchImportedReviews, setBranchImportedReviews] = useState([]);



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
  const [googleSuggestions, setGoogleSuggestions] = useState([]);
  const [showGoogleDropdown, setShowGoogleDropdown] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Address validation state
  const [addressValidation, setAddressValidation] = useState({
    checked: false,
    isAddressValid: false,
    isWithinBoundary: false,
    message: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Category management dynamic states
  const [dbCategories, setDbCategories] = useState([]);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [categoryWarning, setCategoryWarning] = useState('');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const fetchBranches = async (businessId, authToken) => {
    try {
      const res = await fetch(`http://localhost:5000/api/branches/business/${businessId}?all=true`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setFormData(prev => ({ ...prev, branches: data.data }));
      }
    } catch (e) {
      console.warn('Failed to load branches from server:', e);
    }
  };

  const fetchUserBusinessFromServer = async (authToken) => {
    try {
      const res = await fetch('http://localhost:5000/api/businesses/my-business', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      
      if (data.success && data.data) {
        const biz = data.data;
        
        // Fetch branches of this business draft
        await fetchBranches(biz._id, authToken);

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
    if (draft.pincode) {
      setIsPincodeVerified(true);
    }
  };

  const getPayload = (updatedData) => {
    const servicesList = updatedData.services && typeof updatedData.services === 'string'
      ? updatedData.services.split(',').map(s => s.trim()).filter(Boolean)
      : (updatedData.services || []);
    const brandsList = updatedData.brands && typeof updatedData.brands === 'string'
      ? updatedData.brands.split(',').map(b => b.trim()).filter(Boolean)
      : (updatedData.brands || []);

    const formattedBranches = updatedData.branches
      ? updatedData.branches.map(b => ({
          ...b,
          services: typeof b.services === 'string' ? b.services.split(',').map(s => s.trim()).filter(Boolean) : (b.services || []),
          brands: typeof b.brands === 'string' ? b.brands.split(',').map(br => br.trim()).filter(Boolean) : (b.brands || []),
          latitude: b.coordinates?.lat || b.latitude || 10.5891,
          longitude: b.coordinates?.lng || b.longitude || 77.2412,
        }))
      : [];

    return {
      ...updatedData,
      services: servicesList,
      brands: brandsList,
      branches: formattedBranches,
      latitude: updatedData.coordinates?.lat,
      longitude: updatedData.coordinates?.lng,
    };
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

      const payload = getPayload(updatedData);

      const res = await fetch('http://localhost:5000/api/businesses/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success && data.data && data.data._id) {
        setFormData(prev => ({ ...prev, _id: data.data._id }));
      }
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

        // Detect branch mode
        const modeParam = searchParams.get('mode');
        if (modeParam === 'branch') {
          setIsBranchMode(true);
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

  const handleGoogleInputChange = async (val) => {
    setGoogleQuery(val);
    setSelectedPlaceId(null); // Reset when user types new query
    if (!val.trim()) {
      setGoogleSuggestions([]);
      setShowGoogleDropdown(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/businesses/google-autocomplete?q=${encodeURIComponent(val)}`);
      const data = await res.json();
      if (data.success && data.predictions) {
        setGoogleSuggestions(data.predictions);
        setShowGoogleDropdown(true);
      }
    } catch (err) {
      console.error('Error fetching autocomplete:', err);
    }
  };

  const handleSelectSuggestion = (sug) => {
    setGoogleQuery(sug.structured_formatting?.main_text || sug.description);
    setSelectedPlaceId(sug.place_id);
    setShowGoogleDropdown(false);
  };

  const selectGooglePlace = async (placeId) => {
    setShowGoogleDropdown(false);
    setAutofillLoading(true);
    setError('');
    setAutofillSuccess(false);

    try {
      const activeToken = localStorage.getItem('ubt_token') || token;
      const res = await fetch('http://localhost:5000/api/businesses/google-autofill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ placeId }),
      });
      const data = await res.json();
      if (data.success) {
        const d = data.data;
        const allowedPincodes = [
          '642126', '642207', '642154', '642112', '642205', 
          '642122', '642204', '642201', '642203', '642102', 
          '642128', '642113', '642206', '642132', '642111'
        ];

        let placePincode = d.pincode ? d.pincode.replace(/\s+/g, '').slice(0, 6) : '';

        if (placePincode) {
          if (!allowedPincodes.includes(placePincode)) {
            setError(`The selected business is located in pincode ${placePincode}, which is outside the eligible Udumalpet region.`);
            setAutofillSuccess(false);
            setAutofillLoading(false);
            return;
          }
        }

        const updated = {
          ...formData,
          name: d.name || formData.name,
          address: d.address || formData.address,
          phone: d.phone || formData.phone,
          whatsapp: d.phone || formData.whatsapp,
          email: d.email || formData.email,
          website: d.website || formData.website || '',
          locality: d.locality || formData.locality,
          pincode: placePincode || formData.pincode,
          isAddressVerified: true,
          googlePlaceId: d.googlePlaceId || placeId,
          googleRating: d.googleRating || 0,
          googleReviewsCount: d.googleReviewsCount || 0,
          googleReviews: d.googleReviews || [],
          coordinates: {
            lat: d.latitude || d.coordinates?.lat || 10.585,
            lng: d.longitude || d.coordinates?.lng || 77.251
          },
          timings: d.timings || d.openingHours || formData.timings,
        };

        if (d.name) {
          setGoogleQuery(d.name);
        }

        setFormData(updated);
        
        if (placePincode) {
          setIsPincodeVerified(true);
        } else {
          setError("Business found, but we couldn't automatically retrieve its pincode. Please select the correct pincode manually to verify.");
        }

        // Removed mock image presets so it starts blank


        setToastMessage("Business information imported successfully.");
        setTimeout(() => {
          setToastMessage('');
        }, 4000);

        setAutofillSuccess(true);
        saveDraft(updated);
      } else {
        setError("Business not found. Please enter details manually.");
      }
    } catch (err) {
      console.error(err);
      setError("Business not found. Please enter details manually.");
    } finally {
      setAutofillLoading(false);
    }
  };

  const handleGoogleAutofill = async (e) => {
    e.preventDefault();
    if (!googleQuery) return;
    setError('');
    setAutofillSuccess(false);

    if (selectedPlaceId) {
      await selectGooglePlace(selectedPlaceId);
    } else {
      try {
        setAutofillLoading(true);
        const res = await fetch(`http://localhost:5000/api/businesses/google-autocomplete?q=${encodeURIComponent(googleQuery)}`);
        const data = await res.json();
        if (data.success && data.predictions && data.predictions.length > 0) {
          const firstSug = data.predictions[0];
          await selectGooglePlace(firstSug.place_id);
        } else {
          setError("Business not found. Please enter details manually.");
          setAutofillLoading(false);
        }
      } catch (err) {
        setError("Business not found. Please enter details manually.");
        setAutofillLoading(false);
      }
    }
  };

  const handleBranchGoogleInputChange = async (val) => {
    setBranchGoogleQuery(val);
    setSelectedBranchPlaceId(null);
    if (!val.trim()) {
      setBranchGoogleSuggestions([]);
      setShowBranchGoogleDropdown(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/businesses/google-autocomplete?q=${encodeURIComponent(val)}`);
      const data = await res.json();
      if (data.success && data.predictions) {
        setBranchGoogleSuggestions(data.predictions);
        setShowBranchGoogleDropdown(true);
      }
    } catch (err) {
      console.error('Error fetching autocomplete:', err);
    }
  };

  const handleSelectBranchSuggestion = (sug) => {
    setBranchGoogleQuery(sug.structured_formatting?.main_text || sug.description);
    setSelectedBranchPlaceId(sug.place_id);
    setShowBranchGoogleDropdown(false);
  };

  const selectGooglePlaceForBranch = async (placeId) => {
    setShowBranchGoogleDropdown(false);
    setBranchAutofillLoading(true);
    setError('');
    setBranchAutofillSuccess(false);

    try {
      const activeToken = localStorage.getItem('ubt_token') || token;
      const res = await fetch('http://localhost:5000/api/businesses/google-autofill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ placeId }),
      });
      const data = await res.json();
      if (data.success) {
        const d = data.data;
        const allowedPincodes = [
          '642126', '642207', '642154', '642112', '642205', 
          '642122', '642204', '642201', '642203', '642102', 
          '642128', '642113', '642206', '642132', '642111'
        ];

        let placePincode = d.pincode ? d.pincode.replace(/\s+/g, '').slice(0, 6) : '';

        if (placePincode) {
          if (!allowedPincodes.includes(placePincode)) {
            setError(`The selected business is located in pincode ${placePincode}, which is outside the eligible Udumalpet region.`);
            setBranchAutofillSuccess(false);
            setBranchAutofillLoading(false);
            return;
          }
        }

        const updated = {
          ...branchForm,
          name: d.name || branchForm.name,
          address: d.address || branchForm.address,
          phone: d.phone || branchForm.phone,
          whatsapp: d.phone || branchForm.whatsapp,
          email: d.email || branchForm.email,
          website: d.website || branchForm.website || '',
          locality: d.locality || branchForm.locality,
          pincode: placePincode || branchForm.pincode,
          isAddressVerified: true,
          googlePlaceId: d.googlePlaceId || placeId,
          googleRating: d.googleRating || 0,
          googleReviewsCount: d.googleReviewsCount || 0,
          googleReviews: d.googleReviews || [],
          coordinates: {
            lat: d.latitude || d.coordinates?.lat || 10.585,
            lng: d.longitude || d.coordinates?.lng || 77.251
          },
          timings: d.timings || d.openingHours || branchForm.timings,
        };

        if (d.name) {
          setBranchGoogleQuery(d.name);
        }

        setBranchForm(updated);
        
        if (placePincode) {
          setIsBranchEligibilityVerified(true);
        } else {
          setError("Business found, but we couldn't automatically retrieve its pincode. Please select the correct pincode manually to verify.");
        }

        // Removed mock image presets so it starts blank


        setToastMessage("Branch information imported successfully.");
        setTimeout(() => {
          setToastMessage('');
        }, 4000);

        setBranchAutofillSuccess(true);
      } else {
        setError("Business not found. Please enter details manually.");
      }
    } catch (err) {
      console.error(err);
      setError("Business not found. Please enter details manually.");
    } finally {
      setBranchAutofillLoading(false);
    }
  };

  const handleBranchGoogleAutofill = async (e) => {
    e.preventDefault();
    if (!branchGoogleQuery) return;
    setError('');
    setBranchAutofillSuccess(false);

    if (selectedBranchPlaceId) {
      await selectGooglePlaceForBranch(selectedBranchPlaceId);
    } else {
      try {
        setBranchAutofillLoading(true);
        const res = await fetch(`http://localhost:5000/api/businesses/google-autocomplete?q=${encodeURIComponent(branchGoogleQuery)}`);
        const data = await res.json();
        if (data.success && data.predictions && data.predictions.length > 0) {
          const firstSug = data.predictions[0];
          await selectGooglePlaceForBranch(firstSug.place_id);
        } else {
          setError("Business not found. Please enter details manually.");
          setBranchAutofillLoading(false);
        }
      } catch (err) {
        setError("Business not found. Please enter details manually.");
        setBranchAutofillLoading(false);
      }
    }
  };

  const handleAddressSelect = (addrDetails) => {
    const updated = {
      ...formData,
      address: addrDetails.address,
      locality: addrDetails.locality,
      coordinates: addrDetails.coordinates,
      isAddressVerified: addrDetails.isVerified,
      googlePlaceId: addrDetails.googlePlaceId || '',
    };
    setFormData(updated);
    saveDraft(updated);
  };

  // Debounced address and boundary validation via Geocoding API
  useEffect(() => {
    if (currentStep !== 3 || !formData.pincode) return;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch('http://localhost:5000/api/businesses/validate-address', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address: formData.address,
            locality: formData.locality,
            pincode: formData.pincode,
            latitude: formData.coordinates?.lat,
            longitude: formData.coordinates?.lng
          })
        });
        const data = await res.json();
        if (data.success) {
          setAddressValidation({
            checked: true,
            isAddressValid: data.isAddressValid,
            isWithinBoundary: data.isWithinBoundary,
            message: data.message
          });
          
          setFormData(prev => ({
            ...prev,
            isAddressVerified: data.isAddressValid && data.isWithinBoundary
          }));
        }
      } catch (err) {
        console.error('Error during address validation:', err);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [formData.address, formData.locality, formData.pincode, formData.coordinates?.lat, formData.coordinates?.lng, currentStep]);

  const uploadFileToServer = async (file) => {
    // Always read from localStorage at call time — avoids stale closure captures
    const activeToken = localStorage.getItem('ubt_token');
    if (!activeToken) throw new Error('Not logged in. Please log in and try again.');
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${activeToken}` },
      body: fd,
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Upload failed');
    return data.url || data.fileUrl;
  };

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingBranchLogo, setUploadingBranchLogo] = useState(false);
  const [uploadingBranchCover, setUploadingBranchCover] = useState(false);
  const [uploadingBranchGallery, setUploadingBranchGallery] = useState(false);

  const handleLogoUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file.name);
      setUploadingLogo(true);
      try {
        const url = await uploadFileToServer(file);
        const updated = { ...formData, logoUrl: url };
        setFormData(updated);
        saveDraft(updated);
      } catch (err) {
        setError('Logo upload failed: ' + err.message);
      } finally {
        setUploadingLogo(false);
      }
    }
  };

  const handleCoverUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file.name);
      setUploadingCover(true);
      try {
        const url = await uploadFileToServer(file);
        const updated = { ...formData, coverImageUrl: url };
        setFormData(updated);
        saveDraft(updated);
      } catch (err) {
        setError('Cover upload failed: ' + err.message);
      } finally {
        setUploadingCover(false);
      }
    }
  };

  const handleGalleryUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setGalleryFiles(prev => [...prev, ...files.map(f => f.name)]);
      setUploadingGallery(true);
      try {
        const urls = await Promise.all(files.map(f => uploadFileToServer(f)));
        const updated = { ...formData, galleryUrls: [...(formData.galleryUrls || []), ...urls] };
        setFormData(updated);
        saveDraft(updated);
      } catch (err) {
        setError('Gallery upload failed: ' + err.message);
      } finally {
        setUploadingGallery(false);
      }
    }
  };

  const handleBranchInputChange = (e) => {
    const { name, value } = e.target;
    setBranchForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBranchLogoUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBranchLogoFile(file.name);
      setUploadingBranchLogo(true);
      try {
        const url = await uploadFileToServer(file);
        setBranchForm(prev => ({ ...prev, logoUrl: url }));
      } catch (err) {
        setError('Branch logo upload failed: ' + err.message);
      } finally {
        setUploadingBranchLogo(false);
      }
    }
  };

  const handleBranchCoverUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBranchCoverFile(file.name);
      setUploadingBranchCover(true);
      try {
        const url = await uploadFileToServer(file);
        setBranchForm(prev => ({ ...prev, coverImageUrl: url }));
      } catch (err) {
        setError('Branch cover upload failed: ' + err.message);
      } finally {
        setUploadingBranchCover(false);
      }
    }
  };

  const handleBranchGalleryUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setBranchGalleryFiles(prev => [...prev, ...files.map(f => f.name)]);
      setUploadingBranchGallery(true);
      try {
        const urls = await Promise.all(files.map(f => uploadFileToServer(f)));
        setBranchForm(prev => ({ ...prev, galleryUrls: [...(prev.galleryUrls || []), ...urls] }));
      } catch (err) {
        setError('Branch gallery upload failed: ' + err.message);
      } finally {
        setUploadingBranchGallery(false);
      }
    }
  };

  const handleBranchAddressSelect = (addrDetails) => {
    setBranchForm(prev => ({
      ...prev,
      address: addrDetails.address,
      locality: addrDetails.locality,
      coordinates: addrDetails.coordinates,
      isAddressVerified: addrDetails.isVerified,
    }));
  };

  const validateBranchStep = () => {
    setError('');
    if (branchStep === 1) {
      if (!branchForm.name || !branchForm.description) {
        setError('Branch name and description are mandatory.');
        return false;
      }
      if (!branchForm.pincode) {
        setError('Please select a branch pincode.');
        return false;
      }
    } else if (branchStep === 3) {
      if (!branchForm.phone || !branchForm.address || !branchForm.locality) {
        setError('Phone number, address, and locality are mandatory.');
        return false;
      }
    } else if (branchStep === 4) {
      const totalPhotos = (branchLogoFile ? 1 : 0) + (branchCoverFile ? 1 : 0) + branchGalleryFiles.length;
      if (totalPhotos < 1) {
        setError('Minimum 1 image is required for the branch profile.');
        return false;
      }
    }
    return true;
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
      if (!formData.requestedParentCategory || !formData.requestedParentCategory.trim()) {
        setError('Please select a main category.');
        return false;
      }
      if (!formData.category || !formData.category.trim()) {
        setError('Please select a subcategory.');
        return false;
      }
      if (formData.category === 'Others' && (!formData.customCategoryName || !formData.customCategoryName.trim())) {
        setError('Please specify your custom subcategory name.');
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
    if (isBranchMode) {
      if (validateBranchStep()) {
        if (branchStep < 4) {
          setBranchStep((prev) => prev + 1);
        } else {
          // Finished branch step 4 -> save branch!
          const updatedBranches = [...formData.branches];
          if (editingBranchIndex !== null) {
            updatedBranches[editingBranchIndex] = branchForm;
          } else {
            updatedBranches.push(branchForm);
          }
          const updatedFormData = { ...formData, branches: updatedBranches };
          setFormData(updatedFormData);
          
          setError('');
          setLoading(true);
          
          const saveBranchAsync = async () => {
            try {
              const activeToken = localStorage.getItem('ubt_token') || token;
              const payload = getPayload(updatedFormData);
              const url = updatedFormData._id 
                ? `http://localhost:5000/api/businesses/${updatedFormData._id}` 
                : 'http://localhost:5000/api/businesses';
              const method = updatedFormData._id ? 'PUT' : 'POST';
              
              const res = await fetch(url, {
                method,
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${activeToken}`,
                },
                body: JSON.stringify(payload),
              });
              const data = await res.json();
              if (data.success) {
                localStorage.removeItem('ubt_draft_business');
                localStorage.removeItem('ubt_edit_draft');
                setToastMessage("Branch saved successfully!");
                setIsBranchMode(false);
                setEditingBranchIndex(null);
                setTimeout(() => {
                  setToastMessage('');
                  navigate('/dashboard?message=branch_added');
                }, 1500);
              } else {
                setError(data.message || 'Failed to save branch.');
              }
            } catch (err) {
              setError('Connection failed. Server might be offline.');
            } finally {
              setLoading(false);
            }
          };
          saveBranchAsync();
        }
      }
    } else {
      if (validateStep()) {
        saveDraft(formData);
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setError('');
    if (isBranchMode) {
      if (branchStep > 1) {
        setBranchStep((prev) => prev - 1);
      } else {
        setIsBranchEligibilityVerified(false);
      }
    } else {
      saveDraft(formData);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFormSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const payload = getPayload(formData);

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

  if (!isPincodeVerified && !isBranchMode) {
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
              Udumalpet Business Tour accepts listings situated strictly within the Udumalpet (UDT) region.
            </p>
          </div>

          {/* Switcher Tabs - Google My Business on the LEFT */}
          <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner select-none">
            <button
              type="button"
              onClick={() => {
                setError('');
                setEligibilityMethod('google');
              }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                eligibilityMethod === 'google'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Google My Business
            </button>
            <button
              type="button"
              onClick={() => {
                setError('');
                setEligibilityMethod('pincode');
              }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                eligibilityMethod === 'pincode'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Verify via Pincode
            </button>
          </div>

          {/* Form Content */}
          <div className="flex flex-col gap-4">
            {eligibilityMethod === 'pincode' ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5 text-left">
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
                
                <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-4.5 text-xs text-amber-800 leading-relaxed font-semibold text-left">
                  <span className="font-extrabold text-amber-900 block mb-0.5">ℹ️ Only UDT Pincodes Allowed</span>
                  Businesses registered outside Udumalpet division postal zones are automatically rejected by our administrators during the vetting phase.
                </div>

                {error && (
                  <div className="text-red-650 text-xs font-semibold bg-red-50 border border-red-200 p-3 rounded-xl flex items-center gap-2 text-left">
                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="py-3.5 px-5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 bg-white"
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
                      saveDraft({ ...formData });
                    }}
                    className="py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-emerald-700/20 cursor-pointer flex items-center justify-center gap-1.5 flex-grow"
                  >
                    Verify Pincode & Proceed
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 text-left animate-fadeIn">

                {/* Search & Autofill */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Search Your Business Name <span className="text-slate-400 font-semibold normal-case">(autofill details)</span></label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type your business name..."
                      value={gmbQuery}
                      onChange={async (e) => {
                        const val = e.target.value;
                        setGmbQuery(val);
                        setGmbAutofillSuccess(false);
                        if (val.length < 2) { setGmbSuggestions([]); setShowGmbDropdown(false); return; }
                        try {
                          const res = await fetch(`http://localhost:5000/api/businesses/google-autocomplete?q=${encodeURIComponent(val)}&types=establishment`);
                          const data = await res.json();
                          if (data.success) { setGmbSuggestions(data.predictions || []); setShowGmbDropdown(true); }
                        } catch {}
                      }}
                      className="py-3 px-4 pr-10 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold w-full focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                    />
                    {gmbAutofillLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    {gmbAutofillSuccess && !gmbAutofillLoading && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                  {showGmbDropdown && gmbSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-white border border-slate-200 rounded-xl shadow-lg mt-1 overflow-hidden">
                      {gmbSuggestions.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          className="w-full text-left px-4 py-3 hover:bg-emerald-50 border-b border-slate-100 last:border-0 transition-colors"
                          onClick={async () => {
                            setShowGmbDropdown(false);
                            setGmbQuery(s.structured_formatting?.main_text || s.description);
                            setGmbAutofillLoading(true);
                            setGmbAutofillSuccess(false);
                            try {
                              const res = await fetch('http://localhost:5000/api/businesses/google-autofill', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ placeId: s.place_id })
                              });
                              const data = await res.json();
                              if (data.success && data.data) {
                                const d = data.data;
                                setFormData(prev => ({
                                  ...prev,
                                  name: d.name || prev.name,
                                  phone: d.phone || prev.phone,
                                  whatsapp: d.phone || prev.whatsapp,
                                  website: d.website || prev.website,
                                  address: d.address || prev.address,
                                  locality: d.locality || prev.locality,
                                  pincode: d.pincode || prev.pincode,
                                  coordinates: d.latitude ? { lat: d.latitude, lng: d.longitude } : prev.coordinates,
                                  googlePlaceId: d.googlePlaceId || prev.googlePlaceId,
                                  googleRating: d.googleRating || prev.googleRating,
                                  googleReviewsCount: d.googleReviewsCount || prev.googleReviewsCount,
                                  googleReviews: d.googleReviews?.length ? d.googleReviews : prev.googleReviews,
                                  timings: d.timings || prev.timings,
                                }));
                                setGmbImportedReviews(d.googleReviews || []);
                                setGmbAutofillSuccess(true);
                              }
                            } catch {}
                            finally { setGmbAutofillLoading(false); }
                          }}
                        >
                          <div className="text-xs font-bold text-slate-800">{s.structured_formatting?.main_text || s.description}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{s.structured_formatting?.secondary_text || ''}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {gmbAutofillSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Details autofilled successfully! You can still edit any field in the next steps.</span>
                  </div>
                )}

                {/* Google Business Profile Link */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Google Business Profile Link <span className="text-red-500">*</span></label>
                  <input
                    type="url"
                    placeholder="https://maps.app.goo.gl/..."
                    value={formData.googleBusinessLink || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, googleBusinessLink: e.target.value }))}
                    className="py-3 px-4 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold w-full focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                  />
                </div>



                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-500 leading-relaxed font-semibold">
                  <span className="font-extrabold text-slate-700 block mb-0.5">ℹ️ Google Business Profile Verification</span>
                  Paste your Google Maps / Business Profile link above. You can also search your business name above to autofill all details and import Google Reviews automatically.
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
                    className="py-3.5 px-5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 bg-white"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    disabled={autofillLoading}
                    onClick={async () => {
                      if (!formData.googleBusinessLink) {
                        setError("Please enter your Google Business Profile link.");
                        return;
                      }
                      setError("");
                      setAutofillLoading(true);
                      try {
                        const res = await fetch('http://localhost:5000/api/businesses/google-autofill-link', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ link: formData.googleBusinessLink })
                        });
                        const data = await res.json();
                        if (data.success) {
                          const d = data.data;
                          const allowedPincodes = [
                            '642126', '642207', '642154', '642112', '642205', 
                            '642122', '642204', '642201', '642203', '642102', 
                            '642128', '642113', '642206', '642132', '642111'
                          ];
                          let placePincode = d.pincode ? d.pincode.replace(/\s+/g, '').slice(0, 6) : '';
                          if (placePincode && !allowedPincodes.includes(placePincode)) {
                            setError(`The selected business is located in pincode ${placePincode}, which is outside the eligible Udumalpet region.`);
                            setAutofillLoading(false);
                            return;
                          }

                          const updated = {
                            ...formData,
                            name: d.name || formData.name,
                            address: d.address || formData.address,
                            phone: d.phone || formData.phone,
                            whatsapp: d.phone || formData.whatsapp,
                            email: d.email || formData.email,
                            website: d.website || formData.website || '',
                            locality: d.locality || formData.locality,
                            pincode: placePincode || formData.pincode,
                            isAddressVerified: true,
                            googlePlaceId: d.googlePlaceId || '',
                            googleRating: d.googleRating || 0,
                            googleReviewsCount: d.googleReviewsCount || 0,
                            googleReviews: d.googleReviews || [],
                            coordinates: {
                              lat: d.latitude || d.coordinates?.lat || 10.585,
                              lng: d.longitude || d.coordinates?.lng || 77.251
                            },
                            timings: d.timings || d.openingHours || formData.timings,
                          };
                          setFormData(updated);
                          setIsPincodeVerified(true);
                          setGmbAutofillSuccess(true);
                          setToastMessage("Business information imported from link successfully.");
                          setTimeout(() => setToastMessage(''), 4000);
                          saveDraft(updated);
                        } else {
                          setError(data.message || "Could not autofill from link. Please enter details manually.");
                        }
                      } catch (err) {
                        setError("Could not autofill from link. Please enter details manually.");
                      } finally {
                        setAutofillLoading(false);
                      }
                    }}
                    className="py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-emerald-700/20 cursor-pointer flex items-center justify-center gap-1.5 flex-grow disabled:opacity-50"
                  >
                    {autofillLoading ? 'Importing Details...' : 'Verify & Proceed'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isBranchMode && !isBranchEligibilityVerified) {
    return (
      <div className="w-full min-h-[85vh] bg-slate-50 py-16 px-4 md:px-8 font-sans flex items-center justify-center animate-fadeIn">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-2 text-center items-center">
            <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-inner">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight mt-2">Branch Location Eligibility Check</h2>
            <p className="text-slate-450 text-xs font-semibold leading-relaxed px-2">
              Udumalpet Business Tour branches must be situated strictly within the Udumalpet (UDT) region.
            </p>
          </div>

          {/* Switcher Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner select-none">
            <button
              type="button"
              onClick={() => {
                setError('');
                setBranchEligibilityMethod('google');
              }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                branchEligibilityMethod === 'google'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Google My Business
            </button>
            <button
              type="button"
              onClick={() => {
                setError('');
                setBranchEligibilityMethod('pincode');
              }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                branchEligibilityMethod === 'pincode'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Verify via Pincode
            </button>
          </div>

          {/* Form Content */}
          <div className="flex flex-col gap-4">
            {branchEligibilityMethod === 'pincode' ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Select Branch Pincode <span className="text-red-500">*</span></label>
                  <select
                    name="pincode"
                    value={branchForm.pincode}
                    onChange={handleBranchInputChange}
                    className="w-full py-3 px-4 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="">-- Choose Pincode --</option>
                    <option value="642126">642126 - Udumalpet Main Town</option>
                    <option value="642207">642207 - Pungamuthur</option>
                    <option value="642154">642154 - Bodipatti & Gandhi Nagar</option>
                    <option value="642112">642112 - Dhali</option>
                    <option value="642205">642205 - Pethappampatti</option>
                    <option value="642122">642122 - Poolankinar</option>
                    <option value="642204">642204 - Komaralingam & Kolumam</option>
                    <option value="642201">642201 - Gudimangalam</option>
                    <option value="642203">642203 - Kaniyur</option>
                    <option value="642102">642102 - Amaravathi Nagar</option>
                    <option value="642128">642128 - Venkatesa Mills</option>
                    <option value="642113">642113 - Madathukulam</option>
                    <option value="642206">642206 - Poolavadi</option>
                    <option value="642132">642132 - Valavadi</option>
                    <option value="642111">642111 - Agrahara Kannadiputhur</option>
                  </select>
                </div>

                <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-4.5 text-xs text-amber-800 leading-relaxed font-semibold text-left">
                  <span className="font-extrabold text-amber-900 block mb-0.5">ℹ️ Only UDT Pincodes Allowed</span>
                  Branches registered outside Udumalpet division postal zones are automatically rejected by our administrators during the vetting phase.
                </div>

                {error && (
                  <div className="text-red-650 text-xs font-semibold bg-red-50 border border-red-200 p-3 rounded-xl flex items-center gap-2 text-left">
                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="py-3.5 px-5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 bg-white"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    onClick={() => {
                      if (!branchForm.pincode) {
                        setError("Please select a pincode to verify eligibility.");
                        return;
                      }
                      setError("");
                      setIsBranchEligibilityVerified(true);
                    }}
                    className="py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-emerald-700/20 cursor-pointer flex items-center justify-center gap-1.5 flex-grow"
                  >
                    Verify Pincode & Proceed
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 text-left animate-fadeIn">

                {/* Branch Search & Autofill */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Search Branch Name <span className="text-slate-400 font-semibold normal-case">(autofill details)</span></label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type branch name..."
                      value={branchGoogleQuery}
                      onChange={async (e) => {
                        const val = e.target.value;
                        setBranchGoogleQuery(val);
                        setBranchAutofillSuccess(false);
                        if (val.length < 2) { setBranchGoogleSuggestions([]); setShowBranchGoogleDropdown(false); return; }
                        try {
                          const res = await fetch(`http://localhost:5000/api/businesses/google-autocomplete?q=${encodeURIComponent(val)}&types=establishment`);
                          const data = await res.json();
                          if (data.success) { setBranchGoogleSuggestions(data.predictions || []); setShowBranchGoogleDropdown(true); }
                        } catch {}
                      }}
                      className="py-3 px-4 pr-10 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold w-full focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                    />
                    {branchAutofillLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    {branchAutofillSuccess && !branchAutofillLoading && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                  {showBranchGoogleDropdown && branchGoogleSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-white border border-slate-200 rounded-xl shadow-lg mt-1 overflow-hidden">
                      {branchGoogleSuggestions.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          className="w-full text-left px-4 py-3 hover:bg-emerald-50 border-b border-slate-100 last:border-0 transition-colors"
                          onClick={async () => {
                            setShowBranchGoogleDropdown(false);
                            setBranchGoogleQuery(s.structured_formatting?.main_text || s.description);
                            setBranchAutofillLoading(true);
                            setBranchAutofillSuccess(false);
                            try {
                              const res = await fetch('http://localhost:5000/api/businesses/google-autofill', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ placeId: s.place_id })
                              });
                              const data = await res.json();
                              if (data.success && data.data) {
                                const d = data.data;
                                setBranchForm(prev => ({
                                  ...prev,
                                  name: d.name || prev.name,
                                  phone: d.phone || prev.phone,
                                  whatsapp: d.phone || prev.whatsapp,
                                  website: d.website || prev.website,
                                  address: d.address || prev.address,
                                  locality: d.locality || prev.locality,
                                  pincode: d.pincode || prev.pincode,
                                  coordinates: d.latitude ? { lat: d.latitude, lng: d.longitude } : prev.coordinates,
                                  googleBusinessLink: d.googlePlaceId ? `https://maps.google.com/?cid=${d.googlePlaceId}` : prev.googleBusinessLink,
                                  timings: d.timings || prev.timings,
                                }));
                                setBranchImportedReviews(d.googleReviews || []);
                                setBranchAutofillSuccess(true);
                              }
                            } catch {}
                            finally { setBranchAutofillLoading(false); }
                          }}
                        >
                          <div className="text-xs font-bold text-slate-800">{s.structured_formatting?.main_text || s.description}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{s.structured_formatting?.secondary_text || ''}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {branchAutofillSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Details autofilled successfully! You can still edit any field in the next steps.</span>
                  </div>
                )}

                {/* Google Business Profile Link */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Google Business Profile Link <span className="text-red-500">*</span></label>
                  <input
                    type="url"
                    placeholder="https://maps.app.goo.gl/..."
                    value={branchForm.googleBusinessLink || ''}
                    onChange={(e) => setBranchForm(prev => ({ ...prev, googleBusinessLink: e.target.value }))}
                    className="py-3 px-4 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold w-full focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                  />
                </div>



                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-500 leading-relaxed font-semibold">
                  <span className="font-extrabold text-slate-700 block mb-0.5">ℹ️ Google Business Profile Verification</span>
                  Search your branch name above to autofill details and import reviews, or paste your Google Maps link directly. Our admins will verify your branch details.
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
                    className="py-3.5 px-5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 bg-white"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    disabled={branchAutofillLoading}
                    onClick={async () => {
                      if (!branchForm.googleBusinessLink) {
                        setError("Please enter your Google Business Profile link.");
                        return;
                      }
                      setError("");
                      setBranchAutofillLoading(true);
                      try {
                        const res = await fetch('http://localhost:5000/api/businesses/google-autofill-link', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ link: branchForm.googleBusinessLink })
                        });
                        const data = await res.json();
                        if (data.success) {
                          const d = data.data;
                          const allowedPincodes = [
                            '642126', '642207', '642154', '642112', '642205', 
                            '642122', '642204', '642201', '642203', '642102', 
                            '642128', '642113', '642206', '642132', '642111'
                          ];
                          let placePincode = d.pincode ? d.pincode.replace(/\s+/g, '').slice(0, 6) : '';
                          if (placePincode && !allowedPincodes.includes(placePincode)) {
                            setError(`The selected branch is located in pincode ${placePincode}, which is outside the eligible Udumalpet region.`);
                            setBranchAutofillLoading(false);
                            return;
                          }

                          const updated = {
                            ...branchForm,
                            name: d.name || branchForm.name,
                            address: d.address || branchForm.address,
                            phone: d.phone || branchForm.phone,
                            whatsapp: d.phone || branchForm.whatsapp,
                            email: d.email || branchForm.email,
                            website: d.website || branchForm.website || '',
                            locality: d.locality || branchForm.locality,
                            pincode: placePincode || branchForm.pincode,
                            isAddressVerified: true,
                            googlePlaceId: d.googlePlaceId || '',
                            googleRating: d.googleRating || 0,
                            googleReviewsCount: d.googleReviewsCount || 0,
                            googleReviews: d.googleReviews || [],
                            coordinates: {
                              lat: d.latitude || d.coordinates?.lat || 10.585,
                              lng: d.longitude || d.coordinates?.lng || 77.251
                            },
                            timings: d.timings || d.openingHours || branchForm.timings,
                          };
                          setBranchForm(updated);
                          setIsBranchEligibilityVerified(true);
                          setBranchAutofillSuccess(true);
                          setToastMessage("Branch information imported from link successfully.");
                          setTimeout(() => setToastMessage(''), 4000);
                        } else {
                          setError(data.message || "Could not autofill from link. Please enter details manually.");
                        }
                      } catch (err) {
                        setError("Could not autofill from link. Please enter details manually.");
                      } finally {
                        setBranchAutofillLoading(false);
                      }
                    }}
                    className="py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-emerald-700/20 cursor-pointer flex items-center justify-center gap-1.5 flex-grow disabled:opacity-50"
                  >
                    {branchAutofillLoading ? 'Importing Details...' : 'Verify & Proceed'}
                  </button>
                </div>
              </div>
            )}
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
                  style={{ width: `${(((isBranchMode ? branchStep : currentStep) - 1) / ((isBranchMode ? branchSteps : steps).length - 1)) * 100}%` }}
                />
                
                {(isBranchMode ? branchSteps : steps).map((step) => {
                  const isActive = step.id === (isBranchMode ? branchStep : currentStep);
                  const isCompleted = step.id < (isBranchMode ? branchStep : currentStep);
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
              {currentStep === 1 && !isBranchMode && (
                <div className="flex flex-col gap-6 animate-fadeIn">

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

                    {/* Main Category Selector */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Main Category <span className="text-red-500">*</span></label>
                      <select
                        name="requestedParentCategory"
                        value={availableCategories.includes(formData.requestedParentCategory) ? formData.requestedParentCategory : (formData.requestedParentCategory ? 'Others' : '')}
                        onChange={(e) => {
                          const parentVal = e.target.value;
                          let subVal = '';
                          
                          if (parentVal && parentVal !== 'Others') {
                            const subs = parentCategoryMapping[parentVal] || [];
                            subVal = subs[0] || '';
                          } else if (parentVal === 'Others') {
                            subVal = 'Others';
                          }

                          const updated = {
                            ...formData,
                            requestedParentCategory: parentVal === 'Others' ? '' : parentVal,
                            category: subVal,
                            customCategoryName: parentVal === 'Others' ? '' : '',
                            categoryStatus: parentVal === 'Others' ? 'Pending Review' : 'Normal'
                          };
                          setFormData(updated);
                          saveDraft(updated);
                        }}
                        className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="">-- Choose Main Category --</option>
                        {availableCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Custom Main Category Input */}
                    {(formData.requestedParentCategory === '' || !availableCategories.includes(formData.requestedParentCategory)) && 
                     (formData.requestedParentCategory !== undefined) && (
                      <div className="flex flex-col gap-1.5 text-left animate-fadeIn">
                        <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Specify Custom Main Category <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          placeholder="e.g. Tourism Services, Logistics"
                          value={availableCategories.includes(formData.requestedParentCategory) ? '' : formData.requestedParentCategory}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = {
                              ...formData,
                              requestedParentCategory: val,
                              category: 'Others',
                              categoryStatus: 'Pending Review'
                            };
                            setFormData(updated);
                            saveDraft(updated);
                          }}
                          className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                        />
                      </div>
                    )}

                    {/* Subcategory Selector */}
                    {formData.requestedParentCategory !== '' && (
                      <div className="flex flex-col gap-1.5 text-left animate-fadeIn">
                        <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Subcategory <span className="text-red-500">*</span></label>
                        <select
                          name="category"
                          value={(parentCategoryMapping[availableCategories.includes(formData.requestedParentCategory) ? formData.requestedParentCategory : 'Others'] || []).includes(formData.category) ? formData.category : (formData.category ? 'Others' : '')}
                          onChange={(e) => {
                            const subVal = e.target.value;
                            const isCustomParent = !availableCategories.includes(formData.requestedParentCategory);
                            const updated = {
                              ...formData,
                              category: subVal,
                              customCategoryName: subVal === 'Others' ? '' : '',
                              categoryStatus: (subVal === 'Others' || isCustomParent) ? 'Pending Review' : 'Normal'
                            };
                            setFormData(updated);
                            saveDraft(updated);
                          }}
                          className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="">-- Choose Subcategory --</option>
                          {(parentCategoryMapping[availableCategories.includes(formData.requestedParentCategory) ? formData.requestedParentCategory : 'Others'] || []).map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                          <option value="Others">Others (Custom Category)</option>
                        </select>
                      </div>
                    )}

                    {/* Custom Subcategory Input */}
                    {formData.category === 'Others' && (
                      <div className="flex flex-col gap-1.5 text-left animate-fadeIn">
                        <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Specify Custom Subcategory <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          placeholder="e.g. EV Charging Station, Solar Solutions"
                          value={formData.customCategoryName || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = {
                              ...formData,
                              customCategoryName: val,
                              categoryStatus: 'Pending Review'
                            };
                            setFormData(updated);
                            saveDraft(updated);
                          }}
                          className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                        />
                        <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-4 mt-2 flex flex-col gap-1.5 text-xs text-left animate-fadeIn">
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
              {currentStep === 2 && !isBranchMode && (
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

                  <div className="flex flex-col gap-3 mt-4 border-t border-slate-100 pt-5 text-left">
                    <label className="text-xs font-bold text-slate-700 tracking-wide uppercase flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-[#027244]" /> Business Hours (Monday - Sunday)
                    </label>
                    <span className="text-[10px] text-slate-400 font-bold -mt-2 block">Set opening and closing hours for each day. Use "Closed" if not operating on that day.</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4.5 rounded-2xl border border-slate-150">
                      {formData.timings && typeof formData.timings === 'object' && !Array.isArray(formData.timings) ? (
                        Object.keys(formData.timings).map((day) => (
                          <div key={day} className="flex items-center justify-between gap-4">
                            <span className="text-xs font-bold text-slate-600 w-24 shrink-0">{day}</span>
                            <input
                              type="text"
                              value={formData.timings[day] || ''}
                              onChange={(e) => {
                                const newTimings = { ...formData.timings, [day]: e.target.value };
                                const updated = { ...formData, timings: newTimings };
                                setFormData(updated);
                                saveDraft(updated);
                              }}
                              placeholder="e.g. 9:00 AM - 8:00 PM or Closed"
                              className="flex-1 py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-slate-450 font-bold text-center">
                          Standard timings configuration is unavailable.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Contact & Location */}
              {currentStep === 3 && !isBranchMode && (
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

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Website URL (Optional)</label>
                      <input
                        type="text"
                        name="website"
                        value={formData.website || ''}
                        onChange={handleInputChange}
                        placeholder="e.g. www.mybusiness.com"
                        className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Facebook URL (Optional)</label>
                      <input
                        type="text"
                        name="facebook"
                        value={formData.facebook || ''}
                        onChange={handleInputChange}
                        placeholder="e.g. facebook.com/mybusiness"
                        className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Instagram Handle (Optional)</label>
                      <input
                        type="text"
                        name="instagram"
                        value={formData.instagram || ''}
                        onChange={handleInputChange}
                        placeholder="e.g. @mybusiness"
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
                    <div className="flex flex-col gap-1.5 md:col-span-2 text-left">
                      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Area / Locality <span className="text-red-500">*</span></label>
                      <select
                        value={isCustomLocality ? 'Others' : (formData.locality || '')}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'Others') {
                            setIsCustomLocality(true);
                            const updated = { ...formData, locality: '' };
                            setFormData(updated);
                            saveDraft(updated);
                          } else {
                            setIsCustomLocality(false);
                            const updated = { ...formData, locality: val };
                            setFormData(updated);
                            saveDraft(updated);
                          }
                        }}
                        className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="">-- Choose Area / Locality --</option>
                        {availableLocalities.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                        <option value="Others">Others (Custom Locality)</option>
                      </select>
                      {isCustomLocality && (
                        <input
                          type="text"
                          name="locality"
                          value={formData.locality}
                          onChange={handleInputChange}
                          placeholder="Enter custom locality"
                          className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 mt-2 animate-fadeIn"
                        />
                      )}
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
                      googlePlaceId={formData.googlePlaceId}
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Photos & Media */}
              {currentStep === 4 && !isBranchMode && (
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
                          <div className="h-16 w-16 bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xs select-none overflow-hidden">
                            {uploadingLogo ? (
                              <div className="h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            ) : formData.logoUrl ? (
                              <img src={formData.logoUrl} alt="Logo" className="h-full w-full object-cover rounded-2xl" />
                            ) : 'Logo'}
                          </div>
                          <label className="py-2.5 px-4 border border-slate-300 hover:bg-slate-50 font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm text-slate-700">
                            {uploadingLogo ? 'Uploading...' : logoFile ? 'Change File' : 'Choose File'}
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploadingLogo} />
                          </label>
                          {logoFile && !uploadingLogo && <span className="text-xs text-emerald-600 font-bold">✓ Uploaded</span>}
                        </div>
                      </div>

                      {/* Cover */}
                      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Main Cover Image</span>
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-32 bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xs select-none overflow-hidden">
                            {uploadingCover ? (
                              <div className="h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            ) : formData.coverImageUrl ? (
                              <img src={formData.coverImageUrl} alt="Cover" className="h-full w-full object-cover rounded-2xl" />
                            ) : 'Cover'}
                          </div>
                          <label className="py-2.5 px-4 border border-slate-300 hover:bg-slate-50 font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm text-slate-700">
                            {uploadingCover ? 'Uploading...' : coverFile ? 'Change File' : 'Choose File'}
                            <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={uploadingCover} />
                          </label>
                          {coverFile && !uploadingCover && <span className="text-xs text-emerald-600 font-bold">✓ Uploaded</span>}
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
                        {uploadingGallery ? (
                          <>
                            <div className="h-8 w-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2" />
                            <span className="text-xs text-emerald-600 font-bold">Uploading photos...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-slate-400 mb-2" />
                            <label className="font-bold text-xs text-emerald-600 hover:underline cursor-pointer select-none">
                              Click to upload gallery photos
                              <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} className="hidden" />
                            </label>
                          </>
                        )}
                      </div>

                      {/* Uploaded gallery previews */}
                      {formData.galleryUrls && formData.galleryUrls.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {formData.galleryUrls.map((url, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200">
                              <img src={url} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  const newUrls = formData.galleryUrls.filter((_, idx) => idx !== i);
                                  const newFiles = galleryFiles.filter((_, idx) => idx !== i);
                                  setGalleryFiles(newFiles);
                                  const updated = { ...formData, galleryUrls: newUrls };
                                  setFormData(updated);
                                  saveDraft(updated);
                                }}
                                className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold hover:bg-red-600"
                              >×</button>
                            </div>
                          ))}
                        </div>
                      )}

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

              {/* BRANCH MODE STEPS */}
              {isBranchMode && (
                <div className="flex flex-col gap-6 animate-fadeIn">
                  {/* Branch Step 1: Basic Info */}
                  {branchStep === 1 && (
                    <div className="flex flex-col gap-6">
                      <div className="border-b border-slate-100 pb-3 flex flex-col gap-1">
                        <h3 className="text-base font-extrabold text-slate-800">Branch Basic Information</h3>
                        <p className="text-slate-450 text-xs font-semibold">Enter basic info for this branch location.</p>
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Branch Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="name"
                          value={branchForm.name}
                          onChange={handleBranchInputChange}
                          placeholder="e.g. ABC Traders - Branch 1"
                          className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Udumalpet Pincode Badge */}
                        <div className="flex flex-col gap-1.5 md:col-span-2 text-left">
                          <div className="flex justify-between items-center bg-emerald-50/30 border border-emerald-200/60 p-4 rounded-2xl select-none">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">Verified Branch Pincode</span>
                              <span className="text-xs text-slate-700 font-bold">{branchForm.pincode} - Udumalpet Area Eligible</span>
                            </div>
                            <button
                              onClick={() => {
                                setIsBranchEligibilityVerified(false);
                                setBranchForm(prev => ({ ...prev, pincode: '' }));
                              }}
                              className="py-1.5 px-3.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-[11px] rounded-xl transition-colors cursor-pointer"
                            >
                              Change Pincode
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Business Type</label>
                          <select
                            name="type"
                            value={branchForm.type}
                            onChange={handleBranchInputChange}
                            className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 cursor-pointer"
                          >
                            {['Individual / Sole Proprietor', 'Company / LLP', 'Partnership', 'Other'].map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Branch Description <span className="text-red-500">*</span></label>
                        <textarea
                          name="description"
                          value={branchForm.description}
                          onChange={handleBranchInputChange}
                          rows="3"
                          placeholder="Short description for this branch..."
                          className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Branch Step 2: Branch Details */}
                  {branchStep === 2 && (
                    <div className="flex flex-col gap-6">
                      <div className="border-b border-slate-100 pb-3 flex flex-col gap-1">
                        <h3 className="text-base font-extrabold text-slate-800">Branch Details</h3>
                        <p className="text-slate-450 text-xs font-semibold">Enter services and brand info for this branch.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Established Year</label>
                          <input
                            type="text"
                            name="yearEstablished"
                            value={branchForm.yearEstablished}
                            onChange={handleBranchInputChange}
                            placeholder="e.g. 2020"
                            className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Employee Count</label>
                          <select
                            name="employeeCount"
                            value={branchForm.employeeCount}
                            onChange={handleBranchInputChange}
                            className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 cursor-pointer"
                          >
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
                            value={branchForm.gstNumber}
                            onChange={handleBranchInputChange}
                            placeholder="GSTIN"
                            className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Services / Products Offered <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="services"
                          value={branchForm.services}
                          onChange={handleBranchInputChange}
                          placeholder="e.g. Retail, Wholesale, Home Delivery (Comma Separated)"
                          className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Brands Dealt With (Optional)</label>
                        <input
                          type="text"
                          name="brands"
                          value={branchForm.brands}
                          onChange={handleBranchInputChange}
                          placeholder="e.g. Havells, LG, Samsung (Comma Separated)"
                          className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex flex-col gap-3 mt-4 border-t border-slate-100 pt-5 text-left">
                        <label className="text-xs font-bold text-slate-700 tracking-wide uppercase flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-[#027244]" /> Branch Operating Hours (Monday - Sunday)
                        </label>
                        <span className="text-[10px] text-slate-400 font-bold -mt-2 block">Set opening and closing hours for each day. Use "Closed" if not operating on that day.</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4.5 rounded-2xl border border-slate-150">
                          {branchForm.timings && typeof branchForm.timings === 'object' && !Array.isArray(branchForm.timings) ? (
                            Object.keys(branchForm.timings).map((day) => (
                              <div key={day} className="flex items-center justify-between gap-4">
                                <span className="text-xs font-bold text-slate-600 w-24 shrink-0">{day}</span>
                                <input
                                  type="text"
                                  value={branchForm.timings[day] || ''}
                                  onChange={(e) => {
                                    const newTimings = { ...branchForm.timings, [day]: e.target.value };
                                    setBranchForm(prev => ({ ...prev, timings: newTimings }));
                                  }}
                                  placeholder="e.g. 9:00 AM - 8:00 PM or Closed"
                                  className="flex-1 py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                                />
                              </div>
                            ))
                          ) : (
                            <div className="col-span-2 text-slate-450 font-bold text-center">
                              Standard timings configuration is unavailable.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Branch Step 3: Contact & Location */}
                  {branchStep === 3 && (
                    <div className="flex flex-col gap-6">
                      <div className="border-b border-slate-100 pb-3 flex flex-col gap-1">
                        <h3 className="text-base font-extrabold text-slate-805">Branch Contact & Location</h3>
                        <p className="text-slate-450 text-xs font-semibold">Enter contact number and select location on maps for this branch.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5 text-left">
                          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Phone Number <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="phone"
                            value={branchForm.phone}
                            onChange={handleBranchInputChange}
                            placeholder="Phone number"
                            className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5 text-left">
                          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">WhatsApp Number</label>
                          <input
                            type="text"
                            name="whatsapp"
                            value={branchForm.whatsapp}
                            onChange={handleBranchInputChange}
                            placeholder="WhatsApp number"
                            className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5 text-left">
                          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            value={branchForm.email}
                            onChange={handleBranchInputChange}
                            placeholder="Email address"
                            className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5 text-left">
                          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Website URL (Optional)</label>
                          <input
                            type="text"
                            name="website"
                            value={branchForm.website || ''}
                            onChange={handleBranchInputChange}
                            placeholder="e.g. www.mybusiness.com"
                            className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5 text-left">
                          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Facebook URL (Optional)</label>
                          <input
                            type="text"
                            name="facebook"
                            value={branchForm.facebook || ''}
                            onChange={handleBranchInputChange}
                            placeholder="e.g. facebook.com/mybusiness"
                            className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5 text-left">
                          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Instagram Handle (Optional)</label>
                          <input
                            type="text"
                            name="instagram"
                            value={branchForm.instagram || ''}
                            onChange={handleBranchInputChange}
                            placeholder="e.g. @mybusiness"
                            className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Branch Address <span className="text-red-500">*</span></label>
                        <textarea
                          name="address"
                          value={branchForm.address}
                          onChange={handleBranchInputChange}
                          rows="2"
                          placeholder="Complete branch address"
                          className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5 text-left">
                          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Area / Locality <span className="text-red-500">*</span></label>
                          <select
                            value={isBranchCustomLocality ? 'Others' : (branchForm.locality || '')}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'Others') {
                                setIsBranchCustomLocality(true);
                                setBranchForm(prev => ({ ...prev, locality: '' }));
                              } else {
                                setIsBranchCustomLocality(false);
                                setBranchForm(prev => ({ ...prev, locality: val }));
                              }
                            }}
                            className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 cursor-pointer"
                          >
                            <option value="">-- Choose Area / Locality --</option>
                            {availableLocalities.map(loc => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                            <option value="Others">Others (Custom Locality)</option>
                          </select>
                          {isBranchCustomLocality && (
                            <input
                              type="text"
                              name="locality"
                              value={branchForm.locality}
                              onChange={handleBranchInputChange}
                              placeholder="Enter custom locality"
                              className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 mt-2 animate-fadeIn"
                            />
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5 text-left">
                          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">City / Town</label>
                          <input
                            type="text"
                            disabled
                            value="Udumalpet"
                            className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-bold cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {/* Branch Autocomplete map */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 mt-2 flex flex-col gap-4">
                        <div className="flex items-start gap-2 text-slate-705 text-left">
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-slate-800">Map & Address Autocomplete Lookup</span>
                            <span className="text-[10px] text-slate-450 font-bold">Please select matching address from autocomplete suggestions below to verify details.</span>
                          </div>
                        </div>
                        <MockGoogleMaps
                          pincode={branchForm.pincode}
                          onAddressSelect={handleBranchAddressSelect}
                          initialAddress={branchForm.address}
                        />
                      </div>
                    </div>
                  )}

                  {/* Branch Step 4: Photos & Media */}
                  {branchStep === 4 && (
                    <div className="flex flex-col gap-6 animate-fadeIn">
                      <div className="border-b border-slate-100 pb-3 flex flex-col gap-1">
                        <h3 className="text-base font-extrabold text-slate-800">Branch Photos & Media</h3>
                        <p className="text-slate-400 text-xs font-semibold">Upload photos of your branch store front or interiors.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        {/* Logo & Cover Upload */}
                        <div className="flex flex-col gap-5 border border-slate-200/80 rounded-2xl p-5">
                          <h4 className="font-extrabold text-sm text-slate-800">Identity Images</h4>
                          
                          {/* Logo */}
                          <div className="flex flex-col gap-1.5 text-left">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Branch Logo (Optional)</span>
                            <div className="flex items-center gap-4">
                              <div className="h-16 w-16 bg-slate-55 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xs select-none">
                                {branchLogoFile ? '✓ Logo' : 'Logo'}
                              </div>
                              <label className="py-2.5 px-4 border border-slate-300 hover:bg-slate-50 font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm text-slate-700">
                                Choose File
                                <input type="file" onChange={handleBranchLogoUpload} className="hidden" />
                              </label>
                            </div>
                          </div>

                          {/* Cover */}
                          <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4 text-left">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Branch Cover Image</span>
                            <div className="flex items-center gap-4">
                              <div className="h-16 w-32 bg-slate-55 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xs select-none">
                                {branchCoverFile ? '✓ Cover Loaded' : 'Cover'}
                              </div>
                              <label className="py-2.5 px-4 border border-slate-300 hover:bg-slate-50 font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm text-slate-700">
                                Choose File
                                <input type="file" onChange={handleBranchCoverUpload} className="hidden" />
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Gallery Images Upload */}
                        <div className="flex flex-col gap-5 border border-slate-200/80 rounded-2xl p-5 justify-between">
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-800">Gallery Photos</h4>
                            <p className="text-slate-450 text-xs mt-1 leading-normal font-semibold">Upload photos of store front, interiors or products.</p>
                          </div>

                          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl transition-colors cursor-pointer bg-slate-50/50">
                            <Upload className="h-8 w-8 text-slate-400 mb-2" />
                            <label className="font-bold text-xs text-emerald-600 hover:underline cursor-pointer select-none">
                              Click to upload branch gallery photos
                              <input type="file" multiple onChange={handleBranchGalleryUpload} className="hidden" />
                            </label>
                          </div>

                          {/* Uploaded files count badge */}
                          <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs text-slate-600 font-semibold">
                            <span className="font-bold">Total uploaded photos:</span>
                            <span className="bg-emerald-600 text-white font-extrabold px-2.5 py-0.5 rounded-full">
                              {(branchLogoFile ? 1 : 0) + (branchCoverFile ? 1 : 0) + branchGalleryFiles.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* STEP 5: Choose Plan Inline */}
              {currentStep === 5 && !isBranchMode && (
                <div className="flex flex-col gap-6 animate-fadeIn">
                  <ChoosePlan
                    isStep={true}
                    initialBusiness={formData}
                    onNext={(updatedBiz) => {
                      setFormData(prev => ({
                        ...prev,
                        subscriptionStatus: updatedBiz?.subscriptionStatus || 'active',
                        isPremium: updatedBiz?.isPremium !== undefined ? updatedBiz.isPremium : true
                      }));
                      setCurrentStep(6);
                    }}
                  />
                </div>
              )}

              {/* STEP 6: Review & Submit */}
              {currentStep === 6 && !isBranchMode && (
                <div className="flex flex-col gap-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3 flex flex-col gap-1">
                    <h3 className="text-lg font-extrabold text-slate-805">6. Review & Submit</h3>
                    <p className="text-slate-450 text-xs font-semibold">Review your information carefully before submitting.</p>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200/80 text-amber-850 rounded-2xl p-4.5 text-xs font-semibold flex items-start gap-2.5 shadow-sm">
                    <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>Review your information carefully before submitting. Upon submission, your profile status becomes <strong>"Pending Verification"</strong> until audited by our administrators.</span>
                  </div>

                  {/* Beautiful interactive preview layout */}
                  <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="bg-slate-900 text-white p-6 flex justify-between items-center text-left">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest leading-none">UBT Live Preview</span>
                        <span className="font-extrabold text-lg leading-tight mt-1">{formData.name || 'Your Business Name'}</span>
                        <span className="text-xs text-slate-400 font-semibold">{formData.locality}, Udumalpet</span>
                      </div>
                      <span className="bg-amber-550 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                        Pending Vetting
                      </span>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 text-left">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wider font-sans">Description</span>
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
                {(isBranchMode || currentStep > 1) ? (
                  <button 
                    onClick={handleBack}
                    className="py-3.5 px-5 border border-slate-300 hover:bg-slate-50 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer text-slate-700 bg-white"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsPincodeVerified(false);
                      setFormData(prev => ({ ...prev, pincode: '' }));
                    }}
                    className="py-3.5 px-5 border border-slate-350 hover:bg-slate-50 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer text-slate-700 bg-white"
                  >
                    <ArrowLeft className="h-4 w-4" /> Change Pincode
                  </button>
                )}

                <div className="flex items-center gap-3">
                  {!isBranchMode && (
                    <button
                      onClick={() => {
                        saveDraft(formData);
                        alert("Progress saved as a draft successfully!");
                      }}
                      className="py-3.5 px-5 border border-slate-300 hover:border-slate-400 text-slate-655 hover:text-slate-800 font-extrabold text-xs rounded-xl transition-all cursor-pointer bg-white"
                    >
                      Save & Continue Later
                    </button>
                  )}

                  {isBranchMode ? (
                    <button 
                      onClick={handleNext}
                      className="py-3.5 px-6 bg-[#027244] hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow shadow-emerald-700/20 cursor-pointer"
                    >
                      {branchStep < 4 ? 'Save & Continue' : 'Save Branch'} <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : currentStep < steps.length ? (
                    currentStep !== 5 && (
                      <button 
                        onClick={handleNext}
                        className="py-3.5 px-6 bg-[#027244] hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow shadow-emerald-700/20 cursor-pointer"
                      >
                        Save & Continue <ArrowRight className="h-4 w-4" />
                      </button>
                    )
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
                  Step {isBranchMode ? branchStep : currentStep} of {isBranchMode ? branchSteps.length : steps.length} Completed
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-grow h-2 bg-slate-200/70 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#137333] transition-all duration-300 rounded-full" 
                      style={{ width: `${((isBranchMode ? branchStep : currentStep) / (isBranchMode ? branchSteps.length : steps.length)) * 100}%` }}
                    />
                  </div>
                  <span className="text-[#001c41] font-black text-xs min-w-[32px] text-right">
                    {Math.round(((isBranchMode ? branchStep : currentStep) / (isBranchMode ? branchSteps.length : steps.length)) * 100)}%
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3.5 mt-2">
                {(isBranchMode ? branchSteps : steps).map((step) => {
                  const isActive = step.id === (isBranchMode ? branchStep : currentStep);
                  const isCompleted = step.id < (isBranchMode ? branchStep : currentStep);
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

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-905/90 text-white border border-slate-700 backdrop-blur-md rounded-2xl py-3.5 px-5 shadow-2xl flex items-center gap-2.5 z-50 animate-slideUp text-xs font-bold font-sans">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
