const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-ai-assistant-2024';

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      message: 'No token provided',
      code: 'NO_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }
};

// @route   GET /api/tasks
// @desc    Get all tasks for the authenticated user
// @access  Private
router.get('/', authenticateToken, (req, res) => {
  try {
    const userTasks = global.inMemoryDB.tasks.filter(task => task.userId === req.user.id);
    res.json({
      tasks: userTasks,
      total: userTasks.length
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get specific task
// @access  Private
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const task = global.inMemoryDB.tasks.find(
      task => task.id === req.params.id && task.userId === req.user.id
    );
    
    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
        code: 'TASK_NOT_FOUND'
      });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, description, priority = 'medium', dueDate, category = 'general' } = req.body;

    if (!title) {
      return res.status(400).json({
        message: 'Title is required',
        code: 'MISSING_TITLE'
      });
    }

    const newTask = {
      id: Date.now().toString(),
      userId: req.user.id,
      title,
      description: description || '',
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      category,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    global.inMemoryDB.tasks.push(newTask);

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const taskIndex = global.inMemoryDB.tasks.findIndex(
      task => task.id === req.params.id && task.userId === req.user.id
    );

    if (taskIndex === -1) {
      return res.status(404).json({
        message: 'Task not found',
        code: 'TASK_NOT_FOUND'
      });
    }

    const { title, description, priority, dueDate, category, completed } = req.body;
    const task = global.inMemoryDB.tasks[taskIndex];

    // Update task fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (category !== undefined) task.category = category;
    if (completed !== undefined) task.completed = completed;
    
    task.updatedAt = new Date();

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const taskIndex = global.inMemoryDB.tasks.findIndex(
      task => task.id === req.params.id && task.userId === req.user.id
    );

    if (taskIndex === -1) {
      return res.status(404).json({
        message: 'Task not found',
        code: 'TASK_NOT_FOUND'
      });
    }

    global.inMemoryDB.tasks.splice(taskIndex, 1);

    res.json({
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// @route   POST /api/tasks/:id/complete
// @desc    Mark task as completed
// @access  Private
router.post('/:id/complete', authenticateToken, (req, res) => {
  try {
    const taskIndex = global.inMemoryDB.tasks.findIndex(
      task => task.id === req.params.id && task.userId === req.user.id
    );

    if (taskIndex === -1) {
      return res.status(404).json({
        message: 'Task not found',
        code: 'TASK_NOT_FOUND'
      });
    }

    const task = global.inMemoryDB.tasks[taskIndex];
    task.completed = true;
    task.updatedAt = new Date();

    res.json({
      message: 'Task marked as completed',
      task
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// @route   GET /api/tasks/stats/overview
// @desc    Get task statistics
// @access  Private
router.get('/stats/overview', authenticateToken, (req, res) => {
  try {
    const userTasks = global.inMemoryDB.tasks.filter(task => task.userId === req.user.id);
    
    const stats = {
      total: userTasks.length,
      completed: userTasks.filter(task => task.completed).length,
      pending: userTasks.filter(task => !task.completed).length,
      overdue: userTasks.filter(task => 
        !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
      ).length,
      completionRate: userTasks.length > 0 
        ? Math.round((userTasks.filter(task => task.completed).length / userTasks.length) * 100)
        : 0
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

module.exports = router;