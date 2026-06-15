import React, { useState } from "react";
import { motion } from "motion/react";

const team = [
  { name: "Dharshan", role: "Chief Product Officer (CPO)", image: "/Internship images/Dharshan.png" },
  { name: "Ajay Vikram", role: "AI Research & Innovation Lead", image: "/Internship images/Ajay Vikram.png" },
  { name: "Abishek Raj", role: "Head of Engineering", image: "/Internship images/Abishek Raj.png" },
  { name: "Shashank", role: "Growth & Community Lead", image: "/Internship images/shashank.png" },
  { name: "Nischith Neelamma", role: "Chief Inspiration Officer (CIO)", image: "/Internship images/Nischith_Neelamma.jpeg" },
  { name: "Keshav J", role: "Data Analyst", image: "/Internship images/keshav.jpg" },
  { name: "Nadish Sharma", role: "Full Stack Developer", image: "/Internship images/nadish_sharma.jpg" },
  { name: "Chandhru", role: "Full Stack Developer", image: "/Internship images/Chandru L.png" },
  { name: "Karthik A", role: "Data Analyst", image: "/Internship images/Karthick.jpg" }
];

const skillsLogos = [
  { name: "React", url: "https://cdn.simpleicons.org/react/61DAFB" },
  { name: "Node.js", url: "https://cdn.simpleicons.org/nodedotjs/339933" },
  { name: "Python", url: "https://cdn.simpleicons.org/python/3776AB" },
  { name: "HTML5", url: "https://cdn.simpleicons.org/html5/E34F26" },
  { name: "JavaScript", url: "https://cdn.simpleicons.org/javascript/F7DF1E" },
  { name: "TypeScript", url: "https://cdn.simpleicons.org/typescript/3178C6" },
  { name: "MongoDB", url: "https://cdn.simpleicons.org/mongodb/47A248" },
  { name: "Tailwind CSS", url: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
  { name: "Git", url: "https://cdn.simpleicons.org/git/F05032" },
  { name: "Docker", url: "https://cdn.simpleicons.org/docker/2496ED" },
  { name: "Next.js", url: "https://cdn.simpleicons.org/nextdotjs/000000" },
  { name: "Figma", url: "https://cdn.simpleicons.org/figma/F24E1E" },
];

const BlockReveal = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative inline-block overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.01, delay: 0.4 }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute top-0 bottom-0 bg-black z-10"
        initial={{ left: 0, right: "100%" }}
        whileInView={{
          left: ["0%", "0%", "100%"],
          right: ["100%", "0%", "0%"]
        }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeInOut", times: [0, 0.5, 1] }}
      />
    </div>
  );
};

