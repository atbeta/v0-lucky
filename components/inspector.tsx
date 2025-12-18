"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, TrendingUp, Target, List } from "lucide-react"

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
  // Classic Config
  classicCount: number
  classicMethod: "all" | "one-by-one" | "batch"
  batchSize: number
  // Tournament Config
  tournamentRounds: { id: number; count: number; name: string }[]
}

export function Inspector({ 
  mode, 
  participants, 
  onModeChange,
  classicCount,
  classicMethod,
  batchSize,
  tournamentRounds
}: InspectorProps) {
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
        
        {/* Config Summary */}
        <div className="mb-6 space-y-2">
          <label className="text-xs font-medium text-muted-foreground">规则配置</label>
          <div className="rounded-lg border border-border bg-background p-3 space-y-3">
             {mode === "classic" ? (
               <>
                 <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2 text-muted-foreground">
                      <Target className="h-4 w-4" />
                      <span>中奖人数</span>
                   </div>
                   <span className="font-medium">{classicCount} 人</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2 text-muted-foreground">
                      <List className="h-4 w-4" />
                      <span>抽取方式</span>
                   </div>
                   <span className="font-medium">
                     {classicMethod === "all" && "一次性全部"}
                     {classicMethod === "one-by-one" && "逐个抽取"}
                     {classicMethod === "batch" && `分批 (${batchSize}人/次)`}
                   </span>
                 </div>
               </>
             ) : (
               <>
                 <div className="flex items-center justify-between text-sm mb-2">
                   <div className="flex items-center gap-2 text-muted-foreground">
                      <List className="h-4 w-4" />
                      <span>晋级轮次</span>
                   </div>
                   <span className="font-medium">{tournamentRounds.length} 轮</span>
                 </div>
                 <div className="space-y-1.5 pt-1 border-t border-border/50">
                    {tournamentRounds.map((round, idx) => (
                       <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">第{idx + 1}轮 ({round.name})</span>
                          <span className="font-mono">晋级 {round.count} 人</span>
                       </div>
                    ))}
                 </div>
               </>
             )}
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
      </div>
    </div>
  )
}
