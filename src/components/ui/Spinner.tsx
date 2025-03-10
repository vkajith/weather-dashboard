import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'indigo';
  className?: string;
}

/**
 * Reusable Spinner component for loading states with glossy styling
 */
const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'white',
  className = '',
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  // Color classes
  const colorClasses = {
    blue: 'border-blue-400',
    white: 'border-white',
    indigo: 'border-indigo-400',
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-2 border-b-2 ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner; 