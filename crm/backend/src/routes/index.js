// backend/src/routes/index.js
const express = require('express');
const router = express.Router();

const customerRoutes = require('./customers');
const orderRoutes = require('./orders');
const campaignRoutes = require('./campaigns');
const deliveryReceiptRoutes = require('./deliveryReceipt');
const authRoutes = require('./auth');

router.use('/customers', customerRoutes);
router.use('/orders', orderRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/delivery-receipt', deliveryReceiptRoutes);
router.use('/auth', authRoutes);

module.exports = router;
