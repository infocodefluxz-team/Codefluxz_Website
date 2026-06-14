import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, Linkedin, Facebook, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isHamburgerOrange, setIsHamburgerOrange] = useState(false);
  const [isHamburgerHidden, setIsHamburgerHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      if (scrollY > 50) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }

      const whiteSections = [
        document.getElementById("enimi-about"),
        document.getElementById("experience-recognized"),
        document.getElementById("founders")
      ];
      
      let isOverWhite = false;
      whiteSections.forEach(section => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 60 && rect.bottom >= 60) {
            isOverWhite = true;
          }
        }
      });
      setIsHamburgerOrange(isOverWhite);

      const footer = document.getElementById("footer-section");
      if (footer) {
        const rect = footer.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.7) {
          setIsHamburgerHidden(true);
        } else {
          setIsHamburgerHidden(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Home", href: "#hero-pin" },
    { name: "Our features", href: "#features" },
    { name: "About", href: "#enimi-about" },
    { name: "Founders tab", href: "#founders" },
    { name: "Contact page", href: "#footer-section" },
  ];

  return (
    <>
      {/* Persistent Hamburger Menu */}
      <div className={`fixed top-6 left-6 md:left-10 z-50 transition-all duration-300 ${isHamburgerHidden ? "opacity-0 pointer-events-none translate-y-[-20px]" : "opacity-100 translate-y-0"}`}>
        <button
          id="nav-menu-toggle"
          onClick={() => setIsOpen(true)}
          className={`transition-colors p-2 -ml-2 focus:outline-none ${isHamburgerOrange ? 'text-[#ff5e2b] hover:text-[#e04f22]' : 'text-white hover:text-[#E8541A]'}`}
          aria-label="Open menu"
        >
          <Menu className="w-7 h-7 stroke-[1.5]" />
        </button>
      </div>

      <nav 
        id="navbar" 
        className={`fixed top-0 left-0 w-full z-40 backdrop-blur-md bg-[#111111]/70 border-b border-white/5 transition-all duration-500 ${
          isNavVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-full px-6 md:px-10 h-20 flex items-center justify-between">
          {/* Left placeholder for spacing */}
          <div className="w-10"></div>

          {/* Center: Image Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <a href="#" className="flex items-center hover:opacity-80 transition-opacity">
              <img src="/headerlogo.png" alt="CodeFluxz Logo" className="h-6 md:h-8 object-contain pointer-events-none" />
            </a>
          </div>

          {/* Right: Orange CTA Button */}
          <div>
            <a
              id="nav-cta-button"
              href="#enimi-about"
              className="bg-[#E8541A] hover:bg-[#ff682e] text-white font-sans text-[10px] md:text-xs font-medium uppercase tracking-wider py-2 px-3 md:py-3 md:px-5 rounded-none flex items-center gap-1 transition-all duration-300 hover:gap-1.5 select-none"
            >
              <span className="hidden sm:inline">View our Products</span>
              <span className="sm:hidden">Products</span>
              <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Slide-out Menu Drawer */}
      <div id="mobile-menu-container">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 pointer-events-auto flex"
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
              />

              {/* Left Drawer - Floating Double Blocks */}
              <motion.div
                id="mobile-menu-overlay"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
                className="relative h-[100dvh] w-[380px] max-w-[90vw] z-[60] flex flex-col p-4 gap-2"
              >
                {/* Header block */}
                <div className="bg-[#1f1f1f] rounded-xl p-5 flex items-center shrink-0 shadow-lg border border-white/5">
                  <button
                    id="close-menu-button"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-[#E8541A] transition-colors flex items-center gap-2 group focus:outline-none"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="font-sans text-[15px] tracking-wide">Close</span>
                  </button>
                </div>

                {/* Main content block */}
                <div className="bg-[#1f1f1f] rounded-xl p-8 flex-1 overflow-y-auto flex flex-col shadow-lg border border-white/5 relative">
                  {/* Links */}
                  <div className="flex flex-col gap-4 text-left w-full mb-10">
                    {navLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-white text-[22px] sm:text-[24px] font-sans font-normal tracking-wide hover:text-[#E8541A] transition-colors w-fit"
                      >
                        {link.name}
                      </a>
                    ))}

                    {/* Order Now Button */}
                    <div className="mt-6">
                      <a
                        href="#order"
                        onClick={() => setIsOpen(false)}
                        className="bg-[#E8541A] hover:bg-[#ff682e] text-white font-sans text-sm font-medium py-3 px-8 rounded flex items-center justify-center w-max transition-colors"
                      >
                        Order now
                      </a>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-grow min-h-[40px]"></div>

                  {/* Footer inside drawer */}
                  <div className="flex items-end justify-between w-full mt-auto relative z-10">
                    {/* Social Icons */}
                    <div className="flex items-center gap-2">
                      <a
                        href="https://www.linkedin.com/company/codefluxz-india/posts/?feedView=all"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-black w-10 h-10 rounded flex items-center justify-center hover:text-[#E8541A] transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a
                        href="https://www.facebook.com/people/Code-Fluxz/pfbid02arHdeFDWiUL9458HVtJu9cT494cBjYu8KJ44v1u27tht7cgoLAc3PdL1yRppfDRdl/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-black w-10 h-10 rounded flex items-center justify-center hover:text-[#E8541A] transition-colors"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                      <a
                        href="https://www.instagram.com/code_fluxz/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-black w-10 h-10 rounded flex items-center justify-center hover:text-[#E8541A] transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    </div>

                    {/* Logo */}
                    <div className="absolute right-0 bottom-0 pointer-events-none">
                      <img src="/logo1.png" alt="CodeFluxz Logo" className="h-8 md:h-10 object-contain" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
