import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedLayout from "./layouts/ProtectRoute";
import { Toaster } from "react-hot-toast";
import Freinds from "./pages/Freinds";
import Chat from "./pages/Chat";

function App() {
  return (
    <>
    <Toaster position="top-right"/>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Freinds />} />
        <Route path="/chat/:connectionId" element={<Chat />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
