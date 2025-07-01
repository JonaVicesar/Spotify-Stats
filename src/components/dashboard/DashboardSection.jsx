import React, { useState } from 'react';
import StatsCard from '../stats/StatsCard';
import TopTracksComponent from '../stats/TopTracksComponent';
import TopArtistComponent from '../stats/TopArtistComponent';
import TopAlbumsComponent from '../stats/TopAlbumsComponent';
import MostPlayedStats from '../stats/MostPlayedStats';
import ListeningStats from '../stats/ListeningStats';

const DashboardSection = ({ stats, spotifyData, userProfile }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('medium_term');
  const [activeTab, setActiveTab] = useState('overview');

  // Datos simulados para demostración (reemplazar con datos reales)
  const mockStats = {
    totalTracks: 1247,
    totalArtists: 342,
    totalAlbums: 156,
    totalListeningTime: 48.2,
    topGenres: ['Pop', 'Rock', 'Indie', 'Electronic'],
    ...stats
  };

  const timeRangeOptions = [
    { value: 'short_term', label: 'Último mes' },
    { value: 'medium_term', label: 'Últimos 6 meses' },
    { value: 'long_term', label: 'Últimos años' }
  ];

  return (
    <div className="dashboard-section">
      {/* Header con información del usuario */}
      <div className="dashboard-header mb-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h2 className="section-title">
              🎵 Hola, {userProfile?.name || 'Usuario'}
            </h2>
            <p className="section-subtitle">
              Aquí tienes un resumen de tu actividad musical
            </p>
          </div>
          <div className="col-md-4 text-end">
            <div className="time-range-selector">
              <select
                className="form-select"
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
              >
                {timeRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="dashboard-tabs mb-4">
        <ul className="nav nav-pills">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Resumen General
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'tracks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tracks')}
            >
              Top Canciones
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'artists' ? 'active' : ''}`}
              onClick={() => setActiveTab('artists')}
            >
              Top Artistas
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'albums' ? 'active' : ''}`}
              onClick={() => setActiveTab('albums')}
            >
              Top Álbumes
            </button>
          </li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <>
            {/* Cards de estadísticas generales */}
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <StatsCard
                  title="Total Canciones"
                  value={mockStats.totalTracks}
                  icon="🎵"
                  color="primary"
                />
              </div>
              <div className="col-md-3 mb-3">
                <StatsCard
                  title="Artistas Únicos"
                  value={mockStats.totalArtists}
                  icon="🎤"
                  color="success"
                />
              </div>
              <div className="col-md-3 mb-3">
                <StatsCard
                  title="Álbumes"
                  value={mockStats.totalAlbums}
                  icon="💿"
                  color="info"
                />
              </div>
              <div className="col-md-3 mb-3">
                <StatsCard
                  title="Horas Escuchadas"
                  value={`${mockStats.totalListeningTime}h`}
                  icon="⏱️"
                  color="warning"
                />
              </div>
            </div>

            {/* Estadísticas más detalladas */}
            <div className="row">
              <div className="col-lg-8 mb-4">
                <MostPlayedStats 
                  stats={mockStats} 
                  timeRange={selectedTimeRange}
                />
              </div>
              <div className="col-lg-4 mb-4">
                <ListeningStats 
                  stats={mockStats}
                  timeRange={selectedTimeRange}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'tracks' && (
          <div className="tracks-section">
            <TopTracksComponent 
              timeRange={selectedTimeRange}
              spotifyData={spotifyData}
            />
          </div>
        )}

        {activeTab === 'artists' && (
          <div className="artists-section">
            <TopArtistComponent 
              timeRange={selectedTimeRange}
              spotifyData={spotifyData}
            />
          </div>
        )}

        {activeTab === 'albums' && (
          <div className="albums-section">
            <TopAlbumsComponent 
              timeRange={selectedTimeRange}
              spotifyData={spotifyData}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSection;