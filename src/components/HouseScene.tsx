import React from 'react';
import { getHouseStageBySopStep } from '../data/nian-data';

interface HouseSceneProps {
  currentStep: number;
  className?: string;
}

export const HouseScene: React.FC<HouseSceneProps> = ({ currentStep, className = '' }) => {
  const stage = getHouseStageBySopStep(currentStep);
  const stageIndex = stage.stage;

  const renderMountains = () => (
    <g>
      <path d="M0 200 L80 120 L160 180 L240 100 L320 160 L400 90 L480 150 L560 110 L640 170 L720 130 L800 180 L800 250 L0 250 Z" fill="#A8C4D4" opacity="0.5" />
      <path d="M0 220 L100 150 L200 200 L300 130 L400 190 L500 140 L600 180 L700 150 L800 200 L800 250 L0 250 Z" fill="#7BA3B8" opacity="0.6" />
    </g>
  );

  const renderClouds = () => (
    <g>
      <g className="cloud-float" style={{ animationDelay: '0s' }}>
        <ellipse cx="150" cy="60" rx="35" ry="15" fill="white" opacity="0.8" />
        <ellipse cx="170" cy="55" rx="25" ry="12" fill="white" opacity="0.8" />
        <ellipse cx="130" cy="58" rx="20" ry="10" fill="white" opacity="0.8" />
      </g>
      <g className="cloud-float" style={{ animationDelay: '2s' }}>
        <ellipse cx="550" cy="80" rx="40" ry="18" fill="white" opacity="0.7" />
        <ellipse cx="575" cy="72" rx="28" ry="14" fill="white" opacity="0.7" />
        <ellipse cx="525" cy="76" rx="22" ry="12" fill="white" opacity="0.7" />
      </g>
      <g className="cloud-float" style={{ animationDelay: '4s' }}>
        <ellipse cx="700" cy="50" rx="30" ry="12" fill="white" opacity="0.6" />
        <ellipse cx="720" cy="45" rx="20" ry="10" fill="white" opacity="0.6" />
      </g>
    </g>
  );

  const renderCourtyard = () => (
    <g>
      <rect x="0" y="340" width="800" height="60" fill="#5B8C5A" />
      <rect x="0" y="335" width="800" height="8" fill="#4A7A49" />
      {stageIndex >= 5 && (
        <>
          <g transform="translate(80, 310)">
            <rect x="12" y="15" width="6" height="25" fill="#8B6F47" />
            <circle cx="15" cy="12" r="15" fill="#5B8C5A" />
            <circle cx="8" cy="18" r="10" fill="#4A7A49" />
            <circle cx="22" cy="18" r="10" fill="#4A7A49" />
          </g>
          <g transform="translate(700, 305)">
            <rect x="12" y="20" width="6" height="30" fill="#8B6F47" />
            <circle cx="15" cy="15" r="18" fill="#5B8C5A" />
            <circle cx="6" cy="22" r="12" fill="#4A7A49" />
            <circle cx="24" cy="22" r="12" fill="#4A7A49" />
          </g>
          <g transform="translate(150, 330)">
            <circle cx="0" cy="0" r="8" fill="#C84A3E" />
            <rect x="-2" y="5" width="4" height="10" fill="#8B6F47" />
          </g>
          <g transform="translate(650, 332)">
            <circle cx="0" cy="0" r="6" fill="#E8A838" />
            <rect x="-1.5" y="5" width="3" height="8" fill="#8B6F47" />
          </g>
        </>
      )}
    </g>
  );

  const renderHouseBase = () => (
    <g>
      <rect x="200" y="200" width="400" height="150" fill={stageIndex === 0 ? '#E8E0D5' : '#FAF7F2'} stroke="#8B6F47" strokeWidth="3" />
      <rect x="190" y="195" width="420" height="10" fill="#8B6F47" />
    </g>
  );

  const renderRoof = () => {
    if (stageIndex === 0) {
      return (
        <g>
          <path d="M195 200 L400 120 L605 200 Z" fill="none" stroke="#8B6F47" strokeWidth="2" strokeDasharray="5,5" />
        </g>
      );
    }
    return (
      <g>
        <path d="M180 200 L400 100 L620 200 Z" fill="#C84A3E" />
        <path d="M195 200 L400 115 L605 200 Z" fill="#A83A30" />
        <rect x="390" y="90" width="20" height="25" fill="#FFD700" />
        <circle cx="400" cy="85" r="8" fill="#FFD700" />
        <path d="M180 200 L200 210 L180 215 Z" fill="#8B6F47" />
        <path d="M620 200 L600 210 L620 215 Z" fill="#8B6F47" />
      </g>
    );
  };

  const renderWindows = () => {
    if (stageIndex < 2) return null;
    const windowStyle = stageIndex < 4
      ? { fill: 'none', stroke: '#8B6F47', strokeWidth: 2 }
      : { fill: '#87CEEB', stroke: '#8B6F47', strokeWidth: 2 };

    return (
      <g>
        <rect x="250" y="240" width="60" height="50" {...windowStyle} />
        <line x1="280" y1="240" x2="280" y2="290" stroke="#8B6F47" strokeWidth="1.5" />
        <line x1="250" y1="265" x2="310" y2="265" stroke="#8B6F47" strokeWidth="1.5" />
        {stageIndex >= 4 && (
          <>
            <path d="M250 240 L255 245 L305 245 L310 240" fill="#8B6F47" />
            <path d="M255 245 L255 290 L250 290" fill="#6B5A3F" />
          </>
        )}

        <rect x="490" y="240" width="60" height="50" {...windowStyle} />
        <line x1="520" y1="240" x2="520" y2="290" stroke="#8B6F47" strokeWidth="1.5" />
        <line x1="490" y1="265" x2="550" y2="265" stroke="#8B6F47" strokeWidth="1.5" />
        {stageIndex >= 4 && (
          <>
            <path d="M490 240 L495 245 L545 245 L550 240" fill="#8B6F47" />
            <path d="M545 245 L545 290 L550 290" fill="#6B5A3F" />
          </>
        )}
      </g>
    );
  };

  const renderDoor = () => {
    if (stageIndex < 3) return null;
    return (
      <g>
        <rect x="365" y="250" width="70" height="100" fill={stageIndex >= 4 ? '#8B4513' : '#6B6B6B'} stroke="#5A3A1A" strokeWidth="2" />
        <rect x="370" y="255" width="28" height="90" fill={stageIndex >= 4 ? '#A0522D' : '#7B7B7B'} />
        <rect x="402" y="255" width="28" height="90" fill={stageIndex >= 4 ? '#A0522D' : '#7B7B7B'} />
        {stageIndex >= 4 && (
          <>
            <circle cx="395" cy="300" r="4" fill="#FFD700" />
            <circle cx="405" cy="300" r="4" fill="#FFD700" />
            <rect x="360" y="242" width="80" height="12" fill="#C84A3E" />
            <text x="400" y="252" fontSize="10" fill="#FFD700" textAnchor="middle">福</text>
          </>
        )}
        {stageIndex >= 5 && (
          <>
            <path d="M345 250 L365 235 L365 250 Z" fill="#C84A3E" />
            <path d="M455 250 L435 235 L435 250 Z" fill="#C84A3E" />
            <rect x="340" y="248" width="6" height="30" fill="#8B4513" />
            <rect x="454" y="248" width="6" height="30" fill="#8B4513" />
          </>
        )}
      </g>
    );
  };

  const renderStageDecorations = () => {
    switch (stageIndex) {
      case 0:
        return (
          <g>
            <g transform="translate(350, 280)">
              <rect x="-60" y="20" width="120" height="8" fill="#8B6F47" rx="2" />
              <rect x="-55" y="28" width="8" height="40" fill="#6B5A3F" />
              <rect x="47" y="28" width="8" height="40" fill="#6B5A3F" />
              <rect x="-45" y="0" width="90" height="20" fill="#A0826D" rx="2" />
              <text x="0" y="14" fontSize="10" fill="#5D4037" textAnchor="middle">户型图</text>
            </g>
            <text x="400" y="230" fontSize="14" fill="#6B6B6B" textAnchor="middle">前期准备</text>
          </g>
        );
      case 1:
        return (
          <g>
            <g transform="translate(250, 240)">
              <rect x="0" y="0" width="50" height="60" fill="#8B6F47" rx="2" />
              <rect x="5" y="5" width="40" height="50" fill="#A0826D" rx="1" />
              <line x1="10" y1="15" x2="40" y2="15" stroke="#6B5A3F" strokeWidth="2" />
              <line x1="10" y1="25" x2="40" y2="25" stroke="#6B5A3F" strokeWidth="2" />
              <line x1="10" y1="35" x2="40" y2="35" stroke="#6B5A3F" strokeWidth="2" />
              <rect x="15" y="45" width="20" height="6" fill="#D4A574" rx="1" />
              <text x="25" y="72" fontSize="10" fill="#5D4037" textAnchor="middle">工具架</text>
            </g>
            <g transform="translate(500, 230)">
              <rect x="0" y="0" width="60" height="45" fill="#FAF7F2" stroke="#C84A3E" strokeWidth="2" rx="2" />
              <text x="30" y="20" fontSize="12" fill="#C84A3E" textAnchor="middle" fontWeight="bold">安全第一</text>
              <text x="30" y="35" fontSize="9" fill="#6B6B6B" textAnchor="middle">施工注意安全</text>
              <rect x="28" y="50" width="4" height="20" fill="#8B6F47" />
            </g>
            <g transform="translate(380, 270)">
              <rect x="0" y="0" width="40" height="5" fill="#FFD700" />
              <circle cx="40" cy="2.5" r="4" fill="#FFD700" />
            </g>
            <text x="400" y="230" fontSize="14" fill="#8B6F47" textAnchor="middle">主体拆改</text>
          </g>
        );
      case 2:
        return (
          <g>
            <path d="M230 220 L230 320" stroke="#4A90D9" strokeWidth="3" fill="none" />
            <path d="M230 220 L350 220" stroke="#4A90D9" strokeWidth="3" fill="none" />
            <path d="M260 250 L550 250" stroke="#E8A838" strokeWidth="2" fill="none" />
            <path d="M550 250 L550 320" stroke="#E8A838" strokeWidth="2" fill="none" />
            <circle cx="230" cy="280" r="6" fill="white" stroke="#4A90D9" strokeWidth="2" />
            <circle cx="550" cy="280" r="6" fill="white" stroke="#E8A838" strokeWidth="2" />
            <g transform="translate(240, 260)">
              <rect x="0" y="10" width="70" height="50" fill="#A0826D" rx="2" />
              <rect x="5" y="15" width="60" height="40" fill="#FAF7F2" rx="1" />
              <text x="35" y="38" fontSize="9" fill="#6B6B6B" textAnchor="middle">合同审查</text>
              <rect x="32" y="0" width="6" height="12" fill="#6B5A3F" />
            </g>
            <g transform="translate(480, 270)">
              <rect x="0" y="5" width="50" height="45" fill="#8B6F47" rx="2" />
              <rect x="5" y="10" width="40" height="35" fill="#FAF7F2" rx="1" />
              <text x="25" y="32" fontSize="9" fill="#5B8C5A" textAnchor="middle">质检台</text>
              <rect x="22" y="-2" width="6" height="8" fill="#6B5A3F" />
            </g>
            <g transform="translate(280, 315)">
              <circle cx="0" cy="0" r="12" fill="#FFD700" />
              <path d="M-8 -2 L0 -5 L8 -2 L0 0 Z" fill="#FFA500" />
              <path d="M0 -5 L0 5" stroke="#FFA500" strokeWidth="2" />
            </g>
            <text x="400" y="230" fontSize="14" fill="#4A6FA5" textAnchor="middle">水电改造</text>
          </g>
        );
      case 3:
        return (
          <g>
            <rect x="210" y="210" width="380" height="5" fill="#A0826D" />
            <line x1="210" y1="225" x2="590" y2="225" stroke="#8B6F47" strokeWidth="1" />
            <line x1="210" y1="240" x2="590" y2="240" stroke="#8B6F47" strokeWidth="1" />
            <g transform="translate(250, 270)">
              <ellipse cx="25" cy="50" rx="25" ry="5" fill="#6B5A3F" opacity="0.2" />
              <path d="M5 30 Q25 10 45 30" stroke="#8B4513" strokeWidth="4" fill="none" />
              <rect x="8" y="30" width="34" height="20" fill="#A0826D" rx="2" />
              <rect x="0" y="48" width="50" height="6" fill="#6B5A3F" rx="2" />
            </g>
            <g transform="translate(480, 275)">
              <rect x="0" y="10" width="60" height="40" fill="#A0826D" rx="2" />
              <rect x="5" y="15" width="50" height="30" fill="#D4B892" rx="1" />
              <rect x="55" y="25" width="15" height="5" fill="#8B6F47" />
            </g>
            <g transform="translate(350, 230)">
              <rect x="0" y="0" width="40" height="80" fill="#8B6F47" rx="2" />
              <rect x="5" y="5" width="30" height="70" fill="#D4B892" rx="1" />
              <rect x="8" y="10" width="24" height="15" fill="#A0826D" />
              <rect x="8" y="30" width="24" height="15" fill="#A0826D" />
              <rect x="8" y="50" width="24" height="15" fill="#A0826D" />
              <text x="20" y="92" fontSize="10" fill="#5D4037" textAnchor="middle">博古架</text>
            </g>
            <text x="400" y="185" fontSize="14" fill="#5B8C5A" textAnchor="middle">泥木工程</text>
          </g>
        );
      case 4:
        return (
          <g>
            <g transform="translate(220, 200)">
              <rect x="0" y="0" width="10" height="100" fill="#8B6F47" />
              <rect x="15" y="0" width="10" height="100" fill="#8B6F47" />
              <rect x="30" y="0" width="10" height="100" fill="#8B6F47" />
              <rect x="45" y="0" width="10" height="100" fill="#8B6F47" />
              <rect x="0" y="-5" width="55" height="8" fill="#6B5A3F" />
              <rect x="0" y="97" width="55" height="8" fill="#6B5A3F" />
            </g>
            <g transform="translate(270, 260)">
              <rect x="0" y="15" width="60" height="60" fill="#8B4513" stroke="#5A2A0A" strokeWidth="1.5" />
              <rect x="3" y="3" width="54" height="15" fill="#D4A574" />
              <rect x="3" y="22" width="54" height="15" fill="#D4A574" />
              <rect x="3" y="41" width="54" height="16" fill="#D4A574" />
              <circle cx="52" cy="29" r="2" fill="#FFD700" />
            </g>
            <g transform="translate(500, 270)">
              <rect x="0" y="0" width="50" height="60" fill="#A0522D" stroke="#6B3A0F" strokeWidth="1.5" />
              <rect x="3" y="3" width="20" height="25" fill="#C8A882" />
              <rect x="27" y="3" width="20" height="25" fill="#C8A882" />
              <rect x="3" y="32" width="20" height="25" fill="#D4B892" />
              <rect x="27" y="32" width="20" height="25" fill="#D4B892" />
              <circle cx="25" cy="35" r="2" fill="#FFD700" />
            </g>
            <g transform="translate(520, 220)">
              <ellipse cx="20" cy="5" rx="18" ry="7" fill="#FFE4B5" opacity="0.7" />
              <ellipse cx="20" cy="5" rx="10" ry="4" fill="#FFF5E0" opacity="0.9" />
              <rect x="15" y="5" width="10" height="60" fill="#8B6F47" rx="1" />
              <rect x="10" y="62" width="20" height="5" fill="#6B5A3F" rx="2" />
            </g>
            <g transform="translate(130, 270)">
              <ellipse cx="20" cy="65" rx="18" ry="4" fill="#5B8C5A" opacity="0.3" />
              <rect x="17" y="25" width="6" height="40" fill="#6B4F3A" />
              <ellipse cx="20" cy="20" rx="15" ry="20" fill="#5B8C5A" />
              <ellipse cx="15" cy="15" rx="8" ry="12" fill="#6B9D6A" />
              <ellipse cx="25" cy="17" rx="7" ry="10" fill="#7BAE7B" />
            </g>
            <text x="400" y="185" fontSize="14" fill="#C84A3E" textAnchor="middle">油工安装</text>
          </g>
        );
      case 5:
        return (
          <g>
            <g transform="translate(240, 260)">
              <rect x="0" y="20" width="70" height="40" fill="#8B4513" />
              <rect x="5" y="0" width="60" height="25" fill="#A0522D" />
              <rect x="10" y="5" width="20" height="15" fill="#C84A3E" />
              <circle cx="50" cy="12" r="6" fill="#FFD700" />
            </g>
            <g transform="translate(480, 255)">
              <rect x="0" y="30" width="60" height="35" fill="#8B4513" />
              <rect x="5" y="0" width="50" height="35" fill="#FAF7F2" stroke="#8B4513" strokeWidth="1" />
              <rect x="8" y="5" width="44" height="25" fill="#E8D5B8" />
              <circle cx="50" cy="45" r="3" fill="#FFD700" />
            </g>
            <g transform="translate(380, 290)">
              <ellipse cx="0" cy="0" rx="12" ry="15" fill="#5B8C5A" />
              <ellipse cx="-8" cy="-5" rx="8" ry="10" fill="#4A7A49" />
              <ellipse cx="8" cy="-5" rx="8" ry="10" fill="#4A7A49" />
              <rect x="-3" y="10" width="6" height="15" fill="#8B6F47" />
            </g>
            <g transform="translate(150, 210)">
              <rect x="0" y="0" width="50" height="60" fill="#8B6F47" rx="2" />
              <rect x="3" y="3" width="44" height="54" fill="#FAF7F2" rx="1" />
              <text x="25" y="35" textAnchor="middle" fontSize="16" fill="#2C2C2C" fontFamily="serif">雅</text>
            </g>
            <g transform="translate(580, 230)">
              <ellipse cx="15" cy="25" rx="10" ry="14" fill="#4A90D9" opacity="0.2" />
              <ellipse cx="15" cy="25" rx="7" ry="10" fill="#A0826D" />
              <ellipse cx="15" cy="18" rx="5" ry="7" fill="#D4A574" />
              <rect x="13" y="35" width="4" height="15" fill="#8B6F47" />
              <rect x="8" y="48" width="14" height="5" fill="#6B5A3F" rx="1" />
            </g>
            <g transform="translate(300, 295)">
              <path d="M0 0 L15 15 L0 30 Z" fill="#C84A3E" />
              <text x="7" y="18" fontSize="10" fill="#FFD700" textAnchor="middle">福</text>
            </g>
            <g transform="translate(460, 300)">
              <path d="M0 0 L15 15 L0 30 Z" fill="#C84A3E" />
              <text x="7" y="18" fontSize="10" fill="#FFD700" textAnchor="middle">春</text>
            </g>
            <g transform="translate(350, 200)">
              <rect x="0" y="0" width="60" height="15" fill="#FFD700" rx="2" />
              <polygon points="30,15 25,25 35,25" fill="#FFD700" />
              <text x="30" y="11" fontSize="9" fill="#C84A3E" textAnchor="middle" fontWeight="bold">冠军</text>
            </g>
            <text x="400" y="185" fontSize="14" fill="#C84A3E" textAnchor="middle">收尾入住</text>
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`w-full relative ${className}`}>
      <style>{`
        @keyframes cloud-float {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(20px); }
        }
        .cloud-float {
          animation: cloud-float 8s ease-in-out infinite;
        }
      `}</style>
      <svg viewBox="0 0 800 400" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8F4F8" />
            <stop offset="100%" stopColor="#F5F0E8" />
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#skyGradient)" />
        {renderClouds()}
        {renderMountains()}
        {renderCourtyard()}
        {renderHouseBase()}
        {renderRoof()}
        {renderWindows()}
        {renderDoor()}
        {renderStageDecorations()}
      </svg>
    </div>
  );
};

export default HouseScene;
