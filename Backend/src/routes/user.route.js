import express from "express";
import { getUser, loginUser, logOut, registrationUser } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";


const router = express.Router()

router.post("/register", registrationUser )
router.post("/login", loginUser )
router.get("/me",isAuthenticated, getUser )
router.get("/logout",isAuthenticated ,logOut)

export default router;