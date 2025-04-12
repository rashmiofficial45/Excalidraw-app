import { useState } from 'react';
import {
    Square, Circle, Pencil, Type, Image, Hand, Eraser, Move,
    ArrowUpDown, ArrowLeftRight, CornerDownLeft, Trash2, Undo, Redo
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from '../../hooks/use-mobile';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const tools = [
    { id: 'rect', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'pencil', icon: Pencil, label: 'Pencil' },
    { id: 'text', icon: Type, label: 'Text' },
    // { id: 'eraser', icon: Eraser, label: 'Eraser' },
];

const modifiers = [
    { id: 'move', icon: Move, label: 'Move' },
    { id: 'vertical-align', icon: ArrowUpDown, label: 'Align Vertically' },
    { id: 'horizontal-align', icon: ArrowLeftRight, label: 'Align Horizontally' },
    { id: 'flip', icon: CornerDownLeft, label: 'Flip' },
];

const actions = [
    { id: 'delete', icon: Trash2, label: 'Delete' },
    { id: 'undo', icon: Undo, label: 'Undo' },
    { id: 'redo', icon: Redo, label: 'Redo' },
];

interface SideToolbarProps {
    currentTool: string;
    setCurrentTool: (tool: string) => void;
    isCollapsed: boolean;
}

export function SideToolbar({ currentTool, setCurrentTool, isCollapsed }: SideToolbarProps) {
    const isMobile = useIsMobile();

    const handleToolClick = (toolId: string) => {
        console.log(toolId)
        setCurrentTool(toolId);
    };

    const ToolButton = ({ tool, isActive }: { tool: typeof tools[0], isActive: boolean }) => {
        return (
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "tool-button w-10 h-10",
                            isActive && "active"
                        )}
                        onClick={() => handleToolClick(tool.id)}
                    >
                        <tool.icon className="w-5 h-5" />
                        <span className="sr-only">{tool.label}</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side={isCollapsed ? "right" : "bottom"}>
                    {tool.label}
                </TooltipContent>
            </Tooltip>
        );
    };

    return (
        <div className={cn(
            "p-2 bg-sidebar flex flex-col gap-4 border-r",
            isCollapsed ? "items-center" : "items-start",
            isMobile ? "hidden" : "flex"
        )}>
            <div className="flex flex-col gap-2">
                {tools.map((tool) => (
                    <ToolButton key={tool.id} tool={tool} isActive={currentTool === tool.id} />
                ))}
            </div>

            <Separator />

            {/* <div className="flex flex-col gap-2">
                {modifiers.map((tool) => (
                    <ToolButton key={tool.id} tool={tool} isActive={currentTool === tool.id} />
                ))}
            </div> */}

            {/* <Separator />

            <div className="flex flex-col gap-2">
                {actions.map((tool) => (
                    <ToolButton key={tool.id} tool={tool} isActive={currentTool === tool.id} />
                ))}
            </div> */}
        </div>
    );
}
