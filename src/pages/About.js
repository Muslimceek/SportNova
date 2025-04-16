import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Play } from 'lucide-react';

const TimelineItem = ({ year, title, desc, index }) => (
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? 40 : -40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex flex-col md:flex-row gap-8 items-start"
  >
    <div className="w-24">
      <div className="text-4xl font-bold text-gray-400">{year}</div>
    </div>
    <div className="flex-1 border-l-2 border-gray-200 pl-8 py-2">
      <h3 className="text-2xl font-bold text-black mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  </motion.div>
);

const InnovationCard = ({ title, icon, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    viewport={{ once: true }}
    className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all"
  >
    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-black mb-2">{title}</h3>
    <p className="text-gray-600">Revolutionary approach to {title.toLowerCase()}</p>
  </motion.div>
);

const AthleteCard = ({ name, sport, img, index }) => (
  <motion.div
    key={name}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    viewport={{ once: true }}
    className="group relative h-96 rounded-xl overflow-hidden"
  >
    <img
      src={img}
      alt={name}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
      <div>
        <div className="text-white font-bold text-xl">{name}</div>
        <div className="text-red-500">{sport}</div>
      </div>
    </div>
  </motion.div>
);

const StatCard = ({ num, text, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    viewport={{ once: true }}
    className="text-center"
  >
    <div className="text-6xl font-bold text-red-500 mb-4">{num}</div>
    <div className="text-gray-300 uppercase text-sm tracking-wider">{text}</div>
  </motion.div>
);

const SportNovaAboutUs = () => {
  const data = {
    timeline: [
      { year: 2023, title: "Digital Transformation", desc: "Launched our revolutionary sports analytics platform" },
      { year: 2021, title: "Global Expansion", desc: "Opened offices in 3 new countries" },
      { year: 2018, title: "AI Integration", desc: "Implemented machine learning in performance tracking" },
      { year: 2015, title: "Mobile First", desc: "Rebuilt all platforms for mobile experience" },
      { year: 2010, title: "Company Founded", desc: "Started our journey in sports innovation" }
    ],
    innovations: [
      { title: "Performance Analytics", icon: <Play size={16} /> },
      { title: "Athlete Tracking", icon: <Play size={16} /> },
      { title: "Smart Wearables", icon: <Play size={16} /> },
      { title: "VR Training", icon: <Play size={16} /> }
    ],
    stats: [
      { num: "90%", text: "of elite athletes use our tech" },
      { num: "120+", text: "countries served" },
      { num: "1M+", text: "active users" }
    ],
    athletes: [
      { name: "Alex Morgan", sport: "Soccer", img: "https://source.unsplash.com/random/300x400/?soccer" },
      { name: "LeBron James", sport: "Basketball", img: "https://source.unsplash.com/random/300x400/?basketball" },
      { name: "Serena Williams", sport: "Tennis", img: "https://source.unsplash.com/random/300x400/?tennis" },
      { name: "Usain Bolt", sport: "Athletics", img: "https://source.unsplash.com/random/300x400/?sprinter" }
    ]
  };

  return (
    <div className="font-sans overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-0"
        />
        <video 
          autoPlay 
          muted 
          loop 
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-the-running-machine-22707-large.mp4" type="video/mp4" />
        </video>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 px-6 text-center text-white"
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              JUST DO IT <span className="text-red-500">.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Empowering athletes with cutting-edge technology and innovation.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center gap-2 mx-auto shadow-lg"
            >
              Explore More <ArrowRight size={20} />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-16 text-center text-black"
          >
            OUR STORY
          </motion.h2>
          
          <div className="max-w-4xl mx-auto space-y-16">
            {data.timeline.map((item, index) => (
              <TimelineItem key={item.year} index={index} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
                INNOVATION <span className="text-red-500">.</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-xl">
                We're pushing boundaries with technology that enhances athletic performance at every level.
              </p>
              <button className="flex items-center gap-2 text-black font-bold group">
                Learn about our tech <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-xl overflow-hidden"
            >
              <img
                src="https://source.unsplash.com/random/800x600/?technology"
                alt="Sports Technology"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.innovations.map((item, index) => (
              <InnovationCard key={index} index={index} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-28 bg-black text-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              BY THE NUMBERS
            </h2>
            <p className="text-gray-400 text-lg">
              Our impact in the world of sports performance technology
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {data.stats.map((stat, index) => (
              <StatCard key={stat.num} index={index} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Athletes Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-16 text-center text-black"
          >
            ATHLETES WE WORK WITH
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.athletes.map((athlete, index) => (
              <AthleteCard key={athlete.name} index={index} {...athlete} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
              JOIN THE MOVEMENT
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Be part of the revolution in sports performance technology.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 mx-auto"
            >
              Get Started <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SportNovaAboutUs;
