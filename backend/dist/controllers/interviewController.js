"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invite = exports.deleteInterview = exports.updateInterview = exports.interviewById = exports.createInterview = exports.interviews = void 0;
const user_1 = __importDefault(require("../models/user"));
const interview_1 = __importDefault(require("../models/interview"));
const interviews = async (req, res) => {
    try {
        if (req.user) {
            const user = req.user;
            const userId = user._id;
            const interviews = await user_1.default.find({ createdBy: userId });
            res.json({
                interviews: interviews
            });
        }
        else {
            res.json({
                message: "Please login to view your interviews"
            });
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.interviews = interviews;
const createInterview = async (req, res) => {
    try {
        const { title, description, createdBy, participants, scheduledFor, status, roomId } = req.body;
        const newInterview = new interview_1.default({
            title,
            description,
            createdBy,
            participants,
            scheduledFor,
            status,
            roomId
        });
        await newInterview.save();
        res.status(201).json({
            message: "interview was created!"
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createInterview = createInterview;
const interviewById = async (req, res) => {
    try {
        const interviewId = req.params.id;
        const interview = await interview_1.default.findOne({ id: interviewId });
        res.json({
            interview
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.interviewById = interviewById;
const updateInterview = async (req, res) => {
    try {
        const interviewId = req.params.id;
        const { title, description, createdBy, participants, scheduledFor, status, roomId } = req.body;
        await interview_1.default.updateOne({ _id: interviewId }, { $set: { title, description, createdBy, participants, scheduledFor, status, roomId } });
        res.json({
            message: "interview was updated successfully"
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateInterview = updateInterview;
const deleteInterview = async (req, res) => {
    try {
        const deleted = await interview_1.default.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: "Not found" });
        res.json({ message: "Interview deleted" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteInterview = deleteInterview;
const invite = async (req, res) => {
    try {
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.invite = invite;
