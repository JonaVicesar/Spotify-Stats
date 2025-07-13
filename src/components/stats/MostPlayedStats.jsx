import React from 'react';
import { playTrack, viewAlbum, viewArtist, followArtist } from '../../services/spotifyActions';


const MostPlayedStats = ({ mostPlayed }) => {
  // si no hay datos se muestra el mensaje 
  if (!mostPlayed || Object.keys(mostPlayed).length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-trophy fa-3x text-muted mb-3"></i>
        <h5 className="text-muted">No hay datos disponibles</h5>
      </div>
    );
  }

  console.log('cancion', mostPlayed.track);

  const statsData = [
    {
      title: 'Canción Más Reproducida',
      icon: 'fas fa-music',
      color: 'primary',
      data: mostPlayed.track,
      type: 'track'
    },
    {
      title: 'Artista Más Escuchado',
      icon: 'fas fa-microphone',
      color: 'success',
      data: mostPlayed.artist,
      type: 'artist'
    },
    {
      title: 'Álbum Más Reproducido',
      icon: 'fas fa-compact-disc',
      color: 'warning',
      data: mostPlayed.album,
      type: 'album'
    },
    {
      title: 'Playlist Favorita',
      icon: 'fas fa-list',
      color: 'info',
      data: mostPlayed.playlist ,
      type: 'playlist'
    }
  ];


  const getDetails = (item, type) => {
    const details = [];
    
    switch (type) {
      case 'track':
        details.push(
          { label: 'Artista', value: item.artists?.map(a => a.name).join(', ') || 'N/A' },
          { label: 'Álbum', value: item.album?.name || 'N/A' },
          { label: 'Reproducciones', value: item.play_count?.toLocaleString() || 'N/A' }
        );
        break;
      case 'artist':
        details.push(
          { label: 'Géneros', value: item.genres?.slice(0, 2).join(', ') || 'N/A' },
          { label: 'Horas Escuchadas', value: `${item.total_play_time || 0}h` },
          { label: 'Popularidad', value: `${item.popularity || 0}%` }
        );
        break;
      case 'album':
        details.push(
          { label: 'Artista', value: item.artists?.map(a => a.name).join(', ') || 'N/A' },
          { label: 'Año', value: item.release_date ? new Date(item.release_date).getFullYear() : 'N/A' },
          { label: 'Reproducciones', value: item.play_count?.toLocaleString() || 'N/A' }
        );
        break;
      case 'playlist':
        details.push(
          { label: 'Canciones', value: `${item.tracks?.total || 0} tracks` },
          { label: 'Duración', value: `${Math.floor((item.duration_ms || 0) / 3600000)}h` },
          { label: 'Última reproducción', value: item.last_played ? new Date(item.last_played).toLocaleDateString() : 'N/A' }
        );
        break;
      default:
        break;
    }
    
    return details;
  };

  const getActions = (item, type) => {
    const actions = [];
    
    switch (type) {
      case 'track':
        actions.push(
          { icon: 'fas fa-play', text: 'Reproducir', variant: 'primary', onClick: () => {playTrack(item.id)}},
          { icon: 'fas fa-plus', text: 'Agregar', variant: 'outline-success', onClick: () => console.log('Add track:', item.id) }
        );
        break;
      case 'artist':
        actions.push(
          { icon: 'fas fa-eye', text: 'Ver Perfil', variant: 'success', onClick: () => {viewArtist(item.id)} },
          { icon: 'fas fa-user-plus', text: 'Seguir', variant: 'outline-success', onClick: () => {followArtist(item.id)}}
        );
        break;
      case 'album':
        actions.push(
          { icon: 'fas fa-eye', text: 'Ver Álbum', variant: 'warning', onClick: () => {viewAlbum(item.id)} },
          { icon: 'fas fa-heart', text: 'Guardar', variant: 'outline-danger', onClick: () => console.log('Save album:', item.id) }
        );
        break;
      case 'playlist':
        actions.push(
          { icon: 'fas fa-play', text: 'Reproducir', variant: 'info', onClick: () => console.log('Play playlist:', item.id) },
          { icon: 'fas fa-external-link-alt', text: 'Abrir', variant: 'outline-info', onClick: () => console.log('Open playlist:', item.id) }
        );
        break;
      default:
        break;
    }
    
    return actions;
  };

  return (
<div className="row g-4 mb-5">
        {statsData.map((stat, index) => (
          <div key={index} className="col-lg-6 mb-4">
            <div className="card bg-dark border-secondary h-100">
              <div className={`card-header  bg-${stat.color} d-flex align-items-center py-3`}>
                <i className={`${stat.icon} me-2 fs-5`}></i>
                <h6 className="mb-0 text-white fw-semibold">{stat.title}</h6>
              </div>
              <div className="card-body p-2">
                {stat.data ? (
                  <div className="d-flex align-items-start gap-3">
                    {/* Imagen */}
                    <div className="flex-shrink-0">
                      <img 
                        src={stat.data?.imageUrl  || 'n'} 
                        alt={stat.data?.name}
                        className="rounded"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                    </div>
                    
                    {/* Informacion */}
                    <div className="flex-grow-1 min-w-0">
                      <h6 className="text-white mb-1 text-truncate fw-bold">
                        {stat.data.name}
                      </h6>
                      
                      {/* Subtitulo especifico por tipo */}
                        <p className="text-white-50 mb-3 small text-truncate">
                          {console.log("QUE PRO SOY", stat.data)}
                          {stat.type === 'track' ? `Artist: ${stat.data?.artist}`  :                       
                          stat.type === 'album' ? `Artist: ${stat.data?.artist}` :
                          stat.type === 'playlist' ? `Canciones: ${stat.data?.totalTracks}` : 
                          stat.type === 'artist' ? `${stat.data.followers?.total?.toLocaleString()} seguidores` : ''}  
                        </p>

                      {/* Botones de accion*/}
                      <div className="d-flex gap-2 flex-wrap">
                        {getActions(stat.data, stat.type).map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            className={`btn btn-${action.variant} btn-sm px-3`}
                            onClick={action.onClick}
                          >
                            <i className={`${action.icon} me-1`}></i>
                            {action.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className={`${stat.icon} fa-2x text-muted mb-2`}></i>
                    <p className="text-muted mb-0">No disponible</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
  );
};

export default MostPlayedStats;