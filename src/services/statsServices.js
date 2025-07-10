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
    name: "Rapea",
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
 * valida el rango tiempo
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

// FUNCIONES DE AUTENTICACION
/**
 * obtiene el token de acceso de SpotifY
 */
const getAccessToken = () => {
  try {
    const token = localStorage.getItem('spotify_access_token');
    console.log('token recuperado:', token ? 'Token exists' : 'No token found');
    return token;
  } catch (error) {
    console.error('error accediendo al token:', error);
    return null;
  }
};


/**
 * Verifica si hay un token valido
 */
const hasValidToken = () => {
  const token = getAccessToken();
 
  if (!token) {
    console.log('no hay token disponible');
    return false;
  }
 
  const tokenExpiry = localStorage.getItem('spotify_token_expiry');
  console.log('expiracion del token', tokenExpiry);
 
  if (!tokenExpiry) {
    console.log('No token expiry found, checking if token works anyway');
    // si no hay fecha de expiracion, intentemos usar el token de todas formas
    return true;
  }
 
  const currentTime = Date.now();
  const expiryTime = parseInt(tokenExpiry, 10);
  const isValid = currentTime < expiryTime;
 
  console.log('Token validation:', {
    currentTime: new Date(currentTime).toISOString(),
    expiryTime: new Date(expiryTime).toISOString(),
    isValid
  });
 
  return isValid;
};

