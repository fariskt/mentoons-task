import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const ProtectedLayout: React.FC = () => {
  const token = localStorage.getItem("isLogin");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default ProtectedLayout;
