import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, MapPin, Phone, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getMenuItems } from '../services/restaurantService';
import { MenuItem } from '../types';

const Home = () => {
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchPopular = async () => {
      const items = await getMenuItems();
      setPopularItems(items.filter(item => item.isPopular).slice(0, 4));
    };
    fetchPopular();
  }, []);

  const testimonials = [
    { name: "Rahul Singh", rating: 5, text: "Best Chicken Biryani in Ballia! The spices are perfect and the service is very warm." },
    { name: "Priya Verma", rating: 5, text: "A great place for family dinners. The Paneer Butter Masala is a must-try!" },
    { name: "Amit Gupta", rating: 4, text: "Clean environment and delicious food. Manchurian Rice was surprisingly good." },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070" 
            alt="Delicious Food" 
            className="w-full h-full object-cover brightness-[0.4]"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 bg-orange-600/20 backdrop-blur-md border border-orange-500/30 rounded-full text-orange-400 text-sm font-semibold mb-6 tracking-wider uppercase">
              Ballia's Finest Dining
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1]">
              Authentic Flavors, <br />
              <span className="text-orange-500">Family Memories.</span>
            </h1>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              Experience the perfect blend of traditional spices and modern culinary art. 
              From our famous Chicken Biryani to delightful Veg Main Courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/menu" className="btn-primary flex items-center justify-center gap-2">
                Explore Menu <ArrowRight size={18} />
              </Link>
              <Link to="/reservation" className="btn-secondary !bg-transparent !text-white !border-white/30 hover:!bg-white/10 flex items-center justify-center gap-2">
                Book a Table
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 hidden md:block">
          <div className="glass rounded-2xl p-8 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-900">4.8 ⭐</div>
              <div className="text-sm text-gray-500">Customer Rating</div>
            </div>
            <div className="border-x border-orange-100">
              <div className="text-3xl font-bold text-orange-900">50+</div>
              <div className="text-sm text-gray-500">Delicious Dishes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-900">10k+</div>
              <div className="text-sm text-gray-500">Happy Guests</div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1974" 
                  alt="Restaurant Ambience" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-orange-600 rounded-3xl flex flex-col items-center justify-center text-white p-6 shadow-xl hidden sm:flex">
                <span className="text-4xl font-bold">10+</span>
                <span className="text-sm text-center font-medium opacity-80">Years of Culinary Excellence</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-orange-950 mb-6 leading-tight">
                A Legacy of Taste in the <br /> Heart of Ballia
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Ballia's Food Palace is more than just a restaurant; it's a celebration of flavors. 
                Founded with a passion for authentic Indian and Chinese cuisine, we've become a 
                favorite destination for families looking for quality food at budget-friendly prices.
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Star size={14} fill="currentColor" /></div>
                  <span>Premium quality ingredients sourced locally</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Star size={14} fill="currentColor" /></div>
                  <span>Expert chefs with years of experience</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Star size={14} fill="currentColor" /></div>
                  <span>Warm and welcoming family atmosphere</span>
                </div>
              </div>
              <Link to="/about" className="text-orange-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                Learn More About Us <ChevronRight size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Dishes */}
      <section className="py-24 bg-orange-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-orange-950 mb-4">Our Popular Dishes</h2>
            <p className="text-gray-600">Handpicked favorites that our guests can't get enough of.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularItems.length > 0 ? (
              popularItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2070"} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-orange-950">{item.name}</h3>
                      <span className="text-orange-600 font-bold">₹{item.price}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <Link to="/menu" className="text-sm font-semibold text-orange-600 hover:underline">View in Menu</Link>
                  </div>
                </motion.div>
              ))
            ) : (
              // Fallback static items if DB is empty
              ['Chicken Biryani', 'Paneer Butter Masala', 'Pizza', 'Manchurian Rice'].map((name, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-orange-950">{name}</h3>
                    <p className="text-gray-500 text-sm mb-4">Delicious and authentic taste.</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/menu" className="btn-secondary">View Full Menu</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-orange-950 mb-4">What Our Guests Say</h2>
            <div className="flex justify-center gap-1 text-orange-500">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-orange-50 border border-orange-100 relative"
              >
                <div className="text-orange-200 absolute top-4 right-8 text-6xl font-serif">"</div>
                <p className="text-gray-700 italic mb-6 relative z-10">{t.text}</p>
                <div className="font-bold text-orange-950">{t.name}</div>
                <div className="flex gap-1 text-orange-500 mt-1">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info & Map */}
      <section className="py-24 bg-orange-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold mb-8">Visit Us Today</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Our Location</h4>
                    <p className="text-orange-200/70">Mahua Mod, Ballia - Bansdih Rd, Harpur, Ballia, Uttar Pradesh, India</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Opening Hours</h4>
                    <p className="text-orange-200/70">Monday - Sunday: 10:00 AM - 11:00 PM</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Call for Reservations</h4>
                    <p className="text-orange-200/70">+91 00000 00000</p>
                  </div>
                </div>
              </div>
              <div className="mt-12 flex gap-4">
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="btn-primary">Get Directions</a>
                <Link to="/contact" className="btn-secondary !bg-transparent !text-white !border-white/30 hover:!bg-white/10">Contact Us</Link>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden h-[400px] border border-white/10 shadow-2xl">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3587.456789!2d84.15!3d25.76!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDQ1JzM2LjAiTiA4NMKwMDknMDAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
