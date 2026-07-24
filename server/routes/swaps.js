const express = require('express');
const { createSwap, getIncoming, getOutgoing, acceptSwap, rejectSwap, confirmSwap, getSwap } = require('../controllers/swapController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All swap routes are protected

router.post('/',               createSwap);
router.get('/incoming',        getIncoming);
router.get('/outgoing',        getOutgoing);
router.get('/:id',             getSwap);
router.put('/:id/accept',      acceptSwap);
router.put('/:id/reject',      rejectSwap);
router.put('/:id/confirm',     confirmSwap);

module.exports = router;
