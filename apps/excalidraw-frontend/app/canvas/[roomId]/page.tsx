"use client";
import React, { useEffect, useRef } from "react";
import DrawInit from "../../../draw";

const Canvas = (params:{roomId:number}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const roomId = params.roomId
    if(!roomId) {
        return
    }
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        DrawInit(canvas, ctx, roomId)
    }, []);

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
        </>);
};

export default Canvas;
