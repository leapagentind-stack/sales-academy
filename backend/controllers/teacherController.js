const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
require('dotenv').config();

// Use a fallback secret if .env fails to load
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_12345';

const generateToken = (id) => {
    return jwt.sign({ id, role: 'teacher' }, JWT_SECRET, { expiresIn: '30d' });
};

exports.registerTeacher = async (req, res) => {
    try {
        console.log("Registering:", req.body.email);
        const { email, password, languages, subjectExpertise } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and Password are required' });
        }

        // 1. Check if teacher exists
        const existing = await Teacher.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'This email is already registered.' });
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create Teacher (Convert arrays to strings for SQL)
        const newTeacher = await Teacher.create({
            ...req.body,
            password: hashedPassword,
            languages: Array.isArray(languages) ? languages.join(', ') : (languages || ''),
            subjectExpertise: Array.isArray(subjectExpertise) ? subjectExpertise.join(', ') : (subjectExpertise || '')
        });

        // 4. Generate Token
        const token = generateToken(newTeacher.id);

        res.status(201).json({ 
            success: true, 
            message: 'Registration Successful!', 
            token, 
            data: { id: newTeacher.id, email: newTeacher.email, firstName: newTeacher.first_name } 
        });

    } catch (error) {
        console.error("Register Error:", error); // ✅ Logs exact error to terminal
        res.status(500).json({ success: false, message: "Database Error: " + error.message });
    }
};

exports.loginTeacher = async (req, res) => {
    try {
        console.log("Login Attempt:", req.body.email);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // 1. Find Teacher
        const teacher = await Teacher.findOne({ where: { email } });
        
        if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher not found' });
        }

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // 3. Generate Token
        const token = generateToken(teacher.id);

        // 4. Send response (Remove password from data)
        const { password: _, ...teacherData } = teacher;

        res.status(200).json({ 
            success: true, 
            message: 'Login Successful',
            token, 
            data: teacherData 
        });

    } catch (error) {
        console.error("Login Error:", error); // ✅ THIS will show you why it was failing
        res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
    }
};

exports.getTeacherProfile = async (req, res) => {
    try {
        // Ensure req.user exists (set by auth middleware)
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        
        const teacher = await Teacher.findByPk(req.user.id);
        if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher not found' });
        }

        res.status(200).json({ success: true, data: teacher });
    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).json({ success: false, message: 'Error fetching profile' });
    }
};

exports.logoutTeacher = (req, res) => {
    // Since JWT is stateless, logout is handled on frontend by clearing token.
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.findAll();
        res.status(200).json({ success: true, data: teachers });
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ success: false, message: 'Error fetching teachers' });
    }
};