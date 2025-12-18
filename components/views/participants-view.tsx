"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Trash2, Upload, Download, Search, RefreshCw, UserPlus } from "lucide-react"
import { Participant } from "@/types"

interface ParticipantsViewProps {
  participants: Participant[]
  onParticipantsChange: (participants: Participant[]) => void
}

export function ParticipantsView({ participants, onParticipantsChange }: ParticipantsViewProps) {
  const [newName, setNewName] = useState("")
  const [newWeight, setNewWeight] = useState("1")
  const [searchQuery, setSearchQuery] = useState("")

  const handleAdd = () => {
    if (!newName.trim()) return
    const newParticipant = {
      id: Date.now(),
      name: newName.trim(),
      weight: Number.parseInt(newWeight) || 1,
      excluded: false,
    }
    onParticipantsChange([...participants, newParticipant])
    setNewName("")
    setNewWeight("1")
  }

  const handleDelete = (id: number) => {
    onParticipantsChange(participants.filter((p) => p.id !== id))
  }

  const handleToggleExclude = (id: number) => {
    onParticipantsChange(participants.map((p) => (p.id === id ? { ...p, excluded: !p.excluded } : p)))
  }
  
  const handleRestoreAll = () => {
    onParticipantsChange(participants.map((p) => ({ ...p, excluded: false })))
  }

  const filteredParticipants = participants.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const activeCount = participants.filter((p) => !p.excluded).length
  const excludedCount = participants.filter((p) => p.excluded).length

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border-subtle px-8 py-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">参与人员管理</h1>
            <p className="text-sm text-foreground-secondary mt-0.5">
              共 {participants.length} 人 · <span className="text-success">{activeCount} 可参与</span> · <span className="text-foreground-tertiary">{excludedCount} 已排除</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            导入
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            导出
          </Button>
          <Button variant="outline" onClick={handleRestoreAll} className="gap-2 text-primary hover:text-primary hover:bg-primary/10 border-primary/20">
            <RefreshCw className="h-4 w-4" />
            全部恢复
          </Button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="border-b border-border-subtle bg-background-elevated/50 px-8 py-4 backdrop-blur-sm">
        <div className="flex gap-4 max-w-5xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-tertiary" />
            <Input
              placeholder="搜索参与人员..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border-subtle focus:border-primary"
            />
          </div>
          <div className="w-px bg-border-subtle mx-2" />
          <div className="flex gap-2 flex-1">
             <Input
                placeholder="姓名"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className="flex-[2] bg-background border-border-subtle"
              />
              <Input
                type="number"
                placeholder="权重"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="flex-1 bg-background border-border-subtle"
                min="1"
              />
              <Button onClick={handleAdd} className="gap-2 shadow-md shadow-primary/20">
                <Plus className="h-4 w-4" />
                添加
              </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-5xl">
          {/* Participants Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredParticipants.map((participant) => (
              <div
                key={participant.id}
                className={`group flex items-center justify-between rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                  participant.excluded 
                    ? "bg-background/30 border-border-subtle opacity-70" 
                    : "bg-background-elevated border-border-subtle hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-sm ${
                    participant.excluded
                      ? "bg-foreground-tertiary/10 text-foreground-tertiary"
                      : "bg-primary/10 text-primary"
                  }`}>
                    {participant.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`font-medium truncate ${participant.excluded ? "text-foreground-secondary line-through" : "text-foreground"}`}>
                        {participant.name}
                      </div>
                      {participant.excluded && (
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-background-overlay text-foreground-tertiary">
                          已排除
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-foreground-tertiary flex items-center gap-1">
                       <span className="bg-background px-1.5 py-0.5 rounded text-[10px] border border-border-subtle">
                         权重 {participant.weight}
                       </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleExclude(participant.id)}
                    className="h-8 px-2 text-xs hover:bg-background-overlay"
                  >
                    {participant.excluded ? "恢复" : "排除"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(participant.id)}
                    className="h-8 w-8 text-foreground-tertiary hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredParticipants.length === 0 && (
            <div className="flex h-[50vh] flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background-elevated mb-6 shadow-inner">
                {searchQuery ? (
                  <Search className="h-10 w-10 text-foreground-tertiary/50" />
                ) : (
                  <UserPlus className="h-10 w-10 text-foreground-tertiary/50" />
                )}
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchQuery ? "未找到匹配的参与人员" : "暂无参与人员"}
              </h3>
              <p className="text-foreground-secondary max-w-xs mx-auto mb-6">
                {searchQuery ? "请尝试更换搜索关键词" : "您可以从上方工具栏添加新的人员，或导入现有列表"}
              </p>
              {!searchQuery && (
                 <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    批量导入
                 </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
