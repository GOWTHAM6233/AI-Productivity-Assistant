import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-secondary-900 border-t border-gray-100 dark:border-secondary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">AI</div>
              <span className="font-semibold">Productivity Assistant</span>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">Focus on what matters. Let AI handle the rest.</p>
          </div>
          <div>
            <h4 className="font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#hero" className="hover:underline">About</a></li>
              <li><a href="#how-it-works" className="hover:underline">Careers</a></li>
              <li><a href="#newsletter" className="hover:underline">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#faq" className="hover:underline">Privacy</a></li>
              <li><a href="#faq" className="hover:underline">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Follow</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:underline">Twitter</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 text-xs text-gray-500">© {new Date().getFullYear()} AI Productivity Assistant</div>
      </div>
    </footer>
  );
};

export default Footer;

