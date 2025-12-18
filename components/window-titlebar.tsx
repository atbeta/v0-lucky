"use client"

import { useEffect, useState } from "react"
import { Minus, Square, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
    <div data-tauri-drag-region className="flex h-10 items-center justify-between border-b border-border-subtle bg-background-elevated/50 backdrop-blur-md px-4 select-none z-50 transition-colors duration-300">
      {/* App Title & Icon */}
      <div data-tauri-drag-region className="flex items-center gap-3 text-xs text-foreground-secondary pointer-events-none">
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-primary-light to-primary-dark shadow-sm">
          <svg className="h-3 w-3 fill-white" viewBox="0 0 1024 1024">
             <path d="M512 0C452 362 362 452 0 512C362 572 452 662 512 1024C572 662 662 572 1024 512C662 452 572 362 512 0Z" />
          </svg>
        </div>
        <span className="font-semibold tracking-wide text-foreground/80">{title}</span>
      </div>

      {/* Window Controls */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMinimize}
          className="h-7 w-9 rounded-lg hover:bg-accent text-foreground-secondary hover:text-foreground transition-colors"
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMaximize}
          className="h-7 w-9 rounded-lg hover:bg-accent text-foreground-secondary hover:text-foreground transition-colors"
        >
          <Square className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="h-7 w-9 rounded-lg hover:bg-destructive hover:text-white text-foreground-secondary transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
