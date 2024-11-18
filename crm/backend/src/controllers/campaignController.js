const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');
const CommunicationsLog = require('../models/CommunicationsLog');
const { messageQueue, deliveryReceiptQueue } = require('../config/redis');
const buildQuery = require('../utils/buildQuery'); 

exports.createCampaign = async (req, res, next) => {
    try {
        const { name, audienceCriteria } = req.body;
        const campaign = new Campaign({ name, audienceCriteria });
        await campaign.save();

        await messageQueue.add({
            type: 'SEND_CAMPAIGN_MESSAGES',
            data: { campaignId: campaign._id },
        });

        res.status(201).json(campaign);
    } catch (error) {
        next(error);
    }
};

exports.getAllCampaigns = async (req, res, next) => {
    try {
        const campaigns = await Campaign.find().sort({ createdAt: -1 });
        res.status(200).json(campaigns);
    } catch (error) {
        next(error);
    }
};

exports.getCampaignById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.status(200).json(campaign);
    } catch (error) {
        next(error);
    }
};

exports.calculateAudience = async (req, res, next) => {
    try {
        const { audienceCriteria } = req.body;
        const query = buildQuery(audienceCriteria);
        const size = await Customer.countDocuments(query);
        res.status(200).json({ size });
    } catch (error) {
        next(error);
    }
};

exports.getCampaignStats = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const total = await CommunicationsLog.countDocuments({ campaignId });
        const sent = await CommunicationsLog.countDocuments({ campaignId, status: 'SENT' });
        const failed = await CommunicationsLog.countDocuments({ campaignId, status: 'FAILED' });

        res.status(200).json({ total, sent, failed });
    } catch (error) {
        next(error);
    }
};
