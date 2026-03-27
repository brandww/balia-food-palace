import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, Phone, User, CheckCircle2 } from 'lucide-react';
import { addReservation } from '../services/restaurantService';
import { toast } from 'sonner';

const Reservation = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: 2
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addReservation(formData);
      setIsSuccess(true);
      toast.success('Reservation request sent!');
    } catch (error) {
      toast.error('Failed to send reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass p-12 rounded-[3rem] text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold text-orange-950 mb-4">Table Reserved!</h2>
          <p className="text-gray-600 mb-10 leading-relaxed">
            Thank you, <span className="font-bold text-orange-900">{formData.name}</span>! 
            Your reservation request for <span className="font-bold">{formData.guests} guests</span> on 
            <span className="font-bold"> {formData.date}</span> at <span className="font-bold">{formData.time}</span> has been received. 
            We will call you shortly to confirm.
          </p>
          <button 
            onClick={() => setIsSuccess(false)}
            className="btn-primary w-full"
          >
            Make Another Booking
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24">
      {/* Header */}
      <section className="bg-orange-950 py-24 px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Book a Table</h1>
        <p className="text-orange-200/70 max-w-2xl mx-auto text-lg">
          Secure your spot for a delightful dining experience. Perfect for family gatherings and special celebrations.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Reservation Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-orange-100"
          >
            <h3 className="text-2xl font-bold text-orange-950 mb-10">Reservation Details</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                    <User size={16} className="text-orange-600" /> Full Name
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl bg-orange-50/50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                    <Phone size={16} className="text-orange-600" /> Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    className="w-full px-6 py-4 rounded-2xl bg-orange-50/50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="+91 00000 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                    <Calendar size={16} className="text-orange-600" /> Date
                  </label>
                  <input
                    required
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-6 py-4 rounded-2xl bg-orange-50/50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                    <Clock size={16} className="text-orange-600" /> Time
                  </label>
                  <select
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-orange-50/50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all appearance-none"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  >
                    <option value="">Select Time</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                    <option value="08:00 PM">08:00 PM</option>
                    <option value="09:00 PM">09:00 PM</option>
                    <option value="10:00 PM">10:00 PM</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                    <Users size={16} className="text-orange-600" /> Guests
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="50"
                    className="w-full px-6 py-4 rounded-2xl bg-orange-50/50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-5 text-xl flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Confirm Reservation Request <CheckCircle2 size={24} /></>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-6">
                  * By clicking confirm, you agree to our terms. We will contact you to finalize the booking.
                </p>
              </div>
            </form>
          </motion.div>

          {/* Info Sidebar */}
          <div className="space-y-8">
            <div className="bg-orange-950 p-10 rounded-[3rem] text-white shadow-xl">
              <h4 className="text-xl font-bold mb-6">Why Book with Us?</h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm mb-1">Guaranteed Seating</h5>
                    <p className="text-xs text-orange-200/60 leading-relaxed">Skip the queue and have your table ready upon arrival.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm mb-1">Special Occasions</h5>
                    <p className="text-xs text-orange-200/60 leading-relaxed">Let us know if it's a birthday or anniversary for a special surprise.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm mb-1">Group Dining</h5>
                    <p className="text-xs text-orange-200/60 leading-relaxed">We can accommodate large groups and family gatherings comfortably.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-orange-100 shadow-lg">
              <h4 className="text-xl font-bold text-orange-950 mb-6">Need Help?</h4>
              <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                If you have any questions regarding your booking or need to make a reservation for more than 50 people, please call us directly.
              </p>
              <a 
                href="tel:+910000000000" 
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl border-2 border-orange-600 text-orange-600 font-bold hover:bg-orange-50 transition-all"
              >
                <Phone size={20} /> +91 00000 00000
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reservation;
