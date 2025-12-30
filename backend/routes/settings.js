const express = require('express');
const multer = require('multer');
const path = require('path');
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
        cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
    try {
        const users = await query('SELECT * FROM users WHERE id = 1');
        if (users.length > 0) {
            res.json(users[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

router.put('/profile', upload.single('avatar'), async (req, res) => {
    try {
        const { name, email, bio } = req.body;
        let avatarUrl = req.body.avatarUrl; 

        if (req.file) {
            avatarUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        await query('UPDATE users SET name=?, email=?, bio=?, avatar_url=? WHERE id=1', [name, email, bio, avatarUrl]);
        
        res.json({ success: true, avatarUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

router.put('/notifications', async (req, res) => {
    try {
        const { notifyEmail, notifySms } = req.body;
        await query('UPDATE users SET notify_email=?, notify_sms=? WHERE id=1', [notifyEmail, notifySms]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update notifications' });
    }
});

router.put('/password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const users = await query('SELECT password FROM users WHERE id = 1');
        
        if (users[0].password !== currentPassword) {
            return res.status(400).json({ error: 'Incorrect current password' });
        }

        await query('UPDATE users SET password=? WHERE id=1', [newPassword]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

module.exports = router;