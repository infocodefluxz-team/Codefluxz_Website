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

const FRAME_COUNT = 176;
const currentFrame = (index: number) => `/LapTop_Imges/${index.toString().padStart(5, "0")}.png`;

/** Clamp + normalize progress between two thresholds → [0, 1] */
const phase = (progress: number, start: number, end: number) =>
  Math.max(0, Math.min(1, (progress - start) / (end - start)));

export default function Hero() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const laptopRef     = useRef<HTMLDivElement>(null);
  const introRef      = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

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
      render(1);
    };

    const proxy = { frame: 1 };
    let ctx: ReturnType<typeof gsap.context> | undefined;

    ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=800%",       // 800vh to fit all cinematic phases
          pin: true,
          scrub: 1.2,          // Butter-smooth interpolation
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
        duration: 4, // 4 parts of the timeline
      })
      // Phase 2: Massive Zoom straight into the Laptop Display
      .to(canvas, {
        scale: 25,
        ease: "power2.in", // Accelerate into the zoom
        transformOrigin: "50% 55%", // Targets the center of the display specifically
        duration: 2.5,
      }, ">") // Starts immediately after the frame sequence completes
      // Phase 3: Crossfade Canvas to reveal Video seamlessly
      .to(canvas, {
        opacity: 0,
        ease: "none",
        duration: 0.8, // Smooth fade to transparency
      }, "-=1.2") // Starts slightly before the zoom finishes for a glass-like pass-through effect
      // Phase 4: Hold the video full screen for a moment
      .to({}, { duration: 1.5 })
      // Phase 5: Fade out, blur, and slide down the entire container for exit
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
        style={{ willChange: "filter, opacity, transform", mixBlendMode: "screen" }}
      >
        {/* 16:9 Aspect Ratio Wrapper to lock video exactly to the laptop screen coords */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.85] xl:scale-90 origin-center"
          style={{
            width: "max(100vw, 177.77vh)",
            height: "max(56.25vw, 100vh)",
          }}
        >
          {/* The video element playing behind the canvas display, positioned in the bezels */}
          <video
            src="/Laptop.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute z-0 object-cover rounded-[1.5%]"
            style={{
              top: "10.5%",
              left: "14%",
              width: "72%",
              height: "58%",
            }}
          />

          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none block z-10"
            style={{ willChange: "transform, opacity" }}
          />
        </div>
      </div>

      {/* ── Intro texts (fade out on scroll) ────────────────────────── */}
      <div
        ref={introRef}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ willChange: "opacity, transform" }}
      >
        {/* Top-left: Codefluxz */}
        <div className="absolute left-[3%] top-[12vh] pointer-events-auto">
          <h1
            className="font-sans font-bold tracking-tighter text-white m-0 leading-none"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            <FluidText text="Codefluxz" />
          </h1>
        </div>

        {/* Bottom-right: to Remember Everything */}
        <div className="absolute right-[3%] bottom-[12vh] text-right pointer-events-auto">
          <div
            className="font-sans font-bold tracking-tighter text-white flex flex-col items-end gap-[0.1em]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1.1 }}
          >
            <FluidText text="to Remember" />
            <FluidText text="Everything" />
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
