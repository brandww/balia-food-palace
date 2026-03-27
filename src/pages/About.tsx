import { motion } from 'motion/react';
import { Users, Utensils, Calendar, Heart, Award, ShieldCheck } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: <Users size={32} />, label: 'Happy Guests', value: '10k+' },
    { icon: <Utensils size={32} />, label: 'Dishes Served', value: '50k+' },
    { icon: <Award size={32} />, label: 'Years Experience', value: '10+' },
    { icon: <ShieldCheck size={32} />, label: 'Quality Standard', value: '100%' },
  ];

  const values = [
    { 
      title: 'Authenticity', 
      description: 'We stay true to our roots, using traditional recipes and genuine spices from the heart of India.',
      icon: <Heart className="text-orange-600" size={24} />
    },
    { 
      title: 'Family First', 
      description: 'Our restaurant is designed for families. We provide a safe, warm, and welcoming environment for all ages.',
      icon: <Users className="text-orange-600" size={24} />
    },
    { 
      title: 'Quality Ingredients', 
      description: 'We source our vegetables and meats daily to ensure every dish served is fresh and healthy.',
      icon: <Utensils className="text-orange-600" size={24} />
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero */}
      <section className="bg-orange-950 py-24 px-4 text-center text-white">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Our Culinary Journey
        </motion.h1>
        <p className="text-orange-200/70 max-w-2xl mx-auto text-lg">
          Discover the story behind Ballia's favorite family restaurant and our commitment to excellence.
        </p>
      </section>

      {/* Story */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-orange-950 leading-tight">
              From a Small Kitchen to <br /> Ballia's Food Palace
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Founded in 2014, Ballia's Food Palace began with a simple vision: to bring high-quality, 
                authentic dining to our local community. What started as a small family-run kitchen 
                has grown into a landmark destination for food lovers in Ballia.
              </p>
              <p>
                Our journey has been defined by our commitment to taste and hospitality. We believe 
                that great food has the power to bring people together, and we've dedicated ourselves 
                to creating a space where families can create lasting memories over delicious meals.
              </p>
              <p>
                Whether it's a quick lunch, a grand birthday celebration, or a quiet anniversary 
                dinner, we treat every guest like a member of our own family.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=2070" 
                alt="Our Kitchen" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-100 rounded-full -z-10 blur-3xl opacity-50" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-600/20 rounded-full -z-10 blur-3xl opacity-50" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center text-white">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-4"
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-md border border-white/10">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-orange-100 text-sm font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-orange-950 mb-6">Celebrate with Us</h2>
            <p className="text-gray-600">
              Make your special occasions even more memorable. We specialize in hosting events 
              that leave a lasting impression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Birthday Parties', image: 'https://images.unsplash.com/photo-1530103862676-fa8c91bbebdd?auto=format&fit=crop&q=80&w=2070' },
              { title: 'Anniversaries', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2069' },
              { title: 'Corporate Events', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=2012' },
            ].map((event, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group relative h-80 rounded-3xl overflow-hidden shadow-xl"
              >
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                  <h3 className="text-2xl font-bold text-white">{event.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-orange-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-orange-100">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-orange-950 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
