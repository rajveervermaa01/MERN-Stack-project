// Entry point for Task API server
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to Database first, then boot server
connectDB().then(() => {
  const app = require('./src/app');
  const PORT = process.env.PORT || 5001;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  const server = app.listen(PORT, () => {
    console.log(`[Server] running in ${NODE_ENV} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[Error] Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
});
