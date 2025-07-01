// hooks/useStats.js
import { useState, useEffect } from 'react';
import {
  getMostPlayedArtist,
  getMostPlayedAlbum,
  getMostPlayedPlaylist,
  getMostPlayedTrack,
  getTopTracks,
  getTopArtists,
  getTopAlbums,
  getListeningStats,
  getStatsByPeriod,
  getAllUserStats
} from '../services/statsServices';

// Hook principal para obtener todas las estadísticas
export const useStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const allStats = getAllUserStats();
        setStats(allStats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

// Hook específico para top tracks
export const useTopTracks = (timeRange = 'medium_term', limit = 10) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const topTracks = getTopTracks(timeRange, limit);
      setTracks(topTracks);
      setLoading(false);
    };

    fetchTracks();
  }, [timeRange, limit]);

  return { tracks, loading };
};

// Hook específico para top artists
export const useTopArtists = (timeRange = 'medium_term', limit = 10) => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const topArtists = getTopArtists(timeRange, limit);
      setArtists(topArtists);
      setLoading(false);
    };

    fetchArtists();
  }, [timeRange, limit]);

  return { artists, loading };
};

// Hook específico para top albums
export const useTopAlbums = (timeRange = 'medium_term', limit = 10) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const topAlbums = getTopAlbums(timeRange, limit);
      setAlbums(topAlbums);
      setLoading(false);
    };

    fetchAlbums();
  }, [timeRange, limit]);

  return { albums, loading };
};

// Hook para estadísticas más reproducidas
export const useMostPlayed = () => {
  const [mostPlayed, setMostPlayed] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMostPlayed = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = {
        track: getMostPlayedTrack(),
        artist: getMostPlayedArtist(),
        album: getMostPlayedAlbum(),
        playlist: getMostPlayedPlaylist()
      };
      
      setMostPlayed(data);
      setLoading(false);
    };

    fetchMostPlayed();
  }, []);

  return { mostPlayed, loading };
};

// Hook para estadísticas generales
export const useListeningStats = () => {
  const [listeningStats, setListeningStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListeningStats = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const stats = getListeningStats();
      setListeningStats(stats);
      setLoading(false);
    };

    fetchListeningStats();
  }, []);

  return { listeningStats, loading };
};