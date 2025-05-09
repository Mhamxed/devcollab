// src/models/Problem.ts
import mongoose, { Schema, Document, Types } from "mongoose";

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface exampleCase {
  input: string;
  output: string;
  Explanation: string;
}


interface DefaultCode {
  javascript: string;
  python: string;
}

export interface IProblem extends Document {
  _id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  constraints: string[];
  exampleCases: exampleCase[]
  testCases: TestCase[];
  defaultCode: DefaultCode;
  createdBy: Types.ObjectId;
  isFavorite: boolean;
  isCustom: boolean;
  tags: string[];
  usage: number;
  lastUsed: string;
  createdAt: Date;
  updatedAt: Date;
}

const problemSchema = new Schema<IProblem>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    category: { type: String, required: true },
    constraints: [
      { type: String, required: true},
    ],
    exampleCases: [
      {
        input: { type: String, required: true},
        output: { type: String, required: true},
        Explanation: { type: String }
      }
    ],
    testCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
      },
    ],
    defaultCode: {
      javascript: { type: String, required: true },
      python: { type: String, required: true },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    isFavorite: { type: Boolean, default: false },
    isCustom: { type: Boolean, default: false },
    tags: [],
    usage: { type: Number, default: 0 },
    lastUsed: { type: String, default: "Never" },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const ProblemModel = mongoose.model<IProblem>("Problem", problemSchema);
export default ProblemModel;
