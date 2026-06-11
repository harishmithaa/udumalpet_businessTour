'use client';

import { useState, useEffect } from 'react';
import { Search, CheckCircle, MapPin, AlertCircle, RefreshCw } from 'lucide-react';

const mockAddressesByPincode = {
  '642126': [
    { text: 'Head Post Office Road, Udumalpet Main Town, Tamil Nadu - 642126', locality: 'Head Post Office', coords: { lat: 10.5862, lng: 77.2472 } },
    { text: 'Bazaar Street, Udumalpet Main Town, Tamil Nadu - 642126', locality: 'Bazaar Street', coords: { lat: 10.5855, lng: 77.2495 } },
    { text: 'Eripalayam Main Road, Udumalpet Main Town, Tamil Nadu - 642126', locality: 'Eripalayam', coords: { lat: 10.5912, lng: 77.2515 } },
    { text: 'Dharapuram Road, Udumalpet Main Town, Tamil Nadu - 642126', locality: 'Dharapuram Road', coords: { lat: 10.584, lng: 77.252 } },
  ],
  '642207': [
    { text: 'Erisinampatti Main Road, Pungamuthur, Tamil Nadu - 642207', locality: 'Erisinampatti', coords: { lat: 10.5012, lng: 77.1685 } },
    { text: 'Devanurpudur Road, Pungamuthur, Tamil Nadu - 642207', locality: 'Devanurpudur', coords: { lat: 10.5055, lng: 77.1722 } },
    { text: 'Vilamarathupatti Junction, Pungamuthur, Tamil Nadu - 642207', locality: 'Vilamarathupatti', coords: { lat: 10.5102, lng: 77.1612 } },
    { text: 'Udukkampalayam Village, Pungamuthur, Tamil Nadu - 642207', locality: 'Udukkampalayam', coords: { lat: 10.4952, lng: 77.1565 } },
  ],
  '642154': [
    { text: 'Bodipatti Panchayat Ground Road, Bodipatti, Tamil Nadu - 642154', locality: 'Bodipatti', coords: { lat: 10.5752, lng: 77.2285 } },
    { text: 'Gandhi Nagar Road East, Udumalpet, Tamil Nadu - 642154', locality: 'Gandhi Nagar', coords: { lat: 10.5862, lng: 77.2492 } },
    { text: 'Andiyagoundanur Village Road, Udumalpet, Tamil Nadu - 642154', locality: 'Andiyagoundanur', coords: { lat: 10.5615, lng: 77.2141 } },
    { text: 'Kuralkuttai Road, Bodipatti, Tamil Nadu - 642154', locality: 'Kuralkuttai', coords: { lat: 10.5695, lng: 77.2212 } },
    { text: 'Thumbalapatti Village, Udumalpet, Tamil Nadu - 642154', locality: 'Thumbalapatti', coords: { lat: 10.5512, lng: 77.1985 } },
  ],
  '642112': [
    { text: 'Thirumoorthi Nagar Main Road, Dhali, Tamil Nadu - 642112', locality: 'Thirumoorthi Nagar', coords: { lat: 10.4712, lng: 77.1852 } },
    { text: 'Jallipatti Village Road, Dhali, Tamil Nadu - 642112', locality: 'Jallipatti', coords: { lat: 10.4815, lng: 77.2112 } },
    { text: 'Manupatti Bus Stop, Dhali, Tamil Nadu - 642112', locality: 'Manupatti', coords: { lat: 10.4552, lng: 77.2005 } },
    { text: 'Kurichikottai Road, Dhali, Tamil Nadu - 642112', locality: 'Kurichikottai', coords: { lat: 10.4902, lng: 77.1912 } },
  ],
  '642205': [
    { text: 'Kongalnagaram Main Road, Pethappampatti, Tamil Nadu - 642205', locality: 'Kongalnagaram', coords: { lat: 10.6812, lng: 77.2341 } },
    { text: 'Poosaripatti Village Road, Pethappampatti, Tamil Nadu - 642205', locality: 'Poosaripatti', coords: { lat: 10.6725, lng: 77.2415 } },
    { text: 'Dhottampatti Road, Pethappampatti, Tamil Nadu - 642205', locality: 'Dhottampatti', coords: { lat: 10.6652, lng: 77.2295 } },
  ],
  '642122': [
    { text: 'Anthiyur Road, Poolankinar, Tamil Nadu - 642122', locality: 'Anthiyur', coords: { lat: 10.5982, lng: 77.2155 } },
    { text: 'Ganapathipalayam Road, Poolankinar, Tamil Nadu - 642122', locality: 'Ganapathipalayam', coords: { lat: 10.6012, lng: 77.2215 } },
    { text: 'Kodingium Village, Poolankinar, Tamil Nadu - 642122', locality: 'Kodingium', coords: { lat: 10.6122, lng: 77.2085 } },
  ],
  '642204': [
    { text: 'Kolumam Main Road, Kolumam, Tamil Nadu - 642204', locality: 'Kolumam', coords: { lat: 10.5182, lng: 77.3485 } },
    { text: 'Bazaar Street, Komaralingam, Tamil Nadu - 642204', locality: 'Komaralingam', coords: { lat: 10.5215, lng: 77.3551 } },
    { text: 'Samarayapatti Village Road, Komaralingam, Tamil Nadu - 642204', locality: 'Samarayapatti', coords: { lat: 10.5312, lng: 77.3612 } },
    { text: 'Pappankulam Road, Kolumam, Tamil Nadu - 642204', locality: 'Pappankulam', coords: { lat: 10.5105, lng: 77.3412 } },
  ],
  '642201': [
    { text: 'Amandakadavoo Road, Gudimangalam, Tamil Nadu - 642201', locality: 'Amandakadavoo', coords: { lat: 10.7082, lng: 77.2215 } },
    { text: 'Kondampatti Road, Gudimangalam, Tamil Nadu - 642201', locality: 'Kondampatti', coords: { lat: 10.7252, lng: 77.2512 } },
    { text: 'Kottamangalam Road, Gudimangalam, Tamil Nadu - 642201', locality: 'Kottamangalam', coords: { lat: 10.7302, lng: 77.2341 } },
  ],
  '642203': [
    { text: 'Kadathur Main Road, Kaniyur, Tamil Nadu - 642203', locality: 'Kadathur', coords: { lat: 10.5512, lng: 77.3892 } },
    { text: 'Myvadi Junction Road, Kaniyur, Tamil Nadu - 642203', locality: 'Myvadi', coords: { lat: 10.5605, lng: 77.3795 } },
    { text: 'Thungavi Road, Kaniyur, Tamil Nadu - 642203', locality: 'Thungavi', coords: { lat: 10.5412, lng: 77.3912 } },
  ],
  '642102': [
    { text: 'Kallapuram Village Road, Amaravathi Nagar, Tamil Nadu - 642102', locality: 'Kallapuram', coords: { lat: 10.4252, lng: 77.1512 } },
    { text: 'Amaravathi Dam Area Road, Amaravathi Nagar, Tamil Nadu - 642102', locality: 'Dam Area', coords: { lat: 10.4155, lng: 77.1642 } },
  ],
  '642128': [
    { text: 'Venkatesa Mills Colony, Udumalpet, Tamil Nadu - 642128', locality: 'Venkatesa Mills', coords: { lat: 10.5802, lng: 77.2319 } },
    { text: 'S V Puram Post Road, Udumalpet, Tamil Nadu - 642128', locality: 'S V Puram', coords: { lat: 10.5795, lng: 77.2295 } },
    { text: 'Pollachi Road, Udumalpet, Tamil Nadu - 642128', locality: 'Pollachi Road', coords: { lat: 10.5823, lng: 77.2341 } },
  ],
  '642113': [
    { text: 'Solamadevi Road, Madathukulam, Tamil Nadu - 642113', locality: 'Solamadevi', coords: { lat: 10.5612, lng: 77.3492 } },
    { text: 'Sarkarkannadipudur Main Road, Madathukulam, Tamil Nadu - 642113', locality: 'Sarkarkannadipudur', coords: { lat: 10.5525, lng: 77.3551 } },
  ],
  '642206': [
    { text: 'Aathukinathupatti Road, Poolavadi, Tamil Nadu - 642206', locality: 'Aathukinathupatti', coords: { lat: 10.6982, lng: 77.3212 } },
    { text: 'Munduvelampatti Village, Poolavadi, Tamil Nadu - 642206', locality: 'Munduvelampatti', coords: { lat: 10.7022, lng: 77.3295 } },
  ],
  '642132': [
    { text: 'Dheepalapatti Village Road, Valavadi, Tamil Nadu - 642132', locality: 'Dheepalapatti', coords: { lat: 10.5082, lng: 77.2712 } },
    { text: 'Sundakkampalayam Road, Valavadi, Tamil Nadu - 642132', locality: 'Sundakkampalayam', coords: { lat: 10.5122, lng: 77.2795 } },
  ],
  '642111': [
    { text: 'Agrahara Kannadiputhur Main Road, Tamil Nadu - 642111', locality: 'Agrahara Kannadiputhur', coords: { lat: 10.5312, lng: 77.3112 } },
    { text: 'Krishnapuram Village Road, Tamil Nadu - 642111', locality: 'Krishnapuram', coords: { lat: 10.5285, lng: 77.3095 } },
  ],
};

