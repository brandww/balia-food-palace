import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getCategories, getMenuItems } from '../services/restaurantService';
import { Category, MenuItem } from '../types';
import { Search, Filter, ShoppingBag } from 'lucide-react';

const MenuPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, items] = await Promise.all([getCategories(), getMenuItems()]);
        setCategories(cats);
        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.categoryId === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24">
      {/* Header */}
      <div className="bg-orange-950 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Our Delicious Menu</h1>
        <p className="text-orange-200/70 max-w-2xl mx-auto">
          Explore our wide range of authentic dishes, prepared with love and the finest ingredients.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="glass rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for dishes..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'all' 
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' 
                : 'bg-white text-gray-600 hover:bg-orange-50'
              }`}
            >
              All Dishes
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' 
                  : 'bg-white text-gray-600 hover:bg-orange-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg border border-orange-100 group hover:shadow-2xl transition-all"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=2000"} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Out of Stock</span>
                      </div>
                    )}
                    {item.isPopular && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                          Popular
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-orange-950 leading-tight">{item.name}</h3>
                      <span className="text-orange-600 font-bold text-lg">₹{item.price}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {item.description || "Freshly prepared with authentic spices and quality ingredients."}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {categories.find(c => c.id === item.categoryId)?.name}
                      </div>
                      <button 
                        disabled={!item.isAvailable}
                        className={`p-2 rounded-xl transition-all ${
                          item.isAvailable 
                          ? 'bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-bold text-orange-950 mb-2">No dishes found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>

      {/* Floating Order Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-orange-600 rounded-[2rem] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-900/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Craving something special?</h2>
          <p className="text-orange-100 mb-10 max-w-xl mx-auto relative z-10">
            Order directly via WhatsApp for fast home delivery or takeaway. 
            Fresh food delivered right to your doorstep.
          </p>
          <a 
            href="https://wa.me/910000000000" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-orange-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transition-all shadow-xl relative z-10"
          >
            Order via WhatsApp <ShoppingBag size={24} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
