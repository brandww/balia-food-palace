import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Users, Phone, User, CheckCircle2, XCircle, Search, Filter, Trash2, ChevronDown } from 'lucide-react';
import { getReservations, updateReservationStatus, deleteMenuItem } from '../../services/restaurantService';
import { Reservation } from '../../types';
import { toast } from 'sonner';
import { db } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = getReservations((data) => {
      setReservations(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (id: string, status: Reservation['status']) => {
    try {
      await updateReservationStatus(id, status);
      toast.success(`Reservation ${status}!`);
    } catch (error) {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this reservation record?')) {
      try {
        await deleteDoc(doc(db, 'reservations', id));
        toast.success('Reservation deleted.');
      } catch (error) {
        toast.error('Failed to delete reservation.');
      }
    }
  };

  const filteredReservations = reservations.filter(res => {
    const matchesStatus = filterStatus === 'all' || res.status === filterStatus;
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         res.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  if (loading) return <div className="animate-pulse space-y-4">
    {[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-white rounded-3xl" />)}
  </div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-orange-950">Table Reservations</h2>
          <p className="text-gray-500 text-sm">Manage and track your restaurant's bookings.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or phone..."
              className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2.5 rounded-xl bg-white border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm font-semibold text-gray-600 appearance-none pr-10 relative"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredReservations.length > 0 ? (
            filteredReservations.map((res) => (
              <motion.div
                key={res.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-6 rounded-[2rem] shadow-sm border border-orange-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 ${
                    res.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                    res.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {res.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg text-orange-950">{res.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        res.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                        res.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-medium">
                      <span className="flex items-center gap-1.5"><Phone size={14} className="text-orange-400" /> {res.phone}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-orange-400" /> {res.date}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} className="text-orange-400" /> {res.time}</span>
                      <span className="flex items-center gap-1.5"><Users size={14} className="text-orange-400" /> {res.guests} Guests</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-orange-50">
                  {res.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(res.id, 'confirmed')}
                        className="flex-grow lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                      >
                        <CheckCircle2 size={18} /> Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(res.id, 'cancelled')}
                        className="flex-grow lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all"
                      >
                        <XCircle size={18} /> Cancel
                      </button>
                    </>
                  )}
                  {res.status !== 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(res.id, 'pending')}
                      className="flex-grow lg:flex-none px-6 py-2.5 bg-orange-50 text-orange-600 rounded-xl text-sm font-bold hover:bg-orange-100 transition-all"
                    >
                      Reset to Pending
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-orange-100">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-200">
                <Calendar size={40} />
              </div>
              <h3 className="text-2xl font-bold text-orange-950 mb-2">No reservations found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Reservations;
