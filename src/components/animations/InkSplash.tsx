import React, { useEffect, useState } from 'react';

interface InkSplashProps {
  active: boolean;
  x?: number;
  y?: number;
  size?: number;
  duration?: number;
  color?: string;
  children?: React.ReactNode;
  onComplete?: () => void;
}

export const InkSplash: React.FC<InkSplashProps> = ({
  active,
  x = 50,
  y = 50,
  size = 300,
  duration = 800,
  color = 'rgba(44, 44, 44, 0.15)',
  children,
  onComplete,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (active && !isAnimating) {
      setIsAnimating(true);
      setShowContent(false);

      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, duration * 0.4);

      const completeTimer = setTimeout(() => {
        setIsAnimating(false);
        onComplete?.();
      }, duration);

      return () => {
        clearTimeout(contentTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [active, duration, onComplete, isAnimating]);

  if (!active && !isAnimating) return <>{children}</>;

  return (
    <div className="relative">
      <div
        className={`absolute pointer-events-none z-10 ${isAnimating ? '' : 'opacity-0'}`}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: 'translate(-50%, -50%)',
          width: size,
          height: size,
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            animation: isAnimating ? `inkSpread ${duration}ms ease-out forwards` : 'none',
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
            animation: isAnimating ? `inkSpread ${duration}ms ease-out 100ms forwards` : 'none',
            opacity: 0,
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 50%)`,
            animation: isAnimating ? `inkSpread ${duration}ms ease-out 200ms forwards` : 'none',
            opacity: 0,
          }}
        />
      </div>

      <div
        className={`transition-all duration-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {children}
      </div>

      <style>{`
        @keyframes inkSpread {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default InkSplash;
