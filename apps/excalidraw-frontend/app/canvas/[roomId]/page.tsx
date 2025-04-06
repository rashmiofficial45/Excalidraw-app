"use client";
import React, { useEffect, useRef } from "react";

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let isDrawing = false;
        let startX = 0;
        let startY = 0;

        const getMousePos = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const handleMouseDown = (e: MouseEvent) => {
            const pos = getMousePos(e);
            startX = pos.x;
            startY = pos.y;
            isDrawing = true;
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDrawing) return;

            const pos = getMousePos(e);
            const width = pos.x - startX;
            const height = pos.y - startY;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = "white";
            ctx.fillStyle = "black";
            ctx.strokeRect(startX, startY, width, height);
        };

        const handleMouseUp = () => {
            isDrawing = false;
        };

        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseup", handleMouseUp);

        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="bg-black border"
            width={1534}
            height={926}
        />
    );
};

export default Canvas;
