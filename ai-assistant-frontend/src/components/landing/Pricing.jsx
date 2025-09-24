const PLANS = [
  { name: 'Free', price: '$0', period: '/mo', desc: 'For individuals getting started', features: ['Basic tasks', 'Limited AI prompts', '1 project'] },
  { name: 'Pro', price: '$12', period: '/mo', highlighted: true, desc: 'For busy professionals', features: ['Unlimited projects', 'Full AI assistant', 'Calendar sync', 'Export & integrations'] },
  { name: 'Enterprise', price: 'Custom', period: '', desc: 'For teams at scale', features: ['SSO/SAML', 'Admin controls', 'Audit logs', 'Priority support'] }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-secondary-800 reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Start free. Upgrade when you need more power.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <div key={i} className={`relative rounded-2xl border p-6 bg-white dark:bg-secondary-900 ${plan.highlighted ? 'border-primary-600 shadow-md' : 'border-gray-100 dark:border-secondary-700'}`}>
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold bg-primary-600 text-white px-2 py-1 rounded">Most Popular</span>
              )}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-gray-600 dark:text-gray-300">{plan.period}</span>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{plan.desc}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`mt-6 w-full px-4 py-2 rounded-md font-medium ${plan.highlighted ? 'bg-primary-600 text-white hover:bg-primary-700' : 'border border-gray-200 dark:border-secondary-700 hover:bg-gray-50 dark:hover:bg-secondary-800'}`}>Choose {plan.name}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

