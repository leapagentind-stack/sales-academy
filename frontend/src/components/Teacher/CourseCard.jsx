import React from 'react';

const CourseCard = ({ course }) => {
  // Fallback while loading
  if (!course) {
    return (
      <div className="course-card compact">
        <div className="loading-skeleton">
          <div className="skeleton-video"></div>
          <div className="skeleton-text"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-card compact">
      {/* Small thumbnail on the left */}
      <div className="video-container thumbnail-container">
        {course.secureUrl ? (
          <video
            src={course.secureUrl}
            className="thumbnail-video"
            muted
            preload="metadata"
          >
            Your browser doesn't support video.
          </video>
        ) : (
          <div className="video-placeholder">
            <div className="placeholder-icon">🎥</div>
            <span>Video processing</span>
          </div>
        )}
      </div>

      {/* Right side info */}
      <div className="course-info">
        <h3 className="course-title small">{course.title}</h3>

        <div className="course-meta">
          <div className="meta-item">
            <span className="meta-icon">📁</span>
            <span>{course.sizeMB} MB</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span>{course.uploadedAt}</span>
          </div>
        </div>

        {course.secureUrl && (
          <div className="secure-section compact-secure">
            <div className="secure-header">
              <span className="secure-icon">🔐</span>
              <span>Secure URL</span>
            </div>
            <div className="url-input-group">
              <input
                type="text"
                value={course.secureUrl}
                readOnly
                className="secure-input"
              />
              <button
                type="button"
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(course.secureUrl)}
              >
                📋
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
