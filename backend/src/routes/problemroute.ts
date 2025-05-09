import { Router } from "express";
import { problems, createProblem, problemById, updateProblem, deleteProblem, toggleFavorite } from "../controllers/problemController";

const problem = Router();

problem.get("/api/problems", problems)
problem.post("/api/problems", createProblem)
problem.get("/api/problems/:id", problemById)
problem.put("/api/problems/:id", updateProblem)
problem.put("/api/problems/:id/favorite", toggleFavorite)
problem.delete("/api/problems/:id", deleteProblem)

export default problem