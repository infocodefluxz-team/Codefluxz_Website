import React from "react";
import { motion } from "motion/react";

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

export default function Founders() {
  const founders = [
    {
      name: "V Aakash Kumar",
      role: "Founder & CEO",
      image: "/founders/Og main.png"
    }
  ];



  return (
    <div className="bg-[#fcfcfc] text-black w-full py-24 sm:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* Header Section (Left) */}
          <div className="text-left w-full lg:w-1/2 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-sans font-medium text-black tracking-tight leading-[1.1] mb-6">
              <BlockReveal>
                Build without limits, <br className="hidden md:block" /> connect with purpose.
              </BlockReveal>
            </h2>
            <p className="text-lg md:text-xl text-neutral-500 max-w-xl">
              The ultimate platform for modern problem-solvers: authentic, scalable, and designed for real-world impact.
            </p>
          </div>

          {/* Founders Item (Right) */}
          <div className="flex justify-center lg:justify-end w-full lg:w-1/2">
            {founders.map((founder, idx) => (
              <motion.div
                key={idx}
                className="relative w-full max-w-[420px] rounded-[20px] overflow-hidden aspect-[4/5] group bg-neutral-100 shadow-2xl"
                whileHover="hover"
              >
                {/* Image with slight zoom on hover */}
                <motion.div
                  className="w-full h-full"
                  variants={{
                    hover: { scale: 1.05 }
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Overlay Box */}
                <div className="absolute bottom-4 right-4 group/box cursor-pointer z-10">
                  <div className="bg-[#1f1f1f]/95 backdrop-blur-sm border border-white/10 px-4 py-2.5 rounded-lg flex flex-col items-start transition-all duration-300 shadow-2xl w-auto min-w-[160px]">
                    <h3 className="text-base font-semibold text-white tracking-wide">
                      <span className="transition-colors duration-300 group-hover/box:text-[#ff5e2b]">{founder.name}</span>
                    </h3>
                    <p className="text-xs text-neutral-400 font-medium transition-colors duration-300 group-hover/box:text-white/80 mt-0.5">
                      {founder.role}
                    </p>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
          
        </div>

        {/* Core Team / Group Photo Row */}
        <div className="mt-24 md:mt-40 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* Group Photo (Left) */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <motion.div
              className="relative w-full rounded-[20px] overflow-hidden shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img
                src="/founders/group1.png"
                alt="Core Team"
                onLoad={() => window.dispatchEvent(new Event('resize'))}
                className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-700 ease-out"
              />
            </motion.div>
          </div>

          {/* Text Content (Right) */}
          <div className="text-left w-full lg:w-1/2 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-sans font-medium text-black tracking-tight leading-[1.2] mb-6">
              <BlockReveal>
                Four specialized pillars, <br className="hidden xl:block" /> one resilient architecture.
              </BlockReveal>
            </h2>
            <motion.p 
              className="text-lg md:text-xl text-neutral-500 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Behind every seamless digital experience is a strong foundation. As a unified four-person core, we architect the systems, drive the innovation, and maintain the structural integrity of every solution we deploy.
            </motion.p>
          </div>
          
        </div>

      </div>
    </div>
  );
}
