const mongoose= require('mongoose');

async function connectDatabase (url){
    mongoose.connect(url);
}

module.exports={
    connectDatabase,
}
