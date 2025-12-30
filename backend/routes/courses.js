const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { query } = require('../db');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 2 * 1024 * 1024 * 1024 } 
});

router.get('/', async (req, res) => {
    try {
        const courses = await query('SELECT * FROM courses ORDER BY created_at DESC', []);
        const lessons = await query('SELECT * FROM lessons ORDER BY module_order ASC, id ASC', []);
        const progress = await query('SELECT * FROM user_progress', []);

        const fullData = courses.map(course => {
            const courseLessons = lessons.filter(l => l.course_id == course.id);
            const courseProgress = progress.filter(p => p.course_id == course.id);
            return { 
                ...course, 
                lessons: courseLessons, 
                progress: courseProgress 
            };
        });

        res.json(fullData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/create', upload.single('thumbnail'), async (req, res) => {
    try {
        const { title, instructor, category, price } = req.body;
        const thumbnail = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

        const sql = `INSERT INTO courses (title, instructor, category, thumbnail_url, price) VALUES (?, ?, ?, ?, ?)`;
        const result = await query(sql, [title, instructor, category, thumbnail, price]);

        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create course' });
    }
});

router.post('/create-lesson', upload.fields([{ name: 'video' }, { name: 'thumbnail' }]), async (req, res) => {
    try {
        const { courseId, title, description, content, requirements, moduleTitle, moduleOrder, duration } = req.body;
        
        if (!req.files || !req.files['video']) {
            return res.status(400).json({ error: 'Video file is required' });
        }

        const videoFile = req.files['video'][0];
        const thumbFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;
        const videoUrl = `http://localhost:5000/uploads/${videoFile.filename}`;
        const thumbnailUrl = thumbFile ? `http://localhost:5000/uploads/${thumbFile.filename}` : null;

        const sql = `INSERT INTO lessons (course_id, module_title, module_order, title, description, content, requirements, video_url, thumbnail_url, duration, is_locked, likes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`;
        
        await query(sql, [courseId, moduleTitle || 'Module 1', moduleOrder || 0, title, description, content, requirements, videoUrl, thumbnailUrl, duration || '0:00', 0]);

        res.json({ success: true });
    } catch (error) {
        console.error("Error saving lesson:", error);
        res.status(500).json({ error: 'Failed to save lesson' });
    }
});

router.put('/:id', upload.single('thumbnail'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, instructor, category, price } = req.body;
        let sql, params;
        if (req.file) {
            const thumbnail = `http://localhost:5000/uploads/${req.file.filename}`;
            sql = `UPDATE courses SET title=?, instructor=?, category=?, price=?, thumbnail_url=? WHERE id=?`;
            params = [title, instructor, category, price, thumbnail, id];
        } else {
            sql = `UPDATE courses SET title=?, instructor=?, category=?, price=? WHERE id=?`;
            params = [title, instructor, category, price, id];
        }
        await query(sql, params);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update course' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await query('DELETE FROM courses WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete course' });
    }
});

router.post('/lesson/:id/like', async (req, res) => {
    try {
        const { id } = req.params;
        await query('UPDATE lessons SET likes = likes + 1 WHERE id = ?', [id]);
        const updated = await query('SELECT likes FROM lessons WHERE id = ?', [id]);
        res.json({ success: true, likes: updated[0].likes });
    } catch (error) {
        res.status(500).json({ error: 'Failed to like video' });
    }
});

router.post('/progress/assignment', async (req, res) => {
    try {
        const { courseId, moduleIndex } = req.body;
        const checkSql = 'SELECT * FROM user_progress WHERE course_id = ? AND module_index = ?';
        const existing = await query(checkSql, [courseId, moduleIndex]);

        if (existing.length === 0) {
            await query('INSERT INTO user_progress (course_id, module_index, assignment_completed) VALUES (?, ?, 1)', [courseId, moduleIndex]);
        } else {
            await query('UPDATE user_progress SET assignment_completed = 1 WHERE course_id = ? AND module_index = ?', [courseId, moduleIndex]);
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update progress' });
    }
});

router.get('/comments/:lessonId', async (req, res) => {
    try {
        const { lessonId } = req.params;
        const comments = await query('SELECT * FROM comments WHERE lesson_id = ? ORDER BY created_at DESC', [lessonId]);
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

router.post('/comments/create', async (req, res) => {
    try {
        const { lessonId, studentId, text, parentId, rating } = req.body;
        
        const sql = `INSERT INTO comments (lesson_id, user_id, user_name, comment_text, parent_id, rating, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())`;
        
        const result = await query(sql, [
            lessonId, 
            studentId, 
            'Student', 
            text, 
            parentId || null, 
            rating || 0
        ]);

        const newComment = {
            id: result.insertId,
            lesson_id: lessonId,
            user_id: studentId,
            user_name: 'Student',
            comment_text: text,
            parent_id: parentId || null,
            rating: rating || 0,
            created_at: new Date()
        };

        res.json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to post comment' });
    }
});

router.post('/revenue/add', async (req, res) => {
    try {
        const { amount } = req.body;
        await query('UPDATE revenue SET total_amount = total_amount + ? WHERE id = 1', [amount]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update revenue' });
    }
});

module.exports = router;