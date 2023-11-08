import NotificationModel from "../model/notificationModel.js";
import UserModel from "../model/userModel.js";

export const createNotification = async (req, res) => {
    try {
        const { senderId, receiverId, text } = req.body;
        if (!senderId || !receiverId || !text) return res.status(400).json({ error: "undefined values found" });
        const notification = new NotificationModel(req.body);
        await notification.save();
        res.status(200).json(notification);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error creating notification" });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(400).json({ error: "undefined values found" });
        const notifications = await NotificationModel.find({ receiverId: userId }).populate({
            path: "senderId",
            select: "username profileimage",
            model: UserModel,
        })
        .exec()
        res.status(200).json(notifications);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error getting notifications" });
    }
};
