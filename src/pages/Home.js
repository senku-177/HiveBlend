import React from 'react';
import { useState,useEffect,useContext } from 'react';
import { useNavigate,Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { SocketContext } from '../sockets/SocketContext';

function Home({setConnect}){
    const navigate= useNavigate();

    const socket= useContext(SocketContext);
    
    const [username,setUsername]= useState("");
    const [noUsername,setnoUsername]= useState(false);
    function submitHandler(){
        if(username==""||!username){
            setnoUsername(true);
            return 
        }
        console.log(socket); 
        socket.socket.auth = { username };

        socket.socket.connect();
        console.log(socket);
        console.log("new user connected");
        socket.socket.emit("createChatRoom");
        // socket.socket.on("connect",(data)=>{
        //     console.log(data);
        // })
        setConnect(true);
        navigate("/chatting");

        

        
    }
    function UsernameHandler(event){
        setnoUsername(false);
        setUsername(event.target.value);
    }

    async function roomConnectionHandler(){
        if(username==""||!username){
            setnoUsername(true);
            return

        }
        socket.socket.auth={username};

        console.log(socket);

        socket.socket.connect();
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Wait for 1 second
    await delay(1000);
        console.log(socket.socket);
        
        try {
            const response = await new Promise((resolve, reject) => {
                socket.socket.emit("connect-room", (response) => {
                    if (response.status === 'success') {
                        resolve(response);
                    } else {
                        reject(new Error(response.message));
                    }
                });
            });
    
            console.log(response.message);
            setConnect(true);
            navigate("/rooms");
        } catch (error) {
            console.error("Error connecting to room:", error.message);
        }

    }

    

    return (<div className='flex flex-col bg-gray-300 h-full w-full px-2 py-2 items-center justify-center'>
        <div className='flex justify-center items-center gap-4'>
        <div className='flex px-5 py-3 border rounded-full justify-between bg-gray-400 border-blue-200'>
            <form className='flex flex-col'>
                <div>
                <label className='font-bold text-center text-xl text-color-white'>Username: </label>
                <input className="bg-transparent rounded-full no-border h-full ml-2 mr-4 overflow-y-hidden text-xl w-[200px] justify-center items-center px-4 focus:outline-none"type="text" name='username' placeholder='Username' value={username} onChange={UsernameHandler}></input>
                </div>

            </form>
        </div>
        
        <button onClick={submitHandler} className='bg-gray-500 p-3 w-[200px] rounded-full  text-xl font-bold '>Connect</button>
        </div>  
        {noUsername&&(<span className='text-red-600  absolute -mt-3 '>Enter a username</span>)}
        
        <button onClick={roomConnectionHandler} className='bg-purple-500 p-4 w-[400px] rounded-full mt-6 text-xl font-bold '>Connect To Room</button>

    </div>)
}

export default Home;