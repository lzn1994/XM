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
    info: 'var(--color-primary)',
    warn: 'var(--color-secondary)',
    success: 'var(--color-success)',
  };

  return (
    <div
      className={`bg-[var(--color-surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-[var(--spacing-card-padding)] border-l-4 transition-all duration-200 ${hoverable ? 'hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 cursor-pointer' : ''} ${className}`}
      style={{ borderLeftColor: borderColorMap[type], ...style }}
    >
      {title && (
        <h3 className="text-[var(--font-size-module-title)] font-semibold text-[var(--color-text)] mb-[var(--spacing-element)]">
          {title}
        </h3>
      )}
      <div className="text-[var(--font-size-body)] text-[var(--color-text)]">{children}</div>
    </div>
  );
};

export default Card;
