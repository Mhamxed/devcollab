"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProblem = exports.toggleFavorite = exports.updateProblem = exports.problemById = exports.createProblem = exports.problems = void 0;
const problem_1 = __importDefault(require("../models/problem"));
const problems = async (req, res) => {
    try {
        const user = req.user;
        const userId = user.id;
        const problems = await problem_1.default.find({ createdBy: userId });
        res.json({
            problems: problems
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.problems = problems;
const createProblem = async (req, res) => {
    try {
        const user = req.user;
        const userId = user.id;
        const { title, description, difficulty, category, inputFormat, outputFormat, constraints, exampleCases, testCases, tags, defaultCode, } = req.body;
        const createdBy = userId;
        const newProblem = new problem_1.default({
            title,
            description,
            difficulty,
            category,
            inputFormat,
            outputFormat,
            constraints,
            exampleCases,
            testCases,
            defaultCode,
            createdBy,
            tags,
            isCustom: true,
        });
        await newProblem.save();
        res.status(201).json({
            message: "Problemset created successfully!"
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createProblem = createProblem;
const problemById = async (req, res) => {
    try {
        const problemId = req.params.id;
        const problemset = await problem_1.default.findOne({ _id: problemId });
        res.json({
            problemset
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.problemById = problemById;
const updateProblem = async (req, res) => {
    try {
        const problemId = req.params.id;
        const { title, description, difficulty, time_limit, testCases, input_format, output_format, Constraints, Example_Cases, defaultCode, createdBy } = req.body;
        await problem_1.default.updateOne({ _id: problemId }, { $set: { title, description, difficulty, time_limit, testCases, input_format, output_format, Constraints, Example_Cases, defaultCode, createdBy } });
        res.json({
            message: "problemset updated successfully"
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateProblem = updateProblem;
const toggleFavorite = async (req, res) => {
    try {
        const problemId = req.params.id;
        const isFavorite = req.body.isFavorite;
        await problem_1.default.updateOne({ _id: problemId }, { $set: { isFavorite: !isFavorite } });
        res.json({
            message: "Success"
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.toggleFavorite = toggleFavorite;
const deleteProblem = async (req, res) => {
    try {
        const deleted = await problem_1.default.findByIdAndDelete({ _id: req.params.id });
        if (!deleted)
            return res.status(404).json({ message: "Not found" });
        res.json({ message: "Problem deleted successfully" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteProblem = deleteProblem;
