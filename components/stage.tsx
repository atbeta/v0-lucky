"use client"
import { ParticipantsView } from "@/components/views/participants-view"
import { HistoryView } from "@/components/views/history-view"
import { SettingsView } from "@/components/views/settings-view"
import { DrawView } from "@/components/views/draw-view"
import { DrawConfigView } from "@/components/views/draw-config-view"

interface Participant {
  id: number
  name: string
  weight: number
  excluded: boolean
}

interface StageProps {
  currentView: "draw" | "participants" | "prizes" | "history" | "settings"
  mode: "classic" | "tournament"
  isDrawing: boolean
  winners: string[]
  participants: Participant[]
  onParticipantsChange: (participants: Participant[]) => void
  autoExclude: boolean
  onAutoExcludeChange: (value: boolean) => void
  soundEnabled: boolean
  onSoundToggle: () => void
  onModeChange: (mode: "classic" | "tournament") => void
}

export function Stage({
  currentView,
  mode,
  isDrawing,
  winners,
  participants,
  onParticipantsChange,
  autoExclude,
  onAutoExcludeChange,
  soundEnabled,
  onSoundToggle,
  onModeChange,
}: StageProps) {
  return (
    <div className="flex-1 overflow-auto bg-[var(--stage)]">
      <div className="h-full">
        {currentView === "draw" && (
          <DrawView mode={mode} isDrawing={isDrawing} winners={winners} participants={participants} />
        )}
        {currentView === "participants" && (
          <ParticipantsView participants={participants} onParticipantsChange={onParticipantsChange} />
        )}
        {currentView === "prizes" && (
          <DrawConfigView
            mode={mode}
            onModeChange={onModeChange}
            autoExclude={autoExclude}
            onAutoExcludeChange={onAutoExcludeChange}
            soundEnabled={soundEnabled}
            onSoundToggle={onSoundToggle}
            participantCount={participants.filter((p) => !p.excluded).length}
          />
        )}
        {currentView === "history" && <HistoryView />}
        {currentView === "settings" && <SettingsView />}
      </div>
    </div>
  )
}
