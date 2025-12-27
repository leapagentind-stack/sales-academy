const db = require("../config/db");

class Student {

  // ✅ REGISTER
  static async create(data) {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      currentStatus,
      branch,
      studyYear,
      schoolCollege,
      city,
      programInterest,
      salesSelections,
      craSelections,
      agreeTerms
    } = data;

    const [result] = await db.query(
      `INSERT INTO students 
      (
        first_name,
        last_name,
        email,
        password,
        phone,
        current_status,
        branch,
        study_year,
        school_college,
        city,
        program_interest,
        sales_selections,
        cra_selections,
        agree_terms
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        email,
        password,
        phone,
        currentStatus,
        branch,
        studyYear,
        schoolCollege,
        city,
        programInterest,
        JSON.stringify(salesSelections || []),
        JSON.stringify(craSelections || []),
        agreeTerms ? 1 : 0
      ]
    );

    return result; // result.insertId will be used
  }

  // ✅ LOGIN SUPPORT
  static async findByEmail(email) {
    const [rows] = await db.query(
      `SELECT * FROM students WHERE email = ?`,
      [email]
    );
    return rows[0];
  }

  // ✅ PROFILE LOAD
  static async findById(id) {
    const [rows] = await db.query(
      `SELECT id, first_name, last_name, email, phone 
       FROM students 
       WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  // ✅ PROFILE UPDATE
  static async update(id, data) {
    const { firstName, lastName, phone } = data;

    await db.query(
      `UPDATE students 
       SET first_name = ?, last_name = ?, phone = ?
       WHERE id = ?`,
      [
        firstName || null,
        lastName || null,
        phone || null,
        id
      ]
    );
  }

  // ✅ GET ALL
  static async getAll() {
    const [rows] = await db.query(
      `SELECT id, first_name, last_name, email, phone FROM students`
    );
    return rows;
  }

  // ✅ DELETE ACCOUNT
  static async delete(id) {
    await db.query(`DELETE FROM students WHERE id = ?`, [id]);
  }
}

module.exports = Student;
