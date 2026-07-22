const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const ClothingItem = require('./models/ClothingItem');
const SwapRequest = require('./models/SwapRequest');
const Message = require('./models/Message');

const usersData = [
  {
    name: 'Aarav Mehta',
    email: 'aarav@fastion.com',
    passwordHash: 'aarav123',
    phone: '+91 98123 45678',
    location: { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isAdmin: true,
  },
  {
    name: 'Diya Sharma',
    email: 'diya@fastion.com',
    passwordHash: 'diya123',
    phone: '+91 98234 56789',
    location: { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    isAdmin: false,
  },
  {
    name: 'Kabir Kapoor',
    email: 'kabir@fastion.com',
    passwordHash: 'kabir123',
    phone: '+91 98345 67890',
    location: { city: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    isAdmin: false,
  },
  {
    name: 'Ananya Rao',
    email: 'ananya@fastion.com',
    passwordHash: 'ananya123',
    phone: '+91 98456 78901',
    location: { city: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    isAdmin: false,
  },
];

const itemsData = [
  {
    title: 'Zara Tailored Linen Blazer',
    description: 'An exquisite unstructured linen blazer. Breathable weaving, ideal for smart summer luxury styling.',
    category: 'Outerwear',
    brand: 'Zara',
    size: 'M',
    condition: 'Like New',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600'],
    estimatedValue: 1200 * 1.5 * 0.82, // Base * Brand Mult * Cond Mult
    status: 'Available',
    location: { city: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  },
  {
    title: "Levi's 501 Original Selvedge Jeans",
    description: 'The iconic denim piece in dark indigo selvedge wash. Kept in pristine condition, single-owner.',
    category: 'Bottoms',
    brand: "Levi's",
    size: '32',
    condition: 'Good',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600'],
    estimatedValue: 600 * 1.5 * 0.60,
    status: 'Available',
    location: { city: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  },
  {
    title: 'Nike Air Force 1 Premium',
    description: 'Triple white premium leather sneaker. Cleaned thoroughly and comes without wear wrinkles.',
    category: 'Footwear',
    brand: 'Nike',
    size: '9',
    condition: 'Like New',
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600'],
    estimatedValue: 1000 * 1.6 * 0.82,
    status: 'Available',
    location: { city: 'Pune', lat: 18.5204, lng: 73.8567 },
  },
  {
    title: 'Uniqlo Cashmere V-Neck Sweater',
    description: '100% fine Mongolian cashmere sweater in muted charcoal grey. Unmatched warmth and texture.',
    category: 'Outerwear',
    brand: 'Uniqlo',
    size: 'L',
    condition: 'New',
    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600'],
    estimatedValue: 1200 * 1.3 * 1.00,
    status: 'Available',
    location: { city: 'Delhi', lat: 28.6139, lng: 77.2090 },
  },
  {
    title: 'H&M Premium Linen Shirt',
    description: 'Sand beige premium linen shirt with grandad collar. Excellent drape properties.',
    category: 'Tops',
    brand: 'H&M',
    size: 'S',
    condition: 'Good',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600'],
    estimatedValue: 400 * 1.2 * 0.60,
    status: 'Available',
    location: { city: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🧹 Clearing existing collections...');
    
    await User.deleteMany();
    await ClothingItem.deleteMany();
    await SwapRequest.deleteMany();
    await Message.deleteMany();

    console.log('🌱 Creating user accounts...');
    const createdUsers = [];
    for (const u of usersData) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    console.log('🌱 Populating clothing items...');
    // Distribute items among created users
    const items = [];
    for (let i = 0; i < itemsData.length; i++) {
      const owner = createdUsers[i % createdUsers.length];
      const item = await ClothingItem.create({
        ...itemsData[i],
        owner: owner._id,
      });
      items.push(item);
    }

    console.log('🌱 Creating swap requests...');
    // Aarav wants Uniqlo sweater (owned by Kabir)
    const offered = items[0]; // Aarav's Zara blazer
    const requested = items[3]; // Kabir's Uniqlo Cashmere
    
    // Set status to Pending
    offered.status = 'Pending';
    await offered.save();

    const swap = await SwapRequest.create({
      fromUser: offered.owner,
      toUser: requested.owner,
      offeredItem: offered._id,
      requestedItem: requested._id,
      status: 'Pending',
      valueDifference: Math.round(
        (Math.abs(offered.estimatedValue - requested.estimatedValue) / Math.max(offered.estimatedValue, requested.estimatedValue)) * 100
      ),
      message: 'Hi Kabir, I would love to trade my linen blazer for your cashmere sweater. Let me know if you like this trade!',
    });

    console.log('🌱 Writing swap negotiation messages...');
    await Message.create({
      swapRequest: swap._id,
      sender: offered.owner,
      content: 'Hi Kabir! The blazer is practically new and sits beautifully. Let me know if you would like to swap!',
    });

    console.log('SUCCESS: Seed Database curation successfully completed!');
    process.exit(0);
  } catch (err) {
    console.error('ERROR: Curation failed:', err);
    process.exit(1);
  }
};

seedDB();
