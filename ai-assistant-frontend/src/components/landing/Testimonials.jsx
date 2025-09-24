const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Product Manager', quote: 'My team finally ships on time. The AI breakdowns are uncanny.', avatar: 'https://i.pravatar.cc/100?img=5' },
  { name: 'David Chen', role: 'Founder, Indie SaaS', quote: 'From chaos to clarity. Calendar sync + focus blocks = magic.', avatar: 'https://i.pravatar.cc/100?img=12' },
  { name: 'Amelia Lopez', role: 'Engineer', quote: 'Daily planning feels effortless. I just follow the plan.', avatar: 'https://i.pravatar.cc/100?img=32' },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">Loved by doers</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Real teams, real results.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white dark:bg-secondary-900 p-6 rounded-xl border border-gray-100 dark:border-secondary-700">
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t.role}</div>
                </div>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-200">“{t.quote}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

