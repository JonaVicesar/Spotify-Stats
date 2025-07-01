import React from 'react';

const Navigation = ({ activeSection, setActiveSection, user, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'analysis', label: 'Análisis Profundo', icon: '🔬' },
    { id: 'social', label: 'Comparaciones', icon: '👥' },
    { id: 'predictions', label: 'Predicciones', icon: '🔮' }
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top border-bottom border-secondary">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <strong>🧬 Tu ADN Musical</strong>
        </a>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {navItems.map(item => (
              <li key={item.id} className="nav-item">
                <button 
                  className={`nav-link btn btn-link text-decoration-none ${
                    activeSection === item.id ? 'active text-success' : 'text-light'
                  }`}
                  onClick={() => setActiveSection(item.id)}
                  style={{ border: 'none', background: 'none' }}
                >
                  <span className="me-1">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          
          <div className="navbar-nav">
            {user && (
              <div className="nav-item dropdown">
                <button 
                  className="nav-link dropdown-toggle btn btn-link text-light text-decoration-none d-flex align-items-center"
                  data-bs-toggle="dropdown"
                  style={{ border: 'none', background: 'none' }}
                >
                  {user.images?.[0] && (
                    <img 
                      src={user.images[0].url} 
                      alt="Profile" 
                      className="rounded-circle me-2"
                      style={{ width: '24px', height: '24px' }}
                    />
                  )}
                  {user.display_name}
                </button>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li>
                    <span className="dropdown-item-text">
                      <small className="text-muted">
                        {user.followers?.total} seguidores
                      </small>
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={onLogout}>
                      🚪 Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;