import PostModel from "../model/postModel.js";
import mongoose from "mongoose";
import UserModel from "../model/userModel.js";
import CommentModel from "../model/commentModel.js";

// Creat new Post
export const createPost = async (req, res) => {
    const newPost = new PostModel(req.body);
    try {
        await newPost.save();
        res.status(200).json(newPost);
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
        if (post.user.toString() === user) {
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
    try {
        const currentUser = await UserModel.findById(userId);
        const currentUserPosts = await PostModel.find({ user: userId });

        const followingPosts = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "following",
                    foreignField: "user",
                    as: "followingPosts",
                },
            },
            {
                $project: {
                    followingPosts: 1,
                },
            },
        ]);
        const followingUserIds = followingPosts[0].followingPosts.map((post) => post.user);
        const followingUsers = await UserModel.find(
            { _id: { $in: followingUserIds } },
            { password: 0, createdAt: 0, updatedAt: 0, isAdmin: 0, phone: 0 }
        );

        const currentUserPostsModified = currentUserPosts.map((post) => ({
            ...post.toObject(),
            userDetails: currentUser,
        }));

        const timelinePosts = currentUserPostsModified.concat(...followingPosts[0].followingPosts);
        const userIdObjectId = new mongoose.Types.ObjectId(userId);

        const filteredTimelinePosts = timelinePosts.filter((post) => {
            const reportedByCurrentUser = post.reports.some((reportId) => reportId.equals(userIdObjectId));
            return !reportedByCurrentUser;
        });

        filteredTimelinePosts.forEach((post) => {
            const userDetails = followingUsers.find((user) => user._id.equals(post.user));
            if (userDetails) {
                post.userDetails = userDetails;
            }
        });
        filteredTimelinePosts.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.status(200).json(filteredTimelinePosts);
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

        const posts = await PostModel.find({
            _id: { $nin: reportedPosts.map((post) => post._id) },
        }).populate({
            path: "user",
            select: "-password",
        });

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
        console.log(savedPosts);
        res.status(200).json(savedPosts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error occured" });
    }
};
