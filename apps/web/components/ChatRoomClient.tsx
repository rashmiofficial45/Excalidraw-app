"use client"

import { useEffect } from "react"
import { useSocket } from "../hooks/useSocket"

export function ChatRoomClient({ messages, id }: {
    messages: { message: string[] },
    id:string
}) {
    const {socket, loading} = useSocket()
    useEffect(() => {
      if (socket && !loading) {
        socket.onmessage=(e)=>{
            const parsedData = JSON.parse(e.data)
        }
      }
    }, [])
}