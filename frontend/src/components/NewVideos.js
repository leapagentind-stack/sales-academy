import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNewCourseVideos } from "../services/api";
import "../styles/NewVideos.css";

export default function NewVideos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      try {
        setLoading(true);
        const data = await getNewCourseVideos(id);

        setVideos(Array.isArray(data) ? data : []);

        if (Array.isArray(data) && data.length > 0) {
          setActiveVideo(data[0]);
        } else {
          setActiveVideo(null);
        }
      } catch (err) {
        console.error("Error:", err);
        setVideos([]);
        setActiveVideo(null);
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, [id]);

  // Convert normal YouTube link → embed link
  const toYouTubeEmbed = (url) => {
    if (!url) return "";

    if (url.includes("youtube.com/embed")) return url;

    // youtu.be format
    const yShort = url.match(/youtu\.be\/([^\?&]+)/);
    if (yShort) return `https://www.youtube.com/embed/${yShort[1]}`;

    // watch?v format
    const yMatch = url.match(/[?&]v=([^&]+)/);
    if (yMatch) return `https://www.youtube.com/embed/${yMatch[1]}`;

    return url;
  };

  return (
    <div className="new-videos-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2 className="new-videos-title">New Course Videos</h2>

      {loading && <div className="loading">Loading...</div>}

      {!loading && videos.length === 0 && (
        <div className="no-videos">No videos available</div>
      )}

      <div className="videos-layout">
        {/* Player */}
        <div className="player-column">
          {activeVideo ? (
            <>
              <h3 className="video-title">{activeVideo.title}</h3>

              {activeVideo.video_url?.includes("youtube") ||
              activeVideo.video_url?.includes("youtu.be") ? (
                <iframe
                  title={activeVideo.title}
                  src={toYouTubeEmbed(activeVideo.video_url)}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  width="100%"
                  height="420px"
                />
              ) : (
                <video controls width="100%" height="420">
                  <source src={activeVideo.video_url} />
                  Your browser does not support the video tag.
                </video>
              )}
            </>
          ) : (
            <div className="placeholder">Select a video</div>
          )}
        </div>

        {/* List */}
        <aside className="list-column">
          <h4 className="list-title">Lessons</h4>

          <div className="video-list">
            {videos.map((v) => (
              <div
                key={v.id}
                className={`video-item ${
                  activeVideo?.id === v.id ? "active" : ""
                }`}
                onClick={() => setActiveVideo(v)}
              >
                <img
                  src={v.thumbnail || "/default-video-thumb.jpg"}
                  alt={v.title}
                  className="video-thumb"
                />

                <div className="video-meta">
                  <p className="video-name">{v.title}</p>
                  <p className="video-sub">Click to play</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
