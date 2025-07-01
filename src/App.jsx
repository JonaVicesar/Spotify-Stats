// src/App.jsx
import React, { useState, useEffect } from "react";
import Layout from "./components/layouts/Layout";
import SpotifyLogin from "./components/auth/SpotifyLogin";
import { useStats } from "./hooks/useStats";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // usar el hook useStats para obtener estadisticas
  // si el usuario no está autenticado pasamos null para evitar la llamada a la api
  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refresh,
  } = useStats(isAuthenticated ? "medium_term" : null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      // simulacion de autenticacion
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // simular datos de usuario 
      const mockUser = {
        id: "user123",
        display_name: "Usuario Demo",
        
      };

      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (err) {
      setError("Error en autenticación");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isAuthenticated) {
  return (
    <div className="auth-fullscreen">
      <SpotifyLogin onConnect={handleLogin} loading={loading} error={error} />
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
    />
  );
};

export default App;
