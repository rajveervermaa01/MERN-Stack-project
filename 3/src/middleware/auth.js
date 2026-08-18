/**
 * Auth Middleware
 * ───────────────
 * Extracts JWT from httpOnly cookie (preferred) or Authorization header.
 * Attaches decoded user payload to req.user.
 */
const { verifyToken } = require('../utils/jwt');
const { findById } = require('../store/userStore');

function protect(req, res, next) {
    let token = null;

    // 1. Try httpOnly cookie first
    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    // 2. Fallback: Authorization: Bearer <token>
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authenticated. Please log in.',
        });
    }

    try {
        const decoded = verifyToken(token);
        const user = findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User belonging to this token no longer exists.',
            });
        }

        // Strip passwordHash before attaching
        const { passwordHash, ...safeUser } = user;
        req.user = safeUser;
        next();
    } catch (err) {
        const message =
            err.name === 'TokenExpiredError'
                ? 'Token expired. Please log in again.'
                : 'Invalid token.';
        return res.status(401).json({ success: false, message });
    }
}

/**
 * Role-based access control middleware.
 * Usage: restrictTo('admin', 'editor')
 */
function restrictTo(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action.',
            });
        }
        next();
    };
}

module.exports = { protect, restrictTo };
