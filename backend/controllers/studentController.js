const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const { jwtSecret, jwtExpire, cookieExpire } = require('../config/auth');

exports.registerStudent = async (req, res) => {
  try {
    const {
      first_name, last_name, email, password, phone, current_status,
      branch, study_year, school_college, city, program_interest,
      sales_selections, crm_selections, agree_terms
    } = req.body;

    const missingFields = [];
    if (!first_name) missingFields.push('first_name');
    if (!last_name) missingFields.push('last_name');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!phone) missingFields.push('phone');
    if (!current_status) missingFields.push('current_status');
    if (!school_college) missingFields.push('school_college');
    if (!city) missingFields.push('city');
    if (!program_interest) missingFields.push('program_interest');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const existingStudent = await Student.findByEmail(email);
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const studentData = {
      firstName: first_name,
      lastName: last_name,
      email,
      password: hashedPassword,
      phone,
      currentStatus: current_status,
      branch: branch || null,
      studyYear: study_year || null,
      schoolCollege: school_college,
      city,
      programInterest: program_interest,
      salesSelections: sales_selections || [],
      crmSelections: crm_selections || [],
      agreeTerms: agree_terms
    };

    const result = await Student.create(studentData);
    const studentId = result.id;

    const token = jwt.sign({ id: studentId, role: 'student' }, jwtSecret, { expiresIn: jwtExpire });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: cookieExpire
    });

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: { id: studentId, email, firstName: first_name, lastName: last_name },
      token
    });

  } catch (error) {
    console.error("🔥 SERVER ERROR:", error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findByEmail(email);

    if (!student || !(await bcrypt.compare(password, student.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: student.id, role: 'student' }, jwtSecret, { expiresIn: jwtExpire });
    res.cookie('token', token, { httpOnly: true, maxAge: cookieExpire });

    // Fix: Handle both naming conventions (camelCase vs snake_case)
    const firstName = student.firstName || student.first_name || "Student";
    const lastName = student.lastName || student.last_name || "";

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { 
        id: student.id, 
        email: student.email, 
        firstName: firstName,
        lastName: lastName 
      },
      token
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateStudentProfile = async (req, res) => {
  try {
    await Student.update(req.user.id, req.body);
    res.status(200).json({ success: true, message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.getAll();
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    await Student.delete(req.user.id);
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
};

exports.logoutStudent = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out' });
};