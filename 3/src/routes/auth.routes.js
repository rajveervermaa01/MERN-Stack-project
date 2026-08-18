/**
 * Auth Routes
 * ────────────
 * POST /api/auth/signup   – register a new user
 * POST /api/auth/login    – log in
 * POST /api/auth/logout   – clear cookie
 * GET  /api/auth/me       – get current user (protected)
 */
const { Router } = require('express');
const { signup, login, logout, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { validateSignup, validateLogin } = require('../middleware/validate');

const router = Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
