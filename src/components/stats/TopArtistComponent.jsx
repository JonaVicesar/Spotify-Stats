// src/components/stats/TopArtistComponent.jsx
import React from 'react';
import StatsCard from './StatsCard';

const TopArtistComponent = ({ artists = [] }) => {
  return (
    <div className="top-artists-component">
      <h3 className="mb-4">
        <i className="fas fa-microphone me-2 text-success"></i>
        Tus Artistas Favoritos
      </h3>

      {artists.length > 0 ? (
        <div className="row">
          {artists.map((artist, index) => (
            <div key={artist.id} className="col-md-6 col-lg-4 mb-3">
              <StatsCard
                rank={index + 1}
                title={artist.name}
                subtitle={artist.genres?.slice(0, 2).join(', ') || 'Sin géneros'}
                image={artist.images?.[0]?.url}
                details={[
                  { label: 'Géneros', value: artist.genres?.slice(0, 3).join(', ') || 'N/A' },
                  { label: 'Popularidad', value: `${artist.popularity}%` },
                  { label: 'Seguidores', value: artist.followers?.total.toLocaleString() || 'N/A' }
                ]}
                // Las acciones se mantendrían si las necesitas
                // actions={[...]}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="fas fa-microphone fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No se encontraron artistas</h5>
        </div>
      )}
    </div>
  );
};

export default TopArtistComponent;