import { generateTokenAndSetCookie } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"


export const signup = async (req,res) => {
    const { email,password,fullName } =req.body
    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            res.status(400).json({success:false,message:"User already exist"})
        }
        if(!email || !fullName || !password ){
            throw new Error("All fields Are required");
        }
        if(password.length<6){
            throw new Error("Password must be at least 6 characters");
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            email,
            password:hashedPassword,
            fullName,
        })
        if(user){
                generateTokenAndSetCookie(res,user._id);
                await user.save();
                res.status(201).json({success:true,message:"User created Successfully",user:{...user._doc,password:undefined}});
            } else {
                res.status(400).json({success:false,message:"Invalid User data",})
            }
    } catch (error) {
    res.status(500).json({success:false,message:error.message});
    }
}

export const login = async (req,res) => {
    const { email,password } = req.body;
    try {
        if(!email || !password){
            return res.status(400).json({success:false,message:"All fields are required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"Invalid Credentials"});
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({success:false,message:"Password is incorrect "});
        }
        generateTokenAndSetCookie(res,user._id);
        await user.save();
        res.status(200).json({success:true,message:"Login Successful",user:{...user._doc,password:undefined}});
    } catch (error) {
        console.log("Error in login Controller")
        res.status(500).json({success:false,message:"Internal Serve Error!"})
    }
};

export const logout = async (req,res) => {
        try {
    res.clearCookie("token");
    res.status(200).json({success:true,message: "Logged out successfully" });
    } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({success:false,message: "Internal Server Error" });
    }
        };


export const updateProfile = async (req,res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        if(!profilePic){
            return res.status(400).json({success:false,message:"Profile Pic is required"});
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
        res.status(200).json({success:true,message:"Profile Picture Updated Successfully",user: updatedUser})
    } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const  checkAuth = async (req,res) => {
    try {
        const user = req.user;
        if(!user){
            return res.status(400).json({ success: false, message: "User not found" });
        }
        res.status(200).json({success:true,user:{...user._doc,password:undefined}})
    } catch (error) {
        console.error("Error in checkAuth:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}