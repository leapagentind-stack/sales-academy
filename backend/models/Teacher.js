// ✅ Import the 'query' function from your db.js
const { query } = require('../db'); 

class Teacher {
    static async create(data) {
        const sql = `
            INSERT INTO teachers (
                first_name, last_name, email, password, phone, city, 
                highest_education, experience_range, institution, 
                subject_expertise, linkedin, experience_pdf_url, 
                teaching_mode, availability, expected_hourly_rate, 
                languages, bio, agree_terms, is_verified
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const formattedLangs = Array.isArray(data.languages) ? data.languages.join(', ') : (data.languages || null);
        const formattedSubjects = Array.isArray(data.subjectExpertise) ? data.subjectExpertise.join(', ') : (data.subjectExpertise || null);

        const values = [
            data.firstName || '',
            data.lastName || '',
            data.email,
            data.password,
            data.phone || null,
            data.city || null,
            data.highestEducation || null,
            data.experienceRange || null,
            data.institution || null,
            formattedSubjects,
            data.linkedin || null,
            data.experiencePdfUrl || null,
            data.teachingMode || null,
            data.availability || null,
            data.expectedHourlyRate || null,
            formattedLangs,
            data.bio || null,
            data.agreeTerms ? 1 : 0,
            1 
        ];

        // ✅ Use your helper 'query' (returns result directly, not array destructuring)
        const result = await query(sql, values);
        return { id: result.insertId, ...data };
    }

    static async findOne({ where }) {
        const key = Object.keys(where)[0];
        const value = where[key];
        if (!value) return null;
        
        // ✅ Use 'query'
        const rows = await query(`SELECT * FROM teachers WHERE ${key} = ?`, [value]);
        return rows[0] || null;
    }

    static async findByPk(id) {
        // ✅ Use 'query'
        const rows = await query('SELECT * FROM teachers WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async update(data, { where }) {
        const id = where.id;
        const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        
        // ✅ Use 'query'
        return await query(`UPDATE teachers SET ${setClause} WHERE id = ?`, [...values, id]);
    }

    static async findAll() {
        // ✅ Use 'query'
        const rows = await query('SELECT * FROM teachers');
        return rows;
    }

    static async destroy({ where }) {
        // ✅ Use 'query'
        return await query('DELETE FROM teachers WHERE id = ?', [where.id]);
    }
}

module.exports = Teacher;