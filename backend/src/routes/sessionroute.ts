import { Router } from "express";
import { 
    sessionById,
    createSession,
    updateSessionCode,
    executeSessionCode,
    addChatMessage,
    sessions,
    toggleFavorite,
    deleteSession,
    saveCode,
    startTimer,
    stopTimer,
    resetTimer } from "../controllers/sessionController";

const session = Router();

session.post("/api/sessions", createSession)
session.get("/api/sessions", sessions)
session.get("/api/sessions/:id", sessionById)
session.put("/api/sessions/:id/code", updateSessionCode)
session.get("/api/sessions/:id/execute", executeSessionCode)
session.put("/api/sessions/:id/chat", addChatMessage)
session.put("/api/sessions/:id/favorite", toggleFavorite)
session.patch("/api/sessions/:id/save-code", saveCode)
session.patch("/api/sessions/:id/start-timer", startTimer)
session.patch("/api/sessions/:id/stop-timer", stopTimer)
session.patch("/api/sessions/:id/reset-timer", resetTimer)
session.delete("/api/sessions/:id", deleteSession)

export default session