import React from 'react';

const StatsCard = ({ 
  rank, 
  title, 
  subtitle, 
  image, 
  details = [], 
  actions = [],
  showRank = true,
  className = '',
  value,
  icon,
  color
}) => {
  // si se reciben props para valor, icono y color  se muestra la atarjeta de estadisticas
  if (value !== undefined) {
    return (
      <div className={`card h-100 stats-card ${className}`}>
        <div className="card-body p-4">
          <div className="d-flex align-items-start justify-content-between mb-3">
            <div className="text-start">
              <h6 className="card-title mb-2 text-white-50 text-uppercase" style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                {title}
              </h6>
              <h3 className="mb-0 text-white fw-bold" style={{ fontSize: '2rem' }}>
                {value}
              </h3>
            </div>
            <div className="icon-container">
              <div 
                className={`bg-${color} bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center`}
                style={{ width: '60px', height: '60px' }}
              >
                <span style={{ fontSize: '1.5rem' }}>{icon}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // si no se reciben props para valor, icono y color se muestra la tarjeta de estadisticas normal
  return (
    <div className={`card h-100 stats-card ${className}`}>
      <div className="card-body p-0">
        <div className="d-flex align-items-start mb-4">
          {showRank && (
            <div className="rank-badge me-3">
              <span className="badge bg-primary fs-6">{rank}</span>
            </div>
          )}
          
          <div className="flex-shrink-0 me-3">
            {image ? (
              <img 
                src={image} 
                alt={title}
                className="rounded"
                style={{ width: '70px', height: '70px', objectFit: 'cover' }}
              />
            ) : (
              <div 
                className="bg-light rounded d-flex align-items-center justify-content-center"
                style={{ width: '70px', height: '70px' }}
              >
                <i className="fas fa-music text-muted"></i>
              </div>
            )}
          </div>
          
          <div className="flex-grow-1 min-width-0">
            <h6 className="card-title mb-2 text-truncate text-white fw-semibold" title={title}>
              {title}
            </h6>
            {subtitle && (
              <div className= "d-flex justify-content-start">
              <p className="card-text text-white small mb-1 text-truncate" title={subtitle}>
                {subtitle}
              </p>
              </div>
            )}
          </div>
        </div>

        {details.length > 0 && (
          <div className="details-section mb-3">
            {details.map((detail, index) => (
              <div key={index} className="d-flex justify-content-between align-items-center py-2">
                <small className="text-white">{detail.label}:</small>
                <small className="fw-medium text-truncate ms-2 text-white-50" title={detail.value}>
                  {detail.value}
                </small>
              </div>
            ))}
          </div>
        )}

        {actions.length > 0 && (
          <div className="actions-section d-flex gap-2 flex-wrap mt-3">
            {actions.map((action, index) => (
              <button
                key={index}
                className={`btn btn-sm btn-${action.variant || 'primary'}`}
                onClick={action.onClick}
                title={action.text}
              >
                <i className={`${action.icon} me-1`}></i>
                <span className="d-none d-md-inline">{action.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;