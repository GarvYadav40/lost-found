import { Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Search, PlusCircle, User, LogIn, ClipboardList } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-indigo-600 font-bold text-xl tracking-tight">
              <ClipboardList className="h-6 w-6" />
              <span>TraceBack</span>
            </Link>
          </div>

          {/* Nav Links & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/"
              className="hidden sm:inline text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Browse
            </Link>

            <SignedIn>
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-indigo-600 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Dash</span>
              </Link>
              <Link
                to="/profile"
                className="text-gray-600 hover:text-indigo-600 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button
                onClick={() => navigate('/create')}
                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Report Item</span>
                <span className="sm:hidden">Report</span>
              </button>
              <div className="pl-2 border-l border-gray-150">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <SignedOut>
              <Link
                to="/login"
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                Get Started
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
