"use client";
import React, { useEffect, useRef } from "react";
import DrawInit from "../../../draw";

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        DrawInit(canvas,ctx)
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="bg-black border"
            width={1534}
            height={927}
        />
    );
};

export default Canvas;
