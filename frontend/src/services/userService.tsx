import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "../utils/AxiosInstance";

export const useSendConnectionRequest = () => {
  return useMutation({
    mutationFn: async (targetId:string) => {
      const res = await AxiosInstance.post("/api/user/send-connection/request", {targetUserId : targetId});
      return res.data;
    },
  });
};

export const useGetAllusers =()=> {
  return useQuery({
    queryKey: ["allusers"],
    queryFn: async () => {
      const res = await AxiosInstance.get("/api/user/allusers");
      return res.data.data;
    },
  });
} 

export const useConnectionRequests =()=> {
  return useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => {
      const res = await AxiosInstance.get("/api/user/connection/requests");
      return res.data?.requesters;
    },
  });
} 
export const useAcceptConnection =()=> {
  return useMutation({
    mutationFn: async (senderId:string) => {
      const res = await AxiosInstance.post("/api/user/connection/approve", {senderId});
      return res.data;
    },
  });
} 

