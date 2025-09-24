import { ClipboardList, Wand2, Timer, BarChart3 } from 'lucide-react';

const STEPS = [
  { icon: ClipboardList, title: 'Capture', desc: 'Add tasks or import from tools you already use.' },
  { icon: Wand2, title: 'Clarify', desc: 'AI breaks down work, estimates, and prioritizes.' },
  { icon: Timer, title: 'Schedule', desc: 'Auto-plan your day with focus-friendly time blocks.' },
  { icon: BarChart3, title: 'Reflect', desc: 'Review insights and continuously improve.' },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">From idea to done in four simple steps.</p>
        </div>

        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-white dark:bg-secondary-900 p-6 rounded-xl border border-gray-100 dark:border-secondary-700">
              <div className="p-3 w-fit rounded-lg bg-primary-100 dark:bg-secondary-800 text-primary-700">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