export default function ExperienceAndRecognized() {
  const [hoveredIdx, setHoveredIdx] = useState<number>(4);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollTimeout = React.useRef<NodeJS.Timeout | null>(null);

  // Center Nischith (index 4) on initial load for mobile
  React.useEffect(() => {
    if (window.innerWidth < 768 && containerRef.current) {
      const container = containerRef.current;
      // Wait for layout to be ready
      requestAnimationFrame(() => {
        const targetChild = container.children[4] as HTMLElement;
        if (targetChild) {
          const containerRect = container.getBoundingClientRect();
          const childRect = targetChild.getBoundingClientRect();
          const scrollPos = container.scrollLeft + (childRect.left - containerRect.left) - (containerRect.width / 2) + (childRect.width / 2);
          container.scrollTo({ left: scrollPos, behavior: "instant" });
        }
      });
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Only run scroll logic on mobile
    if (window.innerWidth >= 768) return;
    
    const container = e.currentTarget;
    
    // Clear previous timeout to debounce the scroll
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Wait 100ms after scroll ends to update the expanded image
    // This prevents layout thrashing and jittering while swiping
    scrollTimeout.current = setTimeout(() => {
      const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIdx = hoveredIdx;
    let minDiff = Infinity;

    // Find the child closest to the center of the scroll container
    Array.from(container.children).forEach((child, idx) => {
      // We only care about the team members (first `team.length` children)
      if (idx >= team.length) return;
      
      const element = child as HTMLElement;
      const rect = element.getBoundingClientRect();
      const childCenter = rect.left + rect.width / 2;
      const diff = Math.abs(childCenter - containerCenter);
      
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    if (closestIdx !== hoveredIdx) {
      setHoveredIdx(closestIdx);
    }
    }, 100);
  };

  return (
    <div className="bg-[#fcfcfc] text-black w-full overflow-hidden">
      {/* Teams We Collab Section */}
      <section className="py-24 max-w-full overflow-hidden flex flex-col items-center group cursor-default">
        <h2 className="text-3xl md:text-5xl px-6 font-sans font-medium text-neutral-400 group-hover:text-[#ff5e2b] transition-colors duration-500 mb-16 text-center tracking-tight">
          <BlockReveal>More Than 100+ Students Got Intern And Trained In</BlockReveal>
        </h2>
        
        {/* Infinite Scrolling Marquee */}
        <div className="w-full overflow-hidden relative">
          {/* Fading Edges for the Marquee */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#fcfcfc] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#fcfcfc] to-transparent z-10 pointer-events-none" />
          
          <div className="flex w-max animate-marquee py-4">
            {/* Render 2 identical sets of logos side-by-side to allow seamless infinite looping */}
            {[...skillsLogos, ...skillsLogos].map((skill, idx) => (
              <div 
                key={idx} 
                className="shrink-0 flex items-center justify-center mx-4 md:mx-6 cursor-default"
              >
                <img
                  src={skill.url}
                  alt={skill.name}
                  className="h-10 md:h-12 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Experience Section */}
      <section className="w-full relative flex flex-col pt-12 pb-24 px-6 md:px-16 lg:px-24">

        {/* Top Left Text Area */}
        <div className="flex flex-col items-start max-w-6xl mx-auto w-full z-10 relative mb-8">
          <h2 className="text-5xl md:text-7xl font-sans font-medium text-black tracking-tight leading-[1.05]">
            <BlockReveal>
              Seen Through <br /> Real Experience
            </BlockReveal>
          </h2>
        </div>

        {/* Expanding Accordion Gallery */}
        <div
          ref={containerRef}
          className="flex justify-start md:justify-center items-end gap-4 md:gap-6 lg:gap-8 w-full h-[460px] px-4 pb-20 pt-10 overflow-x-auto snap-x snap-mandatory relative"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseLeave={() => setHoveredIdx(4)}
          onScroll={handleScroll}
        >
          {team.map((member, idx) => {
            const isHovered = hoveredIdx === idx;

            return (
              <motion.div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onClick={() => setHoveredIdx(idx)}
                className="relative cursor-pointer shrink-0 snap-center snap-always"
                initial={false}
                animate={{
                  width: isHovered ? 260 : 110,
                  height: isHovered ? 340 : 160
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="w-full h-full overflow-hidden bg-neutral-200 shadow-sm relative z-10 rounded-lg md:rounded-none">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Details (Always visible on mobile when active, fade in below on desktop) */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-5 flex flex-col items-center w-max pointer-events-none z-0"
                  initial={false}
                  animate={{ 
                    opacity: isHovered ? 1 : 0, 
                    y: isHovered ? 0 : -10 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-black font-bold text-sm md:text-lg tracking-tight whitespace-nowrap">{member.name}</h4>
                  <p className="text-[#ff5e2b] text-xs md:text-sm font-semibold whitespace-nowrap">{member.role}</p>
                </motion.div>

                {/* 4 Green Dots when active */}
                {isHovered && (
                  <>
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#00ff00] z-20" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#00ff00] z-20" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#00ff00] z-20" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#00ff00] z-20" />
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
