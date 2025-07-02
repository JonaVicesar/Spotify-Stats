// Constantes para la aplicación Spotify DNA
export const SPOTIFY_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  REDIRECT_URI: import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:5173/callback',
  SCOPES: [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
    'user-library-read',
    'playlist-read-private',
    'user-read-playback-state',
    'user-read-currently-playing'
  ].join(' ')
};

export const TIME_RANGES = {
  SHORT_TERM: 'short_term', // 4 semanas
  MEDIUM_TERM: 'medium_term', // 6 meses  
  LONG_TERM: 'long_term' // varios años
};

export const TIME_RANGE_LABELS = {
  [TIME_RANGES.SHORT_TERM]: 'Último mes',
  [TIME_RANGES.MEDIUM_TERM]: 'Últimos 6 meses',
  [TIME_RANGES.LONG_TERM]: 'Desde siempre'
};

export const AUDIO_FEATURES = {
  ACOUSTICNESS: 'acousticness',
  DANCEABILITY: 'danceability',
  ENERGY: 'energy',
  INSTRUMENTALNESS: 'instrumentalness',
  LIVENESS: 'liveness',
  LOUDNESS: 'loudness',
  SPEECHINESS: 'speechiness',
  TEMPO: 'tempo',
  VALENCE: 'valence'
};

export const AUDIO_FEATURES_LABELS = {
  [AUDIO_FEATURES.ACOUSTICNESS]: 'Acústico',
  [AUDIO_FEATURES.DANCEABILITY]: 'Bailable',
  [AUDIO_FEATURES.ENERGY]: 'Energía',
  [AUDIO_FEATURES.INSTRUMENTALNESS]: 'Instrumental',
  [AUDIO_FEATURES.LIVENESS]: 'En vivo',
  [AUDIO_FEATURES.LOUDNESS]: 'Volumen',
  [AUDIO_FEATURES.SPEECHINESS]: 'Vocal',
  [AUDIO_FEATURES.TEMPO]: 'Tempo',
  [AUDIO_FEATURES.VALENCE]: 'Positividad'
};

export const CHART_COLORS = {
  PRIMARY: '#1DB954',
  SECONDARY: '#191414',
  ACCENT: '#1ed760',
  GRADIENT: ['#1DB954', '#1ed760', '#00d4aa'],
  MOOD_COLORS: {
    HAPPY: '#FFD700',
    SAD: '#4169E1',
    ENERGETIC: '#FF4500',
    CALM: '#32CD32',
    ANGRY: '#DC143C',
    ROMANTIC: '#FF69B4'
  }
};

export const API_ENDPOINTS = {
  BASE_URL: 'https://api.spotify.com/v1',
  PROFILE: '/me',
  TOP_TRACKS: '/me/top/tracks',
  TOP_ARTISTS: '/me/top/artists',
  RECENTLY_PLAYED: '/me/player/recently-played',
  AUDIO_FEATURES: '/audio-features',
  RECOMMENDATIONS: '/recommendations',
  SEARCH: '/search'
};

export const LIMITS = {
  DEFAULT: 20,
  MAX: 50,
  MIN: 1
};

export const ERROR_MESSAGES = {
  NO_DATA: 'No se encontraron datos',
  API_ERROR: 'Error al conectar con Spotify',
  AUTH_ERROR: 'Error de autenticación',
  NETWORK_ERROR: 'Error de conexión'
};

export const SUCCESS_MESSAGES = {
  DATA_LOADED: 'Datos cargados exitosamente',
  CONNECTED: 'Conectado a Spotify',
  STATS_UPDATED: 'Estadísticas actualizadas'
};