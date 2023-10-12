import PostModel from "../model/postModel.js";
import CommentModel from "../model/commentModel.js";

export const createComment = async (req, res) => {
    try {
        const { postId, text, user, postUserId } = req.body;

        const post = await PostModel.findById(postId).exec();
        if (!post) {
            return res.status(400).json({ error: "Post does not exist." });
        }

        const newComment = new CommentModel({
            user,
            text,
            postUserId,
            postId,
        });

        await PostModel.findOneAndUpdate(
            { _id: postId },
            {
                $push: { comments: newComment._id },
            },
            { new: true }
        );

        await newComment.save();
        res.json(newComment);
    } catch (err) {
        return res.status(500).json({ error: "internal server error!" });
    }
};

export const getComments = async (req, res) => {
    try {
        const postId = req.params.id;
        if (!postId) return res.status(400).json("post ID cannot be empty!");
        const comments = await CommentModel.find({ postId })
            .populate("user", ["username", "fullname", "profileimage"])
            .exec();
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { text } = req.body;
        const id = req.params.id;
        await CommentModel.findOneAndUpdate({ _id: id }, { text });
        res.status(200).json({ msg: "updated successfully." });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const likeComment = async (req, res) => {
    try {
        const { commentId, user } = req.body;
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        const userLiked = comment.likes.includes(user);

        if (userLiked) {
            comment.likes = comment.likes.filter((userId) => userId.toString() !== user.toString());
        } else {
            comment.likes.push(user);
        }

        await comment.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error toggling comment like:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const comment = await CommentModel.findOneAndDelete({
            _id: req.params.id,
        });

        await PostModel.findOneAndUpdate(
            { _id: comment.postId },
            {
                $pull: { comments: req.params.id },
            }
        );
        res.json({ message: "Comment deleted successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error!" });
    }
};
