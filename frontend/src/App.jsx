import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './app/page';
import BusinessesingsPage from './app/businesses/page';
import BusinessDetail from './app/businesses/[id]/page';
import AddBusiness from './app/add-business/page';
import AdminDashboard from './app/admin/page';
import SuperAdminDashboard from './app/superadmin/page';
import Dashboard from './app/dashboard/page';
import Login from './app/login/page';
import Register from './app/register/page';
import ChoosePlan from './app/choose-plan/page';
import EventsPage from './app/events/page';
import EventDetail from './app/events/[id]/page';
import BlogsPage from './app/blogs/page';
import BlogDetail from './app/blogs/[id]/page';
import AboutPage from './app/about/page';
import UserProfile from './app/profile/page';
import ReferralModal from './components/ReferralModal';

function AppContent() {
  const location = useLocation();
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  
  useEffect(() => {
    const handleOpenModal = () => setIsReferralModalOpen(true);
    window.addEventListener('open-referral-modal', handleOpenModal);
    return () => window.removeEventListener('open-referral-modal', handleOpenModal);
  }, []);
  
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);

  const hideNavAndFooter = location.pathname.startsWith('/dashboard') || 
                           location.pathname.startsWith('/admin') || 
                           location.pathname.startsWith('/superadmin');

  return (
    <div className="w-full min-h-screen flex flex-col justify-between bg-[#F8FAFC]">
      {!hideNavAndFooter && <Navbar />}
      <main key={location.pathname} className="flex-grow animate-page-entrance">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/businesses" element={<BusinessesingsPage />} />
          <Route path="/businesses/:id" element={<BusinessDetail />} />
          <Route path="/add-business" element={<AddBusiness />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/choose-plan" element={<ChoosePlan />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile/:id" element={<UserProfile />} />
        </Routes>
      </main>
      {!hideNavAndFooter && <Footer />}
      <ReferralModal isOpen={isReferralModalOpen} onClose={() => setIsReferralModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
