import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatValue } from '../utils/valueCalculator';

const DashboardPage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [myListings, setMyListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.location?.city || '');

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const fetchMyListings = async () => {
    setLoadingListings(true);
    try {
      const { data } = await api.get(`/listings/user/${user._id}`);
      setMyListings(data.data);
    } catch (err) {
      toast.error('Failed to load your listings.');
    } finally {
      setLoadingListings(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'listings') {
      fetchMyListings();
    }
  }, [activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/users/${user._id}`, { name, phone, city });
      updateUser(data.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/change-password', { currentPassword, newPassword });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed.');
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing permanently?')) return;
    try {
      await api.delete(`/listings/${id}`);
      toast.success('Listing deleted.');
      fetchMyListings();
    } catch (err) {
      toast.error('Failed to delete listing.');
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
          Member Center
        </span>
        <h2 className="font-serif text-4xl text-onyx mt-2">
          Your Dashboard
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="flex flex-col space-y-2 lg:border-r lg:border-hairline lg:pr-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`text-left py-3 px-4 text-xs tracking-widest uppercase font-medium transition-all duration-300 ${activeTab === 'profile' ? 'bg-onyx text-ivory' : 'hover:bg-hairline/30'}`}
          >
            Update Profile
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`text-left py-3 px-4 text-xs tracking-widest uppercase font-medium transition-all duration-300 ${activeTab === 'listings' ? 'bg-onyx text-ivory' : 'hover:bg-hairline/30'}`}
          >
            My Wardrobe ({myListings.length})
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`text-left py-3 px-4 text-xs tracking-widest uppercase font-medium transition-all duration-300 ${activeTab === 'security' ? 'bg-onyx text-ivory' : 'hover:bg-hairline/30'}`}
          >
            Account Security
          </button>
        </div>

        {/* Tab display contents */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="max-w-md space-y-6">
              <h3 className="font-serif text-2xl text-onyx font-medium">Update Information</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-2">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-box" required />
                </div>
                <div>
                  <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-2">Phone</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input-box" />
                </div>
                <div>
                  <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-2">City</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)} className="input-box" required />
                </div>
                <button type="submit" className="btn-gold">Save Profile Updates</button>
              </form>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-onyx font-medium">My Wardrobe Listings</h3>
              {loadingListings ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[1, 2].map(n => <div key={n} className="h-48 skeleton"></div>)}
                </div>
              ) : myListings.length === 0 ? (
                <div className="text-center py-12 border border-hairline bg-white/20">
                  <p className="text-sm font-sans text-warmgrey">You have no published clothing items.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myListings.map(item => {
                    const imgUrl = item.images?.[0]
                      ? (item.images[0].startsWith('http') ? item.images[0] : `http://localhost:5000${item.images[0]}`)
                      : '';
                    return (
                      <div key={item._id} className="border border-hairline bg-white p-4 flex space-x-4 items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img src={imgUrl} className="w-12 h-16 object-cover border border-hairline" alt="" />
                          <div>
                            <h4 className="font-serif text-sm font-medium line-clamp-1">{item.title}</h4>
                            <p className="text-xs text-warmgrey">{formatValue(item.estimatedValue)} • {item.status}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteListing(item._id)}
                          className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold border border-burgundy text-burgundy hover:bg-burgundy hover:text-white transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-md space-y-6">
              <h3 className="font-serif text-2xl text-onyx font-medium">Change Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-2">Current Password</label>
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="input-box" required />
                </div>
                <div>
                  <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-warmgrey mb-2">New Password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input-box" required />
                </div>
                <button type="submit" className="btn-gold">Update Password</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
