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

interface TournamentRound {
  id: number
  count: number
  name: string
}

interface HistoryRecord {
  id: number
  date: string
  mode: "classic" | "tournament"
  prizeName: string
  winners: string[]
  totalParticipants: number
  rounds?: { name: string; winners: string[] }[]
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
  onGoToDraw: () => void
  roundInfo?: {
    current: number
    total: number
    name: string
    isFinished: boolean
    targetCount: number
    winnersSoFar: string[]
  }
  winnerCount: number
  
  // Config Props
  classicCount?: number
  onClassicCountChange?: (count: number) => void
  classicMethod?: "all" | "one-by-one" | "batch"
  onClassicMethodChange?: (method: "all" | "one-by-one" | "batch") => void
  batchSize?: number
  onBatchSizeChange?: (size: number) => void
  tournamentRounds?: TournamentRound[]
  onTournamentRoundsChange?: (rounds: TournamentRound[]) => void
  prizeName?: string
  onPrizeNameChange?: (name: string) => void
  
  // Classic Batch
  classicTotal?: number
  classicWinnersSoFar?: string[]
  
  // Settings Props
  hideNamesWhileRolling?: boolean
  onHideNamesWhileRollingChange?: (value: boolean) => void
  particleEffects?: boolean
  onParticleEffectsChange?: (value: boolean) => void
  // soundEnabled and onSoundToggle are already present
  
  // Confetti State Lifting
  lastCelebratedWinners?: string
  onCelebrationComplete?: (winnersKey: string) => void
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
  onGoToDraw,
  roundInfo,
  winnerCount,
  classicCount = 1,
  onClassicCountChange = () => {},
  classicMethod = "one-by-one",
  onClassicMethodChange = () => {},
  batchSize = 2,
  onBatchSizeChange = () => {},
  tournamentRounds = [],
  onTournamentRoundsChange = () => {},
  prizeName = "",
  onPrizeNameChange = () => {},
  classicTotal,
  classicWinnersSoFar,
  historyRecords = [],
  hideNamesWhileRolling = false,
  onHideNamesWhileRollingChange = () => {},
  particleEffects = true,
  onParticleEffectsChange = () => {},
  lastCelebratedWinners = "",
  onCelebrationComplete = () => {},
}: StageProps) {
  return (
    <div className="flex-1 overflow-hidden bg-stage relative">
      {currentView === "draw" && (
        <DrawView 
          mode={mode} 
          isDrawing={isDrawing} 
          winners={winners} 
          participants={participants} 
          roundInfo={roundInfo} 
          winnerCount={winnerCount}
          classicTotal={classicTotal}
          classicWinnersSoFar={classicWinnersSoFar}
          prizeName={prizeName}
          hideNamesWhileRolling={hideNamesWhileRolling}
          particleEffects={particleEffects}
          lastCelebratedWinners={lastCelebratedWinners}
          onCelebrationComplete={onCelebrationComplete}
        />
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
          participantCount={participants.length}
          onGoToDraw={onGoToDraw}
          classicCount={classicCount}
          onClassicCountChange={onClassicCountChange}
          classicMethod={classicMethod}
          onClassicMethodChange={onClassicMethodChange}
          batchSize={batchSize}
          onBatchSizeChange={onBatchSizeChange}
          tournamentRounds={tournamentRounds}
          onTournamentRoundsChange={onTournamentRoundsChange}
          prizeName={prizeName}
          onPrizeNameChange={onPrizeNameChange}
        />
      )}
      {currentView === "history" && <HistoryView records={historyRecords} />}
      {currentView === "settings" && (
        <SettingsView 
           hideNamesWhileRolling={hideNamesWhileRolling}
           onHideNamesWhileRollingChange={onHideNamesWhileRollingChange}
           particleEffects={particleEffects}
           onParticleEffectsChange={onParticleEffectsChange}
           soundEnabled={soundEnabled}
           onSoundEnabledChange={(val) => onSoundToggle()} 
        />
      )}
    </div>
  )
}
