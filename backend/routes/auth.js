const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { query } = require('../db'); 

// Student Registration
router.post('/student/register', async (req, res) => {
    try {
        const {
            firstName, lastName, email, password, phone,
            currentStatus, branch, studyYear, schoolCollege,
            city, programInterest, salesSelections, craSelections
        } = req.body;

        const existingUsers = await query('SELECT * FROM students WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const salesJson = JSON.stringify(salesSelections || []);
        const craJson = JSON.stringify(craSelections || []);

        await query(
            `INSERT INTO students 
            (first_name, last_name, email, password, phone, current_status, branch, study_year, school_college, city, program_interest, sales_selections, cra_selections) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, email, hashedPassword, phone, currentStatus, branch, studyYear, schoolCollege, city, programInterest, salesJson, craJson]
        );

        res.status(201).json({ success: true, message: 'Student registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
});

// Teacher Registration
router.post('/teacher/register', async (req, res) => {
    try {
        const {
            firstName, lastName, email, password, phone, city,
            highestEducation, experienceRange, institution,
            subjectExpertise, linkedin, experiencePdfUrl,
            teachingMode, availability, expectedHourlyRate,
            languages, bio
        } = req.body;

        const existingUsers = await query('SELECT * FROM teachers WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const languagesJson = JSON.stringify(languages || []);

        await query(
            `INSERT INTO teachers 
            (first_name, last_name, email, password, phone, city, highest_education, experience_range, institution, subject_expertise, linkedin, experience_pdf_url, teaching_mode, availability, expected_hourly_rate, languages, bio) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, email, hashedPassword, phone, city, highestEducation, experienceRange, institution, subjectExpertise, linkedin, experiencePdfUrl, teachingMode, availability, expectedHourlyRate, languagesJson, bio]
        );

        res.status(201).json({ success: true, message: 'Teacher registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
});

module.exports = router;