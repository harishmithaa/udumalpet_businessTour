import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Gift, Award, Share2, Send, Store, Coins, CheckCircle, 
  X, Heart, Sparkles, ShieldCheck, Trophy
} from 'lucide-react';

export default function ReferralModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [topReferrers, setTopReferrers] = useState([
    { name: 'Lakshmi Textiles', referralsCount: 32 },
    { name: 'Sri Electricals', referralsCount: 27 },
    { name: 'ABC Traders', referralsCount: 21 }
  ]);

  useEffect(() => {
    // Check auth status
    const storedUser = localStorage.getItem('ubt_user');
    const storedToken = localStorage.getItem('ubt_token');
    setIsLoggedIn(!!(storedUser && storedToken));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchTopReferrers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/referrals/top');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setTopReferrers(data.data);
        }
      } catch (err) {
        console.error('Error fetching top referrers:', err);
      }
    };

    fetchTopReferrers();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleActionClick = () => {
    onClose();
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login?redirect=%2Fdashboard&from=business');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      {/* Modal Dialog */}
      <div className="max-w-6xl w-full bg-white border border-slate-200 shadow-2xl rounded-[32px] p-6 md:p-10 flex flex-col gap-8 animate-scaleUp text-left max-h-[90vh] overflow-y-auto scrollbar-none relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-655 h-8 w-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 1. HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          {/* Left side text column (7 cols on large screens) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <span className="text-[10px] font-black uppercase text-[#027244] tracking-wider">UBT Partner Network</span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#001c41] leading-tight">
              Refer. Earn. <span className="text-[#027244]">Save.</span>
            </h1>
            <p className="text-slate-500 text-xs md:text-sm font-semibold leading-relaxed max-w-xl">
              Refer new businesses to UBT and earn referral points. Redeem your points and get discounts on your subscription renewal.
            </p>

            {/* Quick Steps Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-2">
              {/* Step 1 */}
              <div className="flex flex-col gap-1.5">
                <div className="h-9 w-9 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100/60 text-[#027244] shrink-0">
                  <Users className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-extrabold text-[11px] text-slate-800 uppercase tracking-wider">Refer a Business</h4>
                <p className="text-slate-400 text-[10px] font-semibold leading-relaxed">
                  Share your referral link with friends or business connections.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col gap-1.5">
                <div className="h-9 w-9 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100/60 text-[#027244] shrink-0">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-extrabold text-[11px] text-slate-800 uppercase tracking-wider">They Join & Subscribe</h4>
                <p className="text-slate-400 text-[10px] font-semibold leading-relaxed">
                  When they join and complete payment, you earn points.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col gap-1.5">
                <div className="h-9 w-9 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100/60 text-[#027244] shrink-0">
                  <Gift className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-extrabold text-[11px] text-slate-800 uppercase tracking-wider">Earn Points & Save</h4>
                <p className="text-slate-400 text-[10px] font-semibold leading-relaxed">
                  Redeem your points and get discount on your next renewal.
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mt-2">
              <button 
                onClick={handleActionClick}
                className="py-3 px-6 bg-[#027244] hover:bg-[#005934] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-98"
              >
                {isLoggedIn ? 'Go to My Referral Dashboard' : 'Login to Start Referring'}
              </button>
            </div>
          </div>

          {/* Right side Illustration column (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] rounded-3xl bg-white p-2.5 border border-slate-200/60 shadow-md">
              <img 
                src="/referral_hero.jpg" 
                alt="UBT Referral Program illustration" 
                className="w-full h-auto object-contain rounded-2xl select-none"
              />
            </div>
          </div>
        </section>

        {/* 2. HOW IT WORKS SECTION */}
        <section className="bg-slate-50/50 border border-slate-200/60 rounded-3xl py-8 px-6 text-center flex flex-col gap-6 scroll-mt-10">
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-xl font-extrabold text-[#001c41]">How It Works</h2>
            <div className="h-1 w-10 bg-[#027244] rounded-full mt-0.5" />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            
            {/* Step 01 */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="relative">
                <div className="h-12 w-12 bg-white border border-slate-200 shadow-2xs hover:border-[#027244] transition-colors rounded-full flex items-center justify-center text-[#027244]">
                  <Share2 className="h-5 w-5" />
                </div>
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#027244] text-white font-extrabold text-[10px] rounded-full flex items-center justify-center select-none shadow-sm">
                  01
                </span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-800">Get Your Referral Link</h4>
              <p className="text-slate-450 text-[10.5px] font-semibold leading-relaxed max-w-[180px]">
                Login to your dashboard and get your unique referral link or code.
              </p>
            </div>

            {/* Step 02 */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="relative">
                <div className="h-12 w-12 bg-white border border-slate-200 shadow-2xs hover:border-[#027244] transition-colors rounded-full flex items-center justify-center text-[#027244]">
                  <Send className="h-5 w-5" />
                </div>
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#027244] text-white font-extrabold text-[10px] rounded-full flex items-center justify-center select-none shadow-sm">
                  02
                </span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-800">Share With Others</h4>
              <p className="text-slate-450 text-[10.5px] font-semibold leading-relaxed max-w-[180px]">
                Share your link with your friends, family or any business owner around you.
              </p>
            </div>

            {/* Step 03 */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="relative">
                <div className="h-12 w-12 bg-white border border-slate-200 shadow-2xs hover:border-[#027244] transition-colors rounded-full flex items-center justify-center text-[#027244]">
                  <Store className="h-5 w-5" />
                </div>
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#027244] text-white font-extrabold text-[10px] rounded-full flex items-center justify-center select-none shadow-sm">
                  03
                </span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-800">They Join UBT</h4>
              <p className="text-slate-450 text-[10.5px] font-semibold leading-relaxed max-w-[180px]">
                When they register and subscribe to any paid plan, the referral is successful.
              </p>
            </div>

            {/* Step 04 */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="relative">
                <div className="h-12 w-12 bg-white border border-slate-200 shadow-2xs hover:border-[#027244] transition-colors rounded-full flex items-center justify-center text-[#027244]">
                  <Coins className="h-5 w-5" />
                </div>
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#027244] text-white font-extrabold text-[10px] rounded-full flex items-center justify-center select-none shadow-sm">
                  04
                </span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-800">You Earn Points</h4>
              <p className="text-slate-450 text-[10.5px] font-semibold leading-relaxed max-w-[180px]">
                You earn referral points which you can redeem and get discount on your renewal.
              </p>
            </div>

          </div>
        </section>

        {/* 3. CONVERSIONS AND CALCULATOR */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left column - Earn More, Save More */}
          <div className="bg-white border border-slate-200 shadow-2xs rounded-3xl p-5 md:p-6 flex flex-col gap-5 text-left">
            <div className="flex flex-col gap-0.5 border-b border-slate-100 pb-2.5">
              <h3 className="text-base font-extrabold text-slate-800">Earn More, Save More</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Accumulate referral points and convert them to credit discount benefits.</p>
            </div>

            <div className="overflow-hidden border border-slate-200/85 rounded-xl">
              <table className="w-full text-xs font-bold text-slate-700 text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[9px] tracking-wider">
                    <th className="px-4 py-2">Referrals</th>
                    <th className="px-4 py-2">Points Earned</th>
                    <th className="px-4 py-2">Credit Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { ref: '1 Business', pts: '100 Points', val: '₹10' },
                    { ref: '5 Businesses', pts: '500 Points', val: '₹50' },
                    { ref: '10 Businesses', pts: '1000 Points', val: '₹100' },
                    { ref: '20 Businesses', pts: '2000 Points', val: '₹200' },
                    { ref: '50 Businesses', pts: '5000 Points', val: '₹500' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2 text-slate-800 font-extrabold">{row.ref}</td>
                      <td className="px-4 py-2 text-slate-500">{row.pts}</td>
                      <td className="px-4 py-2 text-[#027244] font-black">{row.val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* conversion banner info */}
            <div className="bg-emerald-50/45 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
              <div className="h-8 w-8 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 text-[#027244] shrink-0 mt-0.5">
                <Award className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col gap-0.5 text-slate-700 leading-normal text-xs">
                <span className="font-extrabold text-slate-800">Use your points as discount on your subscription renewal.</span>
                <span className="text-[#027244] font-black mt-0.5">100 Points = ₹10 Credit</span>
              </div>
            </div>
          </div>

          {/* Right column - Example calculator */}
          <div className="bg-white border border-slate-200 shadow-2xs rounded-3xl p-5 md:p-6 flex flex-col gap-5 text-left">
            <div className="flex flex-col gap-0.5 border-b border-slate-100 pb-2.5">
              <h3 className="text-base font-extrabold text-slate-800">Example: How You Save</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Simulated billing breakdown showing referral point credit value offsets.</p>
            </div>

            <div className="flex flex-col gap-3 font-semibold text-xs border border-slate-200/80 rounded-xl p-4 bg-slate-50/30">
              <div className="flex justify-between border-b border-slate-100 pb-2 text-slate-500">
                <span>Annual Plan Price</span>
                <span className="font-extrabold text-slate-850">₹690</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2 text-slate-500">
                <span>Available Credit (from 15 Referrals)</span>
                <span className="font-extrabold text-rose-600">-₹150</span>
              </div>
              <div className="flex justify-between pt-1.5 text-xs">
                <span className="font-extrabold text-slate-800">You Pay</span>
                <span className="font-black text-[#027244] text-sm">₹540</span>
              </div>
            </div>

            {/* piggy banner info */}
            <div className="bg-emerald-50/45 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
              <div className="h-8 w-8 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 text-[#027244] shrink-0 mt-0.5">
                <Coins className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col gap-0.5 text-slate-700 leading-normal text-xs">
                <span className="font-extrabold text-slate-800">The more you refer, the more you save!</span>
                <span className="text-emerald-700 font-bold mt-0.5">It's our way of saying Thank You!</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. WHY REFER BUSINESSES */}
        <section className="bg-white border-y border-slate-150 py-8 text-center flex flex-col gap-8">
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-xl font-extrabold text-slate-805">Why Refer Businesses to UBT?</h2>
            <div className="h-1 w-10 bg-[#027244] rounded-full mt-0.5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-center">
            
            {/* Card 1 */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="h-11 w-11 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center text-[#027244] shadow-2xs">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-[11px] text-slate-850 uppercase tracking-wide leading-tight">Help Local Businesses Grow Online</h4>
              <p className="text-slate-400 text-[10px] font-semibold leading-relaxed max-w-[150px] mx-auto">
                Support other businesses in getting discovered by thousands of customers.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="h-11 w-11 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center text-[#027244] shadow-2xs">
                <Coins className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-[11px] text-slate-850 uppercase tracking-wide leading-tight">Earn Rewards Automatically</h4>
              <p className="text-slate-400 text-[10px] font-semibold leading-relaxed max-w-[150px] mx-auto">
                Earn points for every successful referral automatically.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="h-11 w-11 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center text-[#027244] shadow-2xs">
                <Gift className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-[11px] text-slate-850 uppercase tracking-wide leading-tight">Save on Your Subscription</h4>
              <p className="text-slate-400 text-[10px] font-semibold leading-relaxed max-w-[150px] mx-auto">
                Redeem points and reduce your renewal amount. More points, more savings!
              </p>
            </div>

            {/* Card 4 */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="h-11 w-11 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center text-[#027244] shadow-2xs">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-[11px] text-slate-850 uppercase tracking-wide leading-tight">Be a Community Champion</h4>
              <p className="text-slate-400 text-[10px] font-semibold leading-relaxed max-w-[150px] mx-auto">
                Top referrers will be featured on our platform as UBT Champions.
              </p>
            </div>

            {/* Card 5 */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="h-11 w-11 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center text-[#027244] shadow-2xs">
                <Trophy className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-[11px] text-slate-850 uppercase tracking-wide leading-tight">Build a Stronger Network</h4>
              <p className="text-slate-400 text-[10px] font-semibold leading-relaxed max-w-[150px] mx-auto">
                The more good businesses join, the stronger our local business community.
              </p>
            </div>

          </div>
        </section>

        {/* 5. TOP REFERRERS, TOP RECOGNITION */}
        <section className="bg-[#001c41] text-white rounded-[24px] p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 text-left">
          {/* Left panel info */}
          <div className="flex-1 flex flex-col gap-2 text-left">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-400 shrink-0" />
              <h3 className="text-base md:text-lg font-black font-sans leading-tight">Top Referrers, Top Recognition!</h3>
            </div>
            <p className="text-slate-300 text-[11px] font-semibold leading-relaxed max-w-sm">
              Top referrers will be recognized as UBT Community Champions on our platform and events.
            </p>
          </div>

          {/* Right leaderboard panel */}
          <div className="w-full md:max-w-xs bg-white border border-slate-200/80 rounded-xl p-4 text-[#001c41]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3 select-none">
              <span className="font-black text-[9px] uppercase tracking-wider text-slate-500">Top Referrers This Month</span>
            </div>
            <div className="flex flex-col gap-2.5 font-sans text-[11px] font-semibold text-slate-700">
              {topReferrers.map((referrer, idx) => {
                const badgeStyles = [
                  'bg-amber-100 text-amber-800',     // Rank 1 (Gold)
                  'bg-slate-100 text-slate-800',     // Rank 2 (Silver)
                  'bg-orange-100 text-orange-850'    // Rank 3 (Bronze)
                ];
                const badgeStyle = badgeStyles[idx] || 'bg-slate-50 text-slate-600';
                const isLast = idx === topReferrers.length - 1;
                
                return (
                  <div 
                    key={idx} 
                    className={`flex justify-between items-center ${!isLast ? 'border-b border-slate-50 pb-1.5' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-4.5 w-4.5 rounded font-black flex items-center justify-center text-[9px] ${badgeStyle}`}>
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-805">{referrer.name}</span>
                    </div>
                    <span className="text-[#027244] font-black">{referrer.referralsCount} Referrals</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. BOTTOM BANNER */}
        <section className="border-t border-slate-150 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] font-bold text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-655">
            <CheckCircle className="h-4 w-4 text-[#027244] shrink-0" />
            <span>Trusted by 500+ Businesses in Udumalpet</span>
          </div>
          <div className="text-slate-450 leading-relaxed text-center sm:text-right">
            Have questions? Contact us at <a href="mailto:udumalpetbusinesstour@gmail.com" className="text-slate-600 hover:text-[#027244] font-extrabold hover:underline transition-colors">udumalpetbusinesstour@gmail.com</a> | <strong className="text-slate-655 font-sans">97500 12345</strong>
          </div>
        </section>

      </div>
    </div>
  );
}
