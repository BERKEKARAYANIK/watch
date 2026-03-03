import React, { useRef, useEffect, useState } from 'react';

interface WheelPickerProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  width?: string;
}

export function WheelPicker({ options, value, onChange, width = 'w-16' }: WheelPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const ITEM_HEIGHT = 48; // h-12 = 48px

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
      if (!containerRef.current) return;
      const scrollY = containerRef.current.scrollTop;
      const index = Math.round(scrollY / ITEM_HEIGHT);
      if (index >= 0 && index < options.length) {
        onChange(options[index]);
      }
    }, 100);
  };

  useEffect(() => {
    if (containerRef.current && !isScrolling) {
      const index = options.indexOf(value);
      if (index !== -1) {
        containerRef.current.scrollTo({
          top: index * ITEM_HEIGHT,
          behavior: 'smooth'
        });
      }
    }
  }, [value, isScrolling, options]);

  return (
    <div className={`relative h-[240px] ${width} bg-white select-none`}>
      {/* Selection Highlight */}
      <div className="absolute top-1/2 left-0 w-full h-12 -translate-y-1/2 bg-neutral-100/80 rounded-xl pointer-events-none" />
      
      {/* Scroll Container */}
      <div 
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
        onScroll={handleScroll}
      >
        <div className="h-[calc(50%-24px)]" />
        {options.map((opt, i) => {
          const isSelected = value === opt;
          return (
            <div 
              key={i} 
              className={`h-12 flex items-center justify-center snap-center text-3xl transition-all duration-200 ${
                isSelected ? 'text-neutral-900 font-bold scale-110' : 'text-neutral-400 font-medium scale-90'
              }`}
            >
              {opt}
            </div>
          );
        })}
        <div className="h-[calc(50%-24px)]" />
      </div>

      {/* Gradient Masks */}
      <div className="absolute top-0 left-0 w-full h-[35%] bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[35%] bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
    </div>
  );
}
