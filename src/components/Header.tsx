"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header on load
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      // Animate nav items with stagger
      gsap.fromTo(
        ".nav-item",
        { opacity: 0, y: -10 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          stagger: 0.1, 
          ease: "power2.out",
          delay: 0.3
        }
      );
    });

    // Handle scroll events to change header appearance
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      ctx.revert();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header 
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center transition-all duration-300 ${
          isScrolled ? "bg-background/90" : "bg-transparent"
        }`}
      >
        <Link href="/" className="text-xl font-medium tracking-tighter">
          athos.
        </Link>
        
        <nav ref={navRef} className="hidden md:flex gap-8">
          {["work", "about", "projects", "contact"].map((item) => (
            <Link 
              key={item}
              href={`/#${item}`} 
              className="nav-item text-sm uppercase tracking-wider hover:text-foreground/70 transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>
        
        <button 
          className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col justify-between w-6 h-5 transform transition-all duration-300">
            <span 
              className={`bg-foreground h-0.5 w-full transform transition-all duration-300 origin-left ${
                isMobileMenuOpen ? "rotate-45 translate-x-px" : ""
              }`}
            />
            <span 
              className={`bg-foreground h-0.5 w-full transform transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span 
              className={`bg-foreground h-0.5 w-full transform transition-all duration-300 origin-left ${
                isMobileMenuOpen ? "-rotate-45 translate-x-px" : ""
              }`}
            />
          </div>
        </button>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};

export default Header;