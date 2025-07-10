import React, { useState } from "react";
import MostPlayedStats from "../stats/MostPlayedStats";
import TopTracksComponent from "../stats/TopTracksComponent";
import TopArtistComponent from "../stats/TopArtistComponent";
import TopAlbumsComponent from "../stats/TopAlbumsComponent";
import ListeningStats from "../stats/ListeningStats";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorAlert from "../common/ErrorAlert";
import LikedTracks from "../stats/LikedTracks";

const DashboardSection = ({
  userProfile,
  stats,
  statsLoading,
  statsError,
  refreshStats,
  selectedTimeRange,
  onTimeRangeChange,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  const timeRangeOptions = [
    { value: "short_term", label: "Último mes" },
    { value: "medium_term", label: "Últimos 6 meses" },
    { value: "long_term", label: "Último año" },
  ];

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleTimeRangeChange = (newRange) => {
    console.log("cambiando rango de tiempo", newRange);
    onTimeRangeChange(newRange);
  };

  if (statsLoading) {
    return (
      <div className="container-fluid py-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="container-fluid py-4">
        <ErrorAlert
          message={statsError}
          onRetry={() => refreshStats(selectedTimeRange)}
        />
      </div>
    );
  }

  // extrar datos de las stats
  const {
    mostPlayed = {},
    tops = {},
    recentlyLikedTracks = {},
    generalStats = {},
    currentPeriod = {},
  } = stats || {};

  console.log("HEREEEEEEEEEEEEEEEE JONA likes", stats?.recentlyLikedTracks);

  return (
    <div className="container-fluid px-4 py-4">
      {/* Header  */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="dashboard-header-card bg-dark rounded-4 p-4 border border-secondary">
            <div className="row align-items-center">
              <div className="col-lg-8 col-md-7">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="fs-1">🎵</span>
                  <div>
                    <h1 className="text-white mb-2 fw-bold fs-2">
                      Hola, {userProfile?.display_name || "Usuario"}
                    </h1>
                    <p className="text-white mb-0 fs-4">
                      Aquí tienes un resumen completo de tu actividad musical
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-5">
                <div className="d-flex justify-content-end">
                  <select
                    className="form-select bg-dark text-white border-success w-auto"
                    value={selectedTimeRange}
                    onChange={(e) => handleTimeRangeChange(e.target.value)}
                    style={{ minWidth: "200px" }}
                  >
                    {timeRangeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de navegacion */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
            {["overview", "tracks", "artists", "albums"].map((tab) => {
              const labels = {
                overview: "📊 Resumen General",
                tracks: "🎵 Top Canciones",
                artists: "🎤 Top Artistas",
                albums: "💿 Top Álbumes",
              };

              return (
                <button
                  key={tab}
                  className={`btn ${
                    activeTab === tab ? "btn-success" : "btn-outline-light"
                  } px-4 py-3 fw-semibold`}
                  onClick={() => {
                    handleTabChange(tab);
                  }}
                  style={{ minWidth: "160px" }}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenido principal con el layout*/}
      {activeTab === "overview" && (
        <>
          {/* Estadisticas detalladas con layout */}
          <div className="row g-4 mb-5">
            <div className="d-flex justify-content-center align-items-center">
              {" "}
              {/*centrar cards */}
              <div className="col-xl-8 col-lg-7">
                <div className="h-100">
                  <MostPlayedStats mostPlayed={mostPlayed} />
                </div>

                
                  <div className="h-100">
                    <LikedTracks likedTracks={recentlyLikedTracks} />
                  </div>
                
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "tracks" && (
        <div className="row">
          <div className="col-12">
            <div className="bg-dark rounded-4 p-4 border border-secondary">
              <TopTracksComponent tracks={tops?.tracks || []} />
            </div>
          </div>
        </div>
      )}

      {activeTab === "artists" && (
        <div className="row">
          <div className="col-12">
            <div className="bg-dark rounded-4 p-4 border border-secondary">
              <TopArtistComponent artists={tops.artists || []} />
            </div>
          </div>
        </div>
      )}

      {activeTab === "albums" && (
        <div className="row">
          <div className="col-12">
            <div className="bg-dark rounded-4 p-4 border border-secondary">
              <TopAlbumsComponent albums={tops.albums || []} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSection;
