const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getListings, getListing, createListing, updateListing, deleteListing, getUserListings,
} = require('../controllers/listingController');
const { protect } = require('../middleware/auth');
const { listingValidation } = require('../middleware/validate');

const router = express.Router();

// Multer config — local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename:    (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024, files: 5 } });

// Public routes
router.get('/',                getListings);
router.get('/user/:userId',    getUserListings);
router.get('/:id',             getListing);

// Protected routes
router.post('/',   protect, upload.array('images', 5), listingValidation, createListing);
router.put('/:id', protect, upload.array('images', 5), updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;
