import axios from "axios"
import { BACKEND_URL } from "../config"
import { ChatRoomClient } from "./ChatRoomClient"

async function getChats(roomId: number) {
    try {
        const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`)
        return response.data.message || []
    } catch (error) {
        console.error("Failed to fetch chat messages:", error)
        return [] // Return empty array on error
    }
}

export async function ChatRoom({ id }: { id: number }) {
    if (!id || isNaN(Number(id))) {
        console.error("Invalid room ID:", id)
        return <div className="p-4 text-red-500">Invalid room ID</div>
    }

    const messages = await getChats(id)
    return <ChatRoomClient messages={messages} id={id} />
}