import React, { useState, useEffect } from 'react';
import type { Equipment } from '../types';
import { getUnlockedEquipment } from '../data/nian-data';

interface NianAvatarProps {
  size?: number;
  level?: number;
  emotion?: 'happy' | 'sleepy' | 'confused';
  equipment?: Equipment[];
  isInteractive?: boolean;
  onBow?: () => void;
  className?: string;
}

export const NianAvatar: React.FC<NianAvatarProps> = ({
  size = 120,
  level = 1,
  emotion = 'happy',
  equipment = [],
  isInteractive = false,
  onBow,
  className = '',
}) => {
  const [isBowing, setIsBowing] = useState(false);
  const [blinkState, setBlinkState] = useState(false);

  const unlockedEquip = equipment.length > 0 ? equipment : getUnlockedEquipment(level);

  useEffect(() => {
    if (emotion === 'sleepy') return;
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, [emotion]);

  const handleClick = () => {
    if (!isInteractive) return;
    setIsBowing(true);
    onBow?.();
    setTimeout(() => setIsBowing(false), 1000);
  };

  const hasEquipment = (id: string) => unlockedEquip.some((e) => e.id === id);

  const getEyePath = () => {
    if (emotion === 'sleepy' || blinkState) {
      return (
        <>
          <path d="M35 45 Q42 48 49 45" stroke="#2C2C2C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M71 45 Q78 48 85 45" stroke="#2C2C2C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      );
    }
    if (emotion === 'happy') {
      return (
        <>
          <ellipse cx="42" cy="46" rx="5" ry="6" fill="#2C2C2C" />
          <ellipse cx="78" cy="46" rx="5" ry="6" fill="#2C2C2C" />
          <circle cx="43.5" cy="44" r="2" fill="white" />
          <circle cx="79.5" cy="44" r="2" fill="white" />
        </>
      );
    }
    if (emotion === 'confused') {
      return (
        <>
          <ellipse cx="42" cy="46" rx="5" ry="6" fill="#2C2C2C" />
          <ellipse cx="78" cy="46" rx="5" ry="6" fill="#2C2C2C" />
          <circle cx="43.5" cy="44" r="2" fill="white" />
          <circle cx="79.5" cy="44" r="2" fill="white" />
          <path d="M28 34 L38 38" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" />
          <path d="M92 34 L82 38" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    }
    return null;
  };

  const getMouthPath = () => {
    if (emotion === 'happy') {
      return <path d="M50 62 Q60 72 70 62" stroke="#C84A3E" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    }
    if (emotion === 'sleepy') {
      return <ellipse cx="60" cy="65" rx="4" ry="3" fill="#C84A3E" />;
    }
    if (emotion === 'confused') {
      return (
        <>
          <path d="M52 65 Q60 62 68 65" stroke="#C84A3E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <text x="85" y="50" fontSize="14" fill="#8B6F47">?</text>
        </>
      );
    }
    return null;
  };

  return (
    <div
      className={`relative ${isInteractive ? 'cursor-pointer' : ''} ${className}`}
      style={{ width: size, height: size }}
      onClick={handleClick}
    >
      <style>{`
        @keyframes nian-breathe {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.03); }
        }
        @keyframes nian-bow {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          50% { transform: rotate(10deg); }
          75% { transform: rotate(-5deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes nian-tail {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes nian-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .nian-breathe {
          animation: nian-breathe 3s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .nian-bow {
          animation: nian-bow 1s ease-in-out;
          transform-origin: center bottom;
        }
        .nian-tail {
          animation: nian-tail 2s ease-in-out infinite;
          transform-origin: left center;
        }
        .nian-float {
          animation: nian-float 4s ease-in-out infinite;
        }
      `}</style>

      <div className={`w-full h-full nian-float ${isBowing ? 'nian-bow' : 'nian-breathe'}`}>
        <svg viewBox="0 0 120 120" width="100%" height="100%">
          <g className="nian-tail" style={{ transformOrigin: '95px 75px' }}>
            <path
              d="M95 75 Q110 65 108 50 Q105 40 100 45 Q102 55 95 65 Z"
              fill="#E8A838"
              stroke="#C84A3E"
              strokeWidth="1.5"
            />
            <path
              d="M100 48 Q102 44 105 46"
              stroke="#C84A3E"
              strokeWidth="1"
              fill="none"
            />
          </g>

          <ellipse cx="60" cy="80" rx="35" ry="28" fill="#E8A838" />
          <ellipse cx="60" cy="85" rx="25" ry="18" fill="#FFF5E6" />

          <circle cx="60" cy="48" r="32" fill="#E8A838" />
          <ellipse cx="60" cy="55" rx="22" ry="18" fill="#FFF5E6" />

          <path d="M30 25 L25 5 L38 18 Z" fill="#C84A3E" />
          <path d="M90 25 L95 5 L82 18 Z" fill="#C84A3E" />
          <path d="M30 25 L27 10 L35 20 Z" fill="#E8A838" />
          <path d="M90 25 L93 10 L85 20 Z" fill="#E8A838" />

          {getEyePath()}

          <ellipse cx="32" cy="58" rx="6" ry="4" fill="#FFB6C1" opacity="0.6" />
          <ellipse cx="88" cy="58" rx="6" ry="4" fill="#FFB6C1" opacity="0.6" />

          <ellipse cx="60" cy="56" rx="5" ry="4" fill="#C84A3E" />
          <ellipse cx="58" cy="55" rx="1.5" ry="1" fill="white" opacity="0.5" />

          {getMouthPath()}

          {hasEquipment('red-ribbon') && (
            <g>
              <path
                d="M25 15 Q30 8 40 12 Q50 8 60 12 Q70 8 80 12 Q90 8 95 15"
                stroke="#C84A3E"
                strokeWidth="3"
                fill="none"
              />
              <circle cx="60" cy="12" r="4" fill="#FFD700" />
              <path d="M56 15 L60 22 L64 15" fill="#C84A3E" />
            </g>
          )}

          {hasEquipment('jade-pendant') && (
            <g>
              <circle cx="60" cy="88" r="6" fill="#7BC4C4" stroke="#4A9B9B" strokeWidth="1" />
              <circle cx="60" cy="88" r="3" fill="#A8E0E0" opacity="0.6" />
              <path d="M60 82 L60 78" stroke="#8B6F47" strokeWidth="1.5" />
            </g>
          )}

          {hasEquipment('cloud-cloak') && (
            <g>
              <path
                d="M25 65 Q15 85 20 100 L100 100 Q105 85 95 65 Q80 75 60 72 Q40 75 25 65 Z"
                fill="#4A6FA5"
                opacity="0.85"
              />
              <path
                d="M30 75 Q25 85 28 95 M50 78 Q45 88 48 98 M70 78 Q75 88 72 98 M90 75 Q95 85 92 95"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                opacity="0.5"
              />
              <circle cx="60" cy="72" r="3" fill="#FFD700" />
            </g>
          )}

          {hasEquipment('golden-bell') && (
            <g>
              <ellipse cx="95" cy="70" rx="5" ry="6" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
              <path d="M91 66 Q95 64 99 66" stroke="#DAA520" strokeWidth="1" fill="none" />
              <circle cx="95" cy="76" r="2" fill="#DAA520" />
              <line x1="95" y1="64" x2="95" y2="60" stroke="#8B6F47" strokeWidth="1" />
            </g>
          )}

          <ellipse cx="40" cy="105" rx="8" ry="5" fill="#D4922A" />
          <ellipse cx="80" cy="105" rx="8" ry="5" fill="#D4922A" />
        </svg>
      </div>
    </div>
  );
};

export default NianAvatar;
