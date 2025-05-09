"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth = (0, express_1.Router)();
auth.post("/register", authController_1.register);
auth.post("/login", authController_1.login);
auth.post("/logout", authController_1.logout); // Token-based logout is frontend responsibility
exports.default = auth;
