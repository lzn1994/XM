import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'text';
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
  const baseStyles = 'font-medium transition-all duration-200 flex items-center justify-center cursor-pointer border-none outline-none active:scale-95';
  
  const variantStyles = {
    primary: 'bg-[var(--color-primary)] text-white hover:opacity-90 active:opacity-80',
    secondary: 'bg-[var(--color-surface)] text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white',
    text: 'bg-transparent text-[var(--color-primary)] hover:bg-[rgba(74,111,165,0.08)]',
  };

  const sizeStyles = {
    large: 'px-4 py-2 rounded-[var(--radius-card)] text-[var(--font-size-body)]',
    small: 'px-3 py-1.5 rounded-[var(--radius-tag)] text-[var(--font-size-helper)]',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
