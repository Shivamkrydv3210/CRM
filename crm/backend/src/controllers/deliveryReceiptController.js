const CommunicationsLog = require('../models/CommunicationsLog');

exports.updateDeliveryStatus = async (req, res, next) => {
    try {
        const { logId, status } = req.body;

        if (!['SENT', 'FAILED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const log = await CommunicationsLog.findById(logId);
        if (!log) {
            return res.status(404).json({ message: 'Communication log not found' });
        }

        log.status = status;
        log.sentAt = new Date();
        await log.save();

        res.status(200).json({ message: 'Status updated', log });
    } catch (error) {
        next(error);
    }
};
