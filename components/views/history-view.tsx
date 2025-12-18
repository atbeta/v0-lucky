"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Clock, Trophy, Users, Calendar, Download, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface HistoryRecord {
  id: number
  date: string
  mode: "classic" | "tournament"
  prizeName: string
  winners: string[]
  totalParticipants: number
  rounds?: { name: string; winners: string[] }[]
}

interface HistoryViewProps {
  records?: HistoryRecord[]
}

export function HistoryView({ records = [] }: HistoryViewProps) {
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">历史记录</h2>
            <p className="text-xs text-muted-foreground">查看所有抽奖结果</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          导出全部
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="group cursor-pointer rounded-xl border border-border/50 bg-card/30 p-5 transition-all hover:border-primary/50 hover:bg-card/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge 
                      className={cn(
                        "text-xs border-0",
                        record.mode === "classic" 
                          ? "bg-primary/10 text-primary hover:bg-primary/20" 
                          : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                      )}
                    >
                      {record.mode === "classic" ? "经典模式" : "晋级模式"}
                    </Badge>
                    {record.prizeName && (
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <Trophy className="h-4 w-4 text-accent" />
                        {record.prizeName}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {record.winners.slice(0, 5).map((winner, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                          {winner.charAt(0)}
                        </div>
                        <span className="text-sm font-medium">{winner}</span>
                      </div>
                    ))}
                    {record.winners.length > 5 && (
                      <span className="text-xs text-muted-foreground">+{record.winners.length - 5} 人</span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {record.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {record.totalParticipants} 人参与
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <Eye className="h-4 w-4" />
                  查看详情
                </Button>
              </div>
            </div>
          ))}

          {records.length === 0 && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Clock className="mx-auto mb-3 h-12 w-12 opacity-20" />
                <p className="text-sm">暂无历史记录</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Badge 
                className={cn(
                  "text-xs border-0",
                  selectedRecord?.mode === "classic" 
                    ? "bg-primary/10 text-primary" 
                    : "bg-amber-500/10 text-amber-600"
                )}
              >
                {selectedRecord?.mode === "classic" ? "经典模式" : "晋级模式"}
              </Badge>
              <span>{selectedRecord?.prizeName || "抽奖详情"}</span>
            </DialogTitle>
            <DialogDescription>
              {selectedRecord?.date} · 共 {selectedRecord?.totalParticipants} 人参与
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-6">
             {selectedRecord?.mode === "classic" ? (
               <div className="space-y-3">
                 <h4 className="text-sm font-medium text-muted-foreground">中奖名单 ({selectedRecord.winners.length}人)</h4>
                 <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                   {selectedRecord.winners.map((winner, idx) => (
                      <div key={idx} className="flex items-center gap-3 rounded-lg border border-border/50 p-3 bg-muted/30">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {idx + 1}
                        </div>
                        <span className="font-medium">{winner}</span>
                      </div>
                   ))}
                 </div>
               </div>
             ) : (
               <div className="space-y-6">
                 {/* Tournament Breakdown */}
                 {selectedRecord?.rounds?.map((round, rIdx) => (
                   <div key={rIdx} className="space-y-3">
                     <div className="flex items-center gap-2">
                       <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-600">
                         {rIdx + 1}
                       </div>
                       <h4 className="text-sm font-medium">{round.name}</h4>
                       <span className="text-xs text-muted-foreground">({round.winners.length}人晋级)</span>
                     </div>
                     <div className="flex flex-wrap gap-2 pl-8">
                       {round.winners.map((winner, wIdx) => (
                          <div key={wIdx} className="flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-sm">
                            {winner}
                          </div>
                       ))}
                     </div>
                   </div>
                 ))}
                 
                 <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mt-4">
                    <div className="flex items-center justify-center gap-2 text-primary font-bold text-lg mb-4">
                       <Trophy className="h-5 w-5" />
                       最终获胜者
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                       {selectedRecord?.winners.map((winner, idx) => (
                          <div key={idx} className="flex items-center gap-2 rounded-lg bg-background px-4 py-2 shadow-sm border border-primary/10">
                             <span className="text-lg font-bold">{winner}</span>
                          </div>
                       ))}
                    </div>
                 </div>
               </div>
             )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
