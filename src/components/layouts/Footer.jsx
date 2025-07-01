import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary text-center py-4 mt-5 border-top border-dark">
      <div className="container">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <p className="mb-2">
              <strong>🧬 Tu ADN Musical</strong> - Powered by Spotify API
            </p>
            <small className="text-muted d-block mb-3">
              Descubre tu identidad musical única
            </small>
            
            <div className="d-flex justify-content-center gap-3 mb-3">
              <small className="text-muted">
                🎵 Análisis en tiempo real
              </small>
              <small className="text-muted">
                📊 Estadísticas personalizadas  
              </small>
              <small className="text-muted">
                🔮 Predicciones musicales
              </small>
            </div>
            
            <hr className="my-3 border-dark" />
            
            <div className="row text-center">
              <div className="col-md-6">
                <small className="text-muted">
                  © {currentYear} Tu ADN Musical. Hecho con ❤️ y mucho mate🧉 por Jona.
                </small>
              </div>
              <div className="col-md-6">
                <small className="text-muted">
                  Datos proporcionados por 
                  <a 
                    href="https://spotify.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-success text-decoration-none ms-1"
                  >
                    Spotify
                  </a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;