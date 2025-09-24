# AI Productivity Assistant Backend

A comprehensive backend API for an AI-powered productivity assistant that helps users manage tasks, get AI-powered suggestions, and track productivity insights.

## Features

- **User Authentication**: JWT-based authentication with registration, login, and profile management
- **Task Management**: Full CRUD operations for tasks with subtasks, notes, and attachments
- **AI Assistant**: Chat interface with AI for productivity advice and task suggestions
- **Productivity Insights**: Analytics and insights based on user behavior and task completion
- **Smart Suggestions**: AI-powered task recommendations based on user patterns
- **Real-time Feedback**: User feedback system for improving AI responses

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change user password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/logout` - Logout user

### Tasks
- `GET /api/tasks` - Get all tasks (with filtering and pagination)
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/complete` - Mark task as completed
- `POST /api/tasks/:id/subtasks` - Add subtask
- `PUT /api/tasks/:id/subtasks/:subtaskId` - Toggle subtask completion
- `POST /api/tasks/:id/notes` - Add note to task
- `GET /api/tasks/stats/overview` - Get task statistics

### AI Assistant
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/suggestions` - Get AI task suggestions
- `POST /api/ai/insights` - Get productivity insights
- `POST /api/ai/feedback` - Submit AI feedback
- `GET /api/ai/history` - Get AI interaction history
- `POST /api/ai/accept-suggestion` - Accept an AI suggestion

### General
- `GET /api/health` - Health check endpoint
- `GET /api` - API documentation

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ai-assistant-backend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
# Create .env file with the following variables:
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-assistant
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

4. Start the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Database Models

### User
- Personal information (name, email, password)
- Preferences (theme, notifications, AI settings)
- Productivity statistics
- Email verification status

### Task
- Task details (title, description, status, priority)
- Categorization (category, tags)
- Time management (due date, estimated/actual duration)
- Subtasks and notes
- Recurring task support
- AI-generated suggestions

### AIInteraction
- Chat sessions and conversations
- AI suggestions and recommendations
- User feedback and ratings
- Context and metadata
- Performance metrics

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## Rate Limiting

Authentication endpoints have rate limiting to prevent abuse:
- 5 attempts per 15 minutes per IP address

## Development

### Project Structure
```
├── controllers/          # Route controllers (if needed)
├── middleware/          # Custom middleware
│   └── auth.js         # Authentication middleware
├── models/             # Database models
│   ├── User.js         # User model
│   ├── Task.js         # Task model
│   └── AIInteraction.js # AI interaction model
├── routes/             # API routes
│   ├── auth.js         # Authentication routes
│   ├── tasks.js        # Task management routes
│   └── ai.js           # AI assistant routes
├── utils/              # Utility functions
│   ├── errorHandler.js # Error handling utilities
│   └── validation.js   # Input validation
├── index.js            # Main server file
└── package.json        # Dependencies and scripts
```

### Adding New Features

1. Create new routes in the `routes/` directory
2. Add corresponding models in the `models/` directory
3. Update the main `index.js` to include new routes
4. Add validation rules in `utils/validation.js`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue in the repository.
