import Notification from "../models/Notification.js";

export async function getNotifications(req, res) {
    try{
        const notifications = await Notification.find({
            recipient: req.user._id
        })
        .populate("sender", "username profileImage")
        .populate("post")
        .sort({ createdAt: -1 });

        res.status(200).json(notifications);

    } catch (error) {
        console.error("Error in getNotifications controller", error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function markNotificationAsRead(req, res) {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found",
            });
        }

        if (
            notification.recipient.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Unauthorized",
            });
        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({
            message: "Notification marked as read",
            notification,
        });

    } catch (error) {
        console.error("Error in markAsRead controller", error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}