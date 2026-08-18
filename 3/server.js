/**
 * Auth API Server
 * ───────────────
 * Express + JWT + bcrypt authentication server.
 * Stores JWT in httpOnly cookies for security.
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const authRoutes = require('./src/routes/auth.routes');
const protectedRoutes = require('./src/routes/protected.routes');
const { errorHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5002;

// ── Middleware ──────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// CORS – allow the React dev server
app.use(
    cors({
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        credentials: true,
    })
);

// ── Routes ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

// ── Global error handler ───────────────────────────────
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🔐 Auth API running on http://localhost:${PORT}`);
    console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
});
