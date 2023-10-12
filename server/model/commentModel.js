import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        postId: mongoose.Schema.Types.ObjectId,
        postUserId: mongoose.Schema.Types.ObjectId,
        reports: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const CommentModel = mongoose.model("Comment", commentSchema);

export default CommentModel;
