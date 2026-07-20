require('dotenv').config();
const express   = require('express');
const mongoose = require('mongoose');
const http      = require('http');
const { Server } = require('socket.io');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan    = require('morgan');
const path      = require('path');
const fs        = require('fs');

const connectDB      = require('./config/db');
const errorHandler   = require('./middleware/errorHandler');
const Message        = require('./models/Message');
const SwapRequest    = require('./models/SwapRequest');

// Route imports
const authRoutes     = require('./routes/auth');
const listingRoutes  = require('./routes/listings');
const swapRoutes     = require('./routes/swaps');
const chatRoutes     = require('./routes/chat');
const userRoutes     = require('./routes/users');
const adminRoutes    = require('./routes/admin');

// Connect to MongoDB
connectDB();

const app    = express();
const server = http.createServer(app);

// ============================================
// Socket.io Setup
// ============================================
const io = new Server(server, {
  cors: {
    origin:  process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`[SOCKET] Connected: ${socket.id}`);

  // Join a swap room
  socket.on('joinRoom', (swapId) => {
    socket.join(swapId);
    console.log(`Socket ${socket.id} joined room: ${swapId}`);
  });

  // Send and broadcast message
  socket.on('sendMessage', async ({ swapId, senderId, content }) => {
    try {
      // Persist to DB
      const message = await Message.create({
        swapRequest: swapId,
        sender:      senderId,
        content,
      });

      const populated = await Message.findById(message._id)
        .populate('sender', 'name profileImage');

      // Broadcast to all in room
      io.to(swapId).emit('receiveMessage', populated);
    } catch (err) {
      console.error('Socket message error:', err.message);
      socket.emit('messageError', { error: 'Failed to send message.' });
    }
  });

  // Confirm swap from a user
  socket.on('confirmSwap', async ({ swapId, userId }) => {
    try {
      const swap = await SwapRequest.findById(swapId);
      if (!swap || swap.status !== 'Accepted') return;

      if (!swap.confirmedBy.map(String).includes(userId)) {
        swap.confirmedBy.push(userId);
      }

      const { ClothingItem } = require('./models/ClothingItem');
      const bothConfirmed =
        swap.confirmedBy.map(String).includes(swap.fromUser.toString()) &&
        swap.confirmedBy.map(String).includes(swap.toUser.toString());

      if (bothConfirmed) {
        swap.status = 'Completed';
        await require('./models/ClothingItem').findByIdAndUpdate(swap.offeredItem,   { status: 'Swapped' });
        await require('./models/ClothingItem').findByIdAndUpdate(swap.requestedItem, { status: 'Swapped' });
      }

      await swap.save();
      io.to(swapId).emit('swapStatusUpdate', { swapId, status: swap.status, confirmedBy: swap.confirmedBy, bothConfirmed });
    } catch (err) {
      console.error('ConfirmSwap socket error:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// ============================================
// Express Middleware
// ============================================
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      20,
  message:  { success: false, message: 'Too many requests, please try again later.' },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      200,
});

app.use('/api/auth', authLimiter);
app.use('/api',      apiLimiter);

// ============================================
// Static files — uploaded images
// ============================================
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// ============================================
// API Routes
// ============================================
app.use('/api/auth',     authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/swaps',    swapRoutes);
app.use('/api/chat',     chatRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/admin',    adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ success: true, message: 'FASTION API is running' }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Global error handler
app.use(errorHandler);

// ============================================
// Start Server with error handling and port fallback
// ============================================
const START_PORT = parseInt(process.env.PORT, 10) || 5000;
const MAX_PORT_TRIES = 5;

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

let attempts = 0;

function startServer(port) {
  server.once('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use.`);
      attempts += 1;
      if (attempts >= MAX_PORT_TRIES) {
        console.error(`Failed to bind to a port after ${attempts} attempts. Exiting.`);
        process.exit(1);
      }
      const nextPort = port + 1;
      console.log(`Trying next port: ${nextPort}`);
      // try next port
      startServer(nextPort);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  server.listen(port, () => {
    console.log(`\n[SERVER] FASTION Server running on http://localhost:${port}`);
    console.log(`   Environment: ${process.env.NODE_ENV}`);
    console.log(`   Socket.io:   enabled`);
  });
}

startServer(START_PORT);
