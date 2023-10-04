import PostModel from "../model/postModel.js";
import mongoose from "mongoose";
import UserModel from "../model/userModel.js";

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
        console.log(post, "/////");
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
        if (post.user.toString() === user) {
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
            { password: 0, createdAt: 0, updatedAt: 0, isAdmin: 0, savedposts: 0, phone: 0 }
            // { _id: 1, username: 1, followers: 1, following: 1, posts: 1, profileimage: 1 }
        );

        const currentUserPostsModified = currentUserPosts.map((post) => ({
            ...post.toObject(),
            userDetails: currentUser,
        }));

        const timelinePosts = currentUserPostsModified.concat(...followingPosts[0].followingPosts);

        timelinePosts.forEach((post) => {
            const userDetails = followingUsers.find((user) => user._id.equals(post.user));
            if (userDetails) {
                post.userDetails = userDetails;
            }
        });
        timelinePosts.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.status(200).json(timelinePosts);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json(error);
    }
};
