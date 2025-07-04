import User from "../models/user.js";
import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
export const getUsersForSidebar = async (req,res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne: loggedInUserId}}).select("-password");

        res.status(200).json({success:true,message:"users fetched Correctly",filteredUsers});
        
    } catch (error) {
        console.log("Error in getUsersForSidebar controller",error);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}

export const getMessages = async (req,res) => {
    try {
        const { id:userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        });
        res.status(200).json({success:true,message:"Messages Fetched Successfully",messages});
    } catch (error) {
        console.log("Error in getMessage controller",error);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}

export const sendMessage = async (req,res) => {
    try {
        const { text,image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        });
        await newMessage.save();
        // real time logic here
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({success:true,message:"message sended successfully",newMessage});
    } catch (error) {
        console.log("Error in sendMessage controller",error);
        res.status(500).json({success:false,message:error.message});
    }
}