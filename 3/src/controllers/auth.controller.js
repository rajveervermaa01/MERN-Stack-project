/**
 * Auth Controller
 * ────────────────
 * Handles signup, login, logout, and current user retrieval.
 */
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { findByEmail, createUser } = require('../store/userStore');
const { signToken, expiryToMs } = require('../utils/jwt');

const SALT_ROUNDS = 12;

/**
 * POST /api/auth/signup
 */
async function signup(req, res) {
    const { name, email, password, role } = req.body;

    // Check duplicate
    if (findByEmail(email)) {
        return res.status(409).json({
            success: false,
            message: 'Email already registered.',
        });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = createUser({
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: role || 'user',
        createdAt: new Date().toISOString(),
    });

    // Issue JWT & set cookie
    const token = signToken(user.id, user.role);
    sendTokenResponse(res, 201, token, user);
}

/**
 * POST /api/auth/login
 */
async function login(req, res) {
    const { email, password } = req.body;

    const user = findByEmail(email);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password.',
        });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password.',
        });
    }

    const token = signToken(user.id, user.role);
    sendTokenResponse(res, 200, token, user);
}

/**
 * POST /api/auth/logout
 */
function logout(_req, res) {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'Lax',
    });
    res.json({ success: true, message: 'Logged out.' });
}

/**
 * GET /api/auth/me  (protected)
 */
function getMe(req, res) {
    res.json({ success: true, user: req.user });
}

// ── Helper ─────────────────────────────────────────────
function sendTokenResponse(res, statusCode, token, user) {
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: expiryToMs(expiresIn),
    });

    const { passwordHash, ...safeUser } = user;

    res.status(statusCode).json({
        success: true,
        token, // Also send in body for clients that can't use cookies
        user: safeUser,
    });
}

module.exports = { signup, login, logout, getMe };
