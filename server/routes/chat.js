const express = require('express');
const { getMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/:swapId', protect, getMessages);

module.exports = router;
