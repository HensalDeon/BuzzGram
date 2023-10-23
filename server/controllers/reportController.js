import mongoose from "mongoose";
import ReportModel from "../model/reportModel.js";
import PostModel from "../model/postModel.js";
import CommentModel from "../model/commentModel.js";
import UserModel from "../model/userModel.js";
import PropagateLoader from "react-spinners/PropagateLoader";
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
        const { page } = req.query;
        const pageNumber = parseInt(page) || 1;
        const itemsPerPage = 8;
        const skipCount = (pageNumber - 1) * itemsPerPage;
        const reports = await ReportModel.find()
            .populate({
                path: "reporterId",
                select: "username profileimage",
                model: UserModel,
            })
            .skip(skipCount)
            .limit(itemsPerPage)
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
            return res.json("deleted");
        }

        res.status(200).json(target);
    } catch (error) {
        console.log(error);
    }
};

    export const updateReport = async (req, res) => {
        try {
            const id = req.params.id;
            const reportId = req.params.reportId;
            if (!reportId || !id) return res.status(400).json({ error: "data cannot be undefined" });

            if (!id === process.env.ADMIN_NAME) {
                return res.status(400).json({ error: "unAutharized for this action" });
            }
            const report = await ReportModel.findByIdAndUpdate({ _id: reportId }, { status: "resolved" }, { new: true }).exec();
            if (!report) {
                return res.status(404).json({ error: "Report not found" });
            }
            return res.status(200).json({ message: "Report resolved", report });
        } catch (error) {
            console.error("Error updating report:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    };

export const deleteReport = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) console.log("id is undefined");
        const report = await ReportModel.findByIdAndDelete({ _id: id });
        if (!report) return res.status(404).json({ error: "Report could not be found!" });
        res.status(200).json({ message: "Deleted successfully!" });
    } catch (error) {
        console.error("Error deleting report:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
