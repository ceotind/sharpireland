"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProcessStep {
  id: number;
  title: string;
  description: string;
}

const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: "Discovery",
    description: "We start by analyzing your business needs and project planning. We define the problem and scope of your result, as well as chart out essential functionality and milestones."
  },
  {
    id: 2,
    title: "Design and Development",
    description: "At this stage, we define the project details, including the necessary network requirements, databases, and architecture. Then, our web development team builds the product according to the predefined design requirements. Our ability to follow the initial concept efficiently makes us an excellent web development agency."
  },
  {
    id: 3,
    title: "Full-Cycle Testing",
    description: "Our top QA engineers ensure that end-user experience is impeccable and bug-free. We perform full testing, including front-end, database, and server testing, as well as other checks."
  },
  {
    id: 4,
    title: "Implementation",
    description: "Our programmers then deploy the solution into the target environment. After that, the solution is ready for production and is accessible for end-users worldwide."
  },
  {
    id: 5,
    title: "Maintenance",
    description: "Once your solution is deployed, our programmers monitor its performance and analyze user feedback to provide further improvements. We also implement any changes needed after deployment."
  }
];

export default function ProcessSection() {
  const {} = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % processSteps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Standardized GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header
      gsap.fromTo(
        ".process-header",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Animate content
      gsap.fromTo(
        ".process-content",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.1,
          scrollTrigger: {
            trigger: ".process-content",
            start: "top 80%",
            once: true,
          },
        }
      );

      // Animate 3D boxes with standardized timing
      gsap.fromTo(
        ".process-box",
        {
          opacity: 0,
          rotateX: -10,
          y: 20,
        },
        {
          opacity: 1,
          rotateX: 0,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
          delay: 0.2,
          scrollTrigger: {
            trigger: ".process-visualization",
            start: "top 80%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleStepChange = useCallback((index: number) => {
    setActiveStep(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  // const nextStep = () => {
  //   setActiveStep((prev) => (prev + 1) % processSteps.length);
  //   setIsAutoPlaying(false);
  //   setTimeout(() => setIsAutoPlaying(true), 10000);
  // };

  // const prevStep = () => {
  //   setActiveStep((prev) => (prev - 1 + processSteps.length) % processSteps.length);
  //   setIsAutoPlaying(false);
  //   setTimeout(() => setIsAutoPlaying(true), 10000);
  // };

  return (
    <section 
      ref={sectionRef}
      id="our-process" 
      className="bg-[var(--bg-100)] py-20 md:py-32"
    >
      <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
        {/* Section Header */}
        <div className="text-center process-header">
          <span className="text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium mb-4 block">
            Our Process
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[var(--foreground)]">
            Our Professional Web Development Process
          </h2>
        </div>

        {/* Process Content */}
        <div className="process-content grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">
          {/* Process Content */}
          <div className="order-2 lg:order-1 flex">
            <div className="text-left flex flex-col w-full h-full">
              <div className="flex-grow">
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-100)] mb-4">
                  {processSteps[activeStep]?.title}
                </h3>
                <p className="text-[var(--text-200)] text-lg leading-relaxed">
                  {processSteps[activeStep]?.description}
                </p>
              </div>
              
              {/* Progress Bar - Fixed at bottom */}
              <div className="max-w-md mt-8">
                <div className="w-full bg-[var(--bg-300)] rounded-full h-2">
                  <div 
                    className="bg-[var(--primary-100)] h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${((activeStep + 1) / processSteps.length) * 100}%`
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-[var(--text-200)]">
                  <span>Start</span>
                  <span>Complete</span>
                </div>
              </div>
            </div>
          </div>

          {/* Process Icons */}
          <div className="order-1 lg:order-2 process-visualization">
            <div className="max-w-md mx-auto">
              {/* Top Row - 3 containers */}
              <div className="grid grid-cols-3 gap-8 mb-12">
                {processSteps.slice(0, 3).map((step, index) => {
                  const isActive = index === activeStep;
                  
                  // Define icons for each step
                  const getStepIcon = (stepId: number) => {
                    switch (stepId) {
                      case 1: // Discovery
                        return (
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        );
                      case 2: // Design and Development
                        return (
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        );
                      case 3: // Full-Cycle Testing
                        return (
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        );
                      case 4: // Implementation
                        return (
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        );
                      case 5: // Maintenance
                        return (
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        );
                      default:
                        return null;
                    }
                  };

                  return (
                    <div
                      key={step.id}
                      className={`process-box cursor-pointer transition-all duration-300 group ${
                        isActive ? 'transform scale-105' : 'hover:scale-105'
                      }`}
                      onClick={() => handleStepChange(index)}
                    >
                      {/* Icon Container */}
                      <div className={`w-24 h-24 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-2xl ${
                        isActive
                          ? 'bg-[var(--primary-100)] text-[var(--bg-100)] shadow-2xl transform scale-110'
                          : 'bg-[var(--bg-200)] text-[var(--text-200)] border border-[var(--bg-300)] group-hover:border-[var(--primary-200)] group-hover:bg-[var(--bg-300)]'
                      }`}>
                        {getStepIcon(step.id)}
                      </div>

                      {/* Step Title */}
                      <div className="mt-5 text-center">
                        <span className={`text-sm font-semibold transition-colors duration-300 leading-tight ${
                          isActive
                            ? 'text-[var(--primary-100)]'
                            : 'text-[var(--text-200)] group-hover:text-[var(--text-100)]'
                          }`}>
                          {step.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Row - 2 containers centered */}
              <div className="flex justify-center gap-12">
                {processSteps.slice(3, 5).map((step, index) => {
                  const actualIndex = index + 3; // Adjust index for proper activeStep comparison
                  const isActive = actualIndex === activeStep;
                  
                  // Define icons for each step
                  const getStepIcon = (stepId: number) => {
                    switch (stepId) {
                      case 1: // Discovery
                        return (
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        );
                      case 2: // Design and Development
                        return (
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        );
                      case 3: // Full-Cycle Testing
                        return (
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        );
                      case 4: // Implementation
                        return (
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        );
                      case 5: // Maintenance
                        return (
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        );
                      default:
                        return null;
                    }
                  };

                  return (
                    <div
                      key={step.id}
                      className={`process-box cursor-pointer transition-all duration-300 group ${
                        isActive ? 'transform scale-105' : 'hover:scale-105'
                      }`}
                      onClick={() => handleStepChange(actualIndex)}
                    >
                      {/* Icon Container */}
                      <div className={`w-24 h-24 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-2xl ${
                        isActive
                          ? 'bg-[var(--primary-100)] text-[var(--bg-100)] shadow-2xl transform scale-110'
                          : 'bg-[var(--bg-200)] text-[var(--text-200)] border border-[var(--bg-300)] group-hover:border-[var(--primary-200)] group-hover:bg-[var(--bg-300)]'
                      }`}>
                        {getStepIcon(step.id)}
                      </div>

                      {/* Step Title */}
                      <div className="mt-5 text-center">
                        <span className={`text-sm font-semibold transition-colors duration-300 leading-tight ${
                          isActive
                            ? 'text-[var(--primary-100)]'
                            : 'text-[var(--text-200)] group-hover:text-[var(--text-100)]'
                          }`}>
                          {step.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
