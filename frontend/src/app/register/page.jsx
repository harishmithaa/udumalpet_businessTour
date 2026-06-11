import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, Mail, Lock, Phone, User, AlertCircle, Loader, 
  Eye, EyeOff, Store, Users, Star, TrendingUp, Headset, MapPin, ThumbsUp,
  Calendar, Sparkles, Grid, BookOpen, FileEdit, MessageSquare, Activity, ArrowLeft
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get('from') || 'business';
  const flowParam = searchParams.get('flow') || 'general';
  
  // Registration form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !mobileNumber || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const refCode = searchParams.get('ref') || '';
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: fullName, 
          fullName, 
          phone: mobileNumber, 
          mobileNumber, 
          email, 
          password,
          referralCode: refCode || undefined
        }),
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
        if (draftBusiness) {
          localStorage.setItem('ubt_draft_business', JSON.stringify(draftBusiness));
        } else {
          localStorage.removeItem('ubt_draft_business');
        }
        setInfoMessage('Account created successfully! Redirecting...');
        
        const redirect = searchParams.get('redirect');
        setTimeout(() => {
          if (redirect && redirect !== '/' && redirect !== '/login' && redirect !== '/register') {
            navigate(redirect);
          } else {
            navigate('/add-business');
          }
        }, 1200);
      } else {
        setError(data.message || 'Registration failed. Try again.');
      }
    } catch (err) {
      setError('Connection failed. Server might be offline.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialMock = (provider) => {
    setError('');
    setInfoMessage(`Mocking ${provider} registration single sign-on...`);
    setTimeout(() => {
      const dummyUser = {
        id: 'user_social_' + Math.random().toString(36).substr(2, 9),
        fullName: 'New UBT Registered Member',
        email: `newmember_${Date.now()}@udumalpet.in`,
        mobileNumber: '+91 94435 12345',
        role: 'owner',
      };
      localStorage.setItem('ubt_token', 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9));
      localStorage.setItem('ubt_user', JSON.stringify(dummyUser));
      const redirect = searchParams.get('redirect');
      if (redirect && redirect !== '/' && redirect !== '/login' && redirect !== '/register') {
        navigate(redirect);
      } else {
        navigate('/add-business');
      }
    }, 1200);
  };

  const renderSidebar = () => {
    if (fromParam === 'events') {
      return (
        <div className="lg:w-[45%] bg-[#F0FDF4]/80 text-[#001c41] p-10 flex flex-col justify-between relative border-r border-slate-100">
          <div className="flex flex-col gap-5 text-left">
            <h2 className="text-3xl font-black tracking-tight text-[#001c41]">Create Your Account</h2>
            <p className="text-slate-550 text-sm font-semibold max-w-xs leading-relaxed">
              Join our platform and start listing your events in Udumalpet.
            </p>

            <ul className="flex flex-col gap-5 mt-6">
              {[
                { 
                  title: 'Wide Reach', 
                  desc: 'Get more visibility for your events in and around Udumalpet.',
                  icon: <Calendar className="h-4.5 w-4.5 text-[#027244]" />,
                  bg: 'bg-emerald-50 border-emerald-100/50' 
                },
                { 
                  title: 'Affordable Pricing', 
                  desc: 'List your event for just ₹99 per listing.',
                  icon: <Sparkles className="h-4.5 w-4.5 text-[#001c41]" />,
                  bg: 'bg-blue-50 border-blue-100/50'
                },
                { 
                  title: 'Event History', 
                  desc: 'Track and manage all your events in one single place.',
                  icon: <ShieldCheck className="h-4.5 w-4.5 text-amber-500 fill-current" />,
                  bg: 'bg-amber-50 border-amber-100/50'
                },
                { 
                  title: 'Special Offers', 
                  desc: 'Get exclusive offers and badges for regular event planners.',
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

          {/* Calendar Pin Illustration */}
          <div className="w-full mt-10 pt-2 shrink-0 select-none overflow-hidden rounded-2xl shadow-sm border border-slate-200/50 bg-[#F3E8FF] p-2">
            <svg className="w-full h-32" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="300" height="120" fill="#F3E8FF" rx="16"/>
              <circle cx="280" cy="20" r="40" fill="#C084FC" opacity="0.15"/>
              <circle cx="20" cy="100" r="30" fill="#818CF8" opacity="0.15"/>
              
              <g transform="translate(110, 20)">
                <rect x="4" y="8" width="76" height="76" rx="12" fill="#4F46E5" opacity="0.15"/>
                <rect width="76" height="76" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2"/>
                <path d="M0 12C0 5.37258 5.37258 0 12 0H64C70.6274 0 76 5.37258 76 12V18H0V12Z" fill="#EF4444"/>
                
                <rect x="16" y="-6" width="6" height="12" rx="3" fill="#94A3B8"/>
                <rect x="54" y="-6" width="6" height="12" rx="3" fill="#94A3B8"/>
                
                <circle cx="16" cy="30" r="4" fill="#E2E8F0"/>
                <circle cx="30" cy="30" r="4" fill="#E2E8F0"/>
                <circle cx="44" cy="30" r="4" fill="#E2E8F0"/>
                <circle cx="58" cy="30" r="4" fill="#E2E8F0"/>
                
                <circle cx="16" cy="44" r="4" fill="#E2E8F0"/>
                <circle cx="30" cy="44" r="4" fill="#E2E8F0"/>
                <circle cx="44" cy="44" r="4" fill="#E2E8F0"/>
                <circle cx="58" cy="44" r="4" fill="#E2E8F0"/>
                
                <circle cx="16" cy="58" r="4" fill="#E2E8F0"/>
                <rect x="25" y="53" width="10" height="10" rx="3" fill="#10B981"/>
                <path d="M28 58L30 60L33 56" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                
                <circle cx="44" cy="58" r="4" fill="#E2E8F0"/>
                <circle cx="58" cy="58" r="4" fill="#E2E8F0"/>
              </g>
              
              <g transform="translate(160, 50)">
                <ellipse cx="16" cy="42" rx="8" ry="3" fill="#000000" opacity="0.2"/>
                <path d="M16 4C9.37 4 4 9.37 4 16C4 25.3333 16 40 16 40C16 40 28 25.3333 28 16C28 9.37 22.63 4 16 4Z" fill="#A855F7"/>
                <circle cx="16" cy="16" r="5" fill="#FFFFFF"/>
              </g>
              
              <g transform="translate(40, 30)" opacity="0.8">
                <path d="M0 8C4 8 8 4 8 0C8 4 12 8 16 8C12 8 8 12 8 16C8 12 4 8 0 8Z" fill="#F59E0B"/>
              </g>
              <g transform="translate(240, 80)" opacity="0.6">
                <path d="M0 6C3 6 6 3 6 0C6 3 9 6 12 6C9 6 6 9 6 12C6 9 3 6 0 6Z" fill="#3B82F6"/>
              </g>
            </svg>
          </div>

          <div className="z-10 mt-10 p-5 rounded-2xl bg-white/70 border border-emerald-100 flex items-start gap-4 shadow-sm text-left">
            <div className="bg-[#E6F2ED] p-2.5 rounded-xl text-[#027244] border border-emerald-100/50 shrink-0">
              <Headset className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-0.5 text-left">
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
          <div className="flex flex-col gap-5 text-left">
            <h2 className="text-3xl font-black tracking-tight text-[#001c41]">Create Your Account</h2>
            <p className="text-slate-550 text-sm font-semibold max-w-xs leading-relaxed">
              Join our writing community and start publishing your articles today.
            </p>

            <ul className="flex flex-col gap-5 mt-6 font-sans">
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
                <li key={i} className="flex gap-4 items-start font-sans">
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

          {/* Blogs Writing Desk Illustration */}
          <div className="w-full mt-10 pt-2 shrink-0 select-none overflow-hidden rounded-2xl shadow-sm border border-slate-200/50 bg-[#0F172A]">
            <svg className="w-full h-32" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="300" height="120" fill="#0F172A"/>
              <rect y="105" width="300" height="15" fill="#1E293B"/>
              <path d="M120,25 L50,105 L190,105 Z" fill="#FCD34D" opacity="0.1"/>
              
              <rect x="30" y="85" width="45" height="8" fill="#3B82F6" rx="2"/>
              <rect x="28" y="93" width="49" height="6" fill="#10B981" rx="1"/>
              <rect x="25" y="99" width="55" height="6" fill="#F59E0B" rx="1.5"/>
              
              <g transform="translate(210, 30)">
                <rect x="15" y="70" width="30" height="5" fill="#64748B" rx="2"/>
                <path d="M30,70 L30,35 L10,35" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="30" cy="35" r="4" fill="#475569"/>
                <path d="M2,25 C2,18 18,18 18,25 L20,40 L0,40 Z" fill="#EC4899" transform="rotate(-30 10 30)"/>
                <polygon points="5,45 15,45 -20,80 40,80" fill="#FDE047" opacity="0.15"/>
              </g>
              
              <g transform="translate(100, 40)">
                <rect width="50" height="65" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5"/>
                <rect x="15" y="-5" width="20" height="8" rx="2" fill="#475569"/>
                
                <rect x="8" y="10" width="34" height="3" rx="1" fill="#94A3B8"/>
                <rect x="8" y="18" width="34" height="2" rx="0.5" fill="#E2E8F0"/>
                <rect x="8" y="24" width="28" height="2" rx="0.5" fill="#E2E8F0"/>
                <rect x="8" y="30" width="34" height="2" rx="0.5" fill="#E2E8F0"/>
                <rect x="8" y="36" width="20" height="2" rx="0.5" fill="#E2E8F0"/>
                
                <path d="M40 50 C38 48 35 48 35 50 C35 52 38 54 40 56 C42 54 45 52 45 50 C45 48 42 48 40 50 Z" fill="#EF4444"/>
                
                <g transform="translate(48, 10) rotate(-45)">
                  <rect width="6" height="25" rx="1.5" fill="#10B981"/>
                  <path d="M0 0 L3 -5 L6 0 Z" fill="#F59E0B"/>
                </g>
              </g>
            </svg>
          </div>

          <div className="z-10 mt-10 p-5 rounded-2xl bg-white/70 border border-emerald-100 flex items-start gap-4 shadow-sm text-left">
            <div className="bg-[#E6F2ED] p-2.5 rounded-xl text-[#027244] border border-emerald-100/50 shrink-0">
              <Headset className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-0.5 text-left">
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
        <div className="flex flex-col gap-5 text-left">
          <h2 className="text-3xl font-black tracking-tight text-[#001c41]">Create Your Account</h2>
          <p className="text-slate-550 text-sm font-semibold max-w-xs leading-relaxed">
            Join Udumalpet Business Tour and grow your business.
          </p>

          <ul className="flex flex-col gap-5 mt-6 font-sans">
            {[
              { 
                title: 'Get Discovered', 
                desc: 'List your business and get found by thousands of customers.',
                icon: <Store className="h-4.5 w-4.5 text-[#027244]" />,
                bg: 'bg-emerald-50 border-emerald-100/50' 
              },
              { 
                title: 'Get Quality Leads', 
                desc: 'Receive genuine enquiries and grow your customer base.',
                icon: <Users className="h-4.5 w-4.5 text-[#001c41]" />,
                bg: 'bg-blue-50 border-blue-100/50'
              },
              { 
                title: 'Build Trust', 
                desc: 'Collect reviews and build trust in your local community.',
                icon: <Star className="h-4.5 w-4.5 text-amber-500 fill-current" />,
                bg: 'bg-amber-50 border-amber-100/50'
              },
              { 
                title: 'Grow Your Business', 
                desc: 'Use powerful tools to manage and expand your business.',
                icon: <TrendingUp className="h-4.5 w-4.5 text-purple-600" />,
                bg: 'bg-purple-50 border-purple-100/50'
              }
            ].map((f, i) => (
              <li key={i} className="flex gap-4 items-start font-sans">
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

        <div className="z-10 mt-10 p-5 rounded-2xl bg-white/70 border border-emerald-100 flex items-start gap-4 shadow-sm text-left">
          <div className="bg-[#E6F2ED] p-2.5 rounded-xl text-[#027244] border border-emerald-100/50 shrink-0">
            <Headset className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Need Help?</span>
            <span className="text-xs text-[#001c41] font-extrabold mt-1 leading-normal">Our support team is here to help you.</span>
            <a href="tel:+911234567890" className="text-xs text-[#027244] font-black mt-1 hover:underline leading-none">Call: +91 12345 67890</a>
          </div>
        </div>
      </div>
    );
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
                {fromParam === 'events' ? 'Register for Events' : (fromParam === 'blogs' ? 'Register for Blogs' : 'Create Your Account')}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1.5">
                {fromParam === 'events' ? 'Fill in the details below to list and manage your events' : (fromParam === 'blogs' ? 'Fill in the details below to write and publish blogs' : 'Fill in the details below to get started')}
              </p>
            </div>

            {/* Message banners */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-650 rounded-xl p-3 text-xs font-semibold flex items-start gap-2 animate-shake">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {searchParams.get('ref') && !infoMessage && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-3 text-xs font-semibold flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                <span>You were referred! Complete registration and subscribe to earn credit discounts.</span>
              </div>
            )}
            {infoMessage && (
              <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl p-3 text-xs font-semibold flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#027244] mt-0.5" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3.5">
              
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Full Name <span className="text-red-500">*</span></label>
                <div className="relative flex items-center">
                  <User className="h-4.5 w-4.5 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full py-2.5 pl-10 pr-4 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#027244] transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Email Address <span className="text-red-500">*</span></label>
                <div className="relative flex items-center">
                  <Mail className="h-4.5 w-4.5 text-slate-400 absolute left-3" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2.5 pl-10 pr-4 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#027244] transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Mobile Number <span className="text-red-500">*</span></label>
                <div className="flex gap-2.5">
                  {/* Styled Country Code Dropdown */}
                  <div className="relative flex items-center shrink-0">
                    <select 
                      disabled
                      className="appearance-none bg-slate-50/50 border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-xs font-extrabold text-[#001c41] cursor-default select-none focus:outline-none"
                    >
                      <option>+91</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 text-slate-400 flex items-center">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                  
                  {/* Phone input field with icon */}
                  <div className="relative flex-grow flex items-center">
                    <Phone className="h-4.5 w-4.5 text-slate-400 absolute left-3" />
                    <input
                      type="text"
                      placeholder="Enter mobile number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-4 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#027244] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Password <span className="text-red-500">*</span></label>
                <div className="relative flex items-center">
                  <Lock className="h-4.5 w-4.5 text-slate-400 absolute left-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
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

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative flex items-center">
                  <Lock className="h-4.5 w-4.5 text-slate-400 absolute left-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-2.5 pl-10 pr-10 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#027244] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Agree terms */}
              <div className="flex items-start mt-1">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 mt-0.5 border-slate-300 rounded text-[#027244] focus:ring-[#027244] cursor-pointer"
                />
                <label htmlFor="agree" className="text-[11px] font-bold text-slate-505 ml-2 cursor-pointer leading-normal select-none">
                  I agree to the <Link to="/businesses?focus=terms" className="text-[#027244] hover:underline font-extrabold">Terms of Service</Link> and <Link to="/businesses?focus=privacy" className="text-[#027244] hover:underline font-extrabold">Privacy Policy</Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#027244] hover:bg-[#005934] text-white font-black text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 mt-2"
              >
                {loading && <Loader className="h-4 w-4 animate-spin" />}
                <span>Sign Up</span>
              </button>
            </form>

            {/* Social logins */}
            <div className="flex flex-col gap-3 mt-1 border-t border-slate-100 pt-4">
              <div className="relative flex py-1 items-center justify-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-extrabold tracking-wider">or sign up with</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Side-by-side social buttons matching the mockup */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSocialMock('Google')}
                  className="py-2.5 border border-slate-200 hover:bg-slate-50 text-[#001c41] font-bold text-[10.5px] rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <img src="https://www.svgrepo.com/show/355037/google-icon.svg" className="h-3.5 w-3.5" alt="Google" />
                  <span>Sign up with Google</span>
                </button>
                <button
                  onClick={() => handleSocialMock('Facebook')}
                  className="py-2.5 border border-slate-200 hover:bg-slate-50 text-[#001c41] font-bold text-[10.5px] rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <img src="https://www.svgrepo.com/show/157818/facebook.svg" className="h-3.5 w-3.5" alt="Facebook" />
                  <span>Sign up with Facebook</span>
                </button>
              </div>
            </div>

            {/* Respect privacy badge */}
            <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400 font-semibold leading-none mt-2 justify-center text-center">
              <Lock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>We respect your privacy. Your data is safe with us.</span>
            </div>

          </div>
        </div>

      </div>

      {/* Row of trust badges under the layout card */}
      <div className="max-w-5xl w-full flex flex-wrap justify-between items-center mt-12 py-5 border-t border-slate-200/60 gap-4 text-xs font-semibold text-slate-505">
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
