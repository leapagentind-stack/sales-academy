const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../db'); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `assign_${uuidv4()}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const results = await query("SELECT * FROM assignments ORDER BY id DESC", []);
        res.json(results);
    } catch (err) {
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

router.post('/submit', upload.single('assignment_file'), async (req, res) => {
    try {
        const { title, course_id, module_index } = req.body;
        const file = req.file;

        if (!file || !course_id) return res.status(400).json({ success: false, message: 'File and Course required.' });

        const fileUrl = `http://localhost:5000/uploads/${file.filename}`;
        
        await query(
            "INSERT INTO assignments (course_id, module_index, title, file_path) VALUES (?, ?, ?, ?)", 
            [course_id, module_index || 0, title, fileUrl]
        );
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to upload' });
    }
});

router.put('/:id', upload.single('assignment_file'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, course_id, module_index } = req.body;
        const file = req.file;

        let sql, params;
        if (file) {
            const fileUrl = `http://localhost:5000/uploads/${file.filename}`;
            sql = "UPDATE assignments SET title = ?, course_id = ?, module_index = ?, file_path = ? WHERE id = ?";
            params = [title, course_id, module_index || 0, fileUrl, id];
        } else {
            sql = "UPDATE assignments SET title = ?, course_id = ?, module_index = ? WHERE id = ?";
            params = [title, course_id, module_index || 0, id];
        }

        await query(sql, params);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to update' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await query("DELETE FROM assignments WHERE id = ?", [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to delete' });
    }
});

router.get('/download/:courseId', async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const moduleIndex = req.query.module || 0; 

        const results = await query(
            "SELECT file_path FROM assignments WHERE course_id = ? AND module_index = ? ORDER BY id DESC LIMIT 1", 
            [courseId, moduleIndex]
        );

        if (results.length > 0) {
            res.redirect(results[0].file_path);
        } else {
            res.status(404).send("<h1>No Assignment Found</h1><p>No assignment uploaded for this specific module yet.</p>");
        }
    } catch (err) {
        res.status(500).send("Database error");
    }
});

module.exports = router;