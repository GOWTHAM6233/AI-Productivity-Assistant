import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for submission logic
  };

  return (
    <section id="newsletter" className="py-16 reveal">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-secondary-900 rounded-2xl p-8 border border-gray-100 dark:border-secondary-700 text-center">
          <h3 className="text-2xl font-semibold">Get productivity tips in your inbox</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">No spam. Unsubscribe anytime.</p>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md border border-gray-200 dark:border-secondary-700 bg-white dark:bg-secondary-800"
            />
            <button type="submit" className="px-6 py-3 rounded-md bg-primary-600 text-white hover:bg-primary-700">Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

