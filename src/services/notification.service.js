const db = require('../models');


const createNotification = async (from,receivers, content, type, redirectUrl) => {
    try {
        if (!Array.isArray(receivers) || receivers.length == 0) {
            throw new Error("Receivers must be a non-empty array");
        }
        if (!content || typeof content !== "string") {
            throw new Error("Content must be a valid string");
        }
        if (!type || typeof type !== "string") {
            throw new Error("Type must be a valid string");
        }

        const validReceivers = await db.User.find(
            { _id: { $in: receivers }, status: { $ne: "banned" } },
            { _id: 1 }
        );

        if (validReceivers.length === 0) {
            throw new Error("No valid receivers found (may not exist or are banned)");
        }

        const validReceiverIds = validReceivers.map(user => user._id);

        const newNotification = {
            from:from,
            receivers: validReceiverIds,
            content: content,
            type: type,
            redirectUrl
        };

        const createdNotification = await db.Notification.create(newNotification);

        if (createdNotification) {
            await db.User.updateMany(
                { _id: { $in: validReceiverIds } },
                {
                    $addToSet: { notifications: { _id: createdNotification._id, isSeen: false } }
                }
            );
        }

        return createdNotification;
    } catch (error) {
        // console.error("Error creating notification:", error.message);
        throw error;
    }
};

const getAllNotifications = async (userId) => {
    try {   
        const user = await db.User.findOne(userId).populate("notifications._id")   
        const notifications = user.notifications?.map((noti) => ({
            ...noti._id.toObject(), // Chuyển document thành object
            isSeen: noti.isSeen
        }));

        
        return notifications;
    } catch (error) {
        throw error;
    }
};


const notificationService = {
    createNotification,
    getAllNotifications
}

module.exports = notificationService;   