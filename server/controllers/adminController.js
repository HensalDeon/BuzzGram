import UserModel from "../model/userModel.js";

export const getUserList = async (req, res) => {
    try {
        const userList = await UserModel.find({}).exec();
        if (!userList) {
            return res.status(404).json({ error: "Error fetching user list!" });
        }
        return res.status(200).json(userList);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const blockUnblockUser = async (req, res) => {
    const { user } = req.body;

    try {
        const User = await UserModel.findById(user);
        if (!User.isblocked) {
            await User.updateOne({ isblocked: true });
            res.status(200).json("User blocked");
        } else {
            await User.updateOne({ isblocked: false });
            res.status(200).json("User Unblocked");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
