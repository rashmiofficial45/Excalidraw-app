"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({ messages, id }: {
    messages: { message: string }[],
    id: string
}) {
    // Initialize state with the messages prop
    const [chats, setChats] = useState(messages);
    const { socket, loading } = useSocket();

    useEffect(() => {
        // Ensure socket is available and not loading
        if (socket && !loading) {
            // Join the specified chat room
            socket.send(
                JSON.stringify({
                    type: "join_room",
                    roomId: id,
                })
            );

            // Event handler for incoming messages
            const handleMessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if (parsedData.type === "chat") {
                    setChats(c => [...c, { message: parsedData.message }])
                }
            };

            // Attach the event listener
            socket.addEventListener("message", handleMessage);

            // Cleanup function to remove the event listener
            return () => {
                socket.removeEventListener("message", handleMessage);
            };
        }
    }, [socket, loading, id]);

    return (
        <div>
            {chats.map((chat, index) => (
                <div key={index}>{chat.message}</div>
            ))}
        </div>
    );
}
