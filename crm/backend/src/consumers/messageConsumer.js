const { messageQueue, deliveryReceiptQueue } = require('../config/redis');
const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');
const CommunicationsLog = require('../models/CommunicationsLog');

const buildMongoQuery = (criteria) => {
    const query = {};

    if (criteria.totalSpending) {
        query.totalSpending = {};
        if (criteria.totalSpending.gt) query.totalSpending.$gt = criteria.totalSpending.gt;
        if (criteria.totalSpending.lt) query.totalSpending.$lt = criteria.totalSpending.lt;
    }

    if (criteria.visits) {
        query.visits = {};
        if (criteria.visits.gte) query.visits.$gte = criteria.visits.gte;
        if (criteria.visits.lte) query.visits.$lte = criteria.visits.lte;
    }

    if (criteria.lastVisitDate) {
        query.lastVisitDate = {};
        if (criteria.lastVisitDate.after) query.lastVisitDate.$gt = new Date(criteria.lastVisitDate.after);
        if (criteria.lastVisitDate.before) query.lastVisitDate.$lt = new Date(criteria.lastVisitDate.before);
    }

    return query;
};

messageQueue.process(async (job, done) => {
    try {
        const { type, data } = job.data;

        switch (type) {
            case 'SEND_CAMPAIGN_MESSAGES':
                const { campaignId } = data;
                const campaign = await Campaign.findById(campaignId);
                if (!campaign) throw new Error('Campaign not found');

                const query = buildMongoQuery(campaign.audienceCriteria);
                const audience = await Customer.find(query);

                console.log(`Audience Size for Campaign "${campaign.name}":`, audience.length);

                const communications = audience.map(customer => ({
                    campaignId: campaign._id,
                    customerId: customer._id,
                    message: `Hi ${customer.name}, here’s 10% off on your next order!`,
                    status: 'PENDING',
                }));

                await CommunicationsLog.insertMany(communications);

                communications.forEach(log => {
                    messageQueue.add({
                        type: 'SEND_MESSAGE',
                        data: { logId: log._id },
                    });
                });

                done();
                break;

            case 'SEND_MESSAGE':
                const { logId } = data;
                const log = await CommunicationsLog.findById(logId).populate('customerId');
                if (!log) throw new Error('CommunicationsLog not found');

                const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';

                await deliveryReceiptQueue.add({
                    logId: log._id,
                    status,
                });

                done();
                break;

            default:
                console.log('Unknown job type:', type);
                done();
        }
    } catch (error) {
        console.error('Error processing job:', error);
        done(error);
    }
});

deliveryReceiptQueue.process(async (job, done) => {
    try {
        const { logId, status } = job.data;
        const log = await CommunicationsLog.findById(logId);
        if (!log) throw new Error('CommunicationsLog not found');

        log.status = status;
        log.sentAt = new Date();
        await log.save();

        done();
    } catch (error) {
        console.error('Error updating delivery receipt:', error);
        done(error);
    }
});

console.log('Message Consumer is running...');
