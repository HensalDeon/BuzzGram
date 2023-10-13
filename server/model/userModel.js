import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        bio: {
            type: String,
            maxlength: 160,
            default: "",
        },
        profileimage: {
            type: String,
            default: "",
        },
        coverimage: {
            type: String,
            default: "",
        },
        isadmin: {
            type: Boolean,
            default: false,
        },
        isblocked: {
            type: Boolean,
            default: false,
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        saved: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
