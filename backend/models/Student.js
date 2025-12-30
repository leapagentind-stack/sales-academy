const db = require('../db');// Corrected path to config folder

class Student {
    static async create(s) {
        const query = `
            INSERT INTO students (
                first_name, last_name, email, password, phone, current_status,
                branch, study_year, school_college, city, program_interest,
                sales_selections, cra_selections, agree_terms, is_verified
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            s.firstName,
            s.lastName,
            s.email,
            s.password,
            s.phone,
            s.currentStatus,
            s.branch || null,
            s.studyYear || null,
            s.schoolCollege,
            s.city,
            s.programInterest,
            JSON.stringify(s.salesSelections || []),
            JSON.stringify(s.crmSelections || []),
            s.agreeTerms ? 1 : 0,
            1
        ];

        const [result] = await db.execute(query, values);
        return { id: result.insertId, ...s };
    }

    static async findOne({ where }) {
        const key = Object.keys(where)[0];
        const value = where[key];
        if (!value) return null;
        const [rows] = await db.execute(`SELECT * FROM students WHERE ${key} = ?`, [value]);
        return rows[0] || null;
    }

    static async findByPk(id) {
        const [rows] = await db.execute('SELECT * FROM students WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async update(data, { where }) {
        const id = where.id;
        const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        return await db.execute(`UPDATE students SET ${setClause} WHERE id = ?`, [...values, id]);
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM students');
        return rows;
    }

    static async destroy({ where }) {
        return await db.execute('DELETE FROM students WHERE id = ?', [where.id]);
    }
}

module.exports = Student;