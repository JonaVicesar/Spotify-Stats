/**
 * @description funciones obtener las estadisticas
 * @author Jona
 */

// CONFIGURACION PARA LA API

const SPOTIFY_CONFIG = {
  API_BASE_URL: 'https://api.spotify.com/v1',
  TIME_RANGES: {
    SHORT_TERM: 'short_term',    // 4 semanas
    MEDIUM_TERM: 'medium_term',  // 6 meses
    LONG_TERM: 'long_term'       // mas de 6 meses
  },
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 50
};

const CACHE_CONFIG = {
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutos en ms
  CACHE_KEYS: {
    TOP_TRACKS: 'spotify_top_tracks',
    TOP_ARTISTS: 'spotify_top_artists',
    TOP_ALBUMS: 'spotify_top_albums',
    USER_STATS: 'spotify_user_stats'
  }
};


// DATOS MOCK PARA PRUEBA

const MOCK_DATA = {
  mostPlayedTrack: {
    id: "4uLU6hMCjMI75M1A2tKUQC",
    name: "Never Gonna Give You Up",
    artist: "Rick Astley",
    album: "Whenever You Need Somebody",
    totalMinutes: 234,
    totalPlays: 67,
    duration: 213000,
    popularity: 85,
    audioFeatures: {
      energy: 0.842,
      valence: 0.924,
      danceability: 0.653
    }
  },

  mostPlayedArtist: {
    id: "4Z8W4fKeB5YxbusRsdQVPb",
    name: "Radiohead",
    totalMinutes: 2847,
    totalPlays: 342,
    genres: ["alternative rock", "art rock", "melancholia"],
    imageUrl: "https://example.com/radiohead.jpg",
    popularity: 85
  },

  mostPlayedAlbum: {
    id: "6dVIqQ8qmQ183QyR79RTFt",
    name: "OK Computer",
    artist: "Radiohead",
    totalMinutes: 1243,
    totalPlays: 89,
    releaseDate: "1997-06-16",
    imageUrl: "https://example.com/okcomputer.jpg",
    totalTracks: 12
  },

  mostPlayedPlaylist: {
    id: "37i9dQZF1DX0XUsuxWHRQd",
    name: "RapCaviar",
    totalMinutes: 3421,
    totalPlays: 156,
    totalTracks: 65,
    description: "New music from Drake, Travis Scott, and more.",
    isOwn: false,
    owner: "Spotify"
  },

topTracks: [
  {
    id: "1",
    name: "Blinding Lights",
    artists: [{ name: "The Weeknd" }],
    album: { 
      name: "After Hours", 
      images: [{ url: "https://via.placeholder.com/150" }] 
    },
    duration_ms: 200000,
    popularity: 95
  },

],

topArtists: [
  {
    id: "1",
    name: "The Weeknd",
    genres: ["pop", "r&b"],
    images: [{ url: "https://via.placeholder.com/150" }],
    followers: { total: 15000000 },
    popularity: 95
  },
  
],

topAlbums: [
  {
    id: "1",
    name: "After Hours",
    artists: [{ name: "The Weeknd" }],
    images: [{ url: "https://via.placeholder.com/150" }],
    release_date: "2020-03-20",
    total_tracks: 14
  },
  
]
};


/**
 * clase para manejar errores 
 */
class SpotifyStatsError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', details = null) {
    super(message);
    this.name = 'SpotifyStatsError';
    this.code = code;
    this.details = details;
  }
}

/**
 * formatea minutos a un formato legible
 */
const formatMinutesToReadable = (minutes) => {
  try {
    if (!minutes || minutes < 0) return '0m';
    
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const remainingMinutes = minutes % 60;
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (remainingMinutes > 0 || parts.length === 0) parts.push(`${remainingMinutes}m`);
    
    return parts.join(' ');
  } catch (error) {
    console.error('Error formatting minutes:', error);
    return `${minutes}m`;
  }
};

/**
 * valida el tiempo
 */
const validateTimeRange = (timeRange) => {
  const validRanges = Object.values(SPOTIFY_CONFIG.TIME_RANGES);
  return validRanges.includes(timeRange) ? timeRange : SPOTIFY_CONFIG.TIME_RANGES.MEDIUM_TERM;
};

/**
 * valida y ajusta el límite de resultados
 */
const validateLimit = (limit) => {
  const numLimit = parseInt(limit, 10);
  return isNaN(numLimit) ? SPOTIFY_CONFIG.DEFAULT_LIMIT : Math.min(Math.max(1, numLimit), SPOTIFY_CONFIG.MAX_LIMIT);
};

/**
 * simular carga
 */
const simulateNetworkDelay = (ms = 300) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// FUNCIONES ED AUTENTICACION
/**
 * Bbtiene el token de acceso de SpotifY
 */
