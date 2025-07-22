import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

const TripleSwitchSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const [switches, setSwitches] = useState({
    fast: false,
    cheap: false,
    good: false
  });
  
  const handleSubmit = () => {
    const selected = Object.entries(switches)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    if (selected.length !== 2) {
      alert('Please select exactly two options');
      return;
    }

    let message = '';
    if (selected.includes('fast') && selected.includes('cheap')) {
      message = "Don't care about product., I need it fast and cheap. Build me";
    } else if (selected.includes('fast') && selected.includes('good')) {
      message = "I want to develop a great project but in a short time duration. Build me";
    } else if (selected.includes('cheap') && selected.includes('good')) {
      message = "I don't care about the time duration. Just build me";
    }
    
    // Update URL with message parameter
    router.push(`?message=${encodeURIComponent(message)}`, { scroll: false });
    
    // Scroll to contact section
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Handle switch toggling with mutual exclusion logic
  const handleToggle = (name: keyof typeof switches) => {
    setSwitches(prev => {
      const newState = { ...prev };
      
      // Toggle the clicked switch
      newState[name] = !prev[name];
      
      // Play sound on toggle
      playToggleSound();
      
      // Enforce mutual exclusion rules
      if (name === 'fast' && newState.fast) {
        if (newState.cheap) newState.good = false;
        if (newState.good) newState.cheap = false;
      }
      
      if (name === 'cheap' && newState.cheap) {
        if (newState.fast) newState.good = false;
        if (newState.good) newState.fast = false;
      }
      
      if (name === 'good' && newState.good) {
        if (newState.fast) newState.cheap = false;
        if (newState.cheap) newState.fast = false;
      }
      
      return newState;
    });
  };

  // Play toggle sound using Web Audio API
  const playToggleSound = () => {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, context.currentTime);
    gainNode.gain.setValueAtTime(0.1, context.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      context.close();
    }, 100);
  };

  // Animation setup
  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll('.animate-element');
    if (elements) {
      gsap.fromTo(elements, 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          }
        }
      );
    }
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="triple-switch" 
      className="bg-[var(--background)] py-12 md:py-32 px-2 sm:px-4"
    >
      <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-8 flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Left Column */}
        <div className="md:w-1/2 animate-element">
          <div className="text-center md:text-left">
            <span className="text-xs sm:text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">
              Project Constraints
            </span>
            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--foreground)]">
              Choose what you want
            </h2>
            <p className="mt-3 sm:mt-4 text-[var(--foreground)] text-sm sm:text-base md:text-lg opacity-80">
              You get what to aim for and what you choose to prioritize with Sharp Digital.
            </p>
          </div>
        </div>
        
        {/* Right Column - Switches */}
        <div className="md:w-1/2 flex flex-col gap-5 sm:gap-8 animate-element">
          {Object.entries(switches).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 sm:p-6 bg-[var(--bg-200)] rounded-xl border border-[var(--bg-300)]"
            >
              <span className="text-base sm:text-lg font-medium text-[var(--text-100)] capitalize">
                {key}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleToggle(key as keyof typeof switches)}
                  className="sr-only peer"
                />
                <div className="w-12 h-7 sm:w-14 sm:h-7 bg-[var(--bg-300)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[var(--accent-green)]"></div>
              </label>
            </div>
          ))}
          
          {/* Submit Button */}
          <div className="mt-2 sm:mt-4">
            <button
              onClick={handleSubmit}
              className="w-full px-6 py-3 bg-[var(--accent-green)] text-[var(--white-color)] rounded-lg font-semibold text-base sm:text-lg transition-colors hover:bg-[var(--accent-green-base)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 focus:ring-offset-[var(--background)]"
            >
              Submit Choices
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripleSwitchSection;