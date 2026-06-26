import React from 'react';

type CardType = 'info' | 'warn' | 'success';

interface CardProps {
  type?: CardType;
  title?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  type = 'info',
  title,
  children,
  className = '',
  style,
  hoverable = false,
}) => {
  const borderColorMap = {
    info: '#3A5A8C',
    warn: '#B83A2D',
    success: '#5B8C5A',
  };

  const topLineGradientMap = {
    info: 'linear-gradient(90deg, #3A5A8C 0%, #5B8C5A 50%, #8B6F47 100%)',
    warn: 'linear-gradient(90deg, #B83A2D 0%, #8B6F47 100%)',
    success: 'linear-gradient(90deg, #5B8C5A 0%, #3A5A8C 100%)',
  };

  return (
    <div
      className={`bg-nuan-white rounded-card shadow-card border border-ink-light transition-all duration-300 relative overflow-hidden ${
        hoverable ? 'hover:shadow-hover hover:-translate-y-1 hover:border-dai-blue/30 cursor-pointer' : ''
      } ${className}`}
      style={{
        ...style,
        boxShadow: `0 2px 12px rgba(58, 90, 140, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)`,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
        style={{ background: topLineGradientMap[type] }}
      />
      <div className="absolute top-0.5 left-3 right-3 h-px bg-gradient-to-r from-transparent via-ink-light to-transparent opacity-50" />
      
      <div className="p-card-padding pt-5">
        {title && (
          <h3 className="text-module-title font-semibold text-mo-black mb-element font-kai flex items-center gap-2">
            <span className="w-1 h-4 rounded-full" style={{ backgroundColor: borderColorMap[type] }} />
            {title}
          </h3>
        )}
        <div className="text-body text-mo-black">{children}</div>
      </div>
    </div>
  );
};

export default Card;
