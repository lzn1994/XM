import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
  type: 'ink' | 'splatter';
}

interface InkParticlesProps {
  enabled?: boolean;
  particleCount?: number;
}

export const InkParticles: React.FC<InkParticlesProps> = ({
  enabled = true,
  particleCount = 3,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!enabled || isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createParticle = (x: number, y: number): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.5;
      return {
        x,
        y,
        vx: Math.cos(angle) * speed * 0.3,
        vy: Math.sin(angle) * speed * 0.3 - 0.5,
        size: Math.random() * 12 + 6,
        opacity: Math.random() * 0.4 + 0.3,
        decay: Math.random() * 0.015 + 0.008,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        type: Math.random() > 0.7 ? 'splatter' : 'ink',
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      
      for (let i = 0; i < particleCount; i++) {
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        particlesRef.current.push(createParticle(e.clientX + offsetX, e.clientY + offsetY));
      }
      
      if (particlesRef.current.length > 100) {
        particlesRef.current = particlesRef.current.slice(-100);
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        for (let i = 0; i < particleCount; i++) {
          particlesRef.current.push(createParticle(touch.clientX, touch.clientY));
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        p.opacity -= p.decay;
        p.size *= 0.98;
        p.rotation += p.rotationSpeed;

        if (p.opacity <= 0 || p.size < 1) return false;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.type === 'ink') {
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          gradient.addColorStop(0, 'rgba(44, 44, 44, 0.6)');
          gradient.addColorStop(0.4, 'rgba(44, 44, 44, 0.3)');
          gradient.addColorStop(1, 'rgba(44, 44, 44, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(44, 44, 44, 0.4)';
          for (let i = 0; i < 3; i++) {
            const splatterAngle = (Math.PI * 2 * i) / 3 + p.rotation;
            const dist = p.size * 0.5;
            ctx.beginPath();
            ctx.arc(
              Math.cos(splatterAngle) * dist,
              Math.sin(splatterAngle) * dist,
              p.size * 0.25,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        }

        ctx.restore();
        return true;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, isMobile, particleCount]);

  if (isMobile) {
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-mo-black opacity-5"
              style={{
                width: `${Math.random() * 60 + 20}px`,
                height: `${Math.random() * 60 + 20}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.05; }
            50% { transform: translateY(-20px) rotate(10deg); opacity: 0.1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};

export default InkParticles;
