import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, Mail, Lock, Phone, Key, AlertCircle, Loader, 
  User, Eye, EyeOff, BarChart2, Star, TrendingUp, Users, MapPin, ThumbsUp,
  Calendar, Sparkles, Grid, BookOpen, FileEdit, MessageSquare, Activity, Headset, ArrowLeft
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get('from') || 'business';
  const [activeTab, setActiveTab] = useState('password'); // password | otp
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP states
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const renderSidebar = () => {

    if (fromParam === 'events') {
      return (
        <div className="lg:w-[45%] bg-[#F0FDF4]/80 text-[#001c41] p-10 flex flex-col justify-between relative border-r border-slate-100">
          <div className="flex flex-col gap-5">
            <h2 className="text-3xl font-black tracking-tight text-[#001c41]">Welcome Back!</h2>
            <p className="text-slate-505 text-sm font-semibold max-w-xs leading-relaxed">
              Login to your account and manage your events in Udumalpet easily.
            </p>

            <ul className="flex flex-col gap-5 mt-6">
              {[
                { 
                  title: 'List Your Events', 
                  desc: 'Reach thousands of people in and around Udumalpet.',
                  icon: <Calendar className="h-4.5 w-4.5 text-[#027244]" />,
                  bg: 'bg-emerald-50 border-emerald-100/50' 
                },
                { 
                  title: 'Easy & Fast', 
                  desc: 'Quick event listing in just a few simple steps.',
                  icon: <Sparkles className="h-4.5 w-4.5 text-[#001c41]" />,
                  bg: 'bg-blue-50 border-blue-100/50'
                },
                { 
                  title: 'Secure Payments', 
                  desc: 'Safe and secure online payments for paid listings.',
                  icon: <ShieldCheck className="h-4.5 w-4.5 text-amber-500 fill-current" />,
                  bg: 'bg-amber-50 border-amber-100/50'
                },
                { 
                  title: 'Track & Manage', 
                  desc: 'Manage registrations and track your events performance.',
                  icon: <Grid className="h-4.5 w-4.5 text-purple-600" />,
                  bg: 'bg-purple-50 border-purple-100/50'
                }
              ].map((f, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className={`h-9 w-9 rounded-full ${f.bg} flex items-center justify-center shrink-0 border shadow-sm`}>
                    {f.icon}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <h5 className="font-extrabold text-[#001c41] text-[13.5px] leading-tight">{f.title}</h5>
                    <p className="text-[11px] text-slate-500 leading-normal font-semibold mt-0.5">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Music Stage Night Event Illustration */}
          <div className="w-full mt-10 pt-2 shrink-0 select-none overflow-hidden rounded-2xl shadow-sm border border-slate-200/50 bg-[#0B132B]">
            <svg className="w-full h-32" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="300" height="120" fill="#0B132B"/>
              <circle cx="25" cy="20" r="0.8" fill="#FFF" opacity="0.6"/>
              <circle cx="85" cy="35" r="1" fill="#FFF" opacity="0.8"/>
              <circle cx="150" cy="15" r="0.8" fill="#FFF" opacity="0.5"/>
              <circle cx="210" cy="40" r="1.2" fill="#FFF" opacity="0.9"/>
              <circle cx="270" cy="25" r="0.8" fill="#FFF" opacity="0.6"/>
              
              <polygon points="50,120 100,20 150,120" fill="#E0F2FE" opacity="0.15"/>
              <polygon points="120,120 150,20 180,120" fill="#FEF3C7" opacity="0.15"/>
              <polygon points="200,120 220,30 260,120" fill="#FCE7F3" opacity="0.12"/>
              
              <circle cx="60" cy="30" r="2" fill="#FCD34D"/>
              <path d="M 60,30 L 50,20 M 60,30 L 70,20 M 60,30 L 50,40 M 60,30 L 70,40 M 60,30 L 45,30 M 60,30 L 75,30" stroke="#FCD34D" strokeWidth="0.8"/>
              <circle cx="240" cy="25" r="2.5" fill="#F43F5E"/>
              <path d="M 240,25 L 230,15 M 240,25 L 250,15 M 240,25 L 230,35 M 240,25 L 250,35 M 240,25 L 225,25 M 240,25 L 255,25" stroke="#F43F5E" strokeWidth="0.8"/>

              <path d="M 245,120 L 245,95 L 250,95 L 250,85 L 255,85 L 255,75 L 260,75 L 260,65 L 265,65 L 265,58 L 270,58 L 270,52 C 270,48 274,48 274,52 L 274,58 L 279,58 L 279,65 L 284,65 L 284,75 L 289,75 L 289,85 L 289,85 L 294,85 L 294,95 L 299,95 L 299,120 Z" fill="#1C2541"/>

              <rect y="105" width="300" height="15" fill="#1E293B"/>
              
              <circle cx="100" cy="88" r="4.5" fill="#020617"/>
              <path d="M 96,93 L 104,93 L 106,105 L 94,105 Z" fill="#020617"/>
              <path d="M 93,92 L 102,99 L 109,92" stroke="#D97706" strokeWidth="1.5"/>
              
              <circle cx="140" cy="85" r="4.5" fill="#020617"/>
              <path d="M 136,90 L 144,90 L 146,105 L 134,105 Z" fill="#020617"/>
              
              <path d="M 10,120 Q 15,108 18,120 Q 25,105 28,120 Q 38,102 43,120 Q 52,109 56,120 Q 70,105 75,120 Q 90,111 94,120 Q 115,100 120,120 Q 130,107 135,120 Q 155,103 160,120 Q 180,108 185,120 Q 205,104 210,120 Q 220,110 225,120 Q 240,103 245,120 Q 260,111 265,120 Q 280,106 285,120 Z" fill="#090D1A"/>
            </svg>
          </div>
          
          <div className="z-10 mt-10 p-5 rounded-2xl bg-white/70 border border-emerald-100 flex items-start gap-4 shadow-sm text-left">
            <div className="bg-[#E6F2ED] p-2.5 rounded-xl text-[#027244] border border-emerald-100/50 shrink-0">
              <Headset className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Need Help?</span>
              <span className="text-xs text-[#001c41] font-extrabold mt-1 leading-normal">Our events support desk is here for you.</span>
              <a href="tel:+911234567890" className="text-xs text-[#027244] font-black mt-1 hover:underline leading-none">Call: +91 12345 67890</a>
            </div>
          </div>
        </div>
      );
    }

    if (fromParam === 'blogs') {
      return (
        <div className="lg:w-[45%] bg-[#F0FDF4]/80 text-[#001c41] p-10 flex flex-col justify-between relative border-r border-slate-100">
          <div className="flex flex-col gap-5">
            <h2 className="text-3xl font-black tracking-tight text-[#001c41]">Welcome Back!</h2>
            <p className="text-slate-505 text-sm font-semibold max-w-xs leading-relaxed">
              Login to your account and share your stories with the world.
            </p>

            <ul className="flex flex-col gap-5 mt-6">
              {[
                { 
                  title: 'Share Your Insights', 
                  desc: 'Reach thousands of active readers globally and build your audience.',
                  icon: <BookOpen className="h-4.5 w-4.5 text-[#027244]" />,
                  bg: 'bg-emerald-50 border-emerald-100/50' 
                },
                { 
                  title: 'Write for Free', 
                  desc: 'Publish unlimited articles and insights with zero subscription fees.',
                  icon: <FileEdit className="h-4.5 w-4.5 text-[#001c41]" />,
                  bg: 'bg-blue-50 border-blue-100/50'
                },
                { 
                  title: 'Comment Moderation', 
                  desc: 'Manage comments, moderate feedback, and toggle likes/comments options.',
                  icon: <MessageSquare className="h-4.5 w-4.5 text-amber-500 fill-current" />,
                  bg: 'bg-amber-50 border-amber-100/50'
                },
                { 
                  title: 'Dashboard Analytics', 
                  desc: 'Track likes and reader feedback directly from your personal dashboard.',
                  icon: <Activity className="h-4.5 w-4.5 text-purple-600" />,
                  bg: 'bg-purple-50 border-purple-100/50'
                }
              ].map((f, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className={`h-9 w-9 rounded-full ${f.bg} flex items-center justify-center shrink-0 border shadow-sm`}>
                    {f.icon}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <h5 className="font-extrabold text-[#001c41] text-[13.5px] leading-tight">{f.title}</h5>
                    <p className="text-[11px] text-slate-500 leading-normal font-semibold mt-0.5">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full mt-10 pt-2 shrink-0 select-none overflow-hidden rounded-2xl shadow-sm border border-slate-200/50 bg-[#0F172A]">
            <svg className="w-full h-32" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="300" height="120" fill="#0F172A"/>
              <path d="M 200,30 L 150,120 L 250,120 Z" fill="#FCD34D" opacity="0.15"/>
              <path d="M 230,120 L 230,50 L 205,50" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round"/>
              <path d="M 200,45 L 210,55" stroke="#94A3B8" strokeWidth="5"/>
              <circle cx="230" cy="120" r="6" fill="#64748B"/>
              <rect x="75" y="80" width="70" height="4" fill="#E2E8F0" rx="1"/>
              <polygon points="80,80 70,110 150,110 140,80" fill="#475569"/>
              <rect x="85" y="85" width="50" height="22" fill="#38BDF8"/>
              <path d="M 60,110 L 160,110 L 165,115 L 55,115 Z" fill="#94A3B8"/>
              <rect x="175" y="98" width="12" height="12" fill="#EC4899" rx="2"/>
              <path d="M 187,101 C 190,101 190,107 187,107" stroke="#EC4899" strokeWidth="2" fill="none"/>
              <path d="M 179,93 Q 181,90 179,87 M 182,94 Q 184,91 182,88" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6"/>
              <rect x="25" y="103" width="30" height="7" fill="#10B981" rx="1"/>
              <rect x="27" y="97" width="26" height="6" fill="#F59E0B" rx="1"/>
              <rect x="26" y="92" width="28" height="5" fill="#3B82F6" rx="1"/>
              <circle cx="110" cy="50" r="12" fill="#027244" opacity="0.2"/>
              <path d="M 108,46 L 112,46 M 106,50 L 114,50 M 110,43 L 110,51" stroke="#34D399" strokeWidth="1.5"/>
              <circle cx="170" cy="35" r="14" fill="#3B82F6" opacity="0.2"/>
              <path d="M 166,35 L 174,35 M 170,31 L 170,39" stroke="#60A5FA" strokeWidth="1.5"/>
            </svg>
          </div>

          <div className="z-10 mt-10 p-5 rounded-2xl bg-white/70 border border-emerald-100 flex items-start gap-4 shadow-sm text-left">
            <div className="bg-[#E6F2ED] p-2.5 rounded-xl text-[#027244] border border-emerald-100/50 shrink-0">
              <Headset className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Need Help?</span>
              <span className="text-xs text-[#001c41] font-extrabold mt-1 leading-normal">Our editor assistance team is here to help.</span>
              <a href="mailto:udumalpetbusinesstour@gmail.com" className="text-xs text-[#027244] font-black mt-1 hover:underline leading-none">Email: udumalpetbusinesstour@gmail.com</a>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="lg:w-[45%] bg-[#F0FDF4]/80 text-[#001c41] p-10 flex flex-col justify-between relative border-r border-slate-100">
        <div className="flex flex-col gap-5">
          <h2 className="text-3xl font-black tracking-tight text-[#001c41]">Welcome Back!</h2>
          <p className="text-slate-505 text-sm font-semibold max-w-xs leading-relaxed">
            Login to your account and manage your business easily.
          </p>

          <ul className="flex flex-col gap-5 mt-6">
            {[
              { 
                title: 'Manage your business profile', 
                desc: 'Update details, photos, services and more.',
                icon: <ShieldCheck className="h-4.5 w-4.5 text-[#027244]" />,
                bg: 'bg-emerald-50 border-emerald-100/50' 
              },
              { 
                title: 'Get more leads & enquiries', 
                desc: 'Receive quality leads from local customers.',
                icon: <BarChart2 className="h-4.5 w-4.5 text-[#001c41]" />,
                bg: 'bg-blue-50 border-blue-100/50'
              },
              { 
                title: 'Build trust with reviews', 
                desc: 'Showcase reviews and grow your reputation.',
                icon: <Star className="h-4.5 w-4.5 text-amber-500 fill-current" />,
                bg: 'bg-amber-50 border-amber-100/50'
              },
              { 
                title: 'Grow your business', 
                desc: 'Increase visibility and reach more customers.',
                icon: <TrendingUp className="h-4.5 w-4.5 text-purple-600" />,
                bg: 'bg-purple-50 border-purple-100/50'
              }
            ].map((f, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className={`h-9 w-9 rounded-full ${f.bg} flex items-center justify-center shrink-0 border shadow-sm`}>
                  {f.icon}
                </span>
                <div className="flex flex-col gap-0.5">
                  <h5 className="font-extrabold text-[#001c41] text-[13.5px] leading-tight">{f.title}</h5>
                  <p className="text-[11px] text-slate-500 leading-normal font-semibold mt-0.5">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full mt-10 pt-2 shrink-0 select-none">
          <svg className="w-full h-32" viewBox="0 0 300 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 230,25 a 10,10 0 0,1 15,-5 a 15,15 0 0,1 22,2 a 12,12 0 0,1 5,13 l -42,0 z" fill="#ffffff" opacity="0.8"/>
            <path d="M 40,20 a 8,8 0 0,1 12,-4 a 12,12 0 0,1 18,2 a 10,10 0 0,1 4,10 l -34,0 z" fill="#ffffff" opacity="0.8"/>
            <path d="M 85,15 Q 89,12 92,16 Q 95,12 99,15" stroke="#027244" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6"/>
            <path d="M 105,18 Q 108,16 111,19 Q 113,16 117,18" stroke="#027244" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6"/>
            <path d="M 72,22 Q 75,20 78,23 Q 80,20 84,22" stroke="#027244" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6"/>
            <path d="M-10 100 C 50 65, 100 75, 150 100 Z" fill="#D1E7DD" opacity="0.8" />
            <path d="M100 100 C 180 55, 240 65, 310 100 Z" fill="#A3CFBB" opacity="0.6" />
            <path d="M-20 100 C 60 45, 180 45, 320 100 Z" fill="#E8F5E9" opacity="0.5" />
            <rect x="22" y="72" width="22" height="15" fill="#f0ad4e" rx="1" />
            <path d="M 29,87 C 29,81 37,81 37,87 Z" fill="#78350f" />
            <rect x="24" y="62" width="18" height="10" fill="#e08e39" rx="1" />
            <line x1="24" y1="67" x2="42" y2="67" stroke="#b45309" strokeWidth="0.5" />
            <rect x="26" y="53" width="14" height="9" fill="#cc7a29" rx="1" />
            <line x1="26" y1="57" x2="40" y2="57" stroke="#92400e" strokeWidth="0.5" />
            <rect x="28" y="45" width="10" height="8" fill="#b3661f" rx="1" />
            <line x1="28" y1="49" x2="38" y2="49" stroke="#78350f" strokeWidth="0.5" />
            <path d="M 30,45 C 30,41 36,41 36,45 Z" fill="#994d11" />
            <line x1="31" y1="41" x2="31" y2="38" stroke="#994d11" strokeWidth="1" />
            <line x1="33" y1="40" x2="33" y2="37" stroke="#994d11" strokeWidth="1" />
            <line x1="35" y1="41" x2="35" y2="38" stroke="#994d11" strokeWidth="1" />
            <path d="M 54,87 Q 52,69 50,55" stroke="#78350f" strokeWidth="2" fill="none"/>
            <path d="M 50,55 Q 40,53 35,59" stroke="#15803d" strokeWidth="1.5" fill="none"/>
            <path d="M 50,55 Q 43,46 48,40" stroke="#15803d" strokeWidth="1.5" fill="none"/>
            <path d="M 50,55 Q 57,46 63,50" stroke="#15803d" strokeWidth="1.5" fill="none"/>
            <path d="M 50,55 Q 61,57 62,65" stroke="#15803d" strokeWidth="1.5" fill="none"/>
            <path d="M 50,55 Q 51,63 47,69" stroke="#15803d" strokeWidth="1.5" fill="none"/>
            <path d="M 180,87 Q 182,72 185,58" stroke="#78350f" strokeWidth="2" fill="none"/>
            <path d="M 185,58 Q 175,56 170,62" stroke="#15803d" strokeWidth="1.5" fill="none"/>
            <path d="M 185,58 Q 178,49 183,43" stroke="#15803d" strokeWidth="1.5" fill="none"/>
            <path d="M 185,58 Q 192,49 198,53" stroke="#15803d" strokeWidth="1.5" fill="none"/>
            <path d="M 185,58 Q 196,60 197,68" stroke="#15803d" strokeWidth="1.5" fill="none"/>
            <rect x="68" y="74" width="16" height="15" fill="#F8BCBC" />
            <polygon points="65,74 76,62 87,74" fill="#E05B5B" />
            <rect x="74" y="81" width="4" height="8" fill="#5D4037" />
            <rect x="95" y="65" width="22" height="23" fill="#FFF" />
            <polygon points="91,65 106,51 121,65" fill="#4f46e5" />
            <rect x="103" y="75" width="6" height="13" fill="#027244" />
            <rect x="130" y="77" width="13" height="11" fill="#FFE0B2" />
            <polygon points="127,77 136.5,68 146,77" fill="#FB8C00" />
            <rect x="155" y="68" width="20" height="20" fill="#C5CAE9" />
            <polygon points="151,68 165,55 179,68" fill="#3F51B5" />
            <rect x="162" y="76" width="6" height="12" fill="#1e293b" />
            <rect x="200" y="73" width="18" height="15" fill="#D1C4E9" />
            <polygon points="197,73 209,62 221,73" fill="#673AB7" />
            <rect x="230" y="78" width="14" height="11" fill="#d1e7dd" />
            <polygon points="227,78 237,70 247,78" fill="#0f5132" />
          </svg>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setError('Access Denied: The business dashboard is restricted to registered business owners only.');
    }
  }, [searchParams]);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      setError('Please fill in all fields.');
      return;
    }


    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrPhone, password }),
      });
      const data = await res.json();
      if (data.success) {
        const token = data.token || (data.data && data.data.token);
        const user = data.user || (data.data && data.data.user);
        const draftBusiness = data.draftBusiness || (data.data && data.data.draftBusiness);

        if (!token || !user) {
          setError('Response validation error: token or user information missing.');
          return;
        }

        localStorage.setItem('ubt_token', token);
        localStorage.setItem('ubt_user', JSON.stringify(user));
        const redirect = searchParams.get('redirect');
        if (redirect && redirect !== '/' && redirect !== '/login' && redirect !== '/register') {
          navigate(redirect);
        } else if (draftBusiness) {
          localStorage.setItem('ubt_draft_business', JSON.stringify(draftBusiness));
          navigate('/add-business');
        } else {
          if (user.role === 'superadmin') {
            navigate('/superadmin');
          } else if (user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }
      } else {
        setError(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      setError('Server connection failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phone) {
      setError('Please enter mobile number.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: phone }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setInfoMessage(data.message);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPLogin = async (e) => {
    e.preventDefault();
    if (!phone || !otp) {
      setError('Please fill in mobile number and OTP.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: phone, otp }),
      });
      const data = await res.json();
      if (data.success) {
        const token = data.token || (data.data && data.data.token);
        const user = data.user || (data.data && data.data.user);

        if (!token || !user) {
          setError('Response validation error: token or user information missing.');
          return;
        }

        localStorage.setItem('ubt_token', token);
        localStorage.setItem('ubt_user', JSON.stringify(user));
        const redirect = searchParams.get('redirect');
        if (redirect && redirect !== '/' && redirect !== '/login' && redirect !== '/register') {
          navigate(redirect);
        } else if (user.role === 'superadmin') {
          navigate('/superadmin');
        } else if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialMock = (provider) => {
    setError('');
    setInfoMessage(`Mocking ${provider} single sign-on...`);
    setTimeout(() => {
      const dummyUser = {
        id: 'user_social_' + Math.random().toString(36).substr(2, 9),
        fullName: 'Udumalpet Partner Account',
        email: 'partner@udumalpet.in',
        mobileNumber: '+91 94435 12345',
        role: 'owner',
      };
      localStorage.setItem('ubt_token', 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9));
      localStorage.setItem('ubt_user', JSON.stringify(dummyUser));
      const redirect = searchParams.get('redirect');
      if (redirect && redirect !== '/' && redirect !== '/login' && redirect !== '/register') {
        navigate(redirect);
      } else {
        navigate('/dashboard');
      }
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#F8FAFC] pt-6 pb-12 px-4 md:px-8 font-sans">
      
      {/* Back to Home Link */}
      <div className="max-w-5xl w-full flex justify-start mb-6">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xs font-extrabold text-[#001c41] hover:text-[#027244] transition-all bg-white py-2.5 px-4 rounded-xl border border-slate-200 shadow-sm hover:shadow group"
        >
          <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:text-[#027244] transition-colors" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Combined Left Panel and Right Form Card */}
      <div className="max-w-5xl w-full bg-white border border-slate-200 shadow-xl rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row min-h-[660px]">
        
        {/* Left Side Panel: Features list & context illustration */}
        {renderSidebar()}

        {/* Right Side Panel: Form Card Panel */}
        <div className="lg:w-[55%] p-8 md:p-12 flex flex-col justify-center bg-white font-sans">
          <div className="w-full flex flex-col gap-6 max-w-sm mx-auto">
            
            {/* Header text */}
            <div>
              <h3 className="text-2xl font-black text-[#001c41] tracking-tight">
                {fromParam === 'events' ? 'Login to Events' : (fromParam === 'blogs' ? 'Login to Blogs' : 'Login to Your Account')}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1.5">
                {fromParam === 'events' ? 'Enter details below to list and manage your events' : (fromParam === 'blogs' ? 'Enter details below to manage your articles' : 'Enter details below to continue')}
              </p>
            </div>

            {/* Error / Success Alerts */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-650 rounded-xl p-3 text-xs font-semibold flex items-start gap-2 animate-shake">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {infoMessage && (
              <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl p-3 text-xs font-semibold flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#027244] mt-0.5" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* Toggle tabs (Password / OTP) */}
            <div className="border-b border-slate-100 flex gap-5">
              <button
                onClick={() => { setActiveTab('password'); setError(''); }}
                className={`pb-2.5 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'password'
                    ? 'border-[#027244] text-[#027244]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Login with Password
              </button>
              <button
                onClick={() => { setActiveTab('otp'); setError(''); }}
                className={`pb-2.5 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'otp'
                    ? 'border-[#027244] text-[#027244]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Login with OTP
              </button>
            </div>

            {/* Password Login tab */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Email or Mobile Number <span className="text-red-500">*</span></label>
                  <div className="relative flex items-center">
                    <User className="h-4.5 w-4.5 text-slate-400 absolute left-3" />
                    <input
                      type="text"
                      placeholder="Enter your email or mobile number"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-4 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#027244] transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Password <span className="text-red-500">*</span></label>
                  <div className="relative flex items-center">
                    <Lock className="h-4.5 w-4.5 text-slate-400 absolute left-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-10 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#027244] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember / Forgot Row */}
                <div className="flex justify-between items-center mt-1">
                  <label className="flex items-center text-xs font-semibold text-slate-500 cursor-pointer select-none">
                    <input type="checkbox" id="remember" className="h-4 w-4 border-slate-300 rounded text-[#027244] focus:ring-[#027244]" />
                    <span className="ml-2">Remember Me</span>
                  </label>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setInfoMessage("Password reset instructions sent. (Check mock notification)"); }} 
                    className="text-xs font-extrabold text-[#027244] hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#027244] hover:bg-[#005934] text-white font-black text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {loading && <Loader className="h-4 w-4 animate-spin" />}
                  <span>Login</span>
                </button>
              </form>
            )}

            {/* OTP Login tab */}
            {activeTab === 'otp' && (
              <form onSubmit={otpSent ? handleOTPLogin : handleSendOTP} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Mobile Number <span className="text-red-500">*</span></label>
                  <div className="relative flex items-center">
                    <Phone className="h-4.5 w-4.5 text-slate-400 absolute left-3" />
                    <input
                      type="text"
                      placeholder="Enter mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={otpSent}
                      className="w-full py-2.5 pl-10 pr-4 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#027244] transition-all disabled:bg-slate-100 disabled:text-slate-400"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div className="flex flex-col gap-1.5 animate-slideDown">
                    <label className="text-xs font-bold text-slate-700">Enter OTP <span className="text-red-500">*</span></label>
                    <div className="relative flex items-center">
                      <Key className="h-4.5 w-4.5 text-slate-400 absolute left-3" />
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full py-2.5 pl-10 pr-4 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#027244] transition-all"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#027244] hover:bg-[#005934] text-white font-black text-xs py-3 rounded-xl transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading && <Loader className="h-4 w-4 animate-spin" />}
                  <span>{otpSent ? 'Verify & Login' : 'Send OTP'}</span>
                </button>
              </form>
            )}

            {/* Social logins */}
            <div className="flex flex-col gap-3 mt-1 border-t border-slate-100 pt-4">
              <div className="relative flex py-1 items-center justify-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-extrabold tracking-wider">or</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div className="flex flex-col gap-2.5 font-sans">
                <button
                  onClick={() => handleSocialMock('Google')}
                  className="py-2.5 border border-slate-200 hover:bg-slate-50 text-[#001c41] font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <img src="https://www.svgrepo.com/show/355037/google-icon.svg" className="h-4 w-4" alt="Google" />
                  <span>Continue with Google</span>
                </button>
                <button
                  onClick={() => handleSocialMock('Facebook')}
                  className="py-2.5 border border-slate-200 hover:bg-slate-50 text-[#001c41] font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <img src="https://www.svgrepo.com/show/157818/facebook.svg" className="h-4 w-4" alt="Facebook" />
                  <span>Continue with Facebook</span>
                </button>
              </div>
            </div>

            {/* Footer terms */}
            <div className="flex items-start gap-2 text-[10.5px] text-slate-400 font-semibold leading-relaxed mt-2 justify-center text-center">
              <Lock className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                By continuing, you agree to our{' '}
                <Link to="/businesses?focus=terms" className="text-[#027244] hover:underline font-extrabold">Terms of Service</Link>{' '}
                and{' '}
                <Link to="/businesses?focus=privacy" className="text-[#027244] hover:underline font-extrabold">Privacy Policy</Link>.
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Row of trust badges under the layout card */}
      <div className="max-w-5xl w-full flex flex-wrap justify-between items-center mt-12 py-5 border-t border-slate-200/60 gap-4 text-xs font-semibold text-slate-500">
        {[
          { 
            title: 'Verified Businesses', 
            desc: 'All businesses are manually verified',
            icon: <ShieldCheck className="h-3.5 w-3.5" /> 
          },
          { 
            title: 'Safe & Trusted', 
            desc: 'We ensure safe and trusted connections',
            icon: <Users className="h-3.5 w-3.5" /> 
          },
          { 
            title: 'Local Support', 
            desc: 'Dedicated support for local businesses',
            icon: <MapPin className="h-3.5 w-3.5" /> 
          },
          { 
            title: 'Thousands of Users', 
            desc: 'Join thousands of happy business owners',
            icon: <ThumbsUp className="h-3.5 w-3.5" /> 
          }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-full bg-emerald-50/60 flex items-center justify-center text-[#027244] shrink-0 border border-emerald-100/80 shadow-sm">
              {item.icon}
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="font-extrabold text-[#001c41] text-[11px] leading-tight">{item.title}</span>
              <span className="text-[9.5px] text-slate-400 font-bold leading-none mt-0.5">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
