import { useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Share2, Shell, Sun, TreePalm } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import useOptimizedInView from '../../hooks/useOptimizedInView';

// Magnetic button component with enhanced cursor-following effect
function MagneticButton({ children }: { children: React.ReactNode }) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Enhanced spring configuration for smoother motion
  const springConfig = { damping: 15, stiffness: 150, mass: 0.8 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);
  
  // Glow effect values
  const glowOpacity = useMotionValue(0);
  const glowSpring = useSpring(glowOpacity, { damping: 15, stiffness: 150 });
  
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const distance = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      );
      
      // Increase the radius of effect for a more dramatic magnetic pull
      if (distance < 120) {
        const maxMove = 15;
        const moveX = ((x - centerX) / centerX) * maxMove;
        const moveY = ((y - centerY) / centerY) * maxMove;
        
        mouseX.set(moveX);
        mouseY.set(moveY);
        glowOpacity.set(0.8 - (distance / 120) * 0.3);
      } else {
        mouseX.set(0);
        mouseY.set(0);
        glowOpacity.set(0.3); // Subtle glow at rest
      }
    };
    
    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
      glowOpacity.set(0.3);
    };
    
    const handleMouseEnter = () => {
      glowOpacity.set(0.5);
    };
    
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, glowOpacity]);
  
  return (
    <motion.div 
      ref={buttonRef}
      style={{ 
        x: xSpring, 
        y: ySpring, 
        position: 'relative' 
      }}
      className="inline-block"
    >
      <motion.div 
        className="absolute inset-0 rounded-full"
        style={{ 
          boxShadow: useTransform(
            glowSpring,
            (opacity) => `0 0 25px rgba(254, 215, 170, ${opacity})`
          ),
          opacity: glowSpring
        }}
      />
      {children}
    </motion.div>
  );
}

