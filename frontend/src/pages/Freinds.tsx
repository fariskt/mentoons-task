import { MdKeyboardBackspace } from "react-icons/md";
import type { User } from "../types";
import {
  useGetAllusers,
  useSendConnectionRequest,
} from "../services/userService";
import { useAuthStore } from "../store/useAuthStore";
import ConnectionButton from "../utils/ui/ConnectionButtons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Freinds = () => {
  const { user: loggedUser } = useAuthStore();
  const { data: allusers, refetch, isLoading } = useGetAllusers();
  const navigate = useNavigate()
  const [selectConnectionId, setSelectConnectionId] = useState("")

  const { mutate, isPending } = useSendConnectionRequest();
  const sendConnectionRequest = (targetUserId: string) => {
    setSelectConnectionId(targetUserId)
    mutate(targetUserId, {
      onSuccess: () => {
        refetch();
      },
    });
  };
  const hanldeChatPage =(connectionId:string)=> {
    const isConnected = loggedUser?.connections.includes(connectionId)
    if(isConnected){
      navigate(`/chat/${connectionId}`)
    }else{
      return
    }
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-10 md:ml-10 mx-5">
      <div className="flex items-center gap-5">
        <span>
          <MdKeyboardBackspace size={30} />
        </span>
        <h1 className="md:text-2xl">Connect with like-minded parents</h1>
      </div>
      <div className="flex flex-col gap-5 items-center mt-10">
        {allusers &&
          allusers?.map((user: User) => (
            <div
              key={user._id}
              className="flex justify-between items-center w-full max-w-xl"
            >
                <div className={`${user.connections.includes(loggedUser?._id || "") ? "cursor-pointer" : ""} flex items-center gap-2`} onClick={()=> hanldeChatPage(user._id)} >
                  <img
                    src={
                      user.avatar ||
                      "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"
                    }
                    className="h-14 w-14 rounded-full"
                    alt="user-pic"
                  />
                  <div>
                    <h4>{user.username}</h4>
                    <p className="text-sm text-gray-500">{user.about}</p>
                    <p className="text-xs text-gray-500  mt-1">
                      {user.createdAt &&
                        new Date(user.createdAt).toLocaleString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                    </p>
                  </div>
                </div>
              <ConnectionButton
                isPending={isPending}
                selectConnectionId={selectConnectionId}
                user={user}
                loggedUser={loggedUser}
                sendConnectionRequest={sendConnectionRequest}
                hanldeChatPage={hanldeChatPage}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Freinds;
