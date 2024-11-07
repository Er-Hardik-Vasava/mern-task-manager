import express from "express"
import { createTask, getMyTask, deleteTask, updateTask, getAllTask,toggleTaskStatus } from "../controllers/task.controller.js"
import { isAuthenticated } from "../middlewares/auth.middleware.js"


const router = express.Router()

router.post("/add", isAuthenticated, createTask)
router.get("/my", isAuthenticated, getMyTask)
router.delete("/delete/:id", isAuthenticated, deleteTask)
router.put("/update/:id", isAuthenticated, updateTask)
router.get("/all", isAuthenticated, getAllTask)
router.patch('/toggle-status/:id', toggleTaskStatus);


export default router