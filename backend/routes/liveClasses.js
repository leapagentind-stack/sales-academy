const express = require('express');
const { query } = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const classes = await query('SELECT * FROM live_classes ORDER BY date ASC, time ASC');
        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/create', async (req, res) => {
    try {
        const { title, instructor, date, time, duration, link } = req.body;
        const sql = 'INSERT INTO live_classes (title, instructor, date, time, duration, meeting_link) VALUES (?, ?, ?, ?, ?, ?)';
        const result = await query(sql, [title, instructor, date, time, duration, link]);
        res.json({ 
            success: true, 
            id: result.insertId,
            title, instructor, date, time, duration, meeting_link: link 
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to schedule class' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await query('DELETE FROM live_classes WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete class' });
    }
});

module.exports = router;