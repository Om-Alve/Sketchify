import { Link } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import DiagramGenerator from '../components/DiagramGenerator';

const DrawPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="font-hand text-xl text-gray-900 dark:text-white">Sketchify</h1>
          <a
            href="https://github.com/Om-Alve/Sketchify"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 hover:from-gray-900 hover:to-black dark:hover:from-gray-600 dark:hover:to-gray-700 text-white px-4 py-2 rounded-full transition-all duration-300"
          >
            <Star className="w-4 h-4 transition-transform group-hover:scale-110" />
          </a>
        </div>
      </nav>
      <DiagramGenerator />
    </div>
  );
};

export default DrawPage;
