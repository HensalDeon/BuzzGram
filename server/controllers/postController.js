import PostModel from "../model/postModel.js";
import mongoose from "mongoose";
import UserModel from "../model/userModel.js";
import CommentModel from "../model/commentModel.js";
import ReportModel from "../model/reportModel.js";

// Creat new Post
export const createPost = async (req, res) => {
    const newPost = new PostModel(req.body);
    try {
        await newPost.save();
        const post = await PostModel.findById(newPost._id).populate("user").exec();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Get a post
export const getPost = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await PostModel.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Update a post
export const updatePost = async (req, res) => {
    const postId = req.params.id;
    const user = req.query.user;
    const editedData = req.body;

    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json("Post not found");
        }

        if (post.user.toString() === user) {
            await PostModel.findByIdAndUpdate(postId, { $set: editedData });
            return res.status(200).json("Post Updated");
        } else {
            return res.status(403).json("Action forbidden");
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    const id = req.params.id;
    const user = req.query.user;

    try {
        const post = await PostModel.findById(id);
        if (!post) {
            return res.status(404).json("Post not found");
        }
        if (post.user.toString() === user || process.env.ADMIN_NAME) {
            await CommentModel.deleteMany({ postId: id });
            await post.deleteOne();
            res.status(200).json("Post deleted successfully");
        } else {
            res.status(403).json("Action forbidden");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// like/dislike a post
export const likePost = async (req, res) => {
    const id = req.params.id;
    const { user } = req.body;

    try {
        const post = await PostModel.findById(id);
        if (!post.likes.includes(user)) {
            await post.updateOne({ $push: { likes: user } });
            res.status(200).json("Post liked");
        } else {
            await post.updateOne({ $pull: { likes: user } });
            res.status(200).json("Post Unliked");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// get timline posts
export const getTimelinePosts = async (req, res) => {
    const userId = req.params.id;
    const page = req.query.page || 1;
    const limit = 3;
    try {
        const currentUser = await UserModel.findById(userId).populate("following").exec();
        const followingUsers = currentUser.following;
        const followingUserIds = followingUsers.map((user) => user._id);
        followingUserIds.push(userId);

        const reportsByCurrentUser = await ReportModel.find({
            reporterId: userId,
            targetType: "post",
        });

        const reportedPostIds = reportsByCurrentUser.map((report) => report.targetId);

        const skip = (page - 1) * limit;

        const timelinePosts = await PostModel.find({
            user: { $in: followingUserIds },
            _id: { $nin: reportedPostIds },
        })
            .populate("user")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        console.log(timelinePosts.length);

        res.status(200).json(timelinePosts);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json(error);
    }
};

// get all posts
export const getAllPosts = async (req, res) => {
    try {
        const userId = req.params.id;
        const userIdObjectId = new mongoose.Types.ObjectId(userId);
        const reportedPosts = await PostModel.find({
            reports: { $in: [userIdObjectId] },
        });
        const { page } = req.query;
        const limitValue = 8;
        const pageValue = parseInt(page, 10) || 1;

        const skipCount = (pageValue - 1) * limitValue;

        const posts = await PostModel.find({
            _id: { $nin: reportedPosts.map((post) => post._id) },
        })
            .populate({
                path: "user",
                select: "-password",
            })
            .skip(skipCount)
            .limit(limitValue);

        if (!posts) {
            return res.status(404).json({ error: "No posts found." });
        }

        return res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

// save and unsave post
export const savePost = async (req, res) => {
    const { id, postId, isSaved } = req.params;
    try {
        if (!id || !postId) return res.status(400).json({ error: "params is empty!" });

        const user = await UserModel.findOne({ _id: id });

        const savedPosts = user.saved || [];
        if (isSaved === "true") {
            const index = savedPosts.indexOf(postId);
            if (index !== -1) {
                savedPosts.splice(index, 1);
            }
        } else {
            savedPosts.push(postId);
        }

        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: id },
            {
                saved: savedPosts,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ error: "User does not exist." });
        }

        res.status(200).json({ message: isSaved === "true" ? "Post unsaved successfully." : "Post saved successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getSavedPosts = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        if (!id) return res.status(400).json({ error: "params value is undefined!" });

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const savedPostIds = user.saved;
        const savedPosts = await PostModel.find({ _id: { $in: savedPostIds } })
            .populate("user", "username profileimage _id")
            .populate("comments")
            .exec();
        res.status(200).json(savedPosts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error occured" });
    }
};

export const getUserPosts = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) return res.status(400).json({ error: "params value is undefined!" });
        const user = await UserModel.findById(id).select("-password -phone -isadmin -isblocked -saved");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const posts = await PostModel.find({ user: id })
            .populate({
                path: "user",
                select: "-password -phone -isadmin -isblocked -saved",
            })
            .exec();
        res.status(200).json({ user, posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error occured" });
    }
};

export const getAllPostsByAdmin = async (req, res) => {
    try {
        const { page } = req.query;
        const limitValue = 8;
        const pageValue = parseInt(page, 10) || 1;
        const skipCount = (pageValue - 1) * limitValue;
        const posts = await PostModel.find({})
            .populate({
                path: "user",
                select: "-password",
            })
            .skip(skipCount)
            .limit(limitValue)
            .exec();
        if (!posts) {
            return res.status(404).json({ error: "No posts found." });
        }
        return res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export const getLikedUsersDetails = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ error: "params cannot be undefined!" });

        const likedUsers = await PostModel.findById(id)
            .select("likes")
            .populate("likes", "username fullname profileimage followers");
        res.status(200).json(likedUsers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};
