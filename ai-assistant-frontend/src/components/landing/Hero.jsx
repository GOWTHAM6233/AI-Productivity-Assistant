import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import heroImg from '../../assets/react.svg';

const Hero = ({ isAuthenticated }) => {
  return (
    <section id="hero" className="relative overflow-hidden reveal scroll-mt-24">
      <div className="absolute inset-0 -z-10 opacity-20 dark:opacity-30">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-300 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary-500 blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Supercharge your productivity with
              <span className="text-primary-600"> AI</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
              Plan, prioritize, and execute with confidence. An intelligent assistant that helps you focus, automate, and achieve more every day.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 md:justify-start justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard" className="inline-flex items-center px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="inline-flex items-center px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link to="/login" className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-600 text-lg font-semibold rounded-lg hover:bg-primary-50 dark:hover:bg-secondary-800">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <img src={heroImg} alt="App illustration" className="w-3/4 md:w-full max-w-sm drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

