import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'default', 
    size = 'default', 
    className = '', 
    children, 
    ...props 
  }, ref) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none';
    
    // Variant styles
    const variantStyles = {
      default: 'bg-[#d4a574] text-black',
      outline: 'border border-amber-600 bg-transparent text-amber-600',
      ghost: 'hover:bg-gray-100 text-gray-700',
      link: 'text-amber-600 underline-offset-4 hover:underline'
    };
    
    // Size styles
    const sizeStyles = {
      default: 'h-10 px-4 py-2 text-sm',
      sm: 'h-9 px-3 rounded-md text-sm',
      lg: 'h-11 px-8 rounded-md text-base',
      icon: 'h-10 w-10'
    };
    
    // Combine all styles
    const combinedClasses = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    ].filter(Boolean).join(' ');
    
    return (
      <button
        className={combinedClasses}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
