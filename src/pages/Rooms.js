import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../sockets/SocketContext";
import ChatTemplate from '../template/ChatTemplate';
import { IoClose } from "react-icons/io5";
import Message_Handling from "../Service/Message_Handling";
import { FaCircle } from "react-icons/fa";
import { FaImage,FaPaperPlane  } from 'react-icons/fa';



function Rooms(){

        const socket= useContext(SocketContext);
      
        const username= socket.socket.auth.username;

        const [message, setMessage] = useState('');
        const [groupMessages,setGroupMessages]= useState([]);
        const [userList,setUserList]=useState([]);
        const [connectedUser,setConnectedUser]=useState(new Map());
        const [connectTo,SetConnectTo]=useState("chat-room");
        const [privateChats,setPrivateChats]=useState([]);

      // room message send
      const handleMessageSendRoom = async()=>{
          if(!message||message==""){
            return 
          }
          socket.socket.emit('room-message',{msg:message});
          setGroupMessages((prev)=>[...prev,{sender:username,content:message}]);
          setMessage('');
          
      }

      //send private message
        const handleSendPrivMessage = async () => {
          if(!message||message==""){
            return 
          }
          


            await socket.socket.emit("private-message",{msg:message,sendto:connectTo});
            setTimeout(()=>{
              fetchChat(connectTo);
            },100);
            
            console.log(connectTo);
          
            setMessage('');
            
        }; 

        function handleKeyDown(event){
            if(event.key=="Enter"){
              (connectTo=='chat-room')?handleMessageSendRoom():handleSendPrivMessage();
            }
          
        }   

      
    // gets user list from redis server
        function fetchUserList(){
            socket.socket.emit("user-list");
            
            socket.socket.on("user-list",(list)=>{
              console.log(list);
                setUserList(list);
            }) 
            
        }


      
        
      const messageCountManage=(user)=>{
        setConnectedUser((prev)=>{
          const map = new Map(prev);
          map.set(user,0);
          return map;
          
        })
          
      }

    // managing users connected to 
      const handleUserClick = (user) => {
        
          if(user==username){
            return
          }
        messageCountManage(user);
        
        
          socket.socket.emit("userChat",user);
          SetConnectTo(user);
          if(!connectedUser.has(user)){
            const map = new Map(connectedUser);
            map.set(user,0);
            setConnectedUser(map);
          }
          console.log("connected users",connectedUser.entries());

      };

      async function handleImageUpload(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        if(!file){
          return
        }

        reader.readAsArrayBuffer(file);
        reader.onload = async () => {

          const imageData= reader.result;
          handleImageSend(imageData);
      }
      reader.onerror = (error) => {
        console.error('Error reading image:', error);
      };

      
    }
    const handleImageSend = async (imageData) => {
      console.log("image send",imageData);
      if(connectTo=="chat-room"){
        socket.socket.emit("room-message-image",{msg:imageData});
      }

      else{
        socket.socket.emit("private-message-image",{msg:imageData,sendto:connectTo});

        setTimeout(()=>{
          fetchChat(connectTo);
        },2500);
      }
    }

      socket.socket.off("userChat").on("userChat",(chat)=>{
        setPrivateChats(chat);

      });

      function chatRoomSelected(){
        console.log('ss');
        SetConnectTo("chat-room");
      }

      socket.socket.off("user-disconnected").on("user-disconnected",()=>{
        setPrivateChats((prev)=>[...prev,{sender:"server",msg:"user is disconnected"}]);
      })
      
      socket.socket.off("new-message");

    // recieveing message 
    socket.socket.on("new-message", (username) => {
      console.log("socket", username);
      
      if (connectedUser.has(username)) {
        setConnectedUser((prev) => {
          const map = new Map(prev);
          map.set(username, map.get(username) + 1);
          return map;
        });
      } else {
        setConnectedUser((prev) =>{
          const map = new Map(prev);
          map.set(username, 1);
          return map;
        });
      }
      if (connectTo == username) {
        fetchChat(username);
        messageCountManage(connectTo);
      }
    });

      function fetchChat(user){
        console.log("fetchchat:" ,user);
        socket.socket.emit("userChat",user);
      }

      function closeChat(user){
        console.log("hiiuih");
        socket.socket.emit("close-chat",user);
        const map = new Map(connectedUser);
        if(map.has(user)){
          console.log("delete initiate",map.has(user));
          map.delete(user);
          console.log(map);
          SetConnectTo("chat-room");
          
        }
        setConnectedUser(map);
          setTimeout(()=>{
            console.log("connected users",connectedUser);
          },2000);
        

      }

        return (
          
          <div className="flex h-full overflow-y-hidden">
          <Message_Handling groupMessages={groupMessages} setGroupMessages={setGroupMessages} fetchUserList={fetchUserList} />
          {/* Left Sidebar */}
          <div className="w-1/4 bg-gray-800 text-white p-4">
            <div className="font-bold text-2xl mb-4">Channel Name</div>
            <div className="text-gray-400 mb-4">Connected as {username}</div>
            <div className="text-gray-300 text-lg mb-2">Messages</div>
            <div className="flex flex-col h-full overflow-y-auto w-full space-y-2">
              {/* Render chat room option */}
              <div className="flex justify-between px-4 py-2 cursor-pointer bg-gray-700 rounded mb-2 hover:bg-gray-600 transition duration-200" onClick={chatRoomSelected}>
                <div>Chat room</div>
              </div>
              {/* Render connected users */}
              {[...connectedUser.entries()].map(([key, value]) => (
                <div key={key} className="flex justify-between items-center px-4 py-2 cursor-pointer bg-gray-700 rounded mb-2 hover:bg-gray-600 transition duration-200" >
                  <div onClick={() => handleUserClick(key)}>{key}</div>
                  <div className="flex items-center">
                    <p className="text-lg text-gray-300 mr-2">{value}</p>
                    <IoClose className="cursor-pointer text-red-500 hover:text-red-600 transition duration-200" onClick={() => closeChat(key)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        
        
      
            {/* Central Chat Area */}
            <div className="flex flex-col justify-between w-1/2 bg-gray-700 p-4">
              {/* Chat Header */}
              <div className="font-bold text-xl mb-4">Chat Room</div>
      
            
              <ChatTemplate chatMessages={connectTo=="chat-room"?groupMessages:privateChats} username={username}/>
      
              {/* Message Input Block */}
              <div className="mt-4 flex gap-2 justify-center items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="w-full p-3 border-2 rounded-lg border-gray-300 bg-gray-200 focus:border-blue-500 focus:outline-none shadow-sm transition duration-200"
        onKeyDown={handleKeyDown}
      />
        <label htmlFor="imageUpload" className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg shadow-sm transition duration-200 cursor-pointer">
            <FaImage size={20} /> {/* Use the image icon */}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="imageUpload"
          />
    <button onClick={(connectTo=='chat-room')?handleMessageSendRoom:handleSendPrivMessage} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg shadow-sm transition duration-200">
            <FaPaperPlane size={20} /> {/* Use the paper plane icon */}
          </button>
    </div>
    </div>

      
            {/* Right Sidebar */}
            <div className="w-1/4 bg-gray-800 text-white p-4">
      <div className="font-bold text-2xl mb-4">Connected Users</div>
      <div className="text-gray-300 text-lg mb-2">Total Online: {userList.length}</div>
      <ul className="space-y-2">
        {userList.map((user) => (
          <li key={user} className="cursor-pointer flex text-blue-300 hover:text-blue-500 transition duration-200" onClick={() => handleUserClick(user)}>
          <FaCircle className="text-sm text-green-500 mt-[5px] mr-2"></FaCircle> {user}
          </li>
        ))}
      </ul>
    </div>
          </div>
      

        )
        


    


  
}

export default Rooms;
