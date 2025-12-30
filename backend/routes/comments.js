const express = require('express');
const { query } = require('../db');
const router = express.Router();

router.get('/:lessonId', async (req, res) => {
    try {
        const { lessonId } = req.params;
        const sql = 'SELECT * FROM comments WHERE lesson_id = ? ORDER BY created_at ASC';
        const comments = await query(sql, [lessonId]);
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

router.post('/create', async (req, res) => {
    try {
        const { lessonId, studentId, text, parentId } = req.body;
        
        if (!text || !lessonId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const parent = parentId || null;

        const sql = `INSERT INTO comments (lesson_id, student_id, user_name, comment_text, parent_id) VALUES (?, ?, 'Student', ?, ?)`;
        const result = await query(sql, [lessonId, studentId || 1, text, parent]);

        const newComment = {
            id: result.insertId,
            lesson_id: lessonId,
            student_id: studentId || 1,
            user_name: 'Student',
            comment_text: text,
            parent_id: parent,
            created_at: new Date()
        };

        res.json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to post comment' });
    }
});

module.exports = router;