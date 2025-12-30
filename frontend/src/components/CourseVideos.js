import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import YouTube from "react-youtube";
import axios from "axios";
import { getVideosByCourse } from "../services/api";

import "../styles/CourseVideos.css";

const getYouTubeId = (url) => {
  if (!url) return null;
  if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split("?")[0];
  if (url.includes("v=")) return url.split("v=")[1].split("&")[0];
  if (url.includes("embed/")) return url.split("embed/")[1].split("?")[0];
  return null;
};

export default function CourseVideos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user] = useState(() => JSON.parse(localStorage.getItem("user")));

  const location = useLocation();
  const courseType = location.state?.courseType ||
  localStorage.getItem(`courseType-${id}`);
  const [videos, setVideos] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedIndexes, setCompletedIndexes] = useState([]);

  useEffect(() => {
  if (!courseType || !user) return;

  async function loadVideos() {
    try {
      const data = await getVideosByCourse(id, courseType, user.id);
      setVideos(data || []);

      

    } catch (err) {
      if (err.response?.status === 403) {
        alert("🔒 Please enroll to watch this course");
        navigate("/studenthomescreen");
      } else {
        alert("Failed to load course videos");
      }
    }
  }

  loadVideos();
}, [id, courseType, user, navigate]);

  const isLocked = (index) => index > completedIndexes.length;

  const handleVideoEnd = async () => {
  if (completedIndexes.includes(activeIndex)) return;

  const updated = [...completedIndexes, activeIndex];
  setCompletedIndexes(updated);

  // ✅ move to next video automatically
  if (activeIndex < videos.length - 1) {
    setActiveIndex(prev =>prev + 1);
  }

  await axios.post("http://localhost:5000/api/videos/progress", {
    studentId: user.id,
    courseId: id,
    courseType,
    completed: updated.length,
    total: videos.length
  });
};


  const activeVideo = videos[activeIndex];
  const videoId = getYouTubeId(activeVideo?.video_url);

  return (
    <div className="course-layout">
      {/* LEFT SIDEBAR */}
      <div className="lesson-sidebar">
        <h3 className="sidebar-title">Course Content</h3>
        {videos.map((v, index) => (
          <div
            key={v.id}
            className={`lesson-row
              ${index === activeIndex ? "active" : ""}
              ${isLocked(index) ? "locked" : ""}`}
            onClick={() => !isLocked(index) && setActiveIndex(index)}
          >
            <span className="lesson-index">{index + 1}</span>
            <span className="lesson-title">{v.title}</span>
            {completedIndexes.includes(index) && <span className="complete-badge">✔</span>}
            {isLocked(index) && <span className="lock-badge">🔒</span>}
          </div>
        ))}
      </div>

      {/* VIDEO AREA */}
      <div className="video-area">
        {videoId ? (
          <div className="video-container">
            <YouTube
              videoId={videoId}
              opts={{
                width: "100%",
                height: "500",
                playerVars: { autoplay: 0, rel: 0 }
              }}
              onEnd={handleVideoEnd}
            />
            <h2 className="video-title">{activeVideo?.title}</h2>
          </div>
        ) : (
          <div className="video-placeholder">Select a video to play</div>
        )}
      </div>

      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
    </div>
  );
}
