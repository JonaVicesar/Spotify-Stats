import { useState, useEffect } from 'react';
import { getAllUserStats } from '../services/statsServices';

/**
 * hook para manejar estadisticas del usuario
 * @param {string} timeRange - rango de tiempo 'short_term', 'medium_term', 'long_term'
 * @returns {Object} { stats, loading, error, refresh }
 */
export const useStats = (timeRange = 'medium_term') => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // funcion para cargar datos
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // peticion a la api para obtener las estadisticas
      const data = await getAllUserStats({ 
        
        timeRange,
        limit: 50, 
        includePeriodStats: true
      });
      
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message || 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  //effect para cargar datos al cambiar el timeRange
  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  console.log('MOST PLAYED', stats?.mostPlayed.track?.totalMinutes);

  return { 
    stats, 
    loading, 
    error,
    refresh: fetchStats 
  };

 
};
