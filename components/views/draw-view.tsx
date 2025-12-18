"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Sparkles, Volume2, VolumeX, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { isTauri, invoke, convertFileSrc } from "@tauri-apps/api/core"

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
  soundEnabled?: boolean
  onSoundToggle?: () => void
  onHideNamesToggle?: () => void
  prizeName?: string
  lastCelebratedWinners?: string
  onCelebrationComplete?: (winnersKey: string) => void
  classicTotal?: number
  classicWinnersSoFar?: string[]
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
  soundEnabled,
  onSoundToggle,
  onHideNamesToggle,
  lastCelebratedWinners = "",
  onCelebrationComplete = () => {}
}: DrawViewProps) {
  const [rollingNames, setRollingNames] = useState<string[]>([])
  const bgmRef = useRef<HTMLAudioElement | null>(null)
  const winnerSoundRef = useRef<HTMLAudioElement | null>(null)

  // Helper for dynamic item sizing based on total count
  const getItemSizeClass = (count: number) => {
    if (count > 20) return "h-8 w-20 text-xs"
    if (count > 10) return "h-9 w-24 text-xs"
    return "h-9 w-32 text-sm"
  }

  // Initialize Audio
  useEffect(() => {
    bgmRef.current = new Audio('/bgm.mp3')
    bgmRef.current.loop = true
    winnerSoundRef.current = new Audio('/winner.mp3')
    
    return () => {
      bgmRef.current?.pause()
      winnerSoundRef.current?.pause()
    }
  }, [])

  // Handle BGM
  useEffect(() => {
    if (soundEnabled && isDrawing) {
      bgmRef.current?.play().catch(e => console.error("Audio play failed", e))
    } else {
      bgmRef.current?.pause()
      if (bgmRef.current) bgmRef.current.currentTime = 0
    }
  }, [isDrawing, soundEnabled])

  // Handle Winner Sound (Reuse logic from Confetti)
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

    if (winners.length > 0 && lastCelebratedWinners !== winnersKey && shouldCelebrate) {
        // Notify parent immediately
        onCelebrationComplete(winnersKey)
        
        // Play Sound if enabled
        if (soundEnabled) {
            winnerSoundRef.current?.play().catch(e => console.error("Winner sound failed", e))
        }

        if (particleEffects) {
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
        }
    } else if (winners.length === 0 && lastCelebratedWinners !== "") {
        // Reset if winners are cleared (new game started) - though parent handles this usually on reset
        onCelebrationComplete("")
    }
  }, [winners, particleEffects, soundEnabled, lastCelebratedWinners, onCelebrationComplete]);

  useEffect(() => {
    if (isDrawing) {
      const interval = setInterval(() => {
        const availableParticipants = participants.filter((p) => !p.excluded)
        if (availableParticipants.length > 0) {
           const count = Math.max(1, winnerCount)
           const currentRolling: string[] = []
           
           for(let i=0; i<count; i++) {
               const randomIndex = Math.floor(Math.random() * availableParticipants.length)
               const realName = availableParticipants[randomIndex].name
               
               if (hideNamesWhileRolling) {
                   const firstChar = realName.slice(0, 1)
                   // Use '█' (Full Block) character to simulate blocking
                   // Add spaces to create gaps between blocks if needed, or just use blocks
                   const restLength = Math.max(2, realName.length - 1)
                   let mask = ""
                   for(let j=0; j<restLength; j++) {
                       // Use hair space (U+200A) or thin space (U+2009) for tighter gap
                       mask += "█\u200A" 
                   }
                   // Trim the last space
                   mask = mask.trimEnd()
                   
                   // Use a smaller space after first char too
                   currentRolling.push(firstChar + "\u200A" + mask)
               } else {
                   currentRolling.push(realName)
               }
           }
           setRollingNames(currentRolling)
        }
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isDrawing, participants, winnerCount, hideNamesWhileRolling])

  return (
    <div className="flex h-full flex-col items-center justify-start pt-24 p-8 bg-background relative">
      {/* Sound Toggle Button - Fixed to top-left of the view container */}
      {onSoundToggle && (
        <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onSoundToggle} 
                className="h-10 w-10 rounded-full bg-background-elevated/80 backdrop-blur-md border border-border-subtle shadow-sm hover:bg-background-overlay text-foreground-secondary hover:text-foreground transition-colors"
              >
                {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-foreground-tertiary" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>临时开启/关闭音效</p>
            </TooltipContent>
          </Tooltip>

          {onHideNamesToggle && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onHideNamesToggle} 
                  className="h-10 w-10 rounded-full bg-background-elevated/80 backdrop-blur-md border border-border-subtle shadow-sm hover:bg-background-overlay text-foreground-secondary hover:text-foreground transition-colors"
                >
                  {hideNamesWhileRolling ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{hideNamesWhileRolling ? "显示滚动名字" : "隐藏滚动名字"}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}

      <div className="text-center w-full max-w-5xl relative">
        {/* Main Display */}
        <div className="relative w-full aspect-video flex items-center justify-center">
          {/* Background glow effect */}
          <div className="absolute inset-0 -z-10 animate-glow rounded-3xl bg-primary/20 blur-[100px]" />
          
          {/* Winner/Rolling Display Container */}
          <div
             className={cn(
              "relative w-full h-full rounded-3xl p-12 backdrop-blur-md transition-all flex flex-col items-center justify-center overflow-hidden",
              "glass gradient-border shadow-2xl",
              isDrawing && "animate-pulse"
            )}
          >
             {/* Background Gradient Animation */}
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-purple/5 opacity-50" />
             
             <div className="relative z-10 w-full flex flex-col items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-4">
                {/* Prize Name Display */}
                {prizeName && (
                  <div className="rounded-full bg-background-overlay/80 px-6 py-2 text-base font-semibold text-accent-cyan border border-accent-cyan/20 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-700">
                    🏆 {prizeName}
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Sparkles
                    className={cn(
                      "h-6 w-6",
                      isDrawing
                        ? "animate-spin text-primary"
                        : winners.length > 0
                          ? "text-primary"
                          : "text-foreground-tertiary",
                    )}
                  />
                  <span className="text-sm font-medium text-foreground-secondary uppercase tracking-widest">
                    {isDrawing ? "抽奖中..." : winners.length > 0 ? "中奖者" : "准备开始"}
                  </span>
                </div>
              </div>
              
              {/* Tournament Info */}
              {mode === "tournament" && roundInfo && (
                <div className="mt-2 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20">
                   <span>第 {roundInfo.current} / {roundInfo.total} 轮</span>
                </div>
              )}

            {/* Names Grid */}
            <div className={cn(
                "flex flex-wrap justify-center gap-6 mt-4 w-full",
                (winners.length > 1 || (isDrawing && winnerCount > 1)) ? "w-full px-8" : ""
            )}>
                {isDrawing ? (
                     // Rolling State
                     rollingNames.map((name, index) => (
                         <div key={index} className={cn(
                             "font-mono font-bold tracking-wider text-foreground/80 transition-all animate-roll",
                              winnerCount > 1 
                                ? "text-5xl bg-background/30 px-8 py-4 rounded-2xl border border-white/10 shadow-inner backdrop-blur-sm" 
                                : "text-8xl gradient-text drop-shadow-2xl",
                              hideNamesWhileRolling && "text-primary/60 font-mono tracking-tighter"
                         )}>
                             {name}
                         </div>
                     ))
                ) : winners.length > 0 ? (
                    // Winners State
                    winners.map((winner, index) => (
                        <div key={index} className="animate-in zoom-in duration-500">
                             <div className={cn(
                                 "font-mono font-bold tracking-wider glow",
                                 winners.length > 1 
                                   ? "text-5xl bg-background-elevated/80 px-8 py-4 rounded-2xl border border-primary/30 text-primary shadow-xl backdrop-blur-md" 
                                   : "text-9xl gradient-text drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                             )}>
                                 {winner}
                             </div>
                        </div>
                    ))
                ) : (
                    // Idle State
                    <div className="font-mono text-8xl font-bold tracking-wider text-foreground-tertiary/20 select-none">
                        READY
                    </div>
                )}
            </div>
            </div>
          </div>
          
          {/* Progress Indicators Below Stage */}
          <div className="absolute top-full mt-8 left-0 right-0 max-h-[120px] overflow-y-auto custom-scrollbar px-4">
             {/* Tournament Round Progress */}
             {mode === "tournament" && roundInfo && (
                <div className="w-full">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-foreground-secondary mb-3">
                       <span>本轮晋级名单 ({roundInfo.winnersSoFar.length}/{roundInfo.targetCount})</span>
                    </div>
                    
                    {roundInfo.winnersSoFar.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
                            {roundInfo.winnersSoFar.map((winner, idx) => (
                                <Tooltip key={idx}>
                                    <TooltipTrigger asChild>
                                        <div className={cn(
                                            "animate-in fade-in zoom-in duration-300 flex items-center gap-2 rounded-full border border-primary/20 bg-background-elevated px-2 text-primary shadow-sm cursor-default",
                                            getItemSizeClass(roundInfo.targetCount)
                                        )}>
                                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold">
                                                {idx + 1}
                                            </div>
                                            <span className="truncate">{winner}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{winner}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                            {/* Placeholders for remaining slots */}
                            {Array.from({ length: Math.max(0, roundInfo.targetCount - roundInfo.winnersSoFar.length) }).map((_, idx) => (
                                <div key={`placeholder-${idx}`} className={cn(
                                    "rounded-full border border-dashed border-foreground-tertiary/50 bg-transparent",
                                    getItemSizeClass(roundInfo.targetCount)
                                )} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-2 opacity-50 max-w-3xl mx-auto">
                            {Array.from({ length: roundInfo.targetCount }).map((_, idx) => (
                                <div key={`empty-${idx}`} className={cn(
                                    "rounded-full border border-dashed border-foreground-tertiary bg-transparent",
                                    getItemSizeClass(roundInfo.targetCount)
                                )} />
                            ))}
                        </div>
                    )}
                 </div>
              )}

             {/* Classic Batch Progress */}
             {mode === "classic" && classicTotal && classicTotal > 0 && (
                <div className="w-full">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-foreground-secondary mb-3">
                       <span>已中奖名单 ({classicWinnersSoFar?.length || 0}/{classicTotal})</span>
                    </div>
                    
                    {(classicWinnersSoFar && classicWinnersSoFar.length > 0) ? (
                        <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
                            {classicWinnersSoFar.map((winner, idx) => (
                                <Tooltip key={idx}>
                                    <TooltipTrigger asChild>
                                        <div className={cn(
                                            "animate-in fade-in zoom-in duration-300 flex items-center gap-2 rounded-full border border-primary/20 bg-background-elevated px-2 text-primary shadow-sm cursor-default",
                                            getItemSizeClass(classicTotal)
                                        )}>
                                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold">
                                                {idx + 1}
                                            </div>
                                            <span className="truncate">{winner}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{winner}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                            {/* Placeholders for remaining slots */}
                            {Array.from({ length: Math.max(0, classicTotal - classicWinnersSoFar.length) }).map((_, idx) => (
                                <div key={`placeholder-${idx}`} className={cn(
                                    "rounded-full border border-dashed border-foreground-tertiary/50 bg-transparent",
                                    getItemSizeClass(classicTotal)
                                )} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-2 opacity-50 max-w-3xl mx-auto">
                            {Array.from({ length: classicTotal }).map((_, idx) => (
                                <div key={`empty-${idx}`} className={cn(
                                    "rounded-full border border-dashed border-foreground-tertiary bg-transparent",
                                    getItemSizeClass(classicTotal)
                                )} />
                            ))}
                        </div>
                    )}
                </div>
             )}
          </div>
        </div>

        {/* Status Info */}
        <div className="mt-48 text-base text-foreground-secondary font-medium">
          {winners.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {mode === "tournament" && roundInfo
                    ? roundInfo.isFinished
                        ? roundInfo.current === roundInfo.total 
                            ? <span className="gradient-text font-bold text-lg">最终大奖揭晓！恭喜 {winners.length} 位获得最终胜利 🎉</span> 
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
          {!isDrawing && winners.length === 0 && <div className="text-sm opacity-50">点击底部按钮开始抽奖</div>}
        </div>
      </div>
    </div>
  )
}
