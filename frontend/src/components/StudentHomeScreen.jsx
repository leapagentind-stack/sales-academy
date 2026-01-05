import axios from "axios";
import React, { useEffect, useState } from "react";
import "../styles/StudentHomeScreen.css";
import { useNavigate, useLocation } from "react-router-dom";
import { getMyLearning } from "../services/api";
import Footer from "./Footer";
import Header from "./Header";
import api from "../services/api";

export default function StudentHomeScreen() {
  const [studentName, setStudentName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [myLearning, setMyLearning] = useState([]);
  const [allCourses, setAllCourses] = useState([]); // 🟢 NEW: Teacher Uploads
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [ads, setAds] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [newCourses, setNewCourses] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  
  const location = useLocation();
  const navigate = useNavigate();

  // 🟢 NEW: Fix Image URLs (Handles http links AND local uploads with Windows paths)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/default-course.jpg";
    if (imagePath.startsWith("http") || imagePath.startsWith("https")) {
      return imagePath;
    }
    // Fix Windows slashes and add backend port
    const cleanPath = imagePath.replace(/\\/g, "/");
    return `http://localhost:5000${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  };

  // --- HELPER FUNCTIONS ---

  const isInCart = (courseId, courseType) => {
    return cartItems.some(item =>
      Number(item.courseId) === Number(courseId) &&
      item.courseType === courseType
    );
  };

  const isEnrolled = (courseId, courseType) => {
    return myLearning.some(item => {
      const enrolledCourseId = item.course_id || item.courseId || item.id;
      const enrolledType = String(item.courseType || item.course_type || "").trim().toLowerCase();

      return (
        Number(enrolledCourseId) === Number(courseId) &&
        enrolledType === courseType.toLowerCase()
      );
    });
  };

  const addToCart = async (course, courseType) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login");
      return;
    }

    if (isInCart(course.id, courseType)) {
      alert("Already in cart 🛒");
      return;
    }

    try {
      await api.post("/cart/add", {
        studentId: user.id,
        courseId: course.id,
        courseType
      });

      alert("Added to cart 🛒");

      const res = await api.get(`/cart/${user.id}`);
      setCartItems(res.data || []);

    } catch (err) {
      if (err.response?.status === 409) {
        alert("You are already enrolled in this course 🎓");
      } else if (err.response?.status === 400) {
        alert("Already in cart 🛒");
      } else {
        console.error("Add to cart error:", err);
        alert("Something went wrong");
      }
    }
  };

  const buyNow = async (course, courseType) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please login");
        return;
      }

      localStorage.setItem(
        "singleCheckout",
        JSON.stringify({
          ...course,
          courseType
        })
      );

      navigate("/checkout");

    } catch (err) {
      console.error("Buy now error:", err);
      alert("Something went wrong");
    }
  };

  // --- USE EFFECTS ---

  useEffect(() => {
    async function fetchCart() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      try {
        const res = await api.get(`/cart/${user.id}`);
        setCartItems(res.data || []);
      } catch (err) {
        console.error("Cart fetch error:", err);
      }
    }
    fetchCart();
  }, []);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/login");
        return;
      }
      setStudentName(user.firstName || user.name || "Student");
    } catch (err) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    async function fetchAds() {
      try {
        const res = await api.get("/ads");
        setAds(res.data?.ads || res.data || []);
      } catch (err) {
        console.error("Ads fetch error:", err);
        setAds([]);
      }
    }
    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length > 0) {
      setCurrentIndex(0);
    }
  }, [ads]);

  useEffect(() => {
    if (ads.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [ads]);

  useEffect(() => {
    async function fetchMyLearning() {
      const user = JSON.parse(localStorage.getItem("user"));
      const studentId = user?.id;
      if (!studentId) return;

      try {
        const data = await getMyLearning(studentId);
        console.log("My Learning Data:", data);
        setMyLearning(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching my learning:", error);
        setMyLearning([]);
      }
    }
    fetchMyLearning();
  }, [location.key]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await api.get("/courses/recommended");
        setRecommendedCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    async function fetchPopular() {
      try {
        const res = await api.get("/courses/popular");
        setPopularCourses(res.data || []);
      } catch (err) {
        console.error("Popular Courses Error:", err);
        setPopularCourses([]);
      }
    }
    fetchPopular();
  }, []);

  useEffect(() => {
    async function fetchNewCourses() {
      try {
        const res = await api.get("/courses/new");
        setNewCourses(res.data || []);
      } catch (err) {
        console.error("New Courses Error:", err);
        setNewCourses([]);
      }
    }
    fetchNewCourses();
  }, []);

  // 🟢 NEW: Fetch Teacher Uploaded Courses (All Courses)
  useEffect(() => {
    async function fetchTeacherCourses() {
      try {
        const res = await api.get("/courses"); 
        setAllCourses(res.data || []);
      } catch (err) {
        console.error("Teacher Courses Error:", err);
        setAllCourses([]);
      }
    }
    fetchTeacherCourses();
  }, []);

  // --- JSX RENDER ---

  return (
    <>
      <Header />
      <div className="home-container">
        <h2 className="welcome">Welcome, {studentName} 👋</h2>

        <div className="fade-carousel">
          {ads.length > 0 && ads[currentIndex] && (
            <>
              <button
                className="carousel-btn left"
                onClick={() =>
                  setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length)
                }
              >
                ◀
              </button>

              <img
                src={ads[currentIndex].image}
                alt="ads"
                className="fade-image active"
                onClick={() =>
                  ads[currentIndex].link &&
                  window.open(ads[currentIndex].link, "_blank")}
              />

              <button
                className="carousel-btn right"
                onClick={() =>
                  setCurrentIndex((prev) => (prev + 1) % ads.length)
                }
              >
                ▶
              </button>
            </>
          )}
        </div>

        {myLearning.length === 0 && (
          <div className="empty-learning">
            <p>You haven’t started any course yet 🚀</p>
          </div>
        )}

        {myLearning.length > 0 && (
          <div className="my-learning-section">
            <h2 className="my-learning-title-main" id="my-learning">📚 My Learning</h2>

            <div className="my-learning-scroll">
              {myLearning.map((item) => {
                const progress = Number(item.progress) || 0;
                const courseId = item.courseId || item.course_id || item.id;

                return (
                  <div
                    key={`learning-${item.enrollmentId}`}
                    className="my-learning-card"
                    onClick={() => {
                      navigate(`/course/${courseId}`, {
                        state: { courseType: item.courseType }
                      });
                    }}
                  >
                    <div className="thumb-wrapper">
                      {/* ✅ FIX: Use getImageUrl */}
                      <img
                        src={getImageUrl(item.thumbnail)}
                        alt={item.title}
                        className="my-learning-thumb"
                      />

                      {progress === 100 && (
                        <span className="completed-badge">✔ Completed</span>
                      )}

                      {progress > 0 && progress < 100 && (
                        <span className="continue-badge">▶ Continue</span>
                      )}

                      {progress === 0 && (
                        <span className="start-badge">▶ Start</span>
                      )}
                    </div>

                    <div className="my-learning-info">
                      <div className="my-learning-card-title">{item.title}</div>
                      <div className="progress-text">
                        {progress === 100
                          ? "Completed"
                          : progress > 0
                            ? `${progress}% complete`
                            : "Not started"}
                      </div>

                      <div className="my-learning-progress">
                        <div
                          className="my-learning-progress-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <h2 className="section-title" id="categories">Categories</h2>
        <div className="category-container">
          <div className="category-card" onClick={() => navigate("/category/sales")}>Sales</div>
          <div className="category-card" onClick={() => navigate("/category/soft-skills")}>Soft Skills</div>
          <div className="category-card" onClick={() => navigate("/category/communication")}>Communication</div>
          <div className="category-card" onClick={() => navigate("/category/crm-tools")}>CRM Tools</div>
          <div className="category-card" onClick={() => navigate("/category/placement-training")}>Placement Training</div>
          <div className="category-card" onClick={() => navigate("/category/digital-online-sales")}>Digital Online Sales</div>
          <div className="category-card" onClick={() => navigate("/category/zoho-crm-essentials")}>Zoho CRM Essentials</div>
          <div className="category-card" onClick={() => navigate("/category/customer-data-management")}>Customer Data Management</div>
        </div>

        {/* 🟢 NEW SECTION: Recently Added Courses (Teacher Uploads) */}
        <h3 className="section-title" id="recently-added">Recently Added Courses</h3>
        <div className="popular-wrapper">
          <button className="scroll-btn left" onClick={() => {
            document.getElementById("recent-scroll").scrollLeft -= 300;
          }}>◀</button>

          <div className="popular-container" id="recent-scroll">
            {Array.isArray(allCourses) && allCourses.length > 0 ? (
              allCourses.map((course) => (
                <div key={`recent-${course.id}`} className="popular-card"
                  onClick={() => {
                    // Use 'general' for teacher uploads
                    if (isEnrolled(course.id, "general")) {
                      navigate(`/course/${course.id}`, { state: { courseType: "general" } });
                    } else {
                      alert("Please enroll to watch this course 🔒");
                    }
                  }}
                >
                  {/* ✅ FIX: Use getImageUrl */}
                  <img src={getImageUrl(course.image)} alt="course" className="course-img" />
                  
                  <div className="course-content">
                    <p className="course-title">{course.title}</p>
                    <p className="course-instructor">{course.instructor || "Instructor"}</p>
                    <div className="course-price">
                      <span className="price">₹{course.price}</span>
                    </div>

                    <div className="course-actions">
                      {isEnrolled(course.id, "general") ? (
                        <button className="continue-btn" onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/course/${course.id}`, { state: { courseType: "general" } });
                        }}>Enrolled</button>
                      ) : (
                        <>
                          <button className="add-cart-btn"
                            disabled={isInCart(course.id, "general")}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(course, "general");
                            }}
                          >
                            {isInCart(course.id, "general") ? "In Cart" : "Add to Cart"}
                          </button>
                          <button className="buy-now-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              buyNow(course, "general");
                            }}
                          >Buy Now</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{padding: '20px', color: '#666'}}>No recent courses available.</p>
            )}
          </div>

          <button className="scroll-btn right" onClick={() => {
            document.getElementById("recent-scroll").scrollLeft += 300;
          }}>▶</button>
        </div>

        <h3 className="section-title" id="recommended">Recommended for You</h3>
        <div className="course-list">
          {Array.isArray(recommendedCourses) &&
            recommendedCourses.map((c) => (
              <div key={`recommended-${c.id}`} className="course-card"
                onClick={() => {
                  if (isEnrolled(c.id, "recommended")) {
                    navigate(`/course/${c.id}`, {
                      state: { courseType: "recommended" }
                    });
                  } else {
                    alert("Please enroll to watch this course 🔒");
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                {/* ✅ FIX: Use getImageUrl */}
                <img src={getImageUrl(c.image)} alt="course" className="course-img" />
                <div className="course-content">
                  <p className="course-title">{c.title}</p>
                  <p className="course-instructor">{c.instructor}</p>
                  <div className="course-rating">
                    <span className="rating-value">{c.rating}</span>
                    <span className="stars">⭐⭐⭐⭐⭐</span>
                    <span className="reviews">({c.reviews})</span>
                  </div>
                  <div className="course-price">
                    <span className="price">₹{c.price}</span>
                    <span className="old-price">₹{c.oldPrice}</span>
                  </div>
                  <div className="course-actions">
                    {isEnrolled(c.id, "recommended") ? (
                      <button
                        className="continue-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/course/${c.id}`, {
                            state: { courseType: "recommended" }
                          });
                        }}
                      >
                        ▶ Enrolled
                      </button>
                    ) : (
                      <>
                        <button
                          className="add-cart-btn"
                          disabled={isInCart(c.id, "recommended")}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(c, "recommended");
                          }}
                        >
                          {isInCart(c.id, "recommended") ? "In Cart" : "Add to Cart"}
                        </button>

                        <button
                          className="buy-now-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            buyNow(c, "recommended");
                          }}
                        >
                          Buy Now
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <h3 className="section-title" id="popular">Popular Courses</h3>

        <div className="popular-wrapper">
          <button className="scroll-btn left" onClick={() => {
            document.getElementById("popular-scroll").scrollLeft -= 300;
          }}>
            ◀
          </button>

          <div className="popular-container" id="popular-scroll">
            {Array.isArray(popularCourses) &&
              popularCourses.map((course) => (
                <div key={`popular-${course.id}`} className="popular-card"
                  onClick={() => {
                    if (isEnrolled(course.id, "popular")) {
                      navigate(`/course/${course.id}`, {
                        state: { courseType: "popular" }
                      });
                    } else {
                      alert("Please enroll to watch this course 🔒");
                    }
                  }}
                >
                  <span className="popular-badge">🔥 Popular</span>
                  {/* ✅ FIX: Use getImageUrl */}
                  <img src={getImageUrl(course.image)} alt="course" className="course-img" />
                  <div className="course-content">
                    <p className="course-title">{course.title}</p>
                    <p className="course-instructor">{course.instructor}</p>
                    <div className="course-rating">
                      <span className="rating-value">{course.rating}</span>
                      <span className="stars">⭐⭐⭐⭐⭐</span>
                      <span className="reviews">({course.reviews})</span>
                    </div>
                    <div className="course-price">
                      <span className="price">₹{course.price}</span>
                      <span className="old-price">₹{course.oldPrice}</span>
                    </div>
                    <div className="course-actions">
                      {isEnrolled(course.id, "popular") ? (
                        <button
                          className="continue-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/course/${course.id}`, {
                              state: { courseType: "popular" }
                            });
                          }}
                        >
                          ▶ Enrolled
                        </button>
                      ) : (
                        <>
                          <button
                            className="add-cart-btn"
                            disabled={isInCart(course.id, "popular")}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(course, "popular");
                            }}
                          >
                            {isInCart(course.id, "popular") ? "In Cart" : "Add to Cart"}
                          </button>

                          <button
                            className="buy-now-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              buyNow(course, "popular");
                            }}
                          >
                            Buy Now
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <button className="scroll-btn right" onClick={() => {
            document.getElementById("popular-scroll").scrollLeft += 300;
          }}>
            ▶
          </button>
        </div>

        <h3 className="section-title" id="new">New Courses ✨</h3>
        <div className="popular-wrapper">
          <button className="scroll-btn left" onClick={() => {
            document.getElementById("new-scroll").scrollLeft -= 300;
          }}>◀</button>

          <div className="popular-container" id="new-scroll">
            {Array.isArray(newCourses) &&
              newCourses.map((course) => (
                <div key={`new-${course.id}`} className="popular-card"
                  onClick={() => {
                    if (isEnrolled(course.id, "new")) {
                      navigate(`/course/${course.id}`, {
                        state: { courseType: "new" }
                      });
                    } else {
                      alert("Please enroll to watch this course 🔒");
                    }
                  }}
                >
                  <span className="popular-badge">✨ New</span>
                  {/* ✅ FIX: Use getImageUrl */}
                  <img src={getImageUrl(course.image)} alt="course" className="course-img" />

                  <div className="course-content">
                    <p className="course-title">{course.title}</p>
                    <p className="course-instructor">{course.instructor}</p>

                    <div className="course-rating">
                      <span className="rating-value">{course.rating}</span>
                      <span className="stars">⭐⭐⭐⭐⭐</span>
                      <span className="reviews">({course.reviews})</span>
                    </div>

                    <div className="course-price">
                      <span className="price">₹{course.price}</span>
                      <span className="old-price">₹{course.oldPrice}</span>
                    </div>
                    <div className="course-actions">
                      {isEnrolled(course.id, "new") ? (
                        <button
                          className="continue-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/course/${course.id}`, {
                              state: { courseType: "new" }
                            });
                          }}
                        >
                          Enrolled
                        </button>
                      ) : (
                        <>
                          <button
                            className="add-cart-btn"
                            disabled={isInCart(course.id, "new")}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(course, "new");
                            }}
                          >
                            {isInCart(course.id, "new") ? "In Cart" : "Add to Cart"}
                          </button>

                          <button
                            className="buy-now-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              buyNow(course, "new");
                            }}
                          >
                            Buy Now
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <button className="scroll-btn right" onClick={() => {
            document.getElementById("new-scroll").scrollLeft += 300;
          }}>▶</button>

        </div>
        <Footer />
      </div>
    </>
  );
}