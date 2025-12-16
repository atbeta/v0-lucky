"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { Target, Trophy, Plus, Trash2, Info, Volume2, VolumeX } from "lucide-react"

interface DrawConfigViewProps {
  mode: "classic" | "tournament"
  onModeChange: (mode: "classic" | "tournament") => void
  autoExclude: boolean
  onAutoExcludeChange: (value: boolean) => void
  soundEnabled: boolean
  onSoundToggle: () => void
  participantCount: number
}

export function DrawConfigView({
  mode,
  onModeChange,
  autoExclude,
  onAutoExcludeChange,
  soundEnabled,
  onSoundToggle,
  participantCount,
}: DrawConfigViewProps) {
  const [classicCount, setClassicCount] = useState(5)
  const [classicMethod, setClassicMethod] = useState<"all" | "one-by-one" | "batch">("one-by-one")
  const [batchSize, setBatchSize] = useState(2)
  const [prizeName, setPrizeName] = useState("")

  const [tournamentRounds, setTournamentRounds] = useState([
    { id: 1, count: 5, name: "" },
    { id: 2, count: 3, name: "" },
    { id: 3, count: 1, name: "" },
  ])

  const addTournamentRound = () => {
    const newId = Math.max(...tournamentRounds.map((r) => r.id), 0) + 1
    setTournamentRounds([...tournamentRounds, { id: newId, count: 1, name: "" }])
  }

  const removeTournamentRound = (id: number) => {
    if (tournamentRounds.length > 1) {
      setTournamentRounds(tournamentRounds.filter((r) => r.id !== id))
    }
  }

  const updateRoundCount = (id: number, count: number) => {
    setTournamentRounds(tournamentRounds.map((r) => (r.id === id ? { ...r, count } : r)))
  }

  const getTournamentSummary = () => {
    const counts = tournamentRounds.map((r) => `${r.count}人`)
    return `共 ${tournamentRounds.length} 轮，${participantCount}人 → ${counts.join(" → ")}（最终）`
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">抽奖配置</h2>
            <p className="text-xs text-muted-foreground">参与者 ({participantCount})</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onSoundToggle} className="h-8 w-8">
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Mode Selection */}
          <div className="grid gap-3 md:grid-cols-2">
            <button
              onClick={() => onModeChange("classic")}
              className={cn(
                "group relative flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-all hover:border-primary/50",
                mode === "classic" ? "border-primary bg-primary/5" : "border-border/50 bg-card/50",
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors",
                  mode === "classic" ? "bg-primary/20" : "bg-muted",
                )}
              >
                <Target className={cn("h-6 w-6", mode === "classic" ? "text-primary" : "text-muted-foreground")} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">经典模式</h3>
                <p className="mt-1 text-xs text-muted-foreground">一轮抽出指定数量</p>
              </div>
            </button>

            <button
              onClick={() => onModeChange("tournament")}
              className={cn(
                "group relative flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-all hover:border-primary/50",
                mode === "tournament" ? "border-primary bg-primary/5" : "border-border/50 bg-card/50",
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors",
                  mode === "tournament" ? "bg-primary/20" : "bg-muted",
                )}
              >
                <Trophy className={cn("h-6 w-6", mode === "tournament" ? "text-primary" : "text-muted-foreground")} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">晋级模式</h3>
                <p className="mt-1 text-xs text-muted-foreground">多轮晋级至最终获胜</p>
              </div>
            </button>
          </div>

          {/* Auto Exclude Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card/30 p-4">
            <div className="flex items-center gap-3">
              <Info className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="auto-exclude" className="cursor-pointer text-sm font-medium">
                中奖后自动排除
              </Label>
            </div>
            <Switch id="auto-exclude" checked={autoExclude} onCheckedChange={onAutoExcludeChange} />
          </div>

          {/* Mode-specific Configuration */}
          {mode === "classic" && (
            <div className="space-y-6 rounded-xl border border-border/50 bg-card/30 p-6">
              {/* Winner Count */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">中奖人数</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="1"
                    max={participantCount}
                    value={classicCount}
                    onChange={(e) => setClassicCount(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="w-24 text-center"
                  />
                  <span className="text-sm text-muted-foreground">人 / 共 {participantCount} 人</span>
                </div>
              </div>

              {/* Drawing Method */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">仪式感设置</Label>
                </div>
                <RadioGroup value={classicMethod} onValueChange={(v) => setClassicMethod(v as any)}>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 rounded-lg border border-border/50 p-3 hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value="all" id="method-all" className="mt-0.5" />
                      <div className="flex-1">
                        <Label htmlFor="method-all" className="cursor-pointer font-medium">
                          一次性全部抽出
                        </Label>
                        <p className="text-xs text-muted-foreground">快速揭晓结果</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border-2 border-primary/30 bg-primary/5 p-3">
                      <RadioGroupItem value="one-by-one" id="method-one" className="mt-0.5" />
                      <div className="flex-1">
                        <Label htmlFor="method-one" className="cursor-pointer font-medium flex items-center gap-2">
                          逐个抽取
                          <span className="text-xs font-normal text-primary">推荐</span>
                        </Label>
                        <p className="text-xs text-muted-foreground">仪式感满满，需点击 {classicCount} 次</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border border-border/50 p-3 hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value="batch" id="method-batch" className="mt-0.5" />
                      <div className="flex-1 space-y-2">
                        <div>
                          <Label htmlFor="method-batch" className="cursor-pointer font-medium">
                            分批抽取
                          </Label>
                          <p className="text-xs text-muted-foreground">平衡速度与仪式感</p>
                        </div>
                        {classicMethod === "batch" && (
                          <div className="flex items-center gap-2 pl-1">
                            <Input
                              type="number"
                              min="1"
                              max={classicCount}
                              value={batchSize}
                              onChange={(e) => setBatchSize(Math.max(1, Number.parseInt(e.target.value) || 1))}
                              className="w-20 text-center h-8"
                            />
                            <span className="text-xs text-muted-foreground">人/次</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Prize Name */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">奖品设置</Label>
                </div>
                <Input
                  placeholder="输入奖品名称"
                  value={prizeName}
                  onChange={(e) => setPrizeName(e.target.value)}
                  className="bg-background"
                />
              </div>

              {/* Summary */}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <p className="text-sm text-foreground">
                  <span className="font-medium">
                    从 {participantCount}人 中抽出 {classicCount}位
                  </span>
                  {classicMethod === "one-by-one" && <span className="text-muted-foreground"> · 幸运儿</span>}
                  {classicMethod === "batch" && (
                    <span className="text-muted-foreground"> · 逐个抽取（{classicCount}次）</span>
                  )}
                  {classicMethod === "all" && (
                    <span className="text-muted-foreground">
                      {" "}
                      · 分批抽取（共{Math.ceil(classicCount / batchSize)}批）
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {mode === "tournament" && (
            <div className="space-y-6 rounded-xl border border-border/50 bg-card/30 p-6">
              {/* Tournament Rounds */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">晋级轮次</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addTournamentRound}
                    className="h-7 gap-1.5 bg-transparent"
                  >
                    <Plus className="h-3 w-3" />
                    添加轮次
                  </Button>
                </div>

                <div className="space-y-2">
                  {tournamentRounds.map((round, index) => (
                    <div key={round.id} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-medium text-primary">
                        {index === tournamentRounds.length - 1 ? <Trophy className="h-4 w-4" /> : `${index + 1}`}
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max={participantCount}
                          value={round.count}
                          onChange={(e) =>
                            updateRoundCount(round.id, Math.max(1, Number.parseInt(e.target.value) || 1))
                          }
                          className="w-20 text-center h-9"
                        />
                        <span className="text-sm text-muted-foreground">人</span>
                      </div>
                      {index < tournamentRounds.length - 1 && <div className="text-muted-foreground">→</div>}
                      {tournamentRounds.length > 1 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeTournamentRound(round.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Prize Name */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">奖品设置</Label>
                </div>
                <Input
                  placeholder="输入奖品名称"
                  value={prizeName}
                  onChange={(e) => setPrizeName(e.target.value)}
                  className="bg-background"
                />
              </div>

              {/* Summary */}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <p className="text-sm text-foreground">{getTournamentSummary()}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Action */}
      <div className="flex items-center justify-end gap-3 border-t border-border/50 bg-card/30 px-6 py-4">
        <Button size="lg" className="gap-2">
          <Target className="h-4 w-4" />
          开始抽奖
        </Button>
      </div>
    </div>
  )
}
