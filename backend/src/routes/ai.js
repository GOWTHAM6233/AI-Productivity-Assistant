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

// @route   POST /api/ai/chat
// @desc    Chat with AI assistant
// @access  Private
router.post('/chat', authenticateToken, (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: 'Message is required',
        code: 'MISSING_MESSAGE'
      });
    }

    // Store the interaction
    const interaction = {
      id: Date.now().toString(),
      userId: req.user.id,
      userMessage: message,
      aiResponse: generateAIResponse(message),
      timestamp: new Date()
    };

    global.inMemoryDB.aiInteractions.push(interaction);

    res.json({
      message: 'AI response generated',
      response: interaction.aiResponse,
      interactionId: interaction.id
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// @route   POST /api/ai/suggestions
// @desc    Get AI task suggestions
// @access  Private
router.post('/suggestions', authenticateToken, (req, res) => {
  try {
    const userTasks = global.inMemoryDB.tasks.filter(task => task.userId === req.user.id);
    
    const suggestions = generateTaskSuggestions(userTasks);

    res.json({
      message: 'Task suggestions generated',
      suggestions
    });
  } catch (error) {
    console.error('AI suggestions error:', error);
    res.status(500).json({
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// @route   POST /api/ai/insights
// @desc    Get productivity insights
// @access  Private
router.post('/insights', authenticateToken, (req, res) => {
  try {
    const userTasks = global.inMemoryDB.tasks.filter(task => task.userId === req.user.id);
    const insights = generateProductivityInsights(userTasks);

    res.json({
      message: 'Productivity insights generated',
      insights
    });
  } catch (error) {
    console.error('AI insights error:', error);
    res.status(500).json({
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// @route   GET /api/ai/history
// @desc    Get AI interaction history
// @access  Private
router.get('/history', authenticateToken, (req, res) => {
  try {
    const userInteractions = global.inMemoryDB.aiInteractions
      .filter(interaction => interaction.userId === req.user.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      interactions: userInteractions,
      total: userInteractions.length
    });
  } catch (error) {
    console.error('Get AI history error:', error);
    res.status(500).json({
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// Helper function to generate AI responses
function generateAIResponse(message) {
  const responses = [
    "That's a great question! Let me help you with that. Based on your current tasks, I'd recommend focusing on high-priority items first.",
    "I understand you're looking for productivity advice. Here are some strategies that might work well for your situation...",
    "Based on what you've shared, I can suggest a few approaches to improve your workflow and task management.",
    "That's an interesting challenge! Let me break down some solutions that could help you be more productive.",
    "I'd be happy to help you optimize your productivity. Here are some insights and recommendations...",
    "Great question! Here are some productivity tips that might help:\n\n• Use the 2-minute rule: if a task takes less than 2 minutes, do it now\n• Time-block your calendar for focused work\n• Take regular breaks using the Pomodoro Technique",
    "Based on your current workload, I'd suggest:\n\n• Prioritizing tasks by urgency and importance\n• Breaking large tasks into smaller, manageable chunks\n• Setting specific deadlines for each task\n• Reviewing your progress daily"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// Helper function to generate task suggestions
function generateTaskSuggestions(tasks) {
  const suggestions = [];
  
  if (tasks.length === 0) {
    suggestions.push({
      type: 'getting_started',
      title: 'Create your first task',
      description: 'Start by adding a task to get organized and boost your productivity.',
      priority: 'high'
    });
  } else {
    const pendingTasks = tasks.filter(task => !task.completed);
    const overdueTasks = pendingTasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date()
    );
    
    if (overdueTasks.length > 0) {
      suggestions.push({
        type: 'overdue',
        title: 'Address overdue tasks',
        description: `You have ${overdueTasks.length} overdue task(s). Consider updating deadlines or completing them soon.`,
        priority: 'high'
      });
    }
    
    if (pendingTasks.length > 5) {
      suggestions.push({
        type: 'too_many_tasks',
        title: 'Consider task prioritization',
        description: 'You have many pending tasks. Try using the Eisenhower Matrix to prioritize effectively.',
        priority: 'medium'
      });
    }
    
    suggestions.push({
      type: 'break_large_tasks',
      title: 'Break down large tasks',
      description: 'If you have any large, complex tasks, consider breaking them into smaller, actionable steps.',
      priority: 'low'
    });
  }
  
  return suggestions;
}

// Helper function to generate productivity insights
function generateProductivityInsights(tasks) {
  const insights = [];
  
  if (tasks.length === 0) {
    return [{
      type: 'no_data',
      title: 'No tasks yet',
      description: 'Start adding tasks to get personalized productivity insights.',
      recommendation: 'Create your first task to begin tracking your productivity patterns.'
    }];
  }
  
  const completedTasks = tasks.filter(task => task.completed);
  const completionRate = Math.round((completedTasks.length / tasks.length) * 100);
  
  insights.push({
    type: 'completion_rate',
    title: 'Task Completion Rate',
    description: `You've completed ${completionRate}% of your tasks.`,
    recommendation: completionRate > 70 
      ? 'Great job! You\'re maintaining a high completion rate.'
      : 'Consider focusing on fewer tasks or breaking them into smaller steps.'
  });
  
  const highPriorityTasks = tasks.filter(task => task.priority === 'high');
  const completedHighPriority = highPriorityTasks.filter(task => task.completed);
  
  if (highPriorityTasks.length > 0) {
    insights.push({
      type: 'priority_focus',
      title: 'High Priority Focus',
      description: `You have ${highPriorityTasks.length} high-priority tasks, with ${completedHighPriority.length} completed.`,
      recommendation: 'Focus on completing high-priority tasks first to maximize impact.'
    });
  }
  
  const categories = [...new Set(tasks.map(task => task.category))];
  if (categories.length > 1) {
    insights.push({
      type: 'category_balance',
      title: 'Task Categories',
      description: `Your tasks span ${categories.length} different categories: ${categories.join(', ')}.`,
      recommendation: 'Consider batching similar tasks together for better focus and efficiency.'
    });
  }
  
  return insights;
}

module.exports = router;