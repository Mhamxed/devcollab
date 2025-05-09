import mongoose from "mongoose";
import SessionModel from "../models/session";

export default async function getRoomUsers(sessionId: string) {
    const id = new mongoose.Types.ObjectId(sessionId)
    const session = await SessionModel.findOne(
        { _id: id }
    )
    return session?.participants
}