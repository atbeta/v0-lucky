"use client"

import { Minus, Square, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WindowTitlebarProps {
  title?: string
}

export function WindowTitlebar({ title = "抽奖助手" }: WindowTitlebarProps) {
  const handleMinimize = () => {
    // In a real Tauri app, this would call: invoke('minimize_window')
    console.log("[v0] Minimize window")
  }

  const handleMaximize = () => {
    // In a real Tauri app, this would call: invoke('toggle_maximize')
    console.log("[v0] Maximize window")
  }

  const handleClose = () => {
    // In a real Tauri app, this would call: invoke('close_window')
    console.log("[v0] Close window")
  }

  return (
    <div className="flex h-8 items-center justify-between border-b border-border/50 bg-titlebar px-3 select-none">
      {/* App Title & Icon */}
      <div className="flex items-center gap-2 text-xs text-titlebar-foreground">
        <div className="flex h-4 w-4 items-center justify-center">
          <svg className="h-3 w-3 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          </svg>
        </div>
        <span className="font-medium">{title}</span>
      </div>

      {/* Window Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMinimize}
          className="h-6 w-8 rounded-none hover:bg-titlebar-hover text-titlebar-foreground"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMaximize}
          className="h-6 w-8 rounded-none hover:bg-titlebar-hover text-titlebar-foreground"
        >
          <Square className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="h-6 w-8 rounded-none hover:bg-destructive hover:text-destructive-foreground text-titlebar-foreground"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
