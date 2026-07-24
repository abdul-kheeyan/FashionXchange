const express = require('express');
const multer = require('multer');
const path = require('path');
const { getUser, updateUser, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Multer for profile image
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename:    (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 3 * 1024 * 1024, files: 1 } });

router.get('/:id',    getUser);
router.put('/:id',    protect, upload.single('profileImage'), updateUser);
router.put('/change-password', protect, changePassword);

module.exports = router;
