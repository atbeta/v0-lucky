"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, Sparkles, Users, Clock, SettingsIcon, Target } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  currentView: "draw" | "participants" | "prizes" | "history" | "settings"
  onViewChange: (view: "draw" | "participants" | "prizes" | "history" | "settings") => void
}

const navItems = [
  { id: "draw" as const, icon: Sparkles, label: "抽奖" },
  { id: "participants" as const, icon: Users, label: "参与人" },
  { id: "prizes" as const, icon: Target, label: "抽奖配置" },
  { id: "history" as const, icon: Clock, label: "历史记录" },
  { id: "settings" as const, icon: SettingsIcon, label: "设置" },
]

export function Sidebar({ collapsed, onToggle, currentView, onViewChange }: SidebarProps) {
  return (
    <div
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">Lucky Draw</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent", collapsed && "mx-auto")}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        {!collapsed && (
          <div className="text-xs text-muted-foreground">
            <div className="font-medium">v2.0.0</div>
            <div className="mt-1">Tauri + React</div>
          </div>
        )}
      </div>
    </div>
  )
}
