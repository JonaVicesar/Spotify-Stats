import React from 'react';

const ErrorAlert = ({ message, onRetry }) => {
  return (
    <div className="alert alert-danger">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <strong>Error:</strong> {message}
        </div>
        {onRetry && (
          <button 
            className="btn btn-sm btn-outline-light"
            onClick={onRetry}
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;