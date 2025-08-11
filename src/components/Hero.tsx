"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  // Use dynamic import for ScrollTrigger
  import("gsap/ScrollTrigger").then((module) => {
    const { ScrollTrigger } = module;
    gsap.registerPlugin(ScrollTrigger);
  });
}

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [isAnimationReady, setIsAnimationReady] = useState(false);

  // Set initial states for elements to prevent flash of unstyled content
  useEffect(() => {
    if (titleRef.current) {
      gsap.set(titleRef.current, { opacity: 0, y: 30 });
    }
    if (subtitleRef.current) {
      gsap.set(subtitleRef.current, { opacity: 0 });
    }
    if (scrollIndicatorRef.current) {
      gsap.set(scrollIndicatorRef.current, { opacity: 0, y: -10 });
    }
    
    // Mark animation as ready after a brief delay
    const timer = setTimeout(() => {
      setIsAnimationReady(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  // Run animations once elements are ready
  useEffect(() => {
    if (!isAnimationReady) return;
    
    const ctx = gsap.context(() => {
      // Animate title
      gsap.to(
        titleRef.current,
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
      );

      // Animate subtitle
      gsap.to(
        subtitleRef.current,
        { opacity: 1, duration: 1, ease: "power2.out", delay: 0.7 }
      );

      // Animate scroll indicator
      gsap.to(
        scrollIndicatorRef.current,
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          delay: 1.2,
          ease: "power2.out",
          yoyo: true,
          repeat: -1,
          repeatDelay: 0.5
        }
      );
    });

    return () => ctx.revert();
  }, [isAnimationReady]);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-24 pb-12"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 
          ref={titleRef}
          className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter mb-6"
        >
          Creating digital experiences that <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">inspire</span>
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto"
        >
          I&apos;m a designer & developer crafting beautiful, functional websites and applications with a focus on user experience, minimalism and modern aesthetics.
        </p>
      </div>
      
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-12 flex flex-col items-center"
      >
        <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
        <svg 
          width="16" 
          height="24" 
          viewBox="0 0 16 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M8 4V20M8 20L3 15M8 20L13 15" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero; 