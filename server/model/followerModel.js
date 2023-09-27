import mongoose from "momgoose";

const followersSchema = new mongoose.Schema(
    {
        follower: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        followers: [
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

const followerModel = mongoose.model("Followers", followersSchema);

export default followerModel;
