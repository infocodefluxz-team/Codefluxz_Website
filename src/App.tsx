import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import ProductsScroll from "./components/ProductsScroll";
import ExperienceAndRecognized from "./components/ExperienceAndRecognized";
import Founders from "./components/Founders";
import Footer from "./components/Footer";
import { useSmoothScroll } from "./components/SmoothScrollProvider";
import Preloader from "./components/Preloader";

function CustomCursor() {
  const cursorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        
        const target = e.target as HTMLElement;
        const footer = document.getElementById("footer-section");
        let isHoveringFooter = false;
        
        if (target && footer && (footer === target || footer.contains(target))) {
            isHoveringFooter = true;
        }

        if (isHoveringFooter) {
            cursorRef.current.style.backgroundColor = 'black';
            cursorRef.current.style.borderRadius = '2px';
        } else {
            cursorRef.current.style.backgroundColor = '#ff5533';
            cursorRef.current.style.borderRadius = '2px';
        }
      }
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-3 h-3 bg-[#ff5533] pointer-events-none z-[9999] rounded-[2px]"
      style={{
        transform: "translate3d(-100px, -100px, 0)",
        marginLeft: "-6px",
        marginTop: "-6px",
        willChange: "transform"
      }}
    />
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Activate Lenis physics-based smooth scroll + GSAP ScrollTrigger bridge
  useSmoothScroll();

  return (
    <div className="bg-[#111111] text-white relative min-h-screen selection:bg-[#ff5533] selection:text-white cursor-none">
      <CustomCursor />
      
      {/* Cinematic Preloader Sequence */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <>
          {/* Navbar overlay */}
          <Navbar />

          {/* Hero Laptop Scroll Trigger Animation */}
          <Hero />

          {/* Content wrapper with cascading smooth slide animations */}
          <main className="relative z-10">
            
            {/* Features Content (Section 2) */}
            <motion.div
              id="features"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Features />
            </motion.div>

            {/* Unified 3-Product Scroll Sequence (Enimi AI, Potaketch, Famtree) */}
            <div id="enimi-about">
              <ProductsScroll />
            </div>

            {/* New Experience and Recognized Section (Replaces HowItWorks & SocialProof) */}
            <motion.div
              id="experience-recognized"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <ExperienceAndRecognized />
            </motion.div>

            {/* Founders Section (Replaces Early Access) */}
            <motion.div
              id="founders"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Founders />
            </motion.div>

          </main>

          {/* Highly visible Orange Footer */}
          <Footer />
        </>
      )}
    </div>
  );
}
