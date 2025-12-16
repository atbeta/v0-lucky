"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Trophy, Users, Calendar, Download } from "lucide-react"

const mockHistory = [
  {
    id: 1,
    date: "2025-12-17 10:30",
    mode: "classic" as const,
    prizeName: "一等奖",
    winners: ["张三", "李四"],
    totalParticipants: 13,
  },
  {
    id: 2,
    date: "2025-12-17 10:15",
    mode: "tournament" as const,
    prizeName: "二等奖",
    winners: ["王五"],
    totalParticipants: 13,
  },
  {
    id: 3,
    date: "2025-12-17 09:45",
    mode: "classic" as const,
    prizeName: "三等奖",
    winners: ["赵六", "孙七", "周八"],
    totalParticipants: 13,
  },
]

export function HistoryView() {
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
          {mockHistory.map((record) => (
            <div
              key={record.id}
              className="group rounded-xl border border-border/50 bg-card/30 p-5 transition-all hover:border-primary/50 hover:bg-card/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant={record.mode === "classic" ? "secondary" : "default"} className="text-xs">
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
                    {record.winners.map((winner, idx) => (
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

                <Button variant="ghost" size="sm" className="opacity-0 transition-opacity group-hover:opacity-100">
                  查看详情
                </Button>
              </div>
            </div>
          ))}

          {mockHistory.length === 0 && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Clock className="mx-auto mb-3 h-12 w-12 opacity-20" />
                <p className="text-sm">暂无历史记录</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
