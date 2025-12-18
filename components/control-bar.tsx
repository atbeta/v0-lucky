"use client"

import { Button } from "@/components/ui/button"
import { Play, Square, RotateCcw, Copy, ChevronRight } from "lucide-react"

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
    <div className="flex h-16 items-center justify-center gap-3 border-t border-border bg-card px-6">
      {!isDrawing && winners.length === 0 && (
        <Button size="lg" onClick={onStartDraw} className="gap-2 px-8">
          <Play className="h-5 w-5" />
          开始抽奖
        </Button>
      )}

      {isDrawing && (
        <Button size="lg" variant="destructive" onClick={onStopDraw} className="gap-2 px-8">
          <Square className="h-5 w-5" />
          停止
        </Button>
      )}

      {!isDrawing && winners.length > 0 && (
        <>
          {showNextRound ? (
            <Button size="lg" onClick={onNextRound} className="gap-2 px-6">
              <ChevronRight className="h-4 w-4" />
              进入下一轮
            </Button>
          ) : isFinalRound && isRoundFinished ? (
            // Final round finished
             null
          ) : isClassicFinished ? (
            // Classic mode finished
            null
          ) : (
            <Button size="lg" onClick={onStartDraw} className="gap-2 px-6">
              <Play className="h-4 w-4" />
              继续抽奖
            </Button>
          )}
          
          <Button size="lg" variant="outline" onClick={handleCopy} className="gap-2 px-6 bg-transparent">
            <Copy className="h-4 w-4" />
            复制结果
          </Button>
          <Button size="lg" variant="outline" onClick={onReset} className="gap-2 px-6 bg-transparent">
            <RotateCcw className="h-4 w-4" />
            重置
          </Button>
        </>
      )}

      <div className="ml-4 text-xs text-muted-foreground">
        提示: 按 <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">空格</kbd> 快速开始/停止
      </div>
    </div>
  )
}
