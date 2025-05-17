import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { ArrowRight, Building2, Coffee, Compass, Landmark, MapPin, Moon, Music, Star, Utensils } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import useOptimizedInView from '../../hooks/useOptimizedInView';

// Card component with 3D flip animation
function FlipCard({ 
  icon: Icon, 
  title, 
  subtitle, 
  description, 
  color 
}: { 
  icon: any, 
  title: string, 
  subtitle: string, 
  description: string,
  color: string
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  // Handle keyboard accessibility
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsFlipped(!isFlipped);
      }
    };

    card.addEventListener('keydown', handleKeyDown);
    return () => {
      card.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFlipped]);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  // For reduced motion preference, use fade instead of flip
  const cardVariants = prefersReducedMotion.current 
    ? {
      front: { opacity: isFlipped ? 0 : 1, zIndex: isFlipped ? 0 : 1 },
      back: { opacity: isFlipped ? 1 : 0, zIndex: isFlipped ? 1 : 0 }
    }
    : {
      front: { 
        rotateY: isFlipped ? 180 : 0,
        opacity: isFlipped ? 0 : 1,
        zIndex: isFlipped ? 0 : 1,
        transition: { 
          duration: 0.6, 
          ease: "easeOut" 
        }
      },
      back: { 
        rotateY: isFlipped ? 0 : -180,
        opacity: isFlipped ? 1 : 0,
        zIndex: isFlipped ? 1 : 0,
        transition: { 
          duration: 0.6, 
          ease: "easeOut" 
        }
      }
    };

  return (
    <div 
      ref={cardRef}
      className="relative w-full aspect-[3/4] max-w-xs mx-auto cursor-pointer"
      onClick={handleClick}
      onMouseEnter={() => !prefersReducedMotion.current && setIsFlipped(true)}
      onMouseLeave={() => !prefersReducedMotion.current && setIsFlipped(false)}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      tabIndex={0}
      role="button"
      aria-pressed={isFlipped}
      aria-label={`Card for ${title}, press enter to flip`}
      style={{ perspective: '1500px' }}
    >
      {/* Front of card */}
      <motion.div 
        className={`absolute inset-0 flex flex-col items-center justify-between p-8 rounded-xl 
                   bg-gray-800/90 backdrop-blur-sm border border-${color}-500/40 text-center
                   transform-gpu preserve-3d backface-hidden`}
        initial="front"
        animate="front"
        variants={cardVariants}
        style={{ 
          boxShadow: `0 0 30px rgba(${color === 'pink' ? '236, 72, 153' : color === 'cyan' ? '6, 182, 212' : '139, 92, 246'}, 0.15)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <motion.div 
          className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 overflow-hidden`}
          whileHover={{ 
            scale: 1.1,
            boxShadow: `0 0 25px rgba(${color === 'pink' ? '236, 72, 153' : color === 'cyan' ? '6, 182, 212' : '139, 92, 246'}, 0.6)`
          }}
          style={{
            background: color === 'pink' 
              ? 'linear-gradient(45deg, #ec4899 0%, #db2777 100%)' 
              : color === 'cyan' 
              ? 'linear-gradient(45deg, #06b6d4 0%, #0891b2 100%)' 
              : 'linear-gradient(45deg, #8b5cf6 0%, #7c3aed 100%)',
            boxShadow: `0 10px 20px rgba(${color === 'pink' ? '236, 72, 153' : color === 'cyan' ? '6, 182, 212' : '139, 92, 246'}, 0.3)`
          }}
        >
          <motion.div
            animate={{ rotateZ: [0, 5, 0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <Icon className="w-10 h-10 text-white drop-shadow-lg" />
          </motion.div>
        </motion.div>
        
        <div>
          <h3 className={`font-bold text-2xl mb-2 text-${color === 'pink' ? 'pink-300' : color === 'cyan' ? 'cyan-300' : 'violet-300'}`}
             style={{ 
               textShadow: `0 0 10px rgba(${color === 'pink' ? '236, 72, 153' : color === 'cyan' ? '6, 182, 212' : '139, 92, 246'}, 0.5)` 
             }}
          >{title}</h3>
          <p className="text-gray-300 text-sm mb-6">{subtitle}</p>
          
          <motion.button 
            className={`py-2 px-4 rounded-full bg-${color}-500/30 text-${color}-300 text-sm flex items-center justify-center gap-1 mx-auto border border-${color}-500/50 group`}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: `rgba(${color === 'pink' ? '236, 72, 153' : color === 'cyan' ? '6, 182, 212' : '139, 92, 246'}, 0.4)`
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: `0 5px 15px rgba(${color === 'pink' ? '236, 72, 153' : color === 'cyan' ? '6, 182, 212' : '139, 92, 246'}, 0.2)`
            }}
          >
            <span>View Details</span> <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>
      
      {/* Back of card */}
      <motion.div 
        className={`absolute inset-0 flex flex-col items-center justify-between p-8 rounded-xl 
                   bg-gray-800/90 backdrop-blur-sm border border-${color}-500/40 text-center
                   transform-gpu preserve-3d backface-hidden`}
        initial="back"
        animate="back"
        variants={cardVariants}
        style={{ 
          boxShadow: `0 0 30px rgba(${color === 'pink' ? '236, 72, 153' : color === 'cyan' ? '6, 182, 212' : '139, 92, 246'}, 0.15)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <p className="text-white/90 text-sm leading-relaxed">
          {description}
        </p>
        
        <motion.button 
          className={`py-2 px-6 rounded-full bg-gradient-to-r ${
            color === 'pink' 
              ? 'from-pink-500 to-pink-600' 
              : color === 'cyan' 
              ? 'from-cyan-500 to-cyan-600' 
              : 'from-violet-500 to-violet-600'
          } text-white text-sm flex items-center gap-2 mt-6 font-medium`}
          whileHover={{ 
            scale: 1.05,
            boxShadow: `0 0 20px rgba(${color === 'pink' ? '236, 72, 153' : color === 'cyan' ? '6, 182, 212' : '139, 92, 246'}, 0.7)`
          }}
          whileTap={{ scale: 0.95 }}
        >
          Explore <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
}

// Magnetic Button with Neon Glow
function NeonButton({ children }: { children: React.ReactNode }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || prefersReducedMotion.current) return;

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
        const maxMove = 12;
        const moveX = ((x - centerX) / centerX) * maxMove;
        const moveY = ((y - centerY) / centerY) * maxMove;
        
        button.style.transform = `translate(${moveX}px, ${moveY}px)`;
        button.style.boxShadow = '0 0 30px rgba(6, 182, 212, 0.9), 0 0 60px rgba(6, 182, 212, 0.5)';
      } else {
        button.style.transform = 'translate(0, 0)';
        button.style.boxShadow = '0 0 25px rgba(6, 182, 212, 0.6)';
      }
    };
    
    const handleMouseLeave = () => {
      button.style.transform = 'translate(0, 0)';
      button.style.boxShadow = '0 0 25px rgba(6, 182, 212, 0.6)';
    };
    
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <motion.button 
      ref={buttonRef}
      className="relative bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold py-5 px-12 rounded-full flex items-center gap-3 mx-auto text-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      style={{ 
        boxShadow: '0 0 25px rgba(6, 182, 212, 0.6)',
        transition: 'all 0.3s ease-out',
        willChange: 'transform' 
      }}
    >
      {children}
      
      {/* Animated neon glow effect */}
      <motion.span 
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            '0 0 25px rgba(6, 182, 212, 0.6), 0 0 50px rgba(6, 182, 212, 0.3)',
            '0 0 35px rgba(6, 182, 212, 0.8), 0 0 70px rgba(6, 182, 212, 0.4)',
            '0 0 25px rgba(6, 182, 212, 0.6), 0 0 50px rgba(6, 182, 212, 0.3)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Inner glow/shine effect */}
      <motion.span 
        className="absolute inset-0 overflow-hidden rounded-full"
        aria-hidden="true"
      >
        <motion.span 
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" 
          animate={{ x: ['-100%', '100%'] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            repeatDelay: 1,
            ease: "easeInOut" 
          }}
          style={{ mixBlendMode: 'overlay' }}
        />
      </motion.span>
    </motion.button>
  );
}

export default function CitySection() {
  const controls = useAnimation();
  const { setTheme } = useTheme();
  const [ref, inView] = useOptimizedInView(0.3, false) as [any, boolean];
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  useEffect(() => {
    if (inView) {
      controls.start('visible');
      setTheme('cities');
    }
  }, [controls, inView, setTheme]);

  // Load fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Montserrat:wght@300;400;600;700&display=swap';
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

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buildingVariants = {
    hidden: { opacity: 0, scaleY: 0, y: '100%' },
    visible: (i: number) => ({
      opacity: 1,
      scaleY: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  const carVariants = {
    initial: { x: -100 },
    animate: {
      x: '110vw',
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  // Generate random buildings for the cityscape
  const buildings = Array.from({ length: 24 }).map((_, i) => {
    const width = 15 + Math.random() * 30;
    const height = 100 + Math.random() * 200;
    
    return {
      id: i,
      width,
      height,
      color: i % 3 === 0 ? '#1f2937' : i % 3 === 1 ? '#111827' : '#0f172a',
      windows: Math.floor(height / 20),
      delay: i * 0.1
    };
  });

  // Data for flip cards
  const cardData = [
    {
      icon: Music,
      title: "Live Music",
      subtitle: "Discover local DJs and bands",
      description: "Find the hottest clubs and music venues in the heart of the city with personalized recommendations based on your taste.",
      color: "pink"
    },
    {
      icon: Utensils,
      title: "Fine Dining",
      subtitle: "Experience culinary excellence",
      description: "Explore gourmet restaurants with special late-night menus, rooftop views, and exclusive chef's table experiences.",
      color: "cyan"
    },
    {
      icon: Moon,
      title: "Rooftop Bars",
      subtitle: "Drinks with a view",
      description: "Enjoy craft cocktails and breathtaking skyline views from the city's most exclusive rooftop lounges and bars.",
      color: "violet"
    }
  ];

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-24"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Background gradient - deep navy with neon undertones */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-indigo-950 to-slate-900 z-0" />
      
      {/* Stars in the night sky with twinkling effect */}
      <div className="absolute inset-0 z-10">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div 
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 70}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() > 0.9 ? 2 : 1}px`,
              height: `${Math.random() > 0.9 ? 2 : 1}px`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, Math.random() > 0.7 ? 1.5 : 1.2, 1]
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
      
      {/* Moon with subtle glow */}
      <motion.div 
        className="absolute top-20 right-20 w-16 h-16 rounded-full bg-gray-100 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          boxShadow: '0 0 30px rgba(255, 255, 255, 0.4), 0 0 80px rgba(255, 255, 255, 0.2)'
        }}
      />
      
      {/* Building silhouettes with animated rise and blinking windows */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center items-end">
        {buildings.map((building, i) => (
          <motion.div 
            key={i}
            custom={i}
            variants={buildingVariants}
            initial="hidden"
            animate={controls}
            className="relative mx-[1px]"
            style={{
              width: building.width,
              height: building.height,
              backgroundColor: building.color,
              transformOrigin: 'bottom',
              willChange: !prefersReducedMotion.current ? 'transform, opacity' : 'auto'
            }}
          >
            {/* Windows that blink randomly */}
            {Array.from({ length: building.windows }).map((_, j) => (
              <div key={j} className="flex justify-center mt-4">
                {Array.from({ length: Math.floor(building.width / 8) }).map((_, k) => (
                  <motion.div 
                    key={k}
                    className="w-2 h-3 mx-1 rounded-sm"
                    style={{
                      backgroundColor: Math.random() > 0.6 ? 
                        Math.random() > 0.7 ? '#ec4899' : 
                        Math.random() > 0.5 ? '#06b6d4' : '#f59e0b' : 
                        'rgba(203, 213, 225, 0.2)'
                    }}
                    animate={!prefersReducedMotion.current ? {
                      opacity: Math.random() > 0.7 ? [0.7, 1, 0.7] : 1,
                      backgroundColor: Math.random() > 0.9 ? [
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(6, 182, 212, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(236, 72, 153, 0.8)'
                      ] : undefined
                    } : {}}
                    transition={{
                      duration: 2 + Math.random() * 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
      
      {/* Moving cars with headlights */}
      {!prefersReducedMotion.current && (
        <>
          <motion.div
            className="absolute bottom-10 left-0 z-30 flex items-center"
            variants={carVariants}
            initial="initial"
            animate="animate"
          >
            <div className="w-8 h-3 bg-indigo-600 rounded-sm relative">
              <div className="w-4 h-2 bg-yellow-100/70 absolute top-0 right-0 rounded-sm" />
              <div className="w-16 h-1 bg-yellow-300/30 absolute top-1 right-0 rounded-full blur-sm" />
            </div>
          </motion.div>
          
          <motion.div
            className="absolute bottom-16 left-0 z-30 flex items-center"
            variants={carVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 2, duration: 15 }}
          >
            <div className="w-10 h-4 bg-pink-600 rounded-sm relative">
              <div className="w-5 h-2 bg-yellow-100/70 absolute top-0 right-0 rounded-sm" />
              <div className="w-20 h-1 bg-yellow-300/30 absolute top-1 right-0 rounded-full blur-sm" />
            </div>
          </motion.div>
          
          <motion.div
            className="absolute bottom-22 left-0 z-30 flex items-center"
            variants={carVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 5, duration: 8 }}
          >
            <div className="w-6 h-3 bg-cyan-600 rounded-sm relative">
              <div className="w-3 h-1.5 bg-yellow-100/70 absolute top-0 right-0 rounded-sm" />
              <div className="w-12 h-1 bg-yellow-300/30 absolute top-1 right-0 rounded-full blur-sm" />
            </div>
          </motion.div>
        </>
      )}
      
      {/* Neon signs */}
      <motion.div
        className="absolute top-[15%] left-[10%] transform -rotate-12 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <div className="text-pink-500 text-2xl font-bold px-4 py-2 border-2 border-pink-500 rounded"
             style={{ 
               textShadow: '0 0 10px #ec4899, 0 0 20px #ec4899', 
               boxShadow: '0 0 10px #ec4899, 0 0 20px #ec4899', 
               fontFamily: 'Orbitron, sans-serif'
             }}>
          OPEN 24/7
        </div>
      </motion.div>
      
      <motion.div
        className="absolute top-[16%] right-[10%] transform rotate-6 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <div className="text-cyan-400 text-xl font-bold px-4 py-2 border-2 border-cyan-400 rounded"
             style={{ 
               textShadow: '0 0 10px #22d3ee, 0 0 20px #22d3ee', 
               boxShadow: '0 0 10px #22d3ee, 0 0 20px #22d3ee',
               fontFamily: 'Orbitron, sans-serif'
             }}>
          NIGHTLIFE
        </div>
      </motion.div>
      
      {/* Main content */}
      <motion.div 
        className="relative z-40 px-6 md:px-12 py-16 max-w-7xl mx-auto"
        variants={variants}
        initial="hidden"
        animate={controls}
      >
        <motion.div 
          variants={textVariants}
          className="text-center mb-20"
        >
          <div className="bg-gray-900/50 backdrop-blur-md py-12 px-8 rounded-2xl mx-auto max-w-4xl mb-8">
            <motion.h2 
              className="font-bold text-4xl md:text-6xl lg:text-7xl mb-10 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text uppercase"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                textShadow: '0 0 15px rgba(6, 182, 212, 0.5)',
                letterSpacing: '0.05em'
              }}
            >
              Explore The City After Dark
            </motion.h2>
            
            <motion.p 
              className="text-gray-200 text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}
            >
              Immerse yourself in the vibrant nightlife of the city with our curated experiences
            </motion.p>
          </div>
        </motion.div>
        
        {/* 3D Flip Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20"
          variants={variants}
        >
          {cardData.map((card, index) => (
            <motion.div
              key={index}
              variants={variants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <FlipCard 
                icon={card.icon}
                title={card.title}
                subtitle={card.subtitle}
                description={card.description}
                color={card.color}
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* CTA Button with enhanced neon effect */}
        <motion.div className="flex justify-center mt-16" variants={variants}>
          <NeonButton>
            Discover Nightlife <ArrowRight className="ml-1 w-6 h-6" />
          </NeonButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
