import mongoose from 'mongoose'
import SessionModel, { ChatMessage } from '../models/session'

export default async function SaveMessage(sessionId: string, message: ChatMessage) {
    const id = new mongoose.Types.ObjectId(sessionId)
    await  SessionModel.updateOne(
        { _id: id },
        { $push: { chatHistory: message }}
    )
}   