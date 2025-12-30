// src/pages/PopularVideos.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPopularVideosByCourse } from "../services/api";
import "../styles/PopularVideos.css"; // create below

export default function PopularVideos() {
  const { id } = useParams(); // route param: /popular-videos/:id
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null); // currently playing video object
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    async function fetchVideos() {
  try {
    setLoading(true);

    const data = await getPopularVideosByCourse(id);

    console.log("Videos from API:", data); // <-- ADD THIS
    setVideos(Array.isArray(data) ? data : []);

    if (Array.isArray(data) && data.length > 0) {
      setActiveVideo(data[0]);
    } else {
      setActiveVideo(null);
    }

  } catch (err) {
    console.error("Error loading videos:", err);
    setVideos([]);
    setActiveVideo(null);
  } finally {
    setLoading(false);
  }
}

    fetchVideos();
  }, [id]);

  // Helper to convert many video_url formats to YouTube embed (if possible)
  const toYouTubeEmbed = (url) => {
    if (!url) return url;
    // If already an embed URL, return as-is
    if (url.includes("youtube.com/embed") || url.includes("player.vimeo.com")) return url;

    // YouTube short id form youtu.be/ID
    const yShort = url.match(/youtu\.be\/([^\?&]+)/);
    if (yShort) return `https://www.youtube.com/embed/${yShort[1]}`;

    // Regular watch?v=...
    const yMatch = url.match(/[?&]v=([^&]+)/) || url.match(/youtube\.com\/watch\/([^\?&/]+)/);
    if (yMatch) return `https://www.youtube.com/embed/${yMatch[1]}`;

    // If it's already a raw video file or other URL, return it as-is (for <video> tag)
    return url;
  };

  return (
    <div className="popular-videos-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <h2 className="section-title">Popular Course Videos</h2>

      {loading && <div className="loading">Loading videos…</div>}

      {!loading && videos.length === 0 && (
        <div className="no-videos">No videos available for this course.</div>
      )}

      <div className="videos-layout">
        {/* Player Column */}
        <div className="player-column">
          {activeVideo ? (
            <>
              <h3 className="video-title">{activeVideo.title}</h3>

              {/* If youtube/vimeo, use iframe embed; otherwise fallback to HTML5 video */}
              {activeVideo.video_url.includes("youtube") || activeVideo.video_url.includes("youtu.be") ? (
                <div className="video-frame">
                  <iframe
                    title={activeVideo.title}
                    src={toYouTubeEmbed(activeVideo.video_url)}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    
                  />
                </div>
              ) : (
                <video controls width="100%" height="420">
                  <source src={activeVideo.video_url} />
                  Your browser does not support the video tag.
                </video>
              )}

              <p className="video-desc">Instructor: {activeVideo.instructor || "—"}</p>
            </>
          ) : (
            <div className="placeholder">Select a video to play</div>
          )}
        </div>

        {/* List Column */}
        <div className="list-column">
          <h4 className="list-title">Lessons</h4>
          <div className="video-list">
            {videos.map((v) => (
              <div
                key={v.id}
                className={`video-item ${activeVideo && activeVideo.id === v.id ? "active" : ""}`}
                onClick={() => setActiveVideo(v)}
              >
                <img src={v.thumbnail || v.thumbnail_url || v.image || ""} alt={v.title} className="video-thumb"/>
                <div className="video-meta">
                  <p className="video-name">{v.title}</p>
                  <p className="video-sub">Click to play</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
