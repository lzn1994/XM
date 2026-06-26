import React, { useEffect, useState } from 'react';

interface CoinUnlockProps {
  active: boolean;
  size?: number;
  onComplete?: () => void;
}

export const CoinUnlock: React.FC<CoinUnlockProps> = ({
  active,
  size = 80,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'idle' | 'rotating' | 'unlocked'>('idle');

  useEffect(() => {
    if (active && phase === 'idle') {
      setPhase('rotating');

      const timer = setTimeout(() => {
        setPhase('unlocked');
        onComplete?.();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [active, onComplete, phase]);

  if (phase === 'idle') return null;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)`,
          animation: phase === 'rotating' ? 'glowPulse 0.5s ease-in-out infinite' : 'glowExpand 0.8s ease-out forwards',
        }}
      />

      <div
        className="relative"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          animation: phase === 'rotating' ? 'coinFlip 1.5s ease-in-out' : 'none',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="absolute inset-0 rounded-full border-4 flex items-center justify-center"
          style={{
            borderColor: '#B8860B',
            background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 50%, #B8860B 100%)',
            boxShadow: '0 4px 15px rgba(184, 134, 11, 0.4)',
            backfaceVisibility: 'hidden',
          }}
        >
          <div
            className="w-1/3 h-1/3 rounded-sm"
            style={{
              background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
            }}
          />
        </div>

        <div
          className="absolute inset-0 rounded-full border-4 flex items-center justify-center"
          style={{
            borderColor: '#B8860B',
            background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 50%, #B8860B 100%)',
            boxShadow: '0 4px 15px rgba(184, 134, 11, 0.4)',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <span
            className="text-2xl font-bold"
            style={{ color: '#8B4513' }}
          >
            福
          </span>
        </div>
      </div>

      {phase === 'unlocked' && (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: 8,
                height: 8,
                background: '#FFD700',
                borderRadius: '50%',
                animation: `sparkle 0.8s ease-out forwards`,
                animationDelay: `${i * 0.05}s`,
                transform: `rotate(${i * 45}deg) translateY(-${size * 0.6}px)`,
              }}
            />
          ))}
        </>
      )}

      <style>{`
        @keyframes coinFlip {
          0% {
            transform: rotateY(0deg) scale(1);
          }
          25% {
            transform: rotateY(180deg) scale(1.1);
          }
          50% {
            transform: rotateY(360deg) scale(1.2);
          }
          75% {
            transform: rotateY(540deg) scale(1.1);
          }
          100% {
            transform: rotateY(720deg) scale(1);
          }
        }
        @keyframes glowPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.3);
            opacity: 1;
          }
        }
        @keyframes glowExpand {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes sparkle {
          0% {
            opacity: 1;
            transform: rotate(inherit) translateY(-${size * 0.6}px) scale(1);
          }
          100% {
            opacity: 0;
            transform: rotate(inherit) translateY(-${size}px) scale(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CoinUnlock;
