"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Clock, Trophy, Users, Calendar, Download, Eye, ChevronRight } from "lucide-react"
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
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          导出全部
        </Button>
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
        <DialogContent className="max-w-2xl bg-background-elevated/95 backdrop-blur-xl border-border-subtle rounded-3xl p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-3 text-xl">
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
              <span className="gradient-text">{selectedRecord?.prizeName || "抽奖详情"}</span>
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary pt-2 flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5"/> {selectedRecord?.date}</span>
              <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5"/> 共 {selectedRecord?.totalParticipants} 人参与</span>
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
             {selectedRecord?.mode === "classic" ? (
               <div className="space-y-4">
                 <h4 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider">中奖名单 ({selectedRecord.winners.length}人)</h4>
                 <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                   {selectedRecord.winners.map((winner, idx) => (
                      <div key={idx} className="flex items-center gap-3 rounded-xl border border-border-subtle p-3 bg-background/50 hover:bg-background hover:border-primary/30 transition-colors">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                          {idx + 1}
                        </div>
                        <span className="font-medium">{winner}</span>
                      </div>
                   ))}
                 </div>
               </div>
             ) : (
               <div className="space-y-8">
                 {/* Tournament Breakdown */}
                 {selectedRecord?.rounds?.map((round, rIdx) => (
                   <div key={rIdx} className="space-y-4">
                     <div className="flex items-center gap-3">
                       <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-purple/10 text-xs font-bold text-accent-purple">
                         {rIdx + 1}
                       </div>
                       <h4 className="text-base font-semibold">{round.name}</h4>
                       <Badge variant="secondary" className="rounded-full bg-background-overlay text-xs">
                         {round.winners.length}人晋级
                       </Badge>
                     </div>
                     <div className="flex flex-wrap gap-2 pl-10">
                       {round.winners.map((winner, wIdx) => (
                          <div key={wIdx} className="flex items-center gap-2 rounded-lg border border-border-subtle bg-background/30 px-3 py-1.5 text-sm hover:bg-background transition-colors">
                            {winner}
                          </div>
                       ))}
                     </div>
                   </div>
                 ))}
                 
                 <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Trophy className="h-24 w-24" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 text-primary font-bold text-lg mb-4">
                         <Trophy className="h-5 w-5" />
                         最终获胜者
                      </div>
                      <div className="flex flex-wrap gap-4">
                         {selectedRecord?.winners.map((winner, idx) => (
                            <div key={idx} className="flex items-center gap-3 rounded-xl bg-background/80 backdrop-blur-sm px-5 py-3 shadow-sm border border-primary/10">
                               <span className="text-xl font-bold gradient-text">{winner}</span>
                            </div>
                         ))}
                      </div>
                    </div>
                 </div>
               </div>
             )}
          </div>
          
          <div className="p-4 border-t border-border-subtle bg-background/50 flex justify-end">
            <Button onClick={() => setSelectedRecord(null)}>关闭</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
