"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  // Use dynamic import for ScrollTrigger
  import("gsap/ScrollTrigger").then((module) => {
    const { ScrollTrigger } = module;
    gsap.registerPlugin(ScrollTrigger);
  });
}

// Sample project data
const projects = [
  {
    id: 1,
    title: "LNHS Portal",
    description: "School portal for Lourdes National High School.",
    tags: ["Reactjs", "Javascript", "CSS", "SQL"],
    image: "/next.svg", // Replace with actual project image
    link: "#",
  },
  {
    id: 2,
    title: "LNHS Mobile App",
    description: "Mobile application for Lourdes National High School with QR code attendance.",
    tags: ["React Native", "TypeScript", "Javascript", "SQL"],
    image: "/vercel.svg", // Replace with actual project image
    link: "#",
  },
  {
    id: 3,
    title: "HYP App",
    description: "Hypertension and medicine tracker app with maps integration.",
    tags: ["Flutter", "TypeScript", "Dart", "Firebase"],
    image: "/next.svg", // Replace with actual project image
    link: "#",
  },
];

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial states for elements to prevent flash
    if (headingRef.current) {
      gsap.set(headingRef.current, { opacity: 0, x: -50 });
    }
    
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      gsap.set(card, { opacity: 0, y: 50 });
    });
    
    // Ensure ScrollTrigger is loaded
    if (typeof window !== "undefined") {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        // Make sure to refresh ScrollTrigger to pick up new elements
        ScrollTrigger.refresh();
        
        const ctx = gsap.context(() => {
          // Animate heading
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

          // Animate project cards
          gsap.to(
            ".project-card",
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: projectsRef.current,
                start: "top bottom-=50",
                end: "center center",
                toggleActions: "play none none reverse",
              },
            }
          );

          // Add hover effect for project cards
          document.querySelectorAll(".project-card").forEach((card) => {
            card.addEventListener("mouseenter", () => {
              gsap.to(card, {
                y: -10,
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                duration: 0.3,
                ease: "power2.out",
              });
            });

            card.addEventListener("mouseleave", () => {
              gsap.to(card, {
                y: 0,
                scale: 1,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                duration: 0.3,
                ease: "power2.out",
              });
            });
          });
        });

        return () => ctx.revert();
      });
    }
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-24 md:py-32 px-6 md:px-12 bg-foreground/5"
    >
      <div className="max-w-6xl mx-auto">
        <h2
          ref={headingRef}
          className="text-3xl md:text-4xl font-medium tracking-tighter mb-16"
        >
          Featured Projects
        </h2>

        <div
          ref={projectsRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.link}
              className="project-card group block bg-background rounded-xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl"
            >
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium mb-2">{project.title}</h3>
                <p className="text-foreground/70 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-foreground/10 text-foreground/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects; 