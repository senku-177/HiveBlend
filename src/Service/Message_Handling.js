import { useState,useEffect } from "react";
import { useContext } from "react";
import { SocketContext } from "../sockets/SocketContext";


function Message_Handling({setGroupMessages, fetchUserList, groupMessages}){
const socket= useContext(SocketContext);
const max_Messages=100;
const username=socket.socket.auth.username;

//message pruning 
useEffect(()=>{
    if(groupMessages.length>max_Messages){
        setGroupMessages(prev=>prev.slice(prev.length-max_Messages));
    }}
,[groupMessages]);


//recieving a new common room message
socket.socket.off("room-msg").on("room-msg",(data)=>{
    
    if(data.username==username){
        return;
    }
    const newMessage={sender:data.username, content: data.content};

    setGroupMessages((prev)=>[...prev,newMessage])
});

//a new user joined to the room
socket.socket.off("user-joined").on("user-joined",(username)=>{

    const newMessage={sender:"server",content: `Welcome ${username} to the chat`};
    setGroupMessages((prev)=>[...prev,newMessage]);
    fetchUserList();
    
    
})
// welcome the new user

socket.socket.off("room-connected").on("room-connected",()=>{
    setGroupMessages((prev)=>[...prev,{sender:"server",content:"Connected to the chat"}])
    fetchUserList();
})


//a user left the room

socket.socket.off("user-left").on("user-left",(username)=>{
    setGroupMessages((prev)=>[...prev,{sender:"server",content:`${username} left the chat`}]);
    fetchUserList();
})

}

export default Message_Handling;        
