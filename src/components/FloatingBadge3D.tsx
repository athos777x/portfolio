"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the Badge3D component to avoid SSR issues
const Badge3D = dynamic(() => import("./Badge3D"), {
  ssr: false,
  loading: () => null // No loading state needed for floating badge
});

interface FloatingBadge3DProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center-right' | 'center-left';
  size?: 'small' | 'medium' | 'large' | 'xl';
  debug?: boolean;
  showOnlyInSection?: string; // ID of the section where badge should be visible
  preloadMode?: boolean; // For preloading during loading screen
}

const FloatingBadge3D = ({ 
  position = 'top-right', 
  size = 'medium',
  debug = false,
  showOnlyInSection,
  preloadMode = false
}: FloatingBadge3DProps) => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(!showOnlyInSection); // Show by default if no section specified

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !showOnlyInSection || preloadMode) return;

    const handleScroll = () => {
      const section = document.getElementById(showOnlyInSection);
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Show badge when section is in viewport (with some threshold)
      const isInView = rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2;
      setIsVisible(isInView);
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mounted, showOnlyInSection, preloadMode]);

  if (!mounted) {
    return null;
  }

  // In preload mode, always render but invisible
  if (preloadMode) {
    return (
      <div className="fixed inset-0 z-[-10] opacity-0 pointer-events-none">
        <Badge3D debug={debug} initialPosition={position} />
      </div>
    );
  }

  if (!isVisible) {
    return null;
  }

  // Size configurations
  const sizeClasses = {
    small: 'w-32 h-40',
    medium: 'w-48 h-60',
    large: 'w-72 h-96',
    xl: 'w-96 h-[32rem]'
  };

  // Position configurations
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'center-right': 'top-1/2 right-4 -translate-y-1/2'
  };

  return (
    <div 
      className={`
        fixed inset-0 z-50 pointer-events-none
        transition-all duration-700 ease-in-out
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-32'
        }
      `}
      style={{ 
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
        transformOrigin: 'center top'
      }}
    >
      <Badge3D debug={debug} initialPosition={position} />
    </div>
  );
};

export default FloatingBadge3D;
