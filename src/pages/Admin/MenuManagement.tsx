import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Search, Filter, X, Save, Image as ImageIcon, ChevronRight, Star, ShoppingBag } from 'lucide-react';
import { getMenuItems, getCategories, addMenuItem, updateMenuItem, deleteMenuItem } from '../../services/restaurantService';
import { MenuItem, Category } from '../../types';
import { toast } from 'sonner';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    price: 0,
    description: '',
    image: '',
    categoryId: '',
    isAvailable: true,
    isPopular: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [items, cats] = await Promise.all([getMenuItems(), getCategories()]);
    setMenuItems(items);
    setCategories(cats);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast.error('Please select a category.');
      return;
    }

    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, formData);
        toast.success('Menu item updated!');
      } else {
        await addMenuItem(formData);
        toast.success('Menu item added!');
      }
      setIsAdding(false);
      setEditingItem(null);
      setFormData({ name: '', price: 0, description: '', image: '', categoryId: '', isAvailable: true, isPopular: false });
      fetchData();
    } catch (error) {
      toast.error('Failed to save menu item.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMenuItem(id);
        toast.success('Item deleted.');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete item.');
      }
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.categoryId === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-20 bg-white rounded-3xl" />
    <div className="grid grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-white rounded-3xl" />)}
    </div>
  </div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-orange-950">Menu Management</h2>
          <p className="text-gray-500 text-sm">Add, edit, and manage your restaurant's menu items.</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingItem(null);
            setFormData({ name: '', price: 0, description: '', image: '', categoryId: '', isAvailable: true, isPopular: false });
          }}
          className="btn-primary flex items-center gap-2 py-2.5"
        >
          <Plus size={20} /> Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="glass rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search menu items..."
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
            All Items
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

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-orange-100 group hover:shadow-xl transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=2000"} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setFormData(item);
                      setIsAdding(true);
                    }}
                    className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Out of Stock</span>
                  </div>
                )}
                {item.isPopular && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> Popular
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-orange-950 leading-tight">{item.name}</h3>
                  <span className="text-orange-600 font-bold">₹{item.price}</span>
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                  {categories.find(c => c.id === item.categoryId)?.name}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs font-medium text-gray-500">{item.isAvailable ? 'Available' : 'Out of Stock'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-orange-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-10 md:p-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-3xl font-bold text-orange-950">
                    {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                  </h3>
                  <button onClick={() => setIsAdding(false)} className="p-2 text-gray-400 hover:text-orange-600 transition-all">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Item Name</label>
                      <input
                        required
                        type="text"
                        className="w-full px-6 py-4 rounded-2xl bg-orange-50/50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        placeholder="e.g. Chicken Biryani"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                      <input
                        required
                        type="number"
                        className="w-full px-6 py-4 rounded-2xl bg-orange-50/50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        placeholder="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                      <select
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-orange-50/50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all appearance-none"
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Image URL</label>
                      <div className="relative">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          className="w-full pl-12 pr-6 py-4 rounded-2xl bg-orange-50/50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                          placeholder="https://..."
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea
                      rows={3}
                      className="w-full px-6 py-4 rounded-2xl bg-orange-50/50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                      placeholder="Brief description of the dish..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-wrap gap-8 pt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={formData.isAvailable}
                          onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                        />
                        <div className={`w-12 h-6 rounded-full transition-all ${formData.isAvailable ? 'bg-orange-600' : 'bg-gray-300'}`}></div>
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isAvailable ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-sm font-bold text-gray-700">Available</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={formData.isPopular}
                          onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                        />
                        <div className={`w-12 h-6 rounded-full transition-all ${formData.isPopular ? 'bg-orange-600' : 'bg-gray-300'}`}></div>
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isPopular ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-sm font-bold text-gray-700">Popular Dish</span>
                    </label>
                  </div>

                  <div className="pt-8 flex gap-4">
                    <button type="button" onClick={() => setIsAdding(false)} className="flex-grow btn-secondary">Cancel</button>
                    <button type="submit" className="flex-[2] btn-primary flex items-center justify-center gap-2">
                      <Save size={20} /> {editingItem ? 'Update Item' : 'Save Item'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuManagement;
