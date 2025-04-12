import React, { useState, useEffect, forwardRef } from 'react';

interface CanvasProps {
    currentTool: string;
    zoomLevel: number;
}

/**
 * CanvasTool component is a wrapper around the <canvas> element
 * that resizes dynamically based on the container.
 * Uses forwardRef to allow parent (Canvas.tsx) to access the ref directly.
 */
export const CanvasTool = forwardRef<HTMLCanvasElement, CanvasProps>(
    ({ currentTool, zoomLevel }, canvasRef) => {
        const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

        /**
         * This useEffect adjusts canvas size whenever the window resizes.
         */
        useEffect(() => {
            const updateCanvasSize = () => {
                const canvas = (canvasRef as React.RefObject<HTMLCanvasElement>)?.current;
                if (canvas) {
                    setCanvasSize({
                        width: canvas.offsetWidth,
                        height: canvas.offsetHeight,
                    });
                }
            };

            updateCanvasSize();
            window.addEventListener('resize', updateCanvasSize);

            return () => {
                window.removeEventListener('resize', updateCanvasSize);
            };
        }, [canvasRef]);

        return (
            <canvas
                ref={canvasRef}
                className="bg-black border w-full h-full overflow-hidden"
                width={canvasSize.width || 1534}
                height={canvasSize.height || 927}
            />
        );
    }
);

CanvasTool.displayName = "CanvasTool";
