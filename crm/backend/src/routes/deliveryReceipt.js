// backend/src/routes/deliveryReceipt.js
const express = require('express');
const router = express.Router();
const deliveryReceiptController = require('../controllers/deliveryReceiptController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/', deliveryReceiptController.updateDeliveryStatus);

module.exports = router;
