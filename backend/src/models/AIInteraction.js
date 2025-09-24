const mongoose = require('mongoose');

const aiInteractionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['chat', 'task_suggestion', 'productivity_insight', 'reminder', 'motivation'],
    required: true
  },
  userMessage: {
    type: String,
    required: function() {
      return this.type === 'chat';
    },
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  aiResponse: {
    type: String,
    required: true,
    trim: true,
    maxlength: [5000, 'AI response cannot exceed 5000 characters']
  },
  context: {
    currentTasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }],
    userPreferences: {
      personality: String,
      responseLength: String
    },
    conversationHistory: [{
      role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
      },
      content: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  },
  metadata: {
    model: {
      type: String,
      default: 'gpt-3.5-turbo'
    },
    tokensUsed: {
      type: Number,
      default: 0
    },
    processingTime: {
      type: Number, // in milliseconds
      default: 0
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8
    }
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    helpful: {
      type: Boolean
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    reported: {
      type: Boolean,
      default: false
    },
    reportReason: {
      type: String,
      enum: ['inappropriate', 'incorrect', 'unhelpful', 'other']
    }
  },
  suggestions: [{
    type: {
      type: String,
      enum: ['task', 'habit', 'reminder', 'break', 'focus_session'],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Suggestion title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Suggestion description cannot exceed 500 characters']
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    accepted: {
      type: Boolean,
      default: false
    },
    acceptedAt: Date,
    implemented: {
      type: Boolean,
      default: false
    },
    implementedAt: Date
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
aiInteractionSchema.index({ user: 1, createdAt: -1 });
aiInteractionSchema.index({ sessionId: 1 });
aiInteractionSchema.index({ type: 1 });
aiInteractionSchema.index({ 'feedback.rating': 1 });
aiInteractionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to add conversation message
aiInteractionSchema.methods.addMessage = function(role, content) {
  this.context.conversationHistory.push({
    role,
    content,
    timestamp: new Date()
  });
  return this.save();
};

// Method to accept suggestion
aiInteractionSchema.methods.acceptSuggestion = function(suggestionId) {
  const suggestion = this.suggestions.id(suggestionId);
  if (suggestion) {
    suggestion.accepted = true;
    suggestion.acceptedAt = new Date();
  }
  return this.save();
};

// Method to implement suggestion
aiInteractionSchema.methods.implementSuggestion = function(suggestionId) {
  const suggestion = this.suggestions.id(suggestionId);
  if (suggestion) {
    suggestion.implemented = true;
    suggestion.implementedAt = new Date();
  }
  return this.save();
};

// Method to add feedback
aiInteractionSchema.methods.addFeedback = function(rating, helpful, comment) {
  this.feedback = {
    rating,
    helpful,
    comment
  };
  return this.save();
};

// Static method to get user's AI interaction statistics
aiInteractionSchema.statics.getUserStats = async function(userId, period = '30d') {
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
        totalInteractions: { $sum: 1 },
        avgRating: { $avg: '$feedback.rating' },
        helpfulResponses: {
          $sum: { $cond: [{ $eq: ['$feedback.helpful', true] }, 1, 0] }
        },
        suggestionsAccepted: {
          $sum: {
            $size: {
              $filter: {
                input: '$suggestions',
                cond: { $eq: ['$$this.accepted', true] }
              }
            }
          }
        },
        suggestionsImplemented: {
          $sum: {
            $size: {
              $filter: {
                input: '$suggestions',
                cond: { $eq: ['$$this.implemented', true] }
              }
            }
          }
        },
        interactionsByType: {
          $push: {
            type: '$type',
            rating: '$feedback.rating'
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalInteractions: 0,
    avgRating: 0,
    helpfulResponses: 0,
    suggestionsAccepted: 0,
    suggestionsImplemented: 0,
    interactionsByType: []
  };
};

module.exports = mongoose.model('AIInteraction', aiInteractionSchema);
