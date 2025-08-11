"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  // Use dynamic import for ScrollTrigger
  import("gsap/ScrollTrigger").then((module) => {
    const { ScrollTrigger } = module;
    gsap.registerPlugin(ScrollTrigger);
  });
}

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial states for elements to prevent flash
    if (headingRef.current) {
      gsap.set(headingRef.current, { opacity: 0, x: -50 });
    }
    
    const contentBlocks = document.querySelectorAll('.content-block');
    contentBlocks.forEach(block => {
      gsap.set(block, { opacity: 0, y: 30 });
    });
    
    // Ensure ScrollTrigger is loaded
    if (typeof window !== "undefined") {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        // Make sure to refresh ScrollTrigger to pick up new elements
        ScrollTrigger.refresh();
        
        const ctx = gsap.context(() => {
          // Animate heading on scroll
          gsap.to(
            headingRef.current,
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

          // Animate content blocks with stagger
          gsap.to(
            ".content-block",
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: contentRef.current,
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
      id="about"
      ref={sectionRef}
      className="py-24 md:py-32 px-6 md:px-12"
    >
      <div className="max-w-6xl mx-auto">
        <h2
          ref={headingRef}
          className="text-3xl md:text-4xl font-medium tracking-tighter mb-16"
        >
          About me
        </h2>

        <div ref={contentRef} className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div className="content-block">
            <h3 className="text-xl font-medium mb-4">Background</h3>
            <p className="text-foreground/70 leading-relaxed">
              Hello, I&apos;m Athrian Judd Pahang, an aspiring front-end developer and a fresh graduate with a strong foundation in design and development. My journey began with a curiosity about how things work, which led me to pursue a degree in IT where I discovered my love for creating digital solutions that solve real-world problems.
            </p>
          </div>

          <div className="content-block">
            <h3 className="text-xl font-medium mb-4">Approach</h3>
            <p className="text-foreground/70 leading-relaxed">
              I believe in creating experiences that are both beautiful and functional. My process involves deep research, thoughtful design, and clean code. I&apos;m constantly learning and adapting to new technologies while maintaining a focus on accessibility and user-centered design.
            </p>
          </div>

          <div className="content-block">
            <h3 className="text-xl font-medium mb-4">Skills</h3>
            <ul className="grid grid-cols-2 gap-2 text-foreground/70">
              <li>UI/UX Design</li>
              <li>React / Next.js</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>GSAP Animations</li>
              <li>React Native</li>
              <li>Figma</li>
              <li>Flutter</li>
            </ul>
          </div>

          <div className="content-block">
            <h3 className="text-xl font-medium mb-4">Values</h3>
            <p className="text-foreground/70 leading-relaxed">
              I value simplicity, accessibility, and attention to detail. I believe that great design should be inclusive and that technology should enhance human experiences, not complicate them. I&apos;m committed to creating work that makes a positive impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 