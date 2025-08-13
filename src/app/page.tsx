"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { initSmoothScrolling } from "@/utils/smoothScroll";
import { CursorProvider } from "@/contexts/CursorContext";

// Font configuration
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Dynamically import components to avoid hydration issues
const Hero = dynamic(() => import("@/components/Hero"), { ssr: false });
const FloatingBadge3D = dynamic(() => import("@/components/FloatingBadge3D"), { ssr: false });
const About = dynamic(() => import("@/components/About"), { ssr: false });
const Projects = dynamic(() => import("@/components/Projects"), { ssr: false });
const Contact = dynamic(() => import("@/components/Contact"), { ssr: false });
const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });

export default function Home() {
  // Use useEffect to handle client-side only state
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  // Handle mounting state to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle smooth transition from loader to content
  useEffect(() => {
    if (!isLoading && mounted) {
      // Delay showing content to allow animations to initialize
      const timer = setTimeout(() => {
        setContentVisible(true);
        // Initialize smooth scrolling after content is visible
        initSmoothScrolling(80);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, mounted]);

  // Don't render anything until client-side
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-xl text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <CursorProvider>
      <div className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        {/* Preload 3D Badge during loading screen (hidden) */}
        {isLoading && (
          <FloatingBadge3D 
            position="center-left" 
            size="large" 
            preloadMode={true} 
            customImage="/athos.jpg" // 👈 Your ID card photo
            customBandTexture="/my-band.jpg" // 👈 Your custom band texture (optional)
          />
        )}
        
        {isLoading ? (
          <Loader finishLoading={() => setIsLoading(false)} />
        ) : (
          <div 
            className={`transition-opacity duration-700 ease-in-out ${
              contentVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <CustomCursor />
            <FloatingBadge3D 
              position="center-left" 
              size="large" 
              showOnlyInSection="about" 
              customImage="/athos.jpg" // 👈 Your ID card photo
              customBandTexture="/my-band.jpg" // 👈 Your custom band texture (optional)
            />
            <Header />
            <main>
              <Hero />
              <About />
              <Projects />
              <Contact />
            </main>
            <Footer />
          </div>
        )}
      </div>
    </CursorProvider>
  );
}
