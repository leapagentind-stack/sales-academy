import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchCourses, checkEnrollment } from "../services/api";
import "../styles/SearchResults.css";

export default function SearchResults() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(search).get("q");
  const user = JSON.parse(localStorage.getItem("user"));

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await searchCourses(query);
        setCourses(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [query]);

  // ✅ HANDLE CARD CLICK (IMPORTANT)
  const handleCourseClick = async (course) => {
  if (!user) {
    alert("Please login first");
    navigate("/login");
    return;
  }

  try {
    const res = await checkEnrollment(
      user.id,
      course.id,
      course.type // ✅ REQUIRED
    );

    if (!res.data.enrolled) {
      alert("🔒 Please enroll to watch this course");
      navigate("/studenthomescreen"); // ✅ as you wanted
      return;
    }

    navigate(`/course/${course.id}`, {
      state: { courseType: course.type },
    });
  } catch (err) {
    console.error(err);
    alert("Unable to check enrollment");
  }
};


  return (
    <div className="search-container">
      {/* HEADER */}
      <div className="search-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2>
          Search Results for <span>"{query}"</span>
        </h2>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="no-results">Loading...</p>
      ) : courses.length === 0 ? (
        <p className="no-results">No courses found.</p>
      ) : (
        <div className="search-grid">
          {courses.map((c) => (
            <div
              key={`${c.type}-${c.id}`}
              className="course-card"
              onClick={() => handleCourseClick(c)} // ✅ FIXED
            >
              {/* BADGE */}
              <div className={`course-badge ${c.type}`}>
                {c.type.toUpperCase()}
              </div>

              {/* IMAGE */}
              <img
                src={c.thumbnail || "/default-course.png"}
                alt={c.title}
                className="course-image"
              />

              {/* TITLE */}
              <h3 className="course-title">{c.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
