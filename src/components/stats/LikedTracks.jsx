import React from "react";

const LikedTracks = ({ likedTracks }) => {
  if (!likedTracks || !likedTracks.tracks || likedTracks.tracks.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-heart fa-3x text-muted mb-3"></i>
        <h5 className="text-muted">
          No hay canciones en "Me gusta" disponibles
        </h5>
      </div>
    );
  }

  console.log("AKAKAKAKA", likedTracks.newLikedTracks);

  const lastLikedTrack = likedTracks.tracks[0]; //ultima cancion agregada
  const newLikedTracks = likedTracks.newLikedTracks;
  const now = new Date();

  return (
    <div className="row g-4 mb-5">
      <div className="col-12">
        <div className="card bg-dark border-secondary h-100">
          <div className="card-header bg-danger d-flex align-items-center py-3">
            <i className="fas fa-heart me-2 fs-5"></i>
            <h6 className="mb-0 text-white fw-semibold">
              Esta semana agregaste {newLikedTracks} nuevas canciones a tus "Me
              Gusta" y esta fue la última
            </h6>
          </div>
          <div className="card-body p-4">
            <div className="d-flex align-items-start gap-3">
              {/* Imagen */}
              <div className="flex-shrink-0">
                <img
                  src={
                    lastLikedTrack.imageUrl ||
                    "https://via.placeholder.com/80x80?text=No+Image"
                  }
                  alt={lastLikedTrack.name}
                  className="rounded"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
              </div>

              {/* Informacion */}
              <div className="flex-grow-1 min-w-0">
                <h5 className="text-white mb-1 text-truncate fw-bold">
                  {lastLikedTrack.name}
                </h5>

                {/* Subtitulo con artista */}
                <p className="text-white-50 mb-3 small text-truncate">
                  Por {lastLikedTrack.artist}
                </p>

                {/* Informacion adicional */}
                <div className="mb-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="fas fa-compact-disc text-danger"></i>
                    <span className="text-white fw-semibold">
                      {new Date(lastLikedTrack.addedAt).toDateString() ===
                      now.toDateString()
                        ? "Agregada hoy"
                        : `Agregada el ${new Date(
                            lastLikedTrack.addedAt
                          ).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          })}`}
                    </span>
                  </div>
                </div>

                {/* Botones de accion */}
                <div className="d-flex gap-2 flex-wrap">
                  <button
                    className="btn btn-danger btn-sm px-3"
                    onClick={() =>
                      console.log("Play track:", lastLikedTrack.id)
                    }
                  >
                    <i className="fas fa-play me-1"></i>
                    Reproducir
                  </button>
                  <button
                    className="btn btn-outline-success btn-sm px-3"
                    onClick={() =>
                      console.log("Add to playlist:", lastLikedTrack.id)
                    }
                  >
                    <i className="fas fa-plus me-1"></i>
                    Agregar a Playlist
                  </button>
                  <button
                    className="btn btn-outline-info btn-sm px-3"
                    onClick={() =>
                      console.log("View album:", lastLikedTrack.id)
                    }
                  >
                    <i className="fas fa-external-link-alt me-1"></i>
                    Ver Álbum
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikedTracks;
