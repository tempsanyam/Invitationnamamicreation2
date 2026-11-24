import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vRot: number;
  size: number;
  color: string;
  opacity: number;
  swayPhase: number;
}

/**
 * Lightweight 60fps Canvas Golden Petal Shower (Pushp-Varsha).
 * Uses pointer-events: none and auto-terminates cleanly after ~3.8 seconds.
 */
export const GoldenPetalShower: React.FC<{
  triggerKey: number;
}> = ({ triggerKey }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (triggerKey <= 0) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#E9D5A7', '#D2AD68', '#F8F1E4', '#C9963E', '#DFB976'];
    const count = window.innerWidth < 640 ? 42 : 68;
    const petals: Petal[] = Array.from({ length: count }).map((_, i) => ({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * 240 - (i % 5) * 28,
      vx: (Math.random() - 0.5) * 0.9,
      vy: 1.9 + Math.random() * 2.1,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.06,
      size: 6 + Math.random() * 7,
      color: colors[i % colors.length],
      opacity: 0.75 + Math.random() * 0.25,
      swayPhase: Math.random() * Math.PI * 2,
    }));

    let rafId = 0;
    const startTime = performance.now();
    const DURATION = 3800;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const globalFade = elapsed > DURATION - 900 ? Math.max(0, (DURATION - elapsed) / 900) : 1;

      petals.forEach((p) => {
        p.swayPhase += 0.035;
        p.x += p.vx + Math.sin(p.swayPhase) * 0.75;
        p.y += p.vy;
        p.rot += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.opacity * globalFade;
        ctx.fillStyle = p.color;

        // Draw graceful lotus/champaka petal silhouette
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.75, -p.size * 0.35, p.size * 0.65, p.size * 0.65, 0, p.size * 0.85);
        ctx.bezierCurveTo(-p.size * 0.65, p.size * 0.65, -p.size * 0.75, -p.size * 0.35, 0, -p.size);
        ctx.fill();
        ctx.restore();
      });

      if (elapsed < DURATION) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
  }, [triggerKey]);

  if (triggerKey <= 0) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] w-full h-full"
    />
  );
};


