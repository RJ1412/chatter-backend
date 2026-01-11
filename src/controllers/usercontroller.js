import prisma from "../lib/db.js";
import cloudinary from "../lib/cloudinary.js";

export const updateprofile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userid = req.user.id;
        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser = await prisma.user.update({
            where: {
                id: userid
            },
            data: {
                profilePic: uploadResponse.secure_url
            },
        })
        res.status(201).json(updateUser)
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

export const getUsersSideBar = async (req, res) => {
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
                Password: false
            },
        })
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const getUsersByName = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const { fullname } = req.body
        const filteredUsers = await prisma.user.findMany({
            where: {
                fullName: {
                    startsWith: fullname,
                    mode: "insensitive",
                },
                NOT: {
                    id: loggedInUserId,
                },
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                profilePic: true,
                Password: false
            },
        });
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
