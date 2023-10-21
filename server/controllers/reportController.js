import mongoose from "mongoose";
import ReportModel from "../model/reportModel.js";
import PostModel from "../model/postModel.js";
import CommentModel from "../model/commentModel.js";
import UserModel from "../model/userModel.js";

export const createReport = async (req, res) => {
    try {
        const { reporterId, targetType, targetId, reason } = req.body;
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

export const getAllReports = async (req, res) => {
    try {
        const reports = await ReportModel.find()
            .populate({
                path: "reporterId",
                select: "username profileimage",
                model: UserModel,
            })
            .exec();

        res.status(200).json(reports);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error fetching report" });
    }
};

export const getTargetData = async (req, res) => {
    try {
        const id = req.params.id;
        const targetType = req.params.targetType;
        if (!targetType || !id) return res.status(400).json({ error: "data cannot be undefined" });
        const model = targetType === "post" ? PostModel : CommentModel;

        const target = await model
            .findById({ _id: id })
            .populate({
                path: "user",
                select: "username profileimage",
                model: UserModel,
            })
            .exec();
        if (!target) {
            return res.status(404).json({ error: "Target not found." });
        }

        res.status(200).json(target);
    } catch (error) {
        console.log(error);
    }
};
