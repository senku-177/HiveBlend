const mongoose = require('mongoose');


const schema= new mongoose.Schema({
    userid:{
        type:String,
    },
    username:{
        type:String,
        required:true,
    },
    userConnectedTo:{
        type:String,
    },
    chatLog:{
        type: [
        ],
    },

    inQueue:{
        type:Boolean,
        requiered: true
    },

    roomConnect:{
        type:Boolean,
        requiered: true,
    }

})

const Users = mongoose.model("Chat-app",schema);

module.exports=Users;
