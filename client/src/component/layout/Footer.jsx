import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-white border-t border-gray-200 py-6 sm:py-8">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 sm:mb-6 text-xs sm:text-sm">
        <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8">
          <Link to="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</Link>
        </div>
        <div className="flex space-x-3 sm:space-x-4">
          <a href="tel:+9779876523104" aria-label="Call New Purnagiri Automobiles" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors text-xs sm:text-sm">
            P
          </a>
          <a href="mailto:info@newpurnagiri.com" aria-label="Email New Purnagiri Automobiles" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors text-xs sm:text-sm">
            E
          </a>
          <Link to="/contact" aria-label="Open contact page" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors text-xs sm:text-sm">
            C
          </Link>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs">
        Copyright 2026 New Purnagiri Automobiles. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
