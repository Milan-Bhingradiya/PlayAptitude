"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import io, { Socket } from "socket.io-client";

// Define the context type
interface SocketContextType {
  socket: Socket;
  set_opponent_socketId: (id: string) => void;
  opponent_socketId: string;
  setopponent_userName: (id: string) => void;
  opponent_userName: string;
  setMyUserName: (name: string) => void;
  myUserName: string;
  is_iam_webRtcInitiator: boolean;

  setis_iam_webRtcInitiator: (value: boolean) => void;
}

// Create the socket context
export const socketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const socket = useContext(socketContext) as SocketContextType;
  return socket.socket;
};

interface Props {
  children: ReactNode;
}

export const SocketDataProvider = ({ children }: Props) => {
  const socket = useMemo(() => {
    console.log("connecting to socket");
    return io(
      process.env.NEXT_PUBLIC_BASE_URL ??
        "https://playaptitude-8c12786fd48c.herokuapp.com"
    );
  }, []);

  const [opponent_socketId, setopponent_socketId] = useState("");
  const [opponent_userName, setopponent_userName] = useState("");
  const [myUserName, setMyUserName] = useState("");

  const [is_iam_webRtcInitiator, setis_iam_webRtcInitiator] = useState(false);

  const set_opponent_socketId = (id: string) => {
    setopponent_socketId(id);
  };

  return (
    <socketContext.Provider
      value={{
        socket,
        set_opponent_socketId,
        opponent_socketId,
        opponent_userName,
        setopponent_userName,
        myUserName,
        setMyUserName,
        is_iam_webRtcInitiator,
        setis_iam_webRtcInitiator,
      }}
    >
      {children}
    </socketContext.Provider>
  );
};
