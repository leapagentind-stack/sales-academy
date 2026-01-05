const db = require('../db');

class Student {
  static async create(s) {
    const query = `
      INSERT INTO students (
        first_name, last_name, email, password, phone, current_status,
        branch, study_year, school_college, city, program_interest,
        sales_selections, crm_selections, agree_terms, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const salesSel = (typeof s.salesSelections === 'string')
      ? s.salesSelections
      : JSON.stringify(s.salesSelections || []);

    const crmSel = (typeof s.crmSelections === 'string')
      ? s.crmSelections
      : JSON.stringify(s.crmSelections || []);

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
      salesSel,
      crmSel,
      s.agreeTerms ? 1 : 0,
      1
    ];

    const [result] = await db.execute(query, values);
    return { id: result.insertId, ...s };
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM students WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async findOne({ where }) {
    const key = Object.keys(where)[0];
    const value = where[key];
    if (!value) return null;
    const [rows] = await db.execute(`SELECT * FROM students WHERE ${key} = ?`, [value]);
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM students WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async update(id, data) {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    return await db.execute(`UPDATE students SET ${setClause} WHERE id = ?`, [...values, id]);
  }

  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM students');
    return rows;
  }

  static async delete(id) {
    return await db.execute('DELETE FROM students WHERE id = ?', [id]);
  }
}

module.exports = Student;