/*nueva funcion para guardar el token con su fecha de expiracion */
const saveAccessToken = (token, expiresIn = 3600) => {
  try {
    localStorage.setItem('spotify_access_token', token);
    // Calcular fecha de expiración (expiresIn está en segundos)
    const expiryTime = Date.now() + (expiresIn * 1000);
    localStorage.setItem('spotify_token_expiry', expiryTime.toString());
   
    console.log('Token saved successfully:', {
      tokenExists: !!token,
      expiresAt: new Date(expiryTime).toISOString(),
      expiresInMinutes: Math.round(expiresIn / 60)
    });
  } catch (error) {
    console.error('Error saving access token:', error);
  }
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
const getMostPlayedArtist = async (timeRange = 'medium_term') => {
  try {
    await simulateNetworkDelay();
   
    if (!hasValidToken()) {
      console.log('Using mock data - no valid token');
      return MOCK_DATA.mostPlayedArtist;
    }

    // Llamada real a la API
    const response = await spotifyApiRequest(`/me/top/artists?limit=1&time_range=${timeRange}`);
   
    if (!response.items || response.items.length === 0) {
      console.log('No artists found, using mock data');
      return MOCK_DATA.mostPlayedArtist;
    }
   
    const artist = response.items[0];
   
    return {
      id: artist.id,
      name: artist.name,
      totalMinutes: 0, // no esta disponible en la API
      totalPlays: 0,   // tampoco esta disponible
      genres: artist.genres || [],
      imageUrl: artist.images && artist.images.length > 0 ? artist.images[0].url : null,
      popularity: artist.popularity
    };
  } catch (error) {
    console.error('Error getting most played artist:', error);
    return MOCK_DATA.mostPlayedArtist;
  }
};

/**
 * Obtiene el album mas reproducido
 */
const getMostPlayedAlbum = async (timeRange = 'medium_term') => {
  try {
    await simulateNetworkDelay();
   
    if (!hasValidToken()) {
      console.log('Using mock data - no valid token');
      return MOCK_DATA.mostPlayedAlbum;
    }

    // obtener canciones 
    const response = await spotifyApiRequest(`/me/top/tracks?limit=50&time_range=${timeRange}`);
   
    if (!response.items || response.items.length === 0) {
      console.log('No tracks found, using mock data');
      return MOCK_DATA.mostPlayedAlbum;
    }
   
    // contar cuantas veces se repite cada album
    const albumCounts = {};
    response.items.forEach((track, index) => {
      const album = track.album;
      const albumId = album.id;
     
      if (!albumCounts[albumId]) {
        albumCounts[albumId] = {
          id: albumId,
          name: album.name,
          artist: album.artists[0]?.name || 'Unknown Artist',
          imageUrl: album.images && album.images.length > 0 ? album.images[0].url : null,
          releaseDate: album.release_date,
          totalTracks: album.total_tracks,
          count: 0,
          tracks: []
        };
      }
     
      // dar una puntuacion a cada canción basada en su posición en el top
      const weight = 50 - index; // las primeras tinen mas puntacion
      albumCounts[albumId].count += weight;
      albumCounts[albumId].tracks.push(track);
    });
   
    // encontrar el album con mayor puntuacion
    const mostPlayedAlbum = Object.values(albumCounts)
      .sort((a, b) => b.count - a.count)[0];
   
    if (!mostPlayedAlbum) {
      return MOCK_DATA.mostPlayedAlbum;
    }
   
    // calcular el total de minutos escuchados
    const totalMinutes = Math.round(
      mostPlayedAlbum.tracks.reduce((sum, track) => sum + track.duration_ms, 0) / (1000 * 60)
    );
   
    return {
      id: mostPlayedAlbum.id,
      name: mostPlayedAlbum.name,
      artist: mostPlayedAlbum.artist,
      totalMinutes: totalMinutes,
      totalPlays: mostPlayedAlbum.tracks.length, // numero de canciones del album en el top
      releaseDate: mostPlayedAlbum.releaseDate,
      imageUrl: mostPlayedAlbum.imageUrl,
      totalTracks: mostPlayedAlbum.totalTracks
    };
  } catch (error) {
    console.error('Error getting most played album:', error);
    return MOCK_DATA.mostPlayedAlbum;
  }
};

/**
 * obtiene la playlist mas reproducida
 * spotify no tiene endpoint para obtener la playlist mas reproducida
 */
const getMostPlayedPlaylist = async (timeRange = 'medium_term') => {
  try {
    await simulateNetworkDelay();
   
    if (!hasValidToken()) {
      console.log('Using mock data - no valid token');
      return MOCK_DATA.mostPlayedPlaylist;
    }

    // obtener playlists del usuario
    const playlistsResponse = await spotifyApiRequest('/me/playlists?limit=50');
   
    if (!playlistsResponse.items || playlistsResponse.items.length === 0) {
      console.log('No hay playlists');
      return MOCK_DATA.mostPlayedPlaylist;
    }

    // obtener top tracks para comparar
    const topTracksResponse = await spotifyApiRequest(`/me/top/tracks?limit=50&time_range=${timeRange}`);
   
    if (!topTracksResponse.items) {
      return MOCK_DATA.mostPlayedPlaylist;
    }

    const topTrackIds = new Set(topTracksResponse.items.map(track => track.id));
    let bestPlaylist = null;
    let maxMatches = 0;

    // verificar cada playlist para ver cuantas canciones coinciden con el top
    for (const playlist of playlistsResponse.items.slice(0, 10)) { 
      try {
        const tracksResponse = await spotifyApiRequest(`/playlists/${playlist.id}/tracks?limit=50`);
       
        if (tracksResponse.items) {
          const matches = tracksResponse.items.filter(item =>
            item.track && topTrackIds.has(item.track.id)
          ).length;

          if (matches > maxMatches) {
            maxMatches = matches;
            bestPlaylist = {
              id: playlist.id,
              name: playlist.name,
              totalMinutes: 0, // no esta disponible en la api
              totalPlays: matches, // canciones que coinciden con el top
              totalTracks: playlist.tracks.total,
              description: playlist.description || '',
              isOwn: playlist.owner.id === (await getCurrentUserId()),
              owner: playlist.owner.display_name || playlist.owner.id,
              imageUrl: playlist.images && playlist.images.length > 0 ? playlist.images[0].url : null
            };
          }
        }
      } catch (error) {
        console.error(`Error checking playlist ${playlist.id}:`, error);
        continue;
      }
    }
    return bestPlaylist || MOCK_DATA.mostPlayedPlaylist;
  } catch (error) {
    console.error('Error getting most played playlist:', error);
    return MOCK_DATA.mostPlayedPlaylist;
  }
};

/**
 * obtiene el id del usuario actual y se usa para verificar si una playlist es del usuario
 */
const getCurrentUserId = async () => {
  try {
    const userProfile = await spotifyApiRequest('/me');
    return userProfile.id;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
};

/**
 * obtiene la cancion mas reproducida
 */
const getMostPlayedTrack = async (timeRange = 'medium_term') => {
  try {
    await simulateNetworkDelay();
   
    if (!hasValidToken()) {
      console.log('Using mock data - no valid token');
      return MOCK_DATA.mostPlayedTrack;
    }

    // llamada a la API
    const response = await spotifyApiRequest(`/me/top/tracks?limit=1&time_range=${timeRange}`);
   
    if (!response.items || response.items.length === 0) {
      console.log('No tracks found, using mock data');
      return MOCK_DATA.mostPlayedTrack;
    }
   
    const track = response.items[0];
   
    return {
      id: track.id,
      name: track.name,
      artist: track.artists[0]?.name || 'Unknown Artist',
      album: track.album?.name || 'Unknown Album',
      imageUrl: track.album?.images?.[0].url || "unknown",
      totalMinutes: track.duration_ms, 
      totalPlays: 0,   // no esta disponible en la api
      duration: track.duration_ms,
      popularity: track.popularity,
      audioFeatures: {
        energy: 0,
        valence: 0,
        danceability: 0
        
      } //objeto vacio por ahora
    };
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
      console.log('usando datos mock ');
      return MOCK_DATA.topTracks.slice(0, validLimit);
    }


    // llamada a la api
    const response = await spotifyApiRequest(`/me/top/tracks?limit=${validLimit}&time_range=${validTimeRange}`);
   
    if (!response.items || response.items.length === 0) {
      console.log('No top tracks found, using mock data');
      return MOCK_DATA.topTracks.slice(0, validLimit);
    }
   
    return response.items.map((track, index) => ({
      id: track.id,
      name: track.name,
      artists: track.artists,
      album: track.album,
      duration_ms: track.duration_ms,
      popularity: track.popularity,
      rank: index + 1
    }));
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
      console.log('usando datos mock #######');
      return MOCK_DATA.topArtists.slice(0, validLimit);
    }

    const response = await spotifyApiRequest(`/me/top/artists?limit=${validLimit}&time_range=${validTimeRange}`);
   
    if (!response.items || response.items.length === 0) {
      console.log('no se encontraron artistas, usando datos mock');
      return MOCK_DATA.topArtists.slice(0, validLimit);
    }
   
    return response.items.map((artist, index) => ({
      id: artist.id,
      name: artist.name,
      genres: artist.genres,
      images: artist.images,
      followers: artist.followers,
      popularity: artist.popularity,
      rank: index + 1
    }));
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

    // obtener canciones para contar reproducciones de albumes
    // spotify no tiene un endpoint directo para top albums por lo que usamos top tracks
    const response = await spotifyApiRequest(`/me/top/tracks?limit=50&time_range=${validTimeRange}`);
   
    if (!response.items || response.items.length === 0) {
      return MOCK_DATA.topAlbums.slice(0, validLimit);
    }
   
    // contar cuantas veces se repite cada album y dar una puntuacion basada en la posicion de la cancion en el top
    const albumCounts = {};
    response.items.forEach((track, index) => {
      const album = track.album;
      const albumId = album.id;
     
      if (!albumCounts[albumId]) {
        albumCounts[albumId] = {
          id: albumId,
          name: album.name,
          artists: album.artists,
          images: album.images,
          release_date: album.release_date,
          total_tracks: album.total_tracks,
          album_type: album.album_type,
          score: 0,
          trackCount: 0
        };
      }
     
      //dar puntuacion a cada cancion basada en su posicion en el top
      const weight = 50 - index;
      albumCounts[albumId].score += weight;
      albumCounts[albumId].trackCount++;
    });
   
    // convertir el objeto a un array y ordenar por puntuacion
    const topAlbums = Object.values(albumCounts)
      .sort((a, b) => b.score - a.score)
      .slice(0, validLimit)
      .map((album, index) => ({
        id: album.id,
        name: album.name,
        artists: album.artists,
        images: album.images,
        release_date: album.release_date,
        total_tracks: album.total_tracks,
        album_type: album.album_type,
        rank: index + 1,
        tracksInTop: album.trackCount 
      }));
   
    return topAlbums;
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
 * obtiene las canciones que el usuario agrego a "Me gusta" recientemente
 */
const getRecentlyLikedTracks = async (timeRange = 'medium_term') => {
  try {
    await simulateNetworkDelay();
    
    if (!hasValidToken()) {
      console.log('Using mock data - no valid token');
      return {
        newLikedTracks: 12,
        tracks: [],
        period: timeRange
      };
    }

    // obtener canciones que el usuario agrego a "me gusta"
    const response = await spotifyApiRequest('/me/tracks?limit=50');
    
    if (!response.items || response.items.length === 0) {
      return {
        newLikedTracks: 0,
        tracks: [],
        period: timeRange
      };
    }

    // calcular fecha limite segun el time_range
    const now = new Date();
    let limitDate;
    
    switch (timeRange) {
      case 'short_term':
        limitDate = new Date(now.getTime() - (4 * 7 * 24 * 60 * 60 * 1000)); // 4 semanas
        break;
      case 'medium_term':
        limitDate = new Date(now.getTime() - (6 * 30 * 24 * 60 * 60 * 1000)); // 6 meses
        break;
      case 'long_term':
        limitDate = new Date(now.getTime() - (12 * 30 * 24 * 60 * 60 * 1000)); // 1 año
        break;
      default:
        limitDate = new Date(now.getTime() - (6 * 30 * 24 * 60 * 60 * 1000));
    }

    // Filtrar canciones agregadas en el período
    const recentTracks = response.items.filter(item => {
      const addedDate = new Date(item.added_at);
      return addedDate >= limitDate;
    });

    return {
      newLikedTracks: recentTracks.length,
      tracks: recentTracks.map(item => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0]?.name || 'Unknown Artist',
        album: item.track.album?.name || 'Unknown Album',
        addedAt: item.added_at,
        imageUrl: item.track.album?.images?.[0]?.url || null
      })),
      period: timeRange,
      periodDescription: timeRange === 'short_term' ? 'últimas 4 semanas' : 
                        timeRange === 'medium_term' ? 'últimos 6 meses' : 
                        'último año'
    };
  } catch (error) {
    console.error('Error getting recently liked tracks:', error);
    return {
      newLikedTracks: 0,
      tracks: [],
      period: timeRange
    };
  }
};

