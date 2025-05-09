import { Request, Response } from "express";
import UserModel from "../models/user";
import InterviewModel from "../models/interview";
import { IUser } from "../models/user";

export const interviews = async (req: Request, res: Response): Promise<any> => {
    try {
        if (req.user) {
            const user = req.user as IUser
            const userId = user._id
            const interviews = await UserModel.find({ createdBy: userId})
            res.json({
                interviews: interviews
            })
        } else {
            res.json({
                message: "Please login to view your interviews"
            })
        }
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const createInterview = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, description, createdBy, participants, scheduledFor, status, roomId } = req.body
        const newInterview = new InterviewModel({
            title,
            description,
            createdBy,
            participants,
            scheduledFor,
            status,
            roomId
        })

        await newInterview.save()
        res.status(201).json({
            message: "interview was created!"
        })
        
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const interviewById = async (req: Request, res: Response): Promise<any> => {
    try {
        const interviewId = req.params.id
        const interview = await InterviewModel.findOne({ id: interviewId })
        res.json({
            interview
        })

    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const updateInterview = async (req: Request, res: Response): Promise<any> => {
    try {
        const interviewId = req.params.id
        const { title, description, createdBy, participants, scheduledFor, status, roomId } = req.body
        await InterviewModel.updateOne(
            { _id: interviewId },
            { $set: { title, description, createdBy, participants, scheduledFor, status, roomId } }
        )
        
        res.json({
            message: "interview was updated successfully"
        })
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const deleteInterview = async (req: Request, res: Response): Promise<any> => {
    try {
        const deleted = await InterviewModel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Interview deleted" });
        
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const invite = async (req: Request, res: Response): Promise<any> => {
    try {
        
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  