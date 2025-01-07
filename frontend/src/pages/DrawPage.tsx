import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DiagramGenerator from '../components/DiagramGenerator';

const DrawPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="font-hand text-xl text-gray-900">Sketchify</h1>
        </div>
      </nav>

      <DiagramGenerator />
    </div>
  );
};

export default DrawPage;
