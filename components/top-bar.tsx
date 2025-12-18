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
    <div className="flex h-14 items-center justify-end px-4 absolute top-4 right-0 z-20 w-full pointer-events-none">
      <div 
        className={cn(
          "flex items-center gap-1 pointer-events-auto bg-background-elevated/80 backdrop-blur-md border border-border-subtle shadow-sm transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded ? "rounded-full p-1 pl-2" : "rounded-full p-1 w-8 h-8 justify-center hover:w-24 group cursor-pointer"
        )}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {!isExpanded ? (
          <div className="flex items-center justify-center w-full h-full relative">
            <MoreHorizontal className="h-4 w-4 text-foreground-secondary absolute transition-all duration-300 group-hover:opacity-0 group-hover:scale-0" />
            <span className="text-[10px] font-medium text-foreground-secondary opacity-0 absolute transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 whitespace-nowrap">
              展开菜单
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-4 duration-300">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation()
                onToggleInspector()
              }} 
              className="h-8 px-3 text-xs rounded-full hover:bg-background-overlay text-foreground-secondary hover:text-foreground transition-colors whitespace-nowrap"
            >
              {inspectorVisible && !focusMode ? (
                <>
                  <PanelRightClose className="mr-1.5 h-3.5 w-3.5" />
                  收起面板
                </>
              ) : (
                <>
                  <PanelRightOpen className="mr-1.5 h-3.5 w-3.5" />
                  展开面板
                </>
              )}
            </Button>
            
            <div className="w-px h-4 bg-border-subtle mx-0.5" />
            
            <Button 
              variant={focusMode ? "secondary" : "ghost"} 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation()
                onToggleFocus()
              }} 
              className={cn(
                "h-8 px-3 text-xs rounded-full transition-colors whitespace-nowrap",
                focusMode ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:bg-background-overlay text-foreground-secondary hover:text-foreground"
              )}
            >
              {focusMode ? (
                <>
                  <Minimize2 className="mr-1.5 h-3.5 w-3.5" />
                  退出专注
                </>
              ) : (
                <>
                  <Maximize2 className="mr-1.5 h-3.5 w-3.5" />
                  专注模式
                </>
              )}
            </Button>

            <div className="w-px h-4 bg-border-subtle mx-0.5" />

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(false)
              }}
              className="h-8 w-8 rounded-full hover:bg-background-overlay text-foreground-secondary hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
