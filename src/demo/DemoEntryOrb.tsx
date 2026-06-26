import React, { useState } from 'react';

interface DemoEntryOrbProps {
  onClick: () => void;
}

const DemoEntryOrb: React.FC<DemoEntryOrbProps> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="fixed bottom-6 right-6 z-[9998] select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>{`
        @keyframes orb-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(74, 111, 165, 0.4),
                        0 4px 15px rgba(74, 111, 165, 0.3);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(74, 111, 165, 0),
                        0 4px 25px rgba(74, 111, 165, 0.4);
          }
        }
        @keyframes orb-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes tooltip-slide {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .demo-orb {
          animation: orb-pulse 2s ease-in-out infinite, orb-float 3s ease-in-out infinite;
        }
        .demo-orb:hover {
          animation: orb-float 3s ease-in-out infinite;
        }
        .demo-tooltip {
          animation: tooltip-slide 0.2s ease-out;
        }
      `}</style>

      <div className="relative flex items-center">
        {isHovered && (
          <div
            className="demo-tooltip absolute right-full mr-3 px-4 py-2 rounded-xl whitespace-nowrap shadow-lg"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-primary)',
            }}
          >
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--color-primary)' }}
            >
              一键演示
            </span>
            <div
              className="absolute right-0 top-1/2 w-2 h-2 rotate-45 translate-x-1/2 -translate-y-1/2"
              style={{
                background: 'var(--color-surface)',
                borderTop: '1px solid var(--color-primary)',
                borderRight: '1px solid var(--color-primary)',
              }}
            />
          </div>
        )}

        <button
          onClick={onClick}
          className={`demo-orb relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
            isHovered ? 'scale-110' : ''
          }`}
          style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #6B8FC5 100%)',
          }}
        >
          <div
            className="absolute inset-1 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
            }}
          />
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="5 3 19 12 5 21 5 3" fill="white" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DemoEntryOrb;
