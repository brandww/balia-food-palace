import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Utensils, Layers, CalendarCheck, TrendingUp, Clock, ChevronRight, Database } from 'lucide-react';
import { getMenuItems, getCategories, getReservations, addCategory, addMenuItem } from '../../services/restaurantService';
import { MenuItem, Category, Reservation } from '../../types';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const Overview = () => {
  const [stats, setStats] = useState({
    menuItems: 0,
    categories: 0,
    pendingReservations: 0,
    popularItems: 0
  });
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [items, cats] = await Promise.all([getMenuItems(), getCategories()]);
        
        setStats({
          menuItems: items.length,
          categories: cats.length,
          pendingReservations: 0, // Will be updated by onSnapshot
          popularItems: items.filter(i => i.isPopular).length
        });

        const unsubscribe = getReservations((reservations) => {
          setRecentReservations(reservations.slice(0, 5));
          setStats(prev => ({
            ...prev,
            pendingReservations: reservations.filter(r => r.status === 'pending').length
          }));
        });

        setLoading(false);
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching overview data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      // Seed Categories
      const categoriesToSeed = [
        { name: 'Breakfast', order: 1 },
        { name: 'Veg Main Course', order: 2 },
        { name: 'Non-Veg Main Course', order: 3 },
        { name: 'Chinese', order: 4 },
        { name: 'Snacks', order: 5 },
        { name: 'Beverages', order: 6 }
      ];

      const catRefs = await Promise.all(categoriesToSeed.map(cat => addCategory(cat)));
      
      // Seed Menu Items
      const menuItemsToSeed = [
        { name: 'Chicken Biryani', price: 250, description: 'Authentic Hyderabadi style chicken biryani served with raita.', categoryId: catRefs[2]!.id, isAvailable: true, isPopular: true, image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=2000' },
        { name: 'Paneer Butter Masala', price: 180, description: 'Creamy tomato-based gravy with soft paneer cubes.', categoryId: catRefs[1]!.id, isAvailable: true, isPopular: true, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=2000' },
        { name: 'Veg Manchurian', price: 150, description: 'Crispy veg balls in spicy and tangy chinese sauce.', categoryId: catRefs[3]!.id, isAvailable: true, isPopular: true, image: 'https://images.unsplash.com/photo-1512058560550-42749359a777?auto=format&fit=crop&q=80&w=2000' },
        { name: 'Cold Coffee', price: 80, description: 'Refreshing chilled coffee with a scoop of vanilla ice cream.', categoryId: catRefs[5]!.id, isAvailable: true, isPopular: false, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=2000' }
      ];

      await Promise.all(menuItemsToSeed.map(item => addMenuItem(item)));
      
      toast.success('Sample data seeded successfully!');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to seed data.');
    } finally {
      setIsSeeding(false);
    }
  };

  const cards = [
    { name: 'Total Menu Items', value: stats.menuItems, icon: <Utensils size={24} />, color: 'bg-blue-500', path: '/admin/menu' },
    { name: 'Total Categories', value: stats.categories, icon: <Layers size={24} />, color: 'bg-purple-500', path: '/admin/categories' },
    { name: 'Pending Bookings', value: stats.pendingReservations, icon: <CalendarCheck size={24} />, color: 'bg-orange-500', path: '/admin/reservations' },
    { name: 'Popular Dishes', value: stats.popularItems, icon: <TrendingUp size={24} />, color: 'bg-green-500', path: '/admin/menu' },
  ];

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-4 gap-8">
      {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white rounded-3xl" />)}
    </div>
    <div className="h-96 bg-white rounded-3xl" />
  </div>;

  return (
    <div className="space-y-10">
      {/* Header with Seed Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-orange-950">Dashboard Overview</h2>
        {stats.menuItems === 0 && (
          <button
            onClick={handleSeedData}
            disabled={isSeeding}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-100 text-orange-600 rounded-xl font-bold hover:bg-orange-200 transition-all disabled:opacity-50"
          >
            <Database size={18} /> {isSeeding ? 'Seeding...' : 'Seed Sample Data'}
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2rem] shadow-sm border border-orange-100 flex items-center gap-6 group hover:shadow-xl transition-all"
          >
            <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-950">{card.value}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{card.name}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-orange-100 p-10">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold text-orange-950">Recent Reservations</h3>
            <Link to="/admin/reservations" className="text-sm font-bold text-orange-600 flex items-center gap-1 hover:gap-2 transition-all">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="space-y-6">
            {recentReservations.length > 0 ? (
              recentReservations.map((res) => (
                <div key={res.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-orange-50 transition-all border border-transparent hover:border-orange-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                      {res.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-orange-950">{res.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} /> {res.date} at {res.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-bold text-orange-950">{res.guests} Guests</div>
                      <div className="text-xs text-gray-400">{res.phone}</div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      res.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                      res.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {res.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">No recent reservations.</div>
            )}
          </div>
        </div>

        <div className="bg-orange-950 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <h3 className="text-xl font-bold mb-8 relative z-10">Quick Actions</h3>
          <div className="space-y-4 relative z-10">
            <Link to="/admin/menu" className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/10 hover:bg-white/20 transition-all group">
              <div className="flex items-center gap-4">
                <Utensils size={20} className="text-orange-400" />
                <span className="font-medium">Add Menu Item</span>
              </div>
              <ChevronRight size={18} className="text-orange-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/admin/categories" className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/10 hover:bg-white/20 transition-all group">
              <div className="flex items-center gap-4">
                <Layers size={20} className="text-orange-400" />
                <span className="font-medium">Manage Categories</span>
              </div>
              <ChevronRight size={18} className="text-orange-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/admin/reservations" className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/10 hover:bg-white/20 transition-all group">
              <div className="flex items-center gap-4">
                <CalendarCheck size={20} className="text-orange-400" />
                <span className="font-medium">Check Reservations</span>
              </div>
              <ChevronRight size={18} className="text-orange-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="mt-12 p-6 rounded-2xl bg-orange-600/30 border border-orange-500/30 relative z-10">
            <div className="text-xs font-bold text-orange-300 uppercase tracking-widest mb-2">Pro Tip</div>
            <p className="text-sm text-orange-100 leading-relaxed">
              Keep your menu updated with "Popular" tags to attract more customers to your best dishes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
