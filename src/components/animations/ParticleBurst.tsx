import React, { useEffect, useRef } from 'react';

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
}

interface ParticleBurstProps {
  trigger: number;
  x?: number;
  y?: number;
  particleCount?: number;
  spread?: number;
  color?: string;
  onComplete?: () => void;
}

export const ParticleBurst: React.FC<ParticleBurstProps> = ({
  trigger,
  x = 50,
  y = 50,
  particleCount = 20,
  spread = 100,
  color = 'rgba(44, 44, 44, 0.6)',
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<BurstParticle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastTriggerRef = useRef(0);

  useEffect(() => {
    if (trigger === lastTriggerRef.current) return;
    lastTriggerRef.current = trigger;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || window.innerWidth;
    canvas.height = rect.height || window.innerHeight;

    const centerX = (x / 100) * canvas.width;
    const centerY = (y / 100) * canvas.height;

    const newParticles: BurstParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const speed = Math.random() * 4 + 2;
      newParticles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 15 + 5,
        opacity: 1,
        decay: Math.random() * 0.02 + 0.015,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      });
    }
    particlesRef.current = [...particlesRef.current, ...newParticles];

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    let frameCount = 0;
    const maxFrames = 120;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.vx *= 0.98;
        p.opacity -= p.decay;
        p.size *= 0.98;
        p.rotation += p.rotationSpeed;

        if (p.opacity <= 0 || p.size < 1) return false;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, color.replace('0.6', '0.3'));
        gradient.addColorStop(1, color.replace('0.6', '0'));
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        return true;
      });

      if (particlesRef.current.length > 0 && frameCount < maxFrames) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [trigger, x, y, particleCount, spread, color, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-20"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default ParticleBurst;
