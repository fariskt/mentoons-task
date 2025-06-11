import React from "react";
import type { User } from "../../types";

interface ConnectionButtonProps {
  isPending:boolean,
  user: User; 
  loggedUser: User | null;
  sendConnectionRequest: (userid : string)=> void
  selectConnectionId:string;
  hanldeChatPage:(user:User)=> void
}

const ConnectionButton: React.FC<ConnectionButtonProps> = ({ user, loggedUser, sendConnectionRequest, isPending, selectConnectionId, hanldeChatPage}) => {

  if (!loggedUser) {
    return null;
  }

  if (loggedUser._id === user._id) {
    return null;
  }
  const hasSentRequest = user?.connectionRequests.includes(loggedUser._id);
  const isConnected = loggedUser.connections.includes(user._id) || user.connections.includes(loggedUser._id);
  

  return (
    <>
      {hasSentRequest ? (
        <button
          disabled
          className="border border-[#EC9600] rounded-md py-2 px-2 md:w-32 w-28 md:text-base text-sm text-[#EC9600] font-medium opacity-50 cursor-not-allowed"
        >
          Request Sent
        </button>
      ) : isConnected ? (
        <button
          onClick={()=> hanldeChatPage(user)}
          className="border border-[#EC9600] rounded-md py-2 px-4 md:w-32 w-28 md:text-base text-sm text-[#EC9600] font-medium opacity-50 cursor-pointer"
        >
          Connected
        </button>
      ) : (
        <button
          onClick={() => sendConnectionRequest(user._id)}
          className="border border-[#EC9600] rounded-md py-2 px-4 cursor-pointer md:w-32 w-28 md:text-base text-sm text-[#EC9600] font-medium hover:bg-[#EC9600] hover:text-white"
        >
          {selectConnectionId === user._id && isPending ? "Connecting..." : "Connect"}
        </button>
      )}
    </>
  );
};

export default ConnectionButton;