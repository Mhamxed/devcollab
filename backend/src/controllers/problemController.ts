import { Request, Response } from "express";
import ProblemModel, { IProblem } from "../models/problem";
import { IUser } from "../models/user";

export const problems = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = req.user as IUser
        const userId = user.id
        const problems = await ProblemModel.find({ createdBy: userId})
        res.json({
            problems: problems
        })
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const createProblem = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = req.user as IUser
      const userId = user.id
        const { 
          title,
          description,
          difficulty,
          category,
          inputFormat,
          outputFormat,
          constraints,
          exampleCases,
          testCases,
          tags,
          defaultCode,
         } = req.body
        const createdBy = userId
        const newProblem = new ProblemModel({
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
        })

        await newProblem.save()
        res.status(201).json({
            message: "Problemset created successfully!"
        })
        
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const problemById = async (req: Request, res: Response): Promise<any> => {
    try {
        const problemId = req.params.id
        const problemset = await ProblemModel.findOne({ _id: problemId })
        res.json({
            problemset
        })

    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const updateProblem = async (req: Request, res: Response): Promise<any> => {
    try {
        const problemId = req.params.id
        const { title, description, difficulty, time_limit, testCases, input_format, output_format, Constraints, Example_Cases, defaultCode, createdBy } = req.body
        await ProblemModel.updateOne(
            { _id: problemId },
            { $set: { title, description, difficulty, time_limit, testCases, input_format, output_format, Constraints, Example_Cases, defaultCode, createdBy } }
        )
        
        res.json({
            message: "problemset updated successfully"
        })
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const toggleFavorite = async (req: Request, res: Response): Promise<any> => {
    try {
        const problemId = req.params.id
        const isFavorite = req.body.isFavorite
        await ProblemModel.updateOne(
            { _id: problemId },
            { $set: { isFavorite: !isFavorite } }
        )
        res.json({
            message: "Success"
        })
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const deleteProblem = async (req: Request, res: Response): Promise<any> => {
    try {
        const deleted = await ProblemModel.findByIdAndDelete({ _id: req.params.id });
        if (!deleted) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Problem deleted successfully" });
        
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  };