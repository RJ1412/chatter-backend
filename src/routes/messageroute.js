import { Router } from "express"
export const msgroute = Router()
import { getUsersByName, getUsersSideBar } from "../controllers/messagecontroller.js";
import { getMessages } from "../controllers/messagecontroller.js";
import { sendMessage } from "../controllers/messagecontroller.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";

msgroute.get("/users",authMiddleware,getUsersSideBar) ;
msgroute.get("/:id", authMiddleware, getMessages) ;
msgroute.post("/send/:id",authMiddleware, sendMessage)
msgroute.post("/searchuser",authMiddleware,getUsersByName)
