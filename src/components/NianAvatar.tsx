import React from 'react';

interface NianAvatarProps {
  size?: number;
  className?: string;
}

export const NianAvatar: React.FC<NianAvatarProps> = ({
  size = 48,
  className = '',
}) => {
  return (
    <div
      className={`rounded-full flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: 'var(--color-secondary)',
        fontSize: size * 0.6,
      }}
    >
      🐲
    </div>
  );
};

export default NianAvatar;
