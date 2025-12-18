"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Maximize2, PanelRightClose, PanelRightOpen, Minimize2, MoreHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TopBarProps {
  mode: "classic" | "tournament"
  focusMode: boolean
  inspectorVisible: boolean
  onToggleFocus: () => void
  onToggleInspector: () => void
}

export function TopBar({ mode, focusMode, inspectorVisible, onToggleFocus, onToggleInspector }: TopBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="flex h-16 items-center justify-center px-8 absolute top-6 w-full pointer-events-none z-30">
      <div className="w-full max-w-5xl relative h-full">
        <div 
            className={cn(
            "flex items-center gap-2 pointer-events-auto bg-background/60 backdrop-blur-xl border border-border-subtle shadow-lg transition-all duration-500 ease-out overflow-hidden absolute -top-4 right-0",
            isExpanded ? "rounded-full p-1.5 pl-3" : "rounded-full p-1.5 w-10 h-10 justify-center hover:w-28 group cursor-pointer hover:bg-background/80 hover:border-primary/20"
            )}
            onClick={() => !isExpanded && setIsExpanded(true)}
        >
            {!isExpanded ? (
            <div className="flex items-center justify-center w-full h-full relative">
                <MoreHorizontal className="h-5 w-5 text-foreground-secondary absolute transition-all duration-300 group-hover:opacity-0 group-hover:scale-0 group-hover:rotate-180" />
                <span className="text-xs font-medium text-foreground opacity-0 absolute transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 whitespace-nowrap translate-y-2 group-hover:translate-y-0">
                展开菜单
                </span>
            </div>
            ) : (
            <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-4 duration-300">
                <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                    e.stopPropagation()
                    onToggleInspector()
                }} 
                className="h-9 px-4 text-xs rounded-full hover:bg-accent text-foreground-secondary hover:text-foreground transition-all whitespace-nowrap"
                >
                {inspectorVisible && !focusMode ? (
                    <>
                    <PanelRightClose className="mr-2 h-4 w-4" />
                    收起面板
                    </>
                ) : (
                    <>
                    <PanelRightOpen className="mr-2 h-4 w-4" />
                    展开面板
                    </>
                )}
                </Button>
                
                <div className="w-px h-5 bg-border-subtle/50 mx-1" />
                
                <Button 
                variant={focusMode ? "secondary" : "ghost"} 
                size="sm" 
                onClick={(e) => {
                    e.stopPropagation()
                    onToggleFocus()
                }} 
                className={cn(
                    "h-9 px-4 text-xs rounded-full transition-all whitespace-nowrap",
                    focusMode ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20" : "hover:bg-accent text-foreground-secondary hover:text-foreground"
                )}
                >
                {focusMode ? (
                    <>
                    <Minimize2 className="mr-2 h-4 w-4" />
                    退出专注
                    </>
                ) : (
                    <>
                    <Maximize2 className="mr-2 h-4 w-4" />
                    专注模式
                    </>
                )}
                </Button>
                
                <div className="w-px h-5 bg-border-subtle/50 mx-1" />
                
                <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive text-foreground-secondary transition-colors"
                onClick={(e) => {
                    e.stopPropagation()
                    setIsExpanded(false)
                }}
                >
                <X className="h-4 w-4" />
                </Button>
            </div>
            )}
        </div>
      </div>
    </div>
  )
}
