import React, { useRef, useState } from 'react'
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import SimplePeer from 'simple-peer';
import { socket_io } from '../Socket/Socket';
import callbg from '../asset/callbg.svg'



const IncomingCall = () => {
    const [Signal,SetSignal]=useState('')
    const [connection,Setconnection]=useState(true)
    const location=useLocation()  
    const urlParams = new URLSearchParams(location.search);
    const IncomingCallid=urlParams.get('id')
    const callerid=urlParams.get('cid')
    const friendRef=useRef()
    const peerRef=useRef()
    const navigate=useNavigate()
    let mediastream;

    const ReceiverPeer=(stream)=>{
        try {
            const peer=new SimplePeer({
                initiator:false,
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
          socket_io.emit('disconnection',IncomingCallid)
          navigate('/')
    }

    const connect=()=>{
        if(Signal){
            peerRef.current.signal(Signal)
        }
    }

    useEffect(()=>{
        socket_io.on('signal',(data)=>{
            if(JSON.parse(data).type==='offer'){
                SetSignal(JSON.parse(data))
            }
        })
    },[])

    useEffect(()=>{
        const init=async()=>{
            const stream=await navigator.mediaDevices.getUserMedia({video:false,audio:true})   
            mediastream=stream
            if(stream){
                const peer=ReceiverPeer(stream)
                peerRef.current=peer
                peer.on('signal',(data)=>{
                    console.log("second")
                    socket_io.emit('signal',{
                        SignalingData:JSON.stringify(data),
                        Callid:IncomingCallid,
                        callerid:callerid
                    })
                    Setconnection(false)
                })  
                peer.on('stream', stream => {
                    friendRef.current.srcObject=stream;
                    friendRef.current.play()  
                  });
                socket_io.on('disconnectionevent',incomingDisconnect)
            }
        }
        if(IncomingCallid){
            init()
        }

        return()=>{
            socket_io.emit('offline',callerid)
            socket_io.off()
        }
    },[IncomingCallid])


  return (
    <div className='h-screen w-screen relative flex'>
        <img src={callbg} alt="IncomingCallbackground" className='h-screen w-screen' />
        <video ref={friendRef} className='  h-full w-full absolute top-0 object-cover ' autoPlay ></video> 
        <div className='flex flex-row absolute bottom-6 left-1/2 gap-4'>
        {connection&&<button className=' h-fit px-2 py-3 bg-green-300 rounded-xl shadow-lg ' onClick={()=>connect()}>
            Connect
        </button>}
        <button className=' h-fit px-2 py-3 bg-red-300 rounded-xl shadow-lg ' onClick={()=>disconnect()}>
            DisConnect
        </button>
        </div>
    </div>
  )
}

export default IncomingCall