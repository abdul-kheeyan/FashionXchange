import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatValue } from '../utils/valueCalculator';
import ItemCard from '../components/ItemCard';
import { getImageUrl, revokeObjectUrl } from '../utils/imageUtils';

const ItemDetailPage = () => {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offeredItemId, setOfferedItemId] = useState('');
  const [userInventory, setUserInventory] = useState([]);
  const [swapModal, setSwapModal] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/listings/${id}`);
        setItem(data.data);
        setActiveImage(data.data.images[0]);

        // Load similar items in the category
        const simRes = await api.get(`/listings?category=${data.data.category}&limit=5`);
        setSimilar(simRes.data.data.filter(x => x._id !== id));

        // Load logged in user's inventory for swap offers
        if (isAuthenticated) {
          const invRes = await api.get(`/listings/user/${currentUser._id}`);
          setUserInventory(invRes.data.data.filter(x => x.status === 'Available'));
        }
      } catch (err) {
        toast.error('Failed to load item detail.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, isAuthenticated, currentUser?._id]);

  const handleProposeSwap = async () => {
    if (!offeredItemId) {
      toast.error('Please select an item to swap.');
      return;
    }

    try {
      const res = await api.post('/swaps', {
        offeredItemId,
        requestedItemId: item._id,
        message: swapMessage,
      });
      toast.success('Swap request successfully sent!');
      setSwapModal(false);
      navigate('/swaps');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit swap proposal.');
    }
  };

  if (loading) {
    return (
      <div className="section-pad max-w-7xl mx-auto flex justify-center items-center h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-champagne border-t-transparent"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="section-pad max-w-7xl mx-auto text-center py-24">
        <h2 className="font-serif text-3xl text-onyx mb-4">Item Not Found</h2>
        <Link to="/listings" className="btn-primary">Return to Marketplace</Link>
      </div>
    );
  }

  const isOwner = currentUser?._id === item.owner?._id;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="section-pad max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] border border-hairline overflow-hidden relative bg-white">
            <img
              src={getImageUrl(activeImage)}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          {item.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {item.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square border overflow-hidden bg-white ${activeImage === img ? 'border-champagne border-2' : 'border-hairline'}`}
                >
                  <img
                    src={getImageUrl(img)}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="flex flex-col space-y-6">
          <div>
            <span className="font-sans text-[10px] tracking-widest uppercase text-champagne font-semibold">
              {item.category} • {item.brand}
            </span>
            <h1 className="font-serif text-4xl text-onyx mt-2 font-medium">
              {item.title}
            </h1>
            <p className="font-sans text-xl text-champagne-dark font-medium mt-2">
              Value Estimate: {formatValue(item.estimatedValue)}
            </p>
          </div>

          <div className="divider-hairline"></div>

          <div>
            <h3 className="font-serif text-lg font-medium text-onyx mb-2">Item Specifications</h3>
            <table className="w-full text-sm font-sans text-warmgrey">
              <tbody>
                <tr className="border-b border-hairline/50">
                  <td className="py-2.5 font-medium uppercase text-[10px] tracking-wider text-warmgrey/60">Condition</td>
                  <td className="py-2.5 text-onyx text-right">{item.condition}</td>
                </tr>
                <tr className="border-b border-hairline/50">
                  <td className="py-2.5 font-medium uppercase text-[10px] tracking-wider text-warmgrey/60">Size</td>
                  <td className="py-2.5 text-onyx text-right">{item.size}</td>
                </tr>
                <tr className="border-b border-hairline/50">
                  <td className="py-2.5 font-medium uppercase text-[10px] tracking-wider text-warmgrey/60">Location</td>
                  <td className="py-2.5 text-onyx text-right">{item.location?.city || 'Not Specified'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="font-serif text-lg font-medium text-onyx mb-2">Description</h3>
            <p className="font-sans text-sm text-warmgrey leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Action CTA */}
          <div className="pt-4">
            {isOwner ? (
              <div className="bg-hairline/30 border border-hairline p-4 text-center">
                <p className="text-xs font-sans text-warmgrey">This is your listing.</p>
                <Link to="/dashboard" className="btn-primary mt-3 inline-block">Manage Item</Link>
              </div>
            ) : isAuthenticated ? (
              item.status === 'Available' ? (
                <button onClick={() => setSwapModal(true)} className="btn-gold w-full py-4 text-sm font-semibold">
                  Propose Swap Exchange
                </button>
              ) : (
                <div className="bg-hairline/40 p-4 border border-hairline text-center text-warmgrey uppercase text-xs tracking-wider">
                  Item Swapped / Pending
                </div>
              )
            ) : (
              <Link to="/login" className="btn-primary w-full text-center block py-4 text-sm">
                Login to Swap
              </Link>
            )}
          </div>

          {/* Owner mini-profile */}
          {item.owner && (
            <div className="border border-hairline p-4 flex items-center space-x-4 bg-white/50">
              <div className="w-12 h-12 rounded-full border border-champagne overflow-hidden shrink-0">
                <img
                  src={getImageUrl(item.owner.profileImage)}
                  alt={item.owner.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-sans uppercase tracking-widest text-warmgrey">Offered By</span>
                <h4 className="font-serif text-base text-onyx font-medium">{item.owner.name}</h4>
                <p className="text-xs text-warmgrey">{item.owner.location?.city || 'Location Unknown'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Items Section */}
      {similar.length > 0 && (
        <section className="mt-20 pt-12 border-t border-hairline">
          <h2 className="font-serif text-2xl md:text-3xl text-onyx mb-8">You May Also Appreciate</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similar.slice(0, 4).map(simItem => (
              <ItemCard key={simItem._id} item={simItem} />
            ))}
          </div>
        </section>
      )}

      {/* Swap Dialog Modal */}
      {swapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-onyx/75 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-ivory p-6 border border-hairline relative"
          >
            <h2 className="font-serif text-2xl text-onyx mb-4">Propose Fashion Swap</h2>
            
            {userInventory.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm font-sans text-warmgrey mb-4">
                  You have no available items to swap. Please list a clothing item from your dashboard first.
                </p>
                <Link to="/listings/new" className="btn-primary">List New Item</Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-2">
                    Offer From Your Collection
                  </label>
                  <select
                    value={offeredItemId}
                    onChange={(e) => setOfferedItemId(e.target.value)}
                    className="input-box bg-transparent w-full"
                  >
                    <option value="">-- Select Item to Offer --</option>
                    {userInventory.map(invItem => (
                      <option key={invItem._id} value={invItem._id}>
                        {invItem.title} ({formatValue(invItem.estimatedValue)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-2">
                    Personal Barter Message (Optional)
                  </label>
                  <textarea
                    value={swapMessage}
                    onChange={(e) => setSwapMessage(e.target.value)}
                    placeholder="Hello! I'd love to swap my coat for your blazer..."
                    className="input-box min-h-[80px]"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-hairline">
                  <button onClick={() => setSwapModal(false)} className="btn-outline">
                    Cancel
                  </button>
                  <button onClick={handleProposeSwap} className="btn-gold">
                    Send Swap Proposal
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ItemDetailPage;
