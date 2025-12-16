"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, TrendingUp } from "lucide-react"

interface Participant {
  id: number
  name: string
  weight: number
  excluded: boolean
}

interface InspectorProps {
  mode: "classic" | "tournament"
  participants: Participant[]
  onModeChange: (mode: "classic" | "tournament") => void
}

export function Inspector({ mode, participants, onModeChange }: InspectorProps) {
  const availableCount = participants.filter((p) => !p.excluded).length
  const excludedCount = participants.filter((p) => p.excluded).length

  return (
    <div className="w-80 border-l border-border bg-card overflow-auto">
      <div className="p-4">
        <h3 className="mb-4 text-sm font-semibold text-muted-foreground">抽奖信息</h3>

        {/* Mode Selection */}
        <div className="mb-6 space-y-2">
          <label className="text-xs font-medium text-muted-foreground">抽奖模式</label>
          <div className="flex gap-2">
            <Button
              variant={mode === "classic" ? "default" : "outline"}
              size="sm"
              onClick={() => onModeChange("classic")}
              className="flex-1"
            >
              经典模式
            </Button>
            <Button
              variant={mode === "tournament" ? "default" : "outline"}
              size="sm"
              onClick={() => onModeChange("tournament")}
              className="flex-1"
            >
              晋级模式
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">参与人数</span>
              </div>
              <Badge variant="secondary">{availableCount}</Badge>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-accent" />
                <span className="text-sm text-muted-foreground">已排除</span>
              </div>
              <Badge variant="secondary">{excludedCount}</Badge>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-chart-3" />
                <span className="text-sm text-muted-foreground">总人数</span>
              </div>
              <Badge variant="secondary">{participants.length}</Badge>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <label className="mb-2 block text-xs font-medium text-muted-foreground">快捷操作</label>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start text-xs bg-transparent">
              导出结果
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs bg-transparent">
              清空历史
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
