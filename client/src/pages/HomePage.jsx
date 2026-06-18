import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import ItemCard from '../components/ItemCard';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/listings?limit=4');
        setFeatured(data.data);
      } catch (err) {
        console.error('Failed to load featured items', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-ivory text-onyx"
    >
      {/* Hero Section */}
      <section className="relative h-[85vh] bg-onyx flex items-center justify-center overflow-hidden">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920"
            alt="Editorial Quiet Luxury Fashion"
            className="w-full h-full object-cover scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent"></div>

        <div className="relative max-w-4xl text-center px-4 z-10 flex flex-col items-center">
          <span className="font-sans text-xs tracking-[0.3em] uppercase text-champagne mb-4 font-semibold animate-pulse">
            Introducing FASTION
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-ivory tracking-wide leading-tight mb-6">
            Swap, Don't Shop.
          </h1>
          <p className="font-sans text-sm md:text-base text-ivory/80 tracking-wide max-w-xl mb-10 leading-relaxed font-light">
            Step into the luxury barter economy. Exchange exquisite pieces from your wardrobe with fashion connoisseurs near you. Zero cost. Infinite style.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/listings" className="btn-gold">
              Explore Wardrobes
            </Link>
            <Link to="/register" className="btn-outline border-ivory text-ivory hover:bg-ivory hover:text-onyx">
              Curate Your Own
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Ethos / How It Works */}
      <section className="section-pad max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-hairline">
        <div className="text-center px-4">
          <h3 className="font-serif text-2xl font-medium text-onyx mb-3">
            01. Curate
          </h3>
          <p className="font-sans text-sm text-warmgrey leading-relaxed">
            List garments of fine condition from your collection. Describe their history, brand, size, and let our calculator value them fairly.
          </p>
        </div>
        <div className="text-center px-4">
          <h3 className="font-serif text-2xl font-medium text-onyx mb-3">
            02. Discover & Propose
          </h3>
          <p className="font-sans text-sm text-warmgrey leading-relaxed">
            Browse premium clothing collections filtered by style, brand, and geographical proximity. Propose a direct barter of your items.
          </p>
        </div>
        <div className="text-center px-4">
          <h3 className="font-serif text-2xl font-medium text-onyx mb-3">
            03. Exchange Sustained
          </h3>
          <p className="font-sans text-sm text-warmgrey leading-relaxed">
            Converse via secure chat rooms, coordinate the swap location, and finalise the exchange. No transactions, purely shared elegance.
          </p>
        </div>
      </section>

      {/* Featured Items Grid */}
      <section className="section-pad max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-12">
          <div>
            <span className="font-sans text-xs tracking-widest uppercase text-champagne font-semibold">
              The Curated List
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-onyx mt-2">
              Featured Swaps
            </h2>
          </div>
          <Link to="/listings" className="text-xs font-sans tracking-wider uppercase text-onyx border-b border-onyx pb-1 hover:text-champagne hover:border-champagne transition-all mt-4 sm:mt-0 shrink-0">
            View All Wardrobes &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="flex flex-col space-y-4">
                <div className="aspect-[3/4] skeleton border border-hairline"></div>
                <div className="h-4 w-2/3 skeleton"></div>
                <div className="h-3 w-1/2 skeleton"></div>
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20 border border-hairline bg-white/30">
            <p className="font-serif text-lg text-warmgrey italic">No listings available at this moment. Be the first to list!</p>
            <Link to="/listings/new" className="btn-primary mt-6">List Item</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {featured.map(item => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Sustainability Section */}
      <section className="bg-onyx text-ivory section-pad py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <span className="font-sans text-xs tracking-[0.2em] uppercase text-champagne mb-4 font-semibold">
            FASTION impact
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-8 max-w-2xl leading-tight">
            Embodying Sustainability in Quiet Elegance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full mt-8">
            <div className="p-6 border border-hairline/20">
              <span className="font-serif text-4xl md:text-5xl text-champagne font-light block mb-2">
                15K+ Litres
              </span>
              <span className="font-sans text-xs uppercase tracking-widest text-warmgrey font-semibold">
                Water Conserved
              </span>
            </div>
            <div className="p-6 border border-hairline/20">
              <span className="font-serif text-4xl md:text-5xl text-champagne font-light block mb-2">
                98%
              </span>
              <span className="font-sans text-xs uppercase tracking-widest text-warmgrey font-semibold">
                Barter Efficiency
              </span>
            </div>
            <div className="p-6 border border-hairline/20">
              <span className="font-serif text-4xl md:text-5xl text-champagne font-light block mb-2">
                500+ kg
              </span>
              <span className="font-sans text-xs uppercase tracking-widest text-warmgrey font-semibold">
                Textiles Diverted
              </span>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
