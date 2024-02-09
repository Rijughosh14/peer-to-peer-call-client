import React from 'react'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { socket_io } from '../Socket/Socket'

const Index = () => {
    const [Register,SetRegister]=useState(false)
    const [RegisterNumber,SetRegisterNumber]=useState('')
    const [FriendNumber,SetFriendNumber]=useState('')
    const navigate=useNavigate()

    const handleRegister=()=>{
        if(RegisterNumber==='')return
        SetRegister(true)
        socket_io.emit('registerUser',RegisterNumber)
    }

    const handleCall=()=>{
        if(FriendNumber==='')return
        socket_io.emit('call-made',FriendNumber,RegisterNumber)
        navigate(`/call?id=${FriendNumber}&cid=${RegisterNumber}`)
    }

  return (
    <div className='h-screen w-screen '>
        <div className='flex container bg-gradient-to-br from-blue-100 to-white m-auto h-full w-full rounded-2xl shadow-2xl'>
            {Register?<div className='flex flex-col h-64 w-64 bg-white rounded-3xl shadow-xl shadow-black m-auto p-4 gap-4 justify-center'>
                <input type="number" placeholder='enter the number' className='w-full py-3 px-2 focus:outline-none border border-gray-400 rounded-xl' value={FriendNumber} onChange={(e)=>SetFriendNumber(e.target.value)}/>
                <button className='h-fit w-fit py-3 px-4 bg-blue-300 mx-auto rounded-lg shadow'
                onClick={handleCall}
                >
                    Call
                </button>
            </div>:
            <div className='flex flex-col h-64 w-64 bg-white rounded-3xl shadow-xl shadow-black m-auto p-4 gap-4 justify-center'>
                <input type="number" placeholder='Enter Your Number To Register' className='w-full py-3 px-2 focus:outline-none border border-gray-400 rounded-xl' value={RegisterNumber} onChange={(e)=>SetRegisterNumber(e.target.value)}/>
                <button className='h-fit w-fit py-3 px-4 bg-purple-300 mx-auto rounded-lg shadow' onClick={handleRegister}>
                    Register
                </button>
            </div>}
        </div>
    </div>
  )
}

export default Index