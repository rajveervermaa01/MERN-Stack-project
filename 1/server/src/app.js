const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const ErrorResponse = require('./utils/ErrorResponse');

const app = express();

// ==========================================
// Global Middlewares
// ==========================================

// HTTP Request Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse URL-encoded bodies (form data parsing)
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Base Routes (Root & Health Check)
// ==========================================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Task Manager REST API',
    healthCheck: '/api/v1/health',
    tasksEndpoint: '/api/v1/tasks'
  });
});

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'Task API is running smoothly',
    timestamp: new Date()
  });
});

// ==========================================
// API Routes
// ==========================================
const taskRoutes = require('./routes/taskRoutes');

// Mount routes
app.use('/api/v1/tasks', taskRoutes);

// Unhandled route handler (404)
app.use('*', (req, res, next) => {
  next(new ErrorResponse(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Centralized Error Handling Middleware (must be last)
app.use(errorHandler);

module.exports = app;
