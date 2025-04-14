import React, { useState, useEffect, forwardRef } from 'react';

interface CanvasProps {
    currentTool: string;
    zoomLevel: number;
}

/**
 * CanvasTool is a forwardRef component that renders the <canvas> element.
 * It listens to window resize events and adjusts the canvas dimensions to match
 * the container (in this case, the viewport). This is essential for an infinite canvas.
 */
export const CanvasTool = forwardRef<HTMLCanvasElement, CanvasProps>(
    ({ currentTool, zoomLevel }, canvasRef) => {
        const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight });

        /**
         * This useEffect adjusts canvas size whenever the window resizes.
         */
        useEffect(() => {
            const updateCanvasSize = () => {
                const canvas = (canvasRef as React.RefObject<HTMLCanvasElement>)?.current;
                if (canvas) {
                    setCanvasSize({
                        width: window.innerWidth, // filling the entire viewport
                        height: window.innerHeight,
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
                width={canvasSize.width}
                height={canvasSize.height}
            />
        );
    }
);

CanvasTool.displayName = "CanvasTool";
