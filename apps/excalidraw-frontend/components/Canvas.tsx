"use client";
import React, { useEffect, useRef } from "react";
import DrawInit from "../draw";
import { TopToolbar } from "./canvas/TopToolbar";
import { useIsMobile } from "../hooks/use-mobile";
import { SideToolbar } from "./canvas/SideToolbar";
import { MobileToolbar } from "./canvas/MobileToolbar";
import { CanvasTool } from "./canvas/CanvasTool";
import { useCanvasStore } from "../stores/useCanvasStore";

/**
 * The Canvas component is responsible for rendering the infinite canvas UI along with the toolbars.
 * It uses Zustand for global state management (currentTool, isCollapsed, zoomLevel), and initializes the drawing logic.
 */
const Canvas = ({ roomId, socket }: { roomId: number, socket: WebSocket }) => {
    // Ref to the <canvas> element
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // Access global state from Zustand.
    const {
        currentTool,
        setCurrentTool,
        isCollapsed,
        setIsCollapsed,
        zoomLevel,
        setZoomLevel,
    } = useCanvasStore();

    // Detect mobile devices to render the appropriate toolbar.
    const isMobile = useIsMobile();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    /**
  * The useEffect here initializes the drawing logic once the canvas is available.
  * It retrieves the 2D context of the canvas and calls DrawInit, which sets up drawing,
  * pan, and zoom event listeners, as well as real-time synchronization via WebSocket.
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
    }, [canvasRef, roomId, socket]);

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden">
            {/* Top Toolbar with controls for zoom and toggling sidebar */}
            <TopToolbar
                toggleSidebar={toggleSidebar}
                isCollapsed={isCollapsed}
                zoomLevel={zoomLevel}
                setZoomLevel={setZoomLevel}
            />

            <div className="flex flex-1 overflow-hidden">
                {/* Side toolbar is visible on non-mobile devices */}
                {!isMobile && (
                    <SideToolbar
                        currentTool={currentTool}
                        setCurrentTool={setCurrentTool}
                        isCollapsed={isCollapsed}
                    />
                )}
                {/* CanvasTool renders the actual <canvas> element */}
                <CanvasTool ref={canvasRef} currentTool={currentTool} zoomLevel={zoomLevel} />
            </div>

            {/* Mobile toolbar for smaller screens */}
            {isMobile && (
                <MobileToolbar currentTool={currentTool} setCurrentTool={setCurrentTool} />
            )}
        </div>
    );
}

export default Canvas;
