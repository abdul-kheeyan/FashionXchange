import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import ItemCard from '../components/ItemCard';
import { CATEGORIES, SIZES, CONDITIONS } from '../utils/valueCalculator';
import { CITIES } from '../utils/distance';

const ListingsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('');
  const [city, setCity] = useState('');
  const [sort, setSort] = useState('newest');
  
  // Geolocation states for Nearest sorting
  const [useGeo, setUseGeo] = useState(false);
  const [userCoords, setUserCoords] = useState({ lat: null, lng: null });

  const fetchItems = async () => {
    setLoading(true);
    try {
      let url = `/listings?sort=${sort}`;
      if (category) url += `&category=${category}`;
      if (size) url += `&size=${size}`;
      if (condition) url += `&condition=${condition}`;
      if (city) url += `&city=${city}`;
      if (search) url += `&search=${search}`;
      
      if (useGeo && userCoords.lat && userCoords.lng) {
        url += `&lat=${userCoords.lat}&lng=${userCoords.lng}`;
      }

      const { data } = await api.get(url);
      setItems(data.data);
    } catch (err) {
      console.error('Error fetching listings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category, size, condition, city, sort, useGeo, userCoords]);

  const requestGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setUseGeo(true);
        },
        () => {
          alert('GPS access denied. Sorting by distance unavailable.');
        }
      );
    }
  };

  const handleReset = () => {
    setSearch('');
    setCategory('');
    setSize('');
    setCondition('');
    setCity('');
    setSort('newest');
    setUseGeo(false);
    setUserCoords({ lat: null, lng: null });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="section-pad max-w-7xl mx-auto"
    >
      <div className="mb-8 border-b border-hairline pb-6">
        <span className="font-sans text-xs tracking-widest uppercase text-champagne font-semibold">
          Curated Wardrobes
        </span>
        <h2 className="font-serif text-4xl text-onyx mt-2">
          The Marketplace
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Panel */}
        <div className="space-y-6 lg:border-r lg:border-hairline lg:pr-8">
          <div>
            <h3 className="font-serif text-lg font-medium text-onyx mb-3">Search</h3>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchItems()}
              placeholder="Zara, Blazer, Silk..."
              className="input-box"
            />
          </div>

          <div>
            <h3 className="font-serif text-lg font-medium text-onyx mb-3">Category</h3>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-box bg-transparent"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <h3 className="font-serif text-lg font-medium text-onyx mb-3">Size</h3>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="input-box bg-transparent"
            >
              <option value="">All Sizes</option>
              {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <h3 className="font-serif text-lg font-medium text-onyx mb-3">Condition</h3>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="input-box bg-transparent"
            >
              <option value="">All Conditions</option>
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <h3 className="font-serif text-lg font-medium text-onyx mb-3">Location</h3>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="input-box bg-transparent"
            >
              <option value="">All Cities</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="pt-4 flex flex-col space-y-2">
            <button
              onClick={requestGeolocation}
              className={`w-full py-3 text-xs tracking-widest uppercase font-medium border border-hairline transition-all duration-300 ${useGeo ? 'bg-emerald text-ivory border-emerald' : 'bg-transparent text-onyx hover:bg-onyx hover:text-ivory'}`}
            >
              {useGeo ? 'GPS Proximity Active' : 'Sort by Nearest (GPS)'}
            </button>
            <button
              onClick={handleReset}
              className="w-full btn-outline"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Listings Display Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-sans text-warmgrey">
              Showing {items.length} items
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs font-sans tracking-wider uppercase bg-transparent focus:outline-none cursor-pointer border-b border-hairline pb-1"
            >
              <option value="newest">Newest First</option>
              {useGeo && <option value="nearest">Nearest First</option>}
              <option value="value_high">Value: High to Low</option>
              <option value="value_low">Value: Low to High</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="flex flex-col space-y-4 animate-pulse">
                  <div className="aspect-[3/4] skeleton"></div>
                  <div className="h-4 w-2/3 skeleton"></div>
                  <div className="h-3 w-1/2 skeleton"></div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24 border border-hairline bg-white/20">
              <p className="font-serif text-xl text-warmgrey italic">No matching swap items found.</p>
              <button onClick={handleReset} className="btn-primary mt-6">Reset Search Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {items.map(item => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ListingsPage;
