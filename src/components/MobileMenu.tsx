"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLUListElement>(null);
  const [timeline] = useState(() => gsap.timeline({ paused: true }));
  
  useEffect(() => {
    if (!menuRef.current || !menuItemsRef.current) return;
    
    const menu = menuRef.current;
    const menuItems = menuItemsRef.current.querySelectorAll("li");
    
    // Set up animations
    timeline
      .to(menu, {
        y: "0%",
        duration: 0.6,
        ease: "power3.inOut",
      })
      .fromTo(
        menuItems,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.2"
      );
    
    // Control animation based on isOpen state
    if (isOpen) {
      // Prevent scrolling when menu is open
      document.body.style.overflow = "hidden";
      timeline.play();
    } else {
      document.body.style.overflow = "auto";
      timeline.reverse();
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, timeline]);
  
  // Handle link clicks
  const handleLinkClick = () => {
    onClose();
  };
  
  return (
    <div
      ref={menuRef}
      className={`fixed inset-0 z-40 bg-background transform translate-y-full ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div className="flex flex-col h-full p-8 pt-24">
        <ul ref={menuItemsRef} className="space-y-6 text-2xl font-medium">
          {["about", "work", "projects", "contact"].map((item) => (
            <li key={item}>
              <Link
                href={`/#${item}`}
                onClick={handleLinkClick}
                className="block uppercase tracking-wider hover:text-foreground/70 transition-colors"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto">
          <div className="border-t border-foreground/10 pt-6 mt-6">
            <h3 className="text-lg font-medium mb-4">Connect</h3>
            <div className="flex gap-4 text-sm">
              <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                Twitter
              </a>
              <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu; 