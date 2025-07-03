import { useState, useEffect, useCallback } from 'react';
import { SPOTIFY_CONFIG } from '../utils/constans.js'

console.log('CLIENT_ID:', SPOTIFY_CONFIG.CLIENT_ID);
console.log('REDIRECT_URI:', SPOTIFY_CONFIG.REDIRECT_URI);

export const useSpotifyAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //funcion para generar el code_challenge
  const generateCodeChallenge = async () => {
    const codeVerifier = generateRandomString(128);
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    return { codeVerifier, codeChallenge };
  };

  // Verificar si hay un token guardado al cargar
  useEffect(() => {
    const checkStoredAuth = () => {
      try {
        const storedToken = localStorage.getItem('spotify_access_token');
        const storedRefresh = localStorage.getItem('spotify_refresh_token');
        const storedExpiry = localStorage.getItem('spotify_expires_at');

        if (storedToken && storedExpiry) {
          const expiryTime = parseInt(storedExpiry);
          const now = Date.now();

          if (now < expiryTime) {
            //token valido
            setAccessToken(storedToken);
            setRefreshToken(storedRefresh);
            setExpiresAt(expiryTime);
            setIsAuthenticated(true);
          } else if (storedRefresh) {
            //token expirado
            refreshAccessToken(storedRefresh);
          } else {
            // limpiar tokens expirados
            clearStoredAuth();
          }
        }
      } catch (error) {
        console.error('Error checking stored auth:', error);
        clearStoredAuth();
      }
      setLoading(false);
    };

    //verificar si se viene del callback de spotify
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
      setError(`Error de autenticación: ${error}`);
      setLoading(false);
      return;
    }

    if (code && state) {
      // verificar state para prevenir CSRF
      const storedState = localStorage.getItem('spotify_auth_state');
      if (state !== storedState) {
        setError('Error de seguridad: estado inválido');
        setLoading(false);
        return;
      }
      
      // intercambiar codigo por token usando PKCE
      exchangeCodeForToken(code);
    } else {
      checkStoredAuth();
    }
  }, []);

  // generar string aleatorio para el parametro state y el code_verifier
  const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  // generar url de autorizacion de spotify con PKCE
  const getAuthUrl = useCallback(async () => {
    const state = generateRandomString(16);
    const { codeVerifier, codeChallenge } = await generateCodeChallenge();
    
    // guardar para usar en el intercambio
    localStorage.setItem('spotify_auth_state', state);
    localStorage.setItem('spotify_code_verifier', codeVerifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: SPOTIFY_CONFIG.CLIENT_ID,
      scope: SPOTIFY_CONFIG.SCOPES,
      redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
      state: state,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      show_dialog: 'true'
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }, []);

  // iniciar proceso de autenticacion
  const login = useCallback(async () => {
    try {
      const authUrl = await getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error generating auth URL:', error);
      setError('Error al generar URL de autenticación');
    }
  }, [getAuthUrl]);

  //cambiar codigo de autorizacion por access token usando PKCE
  const exchangeCodeForToken = async (code) => {
    setLoading(true);
    setError(null);

    try {
      const codeVerifier = localStorage.getItem('spotify_code_verifier');
      if (!codeVerifier) {
        throw new Error('Code verifier no encontrado');
      }

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
          client_id: SPOTIFY_CONFIG.CLIENT_ID,
          code_verifier: codeVerifier,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error_description || 'Error al intercambiar código por token');
      }

      const data = await response.json();
      const expiryTime = Date.now() + (data.expires_in * 1000);

      // guardar tokens
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      setExpiresAt(expiryTime);
      setIsAuthenticated(true);

      // guardar en el localStorage
      localStorage.setItem('spotify_access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
      }
      localStorage.setItem('spotify_expires_at', expiryTime.toString());

      // limpiar estado y url
      localStorage.removeItem('spotify_auth_state');
      localStorage.removeItem('spotify_code_verifier');
      window.history.replaceState({}, document.title, window.location.pathname);

    } catch (error) {
      console.error('Error exchanging code for token:', error);
      setError('Error al autenticar con Spotify: ' + error.message);
    }

    setLoading(false);
  };

  // refrescar access token usando refresh token
  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: SPOTIFY_CONFIG.CLIENT_ID,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error_description || 'Error al refrescar token');
      }

      const data = await response.json();
      const expiryTime = Date.now() + (data.expires_in * 1000);

      setAccessToken(data.access_token);
      setExpiresAt(expiryTime);
      setIsAuthenticated(true);

      // actualizar localStorage
      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_expires_at', expiryTime.toString());

      // actualizar refresh token si viene uno nuevo
      if (data.refresh_token) {
        setRefreshToken(data.refresh_token);
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
      }

    } catch (error) {
      console.error('Error refreshing token:', error);
      // si falla el refresh, limpiar todo
      logout();
      throw error;
    }
  };

  // cerrar sesion
  const logout = useCallback(() => {
    clearStoredAuth();
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresAt(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  // limpiar autenticacion almacenada
  const clearStoredAuth = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_expires_at');
    localStorage.removeItem('spotify_auth_state');
    localStorage.removeItem('spotify_code_verifier');
  };

  // funcion para hacer peticiones autenticadas a la API de spotify
  const makeAuthenticatedRequest = useCallback(async (url, options = {}) => {
    if (!accessToken) {
      throw new Error('No hay token de acceso disponible');
    }

    // verificacion de expiracion del token, entre los 5 minutos antes de expirar
    const now = Date.now();
    const fiveMinutesFromNow = now + (5 * 60 * 1000);
    
    if (expiresAt && fiveMinutesFromNow > expiresAt && refreshToken) {
      try {
        await refreshAccessToken(refreshToken);
      } catch (error) {
        console.error('Error refreshing token before request:', error);
        throw error;
      }
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // si es token expirado se intenta refresh
        if (refreshToken) {
          try {
            await refreshAccessToken(refreshToken);
            // reintentar la peticion
            return await fetch(url, {
              ...options,
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                ...options.headers,
              },
            });
          } catch (refreshError) {
            logout();
            throw new Error('Sesión expirada, por favor inicia sesión de nuevo');
          }
        } else {
          logout();
          throw new Error('Sesión expirada, por favor inicia sesión de nuevo');
        }
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Error HTTP: ${response.status}`);
    }

    return response;
  }, [accessToken, expiresAt, refreshToken, logout]);

  return {
    isAuthenticated,
    accessToken,
    loading,
    error,
    login,
    logout,
    makeAuthenticatedRequest,
  };
};


