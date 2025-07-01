"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface LoaderProps {
  finishLoading: () => void;
}

const Loader = ({ finishLoading }: LoaderProps) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!loaderRef.current || !containerRef.current || !textRef.current) return;
    
    const loader = loaderRef.current;
    const container = containerRef.current;
    const text = textRef.current;
    
    // Prevent scrolling while loading
    document.body.style.overflow = "hidden";
    
    // Create GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out the entire loader before signaling completion
        gsap.to(loader, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            // Enable scrolling
            document.body.style.overflow = "auto";
            // Signal that loading is complete
            finishLoading();
          }
        });
      }
    });

    // Create grid of dots
    const rows = 6;
    const cols = 12;
    const dotSize = 5;
    const gap = 14;
    const totalWidth = (cols * dotSize) + ((cols - 1) * gap);
    const totalHeight = (rows * dotSize) + ((rows - 1) * gap);
    
    // Set container dimensions
    container.style.width = `${totalWidth}px`;
    container.style.height = `${totalHeight}px`;
    container.style.position = 'relative';
    
    // Color palette for dots
    const colors = [
      '#3b82f6', // blue
      '#6366f1', // indigo
      '#8b5cf6', // violet
      '#a855f7', // purple
      '#ec4899', // pink
    ];
    
    // Create dot elements
    const dots = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const dot = document.createElement("div");
        
        // Assign random color from palette
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        dot.className = "rounded-full absolute";
        dot.style.width = `${dotSize}px`;
        dot.style.height = `${dotSize}px`;
        dot.style.left = `${col * (dotSize + gap)}px`;
        dot.style.top = `${row * (dotSize + gap)}px`;
        dot.style.backgroundColor = randomColor;
        dot.style.opacity = "0";
        dot.style.transform = "scale(0)";
        container.appendChild(dot);
        dots.push(dot);
      }
    }
    
    // Create letter elements for the text animation
    const portfolioText = "portfolio.";
    const letters = portfolioText.split("");
    
    // Clear text container
    text.innerHTML = "";
    
    // Create span for each letter
    const letterElements = letters.map(letter => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      span.style.transform = "translateY(20px)";
      text.appendChild(span);
      return span;
    });
    
    // Animate the dots with a wave effect
    tl.to(dots, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      stagger: {
        grid: [rows, cols],
        from: "center",
        amount: 0.8
      },
      ease: "power2.out"
    })
    .to(letterElements, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.04,
      ease: "power2.out"
    }, "-=0.3")
    .to(dots, {
      scale: function(i) {
        // Random scale between 0.5 and 1.5 for a more dynamic effect
        return 0.5 + Math.random();
      },
      duration: 1.5,
      stagger: {
        grid: [rows, cols],
        from: "random",
        amount: 0.5
      },
      repeat: 1,
      yoyo: true,
      ease: "sine.inOut"
    }, "-=0.5")
    .to(dots, {
      opacity: 0,
      scale: 0,
      duration: 0.5,
      stagger: {
        grid: [rows, cols],
        from: "center",
        amount: 0.8
      },
      ease: "power2.in"
    }, "+=0.5")
    .to(letterElements, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      stagger: 0.02,
      ease: "power2.in"
    }, "-=0.5");
    
    // Cleanup
    return () => {
      tl.kill();
      document.body.style.overflow = "auto";
      
      // Clean up the dynamically created elements
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [finishLoading]);
  
  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}
    >
      <div className="flex flex-col items-center">
        <div 
          ref={containerRef}
          className="mb-12"
        >
          {/* Dots will be dynamically created here */}
        </div>
        
        <div
          ref={textRef}
          className="text-xl md:text-2xl font-medium tracking-tighter text-foreground"
        >
          portfolio.
        </div>
      </div>
    </div>
  );
};

export default Loader; 