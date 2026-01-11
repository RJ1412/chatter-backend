import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config()
export const generateToken = async(userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: 60*60*1000,
  });

  res.cookie("jwt", token, {
    maxAge: 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "None", // CSRF attacks cross-site request forgery attacks
    secure: true,
  });

  return token;
};