"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Volume2, Eye, RefreshCw, Download, Upload, Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"

export function SettingsView() {
  const [hideNamesWhileRolling, setHideNamesWhileRolling] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState("normal")
  const [particleEffects, setParticleEffects] = useState(true)
  const { theme, setTheme } = useTheme()

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
          {/* Theme Settings */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">外观设置</h3>
            </div>
            <div className="space-y-3 rounded-xl border border-border/50 bg-card/30 p-6">
              <div className="space-y-3 rounded-lg border border-border/50 bg-background/50 p-4">
                <Label className="text-sm font-medium">
                  主题模式
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={theme === "light" ? "default" : "outline"} 
                    className="justify-center gap-2"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-4 w-4" />
                    浅色
                  </Button>
                  <Button 
                    variant={theme === "dark" ? "default" : "outline"} 
                    className="justify-center gap-2"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-4 w-4" />
                    深色
                  </Button>
                  <Button 
                    variant={theme === "system" ? "default" : "outline"} 
                    className="justify-center gap-2"
                    onClick={() => setTheme("system")}
                  >
                    <Laptop className="h-4 w-4" />
                    跟随系统
                  </Button>
                </div>
              </div>
            </div>
          </section>

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
        </div>
      </div>
    </div>
  )
}
