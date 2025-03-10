import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

/**
 * Reusable Input component with glossy styling
 */
const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-white mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-2 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border ${error
            ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
            : 'border-white border-opacity-20 focus:ring-blue-400 focus:border-blue-400'
          } rounded-md focus:outline-none focus:ring-2 text-white placeholder-white placeholder-opacity-60 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-300">{error}</p>}
    </div>
  );
};

export default Input; 