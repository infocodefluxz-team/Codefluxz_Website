import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScrollProvider
 * Wraps the app with Lenis physics-based smooth scroll and bridges
 * it to GSAP ScrollTrigger so scroll-driven animations stay in sync.
 *
 * Safari-safe config:
 * - lerp 0.08 (higher than default) prevents iOS elastic-scroll stutter
 * - syncTouch: false avoids native-scroll conflicts on mobile Safari
 */
export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Safari-safe: don't intercept native touch
      syncTouch: false,
    });

    lenisRef.current = lenis;

    // Bridge Lenis → GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Setup ResizeObserver to detect DOM height changes (like late image loads) and refresh ScrollTrigger
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    
    // Observe body for any height changes
    resizeObserver.observe(document.body);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      resizeObserver.disconnect();
    };
  }, []);

  return lenisRef;
}
