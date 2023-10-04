import mongoose from "mongoose";
import ReportModel from "../model/reportSchema.js";

export const createReport = async (req, res) => {
    try {
        const { reporterId, targetType, targetId, reason } = req.body;
        const newReport = new ReportModel({
            reporterId,
            targetType,
            targetId,
            reason,
        });

        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ error: "Error creating report" });
    }
};