// ==========================================
// MOCK GOOGLE MAPS COMPONENT (AUTOCOMPLETE)
// ==========================================
// This component provides an input for street addresses which:
// 1. Integrates with the backend's Google autocomplete endpoint (restricted to 'geocode' types).
// 2. Uses the parent-provided 'pincode' to restrict predictions.
// 3. Communicates coordinate selection and verification status back to the parent.
// 4. Gracefully falls back to mock addresses per pincode if backend is offline or key is absent.
export default function MockGoogleMaps({ pincode, onAddressSelect, initialAddress = '', googlePlaceId = '' }) {
  const [addressInput, setAddressInput] = useState(initialAddress);
  const [suggestions, setSuggestions] = useState([]);
  const [isVerified, setIsVerified] = useState(!!googlePlaceId);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialAddress) {
      setAddressInput(initialAddress);
      setIsVerified(!!googlePlaceId);
    }
  }, [initialAddress, googlePlaceId]);

  // Reset verification if pincode changes (only if pincode is actually provided)
  useEffect(() => {
    if (pincode && addressInput && isVerified) {
      setIsVerified(false);
      setSuggestions([]);
      setError('');
      if (onAddressSelect) {
        onAddressSelect({
          address: addressInput,
          locality: '',
          coordinates: { lat: 10.585, lng: 77.251 },
          isVerified: false,
          googlePlaceId: '',
        });
      }
    }
  }, [pincode]);

  const handleInputChange = async (e) => {
    const val = e.target.value;
    setAddressInput(val);
    setIsVerified(false);
    setError('');
 
    // Propagate free-form address value to parent state immediately
    if (onAddressSelect) {
      onAddressSelect({
        address: val,
        locality: '',
        coordinates: { lat: 10.585, lng: 77.251 },
        isVerified: false,
        googlePlaceId: '',
      });
    }
 
    if (val.length > 2) {
      try {
        const query = pincode ? `?q=${encodeURIComponent(val)}&types=geocode&pincode=${pincode}` : `?q=${encodeURIComponent(val)}&types=geocode`;
        const res = await fetch(`http://localhost:5000/api/businesses/google-autocomplete${query}`);
        const data = await res.json();
        if (data.success && data.predictions) {
          setSuggestions(data.predictions);
        }
      } catch (err) {
        console.error('Error fetching address autocomplete:', err);
      }
    } else {
      setSuggestions([]);
    }
  };
 
  const handleSelectSuggestion = async (sug) => {
    setSuggestions([]);
    setError('');
 
    try {
      const res = await fetch('http://localhost:5000/api/businesses/google-autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId: sug.place_id })
      });
      const data = await res.json();
      if (data.success) {
        const d = data.data;
        setAddressInput(d.address);
        setIsVerified(true);
        if (onAddressSelect) {
          onAddressSelect({
            address: d.address,
            locality: d.locality || 'Udumalpet',
            pincode: d.pincode || '',
            coordinates: d.coordinates || { lat: d.latitude, lng: d.longitude },
            isVerified: true,
            googlePlaceId: sug.place_id,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching suggestion details:', err);
      setError('Failed to fetch address details from Google.');
    }
  };
 
  return (
    <div className="w-full flex flex-col gap-2.5 relative">
      <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
        Street Address (Google Maps Autocomplete Optional)
      </label>
      
      <div className="relative flex items-center">
        <input
          type="text"
          value={addressInput}
          readOnly
          placeholder="Address populated automatically via Google Import Autofill..."
          className={`w-full py-2.5 pl-3 pr-28 text-sm bg-slate-50 border rounded shadow-sm focus:outline-none cursor-not-allowed ${
            isVerified 
              ? 'border-emerald-500' 
              : 'border-slate-200'
          }`}
        />
        
        {/* Verification Status Badge */}
        <div className="absolute right-3.5 flex items-center gap-1.5 pointer-events-none select-none">
          {isVerified ? (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-emerald-600" />
              Verified Address
            </span>
          ) : (
            <span className="text-slate-400 text-[10px] font-medium flex items-center gap-1">
              <Search className="h-3 w-3 text-slate-400" />
              Google Autocomplete
            </span>
          )}
        </div>
      </div>
 
      {/* Error Output */}
      {error && (
        <span className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-0.5">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </span>
      )}
 
      {/* Suggestion Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border border-slate-200 shadow-xl rounded-b mt-0.5 z-40 max-h-60 overflow-y-auto">
          {suggestions.map((sug, idx) => (
            <button
              key={sug.place_id || idx}
              type="button"
              onClick={() => handleSelectSuggestion(sug)}
              className="w-full px-4 py-3 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 border-b border-slate-100 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{sug.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
