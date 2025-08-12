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

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setIsSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
      
      // Reset submission status after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Ensure ScrollTrigger is loaded
    if (typeof window !== "undefined") {
      import("gsap/ScrollTrigger").then(() => {
        const ctx = gsap.context(() => {
          // Animate heading
          gsap.fromTo(
            headingRef.current,
            { opacity: 0, x: -50 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              scrollTrigger: {
                trigger: headingRef.current,
                start: "top bottom-=100",
                end: "bottom center",
                toggleActions: "play none none reverse",
              },
            }
          );

          // Animate form elements with stagger
          gsap.fromTo(
            ".form-element",
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: formRef.current,
                start: "top bottom-=50",
                end: "bottom center",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        return () => ctx.revert();
      });
    }
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 md:py-32 px-6 md:px-12"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          ref={headingRef}
          className="text-3xl md:text-4xl font-medium tracking-tighter mb-8"
        >
          Let&apos;s work together
        </h2>
        
        <p className="text-foreground/70 mb-12 max-w-2xl">
          Have a project in mind or just want to chat? Feel free to reach out. I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-6 rounded-xl mb-8 text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium mb-1">Error sending message</h3>
            <p>{error}</p>
          </div>
        )}

        {isSubmitted ? (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-6 rounded-xl mb-8 text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-lg font-medium mb-1">Message sent successfully!</h3>
            <p>Thank you for reaching out. I&apos;ll get back to you as soon as possible.</p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="form-element">
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-foreground/20 bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Your name"
              />
            </div>
            
            <div className="form-element">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-foreground/20 bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div className="form-element">
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-foreground/20 bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                placeholder="Tell me about your project..."
              />
            </div>
            
            <div className="form-element">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-6 py-3 bg-foreground text-background font-medium rounded-lg border border-transparent hover:border-foreground transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin"></span>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
        
        <div className="mt-16 flex flex-col md:flex-row gap-8 justify-between">
          <div className="form-element">
            <h3 className="text-lg font-medium mb-2">Email</h3>
            <a href="mailto:athrian.pahang@gmail.com" className="text-foreground/70 hover:text-foreground transition-colors">
              athrian.pahang@gmail.com
            </a>
          </div>
          
          <div className="form-element">
            <h3 className="text-lg font-medium mb-2">Follow me</h3>
            <div className="flex gap-4">
              <a href="https://x.com/athrianp" className="text-foreground/70 hover:text-foreground transition-colors">
                Twitter
              </a>
              <a href="https://www.linkedin.com/in/athrian-judd-pahang-08b712370/" className="text-foreground/70 hover:text-foreground transition-colors">
                LinkedIn
              </a>
              <a href="https://github.com/athos777x" className="text-foreground/70 hover:text-foreground transition-colors">
                GitHub
              </a>
            </div>
          </div>
          
          <div className="form-element">  
            <h3 className="text-lg font-medium mb-2">Location</h3>
            <p className="text-foreground/70">
              Bohol, Philippines
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 