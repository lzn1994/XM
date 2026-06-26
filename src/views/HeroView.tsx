import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useAppState } from '../hooks/useAppState';
import Button from '../components/Button';

const HeroView: React.FC = () => {
  const { setView } = useAppState();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartProgressRef = useRef(0);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    type: 'ink' | 'bamboo';
    rotation: number;
    rotationSpeed: number;
  }>>([]);
  const animationFrameRef = useRef<number | null>(null);

  const updateProgress = useCallback((newProgress: number) => {
    const clamped = Math.max(0, Math.min(100, newProgress));
    setProgress(clamped);
    if (timelineRef.current) {
      timelineRef.current.progress(clamped / 100);
    }
    if (clamped >= 100 && !isComplete) {
      setIsComplete(true);
      setTimeout(() => setShowStartButton(true), 500);
    } else if (clamped < 100 && isComplete) {
      setIsComplete(false);
      setShowStartButton(false);
    }
  }, [isComplete]);

  useEffect(() => {
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

    const createParticles = () => {
      const particles: typeof particlesRef.current = [];
      for (let i = 0; i < 25; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.15 + 0.05,
          type: Math.random() > 0.7 ? 'bamboo' : 'ink',
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
        });
      }
      particlesRef.current = particles;
    };
    createParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        
        if (p.type === 'ink') {
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          gradient.addColorStop(0, 'rgba(44, 44, 44, 0.8)');
          gradient.addColorStop(0.5, 'rgba(44, 44, 44, 0.4)');
          gradient.addColorStop(1, 'rgba(44, 44, 44, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(91, 140, 90, 0.6)';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(91, 140, 90, 0.3)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(0, p.size);
          ctx.stroke();
        }
        
        ctx.restore();
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ paused: true });
    timelineRef.current = tl;

    tl.to({}, { duration: 0.2 });

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    autoPlayTimerRef.current = setTimeout(() => {
      if (!isDragging && progress === 0) {
        const autoPlayTl = gsap.timeline();
        autoPlayTl.to(
          { p: 0 },
          {
            p: 100,
            duration: 16,
            ease: 'none',
            onUpdate: function () {
              updateProgress(this.targets()[0].p);
            },
          }
        );
      }
    }, 3000);

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [updateProgress, isDragging, progress]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartProgressRef.current = progress;
    
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
    }
    
    if (timelineRef.current) {
      timelineRef.current.pause();
    }
    
    gsap.killTweensOf('*');
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const deltaX = e.clientX - dragStartXRef.current;
      const containerWidth = containerRef.current.offsetWidth;
      const deltaProgress = (deltaX / containerWidth) * 100;
      
      updateProgress(dragStartProgressRef.current + deltaProgress);
    },
    [isDragging, updateProgress]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  const handleStart = () => {
    setView('onboarding');
  };

  const getStage = (p: number) => {
    if (p < 20) return 0;
    if (p < 40) return 1;
    if (p < 60) return 2;
    if (p < 80) return 3;
    return 4;
  };

  const currentStage = getStage(progress);
  const maskWidth = `${progress}%`;

  const stageLabels = ['结构呈现', '基础装修', '家具入场', '装饰细节', '年兽入场'];

  return (
    <div
      ref={containerRef}
      className="relative w-full lg:min-h-screen overflow-hidden select-none touch-none"
      style={{
        background: 'linear-gradient(180deg, #F5F0E8 0%, #EDE6D9 100%)',
        cursor: isDragging ? 'grabbing' : 'grab',
        minHeight: 'calc(100vh - 56px)',
      }}
      onPointerDown={handlePointerDown}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232C2C2C' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          zIndex: 2,
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="pt-8 md:pt-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-[#4A6FA5] to-transparent opacity-60" />
            <h1
              className="text-lg md:text-2xl font-bold tracking-widest"
              style={{ color: '#4A6FA5' }}
            >
              我的宝贝房子
            </h1>
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-[#4A6FA5] to-transparent opacity-60" />
          </div>
          <div className="text-xs md:text-sm text-[#6B6B6B] tracking-wider">
            现代中式 · 雅居生活
          </div>
        </div>

        <div className="hero-title text-center mt-6 md:mt-10 px-4">
          <h2
            className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight"
            style={{ color: '#2C2C2C' }}
          >
            <span style={{ color: '#4A6FA5' }}>滑动屏幕</span>
            <span className="mx-2">/</span>
            <span style={{ color: '#4A6FA5' }}>装修你的家</span>
          </h2>
          <p className="text-sm md:text-base text-[#6B6B6B] max-w-xl mx-auto">
            从毛坯空房到现代中式雅居，只需轻轻滑动
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-4">
          <div className="relative w-full max-w-4xl" style={{ aspectRatio: '16/9' }}>
            <svg
              viewBox="0 0 800 450"
              className="w-full h-full"
              style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.08))' }}
            >
              <defs>
                <linearGradient id="floorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#A08060" />
                  <stop offset="100%" stopColor="#6B5035" />
                </linearGradient>
                <linearGradient id="wallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FAF7F2" />
                  <stop offset="100%" stopColor="#F0EBE3" />
                </linearGradient>
                <linearGradient id="woodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#A0826D" />
                  <stop offset="100%" stopColor="#6B4F3A" />
                </linearGradient>
                <linearGradient id="ceilingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#F5F5F5" />
                </linearGradient>
                <linearGradient id="warmLight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFE4B5" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FFE4B5" stopOpacity="0" />
                </linearGradient>
                <clipPath id="roomClip">
                  <rect x="100" y="50" width="600" height="350" rx="4" />
                </clipPath>
                <mask id="progressMask">
                  <rect x="0" y="0" width={progress * 8} height="450" fill="white" />
                </mask>
              </defs>

              <rect
                x="100"
                y="50"
                width="600"
                height="350"
                rx="4"
                fill="#F5F0E8"
                stroke="#D4CDBF"
                strokeWidth="2"
              />

              <g mask="url(#progressMask)">
                <rect x="100" y="320" width="600" height="80" fill="url(#floorGradient)" />
                
                <line
                  x1="100"
                  y1="320"
                  x2="700"
                  y2="320"
                  stroke="#5D4037"
                  strokeWidth="2"
                  opacity="0.3"
                />
                {[...Array(10)].map((_, i) => (
                  <line
                    key={i}
                    x1={160 + i * 55}
                    y1="320"
                    x2={140 + i * 55}
                    y2="400"
                    stroke="#5D4037"
                    strokeWidth="1"
                    opacity="0.2"
                  />
                ))}

                <rect x="100" y="50" width="600" height="270" fill="url(#wallGradient)" />

                <rect x="100" y="50" width="600" height="40" fill="url(#ceilingGradient)" />
                <line x1="100" y1="90" x2="700" y2="90" stroke="#E0DCD4" strokeWidth="1" />

                <rect x="100" y="50" width="600" height="270" fill="url(#warmLight)" opacity={progress > 60 ? (progress - 60) / 20 : 0} />

                <rect
                  x="350"
                  y="130"
                  width="100"
                  height="140"
                  fill="#E8E0D0"
                  stroke="#8B6F47"
                  strokeWidth="3"
                />
                <line x1="400" y1="130" x2="400" y2="270" stroke="#8B6F47" strokeWidth="2" />
                <line x1="350" y1="200" x2="450" y2="200" stroke="#8B6F47" strokeWidth="2" />
                <circle cx="435" cy="200" r="4" fill="#8B6F47" />

                <rect x="180" y="140" width="80" height="100" fill="#E8E0D0" stroke="#8B6F47" strokeWidth="3" />
                <line x1="220" y1="140" x2="220" y2="240" stroke="#8B6F47" strokeWidth="2" />
                <line x1="180" y1="190" x2="260" y2="190" stroke="#8B6F47" strokeWidth="2" />

                <rect x="560" y="140" width="80" height="100" fill="#E8E0D0" stroke="#8B6F47" strokeWidth="3" />
                <line x1="600" y1="140" x2="600" y2="240" stroke="#8B6F47" strokeWidth="2" />
                <line x1="560" y1="190" x2="640" y2="190" stroke="#8B6F47" strokeWidth="2" />

                {progress >= 40 && (
                  <g
                    style={{
                      opacity: Math.min(1, (progress - 40) / 10),
                      transform: `scale(${Math.min(1, 0.8 + (progress - 40) / 50)})`,
                      transformOrigin: '50% 320px',
                    }}
                  >
                    <rect x="300" y="150" width="15" height="170" fill="url(#woodGradient)" />
                    <rect x="320" y="150" width="15" height="170" fill="url(#woodGradient)" />
                    <rect x="340" y="150" width="15" height="170" fill="url(#woodGradient)" />
                    <rect x="360" y="150" width="15" height="170" fill="url(#woodGradient)" />
                    <rect x="380" y="150" width="15" height="170" fill="url(#woodGradient)" />
                    <rect x="300" y="145" width="95" height="8" fill="url(#woodGradient)" />
                    <rect x="300" y="315" width="95" height="8" fill="url(#woodGradient)" />

                    <g transform="translate(140, 230)">
                      <ellipse cx="40" cy="70" rx="35" ry="8" fill="#6B4F3A" opacity="0.2" />
                      <rect x="15" y="25" width="50" height="45" rx="3" fill="url(#woodGradient)" />
                      <rect x="18" y="28" width="44" height="39" rx="2" fill="#8B6F47" />
                      <rect x="10" y="15" width="60" height="12" rx="2" fill="url(#woodGradient)" />
                      <rect x="20" y="70" width="8" height="20" fill="#5D4037" />
                      <rect x="52" y="70" width="8" height="20" fill="#5D4037" />
                      <circle cx="40" cy="45" r="8" fill="#D4A574" />
                    </g>

                    <g transform="translate(500, 250)">
                      <ellipse cx="50" cy="65" rx="45" ry="6" fill="#6B4F3A" opacity="0.2" />
                      <rect x="10" y="30" width="80" height="35" rx="3" fill="url(#woodGradient)" />
                      <rect x="13" y="33" width="74" height="29" rx="2" fill="#A0826D" />
                      <rect x="15" y="10" width="70" height="22" rx="2" fill="#8B6F47" />
                      <rect x="5" y="65" width="10" height="15" fill="#5D4037" />
                      <rect x="85" y="65" width="10" height="15" fill="#5D4037" />
                      <rect x="35" y="35" width="30" height="20" fill="#6B5035" opacity="0.3" />
                    </g>

                    <g transform="translate(200, 180)">
                      <rect x="0" y="0" width="60" height="12" fill="url(#woodGradient)" rx="2" />
                      <rect x="5" y="12" width="6" height="50" fill="#6B4F3A" />
                      <rect x="49" y="12" width="6" height="50" fill="#6B4F3A" />
                      <rect x="0" y="62" width="60" height="6" fill="url(#woodGradient)" rx="2" />
                    </g>

                    <g transform="translate(560, 180)">
                      <rect x="0" y="0" width="50" height="10" fill="url(#woodGradient)" rx="2" />
                      <rect x="3" y="10" width="5" height="40" fill="#6B4F3A" />
                      <rect x="42" y="10" width="5" height="40" fill="#6B4F3A" />
                      <rect x="0" y="50" width="50" height="5" fill="url(#woodGradient)" rx="2" />
                    </g>
                  </g>
                )}

                {progress >= 60 && (
                  <g style={{ opacity: Math.min(1, (progress - 60) / 15) }}>
                    <g transform="translate(250, 100)">
                      <ellipse cx="25" cy="5" rx="20" ry="8" fill="#FFE4B5" opacity="0.6" />
                      <ellipse cx="25" cy="5" rx="12" ry="5" fill="#FFF5E0" opacity="0.8" />
                      <rect x="20" y="5" width="10" height="15" fill="#8B6F47" rx="1" />
                      <rect x="15" y="18" width="20" height="4" fill="#6B4F3A" rx="1" />
                    </g>
                    <g transform="translate(520, 100)">
                      <ellipse cx="25" cy="5" rx="20" ry="8" fill="#FFE4B5" opacity="0.6" />
                      <ellipse cx="25" cy="5" rx="12" ry="5" fill="#FFF5E0" opacity="0.8" />
                      <rect x="20" y="5" width="10" height="15" fill="#8B6F47" rx="1" />
                      <rect x="15" y="18" width="20" height="4" fill="#6B4F3A" rx="1" />
                    </g>

                    <g transform="translate(130, 250)">
                      <ellipse cx="20" cy="65" rx="18" ry="4" fill="#5B8C5A" opacity="0.3" />
                      <rect x="17" y="30" width="6" height="35" fill="#6B4F3A" />
                      <ellipse cx="20" cy="25" rx="15" ry="20" fill="#5B8C5A" />
                      <ellipse cx="15" cy="20" rx="8" ry="12" fill="#6B9D6A" />
                      <ellipse cx="25" cy="22" rx="7" ry="10" fill="#7BAE7B" />
                    </g>

                    <g transform="translate(650, 260)">
                      <ellipse cx="15" cy="55" rx="15" ry="3" fill="#5B8C5A" opacity="0.3" />
                      <rect x="13" y="28" width="4" height="28" fill="#6B4F3A" />
                      <ellipse cx="15" cy="22" rx="12" ry="16" fill="#6B9D6A" />
                      <ellipse cx="12" cy="18" rx="6" ry="10" fill="#7BAE7B" />
                    </g>

                    <g transform="translate(480, 130)">
                      <rect x="0" y="0" width="50" height="60" fill="#8B6F47" rx="2" />
                      <rect x="3" y="3" width="44" height="54" fill="#FAF7F2" rx="1" />
                      <line x1="25" y1="10" x2="25" y2="50" stroke="#4A6FA5" strokeWidth="1.5" opacity="0.5" />
                      <line x1="10" y1="30" x2="40" y2="30" stroke="#4A6FA5" strokeWidth="1" opacity="0.3" />
                      <text x="25" y="35" textAnchor="middle" fontSize="12" fill="#2C2C2C" opacity="0.6" fontFamily="serif">
                        雅
                      </text>
                    </g>

                    <g transform="translate(300, 155)">
                      <rect x="0" y="0" width="10" height="160" fill="url(#woodGradient)" opacity="0.6" />
                      <rect x="15" y="0" width="10" height="160" fill="url(#woodGradient)" opacity="0.6" />
                      <rect x="30" y="0" width="10" height="160" fill="url(#woodGradient)" opacity="0.6" />
                      <rect x="45" y="0" width="10" height="160" fill="url(#woodGradient)" opacity="0.6" />
                      <rect x="60" y="0" width="10" height="160" fill="url(#woodGradient)" opacity="0.6" />
                      <rect x="75" y="0" width="10" height="160" fill="url(#woodGradient)" opacity="0.6" />
                    </g>
                  </g>
                )}

                {progress >= 80 && (
                  <g
                    style={{
                      opacity: Math.min(1, (progress - 80) / 15),
                      transform: `translateX(${Math.min(0, (progress - 80) / 20 * 100 - 100)}px)`,
                    }}
                  >
                    <g transform="translate(420, 200)">
                      <ellipse cx="30" cy="115" rx="35" ry="6" fill="#2C2C2C" opacity="0.15" />
                      
                      <rect x="10" y="60" width="40" height="50" rx="8" fill="#C84A3E" />
                      <rect x="15" y="65" width="30" height="40" rx="5" fill="#D65A4E" />
                      
                      <circle cx="30" cy="40" r="25" fill="#D4A574" />
                      <ellipse cx="30" cy="30" rx="20" ry="12" fill="#E8B884" />
                      
                      <polygon points="12,22 18,8 24,22" fill="#C84A3E" />
                      <polygon points="36,22 42,8 48,22" fill="#C84A3E" />
                      
                      <circle cx="22" cy="38" r="3" fill="#2C2C2C" />
                      <circle cx="38" cy="38" r="3" fill="#2C2C2C" />
                      <circle cx="23" cy="37" r="1" fill="white" />
                      <circle cx="39" cy="37" r="1" fill="white" />
                      
                      <ellipse cx="30" cy="48" rx="6" ry="4" fill="#A0826D" />
                      <path d="M 24 48 Q 30 54 36 48" stroke="#2C2C2C" strokeWidth="1.5" fill="none" />
                      
                      <path d="M 5 55 Q -5 45 5 35" stroke="#D4A574" strokeWidth="4" fill="none" strokeLinecap="round" />
                      <path d="M 55 55 Q 65 45 55 35" stroke="#D4A574" strokeWidth="4" fill="none" strokeLinecap="round" />
                      
                      <rect x="15" y="108" width="10" height="12" rx="2" fill="#5D4037" />
                      <rect x="35" y="108" width="10" height="12" rx="2" fill="#5D4037" />
                    </g>

                    {progress >= 90 && (
                      <g
                        style={{
                          opacity: Math.min(1, (progress - 90) / 8),
                          transform: `translateY(${Math.max(0, 10 - (progress - 90))}px)`,
                        }}
                      >
                        <g transform="translate(460, 155)">
                          <rect x="0" y="0" width="120" height="45" rx="8" fill="#FAF7F2" stroke="#4A6FA5" strokeWidth="2" />
                          <polygon points="20,45 30,55 40,45" fill="#FAF7F2" stroke="#4A6FA5" strokeWidth="2" />
                          <polygon points="20,45 30,55 40,45" fill="#FAF7F2" />
                          <text x="60" y="28" textAnchor="middle" fontSize="13" fill="#2C2C2C" fontFamily="PingFang SC">
                            这就是你未来新家的样子！
                          </text>
                        </g>
                      </g>
                    )}
                  </g>
                )}
              </g>

              <g>
                <rect
                  x="100"
                  y="50"
                  width="600"
                  height="350"
                  rx="4"
                  fill="none"
                  stroke="#6B6B6B"
                  strokeWidth="2"
                  strokeDasharray="8,4"
                  opacity={0.3 + (progress / 100) * 0.5}
                />
              </g>
            </svg>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-[#6B6B6B]">
              {stageLabels.map((label, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index <= currentStage ? 'bg-[#4A6FA5]' : 'bg-[#D4CDBF]'
                    }`}
                  />
                  <span
                    className={`transition-colors duration-300 ${
                      index === currentStage
                        ? 'text-[#4A6FA5] font-medium'
                        : index < currentStage
                        ? 'text-[#6B6B6B]'
                        : 'text-[#B0A898]'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pb-8 md:pb-12 px-6 md:px-12">
          <div className="max-w-2xl mx-auto">
            <div className="relative h-2 bg-[#E0D8CC] rounded-full overflow-hidden mb-4">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-none"
                style={{
                  width: maskWidth,
                  background: 'linear-gradient(90deg, #4A6FA5 0%, #6B8FC5 100%)',
                }}
              />
            </div>

            <div className="text-center">
              {!isComplete ? (
                <div className="flex items-center justify-center gap-3 text-sm text-[#6B6B6B]">
                  <span>←</span>
                  <span>左右滑动开始</span>
                  <span>→</span>
                </div>
              ) : (
                <div
                  className={`transition-all duration-500 ${
                    showStartButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <Button
                    variant="primary"
                    size="large"
                    onClick={handleStart}
                    className="px-8 py-3 text-lg"
                  >
                    开始装修
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 text-xs text-[#6B6B6B]/50 z-20">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default HeroView;
