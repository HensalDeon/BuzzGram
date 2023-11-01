import MessageModel from "../model/messageModel.js";

export const addMessage = async (req, res) => {
    const { chatId, senderId, text, media } = req.body;
    const message = new MessageModel({
        chatId,
        senderId,
        text,
        media,
    });
    try {
        const result = await message.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        const result = await MessageModel.find({ chatId });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};
