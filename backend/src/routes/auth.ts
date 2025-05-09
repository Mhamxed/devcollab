import { Router } from "express";
import { register, login, logout } from "../controllers/authController";

const auth = Router();

auth.post("/register", register);
auth.post("/login", login);
auth.post("/logout", logout); // Token-based logout is frontend responsibility

export default auth;