const getAccessToken = () => {
  try {
    return localStorage.getItem('spotify_access_token') || null;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

/**
 * Verifica si hay un token valido
 */
const hasValidToken = () => {
  const token = getAccessToken();
  const tokenExpiry = localStorage.getItem('spotify_token_expiry');
  
  if (!token || !tokenExpiry) return false;
  
  return Date.now() < parseInt(tokenExpiry, 10);
};

/**
 * Hace una peticion a la API de Spotify
 */
const spotifyApiRequest = async (endpoint, options = {}) => {
  const token = getAccessToken();
  
  if (!token) {
    throw new SpotifyStatsError('No access token available', 'NO_TOKEN');
  }

  try {
    const response = await fetch(`${SPOTIFY_CONFIG.API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (response.status === 401) {
      throw new SpotifyStatsError('Token expired or invalid', 'INVALID_TOKEN');
    }

    if (!response.ok) {
      throw new SpotifyStatsError(
        `API request failed: ${response.status}`,
        'API_ERROR',
        { status: response.status, statusText: response.statusText }
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof SpotifyStatsError) {
      throw error;
    }
    throw new SpotifyStatsError('Network request failed', 'NETWORK_ERROR', error);
  }
};

// FUNCIONES PARA ESTADISTICAS
/**
 * Obtiene el artista mas reproducido
 */
const getMostPlayedArtist = async () => {
  try {
    await simulateNetworkDelay();
    
    if (!hasValidToken()) {
      console.log('Using mock data - no valid token');
      return MOCK_DATA.mostPlayedArtist;
    }

    // TODO: todavia no conecto a la api de spotifi
    
    return MOCK_DATA.mostPlayedArtist;
  } catch (error) {
    console.error('Error getting most played artist:', error);
    return MOCK_DATA.mostPlayedArtist;
  }
};

/**
 * Obtiene el album mas reproducido
 */
const getMostPlayedAlbum = async () => {
  try {
    await simulateNetworkDelay();
    
    if (!hasValidToken()) {
      console.log('Using mock data - no valid token');
      return MOCK_DATA.mostPlayedAlbum;
    }

    // TODO: todavia no conecto a la api de spotify
    
    return MOCK_DATA.mostPlayedAlbum;
  } catch (error) {
    console.error('Error getting most played album:', error);
    return MOCK_DATA.mostPlayedAlbum;
  }
};

/**
 * Obtiene la playlist mas reproducida
 */
const getMostPlayedPlaylist = async () => {
  try {
    await simulateNetworkDelay();
    
    if (!hasValidToken()) {
      console.log('Using mock data - no valid token');
      return MOCK_DATA.mostPlayedPlaylist;
    }

    // TODO: todavia no conecto a la api de spotify
    
    return MOCK_DATA.mostPlayedPlaylist;
  } catch (error) {
    console.error('Error getting most played playlist:', error);
    return MOCK_DATA.mostPlayedPlaylist;
  }
};

/**
 * Obtiene la cancion mas reproducida
 */
const getMostPlayedTrack = async () => {
  try {
    await simulateNetworkDelay();
    
    if (!hasValidToken()) {
      console.log('Using mock data - no valid token');
      return MOCK_DATA.mostPlayedTrack;
    }

    // TODO: todavia no conecto a la api de spotify
    
    return MOCK_DATA.mostPlayedTrack;
  } catch (error) {
    console.error('Error getting most played track:', error);
    return MOCK_DATA.mostPlayedTrack;
  }
};

/**
 * Obtiene el top de canciones del usuario
 */
const getTopTracks = async (timeRange = 'medium_term', limit = 50) => {
  try {
    const validTimeRange = validateTimeRange(timeRange);
    const validLimit = validateLimit(limit);
    
    await simulateNetworkDelay();
    
    if (!hasValidToken()) {
      console.log('Using mock data - no valid token');
      return MOCK_DATA.topTracks.slice(0, validLimit);
    }

    // TODO: todavia no conecto a la api de spotify
    
    return MOCK_DATA.topTracks.slice(0, validLimit);
  } catch (error) {
    console.error('Error getting top tracks:', error);
    return MOCK_DATA.topTracks.slice(0, validateLimit(limit));
  }
};

/**
 * Obtiene el top de artistas del usuario
 */
const getTopArtists = async (timeRange = 'medium_term', limit = 50) => {
  try {
    const validTimeRange = validateTimeRange(timeRange);
    const validLimit = validateLimit(limit);
    
    await simulateNetworkDelay();
    
    if (!hasValidToken()) {
      console.log('Using mock data - no valid token');
      return MOCK_DATA.topArtists.slice(0, validLimit);
    }

    // TODO: todavia no conecto a la api de spotify
    
    return MOCK_DATA.topArtists.slice(0, validLimit);
  } catch (error) {
    console.error('Error getting top artists:', error);
    return MOCK_DATA.topArtists.slice(0, validateLimit(limit));
  }
};

/**
 * Obtiene el top de albumes del usuario
 */
const getTopAlbums = async (timeRange = 'medium_term', limit = 50) => {
  try {
    const validTimeRange = validateTimeRange(timeRange);
    const validLimit = validateLimit(limit);
    
    await simulateNetworkDelay();
    
    if (!hasValidToken()) {
      console.log('Using mock data - no valid token');
      return MOCK_DATA.topAlbums.slice(0, validLimit);
    }

    // TODO: todavia no conecto a la api de spotify
    
    return MOCK_DATA.topAlbums.slice(0, validLimit);
  } catch (error) {
    console.error('Error getting top albums:', error);
    return MOCK_DATA.topAlbums.slice(0, validateLimit(limit));
  }
};

/**
 * Obtiene estadisticas generales de escucha del usuario
 */
const getListeningStats = async () => {
  try {
    await simulateNetworkDelay();
    
    const mockStats = {
      totalMinutesListened: 45672,
      totalTracksPlayed: 8934,
      totalArtists: 1247,
      totalAlbums: 567,
      averageSessionLength: 32,
      mostActiveDay: "Viernes",
      mostActiveHour: "20:00",
      genreDiversity: 85,
      discoveryRate: 12,
      lastUpdated: new Date().toISOString()
    };

    if (!hasValidToken()) {
      console.log('Using mock data - no valid token');
      return mockStats;
    }

    // TODO: todavia no conecto a la api de spotify
    
    return mockStats;
  } catch (error) {
    console.error('Error getting listening stats:', error);
    throw new SpotifyStatsError('Failed to get listening stats', 'STATS_ERROR', error);
  }
};

/**
 * Obtiene estadisticas por período específico

 */
const getStatsByPeriod = async (period = 'month') => {
  try {
    const validPeriods = ['week', 'month', 'year'];
    const validPeriod = validPeriods.includes(period) ? period : 'month';
    
    await simulateNetworkDelay();
    
    const currentPeriodStats = {
      week: {
        minutesListened: 678,
        tracksPlayed: 156,
        newArtistsDiscovered: 12,
        topGenre: "Indie Rock",
        moodScore: 7.2,
        period: 'week'
      },
      month: {
        minutesListened: 2847,
        tracksPlayed: 634,
        newArtistsDiscovered: 45,
        topGenre: "Alternative Rock",
        moodScore: 6.8,
        period: 'month'
      },
      year: {
        minutesListened: 34567,
        tracksPlayed: 7823,
        newArtistsDiscovered: 234,
        topGenre: "Rock",
        moodScore: 7.1,
        period: 'year'
      }
    };
    
    return currentPeriodStats[validPeriod];
  } catch (error) {
    console.error('Error getting stats by period:', error);
    throw new SpotifyStatsError('Failed to get period stats', 'PERIOD_STATS_ERROR', error);
  }
};

/**
 * Obtiene todos los datos del usuario en un objeto
 */
const getAllUserStats = async (options = {}) => {
  const {
    timeRange = 'medium_term',
    limit = 50,
    includePeriodStats = true,
    period = 'month'
  } = options;

  try {
    console.log('Loading user stats with options:', options);
    
    
    const [
      mostPlayedTrack,
      mostPlayedArtist,
      mostPlayedAlbum,
      mostPlayedPlaylist,
      topTracks,
      topArtists,
      topAlbums,
      generalStats,
      periodStats
    ] = await Promise.all([
      getMostPlayedTrack(),
      getMostPlayedArtist(),
      getMostPlayedAlbum(),
      getMostPlayedPlaylist(),
      getTopTracks(timeRange, limit),
      getTopArtists(timeRange, limit),
      getTopAlbums(timeRange, limit),
      getListeningStats(),
      includePeriodStats ? getStatsByPeriod(period) : Promise.resolve(null)
    ]);

    const consolidatedStats = {
      mostPlayed: {
        track: mostPlayedTrack,
        artist: mostPlayedArtist,
        album: mostPlayedAlbum,
        playlist: mostPlayedPlaylist
      },
      tops: {
        tracks: topTracks,
        artists: topArtists,
        albums: topAlbums
      },
      generalStats,
      currentPeriod: periodStats,
      metadata: {
        timeRange,
        limit,
        generatedAt: new Date().toISOString(),
        hasValidToken: hasValidToken()
      }
    };

    console.log('User stats loaded successfully');
    return consolidatedStats;
  } catch (error) {
    console.error('Error getting all user stats:', error);
    throw new SpotifyStatsError('Failed to get user stats', 'ALL_STATS_ERROR', error);
  }
};

export {
  // Funciones principales
  getMostPlayedArtist,
  getMostPlayedAlbum,
  getMostPlayedPlaylist,
  getMostPlayedTrack,
  getTopTracks,
  getTopArtists,
  getTopAlbums,
  getListeningStats,
  getStatsByPeriod,
  getAllUserStats,
  
  formatMinutesToReadable,
  validateTimeRange,
  validateLimit,
  hasValidToken,
  getAccessToken,
  
  // Configuracion
  SPOTIFY_CONFIG,
  
  // Clase para errores
  SpotifyStatsError
};