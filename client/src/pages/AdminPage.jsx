import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { formatValue } from '../utils/valueCalculator';

const AdminPage = () => {
  const [activeSubTab, setActiveSubTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeSubTab === 'analytics') {
        const { data } = await api.get('/admin/analytics');
        setAnalytics(data.data);
      } else if (activeSubTab === 'users') {
        const { data } = await api.get('/admin/users');
        setUsers(data.data);
      } else if (activeSubTab === 'listings') {
        const { data } = await api.get('/admin/listings');
        setListings(data.data);
      } else if (activeSubTab === 'disputes') {
        const { data } = await api.get('/admin/disputes');
        setDisputes(data.data);
      }
    } catch (err) {
      toast.error('Failed to pull admin records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeSubTab]);

  const handleDisableUser = async (userId) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}/disable`);
      toast.success(data.message);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Delete listing immediately?')) return;
    try {
      await api.delete(`/admin/listings/${listingId}`);
      toast.success('Listing permanently removed.');
      fetchData();
    } catch (err) {
      toast.error('Failed to remove listing.');
    }
  };

  const handleResolveDispute = async (id) => {
    const notes = prompt('Enter resolution summary details:');
    if (notes === null) return;
    try {
      await api.put(`/admin/disputes/${id}/resolve`, { adminNotes: notes });
      toast.success('Dispute marked resolved.');
      fetchData();
    } catch (err) {
      toast.error('Dispute resolution update failed.');
    }
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
          Control Panel
        </span>
        <h2 className="font-serif text-4xl text-onyx mt-2">
          Administrator Command
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="flex flex-col space-y-2 lg:border-r lg:border-hairline lg:pr-8">
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`text-left py-3 px-4 text-xs tracking-widest uppercase font-medium transition-all duration-300 ${activeSubTab === 'analytics' ? 'bg-onyx text-ivory' : 'hover:bg-hairline/30'}`}
          >
            System Metrics
          </button>
          <button
            onClick={() => setActiveSubTab('users')}
            className={`text-left py-3 px-4 text-xs tracking-widest uppercase font-medium transition-all duration-300 ${activeSubTab === 'users' ? 'bg-onyx text-ivory' : 'hover:bg-hairline/30'}`}
          >
            Moderation: Users
          </button>
          <button
            onClick={() => setActiveSubTab('listings')}
            className={`text-left py-3 px-4 text-xs tracking-widest uppercase font-medium transition-all duration-300 ${activeSubTab === 'listings' ? 'bg-onyx text-ivory' : 'hover:bg-hairline/30'}`}
          >
            Moderation: Clothing
          </button>
          <button
            onClick={() => setActiveSubTab('disputes')}
            className={`text-left py-3 px-4 text-xs tracking-widest uppercase font-medium transition-all duration-300 ${activeSubTab === 'disputes' ? 'bg-onyx text-ivory' : 'hover:bg-hairline/30'}`}
          >
            Disputes Queue
          </button>
        </div>

        {/* Console Main Display Panel */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="h-40 skeleton"></div>
          ) : (
            <>
              {activeSubTab === 'analytics' && analytics && (
                <div className="space-y-8">
                  <h3 className="font-serif text-2xl text-onyx font-medium">Dashboard Analytics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="border border-hairline p-4 bg-white">
                      <span className="text-[10px] uppercase text-warmgrey">Total Users</span>
                      <p className="font-serif text-3xl font-bold text-onyx mt-2">{analytics.totalUsers}</p>
                    </div>
                    <div className="border border-hairline p-4 bg-white">
                      <span className="text-[10px] uppercase text-warmgrey">Active Items</span>
                      <p className="font-serif text-3xl font-bold text-onyx mt-2">{analytics.activeListings}</p>
                    </div>
                    <div className="border border-hairline p-4 bg-white">
                      <span className="text-[10px] uppercase text-warmgrey">Total Barters</span>
                      <p className="font-serif text-3xl font-bold text-onyx mt-2">{analytics.completedSwaps}</p>
                    </div>
                    <div className="border border-hairline p-4 bg-white">
                      <span className="text-[10px] uppercase text-warmgrey">Open Cases</span>
                      <p className="font-serif text-3xl font-bold text-onyx mt-2">{analytics.openDisputes}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSubTab === 'users' && (
                <div className="space-y-6">
                  <h3 className="font-serif text-2xl text-onyx font-medium">User Directory Moderation</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm text-warmgrey">
                      <thead>
                        <tr className="border-b border-hairline uppercase text-[10px] tracking-wider text-warmgrey/60">
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">City</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u._id} className="border-b border-hairline/50 hover:bg-white/40">
                            <td className="py-3 px-4 text-onyx font-medium">{u.name} {u.isAdmin && <span className="text-[9px] uppercase tracking-widest text-champagne-dark font-bold ml-1">Admin</span>}</td>
                            <td className="py-3 px-4">{u.email}</td>
                            <td className="py-3 px-4">{u.location?.city || 'No Specified'}</td>
                            <td className="py-3 px-4 text-right">
                              {!u.isAdmin && (
                                <button
                                  onClick={() => handleDisableUser(u._id)}
                                  className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-semibold border ${u.isDisabled ? 'border-emerald text-emerald hover:bg-emerald hover:text-white' : 'border-burgundy text-burgundy hover:bg-burgundy hover:text-white'} transition-colors`}
                                >
                                  {u.isDisabled ? 'Enable' : 'Disable'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeSubTab === 'listings' && (
                <div className="space-y-6">
                  <h3 className="font-serif text-2xl text-onyx font-medium">All Wardrobes Index</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listings.map(item => (
                      <div key={item._id} className="border border-hairline bg-white p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-serif text-sm font-semibold">{item.title}</h4>
                          <p className="text-xs text-warmgrey">{item.brand} • {item.owner?.name} ({item.owner?.email})</p>
                        </div>
                        <button
                          onClick={() => handleDeleteListing(item._id)}
                          className="px-3 py-1 text-[10px] uppercase font-medium border border-burgundy text-burgundy"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSubTab === 'disputes' && (
                <div className="space-y-6">
                  <h3 className="font-serif text-2xl text-onyx font-medium">Disputes Resolution Queue</h3>
                  {disputes.length === 0 ? (
                    <p className="text-sm italic text-warmgrey">No reported dispute flags in queues.</p>
                  ) : (
                    <div className="space-y-4">
                      {disputes.map(d => (
                        <div key={d._id} className="border border-hairline bg-white p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-serif text-base font-semibold">Reported By: {d.raisedBy?.name}</h4>
                            <span className={`text-[9px] uppercase font-semibold px-2 py-1 ${d.status === 'Resolved' ? 'bg-emerald/10 text-emerald' : 'bg-burgundy/10 text-burgundy'}`}>
                              {d.status}
                            </span>
                          </div>
                          <p className="text-xs text-warmgrey italic mb-2">"{d.reason}"</p>
                          {d.adminNotes && (
                            <p className="text-xs font-sans text-onyx bg-ivory p-2 rounded">
                              <strong className="text-[10px] uppercase tracking-wide">Resolution Note:</strong> {d.adminNotes}
                            </p>
                          )}
                          {d.status === 'Open' && (
                            <button
                              onClick={() => handleResolveDispute(d._id)}
                              className="mt-3 btn-outline py-1.5 px-4 text-[10px]"
                            >
                              Resolve Dispute Case
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPage;
