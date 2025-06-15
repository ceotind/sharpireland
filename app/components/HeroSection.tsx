"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";

export default function HeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);
  const cometRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [glowOpacity, setGlowOpacity] = useState(0);

  // Animate text on mount with standardized timing
  useEffect(() => {
    const el = heroRef.current;
    if (el) {
      const animation = gsap.from(el.querySelectorAll("h1, p, a"), {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
      });
      
      return () => {
        animation.kill();
      };
    }
  }, []);

  // Infinite glow animation effect
  useEffect(() => {
    const glowAnimation = () => {
      // Extremely smooth fade in (3 seconds)
      gsap.to({ opacity: 0 }, {
        opacity: 1,
        duration: 3,
        ease: "power2.inOut",
        onUpdate: function() {
          setGlowOpacity(this.targets()[0].opacity);
        },
        onComplete: () => {
          // Stay at full glow for 8 seconds
          setTimeout(() => {
            // Extremely smooth fade out (3 seconds)
            gsap.to({ opacity: 1 }, {
              opacity: 0,
              duration: 3,
              ease: "power2.inOut",
              onUpdate: function() {
                setGlowOpacity(this.targets()[0].opacity);
              },
              onComplete: () => {
                // Wait 2 seconds then restart the cycle
                setTimeout(glowAnimation, 2000);
              }
            });
          }, 8000);
        }
      });
    };

    // Start the first cycle after 1.5 seconds
    const timer = setTimeout(glowAnimation, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Comet animation logic
    useEffect(() => {
      const canvas = cometRef.current;
      if (!canvas) return;

      let width = window.innerWidth;
      let height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      let cometX = width / 2;
      let cometY = height / 2;
      let targetX = cometX;
      let targetY = cometY;

      // Store previous positions for a flowing tail
      const tailHistory: { x: number; y: number }[] = [];
      const maxTailPoints = 100;

      const ctx = canvas.getContext("2d")!;
      let animationFrame: number;

      // Fade-out state for smooth disappearance
      let fadeOut = 1;

      function drawComet() {
        ctx.clearRect(0, 0, width, height);

        // Disappearance threshold
        const atRest =
          Math.abs(cometX - targetX) < 8 && Math.abs(cometY - targetY) < 8;

        // Smoothly fade out when at rest, fade in when moving
        if (atRest) {
          fadeOut = Math.max(0, fadeOut - 0.04);
        } else {
          fadeOut = Math.min(1, fadeOut + 0.08);
        }
        if (fadeOut <= 0.01) return;

        // Draw tail as a smooth curve with gradient from #0f51dd to transparent and noise texture
        if (tailHistory.length > 2) {
          ctx.save();
          ctx.lineCap = "round";
          for (let i = tailHistory.length - 1; i > 1; i--) {
            const p0 = tailHistory[i];
            const p1 = tailHistory[i - 1];
            const p2 = tailHistory[i - 2];
            const t = i / tailHistory.length;
            // Fade tail out after tip
            const tailAlpha = 0.18 * t * fadeOut * Math.max(0, (tailHistory.length - i) / tailHistory.length + fadeOut);
            ctx.beginPath();
            ctx.globalAlpha = tailAlpha;
            ctx.lineWidth = 64 * t;
            // Gradient: tip is #0f51dd, tail is transparent
            const grad = ctx.createLinearGradient(p1.x, p1.y, p0.x, p0.y);
            grad.addColorStop(0, "#0f51dd");
            grad.addColorStop(1, "rgba(15,81,221,0)");
            ctx.strokeStyle = grad;
            // Quadratic curve for smoothness
            ctx.moveTo(p2.x, p2.y);
            ctx.quadraticCurveTo(p1.x, p1.y, p0.x, p0.y);
            ctx.stroke();

            // Add noise texture along the trail
            for (let n = 0; n < 8; n++) {
              const noiseT = Math.random();
              const nx =
                p2.x +
                (p1.x - p2.x) * noiseT +
                (Math.random() - 0.5) * 8 * (1 - t);
              const ny =
                p2.y +
                (p1.y - p2.y) * noiseT +
                (Math.random() - 0.5) * 8 * (1 - t);
              ctx.save();
              ctx.globalAlpha = (0.03 + 0.07 * t) * Math.random() * fadeOut;
              ctx.beginPath();
              ctx.arc(nx, ny, 1.2 + Math.random() * 1.5 * t, 0, Math.PI * 2);
              ctx.fillStyle = "#0f51dd";
              ctx.fill();
              ctx.restore();
            }
          }
          ctx.restore();
        }

        // Comet head: dense, gradient-filled, visually consistent with trail
        for (let i = 0; i < 16; i++) {
          ctx.save();
          const r = 32 - (i * 2);
          // Fade tip first, then tail
          const alpha = (0.12 + 0.06 * (1 - i / 16)) * fadeOut;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(cometX, cometY, r, 0, Math.PI * 2);
          // Use same gradient as trail for fill
          const grad = ctx.createRadialGradient(cometX, cometY, 0, cometX, cometY, r);
          grad.addColorStop(0, "#0f51dd");
          grad.addColorStop(1, "rgba(15,81,221,0)");
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.restore();
        }
      }

      function animate() {
        // Slower and smoother movement for more natural turns
        cometX += (targetX - cometX) * 0.025;
        cometY += (targetY - cometY) * 0.025;

        // Add current position to tail history
        tailHistory.push({ x: cometX, y: cometY });
        if (tailHistory.length > maxTailPoints) {
          tailHistory.shift();
        }

        drawComet();
        animationFrame = requestAnimationFrame(animate);
      }

    function handleMouse(e: MouseEvent) {
      // Quantize cursor position to reduce precision and sudden movements
      const grid = 24;
      targetX = Math.round(e.clientX / grid) * grid;
      targetY = Math.round(e.clientY / grid) * grid;
    }

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    }

    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, [theme]);

  // --- Responsive hero text logic ---
  const firstLineRef = useRef<HTMLSpanElement | null>(null);
  const secondLineRef = useRef<HTMLSpanElement | null>(null);
  const [firstLineWidth, setFirstLineWidth] = useState<number | null>(null);
  const [secondLineFontSize, setSecondLineFontSize] = useState<string>("clamp(2.5rem, 10vw, 8rem)");

  useEffect(() => {
    function updateWidthsAndFont() {
      if (!firstLineRef.current || !secondLineRef.current) return;
      const width = firstLineRef.current.offsetWidth;
      setFirstLineWidth(width);

      // Dynamically increase font size of second line to match width
      const testSpan = secondLineRef.current;
      let min = 10;
      let max = 300;
      let best = min;
      let tries = 0;
      testSpan.style.fontSize = min + "px";
      testSpan.style.width = "auto";
      testSpan.style.display = "inline-block";
      testSpan.style.whiteSpace = "nowrap";
      // Binary search for best font size
      while (min <= max && tries < 20) {
        const mid = Math.floor((min + max) / 2);
        testSpan.style.fontSize = mid + "px";
        const testWidth = testSpan.offsetWidth;
        if (Math.abs(testWidth - width) <= 2) {
          best = mid;
          break;
        }
        if (testWidth < width) {
          best = mid;
          min = mid + 1;
        } else {
          max = mid - 1;
        }
        tries++;
      }
      testSpan.style.fontSize = best + "px";
      setSecondLineFontSize(best + "px");
    }

    updateWidthsAndFont();
    window.addEventListener("resize", updateWidthsAndFont);
    return () => window.removeEventListener("resize", updateWidthsAndFont);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen h-screen flex items-center justify-center bg-[var(--background)] overflow-hidden pt-16"
      style={{ width: "100vw", height: "100vh" }}
    >
      {/* Comet Canvas */}
      <canvas
        ref={cometRef}
        className="pointer-events-none absolute inset-0 w-full h-full z-0"
        aria-hidden="true"
      />
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 h-full">
        <div className="flex flex-col items-center justify-center w-full">
          <div
            className="font-bold text-[--foreground] leading-tight tracking-tight w-full"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100vw",
              maxWidth: "100vw",
              overflow: "hidden",
              margin: 0,
              padding: 0,
            }}
          >
            <span
              ref={firstLineRef}
              style={{
                display: "inline-block",
                fontSize: "clamp(2.5rem, 10vw, 8rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                textAlign: "center",
                whiteSpace: "nowrap",
                width: "auto",
                minWidth: 0,
                maxWidth: "100vw",
              }}
            >
              WE CRAFT DIGITAL
            </span>
            <span
              ref={secondLineRef}
              style={{
                display: "inline-block",
                fontSize: secondLineFontSize,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                textAlign: "center",
                whiteSpace: "nowrap",
                width: firstLineWidth ? `${firstLineWidth}px` : "auto",
                minWidth: 0,
                maxWidth: "100vw",
                textShadow: glowOpacity > 0 ? (isDark 
                  ? `0 0 12px rgba(255, 255, 255, ${0.4 * glowOpacity}), 0 0 24px rgba(255, 255, 255, ${0.2 * glowOpacity}), 0 0 36px rgba(255, 255, 255, ${0.1 * glowOpacity})` 
                  : `0 0 12px rgba(0, 0, 0, ${0.3 * glowOpacity}), 0 0 24px rgba(0, 0, 0, ${0.15 * glowOpacity}), 0 0 36px rgba(0, 0, 0, ${0.08 * glowOpacity})`) : "none",
              }}
            >
              EXPERIENCES
            </span>
          </div>
          <div className="flex flex-row gap-6 mt-10">
            <a
              href="#projects"
              className="inline-block bg-[--accent-green] text-[--white-color] py-3 px-8 rounded-lg font-semibold shadow-md hover:bg-[--accent-green-base] transition-colors"
            >
              Our Work
            </a>
            <a
              href="#contact"
              className="inline-block bg-transparent border-2 border-[--accent-green] text-[--accent-green] py-3 px-8 rounded-lg font-semibold hover:bg-[--accent-green] hover:text-[--white-color] transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
