const express = require('express');
const router = express.Router();
const db = require('../db');

// GET ALL ANNOUNCEMENTS
router.get('/', async (req, res) => {
    try {
        const sql = 'SELECT * FROM announcements ORDER BY created_at DESC';
        const announcements = await db.query(sql);
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST NEW ANNOUNCEMENT
router.post('/', async (req, res) => {
    const { title, description, images } = req.body; 
    // images should be sent as a stringified array if you are storing it as a string
    try {
        const sql = 'INSERT INTO announcements (title, description, images) VALUES (?, ?, ?)';
        await db.query(sql, [title, description, JSON.stringify(images || [])]);
        res.status(201).json({ message: 'Announcement created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE ANNOUNCEMENT
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'DELETE FROM announcements WHERE id = ?';
        await db.query(sql, [id]);
        res.json({ message: 'Announcement deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;