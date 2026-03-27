import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Save, X, Layers, ChevronRight } from 'lucide-react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../services/restaurantService';
import { Category } from '../../types';
import { toast } from 'sonner';

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', order: 0 });
  const [editCategory, setEditCategory] = useState({ name: '', order: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    const cats = await getCategories();
    setCategories(cats);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    
    try {
      await addCategory(newCategory);
      toast.success('Category added successfully!');
      setNewCategory({ name: '', order: 0 });
      setIsAdding(false);
      fetchCats();
    } catch (error) {
      toast.error('Failed to add category.');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editCategory.name.trim()) return;
    
    try {
      await updateCategory(id, editCategory);
      toast.success('Category updated!');
      setEditingId(null);
      fetchCats();
    } catch (error) {
      toast.error('Failed to update category.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This may affect menu items.')) {
      try {
        await deleteCategory(id);
        toast.success('Category deleted.');
        fetchCats();
      } catch (error) {
        toast.error('Failed to delete category.');
      }
    }
  };

  if (loading) return <div className="animate-pulse space-y-4">
    {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl" />)}
  </div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-orange-950">Menu Categories</h2>
          <p className="text-gray-500 text-sm">Organize your menu into logical sections.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="btn-primary flex items-center gap-2 py-2.5"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-between group hover:shadow-lg transition-all"
              >
                {editingId === cat.id ? (
                  <div className="flex-grow flex items-center gap-4">
                    <input
                      type="text"
                      className="flex-grow px-4 py-2 rounded-xl bg-orange-50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={editCategory.name}
                      onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                    />
                    <input
                      type="number"
                      className="w-20 px-4 py-2 rounded-xl bg-orange-50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={editCategory.order}
                      onChange={(e) => setEditCategory({ ...editCategory, order: parseInt(e.target.value) })}
                    />
                    <button onClick={() => handleUpdate(cat.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"><Save size={20} /></button>
                    <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-all"><X size={20} /></button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-6">
                      <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 font-bold">
                        {cat.order || 0}
                      </div>
                      <div className="font-bold text-orange-950 text-lg">{cat.name}</div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => {
                          setEditingId(cat.id);
                          setEditCategory({ name: cat.name, order: cat.order || 0 });
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="space-y-8">
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-orange-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-orange-950">New Category</h3>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-orange-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Category Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-5 py-3.5 rounded-2xl bg-orange-50/50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="e.g. Main Course"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Display Order</label>
                  <input
                    type="number"
                    className="w-full px-5 py-3.5 rounded-2xl bg-orange-50/50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="0"
                    value={newCategory.order}
                    onChange={(e) => setNewCategory({ ...newCategory, order: parseInt(e.target.value) })}
                  />
                </div>
                <button type="submit" className="w-full btn-primary py-4">Create Category</button>
              </form>
            </motion.div>
          )}

          <div className="bg-orange-950 p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <Layers className="text-orange-400 mb-6" size={40} />
            <h3 className="text-xl font-bold mb-4">Category Tips</h3>
            <ul className="space-y-4 text-sm text-orange-200/60 leading-relaxed">
              <li className="flex gap-3">
                <ChevronRight size={16} className="text-orange-400 shrink-0 mt-1" />
                <span>Use clear, concise names for categories.</span>
              </li>
              <li className="flex gap-3">
                <ChevronRight size={16} className="text-orange-400 shrink-0 mt-1" />
                <span>Order them logically (e.g., Starters before Main Course).</span>
              </li>
              <li className="flex gap-3">
                <ChevronRight size={16} className="text-orange-400 shrink-0 mt-1" />
                <span>Deleting a category won't delete items, but they will become uncategorized.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
