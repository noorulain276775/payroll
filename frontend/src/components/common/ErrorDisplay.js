import React from 'react';
import { CAlert, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilExclamationTriangle, cilReload } from '@coreui/icons';
import PropTypes from 'prop-types';

const ErrorDisplay = ({ 
  error, 
  onRetry, 
  onDismiss, 
  title = 'Error',
  variant = 'danger',
  showIcon = true,
  showRetry = true,
  showDismiss = true,
  className = '',
  children
}) => {
  if (!error) return null;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <CAlert 
      color={variant} 
      className={`d-flex align-items-start ${className}`}
      dismissible={showDismiss}
      onClose={handleDismiss}
    >
      {showIcon && (
        <CIcon 
          icon={cilExclamationTriangle} 
          size="lg" 
          className="me-2 mt-1 flex-shrink-0"
        />
      )}
      
      <div className="flex-grow-1">
        <h6 className="alert-heading mb-2">{title}</h6>
        
        {children || (
          <p className="mb-2">
            {typeof error === 'string' ? error : error?.message || 'An unexpected error occurred'}
          </p>
        )}
        
        {showRetry && onRetry && (
          <CButton
            color="outline-light"
            size="sm"
            onClick={handleRetry}
            className="me-2"
          >
            <CIcon icon={cilReload} className="me-1" />
            Retry
          </CButton>
        )}
      </div>
    </CAlert>
  );
};

ErrorDisplay.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.bool
  ]),
  onRetry: PropTypes.func,
  onDismiss: PropTypes.func,
  title: PropTypes.string,
  variant: PropTypes.oneOf(['danger', 'warning', 'info']),
  showIcon: PropTypes.bool,
  showRetry: PropTypes.bool,
  showDismiss: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default ErrorDisplay;
