import UserModel from "../model/userModel.js";
import bcrypt from "bcrypt";

// get a User
export const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await UserModel.findById(id);

        if (user) {
            const { password, ...otherDetails } = user._doc;

            res.status(200).json(otherDetails);
        } else {
            res.status(404).json("No such user exists");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// update a user
export const updateUser = async (req, res) => {
    const id = req.params.id;
    const { currentUserId, currentUserAdminStatus, password } = req.body;

    if (id === currentUserId || currentUserAdminStatus) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }

            const user = await UserModel.findByIdAndUpdate(id, req.body, {
                new: true,
            });

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("Access Denied! you can only update your own profile");
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    const id = req.params.id;

    const { currentUserId, currentUserAdminStatus } = req.body;

    if (currentUserId === id || currentUserAdminStatus) {
        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json("User deleted successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("Access Denied! you can only delete your own profile");
    }
};

// Follow a User
export const followUser = async (req, res) => {
    const id = req.params.id;
    const { curUserId } = req.body;

    if (curUserId === id) {
        return res.status(403).json({ error: "Action forbidden" });
    } else {
        try {
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(curUserId);

            if (!followUser.followers.includes(curUserId)) {
                await followUser.updateOne({ $push: { followers: curUserId } });
                await followingUser.updateOne({ $push: { following: id } });
                res.status(201).json({ message: "Followed!" });
            } else {
                res.status(403).json({ error: "User is Already followed by you" });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
};

// UnFollow a User
export const UnFollowUser = async (req, res) => {
    const id = req.params.id;

    const { curUserId } = req.body;

    if (curUserId === id) {
        res.status(403).json({ error: "Action forbidden" });
    } else {
        try {
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(curUserId);

            if (followUser.followers.includes(curUserId)) {
                await followUser.updateOne({ $pull: { followers: curUserId } });
                await followingUser.updateOne({ $pull: { following: id } });
                res.status(201).json({ message: "Unfollowed!" });
            } else {
                res.status(403).json({ error: "User is not followed by you" });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
};

export const searchResult = async (req, res) => {
    const query = req.query.q;
    const users = await UserModel.find({
        $or: [{ username: { $regex: query, $options: "i" } }, { fullname: { $regex: query, $options: "i" } }],
    }).select("username profileimage _id fullname");

    res.status(200).json(users);
};
