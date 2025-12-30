const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { jwtSecret, jwtExpire, cookieExpire } = require('../config/auth');

// Student Registration
router.post('/student', async (req, res) => {
    try {
        const {
            firstName, lastName, email, password, phone,
            currentStatus, branch, studyYear, schoolCollege,
            city, programInterest, salesSelections, craSelections, agreeTerms
        } = req.body;

        const [existingUsers] = await pool.execute('SELECT * FROM students WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already exists' 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const salesJson = JSON.stringify(salesSelections || []);
        const craJson = JSON.stringify(craSelections || []);

        const [result] = await pool.execute(
            `INSERT INTO students 
            (first_name, last_name, email, password, phone, current_status, branch, 
             study_year, school_college, city, program_interest, sales_selections, 
             cra_selections, agree_terms) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                firstName, lastName, email, hashedPassword, phone, currentStatus, 
                branch, studyYear, schoolCollege, city, programInterest, 
                salesJson, craJson, agreeTerms ? 1 : 0
            ]
        );

        const token = jwt.sign(
            { id: result.insertId, role: 'student' }, 
            jwtSecret, 
            { expiresIn: jwtExpire }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: cookieExpire
        });

        res.status(201).json({ 
            success: true, 
            message: 'Student registered successfully',
            data: {
                id: result.insertId,
                email,
                firstName,
                lastName
            },
            token
        });
    } catch (error) {
        console.error('Student registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration',
            error: error.message
        });
    }
});

// Teacher Registration
router.post('/teacher', async (req, res) => {
    try {
        const {
            firstName, lastName, email, password, phone, city,
            highestEducation, experienceRange, institution,
            subjectExpertise, linkedin, experiencePdfUrl,
            teachingMode, availability, expectedHourlyRate,
            languages, bio, agreeTerms
        } = req.body;

        const [existingUsers] = await pool.execute('SELECT * FROM teachers WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already exists' 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const languagesJson = JSON.stringify(languages || []);

        const [result] = await pool.execute(
            `INSERT INTO teachers 
            (first_name, last_name, email, password, phone, city, highest_education, 
             experience_range, institution, subject_expertise, linkedin, experience_pdf_url, 
             teaching_mode, availability, expected_hourly_rate, languages, bio, agree_terms) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                firstName, lastName, email, hashedPassword, phone, city, 
                highestEducation, experienceRange, institution, subjectExpertise, 
                linkedin || null, experiencePdfUrl || null, teachingMode, availability, 
                expectedHourlyRate || null, languagesJson, bio, agreeTerms ? 1 : 0
            ]
        );

        const token = jwt.sign(
            { id: result.insertId, role: 'teacher' }, 
            jwtSecret, 
            { expiresIn: jwtExpire }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: cookieExpire
        });

        res.status(201).json({ 
            success: true, 
            message: 'Teacher registered successfully',
            data: {
                id: result.insertId,
                email,
                firstName,
                lastName
            },
            token
        });
    } catch (error) {
        console.error('Teacher registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration',
            error: error.message
        });
    }
});

module.exports = router;