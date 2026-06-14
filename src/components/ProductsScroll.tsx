import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

interface ProductDemoProps {
  productName?: string;
  productIndex?: string;
  wireframes?: string[];
  finalLogo?: string;
  finalLogoHover?: string;
  headings?: { line1: string; line2: string; line3?: string }[];
  pinTexts?: string[];
  finalDesc?: string;
  hoverImageTransform?: string;
}

export function ProductScrollSection({ 
  productName = "ENIMI AI", 
  productIndex = "01",
  wireframes = [
    '/Enimi_Images/01.png',
    '/Enimi_Images/04.png',
    '/Enimi_Images/08.png',
    '/Enimi_Images/12.png',
  ],
  finalLogo = '/Enimi_Images/logo2.jpeg',
  finalLogoHover = '/Enimi_Images/logo1.png',
  headings,
  pinTexts,
  finalDesc,
  hoverImageTransform
}: ProductDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pinRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const finalLogoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=5000",
          scrub: 1,
          pin: true,
        }
      });

      tl.fromTo(progressLineRef.current, 
        { height: "0%" }, 
        { height: "100%", ease: "none", duration: 5 }, 
      0);

      const phases = 5;
      
      for (let i = 0; i < phases; i++) {
        const startTime = i;
        const endTime = startTime + 0.85;
        
        const textFadeInStart = startTime + 0.2;
        const fadeOutStart = endTime - 0.2;

        if (i < 4) {
          tl.fromTo(imgRefs.current[i],
            { autoAlpha: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 0.95 },
            { autoAlpha: 1, scale: 1, duration: 0.2 },
            startTime
          );
          tl.to(imgRefs.current[i],
            { autoAlpha: 0, scale: 1.05, duration: 0.2 },
            fadeOutStart
          );
        } else {
          tl.fromTo(finalLogoRef.current,
            { autoAlpha: 0, scale: 0.95 },
            { autoAlpha: 1, scale: 1, duration: 0.2 },
            startTime
          );
        }

        // Cinematic sliding and scaling entry for left text
        tl.fromTo(textRefs.current[i], 
          { autoAlpha: i === 0 ? 1 : 0, x: i === 0 ? 0 : -40, scale: i === 0 ? 1 : 0.95 }, 
          { autoAlpha: 1, x: 0, scale: 1, duration: 0.25, ease: "power2.out" }, 
          i === 0 ? startTime : textFadeInStart
        );

        if (i < phases - 1) {
          tl.to(textRefs.current[i], 
            { autoAlpha: 0, y: -30, scale: 0.95, duration: 0.2, ease: "power2.in" }, 
            fadeOutStart
          );
        } else {
          tl.to(textRefs.current[i], 
            { autoAlpha: 1, x: 0, scale: 1, duration: 0.2 }, 
            endTime 
          );
        }

        if (pinRefs.current[i]) {
          // Bouncy pop entry for the pins
          tl.fromTo(pinRefs.current[i],
            { autoAlpha: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 0.8, x: i === 0 ? 0 : 20 },
            { autoAlpha: 1, scale: 1, x: 0, duration: 0.25, ease: "back.out(1.5)" },
            i === 0 ? startTime : textFadeInStart
          );
          
          if (i < phases - 1) {
            tl.to(pinRefs.current[i],
              { autoAlpha: 0, scale: 0.9, y: -20, duration: 0.2, ease: "power2.in" },
              fadeOutStart
            );
          }
        }
      }

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [wireframes, productName, productIndex]);

  const addToTextRefs = (el: HTMLDivElement | null, index: number) => { textRefs.current[index] = el; };
  const addToPinRefs = (el: HTMLDivElement | null, index: number) => { pinRefs.current[index] = el; };
  const addToImgRefs = (el: HTMLImageElement | null, index: number) => { imgRefs.current[index] = el; };

  const h = headings || [
    { line1: "Detect AI Across", line2: "Every Format" },
    { line1: "Go Beyond", line2: "Detection" },
    { line1: "Measure Authenticity", line2: "with Confidence" },
    { line1: "Professional PDF", line2: "Verification Report" }
  ];
  
  const desc = finalDesc || "The definitive standard for digital authenticity. Protect your platform today.";

  return (
    <div className="bg-white min-h-screen text-[#1a1a1a] font-sans overflow-hidden selection:bg-[#ff5533] selection:text-white">

      {/* Main Scroll Container */}
      <div ref={containerRef} className="h-screen w-full relative flex flex-col md:flex-row pt-24 md:pt-0 pb-10 md:pb-0">
        
        {/* LEFT COLUMN: Headings Only */}
        <div className="w-full md:w-[35%] h-[40%] md:h-full flex flex-col justify-center px-6 md:pl-20 md:px-0 relative z-20">
          
          {[0, 1, 2, 3].map(i => (
            <div key={i} ref={(el) => addToTextRefs(el, i)} className="absolute top-1/2 -translate-y-1/2 left-6 right-6 md:left-20 md:right-0 invisible pointer-events-auto group cursor-default">
              <h1 className="text-3xl md:text-5xl font-medium text-[#1a1a1a] leading-tight tracking-tight transition-colors duration-300">
                {h[i].line1} <br />
                <span className="text-[#999] transition-colors duration-300 group-hover:text-[#ff5533]">{h[i].line2}</span>
                {h[i].line3 && (
                  <>
                    <br />
                    <span className="text-[#999] transition-colors duration-300 group-hover:text-[#1a1a1a]">{h[i].line3}</span>
                  </>
                )}
              </h1>
            </div>
          ))}

          {/* Phase 5 Text with the requested Black Bar */}
          <div ref={(el) => addToTextRefs(el, 4)} className="absolute top-1/2 -translate-y-1/2 left-6 right-6 md:left-20 md:right-0 invisible pointer-events-auto group cursor-default flex items-stretch gap-4 md:gap-6">
            <div className="w-1.5 bg-[#1a1a1a] rounded-full shrink-0"></div>
            <div>
              <h1 className="text-4xl md:text-6xl font-medium text-[#1a1a1a] mb-2 md:mb-4 leading-tight tracking-tight transition-colors duration-300">
                Meet <br />
                <span className="text-[#ff5533]">{productName}</span>
              </h1>
              <p className="text-gray-600 text-base md:text-xl leading-relaxed max-w-md transition-colors duration-300 group-hover:text-[#1a1a1a]">
                {desc}
              </p>
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: Images & Pins */}
        <div className="w-full md:w-[55%] h-[60%] md:h-full flex items-center justify-center relative">
          <div className="relative w-full h-full max-w-3xl flex items-center justify-center">
            
            {/* Wireframes (Phases 1-4) */}
            {wireframes.map((src, index) => (
              <img 
                key={src}
                ref={(el) => addToImgRefs(el, index)}
                src={src} 
                alt={`Enimi Phase ${index + 1}`} 
                className="absolute w-full h-auto object-contain z-10 invisible pointer-events-none mix-blend-multiply rounded-[40px]"
              />
            ))}

            {/* PINS FOR PHASES 1-4 */}
            
            {/* Pin 1 - Top Right (Line goes left, then down) */}
            <div 
              ref={(el) => addToPinRefs(el, 0)} 
              className="absolute top-[-5%] sm:top-[10%] right-[-10%] sm:-right-[5%] scale-[0.6] sm:scale-100 origin-right bg-[#1a1a1a] text-white p-4 rounded-2xl shadow-2xl z-20 w-64 invisible pointer-events-auto group cursor-default border border-white/5 hover:border-[#ff5533]/40 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,85,51,0.2)] transition-all duration-500"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-[#ff5533]/20 text-[#ff5533] p-1.5 rounded-lg group-hover:bg-[#ff5533] group-hover:text-white transition-colors duration-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {pinTexts ? pinTexts[0] : (
                    <><span className="text-[#ff5533] font-bold group-hover:text-white transition-colors duration-500">Analyze Text, Images, Audio, and Videos</span> to identify AI-generated or manipulated content with advanced multi-modal detection.</>
                  )}
                </p>
              </div>
              <div className="absolute top-1/2 -left-[80px] w-[80px] h-[1px] bg-[#ff5533]">
                <div className="absolute left-0 top-0 w-[1px] h-[80px] bg-[#ff5533]"></div>
                <div className="absolute left-[-2.5px] top-[80px] w-1.5 h-1.5 rounded-full bg-[#ff5533]"></div>
              </div>
            </div>

            {/* Pin 2 - Bottom Right (Line goes left, then up) */}
            <div 
              ref={(el) => addToPinRefs(el, 1)} 
              className="absolute bottom-[-5%] sm:bottom-[10%] right-[-10%] sm:-right-[5%] scale-[0.6] sm:scale-100 origin-right bg-[#1a1a1a] text-white p-4 rounded-2xl shadow-2xl z-20 w-64 invisible pointer-events-auto group cursor-default border border-white/5 hover:border-[#ff5533]/40 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,85,51,0.2)] transition-all duration-500"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-[#ff5533]/20 text-[#ff5533] p-1.5 rounded-lg group-hover:bg-[#ff5533] group-hover:text-white transition-colors duration-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {pinTexts ? pinTexts[1] : (
                    <><span className="text-[#ff5533] font-bold group-hover:text-white transition-colors duration-500">ENIMI examines</span> metadata, editing traces, generation patterns, source signals, and hidden indicators to uncover how content was created.</>
                  )}
                </p>
              </div>
              <div className="absolute top-1/2 -left-[80px] w-[80px] h-[1px] bg-[#ff5533]">
                <div className="absolute left-0 bottom-0 w-[1px] h-[80px] bg-[#ff5533]"></div>
                <div className="absolute left-[-2.5px] bottom-[80px] w-1.5 h-1.5 rounded-full bg-[#ff5533]"></div>
              </div>
            </div>

            {/* Pin 3 - Bottom Right (Line goes left, then up) */}
            <div 
              ref={(el) => addToPinRefs(el, 2)} 
              className="absolute bottom-[-5%] sm:bottom-[10%] right-[-10%] sm:-right-[5%] scale-[0.6] sm:scale-100 origin-right bg-[#1a1a1a] text-white p-4 rounded-2xl shadow-2xl z-20 w-64 invisible pointer-events-auto group cursor-default border border-white/5 hover:border-[#ff5533]/40 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,85,51,0.2)] transition-all duration-500"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="mt-0.5 bg-[#ff5533]/20 text-[#ff5533] p-1.5 rounded-lg group-hover:bg-[#ff5533] group-hover:text-white transition-colors duration-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-[11px] text-gray-300 leading-tight">
                  {pinTexts ? pinTexts[2] : 'Receive detailed AI probability scores showing the estimated percentage of AI involvement.'}
                </p>
              </div>
              {!pinTexts && (
                <div className="bg-[#222] p-3 rounded-xl border border-white/5 group-hover:bg-[#2a2a2a] transition-colors duration-500">
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[10px] font-medium mb-1">
                        <span className="text-[#ff5533] group-hover:text-white transition-colors duration-500">AI Generated</span>
                        <span>92%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1">
                        <div className="bg-[#ff5533] h-1 rounded-full group-hover:shadow-[0_0_8px_#ff5533] transition-shadow duration-500" style={{width: '92%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-medium mb-1">
                        <span className="text-gray-400">Human Created</span>
                        <span>8%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1">
                        <div className="bg-gray-500 h-1 rounded-full" style={{width: '8%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="absolute top-1/2 -left-[80px] w-[80px] h-[1px] bg-[#ff5533]">
                <div className="absolute left-0 bottom-0 w-[1px] h-[80px] bg-[#ff5533]"></div>
                <div className="absolute left-[-2.5px] bottom-[80px] w-1.5 h-1.5 rounded-full bg-[#ff5533]"></div>
              </div>
            </div>

            {/* Pin 4 - Bottom Right (Line goes left, then up) */}
            <div 
              ref={(el) => addToPinRefs(el, 3)} 
              className="absolute bottom-[-5%] sm:bottom-[10%] right-[-10%] sm:-right-[5%] scale-[0.6] sm:scale-100 origin-right bg-[#1a1a1a] text-white p-4 rounded-2xl shadow-2xl z-20 w-56 invisible pointer-events-auto group cursor-default border border-white/5 hover:border-[#ff5533]/40 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(255,85,51,0.2)] transition-all duration-500"
            >
              <div className="flex items-center gap-2 mb-2">
                 <div className="bg-[#ff5533]/20 text-[#ff5533] p-1.5 rounded-lg group-hover:bg-[#ff5533] group-hover:text-white transition-colors duration-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                {pinTexts ? null : <div className="text-xs text-[#ff5533] font-bold group-hover:text-white transition-colors duration-500">Comprehensive Report:</div>}
              </div>
              {pinTexts ? (
                <p className="text-xs text-gray-300 leading-relaxed mb-2">{pinTexts[3]}</p>
              ) : (
                <ul className="space-y-1.5 mb-2 ml-1">
                  {['AI Detection Results', 'Confidence Scores', 'Evidence Analysis', 'Metadata Findings', 'Verification Summary'].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-white/50 rounded-full group-hover:bg-[#ff5533] transition-colors duration-500"></div>
                      <span className="text-[10px] font-medium text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="absolute top-1/2 -left-[80px] w-[80px] h-[1px] bg-[#ff5533]">
                <div className="absolute left-0 bottom-0 w-[1px] h-[80px] bg-[#ff5533]"></div>
                <div className="absolute left-[-2.5px] bottom-[80px] w-1.5 h-1.5 rounded-full bg-[#ff5533]"></div>
              </div>
            </div>

            {/* Phase 5: Final Logo Reveal */}
            <div 
              ref={finalLogoRef}
              className="absolute w-[60%] h-auto opacity-0 group cursor-pointer z-30 pointer-events-auto"
            >
               <img 
                 src={finalLogo} 
                 alt={`${productName} Final Reveal`} 
                 className="w-full h-auto object-contain transition-all duration-300 ease-in-out group-hover:opacity-0 shadow-2xl rounded-3xl"
               />
               <img 
                 src={finalLogoHover} 
                 alt={`${productName} Final Reveal Active`} 
                 style={hoverImageTransform ? { transform: hoverImageTransform } : undefined}
                 className="absolute inset-0 w-full h-full object-contain transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 shadow-2xl rounded-3xl"
               />
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Navigation Tabs */}
        <div className="hidden md:flex w-[10%] h-full flex-col justify-center items-end pr-10 relative z-20">
           <div className="flex flex-col items-end gap-4 relative right-[-1px] h-[400px]">
             <div 
               ref={progressLineRef}
               className="absolute right-[3px] top-0 w-[2px] bg-[#ff5533] z-10" 
               style={{ height: "0%" }}
             ></div>
             <div className="flex items-center gap-3 absolute top-1/2 -translate-y-1/2 right-0">
               <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2 whitespace-nowrap">{productName}</span>
               <div className="bg-[#ff5533] text-white text-[10px] px-2.5 py-1 rounded flex items-center justify-center font-bold z-20 relative mr-[-4px]">
                 {productIndex}
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}

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

export default function EnimiApp() {
  return (
    <div className="bg-white">
      {/* Our Products Heading Section */}
      <section className="w-full relative flex flex-col pt-32 pb-8 px-6 md:px-16 lg:px-24">
        <div className="flex flex-col items-start max-w-6xl mx-auto w-full z-10 relative">
          <h2 className="text-5xl md:text-7xl font-sans font-medium text-black hover:text-[#ff5e2b] transition-colors duration-500 tracking-tight leading-[1.05] cursor-default">
            <BlockReveal>
              Our Products
            </BlockReveal>
          </h2>
        </div>
      </section>

      <ProductScrollSection 
        hoverImageTransform="scale(1.035) translate(-0.5%, 1.5%)"
      />
      <ProductScrollSection 
        productName="POTAKETCH"
        productIndex="02"
        headings={[
          { line1: "Turn Ideas Into Reality", line2: "Every Great Startup", line3: "Begins With An Idea" },
          { line1: "Find The Right Talent", line2: "Build Your Dream Team" },
          { line1: "Real Opportunities For Everyone", line2: "Learn. Work. Grow." },
          { line1: "Launch Faster Together", line2: "From Concept To Product" }
        ]}
        pinTexts={[
          "Potaketch connects innovators, developers, designers, and creators to transform concepts into real-world products.",
          "Connect with skilled freelancers, developers, designers, marketers, and AI specialists ready to bring projects to life.",
          "Students gain hands-on industry experience through live projects while freelancers discover meaningful work and build their portfolios.",
          "Collaborate, manage tasks, track progress, and transform startup ideas into successful products with one unified platform."
        ]}
        finalDesc="Transform concepts into real-world products. Launch your startup today."
        wireframes={[
          '/potaketchlogo/1.png',
          '/potaketchlogo/2.png',
          '/potaketchlogo/3.png',
          '/potaketchlogo/4.png',
        ]}
        finalLogo="/potaketchlogo/potaketch.png"
        finalLogoHover="/potaketchlogo/potaketch hove.png"
      />
      <ProductScrollSection 
        productName="FAMTREE"
        productIndex="03"
        headings={[
          { line1: "Every Family Has A Story", line2: "Preserve Your Family Legacy" },
          { line1: "Connect Generations", line2: "Bring Families Closer Together" },
          { line1: "Save Precious Memories", line2: "More Than Photos.", line3: "More Than Names." },
          { line1: "Pass It Forward", line2: "A Legacy That Never Fades" }
        ]}
        pinTexts={[
          "Capture family memories, relationships, photos, stories, and milestones in one secure digital family tree.",
          "Discover family connections, document your heritage, and help future generations understand where they came from.",
          "Store life stories, achievements, voice recordings, documents, and special moments that deserve to be remembered forever.",
          "Create a living family archive that can be shared with children, grandchildren, and future generations for years to come."
        ]}
        finalDesc="Create a living family archive to share with generations for years to come."
        wireframes={[
          '/famtreelogo/1.png',
          '/famtreelogo/2.png',
          '/famtreelogo/3.png',
          '/famtreelogo/4.png',
        ]}
        finalLogo="/famtreelogo/beforehover.png"
        finalLogoHover="/famtreelogo/afterhover.png"
      />
    </div>
  );
}
