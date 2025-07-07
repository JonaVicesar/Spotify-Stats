import React, { use } from "react";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faGithub } from '@fortawesome/free-brands-svg-icons'

const Navigation = ({ activeSection, setActiveSection, user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false); //state para abrir el menu desplegable
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
   /* { id: "analysis", label: "Análisis", icon: "🧬" },
    { id: "social", label: "Social", icon: "👥" },
    { id: "predictions", label: "Predicciones", icon: "🔮" },*/
  ];

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);}

  return (
    <nav
      className="navbar navbar-expand-lg main-navbar"
      style={{ position: "sticky", top: 0, zIndex: 1000 }}
    >
      <div className="container-fluid">

        <a
          className="navbar-brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveSection("dashboard");
            handleSectionChange("dashboard");
          }}
        >
          🧬 <span className="text-success">SpotiStats</span>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {navItems.map((item) => (
              <li key={item.id} className="nav-item">
                <a
                  className={`nav-link ${
                    activeSection === item.id ? "active" : ""
                  }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(item.id);
                    handleSectionChange(item.id);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {item.icon} {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* link al repositorio */}
          <span className="navbar-text me-3">
            <a className="github-link" href="https://github.com/JonaVicesar">
              <FontAwesomeIcon 
              icon={faGithub}
              className="fs-1 text-white" 
               />
               </a>
          </span>

          {/*Perfil del usuario*/}
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: "pointer" }}
                onClick={toggleMenu}
              >
                {user?.images?.[0]?.url ? (
                  <img
                    src={user.images[0].url}
                    alt="Profile"
                    className="user-avatar me-2"
                    style={{ 
                      width: "32px", 
                      height: "32px",
                      borderRadius: "50%"
                    }}
                  />
                ) : (
                  <div className="user-avatar me-2">
                    👤
                  </div>
                )}
                <span>
                  {user?.display_name || user?.name || "Usuario Demo"}
                </span>
              </a>
              <ul 
              className={`dropdown-menu dropdown-menu-end bg-dark border-secondary ${menuOpen ? "show" : ""}`}
              style={{ display: menuOpen ? "block" : "none" }}
            >
                <li>
                  <a
                    className="dropdown-item text-white"
                    href="#"
                    onClick={(e) => {e.preventDefault(); }}
                  >
                    👤 Perfil
                  </a> 
                </li>
                <li>
                  <a
                    className="dropdown-item text-white"
                    href=""
                    onClick={(e) =>{ e.preventDefault(); }}
                    style={{ cursor: "pointer" }}
                  >
                    ⚙️ Configuración
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider border-secondary" />
                </li>
                <li>
                  <a
                    className="dropdown-item text-danger"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onLogout();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    🚪 Cerrar Sesión
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;