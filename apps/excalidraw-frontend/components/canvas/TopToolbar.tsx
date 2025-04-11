import { useState } from 'react';
import {
    Save, Download, Upload, Settings, ChevronLeft, MenuSquare,
    Minus, Plus, Grid3x3, FileText, Share2, Undo2, Redo2
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from '../../hooks/use-mobile';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';


interface TopToolbarProps {
    toggleSidebar: () => void;
    isCollapsed: boolean;
    zoomLevel: number;
    setZoomLevel: (level: number) => void;
}

export function TopToolbar({ toggleSidebar, isCollapsed, zoomLevel, setZoomLevel }: TopToolbarProps) {
    const isMobile = useIsMobile();

    const increaseZoom = () => {
        setZoomLevel(Math.min(zoomLevel + 10, 200));
    };

    const decreaseZoom = () => {
        setZoomLevel(Math.max(zoomLevel - 10, 30));
    };

    const resetZoom = () => {
        setZoomLevel(100);
    };

    return (
        <div className="w-full border-b bg-background px-2 py-1 flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={toggleSidebar}
                >
                    {isCollapsed ? <MenuSquare size={18} /> : <ChevronLeft size={18} />}
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-sm font-normal">
                            File
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                        <DropdownMenuItem>
                            <FileText className="mr-2 size-4" />
                            New
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Save className="mr-2 size-4" />
                            Save
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Upload className="mr-2 size-4" />
                            Import
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Download className="mr-2 size-4" />
                            Export
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {!isMobile && (
                    <>
                        <Button variant="ghost" size="sm" className="text-sm font-normal">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-sm font-normal">View</Button>
                        <Button variant="ghost" size="sm" className="text-sm font-normal">Help</Button>
                    </>
                )}
            </div>

            <div className="flex items-center gap-2">
                {!isMobile && (
                    <>
                        <Button variant="ghost" size="icon" className="size-8">
                            <Undo2 size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8">
                            <Redo2 size={18} />
                        </Button>
                        <Separator orientation="vertical" className="h-6" />
                    </>
                )}

                <div className="flex items-center bg-secondary rounded-md">
                    <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 rounded-r-none" onClick={decreaseZoom}>
                                <Minus size={16} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Zoom Out</TooltipContent>
                    </Tooltip>

                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "h-8 px-2 rounded-none border-l border-r border-border/50",
                            "text-xs font-normal"
                        )}
                        onClick={resetZoom}
                    >
                        {zoomLevel}%
                    </Button>

                    <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 rounded-l-none" onClick={increaseZoom}>
                                <Plus size={16} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Zoom In</TooltipContent>
                    </Tooltip>
                </div>

                <Button variant="ghost" size="icon" className="size-8">
                    <Grid3x3 size={18} />
                </Button>

                {!isMobile && (
                    <>
                        <Button variant="ghost" size="icon" className="size-8">
                            <Settings size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8">
                            <Share2 size={18} />
                        </Button>
                    </>
                )}

                {isMobile && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                                <Settings size={18} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Share2 className="mr-2 size-4" />
                                Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Undo2 className="mr-2 size-4" />
                                Undo
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Redo2 className="mr-2 size-4" />
                                Redo
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
}
