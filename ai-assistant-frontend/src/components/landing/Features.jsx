import { CheckSquare, Calendar, BarChart3, MessageSquare, Sparkles, Shield } from 'lucide-react';

const FEATURES = [
  { icon: CheckSquare, title: 'Smart Tasks', description: 'AI-powered task drafting, prioritization, and deduplication.' },
  { icon: Calendar, title: 'Adaptive Scheduling', description: 'Auto-schedule with focus blocks and buffer times.' },
  { icon: BarChart3, title: 'Deep Insights', description: 'Understand trends and bottlenecks with actionable analytics.' },
  { icon: MessageSquare, title: 'AI Assistant', description: 'Ask anything: planning, estimates, breakdowns, and more.' },
  { icon: Sparkles, title: 'Automations', description: 'Zapier-like rules to move work forward while you sleep.' },
  { icon: Shield, title: 'Privacy First', description: 'Your data stays secure with role-based access and encryption.' },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-secondary-800 reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Everything you need to be productive</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">A unified workspace to plan, execute, and reflect—powered by assistive intelligence.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="group bg-white dark:bg-secondary-900 p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-secondary-700">
              <div className="p-3 w-fit rounded-lg bg-primary-100 dark:bg-secondary-800 text-primary-700">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

