import { useState, useRef, useEffect } from 'react';

interface CanvasProps {
    currentTool: string;
    zoomLevel: number;
    ref: React.RefObject<HTMLCanvasElement | null>;
}

export function CanvasTool({ ref, currentTool, zoomLevel }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateCanvasSize = () => {
            if (canvasRef.current) {
                setCanvasSize({
                    width: canvasRef.current.offsetWidth,
                    height: canvasRef.current.offsetHeight
                });
            }
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="bg-black border"
            width={1534}
            height={927}
        />
    );
}
