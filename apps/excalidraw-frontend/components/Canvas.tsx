"use client"
import React, { useEffect, useRef, useState } from "react";
import DrawInit from "../draw";
import { TopToolbar } from "./canvas/TopToolbar";
import { useIsMobile } from "../hooks/use-mobile";
import { SideToolbar } from "./canvas/SideToolbar";
import { MobileToolbar } from "./canvas/MobileToolbar";
// import { CanvasTool } from "./canvas/CanvasTool";

const Canvas = ({ roomId, socket }: { roomId: number, socket: WebSocket }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    console.log(roomId)
    const [currentTool, setCurrentTool] = useState('select');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(100);
    const isMobile = useIsMobile();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    useEffect(() => {
        if (!roomId) return;

        const fetchData = async () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            await DrawInit(canvas, ctx, roomId, socket);
        };

        fetchData();
    }, [canvasRef]);
    return (
        <>
            <div className="flex h-screen w-full flex-col overflow-hidden">
                <TopToolbar
                    toggleSidebar={toggleSidebar}
                    isCollapsed={isCollapsed}
                    zoomLevel={zoomLevel}
                    setZoomLevel={setZoomLevel}
                />

                <div className="flex flex-1 overflow-hidden">
                    {!isMobile && (
                        <SideToolbar
                            currentTool={currentTool}
                            setCurrentTool={setCurrentTool}
                            isCollapsed={isCollapsed}
                        />
                    )}

                    <canvas
                        ref={canvasRef}
                        className="bg-black border"
                        width={1534}
                        height={927}
                    />
                </div>

                {isMobile && (
                    <MobileToolbar currentTool={currentTool} setCurrentTool={setCurrentTool} />
                )}
            </div>
        </>
    );
}

export default Canvas