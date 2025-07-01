"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { initSmoothScrolling } from "@/utils/smoothScroll";

export default function Home() {
  // Use useEffect to handle client-side only state
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle mounting state to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Initialize smooth scrolling with offset for header height
    if (!isLoading && mounted) {
      initSmoothScrolling(80);
    }
  }, [isLoading, mounted]);

  // Don't render anything until client-side
  if (!mounted) return null;

  return (
    <>
      {isLoading ? (
        <Loader finishLoading={() => setIsLoading(false)} />
      ) : (
        <>
          <Header />
          <main>
            <Hero />
            <About />
            <Projects />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