/**
 * obtiene todos los datos del usuario en un objeto
 */
const getAllUserStats = async (options = {}) => {
  const {
    timeRange = 'medium_term',
    limit = 50,
    includePeriodStats = true,
    period = 'month'
  } = options;

  try {
    // Ejecutar todas las consultas en paralelo para mejor rendimiento
    const [
      mostPlayedTrack,
      mostPlayedArtist,
      mostPlayedAlbum,
      mostPlayedPlaylist,
      topTracks,
      topArtists,
      topAlbums,
      generalStats,
      recentlyLikedTracks,
      periodStats
    ] = await Promise.all([
      getMostPlayedTrack(timeRange),
      getMostPlayedArtist(timeRange),
      getMostPlayedAlbum(timeRange),
      getMostPlayedPlaylist(timeRange),
      getTopTracks(timeRange, limit),
      getTopArtists(timeRange, limit),
      getTopAlbums(timeRange, limit),
      getListeningStats(),
      getRecentlyLikedTracks(timeRange),
      includePeriodStats ? getStatsByPeriod(period) : Promise.resolve(null)
    ]);

    console.log("PLAYLISTTTTT",mostPlayedPlaylist);

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
      },
      recentlyLikedTracks: recentlyLikedTracks
    };

    console.log('se cargaron las estadisticas');
    return consolidatedStats;
  } catch (error) {
    console.error('no se cargaron', error);
    throw new SpotifyStatsError('Failed to get user stats', 'ALL_STATS_ERROR', error);
  }
};

const testApiConnection = async () => {
  try {
    if (!hasValidToken()) {
      console.log('No valid token for API test');
      return { success: false, error: 'No valid token' };
    }
   
    // Test simple: obtener perfil del usuario
    const response = await spotifyApiRequest('/me');
    console.log('API Test successful:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('API Test failed:', error);
    return { success: false, error: error.message };
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
  getRecentlyLikedTracks,
  
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