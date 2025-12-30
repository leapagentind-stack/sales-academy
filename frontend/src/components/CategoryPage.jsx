import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideosByCategoryAndLevel } from "../services/api";
import "../styles/CategoryPage.css"; // Make sure this import exists

export default function CategoryPage() {
  const { slug } = useParams();
  const [videos, setVideos] = useState([]);
  const [level, setLevel] = useState("beginner");

  useEffect(() => {
  fetchVideos();
}, [slug, level]);

const fetchVideos = async () => {
  try {
    const data = await getVideosByCategoryAndLevel(slug, level);
    console.log("Category Videos:", data);
    setVideos(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error(err);
    setVideos([]);
  }
};

  console.log("Videos:", videos);

  return (
    <div className="category-page">
      <h2 className="category-title">{slug.replace(/-/g, " ").toUpperCase()} VIDEOS</h2>

      {/* Filter Buttons */}
      <div className="filter-container">
        <button
          className={`filter-btn ${level === "beginner" ? "active" : ""}`}
          onClick={() => setLevel("beginner")}
        >
          Beginner
        </button>

        <button
          className={`filter-btn ${level === "intermediate" ? "active" : ""}`}
          onClick={() => setLevel("intermediate")}
        >
          Intermediate
        </button>

        <button
          className={`filter-btn ${level === "advanced" ? "active" : ""}`}
          onClick={() => setLevel("advanced")}
        >
          Advanced
        </button>
      </div>

      {/* Videos */}
      <div className="category-course-list">
  {videos.length === 0 ? (
    <p>No videos found for {level} level</p>
  ) : (
    videos.map((video) => {
      const embedUrl = video.video_url?.replace("youtu.be/", "www.youtube.com/embed/")
      ?.replace("watch?v=", "embed/");

      return (
        <div key={video.id} className="course-card">
          
          {/* Video Player with Thumbnail preview */}
          <iframe
            width="100%"
            height="250"
            src={embedUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="video-frame"
          ></iframe>

          {/* Video Title */}
          <div className="course-title">{video.title}</div>
        </div>
      );
    })
  )}
</div>

 </div>
 ); 
}
