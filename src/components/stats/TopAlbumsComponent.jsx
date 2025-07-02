import React from 'react';
import StatsCard from './StatsCard';

const TopAlbumsComponent = ({ albums = [] }) => {
  return (
    <div className="top-albums-component">
      <div className="mb-5">
        <h3 className="text-white mb-2">
          <i className="fas fa-compact-disc me-2 text-warning"></i>
          Tus Álbumes Favoritos
        </h3>
        <p className="text-muted mb-0">Los álbumes que más has escuchado en el período seleccionado</p>
      </div>

      {albums.length > 0 ? (
        <div className="row g-4">
          {albums.map((album, index) => (
            <div key={album.id} className="col-md-6 col-lg-4 mb-4">
              <StatsCard
                rank={index + 1}
                title={album.name}
                subtitle={album.artists.map(artist => artist.name).join(', ')}
                image={album.images?.[0]?.url}
                details={[
                  { label: 'Año', value: album.release_date ? new Date(album.release_date).getFullYear() : 'N/A' },
                  { label: 'Canciones', value: `${album.total_tracks} tracks` },
                  { label: 'Popularidad', value: `${album.popularity}%` }
                ]}
                className="h-100"
                // onClick={() => console.log(`Ver detalles del álbum: ${album.name}`)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="empty-state">
            <i className="fas fa-compact-disc fa-4x text-muted mb-4"></i>
            <h5 className="text-white mb-2">No se encontraron álbumes</h5> 
            <p className="text-muted">No hay datos de álbumes para mostrar en este período</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopAlbumsComponent;