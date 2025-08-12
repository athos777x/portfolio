"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useCursor } from "@/contexts/CursorContext";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { cursorState } = useCursor();
  
  useEffect(() => {
    // Check if window is defined (client-side only)
    if (typeof window === 'undefined') return;
    
    // Check if cursor refs are available
    if (!cursorRef.current || !cursorDotRef.current) return;
    
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    
    // Detect initial color scheme
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);
    
    // Listen for changes in color scheme
    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    darkModeMediaQuery.addEventListener('change', handleColorSchemeChange);
    
    // Hide default cursor on the body and all elements
    document.body.style.cursor = "none";
    
    // Apply cursor: none to all interactive elements
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      a, button, input, textarea, [role="button"], label, select, [tabindex]:not([tabindex="-1"]) {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleEl);
    
    // Variables for cursor position
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Update cursor position on mouse move
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    // Handle links and clickable elements hover
    const onElementHover = () => {
      gsap.to(cursor, {
        scale: 1.5,
        opacity: 0.8,
        backgroundColor: isDarkMode ? "rgba(237, 237, 237, 0.2)" : "rgba(23, 23, 23, 0.2)",
        borderColor: isDarkMode ? "#ededed" : "#171717",
        duration: 0.3,
      });
    };
    
    const onElementLeave = () => {
      gsap.to(cursor, {
        scale: 1,
        opacity: 1,
        backgroundColor: "transparent",
        borderColor: isDarkMode ? "#ededed" : "#171717",
        duration: 0.3,
      });
    };
    
    // Add event listeners
    document.addEventListener("mousemove", onMouseMove);
    
    // Add hover effect to all links and buttons
    const interactiveElements = document.querySelectorAll(
      "a, button, input, textarea, [role='button'], label, select, [tabindex]:not([tabindex='-1'])"
    );
    
    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", onElementHover);
      element.addEventListener("mouseleave", onElementLeave);
    });
    
    // Animation loop for smooth cursor movement
    const animate = () => {
      // Smooth interpolation for main cursor
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      
      // Update cursor position
      gsap.set(cursor, {
        x: cursorX,
        y: cursorY,
      });
      
      // Update dot position (follows mouse exactly)
      gsap.set(cursorDot, {
        x: mouseX,
        y: mouseY,
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.body.style.cursor = "auto";
      document.head.removeChild(styleEl);
      darkModeMediaQuery.removeEventListener('change', handleColorSchemeChange);
      
      interactiveElements.forEach((element) => {
        element.removeEventListener("mouseenter", onElementHover);
        element.removeEventListener("mouseleave", onElementLeave);
      });
    };
  }, [isDarkMode]);

  // Handle cursor state changes from 3D badge
  useEffect(() => {
    if (!cursorRef.current) return;
    
    const cursor = cursorRef.current;
    
    switch (cursorState) {
      case 'hover':
        gsap.to(cursor, {
          scale: 1.8,
          opacity: 0.7,
          backgroundColor: isDarkMode ? "rgba(237, 237, 237, 0.1)" : "rgba(23, 23, 23, 0.1)",
          borderColor: isDarkMode ? "#ededed" : "#171717",
          borderWidth: "3px",
          duration: 0.3,
        });
        break;
      case 'grabbing':
        gsap.to(cursor, {
          scale: 1.3,
          opacity: 0.9,
          backgroundColor: isDarkMode ? "rgba(237, 237, 237, 0.3)" : "rgba(23, 23, 23, 0.3)",
          borderColor: isDarkMode ? "#ededed" : "#171717",
          borderWidth: "2px",
          duration: 0.2,
        });
        break;
      case 'default':
      default:
        gsap.to(cursor, {
          scale: 1,
          opacity: 1,
          backgroundColor: "transparent",
          borderColor: isDarkMode ? "#ededed" : "#171717",
          borderWidth: "2px",
          duration: 0.3,
        });
        break;
    }
  }, [cursorState, isDarkMode]);
  
  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ borderColor: isDarkMode ? '#ededed' : '#171717' }}
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: isDarkMode ? '#ededed' : '#171717' }}
      />
    </>
  );
};

export default CustomCursor; 