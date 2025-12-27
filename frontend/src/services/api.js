import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* -------------------------------
   Attach Token Automatically
-------------------------------- */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* -------------------------------
   Auto Logout on 401
-------------------------------- */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

/* -------------------------------
   Student APIs
-------------------------------- */
export const studentAPI = {
  register: (data) => api.post("/students/register", data),
  login: (data) => api.post("/students/login", data),
  getProfile: () => api.get("/students/profile"),
  updateProfile: (data) => api.put("/students/profile", data),
  deleteProfile: () => api.delete("/students/profile"),
  logout: () => api.post("/students/logout"),
  getAll: () => api.get("/students/all"),
};

/* -------------------------------
   Teacher APIs
-------------------------------- */
export const teacherAPI = {
  register: (data) => api.post("/teachers/register", data),
  login: (data) => api.post("/teachers/login", data),
  getProfile: () => api.get("/teachers/profile"),
  updateProfile: (data) => api.put("/teachers/profile", data),
  deleteProfile: () => api.delete("/teachers/profile"),
  logout: () => api.post("/teachers/logout"),
  getAll: () => api.get("/teachers/all"),
};
/* -------------------------------
   Enrollment
-------------------------------- */
export const checkEnrollment = async (studentId, courseId, courseType) => {
  const res = await api.get(
    `/enrollment/check?studentId=${studentId}&courseId=${courseId}&courseType=${courseType}`
  );
  return res;
};




/* -------------------------------
   My Learning (FIXED)
-------------------------------- */
export const getMyLearning = async (studentId) => {
  const res = await api.get(`/my-learning/${studentId}`);
  return res.data;
};

/* -------------------------------
   Course Videos (Recommended / Popular / New)
-------------------------------- */
export const getVideosByCourse = async (courseId, courseType, studentId) => {
  if (!courseType || !studentId) return [];

  const res = await api.get(
    `/videos/course/${courseId}/${courseType}?studentId=${studentId}`
  );

  return res.data.videos;
};


/* -------------------------------
   Category Videos
-------------------------------- */
export const getVideosByCategoryAndLevel = async (slug, level) => {
  const res = await api.get(`/category/${slug}?level=${level}`);
  return res.data;
};

/* -------------------------------
   Recommended Courses
-------------------------------- */
export const getRecommendedCourses = async () => {
  const res = await api.get("/courses/recommended");
  return res.data;
};

/* -------------------------------
   Popular Course Videos
-------------------------------- */
export const getPopularVideosByCourse = async (id) => {
  const res = await api.get(`/popular-videos/${id}`);
  return res.data;
};

/* -------------------------------
   New Courses (FIXED)
-------------------------------- */
export const getNewCourses = async () => {
  const res = await api.get("/courses/new");
  return res.data;
};

export const getNewCourseVideos = async (id) => {
  const res = await api.get(`/courses/new/${id}/videos`);
  return res.data;
};
export const searchCourses = (q) =>
  api.get(`/search?q=${q}`);



export default api;
