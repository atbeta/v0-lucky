"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"

interface Participant {
  id: number
  name: string
  weight: number
  excluded: boolean
}

interface DrawViewProps {
  mode: "classic" | "tournament"
  isDrawing: boolean
  winners: string[]
  participants: Participant[]
  roundInfo?: {
    current: number
    total: number
    name: string
    isFinished: boolean
    targetCount: number
    winnersSoFar: string[]
  }
  winnerCount: number
  // Settings
  hideNamesWhileRolling?: boolean
  particleEffects?: boolean
  prizeName?: string
  lastCelebratedWinners?: string
  onCelebrationComplete?: (winnersKey: string) => void
}

export function DrawView({ 
  mode, 
  isDrawing, 
  winners, 
  participants, 
  roundInfo, 
  winnerCount, 
  classicTotal, 
  classicWinnersSoFar, 
  prizeName, 
  hideNamesWhileRolling, 
  particleEffects,
  lastCelebratedWinners = "",
  onCelebrationComplete = () => {}
}: DrawViewProps) {
  const [rollingNames, setRollingNames] = useState<string[]>([])
  
  // Confetti effect
  useEffect(() => {
    // Check if we have winners, effects are enabled, AND we haven't shown for this specific set of winners yet
    // Compare against the prop passed from parent (persisted state)
    const winnersKey = JSON.stringify(winners)
    
    // Check completion conditions
    let shouldCelebrate = false;
    if (mode === "classic") {
        // Only celebrate if ALL classic winners are drawn
        if (classicTotal && classicWinnersSoFar && classicWinnersSoFar.length >= classicTotal) {
            shouldCelebrate = true;
        }
    } else if (mode === "tournament") {
        // Only celebrate if FINAL round is finished
        if (roundInfo && roundInfo.isFinished && roundInfo.current === roundInfo.total) {
            shouldCelebrate = true;
        }
    }

    if (winners.length > 0 && particleEffects && lastCelebratedWinners !== winnersKey && shouldCelebrate) {
        // Notify parent immediately
        onCelebrationComplete(winnersKey)
        
        import("canvas-confetti").then((confetti) => {
             const duration = 3000;
             const animationEnd = Date.now() + duration;
             const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

             const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

             const interval: any = setInterval(function() {
                 const timeLeft = animationEnd - Date.now();

                 if (timeLeft <= 0) {
                     return clearInterval(interval);
                 }

                 const particleCount = 50 * (timeLeft / duration);
                 // since particles fall down, start a bit higher than random
                 confetti.default({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                 confetti.default({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
             }, 250);
        }).catch(err => console.error("Confetti failed", err));
    } else if (winners.length === 0 && lastCelebratedWinners !== "") {
        // Reset if winners are cleared (new game started) - though parent handles this usually on reset
        onCelebrationComplete("")
    }
  }, [winners, particleEffects, lastCelebratedWinners, onCelebrationComplete]);

  useEffect(() => {
    if (isDrawing) {
      const interval = setInterval(() => {
        const availableParticipants = participants.filter((p) => !p.excluded)
        if (availableParticipants.length > 0) {
           // Generate rolling names based on winnerCount
           // If winnerCount is large (e.g. > 10), maybe we shouldn't show ALL rolling?
           // But user asked for "2个一起滚". So we should respect winnerCount.
           // Let's cap visual rolling slots to a reasonable number if it's huge, but for < 20 it's fine.
           
           const count = Math.max(1, winnerCount)
           const currentRolling: string[] = []
           
           for(let i=0; i<count; i++) {
               const randomIndex = Math.floor(Math.random() * availableParticipants.length)
               currentRolling.push(availableParticipants[randomIndex].name)
           }
           setRollingNames(currentRolling)
        }
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isDrawing, participants, winnerCount])

  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <div className="text-center w-full max-w-4xl">
        {/* Main Display */}
        <div className="relative">
          {/* Background glow effect */}
          <div className="absolute inset-0 -z-10 animate-glow rounded-2xl bg-primary/10 blur-3xl" />

          {/* Winner/Rolling Display Container */}
          <div
             className={cn(
              "rounded-2xl border-2 p-8 backdrop-blur-sm transition-all min-h-[300px] flex flex-col items-center justify-center",
              isDrawing
                ? "animate-roll border-primary/50 bg-stage-highlight/50"
                : winners.length > 0
                  ? "border-primary bg-stage-highlight/80"
                  : "border-border/50 bg-card/50",
            )}
          >
             <div className="mb-8 flex flex-col items-center justify-center gap-2">
              <div className="flex flex-col items-center gap-4">
                {/* Prize Name Display */}
                {prizeName && (
                  <div className="rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent border border-accent/20 animate-in fade-in slide-in-from-top-4 duration-700">
                    🏆 {prizeName}
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Sparkles
                    className={cn(
                      "h-6 w-6",
                      isDrawing
                        ? "animate-spin text-primary"
                        : winners.length > 0
                          ? "text-primary"
                          : "text-muted-foreground",
                    )}
                  />
                  <span className="text-sm font-medium text-muted-foreground">
                    {isDrawing ? "抽奖中..." : winners.length > 0 ? "中奖者" : "准备开始"}
                  </span>
                </div>
              </div>
              
              {/* Tournament Info */}
              {mode === "tournament" && roundInfo && (
                <div className="mt-2 flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                   <span>第 {roundInfo.current} / {roundInfo.total} 轮：{roundInfo.name}</span>
                </div>
              )}
            </div>

            {/* Names Grid */}
            <div className={cn(
                "flex flex-wrap justify-center gap-4",
                (winners.length > 1 || (isDrawing && winnerCount > 1)) ? "w-full" : ""
            )}>
                {isDrawing ? (
                     // Rolling State
                     rollingNames.map((name, index) => (
                         <div key={index} className={cn(
                             "font-mono font-bold tracking-wider text-foreground/70 transition-all",
                              winnerCount > 1 ? "text-4xl bg-primary/5 px-6 py-3 rounded-xl border border-primary/10" : "text-6xl",
                              hideNamesWhileRolling && "blur-md select-none"
                         )}>
                             {name}
                         </div>
                     ))
                ) : winners.length > 0 ? (
                    // Winners State
                    winners.map((winner, index) => (
                        <div key={index} className="animate-in zoom-in duration-500">
                             <div className={cn(
                                 "font-mono font-bold tracking-wider text-primary",
                                 winners.length > 1 ? "text-4xl bg-primary/10 px-6 py-3 rounded-xl border border-primary/20" : "text-6xl"
                             )}>
                                 {winner}
                             </div>
                        </div>
                    ))
                ) : (
                    // Idle State
                    <div className="font-mono text-6xl font-bold tracking-wider text-muted-foreground">
                        ---
                    </div>
                )}
            </div>
          </div>
          
          {/* Tournament Round Progress */}
          {mode === "tournament" && roundInfo && (
             <div className="mt-6">
                 <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                    <span>本轮晋级名单 ({roundInfo.winnersSoFar.length}/{roundInfo.targetCount})</span>
                 </div>
                 
                 {roundInfo.winnersSoFar.length > 0 ? (
                     <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                         {roundInfo.winnersSoFar.map((winner, idx) => (
                             <div key={idx} className="animate-in fade-in zoom-in duration-300 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary">
                                 <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold">
                                     {idx + 1}
                                 </div>
                                 {winner}
                             </div>
                         ))}
                         {/* Placeholders for remaining slots */}
                         {Array.from({ length: Math.max(0, roundInfo.targetCount - roundInfo.winnersSoFar.length) }).map((_, idx) => (
                             <div key={`placeholder-${idx}`} className="h-8 w-24 rounded-full border border-dashed border-border/50 bg-transparent opacity-50" />
                         ))}
                     </div>
                 ) : (
                     <div className="flex justify-center gap-2 opacity-50">
                         {Array.from({ length: roundInfo.targetCount }).map((_, idx) => (
                             <div key={`empty-${idx}`} className="h-8 w-24 rounded-full border border-dashed border-border/50 bg-transparent" />
                         ))}
                     </div>
                 )}
              </div>
           )}

          {/* Classic Batch Progress */}
          {mode === "classic" && classicTotal && classicTotal > 0 && classicWinnersSoFar && classicWinnersSoFar.length > 0 && (
             <div className="mt-6">
                 <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                    <span>已中奖名单 ({classicWinnersSoFar.length}/{classicTotal})</span>
                 </div>
                 
                 <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                     {classicWinnersSoFar.map((winner, idx) => (
                         <div key={idx} className="animate-in fade-in zoom-in duration-300 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary">
                             <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold">
                                 {idx + 1}
                             </div>
                             {winner}
                         </div>
                     ))}
                     {/* Placeholders for remaining slots */}
                     {Array.from({ length: Math.max(0, classicTotal - classicWinnersSoFar.length) }).map((_, idx) => (
                         <div key={`placeholder-${idx}`} className="h-8 w-24 rounded-full border border-dashed border-border/50 bg-transparent opacity-50" />
                     ))}
                 </div>
             </div>
          )}
        </div>

        {/* Status Info */}
        <div className="mt-8 text-sm text-muted-foreground">
          {winners.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {mode === "tournament" && roundInfo
                    ? roundInfo.isFinished
                        ? roundInfo.current === roundInfo.total 
                            ? `最终大奖揭晓！恭喜 ${winners.length} 位获得最终胜利 🎉` 
                            : `本轮结束！恭喜 ${roundInfo.winnersSoFar.length} 位晋级下一轮 🎉`
                        : roundInfo.current === roundInfo.total
                             ? "恭喜中奖！🎉" // Final round
                             : "恭喜晋级！🎉" // Intermediate round
                    : mode === "classic" && classicTotal && classicWinnersSoFar && classicWinnersSoFar.length >= classicTotal
                        ? `抽奖结束！恭喜所有 ${classicWinnersSoFar.length} 位中奖者 🎉`
                        : "恭喜中奖！🎉"
                }
            </div>
          )}
          {!isDrawing && winners.length === 0 && <div className="text-xs">点击底部按钮开始抽奖</div>}
        </div>
      </div>
    </div>
  )
}
