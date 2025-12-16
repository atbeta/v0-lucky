"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Volume2, Eye, RefreshCw, Download, Upload } from "lucide-react"

export function SettingsView() {
  const [hideNamesWhileRolling, setHideNamesWhileRolling] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState("normal")
  const [particleEffects, setParticleEffects] = useState(true)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/50 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">设置</h2>
          <p className="text-xs text-muted-foreground">自定义抽奖体验和偏好设置</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Display Settings */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">显示设置</h3>
            </div>
            <div className="space-y-3 rounded-xl border border-border/50 bg-card/30 p-6">
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="hide-names" className="text-sm font-medium">
                    滚动时隐藏候选人名字
                  </Label>
                  <p className="text-xs text-muted-foreground">增加神秘感和悬念效果</p>
                </div>
                <Switch id="hide-names" checked={hideNamesWhileRolling} onCheckedChange={setHideNamesWhileRolling} />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="particle-effects" className="text-sm font-medium">
                    粒子特效
                  </Label>
                  <p className="text-xs text-muted-foreground">显示炫酷的视觉特效</p>
                </div>
                <Switch id="particle-effects" checked={particleEffects} onCheckedChange={setParticleEffects} />
              </div>

              <div className="space-y-3 rounded-lg border border-border/50 bg-background/50 p-4">
                <Label htmlFor="animation-speed" className="text-sm font-medium">
                  动画速度
                </Label>
                <Select value={animationSpeed} onValueChange={setAnimationSpeed}>
                  <SelectTrigger id="animation-speed" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">慢速 (3秒)</SelectItem>
                    <SelectItem value="normal">正常 (2秒)</SelectItem>
                    <SelectItem value="fast">快速 (1秒)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Audio Settings */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">音效设置</h3>
            </div>
            <div className="space-y-3 rounded-xl border border-border/50 bg-card/30 p-6">
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="sound-enabled" className="text-sm font-medium">
                    启用音效
                  </Label>
                  <p className="text-xs text-muted-foreground">播放抽奖和中奖音效</p>
                </div>
                <Switch id="sound-enabled" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>

              <div className="space-y-3 rounded-lg border border-border/50 bg-background/50 p-4">
                <Label htmlFor="volume" className="text-sm font-medium">
                  音量
                </Label>
                <Input id="volume" type="range" min="0" max="100" defaultValue="50" disabled={!soundEnabled} />
              </div>
            </div>
          </section>

          {/* Data Management */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">数据管理</h3>
            </div>
            <div className="space-y-3 rounded-xl border border-border/50 bg-card/30 p-6">
              <div className="grid gap-3 md:grid-cols-2">
                <Button variant="outline" className="justify-start gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  导出配置
                </Button>
                <Button variant="outline" className="justify-start gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  导入配置
                </Button>
              </div>

              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div className="mb-3">
                  <Label className="text-sm font-medium text-destructive">危险操作</Label>
                  <p className="mt-1 text-xs text-muted-foreground">以下操作不可逆，请谨慎使用</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-destructive border-destructive/30 bg-transparent"
                  >
                    清空历史记录
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-destructive border-destructive/30 bg-transparent"
                  >
                    恢复默认设置
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
