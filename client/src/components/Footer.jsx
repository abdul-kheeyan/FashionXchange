import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-onyx text-ivory border-t border-hairline py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Information */}
        <div className="md:col-span-2">
          <Link to="/" className="font-serif text-3xl tracking-widest font-semibold hover:text-champagne transition-colors">
           FashionXchange
          </Link>
          <p className="text-warmgrey text-sm mt-4 max-w-sm">
            A sustainable quiet luxury fashion marketplace. Redefining fashion ownership through collaborative consumption. Swap, don't shop.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-sans text-xs tracking-widest uppercase font-medium text-champagne mb-4">
            Navigation
          </h4>
          <ul className="space-y-2 text-sm text-warmgrey">
            <li>
              <Link to="/listings" className="hover:text-ivory transition-colors">Marketplace</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-ivory transition-colors">Sign In</Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-ivory transition-colors">Sign Up</Link>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className="font-sans text-xs tracking-widest uppercase font-medium text-champagne mb-4">
            Legal
          </h4>
          <ul className="space-y-2 text-sm text-warmgrey">
            <li>
              <a href="#" className="hover:text-ivory transition-colors">Terms of Service</a>
            </li>
            <li>
              <a href="#" className="hover:text-ivory transition-colors">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="hover:text-ivory transition-colors">Disputes</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto divider-hairline my-8 opacity-25"></div>

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-warmgrey">
        <p>© {new Date().getFullYear()} FASTION. All Rights Reserved.</p>
        <p className="mt-2 sm:mt-0">Curated with Quiet Luxury & Sustainability in Mind.</p>
      </div>
    </footer>
  );
};

export default Footer;
