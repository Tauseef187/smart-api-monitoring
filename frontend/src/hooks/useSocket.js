import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useSocket(enabled) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const nextSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      autoConnect: false,
    });

    setSocket(nextSocket);

    return () => {
      nextSocket.disconnect();
      setSocket(null);
    };
  }, [enabled]);

  return socket;
}

