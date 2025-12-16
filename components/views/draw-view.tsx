"use client"

import { useEffect, useState } from "react"
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
}

export function DrawView({ mode, isDrawing, winners, participants }: DrawViewProps) {
  const [rollingName, setRollingName] = useState("")

  useEffect(() => {
    if (isDrawing) {
      const interval = setInterval(() => {
        const availableParticipants = participants.filter((p) => !p.excluded)
        if (availableParticipants.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableParticipants.length)
          setRollingName(availableParticipants[randomIndex].name)
        }
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isDrawing, participants])

  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="text-center">
        {/* Main Display */}
        <div className="relative">
          {/* Background glow effect */}
          <div className="absolute inset-0 -z-10 animate-glow rounded-2xl bg-primary/10 blur-3xl" />

          {/* Winner/Rolling Display */}
          <div
            className={cn(
              "rounded-2xl border-2 px-16 py-12 backdrop-blur-sm transition-all",
              isDrawing
                ? "animate-roll border-primary/50 bg-stage-highlight/50"
                : winners.length > 0
                  ? "border-primary bg-stage-highlight/80"
                  : "border-border/50 bg-card/50",
            )}
          >
            <div className="mb-4 flex items-center justify-center gap-2">
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

            <div
              className={cn(
                "font-mono text-6xl font-bold tracking-wider",
                isDrawing ? "text-foreground/70" : winners.length > 0 ? "text-primary" : "text-muted-foreground",
              )}
            >
              {isDrawing ? rollingName : winners.length > 0 ? winners[0] : "---"}
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="mt-8 text-sm text-muted-foreground">
          {winners.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">恭喜中奖！🎉</div>
          )}
          {!isDrawing && winners.length === 0 && <div className="text-xs">按下空格键或点击底部按钮开始抽奖</div>}
        </div>
      </div>
    </div>
  )
}
