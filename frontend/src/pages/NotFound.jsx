import { Link } from 'react-router-dom';
import { Home, HelpCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-indigo-50 p-4 rounded-full mb-6">
        <HelpCircle className="h-12 w-12 text-indigo-600 stroke-[1.5]" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-3">
        404 - Page Not Found
      </h1>
      <p className="text-base text-gray-500 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all"
      >
        <Home className="h-4 w-4" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
