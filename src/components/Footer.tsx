import { useEffect, useRef, useState } from "react";
import { Linkedin, Facebook, Instagram } from "lucide-react";
import { motion } from "motion/react";
import ContactDrawer from "./ContactDrawer";

export default function Footer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [isHoveringFooter, setIsHoveringFooter] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#hero-pin" },
    { name: "Our features", href: "#features" },
    { name: "About", href: "#enimi-about" },
    { name: "Founders tab", href: "#founders" },
    { name: "Contact page", href: "#footer-section" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/people/Code-Fluxz/pfbid02arHdeFDWiUL9458HVtJu9cT494cBjYu8KJ44v1u27tht7cgoLAc3PdL1yRppfDRdl/", label: "Facebook" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/codefluxz-india/posts/?feedView=all", label: "Linkedin" },
    { icon: Instagram, href: "https://www.instagram.com/code_fluxz/", label: "Instagram" },
  ];

  // Scroll popup trigger
  useEffect(() => {
    const handleScroll = () => {
      if (isFullScreen) return;
      if (!triggerRef.current) return;
      
      const rect = triggerRef.current.getBoundingClientRect();
      // Trigger when the footer container is 40% into the viewport
      if (rect.top < window.innerHeight * 0.6 && rect.top > 0) {
        setIsFullScreen(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFullScreen]);

  // Handle closing fullscreen on scroll up
  useEffect(() => {
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isFullScreen) return;
      const touchEndY = e.touches[0].clientY;
      if (touchEndY - touchStartY > 50) { // Swiped down (scrolling up)
        setIsFullScreen(false);
      }
      if (e.cancelable) e.preventDefault();
    };
    
    const handleWheel = (e: WheelEvent) => {
      if (!isFullScreen) return;
      if (e.deltaY < -15) { // Scrolling up
        setIsFullScreen(false);
      }
      if (e.cancelable) e.preventDefault();
    };

    if (isFullScreen) {
      window.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isFullScreen]);

  // Fade navbar
  useEffect(() => {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      navbar.style.transition = "opacity 0.4s ease";
      navbar.style.opacity = isFullScreen ? "0" : "1";
      navbar.style.pointerEvents = isFullScreen ? "none" : "auto";
    }
  }, [isFullScreen]);

  // Canvas Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const footer = footerRef.current;
    if (!canvas || !footer) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = footer.offsetWidth;
    let height = canvas.height = footer.offsetHeight;

    const resize = () => {
      width = canvas.width = footer.offsetWidth;
      height = canvas.height = footer.offsetHeight;
    };
    window.addEventListener('resize', resize);

    type Point = { x: number; y: number; age: number };
    let points: Point[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = footer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      points.push({ x, y, age: 0 });
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    footer.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      points.forEach(p => p.age += 1);
      points = points.filter(p => p.age < 60);

      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = 14; // Constant thickness line
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // Fade out at the tail smoothly
        const opacity = Math.max(0, 1 - (p1.age / 60));
        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.9})`;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      footer.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isFullScreen]); // Re-bind on fullscreen toggle to get proper bounds

  return (
    <div className="w-full h-[70vh] relative" ref={triggerRef}>
      <motion.footer
        layout
        id="footer-section"
        ref={footerRef}
        className="bg-[#ff5e2b] text-black overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.15)]"
        style={
          isFullScreen
            ? {
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 60,
                cursor: 'none'
              }
            : {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10,
                cursor: 'none'
              }
        }
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setIsHoveringFooter(true)}
        onMouseLeave={() => setIsHoveringFooter(false)}
      >
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
        
        {/* Top section */}
        <div className="absolute top-0 left-0 w-full p-8 md:p-12 flex justify-between items-start z-10 pointer-events-none">
          <div className="flex flex-col gap-6 pointer-events-auto">
            <p className="font-sans font-light text-black text-sm md:text-base max-w-[250px] leading-snug">
              Building the trust and opportunity layer<br />for the AI-powered future.
            </p>
            <a 
              href="#contact" 
              onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }}
              className="bg-[#1f1f1f] text-white rounded-md px-6 py-2.5 text-sm md:text-base w-fit hover:bg-white hover:text-black transition-colors duration-300 font-medium pointer-events-auto"
              onMouseEnter={() => setIsHoveringLink(true)}
              onMouseLeave={() => setIsHoveringLink(false)}
              style={{ cursor: 'none' }}
            >
              Contact us
            </a>
          </div>
          
          <div className="flex flex-col items-end gap-1.5 font-light text-[13px] md:text-[15px] pointer-events-auto tracking-wide">
            <a href="#" className="hover:opacity-60 transition-opacity" onMouseEnter={() => setIsHoveringLink(true)} onMouseLeave={() => setIsHoveringLink(false)} style={{ cursor: 'none' }}>Customer support</a>
            <a href="#" className="hover:opacity-60 transition-opacity" onMouseEnter={() => setIsHoveringLink(true)} onMouseLeave={() => setIsHoveringLink(false)} style={{ cursor: 'none' }}>Privacy policy</a>
            <a href="#" className="hover:opacity-60 transition-opacity" onMouseEnter={() => setIsHoveringLink(true)} onMouseLeave={() => setIsHoveringLink(false)} style={{ cursor: 'none' }}>Terms of service</a>
          </div>
        </div>

        {/* Center section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-10 pointer-events-none">
          <a 
            href="#"
            className="pointer-events-auto hover:scale-105 hover:opacity-80 transition-all duration-300 mb-2"
            onMouseEnter={() => setIsHoveringLink(true)}
            onMouseLeave={() => setIsHoveringLink(false)}
            style={{ cursor: 'none' }}
          >
            <img src="/headerlogo.png" alt="Header Logo" className="h-7 md:h-10 object-contain rounded-lg" />
          </a>
          <button 
            className="bg-[#1f1f1f] text-white px-5 py-2.5 text-sm md:text-base rounded-md flex items-center gap-2 hover:bg-white hover:text-black transition-colors duration-300 font-medium pointer-events-auto"
            onMouseEnter={() => setIsHoveringLink(true)}
            onMouseLeave={() => setIsHoveringLink(false)}
            style={{ cursor: 'none' }}
          >
            <div className="w-2 h-2 bg-[#ff5e2b] shrink-0 pointer-events-none" />
            Draw your vision with CF
          </button>
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex justify-between items-end z-10 pointer-events-none">
          <div className="flex gap-3 pointer-events-auto">
            {socialLinks.map((social, idx) => {
              const Icon = social.icon;
              return (
                <a 
                  key={idx} 
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 md:w-10 md:h-10 bg-[#1f1f1f] text-white hover:bg-white hover:text-black transition-colors duration-300 flex items-center justify-center rounded-md"
                  onMouseEnter={() => setIsHoveringLink(true)}
                  onMouseLeave={() => setIsHoveringLink(false)}
                  style={{ cursor: 'none' }}
                  aria-label={social.label}
                >
                  <Icon className="w-4 h-4 pointer-events-none" />
                </a>
              )
            })}
          </div>
          
          <div className="flex flex-col items-end gap-1.5 font-light text-[13px] md:text-[15px] pointer-events-auto tracking-wide">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="hover:opacity-60 transition-opacity"
                onMouseEnter={() => setIsHoveringLink(true)}
                onMouseLeave={() => setIsHoveringLink(false)}
                style={{ cursor: 'none' }}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

      </motion.footer>

      <ContactDrawer isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
