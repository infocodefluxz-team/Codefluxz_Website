import { motion } from "motion/react";
import { useEffect } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  useEffect(() => {
    // Lock scrolling while preloader is active to prevent user interaction
    document.body.style.overflow = "hidden";
    
    // Safety fallback just in case onAnimationComplete fails to fire
    const timer = setTimeout(() => {
      onComplete();
    }, 7500);

    return () => {
      document.body.style.overflow = "unset";
      clearTimeout(timer);
    };
  }, [onComplete]);

  // 21-step timeline for exactly 9.5 seconds:
  // Glitch cycles (0 - 5.5s), Zoom (5.5s - 7.5s), Hold Zoom (7.5s - 8.5s), Fade Out (8.5s - 9.5s)
  const transitionTimes = [
    0, 0.079, 0.105, 0.106, 0.132, // North -> East
    0.211, 0.237, 0.238, 0.263,    // East -> South
    0.342, 0.368, 0.369, 0.395,    // South -> West
    0.474, 0.500, 0.501, 0.526,    // West -> North
    0.579, 0.789, 0.895, 1         // Hold N -> Zoom -> Hold Zoom -> Fade Out
  ];
  
  const bgColors = [
    "linear-gradient(180deg, #111111 0%, #ff5e2b 100%)", // 0: N
    "linear-gradient(180deg, #111111 0%, #ff5e2b 100%)", // 1: N
    "linear-gradient(180deg, #111111 0%, #ff5e2b 100%)", // 2: N
    "linear-gradient(270deg, #111111 0%, #ff5e2b 100%)", // 3: E
    "linear-gradient(270deg, #111111 0%, #ff5e2b 100%)", // 4: E
    
    "linear-gradient(270deg, #111111 0%, #ff5e2b 100%)", // 5: E
    "linear-gradient(270deg, #111111 0%, #ff5e2b 100%)", // 6: E
    "linear-gradient(0deg, #111111 0%, #ff5e2b 100%)",   // 7: S
    "linear-gradient(0deg, #111111 0%, #ff5e2b 100%)",   // 8: S
    
    "linear-gradient(0deg, #111111 0%, #ff5e2b 100%)",   // 9: S
    "linear-gradient(0deg, #111111 0%, #ff5e2b 100%)",   // 10: S
    "linear-gradient(90deg, #111111 0%, #ff5e2b 100%)",  // 11: W
    "linear-gradient(90deg, #111111 0%, #ff5e2b 100%)",  // 12: W
    
    "linear-gradient(90deg, #111111 0%, #ff5e2b 100%)",  // 13: W
    "linear-gradient(90deg, #111111 0%, #ff5e2b 100%)",  // 14: W
    "linear-gradient(180deg, #111111 0%, #ff5e2b 100%)", // 15: N
    "linear-gradient(180deg, #111111 0%, #ff5e2b 100%)", // 16: N
    
    "linear-gradient(180deg, #111111 0%, #ff5e2b 100%)", // 17: N
    "linear-gradient(180deg, #111111 0%, #ff5e2b 100%)", // 18: N
    "linear-gradient(180deg, #111111 0%, #ff5e2b 100%)", // 19: N
    "linear-gradient(180deg, #111111 0%, #ff5e2b 100%)"  // 20: N
  ];

  return (
    <motion.div
      key="preloader"
      initial={{ opacity: 1, background: bgColors[0] }}
      animate={{ 
        background: bgColors,
        opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        transition: {
          duration: 6.0,
          ease: "linear",
          times: transitionTimes
        }
      }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-auto"
    >
      <motion.div
        className="bg-white rounded-full w-auto h-auto px-6 py-3 md:px-8 md:py-4 flex items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.15)]"
        animate={{
          x: [0, -15, -25, -25, -20, -10, 0, 0, 0, 0, 0, 0, 0, 10, 20, 25, 25, 10, 0, 0, 0],
          y: [0, 0, 0, 0, 0, 15, 25, 25, 20, 0, -15, -25, -25, -10, 0, 0, 0, 0, 0, 0, 0],
          scale: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.0, 1.04, 1.08],
          filter: [
            "blur(0px)", "blur(0px)", "blur(8px)", "blur(8px)", "blur(0px)", 
            "blur(0px)", "blur(8px)", "blur(8px)", "blur(0px)", 
            "blur(0px)", "blur(8px)", "blur(8px)", "blur(0px)", 
            "blur(0px)", "blur(8px)", "blur(8px)", "blur(0px)", 
            "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"
          ]
        }}
        transition={{
          duration: 6.0,
          ease: "linear",
          times: transitionTimes
        }}
        onAnimationComplete={() => {
          // Tell App to remove this component so it triggers the AnimatePresence exit
          onComplete();
        }}
      >
        <img
          src="/headerlogo.png"
          alt="Loading Codefluxz..."
          className="h-8 md:h-12 w-auto object-contain"
        />
      </motion.div>
    </motion.div>
  );
}
