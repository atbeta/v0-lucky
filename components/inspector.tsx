"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, TrendingUp, Target, List, Settings2, UserCheck, UserX } from "lucide-react"
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
  isDrawing?: boolean
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
  isDrawing = false,
  classicCount,
  classicMethod,
  batchSize,
  tournamentRounds
}: InspectorProps) {
  const availableCount = participants.filter((p) => !p.excluded).length
  const excludedCount = participants.filter((p) => p.excluded).length

  return (
    <div className="w-80 border-l border-border-subtle bg-background-elevated/50 backdrop-blur-xl overflow-auto flex flex-col h-full shadow-[-4px_0_30px_rgba(0,0,0,0.1)] z-10 transition-all duration-300">
      <div className="p-5 flex-1 space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-border-subtle">
           <div className="p-2 rounded-lg bg-primary/10 text-primary">
             <Settings2 className="h-5 w-5" />
           </div>
           <h3 className="text-base font-bold text-foreground tracking-tight">抽奖概览</h3>
        </div>

        {/* Mode Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-foreground-tertiary uppercase tracking-wider px-1">抽奖模式</label>
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-background/50 rounded-2xl border border-border-subtle shadow-inner">
            <button
              onClick={() => !isDrawing && onModeChange("classic")}
              disabled={isDrawing}
              className={cn(
                "flex items-center justify-center py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                mode === "classic" 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                  : "text-foreground-secondary hover:text-foreground hover:bg-accent",
                isDrawing && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-foreground-secondary"
              )}
            >
              经典
            </button>
            <button
              onClick={() => !isDrawing && onModeChange("tournament")}
              disabled={isDrawing}
              className={cn(
                "flex items-center justify-center py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                mode === "tournament" 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                  : "text-foreground-secondary hover:text-foreground hover:bg-accent",
                isDrawing && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-foreground-secondary"
              )}
            >
              晋级
            </button>
          </div>
        </div>
        
        {/* Config Summary */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-foreground-tertiary uppercase tracking-wider px-1">当前规则</label>
          <div className="rounded-2xl border border-border-subtle bg-background/40 p-5 space-y-5 shadow-sm backdrop-blur-sm hover:bg-background/60 transition-colors duration-300">
             {mode === "classic" ? (
               <>
                 <div className="flex items-center justify-between text-sm group">
                   <div className="flex items-center gap-3 text-foreground-secondary group-hover:text-foreground transition-colors">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                        <Target className="h-4 w-4" />
                      </div>
                      <span>中奖人数</span>
                   </div>
                   <span className="font-bold text-foreground text-base">{classicCount} 人</span>
                 </div>
                 <div className="h-px w-full bg-border-subtle/50" />
                 <div className="flex items-center justify-between text-sm group">
                   <div className="flex items-center gap-3 text-foreground-secondary group-hover:text-foreground transition-colors">
                      <div className="p-2 rounded-lg bg-accent-purple/10 text-accent-purple group-hover:scale-110 transition-transform">
                        <List className="h-4 w-4" />
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
                 <div className="flex items-center justify-between text-sm pb-4 border-b border-border-subtle/50 group">
                   <div className="flex items-center gap-3 text-foreground-secondary group-hover:text-foreground transition-colors">
                      <div className="p-2 rounded-lg bg-accent-cyan/10 text-accent-cyan group-hover:scale-110 transition-transform">
                        <List className="h-4 w-4" />
                      </div>
                      <span>晋级轮次</span>
                   </div>
                   <span className="font-bold text-foreground text-base">{tournamentRounds.length} 轮</span>
                 </div>
                 <div className="space-y-3 pt-1">
                    {tournamentRounds.map((round, idx) => (
                       <div key={idx} className="flex items-center justify-between text-xs group/item hover:bg-accent p-2 rounded-lg -mx-2 transition-colors">
                          <span className="text-foreground-secondary group-hover/item:text-foreground transition-colors flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-border-subtle/50 text-[10px] font-mono group-hover/item:bg-primary/20 group-hover/item:text-primary transition-colors">
                              {idx + 1}
                            </span>
                            {round.name || `第${idx + 1}轮`}
                          </span>
                          <Badge variant="secondary" className="h-6 px-2 font-mono bg-background/50 border-border-subtle group-hover/item:border-primary/20 transition-colors">
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
          <label className="text-xs font-bold text-foreground-tertiary uppercase tracking-wider px-1">数据统计</label>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-border-subtle bg-background/40 p-4 flex items-center justify-between hover:border-success/30 hover:bg-success/5 transition-all duration-300 group shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-success/10 text-success group-hover:scale-110 transition-transform">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-foreground-secondary group-hover:text-foreground-secondary/80">可参与</span>
                  <span className="text-sm font-bold text-foreground">{availableCount} 人</span>
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-success shadow-[0_0_10px_rgba(var(--success),0.6)] animate-pulse"></div>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-background/40 p-4 flex items-center justify-between hover:border-warning/30 hover:bg-warning/5 transition-all duration-300 group shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-warning/10 text-warning group-hover:scale-110 transition-transform">
                  <UserX className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-foreground-secondary group-hover:text-foreground-secondary/80">已排除</span>
                  <span className="text-sm font-bold text-foreground">{excludedCount} 人</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-background/40 p-4 flex items-center justify-between hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Users className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-foreground-secondary group-hover:text-foreground-secondary/80">总人数</span>
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
