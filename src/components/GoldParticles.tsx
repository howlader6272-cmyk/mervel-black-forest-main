import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  opacityDirection: number;
  drift: number;
  driftSpeed: number;
  shimmerPhase: number;
}

// Reduce particles on mobile for better performance
const getParticleCount = () => (typeof window !== 'undefined' && window.innerWidth < 640 ? 20 : 60);

const GoldParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    // Initialize particles with varied properties
    const isMobileView = w < 640;
    particlesRef.current = Array.from({ length: getParticleCount() }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * (isMobileView ? 2.5 : 4) + (isMobileView ? 0.5 : 1),
      speedX: (Math.random() - 0.5) * (isMobileView ? 0.25 : 0.12),
      speedY: -(Math.random() * (isMobileView ? 0.35 : 0.15) + 0.02),
      opacity: Math.random() * (isMobileView ? 0.5 : 0.7) + (isMobileView ? 0.1 : 0.15),
      opacityDirection: Math.random() > 0.5 ? 1 : -1,
      drift: Math.random() * Math.PI * 2,
      driftSpeed: Math.random() * (isMobileView ? 0.008 : 0.005) + 0.001,
      shimmerPhase: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      timeRef.current += 1;
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      for (const p of particlesRef.current) {
        // Gentle sine-wave horizontal drift
        p.drift += p.driftSpeed;
        p.x += p.speedX + Math.sin(p.drift) * (isMobileView ? 0.15 : 0.25);
        p.y += p.speedY;

        // Twinkle / shimmer
        p.shimmerPhase += isMobileView ? 0.03 : 0.015;
        const shimmer = Math.sin(p.shimmerPhase) * 0.3 + 0.6;
        p.opacity += p.opacityDirection * (isMobileView ? 0.003 : 0.002);
        if (p.opacity >= (isMobileView ? 0.65 : 0.85)) p.opacityDirection = -1;
        if (p.opacity <= 0.08) p.opacityDirection = 1;

        // Wrap around
        if (p.y < -10) {
          p.y = ch + 10;
          p.x = Math.random() * cw;
        }
        if (p.x < -10) p.x = cw + 10;
        if (p.x > cw + 10) p.x = -10;

        const finalOpacity = p.opacity * shimmer;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.globalAlpha = finalOpacity;

        // Outer glow
        const glowRadius = p.size * (isMobileView ? 3 : 4);
        const outerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
        outerGrad.addColorStop(0, "hsla(43, 80%, 70%, 0.7)");
        outerGrad.addColorStop(0.25, "hsla(43, 74%, 55%, 0.35)");
        outerGrad.addColorStop(0.6, "hsla(43, 74%, 49%, 0.1)");
        outerGrad.addColorStop(1, "hsla(43, 74%, 49%, 0)");
        ctx.fillStyle = outerGrad;
        ctx.beginPath();
        ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Bright core
        ctx.fillStyle = "hsla(45, 95%, 85%, 0.95)";
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
        ctx.fill();

        // 4-point star sparkle on larger particles
        if (p.size > 1.5) {
          ctx.strokeStyle = `hsla(43, 80%, 70%, ${finalOpacity * 0.6})`;
          ctx.lineWidth = 0.5;
          const armLen = p.size * 2.5;
          ctx.beginPath();
          ctx.moveTo(-armLen, 0);
          ctx.lineTo(armLen, 0);
          ctx.moveTo(0, -armLen);
          ctx.lineTo(0, armLen);
          ctx.stroke();
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      aria-hidden="true"
    />
  );
};

export default GoldParticles;