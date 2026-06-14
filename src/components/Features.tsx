import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from "motion/react";

const cardsData = [
  {
    id: "verification",
    title: "Forensic Content Authenticity",
    desc: "Analyze documents, images, and video assets using deep-tech forensic models to detect AI generation, deepfakes, and structural manipulation instantly."
  },
  {
    id: "marketplace",
    title: "Credit-Backed Project Pipeline",
    desc: "Connect active startups with vetted talent through an algorithmic, fair-play bidding window that prevents application spam and rewards capability."
  },
  {
    id: "preservation",
    title: "Secure Multi-Generational Archiving",
    desc: "Safeguard ancestral legacies and map complex relational dynamics using high-security cryptographic storage and interactive family timeline tracking."
  },
  {
    id: "innovation",
    title: "Next-Generation Solutions",
    desc: "More than just individual tools—Code Fluxz is a comprehensive digital engine combining AI forensics, talent marketplaces, and heritage mapping under one roof."
  }
];

function BlockReveal({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <div className="relative overflow-hidden w-fit inline-block">
      <motion.div
        initial={{ x: "-100%" }}
        whileInView={{ x: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
        className="absolute inset-0 z-20 bg-white"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.1, delay: delay + 0.3 }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}

function GreenDotsSequence({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Center to corner offset for a 320x224 (w-80 h-56) box
  const xOffset = 160;
  const yOffset = 112;

  // Move to center 0.65 -> 0.75
  // Spin 0.75 -> 0.85
  // Shoot out 0.85 -> 0.92
  const tlX = useTransform(scrollYProgress, [0.65, 0.75, 0.85, 0.92], [-xOffset, -15, -15, -2000]);
  const tlY = useTransform(scrollYProgress, [0.65, 0.75, 0.85, 0.92], [-yOffset, -15, -15, -2000]);

  const trX = useTransform(scrollYProgress, [0.65, 0.75, 0.85, 0.92], [xOffset, 15, 15, 2000]);
  const trY = useTransform(scrollYProgress, [0.65, 0.75, 0.85, 0.92], [-yOffset, -15, -15, -2000]);

  const blX = useTransform(scrollYProgress, [0.65, 0.75, 0.85, 0.92], [-xOffset, -15, -15, -2000]);
  const blY = useTransform(scrollYProgress, [0.65, 0.75, 0.85, 0.92], [yOffset, 15, 15, 2000]);

  const brX = useTransform(scrollYProgress, [0.65, 0.75, 0.85, 0.92], [xOffset, 15, 15, 2000]);
  const brY = useTransform(scrollYProgress, [0.65, 0.75, 0.85, 0.92], [yOffset, 15, 15, 2000]);

  const rotate = useTransform(scrollYProgress, [0.75, 0.85], [0, 180]);
  
  // Fade out slightly before max explosion
  const opacity = useTransform(scrollYProgress, [0.91, 0.92], [1, 0]);

  return (
    <motion.div style={{ rotate, opacity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 z-40 pointer-events-none">
      <motion.div style={{ x: tlX, y: tlY }} className="absolute w-2.5 h-2.5 bg-[#00ff00] -translate-x-1/2 -translate-y-1/2" />
      <motion.div style={{ x: trX, y: trY }} className="absolute w-2.5 h-2.5 bg-[#00ff00] -translate-x-1/2 -translate-y-1/2" />
      <motion.div style={{ x: blX, y: blY }} className="absolute w-2.5 h-2.5 bg-[#00ff00] -translate-x-1/2 -translate-y-1/2" />
      <motion.div style={{ x: brX, y: brY }} className="absolute w-2.5 h-2.5 bg-[#00ff00] -translate-x-1/2 -translate-y-1/2" />
    </motion.div>
  );
}

const StackedCard: React.FC<{ idx: number, card: any, scrollYProgress: MotionValue<number> }> = ({ idx, card, scrollYProgress }) => {
  const start = idx * 0.15;
  const inEnd = start + 0.03;
  const outStart = start + 0.12;
  const end = start + 0.15;

  const inStart = Math.max(0, start - 0.05);
  const opStart = Math.max(0, start - 0.02);

  const isLast = idx === 3;

  const x = useTransform(
    scrollYProgress,
    [inStart, inEnd, outStart, end],
    [idx === 0 ? "0vw" : "30vw", "0vw", "0vw", "0vw"]
  );

  const opacity = useTransform(
    scrollYProgress,
    [opStart, inEnd, outStart, end],
    [idx === 0 ? 1 : 0, 1, 1, isLast ? 1 : 0]
  );
  
  const scale = useTransform(
    scrollYProgress,
    [outStart, end],
    [1, isLast ? 1 : 0.95]
  );
  
  const filter = useTransform(
    scrollYProgress,
    [outStart, end],
    ["blur(0px)", isLast ? "blur(0px)" : "blur(4px)"]
  );

  return (
    <motion.div 
      style={{ x, opacity, scale, filter, willChange: 'filter, transform, opacity' }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-56 flex flex-col justify-center z-30"
    >
      <div className="absolute inset-0 bg-[#1a1a1a] border border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-sm" />
      <div className="relative z-10 p-8">
        <h3 className="text-xl font-medium text-white mb-3 tracking-tight">{card.title}</h3>
        <p className="text-xs text-neutral-400 leading-relaxed">{card.desc}</p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [showCards, setShowCards] = useState(true);
  const [showTitle, setShowTitle] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const activeIndexRaw = useTransform(scrollYProgress, [0, 0.15, 0.3, 0.45, 0.6], [0, 1, 2, 3, 3]);
  useMotionValueEvent(activeIndexRaw, "change", (latest) => {
    setActiveIdx(Math.floor(latest));
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Physically unmount elements after their opacity fades to 0 to guarantee no overlaps or lingering
    setShowCards(latest < 0.66);
    setShowTitle(latest < 0.91);
  });

  const paginationX = useTransform(scrollYProgress, [0, 0.6], ["0px", "-160px"]);

  // Cards fade out 0.6 to 0.65
  const cardsOpacity = useTransform(scrollYProgress, [0, 0.6, 0.65, 1], [1, 1, 0, 0]);

  // Title fades out 0.85 to 0.9
  const titleOpacity = useTransform(scrollYProgress, [0, 0.85, 0.9, 1], [1, 1, 0, 0]);

  // White circle expands 0.9 to 1.0
  const whiteCircleScale = useTransform(scrollYProgress, [0, 0.9, 1], [0, 0, 50]);
  const whiteCircleOpacity = useTransform(scrollYProgress, [0, 0.89, 0.9, 1], [0, 0, 1, 1]);

  // Section background solidifies to white 0.9 to 1.0
  const sectionBg = useTransform(scrollYProgress, [0, 0.9, 1], ["#111111", "#111111", "#ffffff"]);

  return (
    <motion.section ref={containerRef} style={{ backgroundColor: sectionBg }} className="h-[450vh] w-full relative overflow-clip">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        
        {/* The Expanding White Screen Transition (Now behind the mix-blend text) */}
        <motion.div 
          style={{ 
            scale: whiteCircleScale, 
            opacity: whiteCircleOpacity 
          }} 
          className="absolute top-1/2 left-1/2 w-[5vw] h-[5vw] bg-white rounded-full -translate-x-1/2 -translate-y-1/2 z-[5] origin-center pointer-events-none"
        />

        {/* Main Content Layout */}
        <div className="w-full h-full relative z-10">
          
          {/* Left Text */}
          <div className="absolute top-[10vh] md:top-[15vh] left-[5vw] md:left-[8vw] z-[110] pointer-events-none mix-blend-difference text-white">
            <motion.div style={{ opacity: titleOpacity }}>
              <BlockReveal delay={0.2}>
                <h2 className="text-5xl md:text-7xl font-sans font-medium leading-[1.1] tracking-tight">
                  Welcome to <br /> Codefluxz
                </h2>
              </BlockReveal>
            </motion.div>
            
            {showCards && (
              <motion.div style={{ opacity: cardsOpacity }} className="mt-6">
                <BlockReveal delay={0.4}>
                  <h3 className="text-xl md:text-3xl text-neutral-400 font-light">
                    Our features
                  </h3>
                </BlockReveal>
              </motion.div>
            )}
          </div>

          {/* Dead-Centered Stack */}
          <div className="absolute inset-0 w-full h-full flex flex-col justify-center items-center pointer-events-none">
            <div className="relative w-80 h-56 z-30 pointer-events-auto">
              {/* The Stationary Green Dots Frame */}
              <GreenDotsSequence scrollYProgress={scrollYProgress} />
              
              {/* The Cards Stack */}
              {showCards && (
                <motion.div style={{ opacity: cardsOpacity }} className="relative w-full h-full">
                  {cardsData.map((card, idx) => (
                    <StackedCard 
                      key={card.id} 
                      idx={idx} 
                      card={card} 
                      scrollYProgress={scrollYProgress} 
                    />
                  ))}
                </motion.div>
              )}
            </div>

            {/* Pagination Slider Track */}
            {showCards && (
              <motion.div style={{ opacity: cardsOpacity }} className="absolute bottom-[15%] md:bottom-[20%] left-1/2 w-80 -translate-x-1/2 overflow-hidden z-20 pointer-events-auto">
                 <div className="w-full h-[1px] bg-white/10 absolute top-1/2 -translate-y-1/2" />
                 <motion.div style={{ x: paginationX }} className="flex gap-12 relative px-4">
                   {[1, 2, 3, 4].map((num, i) => (
                     <div 
                       key={num} 
                       className={`w-8 h-6 md:w-10 md:h-7 shrink-0 flex items-center justify-center text-[10px] md:text-xs font-mono font-medium rounded-[1px] transition-colors duration-300 relative z-10 ${
                         activeIdx === i ? 'bg-[#00ff00] text-black' : 'bg-[#111] text-white border border-white/10'
                       }`}
                     >
                       {num}
                     </div>
                   ))}
                 </motion.div>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </motion.section>
  );
}

