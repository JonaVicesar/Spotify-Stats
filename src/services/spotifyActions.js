/**
 * funcion para hacer las peticiones a la api(helper)
 */
const spotifyApiRequest = async (token, options = {}) => {
  const token = localStorage.getItem("spotify_api_request");

  if (!token) {
    throw new Error("No hay token de acceso");
  }

  const response = await fetch(
    `https://api.spotify.com/v1${endpoint}`,
    {
      Authorization: `Bearear ${token}`,
      "Content-Type": "aplication/json",
      ...options.headers,
    },
    ...options
  );

  if (!response.ok) {
    throw new Error(`Error en la API: ${response.status}`);
  }

  return response.json();
};

const {userId} = await spotifyApiRequest('/me');

/**
 * REPRODCIR CANCION
 */
export const playTrack = async (trackId, contextUri = null) => {
  try {
    //verificar que hayan dispositivos activos
    const devices = await spotifyApiRequest("me/player/devices");

    if (!devices.devices || devices.devices.length === 0) {
      // si no hay dispositivos se abre spotify web
      window.open(`https://open.spotify.com/track/${trackId}`, `_blank`);
      return;
    }

    //buscar un dispositivo activo
    const activeDevice = devices.devices.find((d) => d.is_active);

    //body para la peticion a la api
    const body = {
      device_id: activeDevice.id,
      uris: [`spotify:track:${trackId}`],
    };

    //si hay context uri se incluye
    if (contextUri) {
      body.context_uri = contextUri;
    }

    await spotifyApiRequest("/me/player/player", {
      method: "PUT",
      body: JSON.stringify({
        device_id: activeDevice.id,
        ...body,
        ...(contextUri && { context_uri: contextUri }),
      }),
    });
  } catch (error) {
    console.error("Error reproduciendo canción", error);
    //abrir el navegador
    window.open(`https://open.spotify.com/track/${trackId}`, "_blank");
  }
};

/**
 * AGREGAR A UNA PLAYLIST
 */
export const addToPlayList = async (trackId) => {
    //TODO
};

/**
 * VER ALBUM
 */
export const viewAlbum = (albumId) =>{
    //abrir el album
    window.open(`https://open.spotify.com/album/${albumId}`, '_blank')
}

/**
 * VER ARTISTA
 */
export const viewArtist = (artistId) => {
    //abrir el perfil del artista
    window.open(`https://open.spotify.com/artist/${artistId}`, 'blank');
}

/**
 * SEGUIR AL ARTISTA
 */
export const followArtist = async(artistId) =>{
    try {
        await spotifyApiRequest('/me/following', {
            method: 'PUT',
            body: JSON.stringify({
                type: 'artist',
                ids: [artistId]
            })
        });

        alert(`Ya sigues a ${artistId}`);

    }catch(error){
        console.error('Error al intentar seguir al artista:', error);
        alert('Error al trata de seguir al artista')
    }
}

