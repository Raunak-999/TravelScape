import { useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Bird, ChevronDown, Cloud, MapPin, Mountain } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import useOptimizedInView from '../../hooks/useOptimizedInView';
import { useMove } from 'react-use-gesture';
import { useMouse } from 'react-use';

// Magnetic button component for hover effects
function MagneticButton({ children }: { children: React.ReactNode }) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { elX, elY, elW, elH } = useMouse(buttonRef);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  
  useEffect(() => {
    if (!buttonRef.current) return;
    
    const moveButton = () => {
      if (!buttonRef.current) return;
      const buttonWidth = buttonRef.current.offsetWidth;
      const buttonHeight = buttonRef.current.offsetHeight;
      
      const xPosition = (elX - buttonWidth / 2) / 5;
      const yPosition = (elY - buttonHeight / 2) / 5;
      
      x.set(xPosition);
      y.set(yPosition);
    };
    
    buttonRef.current.addEventListener('mousemove', moveButton);
    
    return () => {
      buttonRef.current?.removeEventListener('mousemove', moveButton);
    };
  }, [elX, elY, x, y]);
  
  useEffect(() => {
    if (!buttonRef.current) return;
    
    const resetButton = () => {
      x.set(0);
      y.set(0);
    };
    
    buttonRef.current.addEventListener('mouseleave', resetButton);
    
    return () => {
      buttonRef.current?.removeEventListener('mouseleave', resetButton);
    };
  }, [x, y]);
  
  return (
    <motion.div 
      ref={buttonRef}
      style={{ x: xSpring, y: ySpring }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

export default function MountainSection() {
  const controls = useAnimation();
  const { setTheme } = useTheme();
  const [ref, inView] = useOptimizedInView(0.3, false);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
      setTheme('mountains');
    }
  }, [controls, inView, setTheme]);

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

  const cloudVariants = {
    initial: { x: -100, opacity: 0.8 },
    animate: {
      x: 100,
      opacity: 1,
      transition: {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 20,
        ease: "linear"
      }
    }
  };

  // Optimize animation performance with lower values and will-change hints
  const hikerVariants = {
    initial: { x: -50, opacity: 0 },
    animate: {
      x: 500,
      opacity: 1,
      transition: {
        duration: 30,
        ease: "linear"
      }
    }
  };

  // Helper to determine if we should run animations based on view status
  const shouldAnimate = inView;

  return (
    <section 
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-indigo-800 to-slate-900 z-0" />
      
      {/* Parallax Mountains */}
      <div className="absolute inset-0 z-10">
        {/* Background mountains */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-slate-900 rounded-t-[30%] transform translate-y-10 z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-slate-800 rounded-t-[40%] transform translate-y-5 z-20" />
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-slate-700 rounded-t-[50%] z-30" />
        
        {/* Sun/Moon */}
        <motion.div 
          className="absolute top-1/4 right-1/4 w-16 h-16 rounded-full bg-amber-300 shadow-lg shadow-amber-300/50 z-5"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Clouds */}
        <motion.div 
          className="absolute top-1/5 left-0 w-20 h-10 bg-white/80 rounded-full blur-sm z-15"
          variants={cloudVariants}
          initial="initial"
          animate={shouldAnimate ? "animate" : "initial"}
          style={{ willChange: "transform" }}
        />
        <motion.div 
          className="absolute top-1/4 left-1/4 w-32 h-16 bg-white/70 rounded-full blur-sm z-15"
          variants={cloudVariants}
          initial="initial"
          animate={shouldAnimate ? "animate" : "initial"}
          transition={{
            delay: 2,
            duration: 25
          }}
          style={{ willChange: "transform" }}
        />
        
        {/* Hikers */}
        <motion.div
          className="absolute bottom-[25%] left-0 z-40 flex items-end"
          variants={hikerVariants}
          initial="initial"
          animate={shouldAnimate ? "animate" : "initial"}
          style={{ willChange: "transform" }}
        >
          <div className="w-3 h-6 bg-slate-900 rounded-full mr-1" />
          <div className="w-2 h-5 bg-slate-900 rounded-full" />
        </motion.div>
      </div>
      
      {/* Content */}
      <motion.div 
        className="relative z-50 text-center px-4 max-w-3xl"
        variants={variants}
        initial="hidden"
        animate={controls}
      >
        <motion.h1 
          className="font-space-grotesk text-5xl md:text-7xl font-bold text-white mb-6 uppercase tracking-tight"
          variants={variants}
          style={{ 
            textShadow: '0 2px 6px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.2)' 
          }}
        >
          Plan Your Epic Adventure
        </motion.h1>
        
        <motion.p 
          className="font-inter text-white text-xl mb-10 max-w-xl mx-auto font-light"
          variants={variants}
          style={{ 
            textShadow: '0 1px 3px rgba(0,0,0,0.3)' 
          }}
        >
          From mountain peaks to city streets — craft your perfect trip.
        </motion.p>
        
        <MagneticButton>
          <motion.div variants={variants}>
            <motion.button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-full flex items-center gap-2 mx-auto shadow-lg shadow-indigo-600/40 transform transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Scroll to Find Out <ChevronDown className="ml-1 w-5 h-5" />
            </motion.button>
          </motion.div>
        </MagneticButton>
        
        {/* Bouncing scroll indicator */}
        <motion.div 
          className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ChevronDown className="w-8 h-8 text-white/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
