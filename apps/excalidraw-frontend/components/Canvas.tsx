"use client"
import React, { useEffect, useRef } from "react";
import DrawInit from "../draw";

const Canvas = ({ roomId }: { roomId: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    console.log(roomId)
    useEffect(() => {
        if (!roomId) return;

        const fetchData = async () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            await DrawInit(canvas, ctx, roomId);
        };

        fetchData();
    }, [roomId]);
    return (
        <>
            <canvas
                ref={canvasRef}
                className="bg-black border"
                width={1534}
                height={927}
            />
            <div className="absolute top-0 left-0 flex flex-col gap-2">
                <h1>Rect</h1>
                <h1>Circle</h1>
            </div>
        </>
    );
}

export default Canvas