import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SpinnerLoader from "../Loader/SpinnerLoader";

const DashboardLayout = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCEF]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <SpinnerLoader />
          <p className="text-gray-500 text-sm font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <Navbar />
      <div>{children}</div>
    </div>
  );
};

export default DashboardLayout;