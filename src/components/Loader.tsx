"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface LoaderProps {
  finishLoading: () => void;
}

const Loader = ({ finishLoading }: LoaderProps) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const loader = loaderRef.current;
    const counter = counterRef.current;
    const text = textRef.current;
    
    if (!loader || !counter || !text) return;
    
    // Prevent scrolling while loading
    document.body.style.overflow = "hidden";
    
    const loaderDuration = 2; // seconds
    const interval = 10; // ms
    const increment = 100 / (loaderDuration * 1000 / interval);
    
    // Counter animation using state
    const updateCounter = () => {
      if (progress < 100) {
        setProgress(prev => {
          const newProgress = prev + increment;
          return Math.min(newProgress, 100);
        });
        
        setTimeout(updateCounter, interval);
      } else {
        // Animate text reveal
        gsap.to(text, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            // Wait a bit before hiding the loader
            setTimeout(() => {
              // Animate loader out
              gsap.to(loader, {
                y: "-100%",
                duration: 0.8,
                ease: "power3.inOut",
                onComplete: () => {
                  // Enable scrolling
                  document.body.style.overflow = "auto";
                  // Signal that loading is complete
                  finishLoading();
                },
              });
            }, 800);
          },
        });
      }
    };
    
    // Start counter animation
    const timer = setTimeout(updateCounter, 100);
    
    // Cleanup
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, [progress, finishLoading]);
  
  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center">
        <div
          ref={counterRef}
          className="text-5xl md:text-7xl font-medium tracking-tighter mb-4"
        >
          {Math.floor(progress)}%
        </div>
        <div
          ref={textRef}
          className="text-lg md:text-xl opacity-0 transform translate-y-4"
        >
          portfolio.
        </div>
      </div>
    </div>
  );
};

export default Loader; 