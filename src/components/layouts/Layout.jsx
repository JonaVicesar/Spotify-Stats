import React, { useState } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import DashboardSection from "../dashboard/DashboardSection";
import LoadingSpinner from "../common/LoadingSpinner";

const Layout = ({
  user,
  stats,
  statsLoading,
  statsError,
  onLogout,
  refreshStats,
  selectedTimeRange,
  onTimeRangeChange,
}) => {
  const [activeSection, setActiveSection] = useState("dashboard");

  // renderizar la sesion activa
  const renderActiveSection = () => {
    const sectionProps = {
      userProfile: user,
      stats,
      statsLoading,
      statsError,
      refreshStats,
      selectedTimeRange,
      onTimeRangeChange,
    };

    switch (activeSection) {
      case "dashboard":
        return <DashboardSection {...sectionProps} />;
        /*
      case "analysis":
        return <AnalysisSection {...sectionProps} />;
      case "social":
        return <SocialSection {...sectionProps} />;
      case "predictions":
        return <PredictionsSection {...sectionProps} />;*/
      default:
        return <DashboardSection {...sectionProps} />;
    }
  };

  return (
  <div className="app">
    <div className="app-container">
      <Navigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={user}
        onLogout={onLogout}
      />

      <main className="main-content">
        <div className="content-wrapper">
          {/* Anhadir contenedor*/}
          <div className="section-container glass-effect rounded-spotify p-4">
            
            {statsLoading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "400px" }}
              >
                <div className="text-center">
                  <LoadingSpinner size="lg" />
                </div>
              </div>
            ) : statsError ? (
              <div className="alert alert-danger mx-4">
                <h4>Error al cargar datos</h4>
                <p>{statsError}</p>
                <button
                  className="btn btn-outline-light"
                  onClick={refreshStats}
                >
                  Reintentar
                </button>
              </div>
            ) : (
               renderActiveSection()
            )}
          </div>
        </div>
      </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
