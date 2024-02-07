import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../sockets/SocketContext";
import ChatTemplate from '../template/ChatTemplate';
import { IoClose } from "react-icons/io5";



function Rooms(){

    const socket= useContext(SocketContext);
    
    const username= socket.socket.auth.username;
    const [message, setMessage] = useState('');
    const [chatMessages,setChatMessages]= useState([]);
    const [userList,setUserList]=useState([]);
    const [connectedUser,setConnectedUser]=useState([]);
    const [connectTo,SetConnectTo]=useState("chat-room");
    const [privateChats,setPrivateChats]=useState([]);

  

    const handleSendMessage = async () => {
      if(!message||message==""){
        return 
      }

      if(connectTo=="chat-room"){
        console.log("message: ",message);

        socket.socket.emit('room-message',{msg:message});
        setChatMessages((prev)=>[...prev,{sender:username,content:message}]);}

      else{
        await socket.socket.emit("private-message",{msg:message,sendto:connectTo});
        setTimeout(()=>{
          fetchChat(connectTo);
        },100);
        
        console.log(connectTo);
      }
        setMessage('');
        
    }; 

    function handleKeyDown(event){
        if(event.key=="Enter"){
           handleSendMessage();
        }
       
    }   

    socket.socket.off("user-joined").on("user-joined",(username)=>{

        const newMessage={sender:"server",content: `Welcome ${username} to the chat`};
        setChatMessages((prev)=>[...prev,newMessage]);
        fetchUserList();
    })

    socket.socket.off("room-connected").on("room-connected",()=>{
        setChatMessages((prev)=>[...prev,{sender:"server",content:"Connected to the chat"}])
        fetchUserList();
    })

    function fetchUserList(){
        socket.socket.emit("user-list");
        socket.socket.on("user-list",(list)=>{
            setUserList(list);
        }) 
    }

    socket.socket.off("room-msg").on("room-msg",(data)=>{
    
        if(data.username==username){
            return;
        }
        const newMessage={sender:data.username, content: data.content};

        setChatMessages((prev)=>[...prev,newMessage])
    });
  
    
  const messageCountManage=(user)=>{
    setConnectedUser((prev)=>{
      const index = connectedUser.findIndex((us)=>us.name=user);
      if (index !== -1) {
        const updatedUsers = [...prev];
        updatedUsers[index].num =0;
        return updatedUsers;
      } else {
        // If the user doesn't exist, add them to the connected users array
        return [...prev, { name: user, num: 0 }];
      }


    })
  }

  const handleUserClick = (user) => {
      if(user==username){
        return
      }
     messageCountManage(user);
     
    
      socket.socket.emit("userChat",user);
      SetConnectTo(user);

  };

  socket.socket.off("userChat").on("userChat",(chat)=>{
    setPrivateChats(chat);
  });

  function chatRoomSelected(){
    SetConnectTo("chat-room");
  }

  socket.socket.off("user-disconnected").on("user-disconnected",()=>{
    setPrivateChats((prev)=>[...prev,{sender:"server",msg:"user is disconnected"}]);
  })
  
  socket.socket.off("new-message").on("new-message",(username)=>{
    console.log("socket",username);
    const h=connectedUser.find((user)=>user.name==username);
    if(h){
      setConnectedUser((prev)=>{
        const index= connectedUser.findIndex((user)=>user.name==username);
        const updated=[...prev];

        ++updated[index].num;
        return updated;

      })
      
      
    }
    else{
      setConnectedUser((prev)=>[...prev,{name:username,num:1}]);
  
    } 
    if(connectTo==username){
      fetchChat(username);
      messageCountManage(connectTo);
    }
    
  })

  function fetchChat(user){
    console.log("fetchchat:" ,user);
    socket.socket.emit("userChat",user);
  }

  function closeChat(user){
    console.log("hiiuih");
    socket.socket.emit("close-chat",user);
    const index = connectedUser.findIndex((us)=>us.name==user);
    if(index>-1){
      connectedUser.splice(index,1);
    }

  }
  
  

    return (
      
        <div className="flex h-full overflow-y-hidden">
        {/* Left Sidebar */}
        <div className="w-1/4 bg-gray-300 p-4">
          <div className="font-bold text-xl mb-4">Channel Name</div>
          <div className="text-gray-700">Connected as {username}</div>
          <div className="text-black-500 text-large">Messages</div>
          <div className="flex flex-col h-full overflow-y-scroll w-full">
            <div className="flex justify-between px-2 py-2 w-full" onClick={chatRoomSelected}>Chat room</div>
           { connectedUser.map((user)=>( 
              <li key={user} className="cursor-pointer flex justify-between px-2 py-1 w-full" onClick={()=>handleUserClick(user.name)}>{user.name} 
                <div className="flex">
                  <p className="text-large text-black-500 ">{user.num}</p>
                <IoClose className="mt-1 z-20" onclick={()=>closeChat(user)}/>
                </div>
              </li>
              
            ))}
          </div>
        </div>
  
        {/* Central Chat Area */}
        <div className="flex flex-col justify-between w-1/2 bg-gray-100 p-4">
          {/* Chat Header */}
          <div className="font-bold text-xl mb-4">Chat Room</div>
  
         
          <ChatTemplate chatMessages={connectTo=="chat-room"?chatMessages:privateChats} username={username}/>
  
          {/* Message Input Block */}
          <div className="mt-4 flex gap-2 justify-center items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-2 border rounded"
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded">
              Send
            </button>
          </div>
        </div>
  
        {/* Right Sidebar */}
        <div className="w-1/4 bg-gray-300 p-4">
          <div className="font-bold text-xl mb-4">Connected Users</div>
          <ul>
            {userList.map((user) => (
              <li key={user} className="cursor-pointer text-blue-500" onClick={() => handleUserClick(user)}>
                {user}
              </li>
            ))}
          </ul>
        </div>
      </div>
  

    )
    


    


}

export default Rooms;
