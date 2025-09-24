const express = require('express');
const router = express.Router();

// Minimal content to serve landing page data
router.get('/content', (req, res) => {
  res.json({
    hero: {
      title: 'Supercharge your productivity with AI',
      subtitle: 'Plan, prioritize, and execute with confidence.',
      ctaPrimary: 'Get Started Free',
      ctaSecondary: 'Sign In'
    },
    features: [
      { title: 'Smart Tasks', description: 'AI-powered task drafting and prioritization.' },
      { title: 'Adaptive Scheduling', description: 'Auto-schedule focus blocks and buffers.' },
      { title: 'Deep Insights', description: 'Trends and bottleneck analytics.' },
      { title: 'AI Assistant', description: 'Ask for plans, breakdowns, and estimates.' }
    ],
    pricing: [
      { name: 'Free', price: '$0' },
      { name: 'Pro', price: '$12' },
      { name: 'Enterprise', price: 'Custom' }
    ]
  });
});

module.exports = router;

