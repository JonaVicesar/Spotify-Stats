import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  message = 'Cargando...', 
  color = 'success',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: { width: '3rem', height: '3rem' }
  };

  const spinnerClass = `spinner-border text-${color} ${
    size === 'sm' ? sizeClasses.sm : ''
  }`;

  const spinnerStyle = size === 'lg' ? sizeClasses.lg : {};

  const content = (
    <div className="text-center">
      <div 
        className={spinnerClass} 
        style={spinnerStyle}
        role="status"
        aria-hidden="true"
      />
      {message && (
        <p className={`mt-3 mb-0 ${fullScreen ? 'text-light' : 'text-muted'}`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="d-flex justify-content-center align-items-center bg-dark text-white"
        style={{ minHeight: '100vh' }}
      >
        {content}
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      {content}
    </div>
  );
};

export default LoadingSpinner;