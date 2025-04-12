"use client";
import React, { useEffect, useRef, useState } from "react";
import DrawInit from "../draw";
import { TopToolbar } from "./canvas/TopToolbar";
import { useIsMobile } from "../hooks/use-mobile";
import { SideToolbar } from "./canvas/SideToolbar";
import { MobileToolbar } from "./canvas/MobileToolbar";
import { CanvasTool } from "./canvas/CanvasTool";

/**
 * Main Canvas component responsible for rendering the entire UI,
 * handling toolbars (mobile/desktop), managing state, and
 * initiating drawing logic via DrawInit.
 */
const Canvas = ({ roomId, socket }: { roomId: number, socket: WebSocket }) => {
    // Ref to the <canvas> element
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // State to track current drawing tool (default is "select")
    const [currentTool, setCurrentTool] = useState('select');

    // Sidebar toggle state
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Zoom level for infinite canvas
    const [zoomLevel, setZoomLevel] = useState(100);

    // Check if device is mobile to render MobileToolbar
    const isMobile = useIsMobile();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    /**
     * useEffect to initialize the canvas drawing setup.
     * This function sets up the WebSocket connection and canvas drawing logic
     * when roomId and canvasRef are available.
     */
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
        <div className="flex h-screen w-full flex-col overflow-hidden">
            {/* Top Toolbar controls like zoom/side toggle */}
            <TopToolbar
                toggleSidebar={toggleSidebar}
                isCollapsed={isCollapsed}
                zoomLevel={zoomLevel}
                setZoomLevel={setZoomLevel}
            />

            <div className="flex flex-1 overflow-hidden">
                {/* Only show side toolbar on desktop */}
                {!isMobile && (
                    <SideToolbar
                        currentTool={currentTool}
                        setCurrentTool={setCurrentTool}
                        isCollapsed={isCollapsed}
                    />
                )}

                {/* Canvas component where drawing happens */}
                <CanvasTool
                    ref={canvasRef}
                    currentTool={currentTool}
                    zoomLevel={zoomLevel}
                />
            </div>

            {/* Mobile Toolbar for smaller screens */}
            {isMobile && (
                <MobileToolbar
                    currentTool={currentTool}
                    setCurrentTool={setCurrentTool}
                />
            )}
        </div>
    );
}

export default Canvas;
