import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosInstance } from "../utils/AxiosInstance";
import { useAuthStore } from "../store/useAuthStore";
import { IoMdNotifications } from "react-icons/io";
import { IoIosMail } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import {
  useAcceptConnection,
  useConnectionRequests,
} from "../services/userService";
import type { User } from "../types";

const Navbar: React.FC = () => {
  const { setUser, user } = useAuthStore();
  const [showNotification, setShowNotification] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const queryClient = useQueryClient()
  const { data: connectRequesters, refetch } = useConnectionRequests();
  const { mutate: acceptMutation, isPending } = useAcceptConnection();
  const [selectedAcceptReq, setSelectedAcceptReq] = useState("");
  const navigate= useNavigate()

  const { data, isLoading , refetch:refetchLoggedUser} = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await AxiosInstance.get("/api/user/me");
      return res.data;
    },
  });

  useEffect(() => {
    if (!user) {
      setUser(data?.user || null);
    }
  }, [setUser, user, data]);

  const handleAcceptReq = (connectedUserID: string) => {
    setSelectedAcceptReq(connectedUserID);
    acceptMutation(connectedUserID, {
      onSuccess: () => {
        refetchLoggedUser()
        refetch();
        queryClient.invalidateQueries({queryKey: ["allusers"]})
        setShowNotification(false);
      },
    });
  };

  const logout = ()=>{
    navigate("/login")
    localStorage.clear()
  }

  if (isLoading || !user) {
    return <div>Loading....</div>;
  }

  return (
    <nav className="w-screen flex justify-between shadow-xl py-5 md:px-10 px-4">
      <div className="flex gap-3 md:gap-8 text-sm md:text-base">
        <Link to="/">Home</Link>
        <Link to="/freinds">Freinds</Link>
        <Link to="#">Groups</Link>
        <Link to="#">Products</Link>
      </div>
      <div className="md:space-x-5 space-x-2 flex">
        <span>
          <IoIosMail className="text-[#F7941D] text-xl" />
        </span>
        <span onClick={() => setShowNotification(!showNotification)}>
          <IoMdNotifications
            className={`${
              showNotification ? "text-amber-700" : "text-[#F7941D]"
            } text-xl cursor-pointer`}
          />
        </span>
        <span onClick={() => setShowProfile(!showProfile)}>
          <FaUserCircle  className={`${
              showProfile ? "text-amber-700" : "text-[#F7941D]"
            } text-xl cursor-pointer`} />
        </span>
      </div>
      {showProfile && (
        <div className="absolute right-5 top-20 bg-gray-200 rounded-md p-5 space-y-2 flex flex-col items-center">
          <h4>{user.username}</h4>
          <button onClick={logout} className="bg-red-600 text-white p-2 rounded-md">
            Logout
          </button>
        </div>
      )}
      {showNotification && (
        <div className="z-10 absolute right-5 bg-white shadow p-3 top-20 ">
          <h4 className="text-center my-3">Notifications</h4>
          <div>
            <h5 className="border-b border-b-gray-300 pb-2">Requests</h5>
          </div>
          <div>
            {connectRequesters.length > 0 ? (
              connectRequesters?.map((connection: User) => (
                <div className=" flex items-center gap-5 px-2 mt-3">
                  <div className="flex items-center">
                    <img
                      src={
                        connection.avatar ||
                        "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"
                      }
                      alt="user"
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <h4 className="text-sm">{connection.username}</h4>
                      <p className="md:text-sm text-xs">
                        Send you connection request
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAcceptReq(connection._id)}
                    className="border border-[#EC9600] rounded-md md:py-2 py-1 text-sm md:px-4 px-2 cursor-pointer text-[#EC9600] font-medium hover:bg-[#EC9600] hover:text-white"
                  >
                    {selectedAcceptReq === connection._id && isPending
                      ? "Accepting"
                      : "Accept"}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm mt-5">No requests yet</p>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
