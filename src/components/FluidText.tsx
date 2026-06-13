import { useState } from "react";

interface DotConfig {
  charIndex: number;
  type: "square" | "circle";
}

interface FluidTextProps {
  text: string;
  className?: string;
  dotConfig?: DotConfig[];
  highlightRange?: [number, number]; // [startIdx, endIdx] inclusive
  highlightColor?: string;
}

export default function FluidText({ text, className = "", dotConfig, highlightRange, highlightColor }: FluidTextProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Split text into words, then pre-process each letter with a global index to avoid side-effects during rendering.
  let globalCharCounter = 0;
  const processedWords = text.split(" ").map((word) => {
    const letters = word.split("").map((char) => {
      const index = globalCharCounter++;
      return { char, index };
    });
    return letters;
  });

  return (
    <span 
      className={`inline-flex flex-wrap ${className}`}
      onMouseLeave={() => setHoveredIdx(null)}
    >
      {processedWords.map((letters, wordIdx) => (
        <span 
          key={wordIdx} 
          className="inline-block whitespace-nowrap mr-[0.25em] last:mr-0 select-none pb-1"
        >
          {letters.map(({ char, index }) => {
            // Prevent layout shifting on hover by keeping font-weight static 
            // and using text-shadow + scale for the "thickening" effect.
            const isHighlighted = highlightRange && index >= highlightRange[0] && index <= highlightRange[1];
            const defaultColor = isHighlighted ? (highlightColor || "#ff5533") : "rgba(255, 255, 255, 0.85)";
            
            let color = defaultColor;
            let textShadow = "none";
            let scale = 1;

            if (hoveredIdx !== null) {
              const distance = Math.abs(index - hoveredIdx);
              
              if (distance === 0) {
                color = isHighlighted ? (highlightColor || "#ff5533") : "#ffffff";
                textShadow = `0 0 16px ${color}, 0 0 1px ${color}`;
                scale = 1.08;
              } else if (distance === 1) {
                color = isHighlighted ? (highlightColor || "#ff5533") : "rgba(255, 255, 255, 0.95)";
                textShadow = `0 0 8px ${color}`;
                scale = 1.03;
              } else if (distance === 2) {
                color = isHighlighted ? (highlightColor || "#ff5533") : "rgba(255, 255, 255, 0.90)";
                textShadow = `0 0 3px ${color}`;
                scale = 1.01;
              }
            }

            // Check if there is an active dot decoration on this letter (F in CodeFluxz, second e in Remember)
            const activeDot = dotConfig?.find((d) => d.charIndex === index);

            return (
              <span
                key={index}
                onMouseEnter={() => setHoveredIdx(index)}
                className="inline-block relative cursor-default"
                style={{
                  fontWeight: 700, // keep constant to prevent jitter
                  color: color,
                  textShadow: textShadow,
                  transform: `scale(${scale})`,
                  transformOrigin: "bottom center",
                  // Butter-smooth transition without layout reflows
                  transition: "color 280ms ease-out, text-shadow 280ms ease-out, transform 280ms cubic-bezier(0.16, 1, 0.3, 1)",
                  willChange: "color, text-shadow, transform",
                }}
              >
                {char}
                {activeDot && activeDot.type === "square" && (
                  <span 
                    className="absolute left-[2px] top-[32%] w-2 h-2 bg-[#ff5533] rounded-[2px] pointer-events-none"
                    style={{
                      transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                )}
                {activeDot && activeDot.type === "circle" && (
                  <span 
                    className="absolute bottom-[2px] left-[2.5px] w-1.5 h-1.5 bg-[#ff5533] rounded-full pointer-events-none"
                    style={{
                      transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                )}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
