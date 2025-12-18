"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Stage } from "@/components/stage"
import { Inspector } from "@/components/inspector"
import { ControlBar } from "@/components/control-bar"
import { TopBar } from "@/components/top-bar"
import { WindowTitlebar } from "@/components/window-titlebar"

interface HistoryRecord {
  id: number
  date: string
  mode: "classic" | "tournament"
  prizeName: string
  winners: string[]
  totalParticipants: number
  rounds?: { name: string; winners: string[] }[]
}

export default function HomePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [inspectorVisible, setInspectorVisible] = useState(true)
  const [focusMode, setFocusMode] = useState(false)
  const [currentView, setCurrentView] = useState<"draw" | "participants" | "prizes" | "history" | "settings">("draw")

  // Lottery state
  const [mode, setMode] = useState<"classic" | "tournament">("classic")
  const [isDrawing, setIsDrawing] = useState(false)
  const [winners, setWinners] = useState<string[]>([])
  const [autoExclude, setAutoExclude] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  // History State
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([])

  // Settings State
  const [hideNamesWhileRolling, setHideNamesWhileRolling] = useState(false)
  const [particleEffects, setParticleEffects] = useState(true)
  // Track which winners have already been celebrated with confetti to prevent duplicates on view switch
  const [lastCelebratedWinners, setLastCelebratedWinners] = useState<string>("")

  // Classic Mode Config
  const [classicCount, setClassicCount] = useState(1)
  const [classicMethod, setClassicMethod] = useState<"all" | "one-by-one" | "batch">("one-by-one")
  const [batchSize, setBatchSize] = useState(2)
  const [prizeName, setPrizeName] = useState("")

  // Tournament Mode Config
  const [tournamentRounds, setTournamentRounds] = useState([
    { id: 1, count: 5, name: "第一轮" },
    { id: 2, count: 3, name: "第二轮" },
    { id: 3, count: 1, name: "最终轮" },
  ])
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0)
  const [roundWinners, setRoundWinners] = useState<string[][]>([]) // Store winners of each round

  const [participants, setParticipants] = useState([
    { id: 1, name: "张三", weight: 1, excluded: false },
    { id: 2, name: "李四", weight: 1, excluded: false },
    { id: 3, name: "王五", weight: 2, excluded: false },
    { id: 4, name: "赵六", weight: 1, excluded: false },
    { id: 5, name: "孙七", weight: 1, excluded: false },
    { id: 6, name: "周八", weight: 1, excluded: false },
    { id: 7, name: "吴九", weight: 1, excluded: false },
  ])

  const [classicWinners, setClassicWinners] = useState<string[]>([]) // Track all winners in classic mode

  const handleToggleFocus = () => {
    setFocusMode(!focusMode)
    if (!focusMode) {
      setSidebarCollapsed(true)
      setInspectorVisible(false)
    } else {
      setSidebarCollapsed(false)
      setInspectorVisible(true)
    }
  }

  const handleStartDraw = () => {
    setWinners([])
    setIsDrawing(true)
    // Removed setTimeout - manual stop only
  }

  const handleStopDraw = () => {
    setIsDrawing(false)
    
    // Clear classic winners if it's a new "full" draw session?
    // Actually, when user clicks "Reset" or enters the page, classicWinners should be empty.
    // If user clicks "Start", we continue.
    // But wait, if we are in "batch" mode, do we want to accumulate? Yes.
    // If we are in "all" mode, we just do one draw.
    // If we are in "one-by-one", we accumulate.
    
    let availableParticipants: typeof participants = []

    if (mode === "classic") {
      // In classic mode, pick from currently not excluded participants
      // Also exclude already won in THIS session (if using batch)
      availableParticipants = participants.filter((p) => !p.excluded && !classicWinners.includes(p.name))
    } else {
      // In tournament mode
      if (currentRoundIndex === 0) {
        // First round: pick from all not excluded
        // Also exclude already won in THIS round
        const currentRoundWinnersSoFar = roundWinners[currentRoundIndex] || []
        availableParticipants = participants.filter((p) => !p.excluded && !currentRoundWinnersSoFar.includes(p.name))
      } else {
        // Subsequent rounds: pick from winners of previous round
        // Make sure roundWinners[currentRoundIndex - 1] exists
        const previousRoundWinners = roundWinners[currentRoundIndex - 1] || []
        // Also exclude already won in THIS round
        const currentRoundWinnersSoFar = roundWinners[currentRoundIndex] || []
        
        availableParticipants = participants.filter(p => 
            previousRoundWinners.includes(p.name) && 
            !currentRoundWinnersSoFar.includes(p.name) &&
            !p.excluded
        )
      }
    }

    if (availableParticipants.length === 0) {
      // Handle case where no participants are available
      return 
    }

    // Determine count based on mode
    // Classic: 
    // If method is 'one-by-one', count = 1
    // If method is 'batch', count = batchSize
    // If method is 'all', count = classicCount (but constrained by remaining needed)
    // Tournament: always pick 1 at a time
    
    let count = 1
    if (mode === "classic") {
         if (classicMethod === "one-by-one") {
             count = 1
         } else if (classicMethod === "batch") {
             count = batchSize
         } else {
             // "all" - try to pick all remaining
             count = classicCount - classicWinners.length
         }
         
         // Don't exceed total needed
         const remainingNeeded = classicCount - classicWinners.length
         if (count > remainingNeeded) {
             count = remainingNeeded
         }
    } else {
         // Tournament mode: always pick 1 at a time
         count = 1
    }

    const winnersList: string[] = []
    const tempParticipants = [...availableParticipants]
    
    // Check if we have enough participants
    if (tempParticipants.length < count) {
        // Not enough participants, just pick all of them?
        count = tempParticipants.length
    }

    // Draw 'count' winners
    for (let i = 0; i < count; i++) {
      if (tempParticipants.length === 0) break
      const randomIndex = Math.floor(Math.random() * tempParticipants.length)
      const winner = tempParticipants[randomIndex]
      winnersList.push(winner.name)
      // Remove from temp list to avoid double picking in same batch
      tempParticipants.splice(randomIndex, 1)
    }

    // Update winners state
    // For Classic: Replace winners (batch draw) BUT we need to track total winners
    // For Tournament: APPEND to current round winners?
    
    if (mode === "classic") {
         setWinners(winnersList) // Show just drawn
         
         const newClassicWinners = [...classicWinners, ...winnersList]
         setClassicWinners(newClassicWinners)

         // Auto exclude logic for Classic
         if (autoExclude) {
             setParticipants(participants.map((p) => (winnersList.includes(p.name) ? { ...p, excluded: true } : p)))
         }
         
         // Save History if finished
         if (newClassicWinners.length >= classicCount) {
             const newRecord: HistoryRecord = {
                 id: Date.now(),
                 date: new Date().toLocaleString(),
                 mode: "classic",
                 prizeName: prizeName || "未命名奖品",
                 winners: newClassicWinners,
                 totalParticipants: participants.length
             }
             setHistoryRecords([newRecord, ...historyRecords])
         }
    } else {
         // Tournament Mode
         // We need to accumulate winners for the current round
         // winners state currently shows who just won THIS draw action.
         // But we also need to track progress of the round.
         
         setWinners(winnersList) // Show the just-drawn winner(s)
         
         // Update round winners history
         const currentRoundWinnersSoFar = roundWinners[currentRoundIndex] || []
         const updatedRoundWinners = [...currentRoundWinnersSoFar, ...winnersList]
         
         const newRoundWinners = [...roundWinners]
         newRoundWinners[currentRoundIndex] = updatedRoundWinners
         setRoundWinners(newRoundWinners)
         
         // Check if Tournament Finished
         const currentRoundIsFinal = currentRoundIndex === tournamentRounds.length - 1
         const currentRoundFinished = updatedRoundWinners.length >= tournamentRounds[currentRoundIndex].count
         
         if (currentRoundIsFinal && currentRoundFinished) {
             const newRecord: HistoryRecord = {
                 id: Date.now(),
                 date: new Date().toLocaleString(),
                 mode: "tournament",
                 prizeName: prizeName || "未命名奖品",
                 winners: updatedRoundWinners, // Final winners
                 totalParticipants: participants.length,
                 rounds: tournamentRounds.map((r, idx) => ({
                     name: r.name,
                     winners: newRoundWinners[idx] || []
                 }))
             }
             setHistoryRecords([newRecord, ...historyRecords])
         }
    }
  }

  const handleNextRound = () => {
    if (currentRoundIndex < tournamentRounds.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1)
      setWinners([]) // Clear winners for next round view
    }
  }

  // Helper to determine current batch count for Classic Mode
  const getClassicBatchCount = () => {
    if (classicMethod === "one-by-one") return 1
    if (classicMethod === "batch") return batchSize
    // For "all", we want to show all remaining spots rolling? 
    // Or just all total spots? Usually all total spots.
    // But if we already drew some (which shouldn't happen in "all" mode unless interrupted), 
    // let's stick to total classicCount.
    return classicCount
  }

  const currentRoundFinished = mode === "tournament" && 
      (roundWinners[currentRoundIndex]?.length || 0) >= tournamentRounds[currentRoundIndex].count

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <WindowTitlebar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed || focusMode}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Bar */}
          <TopBar
            mode={mode}
            focusMode={focusMode}
            onToggleFocus={handleToggleFocus}
            onToggleInspector={() => setInspectorVisible(!inspectorVisible)}
          />

          {/* Stage + Inspector */}
          <div className="flex flex-1 overflow-hidden">
            {/* Stage Area */}
            <Stage
              currentView={currentView}
              mode={mode}
              isDrawing={isDrawing}
              winners={winners}
              participants={participants}
              onParticipantsChange={setParticipants}
              autoExclude={autoExclude}
              onAutoExcludeChange={setAutoExclude}
              soundEnabled={soundEnabled}
              onSoundToggle={() => setSoundEnabled(!soundEnabled)}
              onModeChange={setMode}
              onGoToDraw={() => setCurrentView("draw")}
              roundInfo={mode === "tournament" ? {
                current: currentRoundIndex + 1,
                total: tournamentRounds.length,
                name: tournamentRounds[currentRoundIndex].name,
                isFinished: currentRoundFinished,
                targetCount: tournamentRounds[currentRoundIndex].count,
                winnersSoFar: roundWinners[currentRoundIndex] || []
              } : undefined}
              winnerCount={mode === "classic" ? getClassicBatchCount() : 1}
              classicCount={classicCount}
              onClassicCountChange={setClassicCount}
              classicMethod={classicMethod}
              onClassicMethodChange={setClassicMethod}
              batchSize={batchSize}
              onBatchSizeChange={setBatchSize}
              tournamentRounds={tournamentRounds}
              onTournamentRoundsChange={setTournamentRounds}
              prizeName={prizeName}
              onPrizeNameChange={setPrizeName}
              classicTotal={mode === "classic" && classicMethod !== "all" ? classicCount : undefined}
              classicWinnersSoFar={mode === "classic" && classicMethod !== "all" ? classicWinners : undefined}
              historyRecords={historyRecords}
              hideNamesWhileRolling={hideNamesWhileRolling}
              onHideNamesWhileRollingChange={setHideNamesWhileRolling}
              particleEffects={particleEffects}
              onParticleEffectsChange={setParticleEffects}
              lastCelebratedWinners={lastCelebratedWinners}
              onCelebrationComplete={setLastCelebratedWinners}
            />

            {/* Inspector Panel */}
            {inspectorVisible && !focusMode && currentView === "draw" && (
              <Inspector 
                mode={mode} 
                participants={participants} 
                onModeChange={setMode} 
                classicCount={classicCount}
                classicMethod={classicMethod}
                batchSize={batchSize}
                tournamentRounds={tournamentRounds}
              />
            )}
          </div>

          {/* Control Bar */}
          {currentView === "draw" && (
            <ControlBar
              isDrawing={isDrawing}
              onStartDraw={handleStartDraw}
              onStopDraw={handleStopDraw}
              onReset={() => {
                setWinners([])
                setIsDrawing(false)
                setCurrentRoundIndex(0)
                setRoundWinners([])
                setClassicWinners([])
                setLastCelebratedWinners("")
              }}
              winners={winners}
              showNextRound={mode === "tournament" && 
                 currentRoundFinished &&
                 currentRoundIndex < tournamentRounds.length - 1}
              onNextRound={handleNextRound}
              isFinalRound={mode === "tournament" && currentRoundIndex === tournamentRounds.length - 1}
              isRoundFinished={currentRoundFinished}
              isClassicFinished={mode === "classic" && classicWinners.length >= classicCount}
            />
          )}
        </div>
      </div>
    </div>
  )
}
