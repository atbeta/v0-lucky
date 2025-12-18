"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SettingsIcon, Volume2, Sparkles, EyeOff, Moon, Sun, Monitor, Palette } from "lucide-react"
import { useTheme } from "next-themes"

interface SettingsViewProps {
  hideNamesWhileRolling: boolean
  onHideNamesWhileRollingChange: (checked: boolean) => void
  particleEffects: boolean
  onParticleEffectsChange: (checked: boolean) => void
  soundEnabled: boolean
  onSoundEnabledChange: (checked: boolean) => void
}

export function SettingsView({
  hideNamesWhileRolling,
  onHideNamesWhileRollingChange,
  particleEffects,
  onParticleEffectsChange,
  soundEnabled,
  onSoundEnabledChange,
}: SettingsViewProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border-subtle px-8 py-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
            <SettingsIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">设置</h1>
            <p className="text-sm text-foreground-secondary mt-0.5">自定义抽奖体验和偏好设置</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-3xl space-y-8">
          
          {/* Appearance Settings */}
          <div className="bg-background-elevated rounded-2xl p-6 border border-border-subtle shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">外观设置</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-1">主题模式</h3>
                  <p className="text-sm text-foreground-secondary">
                    选择浅色或深色主题
                  </p>
                </div>
                <div className="flex gap-2 p-1.5 bg-background-overlay/50 rounded-xl border border-border-subtle">
                  <button 
                    onClick={() => setTheme("light")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${theme === 'light' ? 'bg-background-elevated shadow-sm text-primary font-medium' : 'text-foreground-secondary hover:text-foreground'}`}
                  >
                    <Sun className="h-4 w-4" />
                    浅色
                  </button>
                  <button 
                    onClick={() => setTheme("dark")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${theme === 'dark' ? 'bg-background-elevated shadow-sm text-primary font-medium' : 'text-foreground-secondary hover:text-foreground'}`}
                  >
                    <Moon className="h-4 w-4" />
                    深色
                  </button>
                  <button 
                    onClick={() => setTheme("system")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${theme === 'system' ? 'bg-background-elevated shadow-sm text-primary font-medium' : 'text-foreground-secondary hover:text-foreground'}`}
                  >
                    <Monitor className="h-4 w-4" />
                    跟随系统
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lottery Experience Settings */}
          <div className="bg-background-elevated rounded-2xl p-6 border border-border-subtle shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-accent-purple/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-purple" />
              </div>
              <h2 className="text-xl font-semibold">抽奖体验</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border-subtle bg-background/50 p-4 hover:bg-background transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-background-overlay flex items-center justify-center">
                    <EyeOff className="h-5 w-5 text-foreground-secondary" />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="hide-names" className="text-base font-medium cursor-pointer">
                      滚动时隐藏候选人名字
                    </Label>
                    <p className="text-xs text-foreground-secondary">增加神秘感和悬念效果</p>
                  </div>
                </div>
                <Switch id="hide-names" checked={hideNamesWhileRolling} onCheckedChange={onHideNamesWhileRollingChange} />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border-subtle bg-background/50 p-4 hover:bg-background transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-background-overlay flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-foreground-secondary" />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="particle-effects" className="text-base font-medium cursor-pointer">
                      粒子特效
                    </Label>
                    <p className="text-xs text-foreground-secondary">中奖时显示炫酷的视觉特效</p>
                  </div>
                </div>
                <Switch id="particle-effects" checked={particleEffects} onCheckedChange={onParticleEffectsChange} />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border-subtle bg-background/50 p-4 hover:bg-background transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-background-overlay flex items-center justify-center">
                    <Volume2 className="h-5 w-5 text-foreground-secondary" />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="sound-effects" className="text-base font-medium cursor-pointer">
                      音效
                    </Label>
                    <p className="text-xs text-foreground-secondary">播放抽奖和中奖音效</p>
                  </div>
                </div>
                <Switch id="sound-effects" checked={soundEnabled} onCheckedChange={onSoundEnabledChange} />
              </div>
            </div>
          </div>

          <div className="flex justify-center text-xs text-foreground-tertiary pt-8">
             Lucky Draw App v2.0.0
          </div>

        </div>
      </div>
    </div>
  )
}
