import { useState } from 'react';
import {
    Square, Circle, Pencil, Type, Image, Hand, Eraser, Trash2, Undo, Redo
} from "lucide-react";

import { cn } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const tools = [
    { id: 'select', icon: Hand, label: 'Select' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'pencil', icon: Pencil, label: 'Pencil' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
];

interface MobileToolbarProps {
    currentTool: string;
    setCurrentTool: (tool: string) => void;
}

export function MobileToolbar({ currentTool, setCurrentTool }: MobileToolbarProps) {
    const handleToolClick = (toolId: string) => {
        setCurrentTool(toolId);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-2 flex justify-between items-center">
            <div className="flex gap-1 overflow-x-auto pb-1">
                {tools.map((tool) => (
                    <Tooltip key={tool.id} delayDuration={300}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "tool-button size-10",
                                    currentTool === tool.id && "active"
                                )}
                                onClick={() => handleToolClick(tool.id)}
                            >
                                <tool.icon className="size-5" />
                                <span className="sr-only">{tool.label}</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            {tool.label}
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>

            <Separator orientation="vertical" className="h-10" />

            <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="tool-button size-10">
                    <Undo className="size-5" />
                </Button>
                <Button variant="ghost" size="icon" className="tool-button size-10">
                    <Redo className="size-5" />
                </Button>
                <Button variant="ghost" size="icon" className="tool-button size-10">
                    <Trash2 className="size-5" />
                </Button>
            </div>
        </div>
    );
}
