const Users = require('./model/model');
const 
function matching(){

    const userQueue = Users.find({inQueue:true});

    if(userQueue.length>=2){
        const user1=userQueue.sample();
        const user2= userQueue.sample();

        while(user1===user2){
            user2=userQueue.sample();
        }

    }
}

function roomCreate(user1, user2){
   const chatRoomId=generateUniqueChatRoomId();
   const chatRoom= 
}



module.exports={
    matching,
}