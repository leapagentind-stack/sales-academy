// const express = require('express');
// const cors = require('cors');
// const { Pool } = require('pg');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // PostgreSQL connection
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// // Test database connection
// pool.on('connect', () => {
//   console.log('Connected to PostgreSQL database');
// });

// // Routes
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', message: 'Backend is running' });
// });

// app.get('/api/test-db', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT NOW()');
//     res.json({ status: 'OK', timestamp: result.rows[0].now });
//   } catch (error) {
//     console.error('Database query error:', error);
//     res.status(500).json({ status: 'ERROR', message: 'Database connection failed' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();


const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Registration API Server Running'
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});