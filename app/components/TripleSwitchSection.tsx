'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

type SwitchKey = 'fast' | 'cheap' | 'good';

const ORDER: SwitchKey[] = ['fast', 'cheap', 'good'];

const LABELS: Record<SwitchKey, { title: string; desc: string; icon: React.ReactNode }> = {
  fast: {
    title: 'Fast',
    desc: 'Accelerated timelines and rapid delivery.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 13h7l-1.4 1.4a1 1 0 1 0 1.4 1.4l3.5-3.5a1 1 0 0 0 0-1.4L10 7.4A1 1 0 0 0 8.6 8.8L10 10H3a1 1 0 1 0 0 2zm18-6h-7a1 1 0 1 0 0 2h7a1 1 0 1 0 0-2zm-2 6h-5a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2zm-3 6h-4a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2z"/>
      </svg>
    ),
  },
  cheap: {
    title: 'Affordable',
    desc: 'Cost-effective approach within budget.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm1 17h-2v-2H9a1 1 0 1 1 0-2h2v-2H9a1 1 0 1 1 0-2h2V6h2v2h2a1 1 0 1 1 0 2h-2v2h2a1 1 0 1 1 0 2h-2v2z"/>
      </svg>
    ),
  },
  good: {
    title: 'Quality',
    desc: 'High craftsmanship and robust outcomes.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2l2.39 4.84L20 8.27l-3.9 3.8.92 5.36L12 15.9l-4.98 2.62.92-5.36L4 8.27l5.61-1.43L12 2z"/>
      </svg>
    ),
  },
};

const TripleSwitchSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();

  const [switches, setSwitches] = useState<Record<SwitchKey, boolean>>({
    fast: false,
    cheap: false,
    good: false,
  });

  const [error, setError] = useState<string>('');

  const selectedKeys = useMemo(
    () => (Object.entries(switches).filter(([_, v]) => v).map(([k]) => k) as SwitchKey[]),
    [switches]
  );
  const selectedCount = selectedKeys.length;
  const submitDisabled = selectedCount !== 2;

  const handleSubmit = () => {
    if (submitDisabled) {
      setError('Please select exactly two options.');
      return;
    }

    setError('');

    let message = '';
    const s = selectedKeys;

    if (s.includes('fast') && s.includes('cheap')) {
      message = "I don't prioritize premium quality. I need it fast and affordable. Build me.";
    } else if (s.includes('fast') && s.includes('good')) {
      message = 'I want a great result on a short timeline. Build me.';
    } else if (s.includes('cheap') && s.includes('good')) {
      message = "I'm flexible on timeline. Focus on quality within budget. Build me.";
    }

    // Update URL with message parameter
    router.push(`?message=${encodeURIComponent(message)}`, { scroll: false });

    // Scroll to contact section
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Handle switch toggling with mutual exclusion logic
  const handleToggle = (name: SwitchKey) => {
    setSwitches((prev) => {
      const newState = { ...prev };

      // Toggle the clicked switch
      newState[name] = !prev[name];

      // Clear any previous error
      setError('');

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
    try {
      // Guard for browser environments
      if (typeof window === 'undefined') return;

      const AudioContextClass =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, context.currentTime);
      gainNode.gain.setValueAtTime(0.08, context.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        context.close();
      }, 100);
    } catch {
      // Fail silently if audio cannot play
    }
  };

  // Animation setup
  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll('.animate-element');
    if (elements) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="triple-switch"
      className="bg-[var(--bg-100)] py-12 md:py-32 px-2 sm:px-4"
    >
      <div
        id="tripleswitch-div-1"
        className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-8 flex flex-col md:flex-row gap-8 md:gap-12"
      >
        {/* Left Column */}
        <div id="tripleswitch-div-2" className="md:w-1/2 animate-element">
          <div id="tripleswitch-div-3" className="text-center md:text-left">
            <span
              id="tripleswitch-div-4"
              className="text-xs sm:text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium"
            >
              Project Constraints
            </span>
            <h2
              id="tripleswitch-div-5"
              className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--text-100)]"
            >
              Choose what matters most
            </h2>
            <p
              id="tripleswitch-div-6"
              className="mt-3 sm:mt-4 text-[var(--text-100)] text-sm sm:text-base md:text-lg opacity-80"
            >
              The classic triangle: fast, affordable, and quality. Pick exactly two to shape how we
              deliver your project with Sharp Digital.
            </p>

            <div
              id="tripleswitch-div-7"
              className="mt-4 flex items-center justify-center md:justify-start gap-2"
            >
              <span
                id="tripleswitch-div-8"
                className="inline-flex items-center rounded-full border border-[var(--bg-300)] bg-[var(--bg-200)] px-3 py-1 text-xs sm:text-sm text-[var(--text-100)]"
              >
                Pick exactly two
              </span>
              <span
                id="tripleswitch-div-9"
                className="inline-flex items-center rounded-full border border-[var(--bg-300)] bg-[var(--bg-200)] px-3 py-1 text-xs sm:text-sm text-[var(--text-100)]"
              >
                Selected: {selectedCount}/2
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Switches */}
        <div id="tripleswitch-div-10" className="md:w-1/2 flex flex-col gap-5 sm:gap-6 animate-element">
          {error && (
            <div
              id="tripleswitch-div-11"
              role="status"
              aria-live="assertive"
              className="rounded-lg border border-[var(--accent-green)]/40 bg-[var(--bg-200)] px-4 py-3 text-sm text-[var(--text-100)]"
            >
              {error}
            </div>
          )}

          {ORDER.map((key, index) => {
            const selected = switches[key];
            const baseId = 30 + index * 10; // Reserve 4 ids per card to keep uniqueness
            return (
              <div
                key={key}
                id={`tripleswitch-div-${baseId}`}
                className={`group relative z-0 flex items-center justify-between gap-4 p-5 sm:p-6 rounded-xl border bg-[var(--bg-200)] border-[var(--bg-300)] shadow-sm transition 
                hover:shadow-md overflow-hidden ${
                  selected ? 'ring-1 ring-[var(--accent-green)] border-[var(--accent-green)]' : ''
                }`}
              >
                {/* Accent glow when selected */}
                <div
                  id={`tripleswitch-div-${baseId + 1}`}
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 -z-10
                    ${selected ? 'opacity-10 bg-[var(--accent-green)]' : ''}`}
                />

                <div id={`tripleswitch-div-${baseId + 2}`} className="flex items-start gap-4">
                  <div
                    id={`tripleswitch-div-${baseId + 3}`}
                    className={`relative z-20 grid h-10 w-10 place-items-center rounded-lg border transition shadow-sm [&_svg]:w-6 [&_svg]:h-6 [&_svg]:opacity-100
                      ${
                        selected
                          ? 'bg-[var(--accent-green)] text-[var(--white-color)] border-[var(--accent-green)] shadow-md'
                          : 'bg-[var(--bg-300)] text-[var(--text-100)] border-[var(--bg-300)]'
                      }`}
                  >
                    {LABELS[key].icon}
                  </div>

                  <div id={`tripleswitch-div-${baseId + 4}`} className="relative z-10 flex-1">
                    <div id={`tripleswitch-div-${baseId + 5}`} className="text-base sm:text-lg font-semibold text-[var(--text-100)]">
                      {LABELS[key].title}
                    </div>
                    <p className="mt-1 text-xs sm:text-sm text-[var(--text-100)] opacity-80">
                      {LABELS[key].desc}
                    </p>
                  </div>
                </div>

                <label className="relative z-10 inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={selected}
                    onChange={() => handleToggle(key)}
                    aria-label={`Toggle ${LABELS[key].title}`}
                  />
                  <div id={`tripleswitch-div-${baseId + 6}`} className={`relative z-20 w-14 h-8 sm:w-16 sm:h-8 rounded-full transition-colors shadow-inner border
                      ${
                        selected
                          ? 'bg-[var(--accent-green)] border-[var(--accent-green)]'
                          : 'bg-[var(--bg-300)] border-[var(--bg-300)]'
                      }
                      peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--accent-green)] peer-focus:ring-offset-2 peer-focus:ring-offset-[var(--bg-100)]
                      after:content-[''] after:absolute after:h-7 after:w-7 sm:after:h-7 sm:after:w-7 after:rounded-full after:top-0.5 after:left-0.5 after:bg-[var(--white-color)] after:transition-all after:shadow-[0_1px_1px_rgba(0,0,0,0.25),0_2px_8px_rgba(0,0,0,0.2)] after:border after:border-[var(--bg-300)]
                      ${selected ? 'after:translate-x-[24px] sm:after:translate-x-[32px]' : ''}`}
                  />
                </label>
              </div>
            );
          })}

          {/* Submit Button */}
          <div id="tripleswitch-div-24" className="mt-2 sm:mt-4">
            <button
              onClick={handleSubmit}
              id="tripleswitch-div-25"
              disabled={submitDisabled}
              className={`w-full px-6 py-3 rounded-lg font-semibold text-base sm:text-lg transition 
                focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 focus:ring-offset-[var(--bg-100)]
                ${
                  submitDisabled
                    ? 'bg-[var(--bg-300)] text-[var(--text-100)] opacity-60 cursor-not-allowed'
                    : 'bg-[var(--accent-green)] text-[var(--white-color)] hover:bg-[var(--accent-green-base)]'
                }`}
            >
              Submit Choices
            </button>
            <div
              id="tripleswitch-div-26"
              className="mt-2 text-xs sm:text-sm text-[var(--text-100)] opacity-70 text-center md:text-left"
            >
              Tip: Your selection updates the contact section with a tailored message.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripleSwitchSection;