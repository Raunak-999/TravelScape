import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Building2, ChevronDown, Cloud, MapPin, Mountain, Sun, TreePalm } from 'lucide-react';

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
  const glowRadius = useMotionValue(15);
  const glowOpacitySpring = useSpring(glowOpacity, { damping: 15, stiffness: 150 });
  
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
        
        // Calculate glow opacity based on proximity to center
        const normalizedDistance = Math.min(1, distance / 120);
        glowOpacity.set(0.7 - normalizedDistance * 0.3);
        glowRadius.set(25 - normalizedDistance * 10);
      } else {
        mouseX.set(0);
        mouseY.set(0);
        glowOpacity.set(0.3); // Maintain a subtle glow at rest
      }
    };
    
    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
      glowOpacity.set(0.3); // Subtle glow at rest
    };
    
    const handleMouseEnter = () => {
      glowOpacity.set(0.5); // Slightly enhance glow on hover
    };
    
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, glowOpacity, glowRadius]);
  
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
            [glowOpacitySpring, glowRadius],
            ([opacity, radius]) => `0 0 ${radius}px rgba(99, 102, 241, ${opacity})`
          ),
          opacity: glowOpacitySpring
        }}
      />
      {children}
    </motion.div>
  );
}

export default function Header() {
  const { currentTheme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <>
      {/* Fixed Navigation Header with improved blur and transparency */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 transition-all duration-500 ${
          scrolled ? 'bg-black/20 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <MapPin className="w-6 h-6 text-indigo-500" />
            <span className="font-dm-serif text-2xl font-bold text-white" 
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              TravelScape
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-6">
            <ThemeToggle currentTheme={currentTheme} setTheme={setTheme} />
          </div>
        </div>
      </motion.header>
    </>
  );
}

interface ThemeToggleProps {
  currentTheme: string;
  setTheme: (theme: any) => void;
}

function ThemeToggle({ currentTheme, setTheme }: ThemeToggleProps) {
  const handleNavigation = (theme: string) => {
    setTheme(theme as any);
    
    // Use the global scrollToSection function
    if (window.scrollToSection) {
      window.scrollToSection(theme);
    } else {
      // Fallback method: direct scrolling to section by ID
      const sectionId = `${theme}-section`;
      const element = document.getElementById(sectionId);
      if (element) {
        // Try standard scrollIntoView
        element.scrollIntoView({ behavior: 'smooth' });
        
        // Additional fallback using window.scroll as last resort
        const offsetTop = element.getBoundingClientRect().top + window.pageYOffset;
        window.scroll({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className="flex bg-white/20 backdrop-blur-md rounded-full p-1 shadow-lg">
      <button
        className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          currentTheme === 'mountains'
            ? 'bg-indigo-600 text-white'
            : 'text-white/80 hover:text-white'
        }`}
        onClick={() => handleNavigation('mountains')}
      >
        <Mountain className="w-4 h-4" />
        <span className="hidden sm:inline">Mountains</span>
      </button>
      <button
        className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          currentTheme === 'beaches'
            ? 'bg-sky-500 text-white'
            : 'text-white/80 hover:text-white'
        }`}
        onClick={() => handleNavigation('beaches')}
      >
        <TreePalm className="w-4 h-4" />
        <span className="hidden sm:inline">Beaches</span>
      </button>
      <button
        className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          currentTheme === 'cities'
            ? 'bg-gray-800 text-white'
            : 'text-white/80 hover:text-white'
        }`}
        onClick={() => handleNavigation('cities')}
      >
        <Building2 className="w-4 h-4" />
        <span className="hidden sm:inline">Cities</span>
      </button>
    </div>
  );
}
