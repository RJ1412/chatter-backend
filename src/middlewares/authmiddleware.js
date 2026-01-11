import dotenv from "dotenv";
import  prisma  from "../lib/db.js";
import jwt from "jsonwebtoken";
dotenv.config()
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized – No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized – Invalid Token" });
    }

 const { password, ...user } = await prisma.user.findUnique({  // ...user includes everyfield except password
  where: { id: decoded.userId },
});

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};