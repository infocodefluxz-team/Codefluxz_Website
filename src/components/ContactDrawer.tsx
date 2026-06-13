import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Linkedin, Facebook, Instagram } from "lucide-react";

interface ContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactDrawer({ isOpen, onClose }: ContactDrawerProps) {
  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/people/Code-Fluxz/pfbid02arHdeFDWiUL9458HVtJu9cT494cBjYu8KJ44v1u27tht7cgoLAc3PdL1yRppfDRdl/" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/codefluxz-india/posts/?feedView=all" },
    { icon: Instagram, href: "https://www.instagram.com/code_fluxz/" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-2 bottom-2 right-2 w-[420px] max-w-[calc(100vw-16px)] bg-white z-[101] rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header / Close button */}
            <div className="flex justify-end p-5 border-b border-neutral-100">
              <button 
                onClick={onClose}
                className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">Close</span>
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col">
              <h2 className="text-4xl font-sans text-black mb-10">Contact us</h2>
              
              <form 
                action="mailto:Info.codefluxz@gmail.com"
                method="POST"
                encType="text/plain"
                className="flex flex-col gap-8"
              >
                <div className="flex gap-4">
                  <input type="text" name="First Name" placeholder="Name" className="w-1/2 border-b border-neutral-200 py-2 text-black bg-transparent focus:outline-none focus:border-black transition-colors" required />
                  <input type="text" name="Last Name" placeholder="Last name" className="w-1/2 border-b border-neutral-200 py-2 text-black bg-transparent focus:outline-none focus:border-black transition-colors" required />
                </div>
                <input type="email" name="Email" placeholder="E-mail" className="w-full border-b border-neutral-200 py-2 text-black bg-transparent focus:outline-none focus:border-black transition-colors" required />
                <textarea name="Message" placeholder="How we can help" className="w-full border-b border-neutral-200 py-2 text-black bg-transparent focus:outline-none focus:border-black transition-colors resize-none h-24" required></textarea>
                
                <button 
                  type="submit" 
                  className="w-full bg-[#E8541A] text-white py-3.5 rounded hover:bg-black transition-colors duration-300 font-medium mt-4 shadow-sm"
                >
                  Submit
                </button>
              </form>

              {/* Bottom Info */}
              <div className="mt-auto pt-16">
                <p className="text-black mb-6 text-sm font-medium">Info.codefluxz@gmail.com</p>
                <div className="flex justify-between items-end">
                  <div className="flex gap-2">
                    {socialLinks.map((social, idx) => {
                      const Icon = social.icon;
                      return (
                        <a 
                          key={idx} 
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="w-10 h-10 bg-[#1f1f1f] text-white hover:bg-white hover:text-black border border-transparent hover:border-black transition-colors duration-300 flex items-center justify-center rounded"
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      )
                    })}
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <img src="/logo1.png" alt="CF Logo" className="h-6 object-contain mb-1" />
                    <span className="font-black text-xs tracking-wider text-black">CF</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
