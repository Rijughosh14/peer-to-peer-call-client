import React, { useRef } from 'react'
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import SimplePeer from 'simple-peer';
import { socket_io } from '../Socket/Socket';
import callbg from '../asset/callbg.svg'



const Call = () => {

    const location=useLocation()  
    const urlParams = new URLSearchParams(location.search);
    const callid=urlParams.get('id')
    const callerid=urlParams.get('cid')
    const friendRef=useRef()
    const peerRef=useRef()
    const navigate=useNavigate()
    let mediastream;

    const SenderPeer=(stream)=>{
        try {
            const peer=new SimplePeer({
                initiator:true,
                stream:stream,
                //trickle:false
            });
        return(peer)
        } catch (error) {
            console.log(error)
        }
    }

    const incomingDisconnect=()=>{      
        mediastream&&mediastream.getTracks().forEach((track) => {
            track.stop();
          })
          peerRef.current&&peerRef.current.destroy()
          navigate('/')
    }

    const disconnect=()=>{
        mediastream&&mediastream.getTracks().forEach((track) => {
            track.stop();
          })
          peerRef.current&&peerRef.current.destroy()
          socket_io.emit('disconnection',callid)
          navigate('/')
    }

    useEffect(()=>{
        const init=async()=>{
            const stream=await navigator.mediaDevices.getUserMedia({video:false,audio:true})   
            mediastream=stream
            if(stream){
                const peer=SenderPeer(stream)
                peerRef.current=peer
                peer.on('signal',(data)=>{
                    socket_io.emit('signal',{
                        SignalingData:JSON.stringify(data),
                        Callid:callid,
                        callerid:callerid
                    })
                })  
                peer.on('stream', stream => {
                    friendRef.current.srcObject=stream;
                    friendRef.current.play()  
                  });
                    
                socket_io.on('signal',(data)=>{
                    peer.signal(JSON.parse(data))
                })
                socket_io.on('disconnectionevent',incomingDisconnect)
            }
        }
        if(callid){
            init()
        }
        return()=>{
            socket_io.emit('offline',callerid)
            socket_io.off()
        }
    },[callid])


  return (
    <div className='h-screen w-screen relative flex'>
        <img src={callbg} alt="callbackground" className='h-screen w-screen' />
        <video ref={friendRef} className='  h-full w-full absolute top-0 object-cover ' autoPlay ></video> 
        <button className='absolute h-fit px-2 py-3 bg-red-300 rounded-xl shadow-lg bottom-6 left-1/2' onClick={()=>disconnect()}>
            DisConnect
        </button>
    </div>
  )
}

export default Call