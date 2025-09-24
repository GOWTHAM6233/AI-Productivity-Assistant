const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection - MongoDB via Mongoose
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-assistant';

mongoose.connect(mongoUri)
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/tasks', require('./src/routes/tasks'));
app.use('/api/ai', require('./src/routes/ai'));
app.use('/api/site', require('./src/routes/site'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI Productivity Assistant Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Favicon route to prevent 404 errors
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'AI Productivity Assistant API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/me': 'Get current user profile',
        'PUT /api/auth/profile': 'Update user profile',
        'POST /api/auth/change-password': 'Change user password',
        'POST /api/auth/forgot-password': 'Request password reset',
        'POST /api/auth/reset-password': 'Reset password with token',
        'POST /api/auth/logout': 'Logout user'
      },
      tasks: {
        'GET /api/tasks': 'Get all tasks',
        'GET /api/tasks/:id': 'Get specific task',
        'POST /api/tasks': 'Create new task',
        'PUT /api/tasks/:id': 'Update task',
        'DELETE /api/tasks/:id': 'Delete task',
        'POST /api/tasks/:id/complete': 'Mark task as completed',
        'GET /api/tasks/stats/overview': 'Get task statistics'
      },
      ai: {
        'POST /api/ai/chat': 'Chat with AI assistant',
        'POST /api/ai/suggestions': 'Get AI task suggestions',
        'POST /api/ai/insights': 'Get productivity insights',
        'POST /api/ai/feedback': 'Submit AI feedback',
        'GET /api/ai/history': 'Get AI interaction history'
      }
    }
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
