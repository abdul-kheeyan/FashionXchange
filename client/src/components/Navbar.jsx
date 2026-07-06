import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUtils';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-hairline bg-onyx text-ivory px-4 py-4 md:px-8 lg:px-16 transition-all duration-300">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand Logo */}
        <Link to="/" className="font-serif text-2xl tracking-widest font-semibold hover:text-champagne transition-colors">
          FashionXchange
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-xs tracking-widest uppercase font-medium">
          <Link to="/listings" className="hover:text-champagne transition-colors">
            Marketplace
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/listings/new" className="hover:text-champagne transition-colors">
                List Item
              </Link>
              <Link to="/swaps" className="hover:text-champagne transition-colors">
                My Swaps
              </Link>
              <Link to="/dashboard" className="hover:text-champagne transition-colors">
                Dashboard
              </Link>
              {user?.isAdmin && (
                <Link to="/admin" className="text-champagne hover:text-champagne-light transition-colors">
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        {/* Right Section: Auth Action */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline text-xs tracking-wider text-warmgrey">
                {user.name}
              </span>
              {user.profileImage && (
                <img
                  src={getImageUrl(user.profileImage)}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-champagne"
                />
              )}
              <button
                onClick={handleLogout}
                className="text-xs tracking-widest uppercase font-medium border border-hairline px-4 py-2 hover:bg-champagne hover:text-onyx transition-all duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link
                to="/login"
                className="text-xs tracking-widest uppercase font-medium border border-hairline px-4 py-2 hover:bg-champagne hover:text-onyx transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-xs tracking-widest uppercase font-medium bg-champagne text-onyx px-4 py-2 hover:bg-champagne-dark hover:text-ivory transition-all duration-300"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
