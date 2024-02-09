import { Routes, Route, useNavigate } from "react-router-dom";
import Call from './pages/Call';
import Index from '../src/pages/Index.js'
import IncomingCall from '../src/pages/IncomingCall.js'
import { useEffect } from "react";
import { socket_io } from "./Socket/Socket";




function App() {
  const navigate=useNavigate()

  useEffect(()=>{   
    socket_io.on('incomingCall', (cid,fid) => {
      navigate(`/incomingcall?id=${cid}&cid=${fid}`) })
  },[navigate])

  return (
    <>
    <Routes>
      <Route index element={<Index/>}/>
      <Route path="/call" element={<Call/>}/>
      <Route path="/incomingcall" element={<IncomingCall/>}/>
    </Routes>
    </>
  );
}

export default App;
