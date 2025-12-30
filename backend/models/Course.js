const db = require('../config/db');

const initTables = async () => {
    try {
        const courseTable = `
            CREATE TABLE IF NOT EXISTS courses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                instructor VARCHAR(255),
                category VARCHAR(255),
                price DECIMAL(10, 2),
                thumbnail_url VARCHAR(255),
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const lessonTable = `
            CREATE TABLE IF NOT EXISTS lessons (
                id INT AUTO_INCREMENT PRIMARY KEY,
                course_id INT,
                title VARCHAR(255),
                video_url VARCHAR(500),
                module_title VARCHAR(255),
                module_order INT,
                duration VARCHAR(50),
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
            )
        `;

        await db.execute(courseTable);
        await db.execute(lessonTable);
        console.log("SQL Tables Verified: 'courses' and 'lessons' are ready.");
    } catch (err) {
        console.error("Table Init Error:", err.message);
    }
};

initTables();

module.exports = {};