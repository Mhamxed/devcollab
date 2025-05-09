import { captureRejectionSymbol } from 'events';
import SessionModel from '../models/session'
import mongoose from "mongoose";

export default async function AddParticipant(sessionId: string, username: string) {
    const id = new mongoose.Types.ObjectId(sessionId)
    await  SessionModel.updateOne(
        { _id: id },
        { $addToSet: { participants: username }}
    )
}   