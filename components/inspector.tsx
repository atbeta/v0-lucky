"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, TrendingUp, Target, List, Settings2 } from "lucide-react"
import { cn } from "@/lib/utils"

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
    <div className="w-80 border-l border-border-subtle bg-background-elevated overflow-auto flex flex-col h-full shadow-[-4px_0_20px_rgba(0,0,0,0.05)] z-10">
      <div className="p-5 flex-1 space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
           <Settings2 className="h-4 w-4 text-primary" />
           <h3 className="text-sm font-bold text-foreground">抽奖概览</h3>
        </div>

        {/* Mode Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">抽奖模式</label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-background rounded-xl border border-border-subtle">
            <button
              onClick={() => onModeChange("classic")}
              className={cn(
                "flex items-center justify-center py-2 rounded-lg text-sm font-medium transition-all",
                mode === "classic" 
                  ? "bg-background-elevated text-primary shadow-sm" 
                  : "text-foreground-secondary hover:text-foreground"
              )}
            >
              经典
            </button>
            <button
              onClick={() => onModeChange("tournament")}
              className={cn(
                "flex items-center justify-center py-2 rounded-lg text-sm font-medium transition-all",
                mode === "tournament" 
                  ? "bg-background-elevated text-primary shadow-sm" 
                  : "text-foreground-secondary hover:text-foreground"
              )}
            >
              晋级
            </button>
          </div>
        </div>
        
        {/* Config Summary */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">当前规则</label>
          <div className="rounded-xl border border-border-subtle bg-background p-4 space-y-4 shadow-sm">
             {mode === "classic" ? (
               <>
                 <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2.5 text-foreground-secondary">
                      <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                        <Target className="h-3.5 w-3.5" />
                      </div>
                      <span>中奖人数</span>
                   </div>
                   <span className="font-bold text-foreground">{classicCount} 人</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2.5 text-foreground-secondary">
                      <div className="p-1.5 rounded-md bg-accent-purple/10 text-accent-purple">
                        <List className="h-3.5 w-3.5" />
                      </div>
                      <span>抽取方式</span>
                   </div>
                   <span className="font-bold text-foreground text-right">
                     {classicMethod === "all" && "一次性全部"}
                     {classicMethod === "one-by-one" && "逐个抽取"}
                     {classicMethod === "batch" && `分批 (${batchSize}人/次)`}
                   </span>
                 </div>
               </>
             ) : (
               <>
                 <div className="flex items-center justify-between text-sm pb-2 border-b border-border-subtle/50">
                   <div className="flex items-center gap-2.5 text-foreground-secondary">
                      <div className="p-1.5 rounded-md bg-accent-cyan/10 text-accent-cyan">
                        <List className="h-3.5 w-3.5" />
                      </div>
                      <span>晋级轮次</span>
                   </div>
                   <span className="font-bold text-foreground">{tournamentRounds.length} 轮</span>
                 </div>
                 <div className="space-y-2 pt-2">
                    {tournamentRounds.map((round, idx) => (
                       <div key={idx} className="flex items-center justify-between text-xs group">
                          <span className="text-foreground-secondary group-hover:text-primary transition-colors">
                            <span className="inline-block w-4 mr-1 text-center font-mono opacity-50">{idx + 1}</span>
                            {round.name || `第${idx + 1}轮`}
                          </span>
                          <Badge variant="secondary" className="h-5 px-1.5 font-mono bg-background-overlay">
                            {round.count}人
                          </Badge>
                       </div>
                    ))}
                 </div>
               </>
             )}
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">数据统计</label>
          <div className="grid gap-3">
            <div className="rounded-xl border border-border-subtle bg-background p-3 flex items-center justify-between hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10 text-success">
                  <Users className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-foreground-secondary">可参与</span>
                  <span className="text-sm font-bold text-foreground">{availableCount} 人</span>
                </div>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(var(--success),0.5)]"></div>
            </div>

            <div className="rounded-xl border border-border-subtle bg-background p-3 flex items-center justify-between hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10 text-warning">
                  <Trophy className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-foreground-secondary">已排除</span>
                  <span className="text-sm font-bold text-foreground">{excludedCount} 人</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border-subtle bg-background p-3 flex items-center justify-between hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-foreground-secondary">总人数</span>
                  <span className="text-sm font-bold text-foreground">{participants.length} 人</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}
