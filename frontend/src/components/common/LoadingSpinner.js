import React from 'react';
import { CSpinner } from '@coreui/react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  variant = 'border', 
  text = 'Loading...',
  centered = true,
  fullHeight = false,
  className = ''
}) => {
  const containerClasses = [
    'd-flex',
    'justify-content-center',
    'align-items-center',
    className
  ];

  if (centered) {
    containerClasses.push('w-100');
  }

  if (fullHeight) {
    containerClasses.push('min-vh-100');
  }

  return (
    <div className={containerClasses.join(' ')}>
      <div className="text-center">
        <CSpinner 
          size={size} 
          color={color} 
          variant={variant} 
          className="mb-2"
        />
        {text && (
          <div className="text-muted small">{text}</div>
        )}
      </div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.string,
  variant: PropTypes.oneOf(['border', 'grow']),
  text: PropTypes.string,
  centered: PropTypes.bool,
  fullHeight: PropTypes.bool,
  className: PropTypes.string,
};

export default LoadingSpinner;
