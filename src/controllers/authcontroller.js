import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import prisma  from "../lib/db.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req,res) => {
 const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

   const user_check = await prisma.user.findUnique({
  where: {
    email: email,
  },
})

    if (user_check) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
const user = await prisma.user.create({
  data: {
    fullName, 
    email, 
    Password : hashedPassword
  }
})
if (user) {
  await generateToken(user.id, res) ;
  res.status(201).json({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      });
} else {
      res.status(400).json({ message: "Invalid user data" });
    }
} catch(e) {
   console.log("Error in signup controller", e.message);
    res.status(500).json({ message: "Internal Server Error" });
}
}

export const login = async(req,res) => {
  const { email, password } = req.body;
   try {
    const user = await prisma.user.findUnique({
    where: {
    email: email,
  }})
  if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.Password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
     generateToken(user.id, res);
      res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
} catch(error) {
      console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
   }
}

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateprofile = async(req,res) => {
 try {
  const {profilePic} = req.body ;
  const userid = req.user.id ;
  if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }
  const uploadResponse = await cloudinary.uploader.upload(profilePic);
  const updateUser = await prisma.user.update({
  where: {
   id : userid 
  },
  data: {
    profilePic : uploadResponse.secure_url  // secure_url is the image hosted url returned by cloudinary
  },
})
res.status(201).json(updateUser)
 } catch(error) {
  res.json({
    message : error.message
  })
 }
}

export const checkauth = async(req,res) => {
    try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}