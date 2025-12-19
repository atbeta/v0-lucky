"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Target, Trophy, Plus, Trash2, Info, Volume2, VolumeX, RotateCcw } from "lucide-react"

interface TournamentRound {
  id: number
  count: number
  name: string
}

interface DrawConfigViewProps {
  mode: "classic" | "tournament"
  onModeChange: (mode: "classic" | "tournament") => void
  autoExclude: boolean
  onAutoExcludeChange: (value: boolean) => void
  soundEnabled: boolean
  onSoundToggle: () => void
  participantCount: number
  onGoToDraw: () => void
  
  // Classic Config
  classicCount: number
  onClassicCountChange: (count: number) => void
  classicMethod: "all" | "one-by-one" | "batch"
  onClassicMethodChange: (method: "all" | "one-by-one" | "batch") => void
  batchSize: number
  onBatchSizeChange: (size: number) => void
  
  // Tournament Config
  tournamentRounds: TournamentRound[]
  onTournamentRoundsChange: (rounds: TournamentRound[]) => void
  
  // Common
  prizeName: string
  onPrizeNameChange: (name: string) => void
  isDrawing?: boolean
  onResetConfig?: () => void
}

export function DrawConfigView({
  mode,
  onModeChange,
  autoExclude,
  onAutoExcludeChange,
  soundEnabled,
  onSoundToggle,
  participantCount,
  onGoToDraw,
  classicCount,
  onClassicCountChange,
  classicMethod,
  onClassicMethodChange,
  batchSize,
  onBatchSizeChange,
  tournamentRounds,
  onTournamentRoundsChange,
  prizeName,
  onPrizeNameChange,
  isDrawing = false,
  onResetConfig = () => {},
}: DrawConfigViewProps) {
  const addTournamentRound = () => {
    const newId = Math.max(...tournamentRounds.map((r) => r.id), 0) + 1
    onTournamentRoundsChange([...tournamentRounds, { id: newId, count: 1, name: "" }])
  }

  const removeTournamentRound = (id: number) => {
    if (tournamentRounds.length > 1) {
      onTournamentRoundsChange(tournamentRounds.filter((r) => r.id !== id))
    }
  }

  const updateRoundCount = (id: number, count: number) => {
    // Find the index of the round being updated
    const index = tournamentRounds.findIndex(r => r.id === id);
    if (index === -1) return;

    let newCount = count;

    // Constraint 1: Round 1 cannot exceed total participants
    if (index === 0) {
        newCount = Math.min(newCount, participantCount);
    } 
    // Constraint 2: Round N cannot exceed Round N-1
    else {
        const prevRoundCount = tournamentRounds[index - 1].count;
        newCount = Math.min(newCount, prevRoundCount);
    }

    // Apply the change, and also propagate constraints to subsequent rounds
    const newRounds = tournamentRounds.map((r, idx) => {
        if (idx === index) {
            return { ...r, count: newCount };
        }
        return r;
    });

    // Propagate: Ensure subsequent rounds do not exceed their previous round
    for (let i = index + 1; i < newRounds.length; i++) {
        if (newRounds[i].count > newRounds[i - 1].count) {
            newRounds[i] = { ...newRounds[i], count: newRounds[i - 1].count };
        }
    }

    onTournamentRoundsChange(newRounds);
  }

  // Handle Classic Count Change - auto adjust batch size if needed
  const handleClassicCountChange = (newCount: number) => {
    // Constraint: Cannot exceed total participants
    const validatedCount = Math.min(newCount, participantCount);
    
    onClassicCountChange(validatedCount)
    // If batch size is larger than total count, reduce it
    if (batchSize > validatedCount) {
        onBatchSizeChange(validatedCount)
    }
  }
  
  // Handle Method Change - auto set default batch size
  const handleMethodChange = (method: "all" | "one-by-one" | "batch") => {
      onClassicMethodChange(method)
      if (method === "batch") {
          // Default batch size to half of total (rounded up), but at least 1
          const defaultBatch = Math.ceil(classicCount / 2) || 1
          onBatchSizeChange(defaultBatch)
      }
  }

  const getTournamentSummary = () => {
    const counts = tournamentRounds.map((r) => `${r.count}人`)
    return `共 ${tournamentRounds.length} 轮，${participantCount}人 → ${counts.join(" → ")}（最终）`
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border-subtle px-8 py-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">抽奖配置</h1>
            <p className="text-sm text-foreground-secondary mt-0.5">参与者 ({participantCount}) · 配置抽奖规则</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Mode Selection */}
          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => !isDrawing && onModeChange("classic")}
              disabled={isDrawing}
              className={cn(
                "group relative flex items-start gap-4 rounded-2xl border-2 p-6 text-left transition-all duration-200 cursor-pointer",
                mode === "classic" 
                  ? "border-primary bg-primary/5 shadow-md" 
                  : "border-border-subtle bg-background-elevated hover:border-primary/50",
                isDrawing && "opacity-50 cursor-not-allowed hover:border-border-subtle hover:-translate-y-0 hover:shadow-none"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
                  mode === "classic" ? "bg-primary/20" : "bg-background-overlay",
                )}
              >
                <Target className={cn("h-6 w-6", mode === "classic" ? "text-primary" : "text-foreground-secondary")} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={cn("font-bold text-lg", mode === "classic" ? "text-primary" : "text-foreground")}>经典模式</h3>
                <p className="mt-1 text-sm text-foreground-secondary">一轮抽出指定数量，支持一次性或分批</p>
              </div>
            </button>

            <button
              onClick={() => !isDrawing && onModeChange("tournament")}
              disabled={isDrawing}
              className={cn(
                "group relative flex items-start gap-4 rounded-2xl border-2 p-6 text-left transition-all duration-200 cursor-pointer",
                mode === "tournament" 
                  ? "border-primary bg-primary/5 shadow-md" 
                  : "border-border-subtle bg-background-elevated hover:border-primary/50",
                isDrawing && "opacity-50 cursor-not-allowed hover:border-border-subtle hover:-translate-y-0 hover:shadow-none"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
                  mode === "tournament" ? "bg-primary/20" : "bg-background-overlay",
                )}
              >
                <Trophy className={cn("h-6 w-6", mode === "tournament" ? "text-primary" : "text-foreground-secondary")} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={cn("font-bold text-lg", mode === "tournament" ? "text-primary" : "text-foreground")}>晋级模式</h3>
                <p className="mt-1 text-sm text-foreground-secondary">多轮筛选晋级，最终决出大奖得主</p>
              </div>
            </button>
          </div>

          {/* Auto Exclude Toggle */}
          <div 
            className="flex items-center justify-between rounded-2xl border border-border-subtle bg-background-elevated p-6 shadow-sm cursor-pointer hover:border-primary/30 transition-all duration-200"
            onClick={() => onAutoExcludeChange(!autoExclude)}
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-background-overlay flex items-center justify-center">
                <Info className="h-5 w-5 text-foreground-secondary" />
              </div>
              <div className="space-y-0.5">
                <Label htmlFor="auto-exclude" className="cursor-pointer text-base font-medium pointer-events-none">
                  中奖后自动排除
                </Label>
                <p className="text-xs text-foreground-secondary">中奖者将不会参与后续抽奖</p>
              </div>
            </div>
            <Switch id="auto-exclude" checked={autoExclude} onCheckedChange={onAutoExcludeChange} />
          </div>

          {/* Mode-specific Configuration */}
          {mode === "classic" && (
            <div className="space-y-6 rounded-2xl border border-border-subtle bg-background-elevated p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              {/* Winner Count */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">中奖人数</Label>
                <div className="flex items-center gap-4 bg-background/50 p-4 rounded-xl border border-border-subtle">
                  <Input
                    type="number"
                    min="1"
                    max={participantCount}
                    value={classicCount}
                    onChange={(e) => handleClassicCountChange(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="w-32 text-center h-12 text-xl font-bold bg-background"
                  />
                  <div className="flex flex-col">
                     <span className="text-sm font-medium">人</span>
                     <span className="text-xs text-foreground-secondary">共 {participantCount} 人参与</span>
                  </div>
                </div>
              </div>

              {/* Drawing Method */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold">抽取方式</Label>
                </div>
                <RadioGroup value={classicMethod} onValueChange={(v) => handleMethodChange(v as any)}>
                  <div className="grid gap-3">
                    <div 
                        className={cn(
                            "flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer",
                            classicMethod === "one-by-one" ? "border-primary bg-primary/5" : "border-border-subtle bg-background-elevated hover:bg-background"
                        )}
                        onClick={() => handleMethodChange("one-by-one")}
                    >
                      <RadioGroupItem value="one-by-one" id="method-one" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="method-one" className="cursor-pointer font-bold flex items-center gap-2 text-base pointer-events-none">
                          逐个抽取
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground">推荐</span>
                        </Label>
                        <p className="text-sm text-foreground-secondary mt-1 pointer-events-none">每次点击抽取 1 人，仪式感最强，需点击 {classicCount} 次</p>
                      </div>
                    </div>

                    <div 
                        className={cn(
                            "flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer",
                            classicMethod === "all" ? "border-primary bg-primary/5" : "border-border-subtle bg-background-elevated hover:bg-background"
                        )}
                        onClick={() => handleMethodChange("all")}
                    >
                      <RadioGroupItem value="all" id="method-all" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="method-all" className="cursor-pointer font-bold text-base pointer-events-none">
                          一次性全部抽出
                        </Label>
                        <p className="text-sm text-foreground-secondary mt-1 pointer-events-none">直接展示所有 {classicCount} 位中奖者，效率最高</p>
                      </div>
                    </div>

                    <div 
                        className={cn(
                            "flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer",
                            classicMethod === "batch" ? "border-primary bg-primary/5" : "border-border-subtle bg-background-elevated hover:bg-background"
                        )}
                        onClick={() => handleMethodChange("batch")}
                    >
                      <RadioGroupItem value="batch" id="method-batch" className="mt-1" />
                      <div className="flex-1 space-y-3">
                        <div>
                          <Label htmlFor="method-batch" className="cursor-pointer font-bold text-base pointer-events-none">
                            分批抽取
                          </Label>
                          <p className="text-sm text-foreground-secondary mt-1 pointer-events-none">按组进行抽取，平衡速度与仪式感</p>
                        </div>
                        {classicMethod === "batch" && (
                          <div className="flex items-center gap-3 pl-1 animate-in slide-in-from-top-2" onClick={(e) => e.stopPropagation()}>
                            <span className="text-sm">每批抽取</span>
                            <Input
                              type="number"
                              min="1"
                              max={classicCount}
                              value={batchSize}
                              onChange={(e) => {
                                  const val = Math.max(1, Number.parseInt(e.target.value) || 1)
                                  onBatchSizeChange(Math.min(val, classicCount)) // Limit to classicCount
                              }}
                              className="w-24 text-center h-9 bg-background"
                            />
                            <span className="text-sm text-foreground-secondary">人</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Prize Name */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">奖品名称</Label>
                <div className="relative">
                   <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-tertiary" />
                   <Input
                    placeholder="例如：一等奖 - iPhone 16 Pro"
                    value={prizeName}
                    onChange={(e) => onPrizeNameChange(e.target.value)}
                    className="pl-10 bg-background h-11"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent p-4 flex items-center gap-3">
                <Info className="h-5 w-5 text-primary" />
                <p className="text-sm text-foreground font-medium">
                  将从 {participantCount} 人中抽出 <span className="text-primary font-bold text-base">{classicCount}</span> 位幸运儿
                  {classicMethod === "batch" && `，分 ${Math.ceil(classicCount / batchSize)} 批进行`}
                </p>
              </div>
            </div>
          )}

          {mode === "tournament" && (
            <div className="space-y-6 rounded-2xl border border-border-subtle bg-background-elevated p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              {/* Tournament Rounds */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">晋级轮次设置</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addTournamentRound}
                    className="h-8 gap-1.5 bg-transparent hover:bg-background"
                  >
                    <Plus className="h-3 w-3" />
                    添加轮次
                  </Button>
                </div>

                <div className="space-y-3">
                  {tournamentRounds.map((round, index) => (
                    <div key={round.id} className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border-subtle hover:border-primary/30 transition-colors">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {index === tournamentRounds.length - 1 ? <Trophy className="h-4 w-4" /> : `R${index + 1}`}
                      </div>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-foreground-secondary whitespace-nowrap">晋级人数</span>
                            <Input
                              type="number"
                              min="1"
                              max={participantCount}
                              value={round.count}
                              onChange={(e) =>
                                updateRoundCount(round.id, Math.max(1, Number.parseInt(e.target.value) || 1))
                              }
                              className="w-20 text-center h-9 bg-background"
                            />
                        </div>
                        <Input 
                            placeholder={`第 ${index + 1} 轮名称 (可选)`}
                            value={round.name}
                            onChange={(e) => {
                                const newRounds = [...tournamentRounds];
                                newRounds[index].name = e.target.value;
                                onTournamentRoundsChange(newRounds);
                            }}
                            className="flex-1 h-9 bg-background text-sm"
                        />
                      </div>
                      {index < tournamentRounds.length - 1 && <div className="text-foreground-tertiary">→</div>}
                      {tournamentRounds.length > 1 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeTournamentRound(round.id)}
                          className="h-8 w-8 text-foreground-tertiary hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Prize Name */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">奖品名称</Label>
                <div className="relative">
                   <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-tertiary" />
                   <Input
                    placeholder="例如：年度总冠军大奖"
                    value={prizeName}
                    onChange={(e) => onPrizeNameChange(e.target.value)}
                    className="pl-10 bg-background h-11"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent p-4 flex items-center gap-3">
                <Trophy className="h-5 w-5 text-primary" />
                <p className="text-sm text-foreground font-medium">{getTournamentSummary()}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Action */}
      <div className="flex items-center justify-end gap-3 border-t border-border-subtle bg-background-elevated/80 px-8 py-6 backdrop-blur-sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-2 px-6 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20" 
              onClick={onResetConfig}
            >
              <RotateCcw className="h-4 w-4" />
              重置配置
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>重置所有配置</p>
          </TooltipContent>
        </Tooltip>
        <Button size="lg" className="gap-2 px-8 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all" onClick={onGoToDraw}>
          <Target className="h-5 w-5" />
          开始抽奖
        </Button>
      </div>
    </div>
  )
}
