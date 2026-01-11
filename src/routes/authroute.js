import { Router } from "express"
export const authroute = Router()
import { signup } from "../controllers/authcontroller.js";
import { login } from "../controllers/authcontroller.js";
import { logout } from "../controllers/authcontroller.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { updateprofile } from "../controllers/authcontroller.js";
import { checkauth } from "../controllers/authcontroller.js";
import { app } from "../lib/socket.js";
import cors from "cors"
authroute.get('/', (req, res) => {
  try {
    res.json({ msg: "hello world" });
  } catch (error) {
    res.json({ msg: error.message })
  }
})



authroute.post('/signup', signup);
authroute.post('/login', login);
authroute.post('/logout', logout);
authroute.put('/update-profile', authMiddleware, updateprofile)
authroute.get('/check', authMiddleware, checkauth)
