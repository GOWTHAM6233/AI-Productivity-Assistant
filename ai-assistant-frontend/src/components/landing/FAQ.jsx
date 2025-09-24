import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const QUESTIONS = [
  { q: 'Is there a free plan?', a: 'Yes. You can start with the Free plan and upgrade anytime.' },
  { q: 'Do you offer student or nonprofit discounts?', a: 'Yes, contact support for special pricing.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely. Manage your subscription from your account settings.' },
  { q: 'Is my data secure?', a: 'We use industry best practices: encryption at rest and in transit.' },
];

const FAQItem = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 dark:border-secondary-700">
      <button onClick={() => setOpen(!open)} className="w-full py-4 flex items-center justify-between text-left">
        <span className="font-medium">{item.q}</span>
        <ChevronDown className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-4 text-gray-600 dark:text-gray-300">{item.a}</div>}
    </div>
  );
};

const FAQ = () => {
  return (
    <section id="faq" className="py-20 bg-gray-50 dark:bg-secondary-800 reveal">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Frequently asked questions</h2>
        </div>
        <div className="bg-white dark:bg-secondary-900 rounded-xl border border-gray-100 dark:border-secondary-700"> 
          {QUESTIONS.map((item, i) => (
            <FAQItem key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

