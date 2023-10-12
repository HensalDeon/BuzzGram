import mongoose from "mongoose";
import ReportModel from "../model/reportModel.js";
import PostModel from "../model/postModel.js";
import CommentModel from "../model/commentModel.js";
import UserModel from "../model/userModel.js";

export const createReport = async (req, res) => {
    try {
        const { reporterId, targetType, targetId, reason } = req.body;
        console.log(req.body, "////");
        if (!reporterId || !targetType || !targetId || !reason) return res.status(500).json("values are undefined");
        const newReport = new ReportModel({
            reporterId,
            targetType,
            targetId,
            reason,
        });
        await newReport.save();
        if (targetType === "post") {
            await PostModel.findByIdAndUpdate(targetId, { $push: { reports: reporterId } });
        }
        if (targetType === "comment") {
            await CommentModel.findByIdAndUpdate(targetId, { $push: { reports: reporterId } });
        }
        // if (targetType === "user") {
        //     await UserModel.findByIdAndUpdate({ targetType }, { $push: { reports: reporterId } });
        // }
        res.status(201).json(newReport);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error creating report" });
    }
};
