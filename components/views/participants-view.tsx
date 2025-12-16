"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Users, Upload, Download, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Participant {
  id: number
  name: string
  weight: number
  excluded: boolean
}

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

  const filteredParticipants = participants.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const activeCount = participants.filter((p) => !p.excluded).length
  const excludedCount = participants.filter((p) => p.excluded).length

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">参与人员管理</h2>
            <p className="text-xs text-muted-foreground">
              共 {participants.length} 人 · {activeCount} 可参与 · {excludedCount} 已排除
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Upload className="h-4 w-4" />
            导入
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            导出
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-border/50 bg-card/30 px-6 py-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索参与人员..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-background"
            />
          </div>
          <Input
            placeholder="姓名"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="w-40 h-9 bg-background"
          />
          <Input
            type="number"
            placeholder="权重"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="w-20 h-9 bg-background"
            min="1"
          />
          <Button onClick={handleAdd} size="sm" className="gap-2 h-9">
            <Plus className="h-4 w-4" />
            添加
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl">
          {/* Participants Grid */}
          <div className="grid gap-3 md:grid-cols-2">
            {filteredParticipants.map((participant) => (
              <div
                key={participant.id}
                className="group flex items-center justify-between rounded-lg border border-border/50 bg-card/30 p-4 transition-all hover:border-primary/50 hover:bg-card/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-sm font-medium text-primary">
                    {participant.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-medium truncate">{participant.name}</div>
                      {participant.excluded && (
                        <Badge variant="secondary" className="text-xs">
                          已排除
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">权重: {participant.weight}x</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleExclude(participant.id)}
                    className="h-7 px-2 text-xs"
                  >
                    {participant.excluded ? "恢复" : "排除"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(participant.id)}
                    className="h-7 w-7 text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredParticipants.length === 0 && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Users className="mx-auto mb-3 h-12 w-12 opacity-20" />
                <p className="text-sm">{searchQuery ? "未找到匹配的参与人员" : "暂无参与人员，请添加"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
