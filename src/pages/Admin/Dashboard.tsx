import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { 
  LayoutDashboard, 
  Utensils, 
  Layers, 
  CalendarCheck, 
  LogOut, 
  Menu as MenuIcon, 
  X, 
  ChevronRight,
  Bell,
  User as UserIcon,
  Home as HomeIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Sub-pages
import MenuManagement from './MenuManagement';
import CategoryManagement from './CategoryManagement';
import Reservations from './Reservations';
import Overview from './Overview';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/admin/login');
        return;
      }

      // Check if user is admin in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      const isDefaultAdmin = user.email === 'bktiwari879@gmail.com';

      if (isDefaultAdmin || (userData && userData.role === 'admin')) {
        setIsAdmin(true);
        setLoading(false);
      } else {
        toast.error('Unauthorized access.');
        await signOut(auth);
        navigate('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully.');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Failed to logout.');
    }
  };

  const menuItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Menu Items', path: '/admin/menu', icon: <Utensils size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Layers size={20} /> },
    { name: 'Reservations', path: '/admin/reservations', icon: <CalendarCheck size={20} /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-orange-950 text-white transition-all duration-300 ${
          isSidebarOpen ? 'w-72' : 'w-20'
        } hidden md:block`}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 shadow-lg shadow-orange-900/50">B</div>
            {isSidebarOpen && <span className="font-bold text-lg tracking-tight whitespace-nowrap">Admin Panel</span>}
          </div>

          <nav className="flex-grow space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 p-3.5 rounded-xl transition-all ${
                  location.pathname === item.path 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50' 
                  : 'text-orange-200/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/10 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-4 p-3.5 rounded-xl text-orange-200/60 hover:bg-white/5 hover:text-white transition-all"
            >
              <HomeIcon size={20} />
              {isSidebarOpen && <span className="font-medium text-sm">View Website</span>}
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-3.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
            >
              <LogOut size={20} />
              {isSidebarOpen && <span className="font-medium text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-orange-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
            >
              {isSidebarOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
            <h2 className="text-xl font-bold text-orange-950 hidden sm:block">
              {menuItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-orange-100">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-orange-950">{auth.currentUser?.displayName || 'Admin User'}</div>
                <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Super Admin</div>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 border border-orange-200">
                <UserIcon size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/dashboard" element={<Overview />} />
            <Route path="/menu" element={<MenuManagement />} />
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="/reservations" element={<Reservations />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
