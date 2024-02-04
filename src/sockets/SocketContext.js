import { io } from "socket.io-client";
import { createContext,useEffect,useState } from "react";

export const SocketContext = createContext();


export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:9000', { autoConnect: false }); // Replace with your server URL
    console.log(newSocket);
    setSocket(newSocket);
    
    // newSocket.on("connect",()=>{
    //     console.log("socket connected");
    // });

   
    // Cleanup function to handle disconnections
    return () => newSocket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
