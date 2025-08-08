"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function HeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);

  const [bentoImages, setBentoImages] = useState<string[]>([]);

  // Fallbacks used if API fails or before load. Keep within public/ for Next/Image optimization.
  const DEFAULT_FALLBACKS = [
    "/images/bento_grid/brutalist_poster.webp",
    "/images/bento_grid/girl_sitting_on_car.webp",
    "/images/bento_grid/gradient_art.webp",
    "/images/bento_grid/landscape_view.webp",
    "/images/bento_grid/laptop_on_desk.webp",
    "/images/bento_grid/pixar_turtle.webp",
    "/images/bento_grid/working_on_laptop.webp",
  ] as const;

  // Absolute fallback string to satisfy strict indexing types
  const ABSOLUTE_FALLBACK = "/images/bento_grid/brutalist_poster.webp" as const;

  function sampleRandom<T>(arr: readonly T[], count: number): T[] {
    if (!arr || arr.length === 0) return [];
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = copy[i] as T;
      copy[i] = copy[j] as T;
      copy[j] = temp;
    }
    return copy.slice(0, Math.min(count, copy.length));
  }

  // Ensure we always have 5 items by topping up from defaults (future-proof if folder has fewer than 5)
  function ensureFive(arr: string[]): string[] {
    const res = [...arr];
    let i = 0;
    while (res.length < 5) {
      const idx = i % DEFAULT_FALLBACKS.length;
      const candidate = DEFAULT_FALLBACKS[idx] as string;
      if (candidate && !res.includes(candidate)) res.push(candidate);
      i++;
      if (i > DEFAULT_FALLBACKS.length * 3) break;
    }
    return res.slice(0, 5);
  }

  // Safe accessor for Image src with proper string fallback (handles noUncheckedIndexedAccess)
  function getImg(i: number): string {
    const fromState = bentoImages[i];
    if (fromState) return fromState;
    const fromDefaults = DEFAULT_FALLBACKS[i] as string | undefined;
    return fromDefaults ?? ABSOLUTE_FALLBACK;
  }

  // Fetch dynamic image list and pick 5 at every reload
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/bento-images", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load images");
        const data = await res.json();
        const files: string[] = Array.isArray(data?.images) ? data.images : [];
        const base = files.length ? files : Array.from(DEFAULT_FALLBACKS);
        const picks = sampleRandom<string>(base, 5);
        const ensured = ensureFive(picks);
        if (!cancelled) setBentoImages(ensured);
      } catch {
        const picks = sampleRandom<string>(Array.from(DEFAULT_FALLBACKS), 5);
        const ensured = ensureFive(picks);
        if (!cancelled) setBentoImages(ensured);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fade-in animation for key elements
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const anim = gsap.from(el.querySelectorAll(".animate-element"), {
      opacity: 0,
      y: 24,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out",
    });
    return () => {
      anim.kill();
    };
  }, []);

  return (
    <section
      id="hero-section"
      ref={heroRef}
      className="relative min-h-screen pt-36 overflow-hidden"
      aria-label="Venture studio hero"
    >
      {/* Base deep-teal gradient */}
      <div
        id="hero-bg-base"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, var(--bg-100) 0%, #f9fafb 40%, var(--bg-200) 100%)",
        }}
      />

      {/* Subtle full-width vertical bands */}
      <div
        id="hero-bg-bands"
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          opacity: 0.5,
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 78px, rgba(0,0,0,0.06) 78px, rgba(0,0,0,0.06) 96px)",
        }}
      />

      {/* Content container */}
      <div
        id="hero-container"
        className="relative z-10 w-full max-w-screen-xl mx-auto px-6 lg:px-8"
      >
        {/* Responsive 2-column layout: left content, right bento grid */}
        <div id="hero-content-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column - Existing content */}
          <div id="hero-left-col" className="lg:col-span-7 flex flex-col">
            {/* Announcement pill */}
            <div id="hero-announcement-wrap" className="animate-element">
              <div
                id="hero-announcement"
                className="inline-flex items-center gap-3 rounded-2xl border px-4 py-2"
                style={{
                  background: "var(--bg-100)",
                  borderColor: "var(--bg-300)",
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.6) inset, 0 6px 18px rgba(0,0,0,0.06)",
                }}
              >
                <span
                  id="hero-announcement-text"
                  className="text-[12px] tracking-[0.14em] uppercase text-[var(--text-200)]"
                >
                  Applications open for February
                </span>
                <span
                  id="hero-announcement-sep"
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--accent-green, #C0FF5A)" }}
                />
                <span
                  id="hero-announcement-chip"
                  className="text-[11px] font-bold leading-none rounded-md px-2.5 py-1"
                  style={{
                    color: "#0B1B14",
                    backgroundColor: "var(--accent-green, #C0FF5A)",
                    boxShadow: "0 8px 20px rgba(192,255,90,0.28)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  4 Spots Left
                </span>
              </div>
            </div>

            {/* Heading + subtext */}
            <div id="hero-copy-wrap" className="mt-8 animate-element">
              <h1
                id="hero-heading"
                className="text-[var(--text-100)] font-light leading-[1.08]"
                style={{
                  fontSize: "clamp(2.4rem, 6.2vw, 4.8rem)",
                  textShadow: "none",
                }}
              >
                AI-Driven Web Solutions for
                <br />
                Growth & Google Rankings
              </h1>

              <p
                id="hero-subtext"
                className="mt-6 max-w-3xl text-[1.0625rem] md:text-[1.125rem] leading-relaxed text-[var(--text-200)]"
              >
                High-performance websites powered by AI-driven innovation to grow your business with Sharp Digital.
              </p>

              {/* Action buttons */}
              <div
                id="hero-buttons"
                className="mt-8 flex flex-col sm:flex-row gap-4 animate-element"
              >
                <button
                  id="hero-btn-explore"
                  className="btn-primary px-8 py-4 rounded-xl text-base transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Explore Our Products
                </button>

                <button
                  id="hero-btn-book"
                  className="px-8 py-4 rounded-xl text-base font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "var(--text-100)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                  }}
                >
                  Book a Call
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Bento Grid */}
          <div id="hero-right-col" className="lg:col-span-5">
            <div id="hero-bento-wrap" className="hidden lg:block animate-element">
              <div
                id="hero-bento"
                className="grid grid-cols-6 auto-rows-[96px] gap-4"
                aria-label="Showcase grid"
              >
                {/* Large tile */}
                <div
                  id="bento-tile-1"
                  className="relative col-span-4 row-span-4 rounded-2xl overflow-hidden border"
                  style={{
                    background: "var(--bg-100)",
                    borderColor: "var(--bg-300)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                  }}
                >
                  <div id="bento-tile-1-inner" className="absolute inset-0">
                    <Image
                      id="bento-tile-1-img"
                      src={getImg(0)}
                      alt="Placeholder project 1"
                      fill
                      sizes="(min-width: 1024px) 420px, 100vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div
                    id="bento-tile-1-overlay"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.12) 100%)",
                    }}
                  />
                </div>

                {/* Small square */}
                <div
                  id="bento-tile-2"
                  className="relative col-span-2 row-span-2 rounded-2xl overflow-hidden border"
                  style={{
                    background: "var(--bg-100)",
                    borderColor: "var(--bg-300)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                  }}
                >
                  <div id="bento-tile-2-inner" className="absolute inset-0">
                    <Image
                      id="bento-tile-2-img"
                      src={getImg(1)}
                      alt="Placeholder project 2"
                      fill
                      sizes="(min-width: 1024px) 220px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div
                    id="bento-tile-2-overlay"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.10) 100%)",
                    }}
                  />
                </div>

                {/* Small square */}
                <div
                  id="bento-tile-3"
                  className="relative col-span-2 row-span-2 rounded-2xl overflow-hidden border"
                  style={{
                    background: "var(--bg-100)",
                    borderColor: "var(--bg-300)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                  }}
                >
                  <div id="bento-tile-3-inner" className="absolute inset-0">
                    <Image
                      id="bento-tile-3-img"
                      src={getImg(2)}
                      alt="Placeholder project 3"
                      fill
                      sizes="(min-width: 1024px) 220px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div
                    id="bento-tile-3-overlay"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.10) 100%)",
                    }}
                  />
                </div>

                {/* Wide tile */}
                <div
                  id="bento-tile-4"
                  className="relative col-span-3 row-span-2 rounded-2xl overflow-hidden border"
                  style={{
                    background: "var(--bg-100)",
                    borderColor: "var(--bg-300)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                  }}
                >
                  <div id="bento-tile-4-inner" className="absolute inset-0">
                    <Image
                      id="bento-tile-4-img"
                      src={getImg(3)}
                      alt="Placeholder project 4"
                      fill
                      sizes="(min-width: 1024px) 300px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div
                    id="bento-tile-4-overlay"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.10) 100%)",
                    }}
                  />
                </div>

                {/* Wide tile */}
                <div
                  id="bento-tile-5"
                  className="relative col-span-3 row-span-2 rounded-2xl overflow-hidden border"
                  style={{
                    background: "var(--bg-100)",
                    borderColor: "var(--bg-300)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                  }}
                >
                  <div id="bento-tile-5-inner" className="absolute inset-0">
                    <Image
                      id="bento-tile-5-img"
                      src={getImg(4)}
                      alt="Placeholder project 5"
                      fill
                      sizes="(min-width: 1024px) 300px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div
                    id="bento-tile-5-overlay"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.10) 100%)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vignette for edge softness */}
      <div
        id="hero-vignette"
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow:
            "inset 0 -60px 80px rgba(0,0,0,0.08), inset 0 60px 120px rgba(0,0,0,0.06)",
        }}
      />
    </section>
  );
}
