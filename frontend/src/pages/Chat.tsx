import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { AxiosInstance } from "../utils/AxiosInstance";
import { getSocket } from "../utils/socket";
import { useAuthStore } from "../store/useAuthStore";
import type { Message } from "../types";

const Chat: React.FC = () => {
  const { connectionId } = useParams();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = getSocket();
  const chatRef = useRef<HTMLDivElement | null>(null);

  const { data: connectedUser } = useQuery({
    queryKey: ["fetchUserById"],
    queryFn: async () => {
      const res = await AxiosInstance.get(`/api/user/${connectionId}`);
      return res.data?.user;
    },
    enabled: !!connectionId,
  });

  useEffect(() => {
    if (!user?._id) return;
    socket.emit("user_connected", user._id);

    return () => {
      socket.off();
    };
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id || !connectionId) return;

    const fetchChat = async () => {
      try {
        const response = await AxiosInstance.get(`/api/chat/${connectionId}`);

        setMessages(response.data?.messages);
      } catch (error) {
        console.error("Error fetching or marking chat as read:", error);
      }
    };

    fetchChat();
  }, [connectedUser, user?._id, setMessages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !connectionId || !user?._id) return;

    const messageData: Message = {
      senderId: user._id,
      receiverId: connectionId,
      text: newMessage,
      timestamp: new Date(),
    };

    socket.emit("send_message", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage("");
  };

  useEffect(() => {
    if (!user?._id) return;

    const handleReceiveMessage = (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [user?._id]);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, connectedUser?._id, user?._id, chatRef]);

  return (
    <div className="w-full ">
      <div className="ml-5 mt-5 flex items-center gap-2  border-b border-b-gray-300 pb-5 ">
        <Link to="/">
          <span>
            <MdKeyboardBackspace size={30} />
          </span>
        </Link>
        <img
          className="h-10 md:h-12 md:w-12 w-10 rounded-full"
          src={
            connectedUser?.avatar ||
            "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"
          }
          alt=""
        />
        <h1 className="md:text-xl font-semibold">{connectedUser?.username}</h1>
      </div>
      <div className="mx-5 md:mx-20 my-5 md:max-h-[450px] max-h-[380px] overflow-y-auto hide-scrollbar">
        {messages.length > 0 ? (
          messages?.map((msg: Message, index, arr) => {
            const isSender = msg.senderId === user?._id;
            const prevMsg :Message = arr[index - 1];
            const isSameSender = prevMsg && prevMsg.senderId === msg.senderId;

            return (
              <div
                key={index}
                className={`flex gap-3 ${
                  isSender ? "justify-end mb-2" : "mb-2"
                }`}
              >
              
               

                <div className={`${isSender ? "items-end" : ""} flex flex-col`}>
                  <div
                    className={`flex flex-row items-end gap-2 ${
                      isSameSender && !isSender && "ml-10"
                    }  px-2 py-2 ${
                      isSender
                        ? "bg-[#FABB05] text-white rounded-md"
                        : "bg-[#F2F2F2]   text-black rounded-md"
                    }`}
                  >
                    <p className="max-w-md">{msg.text}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center">No messages yet.</p>
        )}
        <div ref={chatRef}></div>
      </div>
      <div className="fixed bottom-5 w-full flex justify-center gap-3 md:px-20 px-5">
        <input
          placeholder="Type something here..."
          type="text"
          className="placeholder:text-sm border outline-none rounded-md w-full pl-2 py-2 border-gray-300"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          name="message"
        />
        <button
          onClick={sendMessage}
          className="bg-[#EC9600] p-1 rounded-md text-sm text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
