import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Building2, Calendar, Heart, MapPin, Mountain, PlaneTakeoff, TreePalm } from 'lucide-react';
import useOptimizedInView from '../../hooks/useOptimizedInView';

export default function CTASection() {
  const controls = useAnimation();
  const [sectionRef, inView] = useOptimizedInView(0.3, false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Magnetic button effect
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      );
      
      if (distance < 100) {
        const maxMove = 10;
        const moveX = ((x - centerX) / centerX) * maxMove;
        const moveY = ((y - centerY) / centerY) * maxMove;
        
        if (button.style) {
          button.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
      } else {
        if (button.style) {
          button.style.transform = 'translate(0, 0)';
        }
      }
    };
    
    const handleMouseLeave = () => {
      if (button.style) {
        button.style.transform = 'translate(0, 0)';
      }
    };
    
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const buildingVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  // Generate random buildings for the cityscape background
  const buildings = Array.from({ length: 18 }).map((_, i) => {
    const width = 20 + Math.random() * 40;
    const height = 100 + Math.random() * 200;
    
    return {
      id: i,
      width,
      height,
      color: i % 3 === 0 ? '#1f2937' : i % 3 === 1 ? '#111827' : '#0f172a',
      windows: Math.floor(height / 20)
    };
  });

  return (
    <section 
      ref={sectionRef as any}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pb-32 pt-20"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-indigo-950 to-gray-950 z-0" />
      
      {/* Fixed Open Planner Button */}
      <motion.button
        className="fixed top-6 right-6 z-50 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full 
                 text-white font-semibold flex items-center gap-2 hover:bg-white/20 transition-all
                 border border-white/20 shadow-lg"
        onClick={() => navigate('/planner')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Calendar className="w-5 h-5" />
        Open Planner
      </motion.button>

      {/* Main content */}
      <motion.div 
        className="relative z-40 text-center px-6 max-w-4xl mx-auto"
        variants={variants}
        initial="hidden"
        animate={controls}
      >
        <motion.div 
          className="flex justify-center mb-12 gap-4"
          variants={variants}
        >
          <Mountain className="text-indigo-400 w-12 h-12" 
                  style={{ filter: 'drop-shadow(0 0 8px rgba(129, 140, 248, 0.8))' }} />
          <TreePalm className="text-teal-400 w-12 h-12"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(45, 212, 191, 0.8))' }} />
          <Building2 className="text-blue-400 w-12 h-12" 
                  style={{ filter: 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.8))' }} />
        </motion.div>
        
        <motion.h2 
          className="font-space-grotesk text-4xl md:text-6xl font-bold text-white mb-8 uppercase tracking-wide"
          variants={variants}
          style={{ 
            textShadow: '0 0 20px rgba(59, 130, 246, 0.7), 0 0 40px rgba(59, 130, 246, 0.3)' 
          }}
        >
          Ready to Plan Your Perfect Trip?
        </motion.h2>
        
        <motion.p 
          className="text-gray-300 text-lg md:text-xl mb-16 max-w-2xl mx-auto"
          variants={variants}
        >
          Build your dream itinerary in minutes. Drag, drop, and explore. Travel planning just got fun.
        </motion.p>
        
        {/* Feature highlights */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={variants}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-xl border border-white/10 transform hover:scale-105 transition-transform">
            <div className="bg-cyan-500 p-3 rounded-full w-14 h-14 mx-auto mb-6 flex items-center justify-center"
                style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}>
              <MapPin className="text-white w-7 h-7" />
            </div>
            <h3 className="text-white font-bold text-xl mb-3">Any Destination</h3>
            <p className="text-gray-300 text-base">Mountains, beaches, or cities — we've got you covered.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-xl border border-white/10 transform hover:scale-105 transition-transform">
            <div className="bg-pink-500 p-3 rounded-full w-14 h-14 mx-auto mb-6 flex items-center justify-center"
                style={{ boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)' }}>
              <Calendar className="text-white w-7 h-7" />
            </div>
            <h3 className="text-white font-bold text-xl mb-3">Smart Planning</h3>
            <p className="text-gray-300 text-base">AI-powered suggestions based on your preferences.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-xl border border-white/10 transform hover:scale-105 transition-transform">
            <div className="bg-indigo-500 p-3 rounded-full w-14 h-14 mx-auto mb-6 flex items-center justify-center"
                style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' }}>
              <PlaneTakeoff className="text-white w-7 h-7" />
            </div>
            <h3 className="text-white font-bold text-xl mb-3">Travel Deals</h3>
            <p className="text-gray-300 text-base">Exclusive discounts on flights, hotels and activities.</p>
          </div>
        </motion.div>
        
        {/* CTA Button with magnetic effect and neon glow */}
        <motion.div className="relative z-10 mt-8 mb-20">
          <motion.button 
            ref={buttonRef}
            className="relative bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xl py-5 px-12 rounded-full flex items-center gap-3 mx-auto group"
            variants={variants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/planner')}
            style={{ 
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
              transition: 'all 0.2s ease-out',
              willChange: 'transform',
              cursor: 'pointer'
            }}
          >
            Launch the Planner 
            <ArrowRight className="ml-1 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            <span className="absolute inset-0 rounded-full bg-transparent" 
                  style={{ 
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.7), 0 0 40px rgba(6, 182, 212, 0.3)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }} />
          </motion.button>
        </motion.div>
      </motion.div>
      
      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md py-6 px-4 z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <span>TravelScape</span>
          </div>
          
          <div className="flex gap-6 text-sm my-4 md:my-0">
            <Link to="/" className="text-gray-400 hover:text-white transition">Mountains</Link>
            <Link to="/" className="text-gray-400 hover:text-white transition">Beaches</Link>
            <Link to="/" className="text-gray-400 hover:text-white transition">Cities</Link>
            <Link to="/planner" className="text-gray-400 hover:text-white transition">Planner</Link>
          </div>
          
          <div className="text-sm text-gray-500">
            Built with <Heart className="inline w-4 h-4 text-pink-500" /> by TravelScape Team
          </div>
        </div>
      </div>
    </section>
  );
}
