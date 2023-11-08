import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        read: {
            type: Boolean,
            default: false,
        },
        url: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const NotificationModel = mongoose.model("Notification", NotificationSchema);
export default NotificationModel;
