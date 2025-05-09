import { Router } from "express";
import { interviews, createInterview, interviewById, updateInterview, deleteInterview, invite } from "../controllers/interviewController";

const interview = Router();

interview.get("/api/interviews", interviews)
interview.post("/api/interviews", createInterview)
interview.get("api/interviews/:id", interviewById)
interview.put("/api/interviews/:id", updateInterview)
interview.delete("/api/interviews/:id ", deleteInterview)
interview.get("/api/interviews/:id/invite", invite)

export default interview