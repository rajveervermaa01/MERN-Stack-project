/**
 * JWT utility helpers
 */
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Sign a JWT with the user's id and role as payload.
 */
function signToken(userId, role) {
    if (!SECRET) throw new Error('JWT_SECRET is not defined in environment');
    return jwt.sign({ id: userId, role }, SECRET, { expiresIn: EXPIRES_IN });
}

/**
 * Verify a JWT and return the decoded payload.
 * Throws if invalid or expired.
 */
function verifyToken(token) {
    if (!SECRET) throw new Error('JWT_SECRET is not defined in environment');
    return jwt.verify(token, SECRET);
}

/**
 * Parse expiry string (e.g. "7d") into milliseconds for cookie maxAge.
 */
function expiryToMs(str) {
    const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    const match = str.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 86400000; // default 7 days
    return parseInt(match[1]) * (units[match[2]] || 86400000);
}

module.exports = { signToken, verifyToken, expiryToMs };
