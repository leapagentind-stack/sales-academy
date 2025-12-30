const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { authenticate } = require('../middleware/auth');

// Make sure these match the exports in teacherController.js
router.post('/register', teacherController.registerTeacher);
router.post('/login', teacherController.loginTeacher);
router.get('/all', teacherController.getAllTeachers);
router.get('/profile', authenticate, teacherController.getTeacherProfile);
router.post('/logout', authenticate, teacherController.logoutTeacher);

module.exports = router;