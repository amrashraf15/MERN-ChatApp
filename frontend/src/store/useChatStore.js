import { create } from "zustand"
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";



const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api/message" : "/api/message";
axios.defaults.withCredentials = true;

export const useChatStore = create((set,get) => ({
    isUsersLoading:false,
    messages: [],
    users: [],
    selectedUser:null,
    isMessagesLoading:false,

    getUsers: async () => {
        set({isUsersLoading:true})
        try {
            const res = await axios.get(`${API_URL}/users`);
            set({users:res.data.filteredUsers});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUsersLoading:false});
        }
    },
    getMessages: async (userId) => {
        set({isMessagesLoading:true});
        try {
            const res = await axios.get(`${API_URL}/${userId}`);
            set({messages:res.data.messages});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesLoading:false});
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axios.post(`${API_URL}/send/${selectedUser._id}`,messageData);
            set({messages: [...messages,res.data.newMessage]});
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },



    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));