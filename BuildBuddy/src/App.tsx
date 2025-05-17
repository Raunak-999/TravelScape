import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import Header from './components/Header';
import BeachSection from './components/sections/BeachSection';
import CitySection from './components/sections/CitySection';
import CTASection from './components/sections/CTASection';
import MountainSection from './components/sections/MountainSection';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import './index.css';

// Extend Window interface to include our custom scrollToSection function
declare global {
  interface Window {
    scrollToSection?: (section: string) => void;
  }
}

export default function App() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const mountainSectionRef = useRef<HTMLDivElement>(null);
  const beachSectionRef = useRef<HTMLDivElement>(null);
  const citySectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize smooth scrolling
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    // Use RAF with timestamp for better performance
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);
    
    // Add ResizeObserver to handle layout changes gracefully
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    
    if (scrollRef.current) {
      resizeObserver.observe(scrollRef.current);
    }

    // Function to scroll to sections
    window.scrollToSection = (section: string) => {
      // Use setTimeout to ensure the DOM is fully rendered
      setTimeout(() => {
        if (section === 'mountains' && mountainSectionRef.current) {
          // Get the element position and scroll with offset
          const mountainElement = mountainSectionRef.current;
          const offset = mountainElement.getBoundingClientRect().top + window.scrollY;
          lenis.scrollTo(offset, { offset: 0 });
        } else if (section === 'beaches' && beachSectionRef.current) {
          // Get the element position and scroll with offset
          const beachElement = beachSectionRef.current;
          const offset = beachElement.getBoundingClientRect().top + window.scrollY;
          lenis.scrollTo(offset, { offset: 0 });
        } else if (section === 'cities' && citySectionRef.current) {
          // Get the element position and scroll with offset
          const cityElement = citySectionRef.current;
          const offset = cityElement.getBoundingClientRect().top + window.scrollY;
          lenis.scrollTo(offset, { offset: 0 });
        }
      }, 100); // Short delay to ensure layout calculations are complete
    };

    return () => {
      // Properly clean up the animation frame to prevent memory leaks
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.scrollToSection = undefined;
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative overflow-hidden font-inter" ref={scrollRef}>
      {/* Fixed Navigation Button */}
      <div className="fixed top-6 right-6 z-50">
        <Link to="/planner">
          <motion.button
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-all border border-white/10 backdrop-blur-sm"
            whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Calendar className="w-5 h-5" />
            <span>Open Planner</span>
          </motion.button>
        </Link>
      </div>

      <div ref={mountainSectionRef} id="mountains-section">
        <MountainSection />
      </div>
      <Header />
      <main className="relative">
        <AnimatePresence>
          <div className="relative scroll-smooth">
            <div ref={beachSectionRef} id="beaches-section">
              <BeachSection />
            </div>
            <div ref={citySectionRef} id="cities-section">
              <CitySection />
            </div>
            <CTASection />
          </div>
        </AnimatePresence>
      </main>
    </div>
  );
}
