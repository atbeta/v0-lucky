"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Trash2, Upload, Download, Search, RefreshCw, UserPlus } from "lucide-react"
import { Participant } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { isTauri } from "@tauri-apps/api/core"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ParticipantsViewProps {
  participants: Participant[]
  onParticipantsChange: (participants: Participant[]) => void
}

export function ParticipantsView({ participants, onParticipantsChange }: ParticipantsViewProps) {
  const [newName, setNewName] = useState("")
  const [newWeight, setNewWeight] = useState("1")
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    toast({
      title: "操作成功",
      description: "已恢复所有参与者的抽奖资格",
    })
  }

  const handleClearAll = () => {
    onParticipantsChange([])
    toast({
      title: "操作成功",
      description: "已清空所有参与人员",
    })
  }

  const handleExport = async () => {
    try {
      if (isTauri()) {
        // Use Tauri API for saving file
        try {
          // Dynamically import Tauri modules
          const { save } = await import('@tauri-apps/plugin-dialog');
          const { writeTextFile } = await import('@tauri-apps/plugin-fs');
          
          const filePath = await save({
            filters: [{
              name: 'JSON',
              extensions: ['json']
            }],
            defaultPath: `lucky-draw-participants-${new Date().toISOString().split('T')[0]}.json`
          });

          if (filePath) {
            await writeTextFile(filePath, JSON.stringify(participants, null, 2));
            toast({
              title: "导出成功",
              description: `已成功导出 ${participants.length} 名参与者数据到 ${filePath}`,
            });
          }
        } catch (tauriError) {
          console.error("Tauri export failed, falling back to browser download", tauriError);
          // Fallback to browser download if Tauri save fails (or user cancels)
          triggerBrowserDownload();
        }
      } else {
        // Web environment
        triggerBrowserDownload();
      }
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "导出失败",
        description: "导出数据时发生错误",
        variant: "destructive",
      });
    }
  }

  const triggerBrowserDownload = () => {
    const dataStr = JSON.stringify(participants, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `lucky-draw-participants-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast({
      title: "导出成功",
      description: `已成功导出 ${participants.length} 名参与者数据`,
    })
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        let rawParticipants: { name: string; weight: number; excluded?: boolean }[] = []

        // 1. 解析文件内容
        if (file.name.endsWith(".json")) {
           const parsed = JSON.parse(content)
           if (Array.isArray(parsed)) {
             rawParticipants = parsed.map((p: any) => ({
               name: String(p.name || "").trim(),
               weight: typeof p.weight === 'number' ? p.weight : 1,
               excluded: !!p.excluded
             }))
           }
        } else if (file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
           const lines = content.split(/\r?\n/).filter(line => line.trim())
           rawParticipants = lines.map((line) => {
             const cleanLine = line.replace(/['"]/g, '')
             const parts = cleanLine.split(/[,，\t\s]+/)
             const name = parts[0].trim()
             
             // 跳过表头
             if (["name", "姓名", "participant", "人员"].includes(name.toLowerCase())) return null
             
             let weight = 1
             if (parts.length > 1) {
                const parsedWeight = parseInt(parts[1].trim())
                if (!isNaN(parsedWeight) && parsedWeight > 0) {
                    weight = parsedWeight
                }
             }
             
             return { name, weight, excluded: false }
           }).filter(Boolean) as { name: string; weight: number; excluded?: boolean }[]
        }

        // 2. 数据清洗与验证
        const validParticipants: Participant[] = []
        
        // 辅助函数：标准化名字（去除所有空格，转小写），用于比较
        const normalize = (str: string) => String(str || "").replace(/\s+/g, "").toLowerCase()

        // 使用标准化后的名字建立 Set
        const existingNamesSet = new Set(participants.map(p => normalize(p.name)))
        const fileInternalNamesSet = new Set<string>()
        
        const duplicatesInFile: string[] = []
        const duplicatesWithExisting: string[] = []
        const emptyNamesCount = rawParticipants.filter(p => !p.name).length

        rawParticipants.forEach((p, index) => {
          if (!p.name) return // 跳过空名字

          const normalizedName = normalize(p.name)

          // 1. 检测文件内部重复
          if (fileInternalNamesSet.has(normalizedName)) {
            duplicatesInFile.push(p.name)
          } else {
            fileInternalNamesSet.add(normalizedName)
          }

          // 2. 检测与现有数据重复
          if (existingNamesSet.has(normalizedName)) {
             duplicatesWithExisting.push(p.name)
          }

          // 无论是否重复，都添加（保留原始名字）
          validParticipants.push({
            id: Date.now() + index + Math.floor(Math.random() * 10000), // 增加随机数防止ID冲突
            name: p.name,
            weight: p.weight > 0 ? p.weight : 1,
            excluded: p.excluded || false
          })
        })

        // 3. 执行导入与反馈（追加模式）
        if (validParticipants.length > 0) {
          // 追加到现有列表
          onParticipantsChange([...participants, ...validParticipants])
          
          let description = `成功追加导入 ${validParticipants.length} 名参与者。`
          const messages = []
          let hasDuplicates = false
          
          if (duplicatesWithExisting.length > 0) {
             messages.push(`与现有列表重复: ${duplicatesWithExisting.length} 人`)
             hasDuplicates = true
          }
          if (duplicatesInFile.length > 0) {
             messages.push(`文件内重复: ${duplicatesInFile.length} 人`)
             hasDuplicates = true
          }
          if (emptyNamesCount > 0) {
             messages.push(`过滤空数据: ${emptyNamesCount} 条`)
          }

          if (messages.length > 0) {
             description += `\n(${messages.join("，")})`
          }

          toast({
             title: hasDuplicates ? "导入完成（包含重复人员）" : "导入成功",
             description: description,
             variant: hasDuplicates ? "destructive" : "default", // 使用 destructive 样式以引起注意
             className: "whitespace-pre-wrap"
          })
        } else {
           toast({
             title: "导入无效",
             description: "文件中未发现有效的参与者数据" + (duplicates.length > 0 ? `（发现 ${duplicates.length} 个重复项）` : ""),
             variant: "destructive"
           })
        }
      } catch (err) {
        console.error(err)
        toast({
           title: "导入出错",
           description: "文件格式错误或无法解析",
           variant: "destructive"
        })
      }
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
    reader.readAsText(file)
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
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".json,.csv,.txt"
          />
          <Button variant="outline" className="gap-2" onClick={handleImportClick}>
            <Download className="h-4 w-4" />
            导入
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Upload className="h-4 w-4" />
            导出
          </Button>
          <Button variant="outline" onClick={handleRestoreAll} className="gap-2 text-primary hover:text-primary hover:bg-primary/10 border-primary/20">
            <RefreshCw className="h-4 w-4" />
            全部恢复
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20">
                <Trash2 className="h-4 w-4" />
                全部删除
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确认清空所有参与人员？</AlertDialogTitle>
                <AlertDialogDescription>
                  此操作将删除当前列表中所有 {participants.length} 名参与人员，此操作无法撤销。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                  确认删除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
