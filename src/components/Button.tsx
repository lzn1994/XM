import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'text' | 'seal';
type ButtonSize = 'large' | 'small';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'large',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-medium transition-all duration-300 flex items-center justify-center cursor-pointer border-none outline-none active:scale-95 relative overflow-hidden';
  
  const variantStyles = {
    primary: 'bg-gradient-dai text-white shadow-md hover:shadow-glow-dai hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-nuan-white text-dai-blue border-2 border-dai-blue hover:bg-dai-blue/5 hover:shadow-md',
    text: 'bg-transparent text-dai-blue hover:bg-dai-blue/10 rounded-lg',
    seal: 'bg-gradient-zhu text-white shadow-md hover:shadow-glow-zhu hover:-translate-y-0.5 active:translate-y-0 font-kai',
  };

  const sizeStyles = {
    large: 'px-5 py-2.5 rounded-card text-body',
    small: 'px-3 py-1.5 rounded-tag text-helper',
  };

  const sealSizeStyles = {
    large: 'px-6 py-3 rounded-lg text-body',
    small: 'px-4 py-2 rounded-md text-helper',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${variant === 'seal' ? sealSizeStyles[size] : sizeStyles[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
      {variant === 'seal' && (
        <>
          <span className="absolute inset-0.5 border border-white/20 rounded-md pointer-events-none" />
          <span className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        </>
      )}
    </button>
  );
};

export default Button;
