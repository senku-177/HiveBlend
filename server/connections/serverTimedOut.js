
const connectedMap={};

const max_Inactivity= 5;

function createTimeout(socket){
const timeout=setTimeout(()=>{
    const lastActive= connectedMap[socket.id]
    const now= Date.now();
    if(now-lastActive>max_Inactivity*60*100){
       
        socket.emit("server-timeout");

        delete connectedMap[socket.id];

    }
    else{
        clearTimeout(timeOut);
        timeout.unref;
        timeout= setTimeout(()=>{},max_Inactivity*60*100);
    }
},max_Inactivity*60*1000);

return timeout;

}


module.exports={
    connectedMap,
    createTimeout
}