import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-center py-4 mt-5 border-top border-dark">
       <div className="container">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="d-flex justify-content-center gap-3 mb-3">
              <small className="text-muted">🎵 Análisis en tiempo real</small>
              <small className="text-muted">
                📊 Estadísticas personalizadas
              </small>
              <small className="text-muted">🔮 Predicciones musicales</small>
            </div>

            <hr className="my-3 border-dark" />

            <div className="row text-center">
              <div className="col-md-6">
                <small className="text-muted">
                     Hecho con ❤️ y mucho mate🧉
                  por
                  <a
                    href="https://jonavicesar.pages.dev/"
                    target="blank"
                    rel="noopener noreferrer"
                    className="text-blue text-decoration-none ms-1"
                  >
                    Jona
                  </a>
                  .
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
