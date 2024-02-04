import { useState,useContext,useRef, useEffect } from "react";
// import {socket} from "./Home";
import Loading from "./Loading";
import { SocketContext } from "../sockets/SocketContext";

function ChatRoom(){
    const chatContainerRef = useRef(null);
    const [matching,setMatching]=useState(true);
    const [chatMessages,setChatMessages]=useState([]);

    const[disconnect,setDisconnect]= useState(true);
    const socket=useContext(SocketContext);

    
    console.log('connected',socket);
    const [Message,setMessage]= useState("");
    
    
    function messageChangeHandler(event){
        setMessage(event.target.value);
        console.log(Message);

    }

    useEffect(()=>{
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    },chatMessages)
    
    
    function messageButton(event){
       
        if(!Message||Message==""){
            return;
        }
        const newMessage={sender:"user",content: Message};

        socket.socket.emit("message",{Message:Message, toId:socket.socket.connectedTo});
        setChatMessages((prev)=>[...prev,newMessage]);
        setMessage("");
    }


    socket.socket.on("matchSuccess",({success,connectedTo,toUsername})=>{
        if(success){
            console.log("Match found",toUsername);
            setMatching(false);
            socket.socket.connectedTo=connectedTo;
            socket.socket.toUsername=toUsername;
            setDisconnect(true);

            
        }
        else{
            console.log("waiting");
            setMatching(true);
        }
    })

    function newConnectionHandler(){
        
        setMatching(true);
        setDisconnect(true);
        socket.socket.emit('rematch');
    }   

    function disconnectHandler(){
        setDisconnect(false);
        socket.socket.emit("break",socket.socket.connectedTo);
        setChatMessages([]);
        socket.socket.connectedTo=null;
        socket.socket.toUsername=null;
        
    }

    socket.socket.off("server-timeout").on("server-timeout",()=>{
        setChatMessages((prev)=>[...prev,{sender:"user",content:"server-timedout"}]);
        disconnectHandler(); 

    })

    socket.socket.on("break",()=>{
        setDisconnect(false);
        setChatMessages([]);
        console.log("no response");
        setDisconnect(false);

    })


    socket.socket.off("private-message").on("private-message",(obj)=>{
        const newMessage={sender:"priv",content: obj.message};
        setChatMessages((prev)=>[...prev,newMessage]);
        console.log("chat:",chatMessages);
        console.log(newMessage);
        console.log("rec: ",obj);
    })

    function handleKeyDown(event){
        if(event.key=="Enter"){
           messageButton(); 
        }
       
    }   

    return (
        <div className="flex flex-col h-full bg-gray-300 items-center justify-between">
        {matching && (
          <div className="mb-auto mt-[300px]">
            <Loading />
          </div>
        )}
      
        <div id='chatting-space' className="flex flex-col w-full h-max overflow-y-scroll scroll-hidden" ref={chatContainerRef}>
          {
            chatMessages.map((message,index)=>(
                <div
                    key={index} className={` flex items-end mb-2 ${message.sender=="user"?"justify-end":"justify-start"}`}>
                        <div  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                message.sender === "user" ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                            <p className={` capitalize font-bold mb-1 text-xs ${message.sender=="user"? "text-yellow-400":"text-yellow-600"}`}>{message.sender=="user"? "me" :socket.socket.toUsername}</p>
                            <p className="text-lg">{message.content}</p>
                        </div>

                </div>
            ))
          }
        </div>
      {!disconnect&&<div className="justify center text-center">
        <p className="text-green-700 text-2xl">Hope you had a great time!</p>
        <h4 className="text-red-500 text-xl"> Reconnect to chat to a new user </h4>
      </div>}
        <div className="flex w-full h-[60px] px-2 p-2 bg-gray-400 items-top">
  <div className="flex w-full h-[40px] border rounded-xl relative">
    <button className="w-1/12 h-full border bg-red-300 rounded-xl absolute left-0" onClick={disconnect ? disconnectHandler : newConnectionHandler}>
      {disconnect ? "Disconnect" : "New"}
    </button>

    <input
      className="flex-grow w-full h-full p-2 focus:outline-none rounded-xl px-[150px]"
      type="text"
      placeholder="Write your message"
      name="message"
      value={Message}
      required
      onKeyDown={handleKeyDown}
      onChange={messageChangeHandler}
      disabled={matching||!disconnect}
    />

    <button className= {`w-1/12 h-full border ${disconnect? "bg-green-300" :"bg-green-100"} rounded-xl absolute right-0`} onClick={messageButton} disabled={!disconnect}>
      Send
    </button>
  </div>
</div>

      </div>
      
)
}

export default ChatRoom;