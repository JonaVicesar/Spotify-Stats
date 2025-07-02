import React from 'react';
import StatsCard from './StatsCard';
import { formatMinutesToReadable } from '../../services/statsServices';

const ListeningStats = ({ generalStats, periodStats }) => {
  //funcion para formatear numeros
  const formatNumber = (num) => {
    return num ? new Intl.NumberFormat('es-ES').format(num) : '0';
  };

  return (
    <div className="listening-stats">
      {/* Estadisticas Generales */}
      <div className="general-stats-section mb-4">
        <h4 className="mb-3">📊 Resumen General</h4>
        <div className="row row-cols-1 g-2">
          <div className="col">
            <StatsCard
              title="Tiempo Total"
              value={formatMinutesToReadable(generalStats?.totalMinutesListened)}
              subtitle="de escucha"
              icon="⏱️"
              color="info"
              small
            />
          </div>
          <div className="col">
            <StatsCard
              title="Canciones"
              value={formatNumber(generalStats?.totalTracksPlayed)}
              subtitle="reproducidas"
              icon="🎵"
              color="primary"
              small
            />
          </div>
          <div className="col">
            <StatsCard
              title="Artistas"
              value={formatNumber(generalStats?.totalArtists)}
              subtitle="diferentes"
              icon="🎤"
              color="success"
              small
            />
          </div>
        </div>
      </div>

      {/* Estadisticas de Periodo */}
      {periodStats && (
        <div className="period-stats-section">
          <h4 className="mb-3">📈 Estadísticas Recientes</h4>
          <div className="row row-cols-1 g-2">
            <div className="col">
              <StatsCard
                title="Tiempo"
                value={formatMinutesToReadable(periodStats.minutesListened)}
                subtitle="este período"
                icon="⏱️"
                color="warning"
                small
              />
            </div>
            <div className="col">
              <StatsCard
                title="Nuevos Artistas"
                value={formatNumber(periodStats.newArtistsDiscovered)}
                subtitle="descubiertos"
                icon="🆕"
                color="secondary"
                small
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeningStats;