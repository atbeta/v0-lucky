"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, Sparkles, Users, Clock, SettingsIcon, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

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
    <aside
      className={cn(
        "flex flex-col h-screen border-r border-border-subtle bg-background-elevated transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 mb-2">
        {!collapsed && (
          <div className="flex items-center gap-3 pl-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-light to-primary-dark shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "h-9 w-9 text-foreground-secondary hover:bg-background-overlay hover:text-primary rounded-lg transition-all", 
            collapsed && "mx-auto"
          )}
        >
          <ChevronLeft className={cn("h-5 w-5 transition-transform duration-300", collapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          
          if (collapsed) {
            return (
              <Tooltip key={item.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onViewChange(item.id)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer",
                      "hover:bg-background-overlay hover:text-primary active:scale-95",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary-light hover:text-white" 
                        : "text-foreground-secondary",
                      "justify-center px-2"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                      isActive ? "text-white" : "text-foreground-secondary group-hover:text-primary"
                    )} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer",
                "hover:bg-background-overlay hover:text-primary active:scale-95",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary-light hover:text-white" 
                  : "text-foreground-secondary",
              )}
            >
              <Icon className={cn(
                "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-white" : "text-foreground-secondary group-hover:text-primary"
              )} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 mt-auto mb-4">
        {!collapsed ? (
          <div className="rounded-xl bg-background-overlay/50 p-4 border border-border-subtle/50">
            <div className="text-xs text-foreground-secondary">
              <div className="font-semibold text-foreground mb-1">v2.0.0</div>
              <div>祝君好运</div>
            </div>
          </div>
        ) : (
           <div className="flex justify-center pb-2">
             <div className="h-1.5 w-1.5 rounded-full bg-border-subtle" />
           </div>
        )}
      </div>
    </aside>
  )
}
