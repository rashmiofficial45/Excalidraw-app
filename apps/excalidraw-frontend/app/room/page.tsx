"use client";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Paintbrush2, Plus, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { BACKEND_URL } from "../../lib/config";
import axios from "axios";

export default function Home() {
    const router = useRouter();
    const [newRoomName, setNewRoomName] = useState("");
    const [existingRoomName, setExistingRoomName] = useState("");

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await axios.post(`${BACKEND_URL}/room`, {
            name: newRoomName
        },
            {
                headers: {
                    Authorization: `${localStorage.getItem("token")}`,
                },
            });
        const roomId = result.data.roomId
        if (roomId){
            router.push(`/canvas/${roomId}`)
        }
    };

    const handleJoinRoom = async(e: React.FormEvent) => {
        e.preventDefault();
        const result = await axios.get(`${BACKEND_URL}/room/${existingRoomName}`);
        const roomId = result.data.roomId
        if (roomId) {
            router.push(`/canvas/${roomId}`)
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center">
                    <div className="flex justify-center">
                        <Paintbrush2 className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Welcome to Canvas</CardTitle>
                    <CardDescription>
                        Create a new room or join an existing one
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="create" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="create" className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Create Room
                            </TabsTrigger>
                            <TabsTrigger value="join" className="flex items-center gap-2">
                                <LogIn className="h-4 w-4" />
                                Join Room
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="create">
                            <form onSubmit={handleCreateRoom} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Input
                                        type="text"
                                        placeholder="Enter new room name"
                                        value={newRoomName}
                                        onChange={(e) => setNewRoomName(e.target.value)}
                                        required
                                        className="w-full"
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Create New Room
                                </Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="join">
                            <form onSubmit={handleJoinRoom} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Input
                                        type="text"
                                        placeholder="Enter existing room name"
                                        value={existingRoomName}
                                        onChange={(e) => setExistingRoomName(e.target.value)}
                                        required
                                        className="w-full"
                                    />
                                </div>
                                <Button type="submit" variant="secondary" className="w-full">
                                    Join Existing Room
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </main>
    );
}