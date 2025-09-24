import { Link } from 'react-router-dom';

const CTAStrip = ({ isAuthenticated }) => {
  return (
    <section id="cta" className="py-16 reveal">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl gradient-primary text-white p-10 text-center">
          <h3 className="text-2xl md:text-3xl font-bold">Ready to reclaim your time?</h3>
          <p className="mt-2 text-primary-100">Join thousands who plan smarter and ship faster.</p>
          {!isAuthenticated && (
            <Link to="/register" className="inline-block mt-6 px-6 py-3 rounded-md bg-white text-primary-700 font-semibold hover:bg-gray-50">Start free</Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTAStrip;

