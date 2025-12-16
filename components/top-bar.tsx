"use client"

import { Button } from "@/components/ui/button"
import { Maximize2, PanelRightClose, PanelRightOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TopBarProps {
  mode: "classic" | "tournament"
  focusMode: boolean
  onToggleFocus: () => void
  onToggleInspector: () => void
}

export function TopBar({ mode, focusMode, onToggleFocus, onToggleInspector }: TopBarProps) {
  return (
    <div className="flex h-12 items-center justify-between border-b border-border/50 bg-card/50 px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold text-foreground/90">抽奖大厅</h1>
        <Badge variant="secondary" className="text-xs">
          {mode === "classic" ? "经典模式" : "晋级模式"}
        </Badge>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={onToggleInspector} className="h-7 px-2.5 text-xs">
          {focusMode ? (
            <PanelRightOpen className="mr-1.5 h-3.5 w-3.5" />
          ) : (
            <PanelRightClose className="mr-1.5 h-3.5 w-3.5" />
          )}
          信息面板
        </Button>
        <Button variant="ghost" size="sm" onClick={onToggleFocus} className="h-7 px-2.5 text-xs">
          <Maximize2 className="mr-1.5 h-3.5 w-3.5" />
          {focusMode ? "退出专注" : "专注模式"}
        </Button>
      </div>
    </div>
  )
}
