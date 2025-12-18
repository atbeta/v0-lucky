"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Clock, Trophy, Users, Calendar, Download, Eye, ChevronRight, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { isTauri } from "@tauri-apps/api/core"
import { useToast } from "@/hooks/use-toast"
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

interface HistoryRecord {
  id: number
  date: string
  mode: "classic" | "tournament"
  prizeName: string
  winners: string[]
  totalParticipants: number
  rounds?: { name: string; winners: string[] }[]
  participantsSnapshot?: { id: number; name: string; weight: number; excluded: boolean }[]
}

interface HistoryViewProps {
  records?: HistoryRecord[]
  onClearHistory?: () => void
}

export function HistoryView({ records = [], onClearHistory = () => {} }: HistoryViewProps) {
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null)
  const { toast } = useToast()

  const handleExportAll = async () => {
    if (records.length === 0) {
      toast({
        title: "无数据可导出",
        description: "当前没有历史记录",
        variant: "destructive",
      })
      return
    }

    try {
      if (isTauri()) {
        try {
          const { save } = await import('@tauri-apps/plugin-dialog');
          const { writeTextFile } = await import('@tauri-apps/plugin-fs');
          
          const filePath = await save({
            filters: [{
              name: 'JSON',
              extensions: ['json']
            }],
            defaultPath: `lucky-draw-history-${new Date().toISOString().split('T')[0]}.json`
          });

          if (filePath) {
            await writeTextFile(filePath, JSON.stringify(records, null, 2));
            toast({
              title: "导出成功",
              description: `已成功导出 ${records.length} 条历史记录到 ${filePath}`,
            });
          }
        } catch (tauriError) {
          console.error("Tauri export failed, falling back to browser download", tauriError);
          triggerBrowserDownload();
        }
      } else {
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
    const dataStr = JSON.stringify(records, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `lucky-draw-history-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast({
      title: "导出成功",
      description: `已成功导出 ${records.length} 条历史记录`,
    })
  }

  const handleClear = () => {
    onClearHistory()
    toast({
      title: "清理成功",
      description: "已清空所有历史记录",
    })
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border-subtle px-8 py-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">历史记录</h1>
            <p className="text-sm text-foreground-secondary mt-0.5">查看所有抽奖结果与详情</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2" onClick={handleExportAll}>
             <Download className="h-4 w-4" />
             导出
           </Button>
           
           <AlertDialog>
             <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20">
                  <Trash2 className="h-4 w-4" />
                  清理
                </Button>
             </AlertDialogTrigger>
             <AlertDialogContent>
               <AlertDialogHeader>
                 <AlertDialogTitle>确认清空历史记录？</AlertDialogTitle>
                 <AlertDialogDescription>
                   此操作将删除所有 {records.length} 条历史记录，此操作无法撤销。
                 </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                 <AlertDialogCancel>取消</AlertDialogCancel>
                 <AlertDialogAction onClick={handleClear} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                   确认清理
                 </AlertDialogAction>
               </AlertDialogFooter>
             </AlertDialogContent>
           </AlertDialog>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-5xl space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="group cursor-pointer rounded-2xl border border-border-subtle bg-background-elevated p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge 
                      className={cn(
                        "text-xs px-2.5 py-0.5 border-0 rounded-lg",
                        record.mode === "classic" 
                          ? "bg-primary/10 text-primary group-hover:bg-primary/20" 
                          : "bg-accent-purple/10 text-accent-purple group-hover:bg-accent-purple/20"
                      )}
                    >
                      {record.mode === "classic" ? "经典模式" : "晋级模式"}
                    </Badge>
                    {record.prizeName && (
                      <div className="flex items-center gap-2 text-base font-semibold text-foreground">
                        <Trophy className="h-4 w-4 text-accent-cyan" />
                        {record.prizeName}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {record.winners.slice(0, 5).map((winner, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-lg border border-border-subtle bg-background/50 px-3 py-1.5 transition-colors group-hover:bg-background group-hover:border-primary/20"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {winner.charAt(0)}
                        </div>
                        <span className="text-sm font-medium">{winner}</span>
                      </div>
                    ))}
                    {record.winners.length > 5 && (
                      <span className="flex h-9 items-center rounded-lg bg-background/50 px-3 text-xs font-medium text-foreground-secondary">
                        +{record.winners.length - 5} 人
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-xs text-foreground-tertiary">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      {record.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5" />
                      共 {record.totalParticipants} 人参与
                    </div>
                  </div>
                </div>

                <div className="flex items-center self-center pl-4">
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-foreground-tertiary group-hover:text-primary group-hover:bg-primary/10">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {records.length === 0 && (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background-elevated mb-6 shadow-inner">
                <Clock className="h-10 w-10 text-foreground-tertiary/50" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">暂无历史记录</h3>
              <p className="text-foreground-secondary max-w-xs mx-auto">
                完成第一次抽奖后，结果将显示在这里
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="max-w-3xl bg-background-elevated/95 backdrop-blur-xl border-border-subtle rounded-3xl p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-8 pb-0">
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <Badge 
                className={cn(
                  "text-sm px-3 py-1 rounded-lg border-0",
                  selectedRecord?.mode === "classic" 
                    ? "bg-primary/10 text-primary" 
                    : "bg-accent-purple/10 text-accent-purple"
                )}
              >
                {selectedRecord?.mode === "classic" ? "经典模式" : "晋级模式"}
              </Badge>
              <span className="gradient-text font-bold">{selectedRecord?.prizeName || "抽奖详情"}</span>
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary pt-3 flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-foreground-tertiary"/> {selectedRecord?.date}</span>
              <span className="flex items-center gap-2"><Users className="h-4 w-4 text-foreground-tertiary"/> 共 {selectedRecord?.totalParticipants} 人参与</span>
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6">
             {selectedRecord?.mode === "classic" ? (
               <div className="space-y-3">
                 <h4 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider flex items-center gap-2">
                    <Trophy className="h-3.5 w-3.5" />
                    中奖名单 ({selectedRecord.winners.length}人)
                 </h4>
                 
                 {/* Final Winners Area - Optimized */}
                 <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent-purple/5 p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedRecord.winners.map((winner, idx) => (
                         <div key={idx} className="flex items-center justify-between rounded-lg bg-background/60 backdrop-blur-sm border border-primary/10 p-2.5 shadow-sm group hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-3 min-w-0">
                               <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-accent-purple/10 text-primary group-hover:scale-110 transition-transform">
                                  <Trophy className="h-4 w-4" />
                               </div>
                               <div className="flex flex-col min-w-0">
                                  <span className="text-[10px] text-foreground-tertiary">获胜者</span>
                                  <span className="text-sm font-bold gradient-text truncate">{winner}</span>
                               </div>
                            </div>
                            <div className="text-lg font-bold text-primary/10">#{idx + 1}</div>
                         </div>
                      ))}
                    </div>
                 </div>
               </div>
             ) : (
               <div className="space-y-3">
                 {/* Tournament Breakdown */}
                 {selectedRecord?.rounds?.map((round, rIdx) => (
                   <div key={rIdx} className="space-y-1.5">
                     <div className="flex items-center gap-2">
                       <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-purple/10 text-[10px] font-bold text-accent-purple">
                         {rIdx + 1}
                       </div>
                       <h4 className="text-xs font-semibold">{round.name}</h4>
                       <Badge variant="secondary" className="rounded-full bg-background-overlay text-[10px] px-1.5 h-4">
                         {round.winners.length}人晋级
                       </Badge>
                     </div>
                     <div className="flex flex-wrap gap-1.5 pl-7">
                       {round.winners.map((winner, wIdx) => (
                          <div key={wIdx} className="flex items-center gap-1.5 rounded border border-border-subtle bg-background/30 px-1.5 py-0.5 text-[10px] hover:bg-background transition-colors">
                            {winner}
                          </div>
                       ))}
                     </div>
                   </div>
                 ))}
                 
                 {/* Final Winners - Optimized */}
                 <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent-purple/5 p-3 mt-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                       {selectedRecord?.winners.map((winner, idx) => (
                          <div key={idx} className="flex items-center justify-between rounded-lg bg-background/60 backdrop-blur-sm border border-primary/10 p-2 shadow-sm group hover:border-primary/30 transition-all">
                             <div className="flex items-center gap-2 min-w-0">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-accent-purple/10 text-primary group-hover:scale-110 transition-transform">
                                   <Trophy className="h-3.5 w-3.5" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                   <span className="text-[10px] text-foreground-tertiary">获胜者</span>
                                   <span className="text-xs font-bold gradient-text truncate">{winner}</span>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
               </div>
             )}

             {/* Participants Snapshot */}
             {selectedRecord?.participantsSnapshot && selectedRecord.participantsSnapshot.length > 0 && (
               <div className="space-y-2 pt-3 border-t border-border-subtle">
                 <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" />
                    参与人员 (共 {selectedRecord.participantsSnapshot.length} 人)
                    </h4>
                    {selectedRecord.participantsSnapshot.length > 20 && (
                        <span className="text-[10px] text-foreground-tertiary">滚动查看更多</span>
                    )}
                 </div>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                   {selectedRecord.participantsSnapshot.map((p) => {
                     const isWinner = selectedRecord.winners.includes(p.name);
                     return (
                       <div 
                         key={p.id} 
                         className={cn(
                           "flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 transition-colors hover:bg-background/60",
                           isWinner 
                             ? "bg-primary/5 border-primary/30" 
                             : "bg-background/30 border-border-subtle"
                         )}
                       >
                         <div className="flex items-center gap-2 min-w-0">
                           <div className={cn(
                             "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold shadow-inner",
                             isWinner ? "bg-gradient-to-br from-primary to-accent-cyan text-white" : "bg-background-elevated text-foreground-secondary"
                           )}>
                             {p.name.charAt(0)}
                           </div>
                           <span className={cn("text-xs font-medium truncate", isWinner ? "text-primary" : "text-foreground")}>{p.name}</span>
                         </div>
                         <div className="flex items-center gap-1.5 shrink-0">
                           {isWinner && <Trophy className="h-2.5 w-2.5 text-accent-yellow" />}
                           <span className="text-[10px] text-foreground-tertiary">{p.weight}</span>
                         </div>
                       </div>
                     )
                   })}
                 </div>
               </div>
             )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
