import { msgroute } from "../routes/messageroute.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import prisma from "../lib/db.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";

export const getUsersSideBar = async(req,res) => {
    try {
    const loggedInUserId = req.user.id;
    const filteredUsers = await prisma.user.findMany({
  where: {
    OR: [
      {
        messagesReceived: {
          some: {
            senderId: loggedInUserId,
          },
        },
      },
      {
        messagesSent: {
          some: {
            receiverId: loggedInUserId,
          },
        },
      },
    ],
  },
  select: {
    id: true,
    fullName: true,
    email: true,
    profilePic: true,
    Password : false
  },
})
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}


export const getUsersByName = async(req,res) => {
    try {
    const loggedInUserId = req.user.id;
    const {fullname} = req.body
   // console.log(fullname)
    const filteredUsers = await prisma.user.findMany({
    where: {
      fullName: {
        startsWith: fullname,
        mode: "insensitive", // case-insensitive search
      },
      NOT: {
        id: loggedInUserId, // exclude the logged-in user from results
      },
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      profilePic: true,
      Password : false
    },
  });
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user.id;

   const messages = await prisma.message.findMany({
  where: {
    OR: [
      {
        senderId: myId,
        receiverId: userToChatId,
      },
      {
        senderId: userToChatId,
        receiverId: myId,
      },
    ],
  },
});

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: id } = req.params; // Receiver Id
   // console.log(id) ;
    const senderId = req.user.id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await prisma.message.create({
      data : { senderId,
      receiverId : id,
      text,
      image: imageUrl
      } 
    });
    const receiverSocketId = await getReceiverSocketId(id) ;
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage) ;
    }
   // console.log(newMessage)
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};