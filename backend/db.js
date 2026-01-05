const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Chinnu_12',
    database: 'teacher_dashboard_db',
    waitForConnections: true,
    connectionLimit: 100000,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
    });

const query = async (sql, params) => {
    const [rows] = await pool.execute(sql, params);
    return rows;
};

module.exports = pool;
module.exports.query = query;