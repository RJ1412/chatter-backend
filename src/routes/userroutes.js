import { Router } from "express"
import { updateprofile, getUsersSideBar, getUsersByName } from "../controllers/usercontroller.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";

export const userroute = Router()

userroute.put('/update-profile', authMiddleware, updateprofile)
userroute.get('/sidebar', authMiddleware, getUsersSideBar)
userroute.post('/search', authMiddleware, getUsersByName)
