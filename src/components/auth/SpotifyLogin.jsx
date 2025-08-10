import React from 'react';

const SpotifyLogin = ({ onConnect, loading, error }) => {
  return (
    <div className="auth-container">
      <div className="auth-card auth-slide-in">
        {/* Logo */}
        <div className="auth-logo">
          <img
          src="logo.png"
          alt="SpotiStats-Logo"
          width={110}
          ></img>
        </div>
        
        {/* Titulo y subtitulo */}
        <h1 className="auth-title">
          Spotify Stats
        </h1>
        <p className="auth-subtitle">
          Descubre tu top música y artistas favoritos
        </p>

        {/* Boton de login */}
        <button 
          className="spotify-login-btn"
          onClick={onConnect}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="auth-loading-spinner" style={{ width: '20px', height: '20px' }}></div>
              Conectando con Spotify...
            </>
          ) : (
            <>
              <svg className="spotify-login-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Conectar con Spotify
            </>
          )}
        </button>

        {/* Mensaje de Error */}
        {error && (
          <div className="auth-error">
            <div className="auth-error-title">Error de conexión</div>
            {error}
          </div>
        )}

        {/* Informacion adicional */}
        <div className="auth-info">
          <div className="auth-info-title">¿Qué obtendrás?</div>
          <ul>
            <li>📊 Estadísticas detalladas de tu música</li>
            <li>🎵 Tus artistas, álbumes y canciones favoritas</li>
            <li>🔮 Predicciones musicales personalizadas</li>
          </ul>
          <div className="auth-info-text">
            Necesitamos acceso a tu cuenta de Spotify para generar tu ADN musical.
            No guardamos tu información personal.
          </div>
        </div>

        {/* Estado de conexion */}
        {loading && (
          <div className="connection-status connecting">
            <div className="connection-indicator pulse"></div>
            Estableciendo conexión segura...
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotifyLogin;