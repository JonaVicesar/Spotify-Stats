import React, { useState, useEffect } from "react";
import Layout from "./components/layouts/Layout";
import SpotifyLogin from "./components/auth/SpotifyLogin";
import { useSpotifyAuth } from "./hooks/useSpotifyAuth";
import { useStats } from "./hooks/useStats";
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("medium_term");

  // Usar el hook real de Spotify
  const { 
    isAuthenticated, 
    loading, 
    error, 
    login, 
    logout, 
    makeAuthenticatedRequest 
  } = useSpotifyAuth();

  const handleTimeRangeChange = (newRange) => {
    console.log("cambiando rango de tiempo", newRange);
    setSelectedTimeRange(newRange);
    // Actualizar las estadísticas con el nuevo rango de tiempo
    refresh(newRange);
  };

  // usar el hook useStats para obtener estadisticas
  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refresh,
  } = useStats(isAuthenticated ? selectedTimeRange : null);

  // Obtener datos del usuario cuando se autentica
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && !user) {
        try {
          const response = await makeAuthenticatedRequest('https://api.spotify.com/v1/me');
          const userData = await response.json();
          setUser(userData);
          console.log('Usuario autenticado:', userData);
        } catch (error) {
          console.error('Error obteniendo datos del usuario:', error);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, makeAuthenticatedRequest, user]);

  // Limpiar datos del usuario al cerrar sesion
  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-fullscreen">
        <SpotifyLogin onConnect={login} loading={loading} error={error} />
      </div>
    );
  }

  return (
    <Layout
      user={user}
      stats={stats}
      statsLoading={statsLoading}
      statsError={statsError}
      onLogout={handleLogout}
      refreshStats={refresh} 
      selectedTimeRange={selectedTimeRange}
      onTimeRangeChange={handleTimeRangeChange}
    />
  );
};

export default App;