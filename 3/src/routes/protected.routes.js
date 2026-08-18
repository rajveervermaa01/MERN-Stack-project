/**
 * Protected Routes — demo endpoints
 * ──────────────────────────────────
 * These routes require a valid JWT.
 */
const { Router } = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const { readUsers } = require('../store/userStore');

const router = Router();

// Any authenticated user
router.get('/dashboard', protect, (req, res) => {
    res.json({
        success: true,
        message: `Welcome, ${req.user.name}!`,
        data: {
            user: req.user,
            serverTime: new Date().toISOString(),
            tip: 'This endpoint is only accessible with a valid JWT.',
        },
    });
});

// Admin-only route
router.get('/admin/users', protect, restrictTo('admin'), (_req, res) => {
    const users = readUsers().map(({ passwordHash, ...u }) => u);
    res.json({
        success: true,
        count: users.length,
        users,
    });
});

module.exports = router;
