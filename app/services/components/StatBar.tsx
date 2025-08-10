"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Define the interface for a single stat item
interface StatItem {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

// Define the props for the StatBar component
interface StatBarProps {
  id: string;
  stats: StatItem[];
  animationDelay?: number;
  className?: string;
}

export default function StatBar({ id, stats, animationDelay = 0, className = "" }: StatBarProps) {
  const statBarRef = useRef<HTMLDivElement | null>(null);
  const countersAnimated = useRef(false);

  // GSAP animation to count from 0 to target values
  useEffect(() => {
    const el = statBarRef.current;
    if (!el) return;

    // Create GSAP context for proper cleanup
    const ctx = gsap.context(() => {
      // Set up ScrollTrigger for the animation
      const counterElements = el.querySelectorAll(".stat-counter");
      
      if (counterElements.length > 0 && !countersAnimated.current) {
        // Animate each counter with staggered start
        gsap.fromTo(
          counterElements,
          { innerHTML: "0" },
          {
            innerHTML: (index: number) => stats[index]?.value.toString() || "0",
            duration: 0.6,
            ease: "power2.out",
            delay: animationDelay,
            stagger: 0.1,
            onUpdate: function(this: any) {
              // Format the number with commas and add prefix/suffix
              const statIndex = Array.from(counterElements).indexOf(this.targets()[0]);
              const stat = stats[statIndex];
              if (stat) {
                const value = Math.round(this.targets()[0].innerHTML);
                const formattedValue = value.toLocaleString();
                this.targets()[0].innerHTML = `${stat.prefix || ""}${formattedValue}${stat.suffix || ""}`;
              }
            },
            onComplete: () => {
              countersAnimated.current = true;
            },
          }
        );

        // Animate the container and labels
        gsap.fromTo(
          el.querySelectorAll(".animate-element"),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            delay: animationDelay,
          }
        );
      }
    }, el);

    // Cleanup function
    return () => {
      ctx.revert();
    };
  }, [stats, animationDelay]);

  return (
    <div 
      id={id} 
      ref={statBarRef} 
      className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(stats.length, 4)} gap-6 ${className}`}
      aria-label="Key performance indicators"
    >
      {stats.map((stat) => (
        <div 
          key={stat.id} 
          id={`${id}-stat-${stat.id}`} 
          className="animate-element bg-[var(--bg-200)] p-6 rounded-lg border border-[var(--bg-300)] shadow-sm flex flex-col items-center text-center"
        >
          <div 
            id={`${id}-stat-${stat.id}-value-container`} 
            className="mb-2"
          >
            <span 
              id={`${id}-stat-${stat.id}-value`} 
              className="stat-counter text-4xl md:text-5xl font-bold text-[var(--text-100)] font-anton"
              aria-live="polite"
            >
              {stat.prefix || ""}{0}{stat.suffix || ""}
            </span>
          </div>
          <div 
            id={`${id}-stat-${stat.id}-label-container`}
            className="mt-1"
          >
            <span 
              id={`${id}-stat-${stat.id}-label`} 
              className="text-sm md:text-base text-[var(--text-200)] font-medium uppercase tracking-wide font-inter"
            >
              {stat.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}