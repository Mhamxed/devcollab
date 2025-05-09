import { Request, Response } from "express";
import SessionModel from "../models/session";
import { IUser } from "../models/user";
import ProblemModel from "../models/problem";

  export const createSession = async (req: Request, res: Response): Promise<any> => {
    try {
        const { sessionTitle, duration, selectedProblem, language } = req.body
        const isFreestyle = duration === 0 ||  selectedProblem.length === 0 ? true : false
        const user = req.user as IUser
        const userId = user.id
        if (selectedProblem.length === 0) {
          const newSession = new SessionModel({
            sessionTitle, 
            createdBy: userId,
            duration, 
            language,
            isFreestyle
          })
          await newSession.save()
          res.status(201).json({
            message: "Session created!"
          })
          return;
        } else {
          const newSession = new SessionModel({
            sessionTitle, 
            createdBy: userId,
            duration, 
            language,
            problemId: selectedProblem[0]._id,
            isFreestyle
          })
          await newSession.save()
          res.status(201).json({
            message: "Session created!"
          })
        }
        
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const sessions = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = req.user as IUser
        const sessions = await SessionModel.find({ createdBy: user.id }).populate('problemId')
        res.json({
            sessions
        })

    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const startTimer = async (req: Request, res: Response): Promise<any> => {
    try {
        const sessionId = req.params.id
        const { endTime } =  req.body
        await SessionModel.updateOne(
            { _id: sessionId },
            { $set: { timerRunning: true, endTime: endTime } }
        )
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const stopTimer = async (req: Request, res: Response): Promise<any> => {
    try {
        const sessionId = req.params.id
        await SessionModel.updateOne(
            { _id: sessionId },
            { $set: { timerRunning: false } }
        )
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const resetTimer = async (req: Request, res: Response): Promise<any> => {
    try {
        const sessionId = req.params.id
        const { endTime } =  req.body
        await SessionModel.updateOne(
            { _id: sessionId },
            { $set: { timerRunning: false, endTime: endTime } }
        )
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  export const toggleFavorite = async (req: Request, res: Response): Promise<any> => {
    try {
        const sessionId = req.params.id
        const isFavorite = req.body.isFavorite
        await SessionModel.updateOne(
            { _id: sessionId },
            { $set: { isFavorite: !isFavorite } }
        )
        res.json({
            message: "Success"
        })
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const sessionById = async (req: Request, res: Response): Promise<any> => {
    try {
        const sessionId = req.params.id
        const session = await SessionModel.findOne({ _id: sessionId }).populate('problemId')
        if (session) {
          res.json({
              session
          })
        } else {
          res.json({ error: `Could not find session: ${sessionId}`})
        }

    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const saveCode = async (req: Request, res: Response): Promise<any> => {
    try {
        const sessionId = req.params.id
        const { code, language, notes } = req.body
        const session = await SessionModel.findByIdAndUpdate(
            { _id: sessionId },
            { $set: { language: language, code: code, notes: notes } }
        )

        if (session) {await ProblemModel.updateOne(
          { _id: session?.problemId},
          { [`defaultCode.${language}`]: code },
        );
        
        res.json({
            message: "Session code was saved successfully"
        })} else {
          res.json({ error: `Could not find session ${sessionId}`})
        }

    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const updateSessionCode = async (req: Request, res: Response): Promise<any> => {
    try {
        const sessionId = req.params.id
        const { code } = req.body
        const session = await SessionModel.updateOne(
            { _id: sessionId },
            { $set: { code } }
        )
        if (session) {
          res.json({
            message: "Session code updated successfully"
        })} else {
          res.json({
            error: `Could not update session: ${sessionId}`
          })
        }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const deleteSession = async (req: Request, res: Response): Promise<any> => {
    try {
      const deleted = await SessionModel.findByIdAndDelete({ _id: req.params.id });
      if (!deleted) return res.status(404).json({ error: "Not found" });
      res.json({ message: "Session deleted successfully" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const executeSessionCode = async (req: Request, res: Response): Promise<any> => {
    try {
        // excute code 
        
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const addChatMessage = async (req: Request, res: Response): Promise<any> => {
    try {
        // add chat message 
        
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  };