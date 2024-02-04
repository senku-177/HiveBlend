import logo from './logo.svg';
import { Route, Routes, useNavigate } from "react-router-dom";

import './App.css';
import ChatRoom from './pages/ChatRoom';
import Home from './pages/Home';
import Rooms from "./pages/Rooms";
import PrivateRoutes from './PrivateRoutes';
import { useState } from 'react';
function App() {
  const [connect,setConnect]=useState(false);
  return (


    <div className='container h-screen w-screen'>
        <Routes>
          <Route path='/' element={<Home setConnect={setConnect}></Home>}/>
          
          <Route path='/chatting' element= {
            <PrivateRoutes connected={connect}>
              <ChatRoom/>
            </PrivateRoutes>
               }/>

          <Route path="/rooms" element={
          <PrivateRoutes connected={connect}>
              <Rooms/>

          </PrivateRoutes>
          }></Route>





        </Routes>
        
       
    </div>
  );
}

export default App;