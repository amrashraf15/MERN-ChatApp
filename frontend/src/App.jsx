import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SettingPage from "./pages/SettingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore.js";

const App = () => {
  const { authUser, checkAuth,isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
    useEffect(() => {
        checkAuth();
    },[checkAuth]);
    if (isCheckingAuth && !authUser){
      return <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin" />
      </div>
    }
  return (
    <div data-theme={theme}>
        <Navbar/>
      <Routes>
        <Route path="/" element={authUser ?<HomePage/> :<Navigate to="/login"/>}/>
        <Route path="/signup" element={!authUser ? <SignUpPage/> :<Navigate to="/"/>}/>
        <Route path="/login" element={!authUser ? <LoginPage/>:<Navigate to="/"/>}/>
        <Route path="/settings" element={<SettingPage/>}/>
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>

      </Routes>
      <Toaster
  toastOptions={{
    duration: 4000, // customize duration
    className: 'shadow-md border rounded-lg p-4 text-sm',
    style: {
      background: 'hsl(var(--b1))',
      color: 'hsl(var(--bc))',
      border: '1px solid hsl(var(--b2))',
    },
    success: {
      iconTheme: {
        primary: 'hsl(var(--su))',  // success color
        secondary: 'hsl(var(--b1))', // matches current background
      },
    },
    error: {
      iconTheme: {
        primary: 'hsl(var(--er))',  // error color
        secondary: 'hsl(var(--b1))',
      },
    },
  }}
/>

    </div>
  )
}

export default App
