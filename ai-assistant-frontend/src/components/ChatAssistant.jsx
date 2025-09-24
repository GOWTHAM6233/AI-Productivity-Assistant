import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { aiAPI } from '../api/api';
import Button from './common/Button';

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI productivity assistant. I can help you with task management, productivity tips, and answer questions about your workflow. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { text: "Help me prioritize my tasks", action: "prioritize" },
    { text: "Give me productivity tips", action: "tips" },
    { text: "Analyze my task patterns", action: "analyze" },
    { text: "Suggest time management strategies", action: "time" }
  ];

  const handleQuickAction = (action) => {
    let message = '';
    switch (action) {
      case 'prioritize':
        message = "I'd be happy to help you prioritize your tasks! Could you tell me about your current tasks and their deadlines? I can suggest an optimal order based on urgency and importance.";
        break;
      case 'tips':
        message = "Here are some productivity tips:\n\n• Use the 2-minute rule: if a task takes less than 2 minutes, do it now\n• Time-block your calendar for focused work\n• Take regular breaks using the Pomodoro Technique\n• Review and plan your day the night before\n• Eliminate distractions by turning off notifications";
        break;
      case 'analyze':
        message = "To analyze your task patterns, I'd need to look at your task history. Based on what I can see, you might want to consider:\n\n• Your most productive times of day\n• Task categories that take longer than expected\n• Patterns in missed deadlines\n• Opportunities for batching similar tasks";
        break;
      case 'time':
        message = "Here are some effective time management strategies:\n\n• Use the Eisenhower Matrix to categorize tasks\n• Implement the Getting Things Done (GTD) method\n• Try the 1-3-5 rule: 1 big task, 3 medium tasks, 5 small tasks per day\n• Use time tracking to identify time sinks\n• Set specific, measurable goals with deadlines";
        break;
      default:
        message = "I'm here to help! Feel free to ask me anything about productivity, task management, or time organization.";
    }
    
    addMessage('bot', message);
  };

  const addMessage = (type, content) => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      const response = await aiAPI.chat(userMessage);
      addMessage('bot', response.data.response);
    } catch (error) {
      console.error('AI chat error:', error);
      addMessage('bot', "I'm sorry, I'm having trouble processing your request right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="h-[600px] flex flex-col bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-sm text-gray-500">Online • Ready to help</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-primary-600 ml-2' 
                  : 'bg-gray-200 mr-2'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-gray-600" />
                )}
              </div>
              <div className={`px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-xs lg:max-w-md">
              <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
                <Bot className="h-4 w-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="p-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.action)}
                className="text-xs"
              >
                {action.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about productivity..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            size="md"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;
