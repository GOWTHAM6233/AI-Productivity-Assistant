const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'health', 'learning', 'finance', 'other'],
    default: 'personal'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  estimatedDuration: {
    type: Number, // in minutes
    min: [1, 'Duration must be at least 1 minute'],
    max: [1440, 'Duration cannot exceed 24 hours']
  },
  actualDuration: {
    type: Number, // in minutes
    min: [0, 'Duration cannot be negative']
  },
  completedAt: {
    type: Date
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  aiSuggestion: {
    type: String,
    trim: true
  },
  subtasks: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Subtask title cannot exceed 200 characters']
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  }],
  notes: [{
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isAI: {
      type: Boolean,
      default: false
    }
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    pattern: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: function() {
        return this.recurring.isRecurring;
      }
    },
    interval: {
      type: Number,
      default: 1,
      min: 1
    },
    endDate: Date,
    nextDue: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ user: 1, category: 1 });
taskSchema.index({ user: 1, priority: 1 });

// Virtual for completion percentage
taskSchema.virtual('completionPercentage').get(function() {
  if (this.subtasks.length === 0) {
    return this.status === 'completed' ? 100 : 0;
  }
  const completedSubtasks = this.subtasks.filter(subtask => subtask.completed).length;
  return Math.round((completedSubtasks / this.subtasks.length) * 100);
});

// Method to mark task as completed
taskSchema.methods.markCompleted = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  
  // Mark all subtasks as completed
  this.subtasks.forEach(subtask => {
    if (!subtask.completed) {
      subtask.completed = true;
      subtask.completedAt = new Date();
    }
  });
  
  return this.save();
};

// Method to add subtask
taskSchema.methods.addSubtask = function(title) {
  this.subtasks.push({
    title,
    completed: false
  });
  return this.save();
};

// Method to toggle subtask completion
taskSchema.methods.toggleSubtask = function(subtaskId) {
  const subtask = this.subtasks.id(subtaskId);
  if (subtask) {
    subtask.completed = !subtask.completed;
    if (subtask.completed) {
      subtask.completedAt = new Date();
    } else {
      subtask.completedAt = undefined;
    }
  }
  return this.save();
};

// Method to add note
taskSchema.methods.addNote = function(content, isAI = false) {
  this.notes.push({
    content,
    isAI
  });
  return this.save();
};

// Static method to get user's task statistics
taskSchema.statics.getUserStats = async function(userId, period = '30d') {
  const now = new Date();
  let startDate;
  
  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  
  const stats = await this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        avgCompletionTime: {
          $avg: {
            $cond: [
              { $and: [{ $eq: ['$status', 'completed'] }, { $ne: ['$actualDuration', null] }] },
              '$actualDuration',
              null
            ]
          }
        },
        tasksByCategory: {
          $push: {
            category: '$category',
            status: '$status'
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalTasks: 0,
    completedTasks: 0,
    avgCompletionTime: 0,
    tasksByCategory: []
  };
};

module.exports = mongoose.model('Task', taskSchema);
