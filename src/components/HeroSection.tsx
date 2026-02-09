import { useEffect, useRef, useState } from "react";
import heroFullBg from "@/assets/hero-full-bg.jpg";
import heroMobileBg from "@/assets/hero-mobile-bg.jpg";
import GoldParticles from "./GoldParticles";
import { useIsMobile } from "@/hooks/use-mobile";

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [textVisible, setTextVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => setTextVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const bgOffsetX = 0;
  const bgOffsetY = 0;

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-[100svh] flex items-end sm:items-center overflow-hidden pb-20 sm:pb-0"
    >
      {/* Full background image */}
      <div
        className="absolute inset-0 sm:inset-[-30px]"
        style={{
          backgroundImage: `url(${isMobile ? heroMobileBg : heroFullBg})`,
          backgroundSize: "cover",
          backgroundPosition: isMobile ? "center 40%" : "center center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Dark overlay for mobile text readability */}
      <div className="absolute inset-0 bg-black/30 sm:bg-black/10" />

      {/* Floating gold particles — reduced on mobile */}
      <GoldParticles />

      {/* Prism light flare */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        <div
          className="absolute top-[15%] w-[250px] h-[75%] opacity-30 hidden sm:block"
          style={{
            background:
              "linear-gradient(125deg, transparent 15%, hsla(350, 80%, 70%, 0.12) 25%, hsla(30, 90%, 60%, 0.18) 35%, hsla(55, 95%, 65%, 0.15) 45%, hsla(170, 80%, 60%, 0.12) 55%, hsla(220, 70%, 65%, 0.1) 65%, transparent 75%)",
            animation: "light-flare-sweep 7s ease-in-out infinite",
            filter: "blur(10px)",
          }}
        />
      </div>

      {/* Content — text on the left */}
      <div className="relative z-10 container mx-auto px-5 sm:px-6">
        <div className="max-w-lg md:pl-4 lg:pl-8">
          {/* Subtitle */}
          <div
            className={`mb-2 sm:mb-5 transition-all duration-1000 ease-out ${
              textVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <span className="text-accent text-[9px] sm:text-[11px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-sans font-bold sm:font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] sm:drop-shadow-none">
              Luxury Fragrance House
            </span>
          </div>

          {/* Main headline */}
          <h1
            className={`font-serif text-[2.6rem] sm:text-5xl md:text-[3.5rem] lg:text-[4.2rem] font-bold leading-[1.05] sm:leading-[1.08] mb-2.5 sm:mb-5 text-foreground transition-all duration-[1.6s] ease-out ${
              textVisible
                ? "opacity-100 translate-y-0 tracking-[0.02em]"
                : "opacity-0 translate-y-10 tracking-[0.12em]"
            }`}
            style={{
              transitionDelay: "600ms",
              ...(isMobile ? {
                color: "hsl(0 0% 95%)",
                textShadow: "0 2px 12px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)",
              } : {}),
            }}
          >
            YOUR
            <br />
            SIGNATURE
            <br className="sm:hidden" />
            {" "}<span className="hidden sm:inline"><br /></span>SCENT
            <br />
            <span className={`text-accent ${isMobile ? "drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]" : ""}`}>AWAITS</span>
          </h1>

          {/* Subtext */}
          <p
            className={`text-[11px] sm:text-sm md:text-base max-w-[260px] sm:max-w-sm mb-5 sm:mb-10 font-sans leading-relaxed text-muted-foreground transition-all duration-1000 ease-out ${
              textVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{
              transitionDelay: "1000ms",
              ...(isMobile ? {
                color: "hsl(0 0% 80%)",
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              } : {}),
            }}
          >
            Experience the essence and elegance
          </p>

          {/* CTA Button */}
          <div
            className={`transition-all duration-1000 ease-out ${
              textVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "1300ms" }}
          >
            <a
              href="#collection"
              className={`gold-shimmer inline-block border-2 border-accent text-accent px-8 sm:px-10 py-3 sm:py-3.5 text-[11px] sm:text-[13px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold hover:bg-accent hover:text-accent-foreground transition-all duration-500 rounded-sm animate-[cta-pulse-glow_3s_ease-in-out_infinite] ${isMobile ? "drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]" : ""}`}
            >
              Shop Now
            </a>
          </div>
        </div>
      </div>

      {/* Bottom-right decorative sparkle star — hidden on mobile */}
      <div className="absolute bottom-8 right-10 z-10 animate-[sparkle-twinkle_4s_ease-in-out_infinite_2s] hidden sm:block">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"
            fill="hsla(43, 74%, 49%, 0.5)"
          />
        </svg>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
