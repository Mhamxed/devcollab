"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addChatMessage = exports.executeSessionCode = exports.updateSessionCode = exports.sessionById = exports.createSession = void 0;
const session_1 = __importDefault(require("../models/session"));
const createSession = async (req, res) => {
    try {
        const { sessionTitle, duration, selectedProblem, language } = req.body;
        const isFreestyle = duration === 0 ? true : false;
        const userId = req.user?.id;
        console.log(userId);
        const newSession = new session_1.default({
            sessionTitle,
            duration,
            language,
            problemId: selectedProblem[0]._id,
            isFreestyle
        });
        await newSession.save();
        res.status(201).json({
            message: "Session created!"
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createSession = createSession;
const sessionById = async (req, res) => {
    try {
        const sessionId = req.params.id;
        const session = await session_1.default.findOne({ id: sessionId });
        res.json({
            session
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.sessionById = sessionById;
const updateSessionCode = async (req, res) => {
    try {
        const sessionId = req.params.id;
        const { code } = req.body;
        await session_1.default.updateOne({ _id: sessionId }, { $set: { code } });
        res.json({
            message: "Session code updated successfully"
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateSessionCode = updateSessionCode;
const executeSessionCode = async (req, res) => {
    try {
        // excute code 
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.executeSessionCode = executeSessionCode;
const addChatMessage = async (req, res) => {
    try {
        // add chat message 
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.addChatMessage = addChatMessage;
