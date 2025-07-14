import { config } from "@fortawesome/fontawesome-svg-core";
import { Contact } from "lucide-react";

/**
 * funcion para hacer las peticiones a la api(helper)
 */
const spotifyApiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("spotify_access_token");

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

/**
 * obtener el userId
 */
let userId = null;
const getUserId = async () => {
  const response = await spotifyApiRequest("/me");
  userId = response;
  return userId;
};

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
export const viewAlbum = (albumId) => {
  //abrir el album
  window.open(`https://open.spotify.com/album/${albumId}`, "_blank");
};

/**
 * VER ARTISTA
 */
export const viewArtist = (artistId) => {
  //abrir el perfil del artista
  window.open(`https://open.spotify.com/artist/${artistId}`, "_blank");
};

/**
 * SEGUIR AL ARTISTA
 */
export const followArtist = async (artistId) => {
  try {
    await spotifyApiRequest("/me/following", {
      method: "PUT",
      body: JSON.stringify({
        type: "artist",
        ids: [artistId],
      }),
    });

    alert(`Ya sigues a ${artistId}`);
  } catch (error) {
    console.error("Error al intentar seguir al artista:", error);
    alert("Error al trata de seguir al artista");
  }
};

/**
 * GUARDAR ALBUM
 */
export const saveAlbum = ""; //TODO


/**
 * REPRODUCIR PLAYLIST
 */
export const playPlaylist = async (playlistId) => {

  try {
    const devices = await spotifyApiRequest("me/player/devices");

    if (!devices || devices.devices.length === 0){

      //si no hay dispositivos abrimos spotify wed
      window.open(`https://open.spotify.com/playlist/${playlistId}`, '_blank')
      return;
    }

    //ver un dispositivo activo
    const activeDevice = devices.devices.find((d) => d.is_active) || devices.devices[0];

    await spotifyApiRequest('me/player/play', {
      method: 'PUT',
      body: JSON.stringify({
        device_id:activeDevice.id,
        contextUri: `spotify:playlist:${playPlaylist}`
      })
    });

  }catch(error){
    console.error("Ocurrio un error intentando reproducir la playlist", error);
    window.open(`https://open.spotify.com/playlist/${playlistId}`, '_blank');
  }

}