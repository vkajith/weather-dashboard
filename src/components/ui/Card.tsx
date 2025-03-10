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
    <div className={`glossy-card p-6 ${isSelected ? 'selected' : ''} ${className}`}>
      {title && (
        <div className="mb-4">
          {typeof title === 'string' ? (
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          ) : (
            title
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card; 