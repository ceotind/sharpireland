"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { heroElement, heroButton } from "../utils/motion-variants";

interface MobileHeroSectionProps {
  className?: string;
}

export default function MobileHeroSection({ className = "" }: MobileHeroSectionProps) {
  const router = useRouter();
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Fallback images in case API fails
  const FALLBACK_IMAGES = [
    "/images/bento_grid/brutalist_poster.webp",
    "/images/bento_grid/girl_sitting_on_car.webp",
    "/images/bento_grid/gradient_art.webp",
    "/images/bento_grid/landscape_view.webp",
    "/images/bento_grid/laptop_on_desk.webp",
    "/images/bento_grid/pixar_turtle.webp",
    "/images/bento_grid/working_on_laptop.webp",
  ] as const;

  // Fetch dynamic image list from API
  useEffect(() => {
    let cancelled = false;
    
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/bento-images", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load images");
        
        const data = await res.json();
        const images: string[] = Array.isArray(data?.images) ? data.images : [];
        const imagesToUse = images.length ? images : Array.from(FALLBACK_IMAGES);
        
        if (!cancelled) {
          setBackgroundImages(imagesToUse);
          setImagesLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        if (!cancelled) {
          setBackgroundImages(Array.from(FALLBACK_IMAGES));
          setImagesLoaded(true);
        }
      }
    };

    fetchImages();
    
    return () => {
      cancelled = true;
    };
  }, []);

  // Cycle through background images every 3 seconds with smooth fade
  useEffect(() => {
    if (!imagesLoaded || backgroundImages.length === 0) return;

    let intervalId: NodeJS.Timeout;
    
    const startNextCycle = () => {
      intervalId = setTimeout(() => {
        // Set next image index first
        setNextImageIndex((prev) => (prev + 1) % backgroundImages.length);
        
        // Start crossfade transition
        setIsTransitioning(true);
        
        // After fade completes, update current image and reset transition
        setTimeout(() => {
          setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
          setIsTransitioning(false);
          
          // Start the next cycle
          startNextCycle();
        }, 1000);
      }, 3000);
    };

    // Start the first cycle
    startNextCycle();

    return () => {
      if (intervalId) {
        clearTimeout(intervalId);
      }
    };
  }, [imagesLoaded, backgroundImages.length]);

  // Initialize next image index when images load
  useEffect(() => {
    if (backgroundImages.length > 0) {
      setNextImageIndex(1 % backgroundImages.length);
    }
  }, [backgroundImages.length]);

  // Get current background image with fallback
  const getCurrentImage = (): string => {
    if (backgroundImages.length === 0) {
      return FALLBACK_IMAGES[0];
    }
    return backgroundImages[currentImageIndex] || FALLBACK_IMAGES[0];
  };

  // Handle button clicks
  const handleExploreServices = () => {
    router.push("/services");
  };

  const handleBookCall = () => {
    router.push("/contact");
  };

  return (
    <section
      id="mobile-hero-section"
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
      aria-label="Mobile hero section"
    >
      {/* Dynamic background image with smooth crossfade transitions */}
      <div id="mobile-hero-bg-container" className="absolute inset-0 -z-10">
        {/* Current background image */}
        <div
          id="mobile-hero-bg-current"
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${getCurrentImage()})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: '#1a1a1a',
            opacity: isTransitioning ? 0 : 1,
          }}
        />
        
        {/* Next background image for crossfade */}
        <div
          id="mobile-hero-bg-next"
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${backgroundImages[nextImageIndex] || getCurrentImage()})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: isTransitioning ? 1 : 0,
          }}
        />
        
        {/* Noise texture overlay */}
        <div
          id="mobile-hero-noise"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay',
          }}
        />
        
        {/* Black gradient overlay for better text readability */}
        <div
          id="mobile-hero-bg-overlay"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)",
          }}
        />
      </div>

      {/* Content container */}
      <div
        id="mobile-hero-content-container"
        className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center"
      >
        {/* Main content */}
        <motion.div
          id="mobile-hero-content-wrap"
          variants={heroElement}
          initial="hidden"
          animate={imagesLoaded ? "visible" : "hidden"}
        >
          {/* Title */}
          <motion.h1
            id="mobile-hero-title"
            className="text-white font-bold leading-tight mb-6"
            style={{
              fontSize: "clamp(2rem, 8vw, 3rem)",
              color: "#ffffff",
            }}
            variants={heroElement}
          >
            AI-Driven Web Solutions for
            <br />
            Growth & Google Rankings
          </motion.h1>

          {/* Description */}
          <motion.p
            id="mobile-hero-description"
            className="text-white text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto"
            style={{
              color: "#ffffff",
            }}
            variants={heroElement}
          >
            High-performance websites powered by AI-driven innovation to grow your business with Sharp Digital.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            id="mobile-hero-buttons-container"
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={heroElement}
          >
            <motion.button
              id="mobile-hero-btn-explore"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-medium"
              style={{
                background: "var(--primary-100)",
                color: "var(--white-color)",
                boxShadow: "0 8px 32px rgba(15, 81, 221, 0.3)",
                minWidth: "200px",
              }}
              variants={heroButton}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={handleExploreServices}
            >
              Explore Our Services
            </motion.button>

            <motion.button
              id="mobile-hero-btn-book"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-medium"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                minWidth: "200px",
              }}
              variants={heroButton}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={handleBookCall}
            >
              Book a Call
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle vignette effect */}
      <div
        id="mobile-hero-vignette"
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow:
            "inset 0 -60px 80px rgba(0,0,0,0.1), inset 0 60px 120px rgba(0,0,0,0.08)",
        }}
      />
    </section>
  );
}