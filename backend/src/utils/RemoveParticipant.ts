import SessionModel from '../models/session'
import mongoose from "mongoose";

export default async function RemovePartipant(sessionId: string, username: string) {
    const id = new mongoose.Types.ObjectId(sessionId)
    await SessionModel.updateMany(
        { _id: id },
        { $pull: { participants: username}}
    )
}   