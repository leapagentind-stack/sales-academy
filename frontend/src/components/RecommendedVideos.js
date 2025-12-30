import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/RecommendedVideos.css";

export default function RecommendedVideos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);

  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtu.be/")) {
      const videoId = url.split("/").pop().split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url.replace("watch?v=", "embed/");
  };

  useEffect(() => {
    async function fetchVideos() {
      const res = await fetch(`http://localhost:5000/api/recommended-videos/${id}`);
      const data = await res.json();
      setVideos(data);
      if (data.length > 0) setCurrentVideo(data[0]);
    }
    fetchVideos();
  }, [id]);

  return (
    <div className="page-container">

      {/* 🔙 Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      <h2 className="page-title">Recommended Videos</h2>

      {currentVideo && (
        <div className="video-player-container">
          <iframe
            src={getEmbedUrl(currentVideo.video_url)}
            title={currentVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <h3 className="video-title">{currentVideo.title}</h3>
        </div>
      )}

      <ul className="video-list">
        {videos.map((video) => (
          <li
            key={video.id}
            onClick={() => setCurrentVideo(video)}
            className={`video-item ${
              currentVideo?.id === video.id ? "active" : ""
            }`}
          >
            🎬 {video.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
