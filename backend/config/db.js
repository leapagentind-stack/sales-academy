const mysql = require("mysql2/promise");
require("dotenv").config();

async function connectDB() {
  try {
    // 1. Connect WITHOUT database to check/create DB
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    // 2. Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log(`✔ Database '${process.env.DB_NAME}' ready`);

    // 3. Create pool with database
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // 4. Create tables if not exist
    await createTables(pool);

    return pool;
  } catch (error) {
    console.error("❌ DB Connection Error:", error);
    process.exit(1);
  }
}

async function createTables(pool) {

  // Students Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      phone VARCHAR(20),
      current_status VARCHAR(100),
      branch VARCHAR(100),
      study_year VARCHAR(50),
      school_college VARCHAR(255),
      city VARCHAR(100),
      program_interest VARCHAR(255),
      sales_selections JSON,
      cra_selections JSON,
      agree_terms BOOLEAN,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Teachers Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS teachers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      phone VARCHAR(20),
      city VARCHAR(100),
      highest_education VARCHAR(100),
      experience_range VARCHAR(100),
      institution VARCHAR(255),
      subject_expertise VARCHAR(255),
      linkedin VARCHAR(255),
      experience_pdf_url VARCHAR(255),
      teaching_mode VARCHAR(100),
      availability VARCHAR(255),
      expected_hourly_rate VARCHAR(50),
      languages JSON,
      bio TEXT,
      agree_terms BOOLEAN,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("✔ FULL Student + Teacher tables created/updated");
}

module.exports = connectDB;
