"use client"

import { Button } from "@/components/ui/button"
import { Play, Square, RotateCcw, Copy, ChevronRight, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ControlBarProps {
  isDrawing: boolean
  onStartDraw: () => void
  onStopDraw: () => void
  onReset: () => void
  winners: string[]
  showNextRound?: boolean
  onNextRound?: () => void
  isFinalRound?: boolean
  isRoundFinished?: boolean
  isClassicFinished?: boolean
}

export function ControlBar({ 
  isDrawing, 
  onStartDraw, 
  onStopDraw, 
  onReset, 
  winners,
  showNextRound,
  onNextRound,
  isFinalRound,
  isRoundFinished,
  isClassicFinished
}: ControlBarProps) {
  const handleCopy = () => {
    if (winners.length > 0) {
      navigator.clipboard.writeText(winners.join(", "))
    }
  }

  return (
    <div className="flex h-20 items-center justify-center gap-4 border-t border-border-subtle bg-background-elevated/80 backdrop-blur-md px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-20">
      {!isDrawing && winners.length === 0 && (
        <Button size="xl" variant="gradient" onClick={onStartDraw} className="gap-2.5 px-10 text-lg font-bold shadow-primary/25 hover:shadow-primary/40">
          <Play className="h-6 w-6 fill-current" />
          开始抽奖
        </Button>
      )}

      {isDrawing && (
        <Button size="xl" variant="destructive" onClick={onStopDraw} className="gap-2.5 px-10 text-lg font-bold shadow-destructive/25 hover:shadow-destructive/40 animate-pulse">
          <Square className="h-6 w-6 fill-current" />
          停止
        </Button>
      )}

      {!isDrawing && winners.length > 0 && (
        <div className="flex items-center gap-3 animate-in slide-in-from-bottom-2 fade-in duration-300">
          {showNextRound ? (
            <Button size="lg" variant="gradient" onClick={onNextRound} className="gap-2 px-8 shadow-primary/20">
              <ChevronRight className="h-5 w-5" />
              进入下一轮
            </Button>
          ) : isFinalRound && isRoundFinished ? (
             <div className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary/10 text-primary font-bold border border-primary/20">
                <CheckCircle2 className="h-5 w-5" />
                晋级赛结束
             </div>
          ) : isClassicFinished ? (
             <div className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary/10 text-primary font-bold border border-primary/20">
                <CheckCircle2 className="h-5 w-5" />
                抽奖完成
             </div>
          ) : (
            <Button size="lg" variant="gradient" onClick={onStartDraw} className="gap-2 px-8 shadow-primary/20">
              <Play className="h-5 w-5 fill-current" />
              继续抽奖
            </Button>
          )}
          
          <div className="h-8 w-px bg-border-subtle mx-2" />
          
          <Button size="lg" variant="outline" onClick={handleCopy} className="gap-2 px-6 bg-background/50 hover:bg-background border-border-subtle hover:border-primary/50">
            <Copy className="h-4 w-4" />
            复制
          </Button>
          <Button size="lg" variant="ghost" onClick={onReset} className="gap-2 px-6 text-foreground-secondary hover:text-destructive hover:bg-destructive/10">
            <RotateCcw className="h-4 w-4" />
            重置
          </Button>
        </div>
      )}

      <div className="absolute right-8 text-xs text-foreground-tertiary flex items-center gap-2">
        <span>快捷键</span>
        <kbd className="rounded-md border border-border-subtle bg-background px-2 py-1 font-mono text-[10px] shadow-sm">Space</kbd>
      </div>
    </div>
  )
}
