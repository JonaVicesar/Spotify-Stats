import React from 'react';
import StatsCard from './StatsCard';

const TopTracksComponent = ({ tracks = [] }) => {
  return (
    <div className="top-tracks-component">
      <h3 className="mb-4">
        <i className="fas fa-music me-2 text-primary"></i>
        Tus Canciones Favoritas
      </h3>

      {tracks.length > 0 ? (
        <div className="row">
          {tracks.map((track, index) => (
            <div key={track.id} className="col-md-6 col-lg-4 mb-3">
              <StatsCard
                rank={index + 1}
                title={track.name}
                subtitle={track.artists.map(artist => artist.name).join(', ')}
                image={track.album.images?.[0]?.url}
                details={[
                  { label: 'Álbum', value: track.album.name },
                  { label: 'Duración', value: `${Math.floor(track.duration_ms / 60000)}:${String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}` },
                  { label: 'Popularidad', value: `${track.popularity}%` }
                ]}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="fas fa-music fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No se encontraron canciones</h5>
        </div>
      )}
    </div>
  );
};

export default TopTracksComponent;