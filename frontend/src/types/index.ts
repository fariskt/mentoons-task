export interface User {
  _id: string;
  username: string;
  email: string;
  about?: string;
  avatar?: string;
  createdAt: Date;
  connections: string[];
  connectionRequests: string[];
}

export interface LoginData {
  email: string;
  password: string;
}
export interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface Message {
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string | Date;
}
