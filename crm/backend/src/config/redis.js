
const Bull = require('bull');
const dotenv = require('dotenv');

dotenv.config();

const messageQueue = new Bull('messageQueue', {
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
    },
});

const deliveryReceiptQueue = new Bull('deliveryReceiptQueue', {
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
    },
});

module.exports = { messageQueue, deliveryReceiptQueue };
