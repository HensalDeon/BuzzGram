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
    const { userId } = req.body;

    try {
        const post = await PostModel.findById(postId);
        if (post.userId === userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("Post Updated");
        } else {
            res.status(403).json("Action forbidden");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;

    try {
        const post = await PostModel.findById(id);
        if (post.userId === userId) {
            await post.deleteOne();
            res.status(200).json("POst deleted successfully");
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
    const { userId } = req.body;

    try {
        const post = await PostModel.findById(id);
        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } });
            res.status(200).json("Post liked");
        } else {
            await post.updateOne({ $pull: { likes: userId } });
            res.status(200).json("Post Unliked");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// Get Timeline POsts
export const getTimelinePosts = async (req, res) => {
    const userId = req.params.id;

    try {

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
                $unwind: "$followingPosts",
            },
            {
                $lookup: {
                    from: "users",
                    localField: "followingPosts.user",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $project: {
                    "followingPosts.user": 0,
                },
            },
        ]);

        // // Map each post to include user details
        // const timelinePosts = followingPosts.map((item) => {
        //     const post = item.followingPosts;
        //     const userDetails = item.userDetails[0];

        //     // Include user details in the post
        //     post.userDetails = userDetails;

        //     return post;
        // });
        // console.log(timelinePosts)

        // timelinePosts.sort((a, b) => b.createdAt - a.createdAt);
        // timelinePosts.push(...currentUserPosts)

        // res.status(200).json(timelinePosts);

        // Fetch the current user's posts and add user details to each post
        console.log(followingPosts,'/////')
        const timelinePosts = followingPosts.map((item) => {
          console.log(userDetails,'❤️❤️❤️❤️')
          const post = item.followingPosts;
          const userDetails = item.userDetails[0]; // Assuming there's only one user detail per post
      
          // Include user details in the post
          post.userDetails = userDetails;
      
          return post;
      });
      
        const currentUserPosts = await PostModel.find({ user: userId });
        const currentUserDetails = await UserModel.findById(userId);
        console.log(currentUserDetails,'iooiuoiuou')

        const currentUserPostsWithDetails = currentUserPosts.map((post) => {
          console.log(post.userDetails,'/;/;/;')
            post.userDetails = currentUserDetails;
            return post;
        });

        // Concatenate current user's posts with timeline posts
        const allPosts = currentUserPostsWithDetails.concat(timelinePosts);

        // Sort all posts by createdAt in descending order
        allPosts.sort((a, b) => b.createdAt - a.createdAt);
        console.log(allPosts)

        res.status(200).json(allPosts);
    } catch (error) {
        res.status(500).json(error);
    }
};
