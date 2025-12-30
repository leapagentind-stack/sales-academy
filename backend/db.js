// backend/db.js
const mysql = require('mysql2/promise');

// ✅ MySQL Connection Pool (PASSWORD HARD-CODED)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Chinnu_12', // ✅ YOUR PASSWORD
    database: 'teacher_dashboard_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Helper function
const query = async (sql, params) => {
    const [rows] = await pool.execute(sql, params);
    return rows;
};

module.exports = { query };
