"use client"
import React, { useEffect, useState } from 'react'
import Canvas from './Canvas'
import { WS_URL } from '../lib/config'

const RoomCanvas = ({ roomId }: { roomId: number }) => {
    if (!roomId) {
        return <div> Connecting to server </div>
    }
    const [socket, setSocket] = useState<WebSocket | null>(null)
    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=${localStorage.getItem("token")}`)
        ws.onopen = () => {
            console.log("Websocket connection is open now")
            setSocket(ws)
            ws.send(JSON.stringify({
                type: "join_room",
                roomId: roomId
            }))
        }
    }, [])
    if(!socket){
        return <div>Connecting to server</div>
    }
    return (
        <Canvas roomId={roomId} socket={socket} />
    )
}

export default RoomCanvas