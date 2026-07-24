const express = require('express');
const { getUsers, disableUser, getListings, deleteListing, getDisputes, resolveDispute, getAnalytics, createDispute } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, adminOnly); // All admin routes require admin

router.get('/users',              getUsers);
router.put('/users/:id/disable',  disableUser);
router.get('/listings',           getListings);
router.delete('/listings/:id',    deleteListing);
router.get('/disputes',           getDisputes);
router.post('/disputes',          createDispute);
router.put('/disputes/:id/resolve', resolveDispute);
router.get('/analytics',          getAnalytics);

module.exports = router;