export default function BeachSection() {
  const controls = useAnimation();
  const { setTheme } = useTheme();
  const [ref, inView] = useOptimizedInView(0.3, false) as [any, boolean];
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  useEffect(() => {
    if (inView) {
      controls.start('visible');
      setTheme('beaches');
    }
  }, [controls, inView, setTheme]);

  useEffect(() => {
    // Load fonts for section
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
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

  const waveVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  const waveContinuousAnimation = {
    initial: { x: 0 },
    animate: {
      x: [0, -30, 0, 30, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const palmVariants = {
    initial: { rotateZ: 0 },
    animate: {
      rotateZ: [0, 2, 0, -2, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    hover: {
      rotateZ: [0, 4, 0, -4, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const sunPulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.9, 1, 0.9],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Floating elements animation
  const floatingElements = Array.from({ length: 6 }).map((_, i) => ({
    size: 6 + Math.random() * 10,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 70,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 4
  }));

  const buttonGradientVariants = {
    initial: { backgroundPosition: "0% 50%" },
    hover: { 
      backgroundPosition: "100% 50%",
      transition: { 
        duration: 1.5,
        ease: "easeInOut" 
      }
    }
  };

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 md:py-24"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Background gradient - brighter, warmer beach colors */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-400 via-amber-300 to-sky-300 z-0" />
      
      {/* Sun with pulsing animation */}
      <motion.div 
        className="absolute top-20 right-20 w-28 h-28 rounded-full bg-yellow-300 z-10"
        variants={sunPulseVariants}
        initial="initial"
        animate={prefersReducedMotion.current ? "initial" : "animate"}
        style={{
          boxShadow: '0 0 40px rgba(251, 191, 36, 0.8), 0 0 80px rgba(251, 191, 36, 0.4)'
        }}
      />
      
      {/* Beach sand */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-amber-100 z-20" />
      
      {/* Animated waves with continuous movement */}
      <motion.div 
        className="absolute bottom-[33%] left-0 right-0 h-12 bg-blue-400/70 rounded-t-[70%] z-20"
        variants={waveVariants}
        initial="hidden"
        animate="visible"
        style={{ backdropFilter: 'blur(2px)' }}
      >
        <motion.div
          className="absolute inset-0"
          variants={waveContinuousAnimation}
          initial="initial"
          animate={prefersReducedMotion.current ? "initial" : "animate"}
        />
        
        {/* Sparkle effects on wave crests */}
        {!prefersReducedMotion.current && Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 30}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.8, 1.2, 0.8],
              y: [0, -5, 0]
            }}
            transition={{
              duration: 1.5 + Math.random(),
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
      
      <motion.div 
        className="absolute bottom-[32%] left-0 right-0 h-10 bg-teal-400/60 rounded-t-[80%] z-21"
        variants={waveVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        style={{ backdropFilter: 'blur(2px)' }}
      >
        <motion.div
          className="absolute inset-0"
          variants={waveContinuousAnimation}
          initial="initial"
          animate={prefersReducedMotion.current ? "initial" : "animate"}
          transition={{ delay: 0.5, duration: 10 }}
        />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-[31%] left-0 right-0 h-8 bg-sky-200/50 rounded-t-[90%] z-22"
        variants={waveVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
        style={{ backdropFilter: 'blur(1px)' }}
      >
        <motion.div
          className="absolute inset-0"
          variants={waveContinuousAnimation}
          initial="initial"
          animate={prefersReducedMotion.current ? "initial" : "animate"}
          transition={{ delay: 1, duration: 12 }}
        />
      </motion.div>
      
      {/* Interactive Palm trees with hover effect */}
      <motion.div 
        className="absolute bottom-[32%] left-[20%] z-30 text-green-800"
        variants={palmVariants}
        initial="initial"
        animate={prefersReducedMotion.current ? "initial" : "animate"}
        whileHover="hover"
        style={{ originY: 1, originX: 0.5 }}
      >
        <TreePalm size={100} />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-[32%] right-[15%] z-30 text-green-900"
        variants={palmVariants}
        initial="initial"
        animate={prefersReducedMotion.current ? "initial" : "animate"}
        whileHover="hover"
        transition={{ delay: 1 }}
        style={{ originY: 1, originX: 0.5 }}
      >
        <TreePalm size={80} />
      </motion.div>
      
      {/* Floating beach balls/shells */}
      {!prefersReducedMotion.current && floatingElements.map((element, i) => (
        <motion.div
          key={`float-${i}`}
          className="absolute rounded-full z-25"
          style={{
            width: `${element.size}px`,
            height: `${element.size}px`,
            left: `${element.x}%`,
            top: `${element.y}%`,
            backgroundColor: i % 2 === 0 ? '#f43f5e' : '#0ea5e9',
            opacity: 0.5,
            rotate: Math.random() * 180
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
            scale: [1, i % 2 === 0 ? 1.2 : 1.1, 1]
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{
            scale: 1.3,
            opacity: 0.7,
            transition: { duration: 0.3 }
          }}
        >
          {/* Subtle shadow beneath */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4/5 h-1/5 bg-black/20 rounded-full blur-sm" />
        </motion.div>
      ))}
      
      {/* Main content */}
      <div className="relative z-50 container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left side: Text content */}
          <motion.div 
            className="w-full md:w-1/2 text-left bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg"
            variants={variants}
            initial="hidden"
            animate={controls}
          >
            <motion.div 
              className="flex mb-6"
              variants={variants}
            >
              <Sun className="text-yellow-500 w-12 h-12" />
            </motion.div>
            
            <motion.h2 
              className="font-space-grotesk text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 uppercase tracking-tight"
              variants={variants}
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                letterSpacing: '0.02em'
              }}
            >
              EASY, FUN, AND FULL OF SUNSHINE
            </motion.h2>
            
            <motion.p 
              className="font-['Manrope'] text-gray-800 text-lg md:text-xl mb-8 max-w-xl leading-relaxed"
              variants={variants}
            >
              Plan your <motion.span
                className="inline-block text-orange-600 font-bold"
                whileHover={{
                  scale: 1.1,
                  color: '#f59e0b',
                  transition: { duration: 0.2 }
                }}
              >perfect beach getaway</motion.span> with our drag-and-drop itinerary planner. 
              Set your schedule, share with friends, and let the sunshine in. <span className="text-2xl">☀️</span>
            </motion.p>
            
            {/* Interactive Tags */}
            <motion.div 
              className="flex flex-wrap gap-3 mb-10"
              variants={variants}
            >
              <motion.div 
                className="bg-teal-500 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 cursor-pointer"
                whileHover={{ 
                  scale: 1.08,
                  y: -5,
                  boxShadow: '0 10px 25px -5px rgba(20, 184, 166, 0.5)'
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }}
              >
                <Calendar className="w-5 h-5" /> <span>Plan Itinerary</span>
              </motion.div>
              
              <motion.div 
                className="bg-amber-500 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 cursor-pointer"
                whileHover={{ 
                  scale: 1.08,
                  y: -5,
                  boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.5)'
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }}
              >
                <Sun className="w-5 h-5" /> <span>Beach Activities</span>
              </motion.div>
              
              <motion.div 
                className="bg-blue-400 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 cursor-pointer"
                whileHover={{ 
                  scale: 1.08,
                  y: -5,
                  boxShadow: '0 10px 25px -5px rgba(96, 165, 250, 0.5)'
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }}
              >
                <Share2 className="w-5 h-5" /> <span>Share Trip</span>
              </motion.div>
            </motion.div>
            
            {/* Enhanced gradient button with magnetic effect */}
            <MagneticButton>
              <motion.button 
                className="relative overflow-hidden bg-gradient-to-r from-yellow-400 to-pink-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg flex items-center gap-3 border border-white/20"
                variants={buttonGradientVariants}
                initial="initial"
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                style={{
                  backgroundSize: "200% 100%",
                  boxShadow: '0 10px 25px -5px rgba(254, 205, 211, 0.5)',
                }}
              >
                Start Planning <ArrowRight className="w-6 h-6" />
                
                {/* Subtle shine effect */}
                <motion.div 
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5,
                    ease: "easeInOut",
                    repeatDelay: 0.5
                  }}
                  style={{ mixBlendMode: "overlay" }}
                />
              </motion.button>
            </MagneticButton>
          </motion.div>
          
          {/* Right side: Itinerary cards */}
          <motion.div 
            className="w-full md:w-1/2 flex flex-col gap-6"
            variants={variants}
            initial="hidden"
            animate={controls}
          >
            {/* Warm glow background effect */}
            <motion.div 
              className="absolute top-1/2 right-1/4 transform -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-radial from-yellow-300/30 to-transparent -z-10"
              animate={{
                opacity: [0.5, 0.7, 0.5],
                scale: [0.95, 1.05, 0.95]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Draggable itinerary cards */}
            {['Morning Beach Yoga', 'Snorkeling Adventure', 'Sunset Dinner'].map((activity, index) => (
              <motion.div
                key={index}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg cursor-move"
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.2}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  backgroundColor: "rgba(255, 255, 255, 0.95)"
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.2 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-teal-800">{activity}</h3>
                  <motion.div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-blue-400' : 'bg-orange-400'
                    }`}
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 10,
                      boxShadow: '0 0 15px rgba(251, 191, 36, 0.5)'
                    }}
                  >
                    {index === 0 ? 
                      <Sun className="w-5 h-5 text-white" /> : 
                      index === 1 ? 
                      <Shell className="w-5 h-5 text-white" /> : 
                      <TreePalm className="w-5 h-5 text-white" />
                    }
                  </motion.div>
                </div>
                
                <div className="flex justify-between text-gray-600 mb-4 text-sm">
                  <span>Duration: 2 hours</span>
                  <span>{index === 0 ? '8:00 AM' : index === 1 ? '11:00 AM' : '6:30 PM'}</span>
                </div>
                
                <motion.div 
                  className="bg-amber-50 p-3 rounded-lg text-sm text-amber-800"
                  whileHover={{
                    backgroundColor: "#fef3c7", // amber-100
                    transition: { duration: 0.2 }
                  }}
                >
                  {index === 0 ? 
                    'Start your day with rejuvenating yoga on the beach.' : 
                    index === 1 ? 
                    'Explore colorful coral reefs and tropical fish.' : 
                    'Enjoy fresh seafood as the sun sets over the ocean.'
                  }
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
