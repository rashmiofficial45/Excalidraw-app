"use client"

import { useEffect, useState } from "react"
import { useSocket } from "../hooks/useSocket"

export function ChatRoomClient({ messages, id }: {
    messages: { message: string }[],
    id: number
}) {
    const [chats, setChats] = useState(messages);
    const [newMessage, setNewMessage] = useState("");
    const { socket, loading } = useSocket();
    const [socketReady, setSocketReady] = useState(false);

    useEffect(() => {
        // Only attempt to use the socket when it's ready
        if (socket && !loading) {
            // Check if the socket is in an open state
            if (socket.readyState === WebSocket.OPEN) {
                setSocketReady(true);
                // Join the room
                try {
                    socket.send(
                        JSON.stringify({
                            type: "join_room",
                            roomId: id
                        })
                    );
                } catch (error) {
                    console.error("Error joining room:", error);
                }
            } else {
                // Set up an event listener for when the socket opens
                const handleOpen = () => {
                    setSocketReady(true);
                    try {
                        socket.send(
                            JSON.stringify({
                                type: "join_room",
                                roomId: id
                            })
                        );
                    } catch (error) {
                        console.error("Error joining room after open:", error);
                    }
                };

                socket.addEventListener('open', handleOpen);

                // Clean up
                return () => {
                    socket.removeEventListener('open', handleOpen);
                };
            }

            // Set up message handler
            const handleMessage = (e:MessageEvent) => {
                try {
                    const parsedData = JSON.parse(e.data);
                    if (parsedData.type === "chat") {
                        setChats(c => [...c, { message: parsedData.message }]);
                    }
                } catch (error) {
                    console.error("Error processing message:", error);
                }
            };

            socket.addEventListener('message', handleMessage);

            // Handle socket closure
            const handleClose = () => {
                setSocketReady(false);
                console.log("WebSocket connection closed");
            };

            socket.addEventListener('close', handleClose);

            // Handle errors
            const handleError = (error: Event) => {
                console.error("WebSocket error:", error);
                setSocketReady(false);
            };

            socket.addEventListener('error', handleError);

            // Clean up all event listeners when component unmounts
            return () => {
                socket.removeEventListener('message', handleMessage);
                socket.removeEventListener('close', handleClose);
                socket.removeEventListener('error', handleError);
            };
        }
    }, [socket, loading, id]);

    const sendMessage = () => {
        if (socket && socketReady && newMessage.trim()) {
            try {
                socket.send(
                    JSON.stringify({
                        type: "chat",
                        roomId: id,
                        message: newMessage
                    })
                );
                setNewMessage("");
            } catch (error) {
                console.error("Error sending message:", error);
                alert("Failed to send message. Please try again.");
            }
        } else if (!socketReady && newMessage.trim()) {
            alert("Chat connection not ready. Please wait or refresh the page.");
        }
    };

    return (
        <div className="flex flex-col h-full p-4">
            {!socketReady && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                    <p>Connecting to chat server...</p>
                </div>
            )}
            <div className="flex-1 overflow-y-auto mb-4">
                {chats && chats.length > 0 ? (
                    chats.map((chat, index) => (
                        <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                            {chat.message}
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-center p-4">
                        No messages yet. Start the conversation!
                    </div>
                )}
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 border p-2 rounded-l"
                    placeholder="Type a message..."
                    disabled={!socketReady}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className={`px-4 py-2 rounded-r ${socketReady ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}
                    disabled={!socketReady}
                >
                    Send
                </button>
            </div>
        </div>
    );
}