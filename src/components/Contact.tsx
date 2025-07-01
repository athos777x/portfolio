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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
      
      // Reset submission status after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  useEffect(() => {
    // Ensure ScrollTrigger is loaded
    if (typeof window !== "undefined") {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
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
          Let's work together
        </h2>
        
        <p className="text-foreground/70 mb-12 max-w-2xl">
          Have a project in mind or just want to chat? Feel free to reach out. I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>

        {isSubmitted ? (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-6 rounded-xl mb-8 text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-lg font-medium mb-1">Message sent successfully!</h3>
            <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
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
                className="px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        )}
        
        <div className="mt-16 flex flex-col md:flex-row gap-8 justify-between">
          <div className="form-element">
            <h3 className="text-lg font-medium mb-2">Email</h3>
            <a href="mailto:hello@example.com" className="text-foreground/70 hover:text-foreground transition-colors">
              hello@example.com
            </a>
          </div>
          
          <div className="form-element">
            <h3 className="text-lg font-medium mb-2">Follow me</h3>
            <div className="flex gap-4">
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
          
          <div className="form-element">
            <h3 className="text-lg font-medium mb-2">Location</h3>
            <p className="text-foreground/70">
              New York, NY
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 