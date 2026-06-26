import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { formatValue } from '../utils/valueCalculator';
import { getImageUrl } from '../utils/imageUtils';

const SwapRequestsPage = () => {
  const [activeTab, setActiveTab] = useState('incoming');
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSwaps = async () => {
    setLoading(true);
    try {
      const incRes = await api.get('/swaps/incoming');
      const outRes = await api.get('/swaps/outgoing');
      setIncoming(incRes.data.data);
      setOutgoing(outRes.data.data);
    } catch (err) {
      toast.error('Failed to load swap requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await api.put(`/swaps/${id}/${action}`);
      const past = action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : `${action}ed`;
      toast.success(`Swap request ${past} successfully.`);
      fetchSwaps();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} swap.`);
    }
  };

  const currentList = activeTab === 'incoming' ? incoming : outgoing;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="section-pad max-w-7xl mx-auto"
    >
      <div className="mb-8 border-b border-hairline pb-6">
        <span className="font-sans text-xs tracking-widest uppercase text-champagne font-semibold">
          Barter Exchanges
        </span>
        <h2 className="font-serif text-4xl text-onyx mt-2">
          Swap Proposals
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-hairline mb-8">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`pb-4 px-6 text-xs tracking-widest uppercase font-medium border-b-2 transition-all duration-300 ${activeTab === 'incoming' ? 'border-champagne text-onyx' : 'border-transparent text-warmgrey hover:text-onyx'}`}
        >
          Incoming Proposals ({incoming.length})
        </button>
        <button
          onClick={() => setActiveTab('outgoing')}
          className={`pb-4 px-6 text-xs tracking-widest uppercase font-medium border-b-2 transition-all duration-300 ${activeTab === 'outgoing' ? 'border-champagne text-onyx' : 'border-transparent text-warmgrey hover:text-onyx'}`}
        >
          Outgoing Proposals ({outgoing.length})
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-40 skeleton border border-hairline"></div>
          ))}
        </div>
      ) : currentList.length === 0 ? (
        <div className="text-center py-20 border border-hairline bg-white/20">
          <p className="font-serif text-lg text-warmgrey italic">
            {activeTab === 'incoming' ? 'No incoming swap requests found.' : 'You have not proposed any swaps yet.'}
          </p>
          {activeTab === 'outgoing' && (
            <Link to="/listings" className="btn-primary mt-6 inline-block">Browse Marketplace</Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {currentList.map(swap => {
            const isIncoming = activeTab === 'incoming';
            const counterpart = isIncoming ? swap.fromUser : swap.toUser;
            
            // Format item images
            const offeredImg = getImageUrl(swap.offeredItem?.images?.[0]);
            const requestedImg = getImageUrl(swap.requestedItem?.images?.[0]);

            return (
              <div key={swap._id} className="border border-hairline bg-white p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                {/* Offered Item */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-20 border border-hairline overflow-hidden shrink-0 bg-ivory">
                    <img src={offeredImg} alt="offered" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[9px] font-sans uppercase tracking-widest text-champagne block">Your Offer</span>
                    <h4 className="font-serif text-base text-onyx font-medium line-clamp-1">{swap.offeredItem?.title}</h4>
                    <p className="text-xs text-warmgrey">{formatValue(swap.offeredItem?.estimatedValue)}</p>
                  </div>
                </div>

                {/* Compare Stats */}
                <div className="text-center py-2 px-4 bg-ivory/50 border border-hairline border-dashed">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-warmgrey block mb-1">Value Discrepancy</span>
                  <span className="font-serif text-lg font-medium text-onyx block">{swap.valueDifference}%</span>
                  {swap.valueDifference > 30 && (
                    <span className="text-[8px] tracking-wider uppercase text-burgundy font-semibold">Discrepancy High</span>
                  )}
                </div>

                {/* Requested Item */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-20 border border-hairline overflow-hidden shrink-0 bg-ivory">
                    <img src={requestedImg} alt="requested" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[9px] font-sans uppercase tracking-widest text-champagne block">Requested Item</span>
                    <h4 className="font-serif text-base text-onyx font-medium line-clamp-1">{swap.requestedItem?.title}</h4>
                    <p className="text-xs text-warmgrey">{formatValue(swap.requestedItem?.estimatedValue)}</p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col md:items-end justify-center space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-0 md:space-y-2 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-sans uppercase tracking-widest text-warmgrey block mb-1">Status</span>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-3 py-1 inline-block ${
                      swap.status === 'Pending' ? 'bg-champagne/10 text-champagne-dark' :
                      swap.status === 'Accepted' ? 'bg-emerald/10 text-emerald' :
                      swap.status === 'Completed' ? 'bg-emerald text-ivory' : 'bg-burgundy/10 text-burgundy'
                    }`}>
                      {swap.status}
                    </span>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    {swap.status === 'Pending' && isIncoming && (
                      <>
                        <button
                          onClick={() => handleAction(swap._id, 'accept')}
                          className="px-4 py-2 text-[10px] tracking-widest uppercase font-semibold bg-emerald text-ivory"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(swap._id, 'reject')}
                          className="px-4 py-2 text-[10px] tracking-widest uppercase font-semibold bg-burgundy text-white"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {(swap.status === 'Accepted' || swap.status === 'Negotiating' || swap.status === 'Completed') && (
                      <Link
                        to={`/chat/${swap._id}`}
                        className="px-4 py-2 text-[10px] tracking-widest uppercase font-semibold bg-onyx text-ivory text-center"
                      >
                        Enter Negotiation Chat
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default SwapRequestsPage;
