const Users= require("../model/model");
const io = require("../server");

function joinRoom(socket,io){

    socket.join("room1");
    io.to("room1").emit("user-joined",socket.username);
    socket.emit("room-connected");
}


async function msgRecieve(socket,msg,io){
    await io.to("room1").emit("room-msg",{username:socket.username,content:msg});
}

async function userList(){
    const list=await Users.find({roomConnect:true});
    const out=[];
    list.forEach(user => {
        out.push(user.username);
    });

    return out;
}

async function fetchChat(user,socket,io){
   const entry = await Users.findOne({userid:socket.id});
   const found = entry.chatLog.find(us=>us.name==user);
   console.log('call ayi');
   if(found){
    
   console.log(found.chat);
    return found.chat;
   }
   else{
    const Chat= entry.chatLog.push({name:user,chat:[]});
   await Users.findOneAndUpdate({userid:socket.id},{chatLog:Chat});
   return [];
   }
   

}

async function sendMessage(io,socket, data){
    const entry= await Users.findOne({username:data.sendto});
    const e1= await Users.findOne({userid:socket.id});
    
    if(!entry){
        console.log("ms");
        socket.emit("user-disconnected");
        return
    }
    else{
        const chatse1=e1.chatLog;
        const chats= entry.chatLog;
       const found= chats.find(us=>us.name==e1.username);

       if(found){
        const index = chats.findIndex(us=>us.name==e1.username);
        console.log(chats[index]);
        chats[index].chat.push({sender:e1.username,content:data.msg});
        await Users.findOneAndUpdate({username:data.sendto},{chatLog:chats});
       }
       else{
        const chat=[];
        chat.push({sender:e1.username,content:data.msg});
        chats.push({name:e1.username,chat});
        await Users.findOneAndUpdate({username:data.sendto},{chatLog:chats});
       }

       const founde1= chatse1.find(us=>us.name==data.sendto);
       if(founde1){
        const index = chatse1.findIndex(us=>us.name==data.sendto);
        console.log("same ", chatse1[index]);   
        chatse1[index].chat.push({sender:e1.username,content:data.msg});
        await Users.findOneAndUpdate({userid:socket.id},{chatLog:chatse1});
       }
       else{
        const chat=[];
        chat.push({sender:e1.username,content:data.msg});
        chatse1.push({name:data.sendto,chat:chat});
        await Users.findOneAndUpdate({userid:socket.id},{chatLog:chatse1});
       }
       console.log("msg");
       const sock=io.sockets.sockets.get(entry.userid);
       sock.emit("new-message",e1.username);


    }
}


async function closeChat(data,socket,io){

   const entry =await Users.find({userid:socket.id});
    const index=entry.chatLog.findIndex(us=>us.name==data);
    entry.chatLog.splice(index,1);

    await Users.findOneAndUpdate({userid:socket.id},{chatLog:entry.chatLog});
}

module.exports={joinRoom, msgRecieve, userList, fetchChat, sendMessage, closeChat};
