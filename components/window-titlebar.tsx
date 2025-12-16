"use client"

import { useEffect, useState } from "react"
import { Minus, Square, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentWindow } from "@tauri-apps/api/window"

interface WindowTitlebarProps {
  title?: string
}

export function WindowTitlebar({ title = "抽奖助手" }: WindowTitlebarProps) {
  const [appWindow, setAppWindow] = useState<any>(null)

  useEffect(() => {
    // Dynamically import to avoid SSR issues and check if running in Tauri
    import("@tauri-apps/api/window").then((module) => {
      try {
        const win = module.getCurrentWindow()
        setAppWindow(win)
      } catch (e) {
        console.log("Not running in Tauri environment")
      }
    })
  }, [])

  const handleMinimize = () => {
    appWindow?.minimize()
  }

  const handleMaximize = () => {
    appWindow?.toggleMaximize()
  }

  const handleClose = () => {
    appWindow?.close()
  }

  return (
    <div data-tauri-drag-region className="flex h-8 items-center justify-between border-b border-border/50 bg-titlebar px-3 select-none">
      {/* App Title & Icon */}
      <div data-tauri-drag-region className="flex items-center gap-2 text-xs text-titlebar-foreground pointer-events-none">
        <div className="flex h-4 w-4 items-center justify-center">
          <svg className="h-3 w-3 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          </svg>
        </div>
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
