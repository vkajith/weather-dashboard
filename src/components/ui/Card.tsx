import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  isSelected?: boolean;
}

/**
 * Reusable Card component with modern glossy styling
 */
const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  isSelected = false
}) => {
  return (
    <div
      className={`
        glossy-card p-5 
        ${isSelected ? 'selected ring-2 ring-blue-400/50 shadow-lg shadow-blue-500/20' : ''} 
        ${className}
        transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10
        relative overflow-hidden group
      `}
    >
      {/* Animated gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Card header */}
      {title && (
        <div className="mb-4 relative">
          {typeof title === 'string' ? (
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 inline-flex items-center">
              <span className="mr-2">{title}</span>
              <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse"></div>
            </h2>
          ) : (
            title
          )}
        </div>
      )}

      {/* Card content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export { Card }; 