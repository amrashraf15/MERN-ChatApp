import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api/auth" : "/api/auth";
axios.defaults.withCredentials = true;
const BASE_URL = API_URL.replace("/api/auth", ""); 

export const useAuthStore = create((set,get) => ({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:false,
    onlineUsers:[],
    socket:null,

    checkAuth: async () =>{
        set({isCheckingAuth:true})
        try {
            const res = await axios.get(`${API_URL}/check`);
            set({authUser:res.data.user});
            get().connectSocket();
            
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        }finally{
            set({ isCheckingAuth: false});
        }
    },
    signup: async (data) =>{
        set({isSigningUp:true})
        try {
            const res = await axios.post(`${API_URL}/signup`,data);
            set({authUser:res.data.user});
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({ isSigningUp: false });
        }
    },
    login: async (email,password) => {
        set({isLoggingIn:true})
        try {
            const res = await axios.post(`${API_URL}/login`,{email,password});
            console.log("authUser : ",res.data.user);
            set({authUser:res.data.user});
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            console.log("Error in login:", error);
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn:false});
        }
    },
    logout: async () =>{
        
        try {
            await axios.post(`${API_URL}/logout`);
            set({authUser:null})
            toast.success("Logged out successfully");  
            get().disconnectSocket();
            
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    updateProfile: async (data) => {
        set({isUpdatingProfile:true})
        try {
            const res = await axios.put(`${API_URL}/update-profile`,data);
            set({authUser:res.data.user});
            toast.success('Profile updated successfully');
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
        }finally{
            set({isUpdatingProfile:false})
        }
    },
    connectSocket: async () => {
        const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
    },
    disconnectSocket: async () => {
        if (get().socket?.connected) get().socket.disconnect();
    }   

}));