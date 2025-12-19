"use client"

import { Button } from "@/components/ui/button"
import { Play, Square, RotateCcw, Copy, ChevronRight, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Participant } from "@/types"

interface ControlBarProps {
  isDrawing: boolean
  onStartDraw: () => void
  onStopDraw: () => void
  onReset: () => void
  winners: Participant[]
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
  const { toast } = useToast()

  const handleCopy = () => {
    if (winners.length > 0) {
      navigator.clipboard.writeText(winners.map(w => w.name).join(", "))
      toast({
        title: "复制成功",
        description: `已复制 ${winners.length} 位中奖者名单`,
      })
    }
  }

  return (
    <div className="flex h-24 items-center justify-center gap-6 border-t border-border-subtle bg-background/60 backdrop-blur-xl px-8 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] z-20 pb-4 pt-2 transition-all duration-500 ease-in-out">
      {!isDrawing && winners.length === 0 && (
        <Button 
          size="xl" 
          variant="gradient" 
          onClick={onStartDraw} 
          className="h-14 gap-3 px-12 text-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300 rounded-full"
        >
          <Play className="h-7 w-7 fill-current" />
          开始抽奖
        </Button>
      )}

      {isDrawing && (
        <Button 
          size="xl" 
          variant="destructive" 
          onClick={onStopDraw} 
          className="h-14 gap-3 px-12 text-xl font-bold shadow-lg shadow-destructive/30 hover:shadow-destructive/50 hover:scale-105 transition-all duration-300 rounded-full animate-pulse"
        >
          <Square className="h-7 w-7 fill-current" />
          停止
        </Button>
      )}

      {!isDrawing && winners.length > 0 && (
        <div className="flex items-center gap-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
          {showNextRound ? (
            <Button 
              size="lg" 
              variant="gradient" 
              onClick={onNextRound} 
              className="h-12 gap-2.5 px-10 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 rounded-full"
            >
              <ChevronRight className="h-6 w-6" />
              进入下一轮
            </Button>
          ) : isFinalRound && isRoundFinished ? (
             <div className="flex items-center gap-3 px-8 py-3 rounded-full bg-primary/10 text-primary font-bold border border-primary/20 shadow-inner">
                <CheckCircle2 className="h-6 w-6" />
                <span className="text-lg">晋级赛结束</span>
             </div>
          ) : isClassicFinished ? (
             <div className="flex items-center gap-3 px-8 py-3 rounded-full bg-primary/10 text-primary font-bold border border-primary/20 shadow-inner">
                <CheckCircle2 className="h-6 w-6" />
                <span className="text-lg">抽奖完成</span>
             </div>
          ) : (
            <Button 
              size="lg" 
              variant="gradient" 
              onClick={onStartDraw} 
              className="h-12 gap-2.5 px-10 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 rounded-full"
            >
              <Play className="h-6 w-6 fill-current" />
              继续抽奖
            </Button>
          )}
          
          <div className="h-10 w-px bg-border-subtle/50 mx-2" />
          
          <Button 
            size="lg" 
            variant="outline" 
            onClick={handleCopy} 
            className="h-11 gap-2 px-6 bg-background/40 hover:bg-background/80 backdrop-blur-sm border-border-subtle hover:border-primary/50 rounded-full transition-all duration-300"
          >
            <Copy className="h-4 w-4" />
            复制
          </Button>
          <Button 
            size="lg" 
            variant="ghost" 
            onClick={onReset} 
            className="h-11 gap-2 px-6 text-foreground-secondary hover:text-destructive hover:bg-destructive/10 rounded-full transition-all duration-300"
          >
            <RotateCcw className="h-4 w-4" />
            重置
          </Button>
        </div>
      )}

      <div className="absolute right-8 bottom-6 text-xs text-foreground-tertiary flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
        <span>快捷键</span>
        <kbd className="rounded-md border border-border-subtle bg-background/50 px-2 py-1 font-mono text-[10px] shadow-sm backdrop-blur-sm">Space</kbd>
      </div>
    </div>
  )
}
