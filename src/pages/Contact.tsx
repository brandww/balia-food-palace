import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <section className="bg-orange-950 py-24 px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Get in Touch</h1>
        <p className="text-orange-200/70 max-w-2xl mx-auto text-lg">
          Have a question, feedback, or want to book an event? We'd love to hear from you.
        </p>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-orange-950 mb-8">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-orange-950 mb-1">Our Location</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Mahua Mod, Ballia - Bansdih Rd, <br />
                      Harpur, Ballia, Uttar Pradesh 277001, India
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-orange-950 mb-1">Phone Number</h4>
                    <a href="tel:+910000000000" className="text-gray-600 hover:text-orange-600 transition-colors text-lg">
                      +91 00000 00000
                    </a>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                    <Mail size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-orange-950 mb-1">Email Address</h4>
                    <a href="mailto:info@balliafoodpalace.com" className="text-gray-600 hover:text-orange-600 transition-colors text-lg">
                      info@balliafoodpalace.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-orange-600 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <h3 className="text-2xl font-bold mb-4 relative z-10">Quick Support</h3>
              <p className="text-orange-100 mb-8 relative z-10 leading-relaxed">
                Need an immediate answer? Chat with us on WhatsApp for quick assistance regarding orders or bookings.
              </p>
              <a 
                href="https://wa.me/910000000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition-all relative z-10"
              >
                Chat on WhatsApp <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[3rem] shadow-2xl border border-orange-100"
          >
            <h3 className="text-2xl font-bold text-orange-950 mb-8">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Your Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-5 py-3.5 rounded-2xl bg-orange-50/50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                  <input
                    required
                    type="email"
                    className="w-full px-5 py-3.5 rounded-2xl bg-orange-50/50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Subject</label>
                <input
                  required
                  type="text"
                  className="w-full px-5 py-3.5 rounded-2xl bg-orange-50/50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Message</label>
                <textarea
                  required
                  rows={5}
                  className="w-full px-5 py-3.5 rounded-2xl bg-orange-50/50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                  placeholder="Tell us more about your request..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Send Message <Send size={20} /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Map */}
      <section className="h-[500px] w-full bg-gray-200">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3587.456789!2d84.15!3d25.76!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDQ1JzM2LjAiTiA4NMKwMDknMDAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
  );
};

export default Contact;
