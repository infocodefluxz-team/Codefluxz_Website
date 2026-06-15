/**
 * Hero.tsx — Ultimate Smooth Canvas Image Sequence
 *
 * Renders exactly 176 frames to an HTML5 Canvas, completely bypassing video decoder lag.
 * Perfect sync with scroll position.
 */

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FluidText from "./FluidText";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 151;
const currentFrame = (index: number) => `/Laptop_Webp/${index.toString().padStart(5, "0")}_result.webp`;

/** Clamp + normalize progress between two thresholds → [0, 1] */
const phase = (progress: number, start: number, end: number) =>
  Math.max(0, Math.min(1, (progress - start) / (end - start)));

export default function Hero() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const laptopRef     = useRef<HTMLDivElement>(null);
  const introRef      = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const videoRef      = useRef<HTMLVideoElement>(null);
  const overlayRef    = useRef<HTMLDivElement>(null);
  const titleRef      = useRef<HTMLSpanElement>(null);
  const descRef       = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);

  // ── 1. Preload Images ──────────────────────────────────────────────────────
  useEffect(() => {
    // Preload all 176 frames so they are instantly ready when scrubbing
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      imagesRef.current.push(img);
    }
  }, []);

  // ── Force Video Playback on Interaction ────────────────────────────────────
  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    };
    
    // Attempt play immediately
    playVideo();
    
    // Fallback: Play on first interaction to bypass strict autoplay policies
    window.addEventListener("scroll", playVideo, { once: true });
    window.addEventListener("click", playVideo, { once: true });
    window.addEventListener("touchstart", playVideo, { once: true });
    
    return () => {
      window.removeEventListener("scroll", playVideo);
      window.removeEventListener("click", playVideo);
      window.removeEventListener("touchstart", playVideo);
    };
  }, []);

  // ── Overlay Message Loop Logic ─────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const messages = [
      {
        title: "Enimi",
        desc: "Enimi is an AI-powered platform that detects whether text, images, or videos are AI-generated or manipulated. It provides authenticity scores and insights, helping businesses and individuals make trusted decisions in the age of AI."
      },
      {
        title: "PotaKetch",
        desc: "PotaKetch is a credit-based opportunity marketplace that connects startups and businesses with students, interns, and freelancers for real-world projects. Users bid with credits to win projects, gain experience, build their portfolios, and earn money while helping businesses find skilled talent."
      },
      {
        title: "FamTree",
        desc: "FamTree is a digital family archive that helps users store, organize, and preserve their family history in one secure place. It allows families to maintain important details across generations, ensuring memories and relationships are never lost."
      }
    ];
    
    let loopCount = 0;
    let lastTime = 0;
    
    const handleTimeUpdate = () => {
      // If currentTime is smaller than lastTime by >0.5s, the video just looped!
      if (video.currentTime < lastTime - 0.5) {
        loopCount = (loopCount + 1) % messages.length;
        if (titleRef.current && descRef.current) {
          titleRef.current.innerText = messages[loopCount].title;
          descRef.current.innerText = messages[loopCount].desc;
        }
      }
      lastTime = video.currentTime;
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  // ── 2. Handle Text & Blur Fades ────────────────────────────────────────────
  const onProgress = (p: number) => {
    if (introRef.current) {
      const fadeOut = phase(p, 0, 0.15); // fade out text much faster now that timeline is 800vh
      introRef.current.style.opacity   = String(1 - fadeOut);
      introRef.current.style.transform = `translateY(${-fadeOut * 30}px)`;
    }
    if (scrollHintRef.current) {
      scrollHintRef.current.style.opacity = String(1 - phase(p, 0, 0.08));
    }
  };

  // ── 3. GSAP Canvas Scrub ───────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const container = containerRef.current;
    if (!canvas || !context || !container) return;

    // A helper to draw a specific frame to the canvas
    const render = (index: number) => {
      const img = imagesRef.current[index - 1];
      if (img && img.complete && img.naturalWidth > 0) {
        // Ensure canvas internal resolution matches the image precisely
        if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else if (img) {
        // If the user scrolls extremely fast before preload finishes
        img.onload = () => render(index);
      }
    };

    // Draw the very first frame immediately on load
    const firstImg = new Image();
    firstImg.src = currentFrame(1);
    firstImg.onload = () => {
      canvas.width = firstImg.naturalWidth;
      canvas.height = firstImg.naturalHeight;
      canvas.style.backgroundImage = "none";
      render(1);
    };

    const proxy = { frame: 1 };
    let ctx: ReturnType<typeof gsap.context> | undefined;

    ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=400%",       // 400vh for a faster, single scroll feel
          pin: true,
          scrub: 0.5,          // Reduced from 1.2 for tighter, more responsive scroll feeling
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            requestAnimationFrame(() => {
              render(proxy.frame);
              onProgress(self.progress);
            });
          },
        },
      });

      // Phase 1: Play Laptop Opening Sequence
      tl.to(proxy, {
        frame: FRAME_COUNT,
        snap: "frame",
        ease: "none",
        duration: 2, // Faster rotation
      })
      // Phase 2: Crossfade Canvas to reveal Video seamlessly (No zoom)
      .to(canvas, {
        opacity: 0,
        ease: "none",
        duration: 0.8, // Smooth fade to transparency
      }, ">") // Starts immediately after the frame sequence completes
      // Fade in the AR Overlay seamlessly with the video reveal
      .to(overlayRef.current, {
        opacity: 1,
        ease: "none",
        duration: 0.8,
      }, "<") // Syncs perfectly with the canvas fade
      // Phase 3: Hold the video for a moment
      .to({}, { duration: 1.5 })
      // Phase 4: Fade out, blur, and slide down the entire container for exit
      .to(laptopRef.current, {
        opacity: 0,
        filter: "blur(25px)",
        y: "20vh",
        ease: "power1.inOut",
        duration: 1,
      });

    }, container);

    return () => {
      ctx?.revert();
      ScrollTrigger.getAll().forEach((s) => s.kill());
    };
  }, []);

  // ── 4. Render DOM ──────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      id="hero-pin"
      className="relative w-full h-screen bg-[#07080a] overflow-hidden select-none"
      style={{ willChange: "transform" }}
    >
      {/* ── Subtle grid overlay ─────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* ── Layered Glow Background (Greyish White & Black) ────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Core bright white center - smaller to prevent washing out the blacks */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.65, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] md:w-[25vw] md:h-[25vw] rounded-full blur-[80px] md:blur-[120px]"
          style={{ background: "rgba(255, 255, 255, 0.4)" }}
        />
        
        {/* First Ripple Ring */}
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full blur-[100px] md:blur-[140px]"
          style={{ background: "rgba(200, 200, 200, 0.25)" }}
        />

        {/* Second Outer Ripple */}
        <motion.div 
          animate={{ scale: [1, 1.25, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-full blur-[120px] md:blur-[160px]"
          style={{ background: "rgba(100, 100, 100, 0.15)" }}
        />
      </div>

      {/* ── Canvas Frame Sequence (Sits over video, becomes transparent) ───────────────────────────────────── */}
      <div
        ref={laptopRef}
        className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden"
        style={{ willChange: "filter, opacity, transform", mixBlendMode: "screen", transform: "translateZ(0)" }}
      >
        {/* 16:9 Aspect Ratio Wrapper to lock video exactly to the laptop screen coords */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-center w-[150vw] h-[84.375vw] md:w-[max(100vw,177.77vh)] md:h-[max(56.25vw,100vh)]"
        >
          {/* The video element playing behind the canvas display, identically sized */}
          <video
            ref={videoRef}
            src="/Laptop_7%20-%20Trim.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 z-0 object-contain w-full h-full pointer-events-none"
          />

          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none block z-10"
            style={{ 
              willChange: "transform, opacity",
              transform: "translateZ(0)",
              backgroundImage: "url('/Laptop_Webp/00001_result.webp')",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          />

          {/* AR Overlay - Fades in during Phase 3 */}
          <div
            ref={overlayRef}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            style={{ opacity: 0, willChange: "opacity, transform", transform: "translateZ(0)" }}
          >
            {/* The UI Block */}
            <div className="flex flex-col gap-[1.5vh] w-[80vw] md:w-[35vw] text-[#00ff00] font-sans font-light tracking-wide">
              
              {/* Top Bar */}
              <div className="flex justify-between items-center text-[10px] sm:text-[12px] md:text-[0.9vw]">
                <div className="flex gap-3">
                  <span>12:08</span>
                  <span>codefluxz</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Cloud icon */}
                  <svg className="w-3 h-3 md:w-[1vw] md:h-[1vw]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 19c2.485 0 4.5-2.015 4.5-4.5 0-2.313-1.745-4.226-4-4.474V10c0-3.314-2.686-6-6-6s-6 2.686-6 6v.026c-2.255.248-4 2.161-4 4.474C2 17.485 4.015 19.5 6.5 19h11z"/></svg>
                  {/* Battery icon */}
                  <div className="w-5 h-2.5 md:w-[1.6vw] md:h-[0.7vw] border border-[#00ff00] rounded-[2px] p-[1px] relative flex items-center">
                    <div className="bg-[#00ff00] h-full w-[69%] rounded-[1px]"></div>
                    <div className="absolute -right-[2px] h-[40%] w-[1px] bg-[#00ff00]"></div>
                  </div>
                  <span>69%</span>
                </div>
              </div>

              {/* Title Box */}
              <div className="self-end border border-[#00ff00] rounded-lg px-2 py-1 md:px-[1.2vw] md:py-[0.5vh] mt-[1vh]">
                <span ref={titleRef} className="text-[10px] sm:text-[12px] md:text-[0.9vw]">Enimi</span>
              </div>

              {/* Description */}
              <div ref={descRef} className="text-[10px] sm:text-[12px] md:text-[0.9vw] leading-relaxed text-left">
                Enimi is an AI-powered platform that detects whether text, images, or videos are AI-generated or manipulated. It provides authenticity scores and insights, helping businesses and individuals make trusted decisions in the age of AI.
              </div>

              {/* Bottom Bar */}
              <div className="flex justify-between items-center text-[10px] sm:text-[12px] md:text-[0.9vw] mt-[1vh]">
                <div className="border border-[#00ff00] rounded-full px-2 py-1 md:px-[1.5vw] md:py-[0.4vh]">Answer</div>
                <div>Recap</div>
                <div>Fact Check</div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Intro texts (fade out on scroll) ────────────────────────── */}
      <div
        ref={introRef}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ willChange: "opacity, transform" }}
      >
        {/* Top-left: Codefluxz */}
        <div className="absolute left-[5%] md:left-[3%] top-[10vh] md:top-[12vh] pointer-events-auto">
          <h1
            className="font-sans font-bold tracking-tighter text-white m-0 leading-none"
            style={{ fontSize: "clamp(1.75rem, 8vw, 5rem)" }}
          >
            <FluidText text="Codefluxz" highlightRange={[4, 8]} highlightColor="#ff5e2b" />
          </h1>
        </div>

        {/* Bottom-right: Innovation Starts Here */}
        <div className="absolute right-[5%] md:right-[3%] bottom-[10vh] md:bottom-[12vh] text-right pointer-events-auto">
          <div
            className="font-sans font-bold tracking-tighter text-white flex flex-col items-end gap-[0.1em]"
            style={{ fontSize: "clamp(1.75rem, 8vw, 5rem)", lineHeight: 1.1 }}
          >
            <FluidText text="Innovation" highlightRange={[0, 9]} highlightColor="#ff5e2b" />
            <FluidText text="Starts Here" />
          </div>
        </div>
      </div>

      {/* ── Scroll hint ─────────────────────────────────────────────── */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-[5vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none animate-scroll-hint"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
          Scroll
        </span>
        <div
          className="w-[1px] h-8 animate-drip"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)",
          }}
        />
      </div>
    </div>
  );
}
