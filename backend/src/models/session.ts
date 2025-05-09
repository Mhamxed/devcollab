import mongoose, { Schema, Document, Types } from "mongoose";

export interface ChatMessage {
  sender: Types.ObjectId;
  username: string;
  message: string;
  time: string;
  sessionId: string;
}

export interface ISession extends Document {
  _id: Types.ObjectId;
  sessionTitle: string;
  problemId: Types.ObjectId;
  createdBy: Types.ObjectId;
  participants: string[];
  duration: number;
  code: string;
  language: string;
  chatHistory: ChatMessage[];
  notes: string;
  timerRunning: boolean;
  isFreestyle: boolean;
  isFavorite: boolean;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    sessionTitle: { type: String, required: true },
    problemId: { type: Schema.Types.ObjectId, ref: "Problem" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [
      { type: String, required: true },
    ],
    duration: { type: Number, default: 0},
    code: { type: String, default: "" },
    language: { type: String, required: true }, // e.g., "javascript", "python", etc.
    chatHistory: [
      {
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
        message: { type: String, required: true },
        sessionId: { type: String },
        time: { type: String, default: Date.now.toString() },
      },
    ],
    notes: { type: String, default: "" },
    isFreestyle: { type: Boolean, default: false},
    timerRunning: { type: Boolean, default: false},
    isFavorite: { type: Boolean, default: false},
    endTime: { type: Date, default: Date.now}
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const SessionModel = mongoose.model<ISession>("Session", sessionSchema);
export default SessionModel;
