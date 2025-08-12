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
}

const FloatingBadge3D = ({ 
  position = 'top-right', 
  size = 'medium',
  debug = false 
}: FloatingBadge3DProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
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
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ 
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
      }}
    >
      <Badge3D debug={debug} initialPosition={position} />
    </div>
  );
};

export default FloatingBadge3D;
