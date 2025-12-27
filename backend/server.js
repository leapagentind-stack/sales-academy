const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
global.db = db;
// Route Files

const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const myLearningRoutes = require("./routes/myLearningRoutes");
const coursevideosRoutes = require("./routes/courseVideosRoutes");
const recommendedRoutes = require('./routes/recommendedRoutes');
const recommendedVideoRoutes = require("./routes/recommendedVideoRoutes");
const categoryVideoRoutes = require("./routes/categoryVideoRoutes"); 
const adsRoutes = require("./routes/adsRoutes");
const popularRoutes = require("./routes/popularRoutes");
const popularVideoRoutes = require("./routes/popularVideoRoutes");
const newCourseRoutes = require("./routes/newCourseRoutes");
const searchRoutes = require("./routes/searchRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");






// Initialize App
const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes

app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use("/api/my-learning", myLearningRoutes);
app.use("/api/videos", coursevideosRoutes);
app.use("/api", recommendedRoutes);
app.use("/api", recommendedVideoRoutes);
app.use("/api", categoryVideoRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api", popularRoutes);
app.use("/api/popular-videos", popularVideoRoutes);
app.use("/api/courses", newCourseRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/enrollment", enrollmentRoutes);

// Default Root
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Registration API Server Running'
  });
});

// TEST DB CONNECTION
db.query('SELECT 1')
  .then(() => console.log("MySQL DB Connected"))
  .catch((err) => console.error("DB Connection Failed:", err));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
