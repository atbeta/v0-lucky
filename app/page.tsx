"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Stage } from "@/components/stage"
import { Inspector } from "@/components/inspector"
import { ControlBar } from "@/components/control-bar"
import { TopBar } from "@/components/top-bar"
import { WindowTitlebar } from "@/components/window-titlebar"
import { isTauri, invoke } from "@tauri-apps/api/core"
import { Participant } from "@/types"

interface HistoryRecord {
  id: number
  date: string
  mode: "classic" | "tournament"
  prizeName: string
  winners: Participant[]
  totalParticipants: number
  rounds?: { name: string; winners: Participant[] }[]
  participantsSnapshot?: Participant[]
}

export default function HomePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [inspectorVisible, setInspectorVisible] = useState(true)
  const [focusMode, setFocusMode] = useState(false)
  const [currentView, setCurrentView] = useState<"draw" | "participants" | "prizes" | "history" | "settings">("draw")

  // Lottery state
  const [mode, setMode] = useState<"classic" | "tournament">("classic")
  const [isDrawing, setIsDrawing] = useState(false)
  const [winners, setWinners] = useState<Participant[]>([])
  const [autoExclude, setAutoExclude] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  // History State
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([])

  // Settings State
  const [hideNamesWhileRolling, setHideNamesWhileRolling] = useState(true)
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
  const [roundWinners, setRoundWinners] = useState<Participant[][]>([]) // Store winners of each round

  const [participants, setParticipants] = useState<Participant[]>([])

  // Persistence Logic
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize Config & Data
  useEffect(() => {
    const initializeApp = async () => {
      if (isTauri()) {
        try {
          const { readTextFile, exists, writeTextFile } = await import('@tauri-apps/plugin-fs');
          const { join } = await import('@tauri-apps/api/path');
          
          // Get App Directory (Current Working Directory)
          const appDir = await invoke('get_app_dir') as string;
          const configPath = await join(appDir, 'config.json');
          const participantsPath = await join(appDir, 'participants.json');
          const historyPath = await join(appDir, 'history.json');
          
          // Load Config
          const configExists = await exists(configPath);
          if (configExists) {
            const configContent = await readTextFile(configPath);
            const parsedConfig = JSON.parse(configContent);
            if (parsedConfig.soundEnabled !== undefined) setSoundEnabled(parsedConfig.soundEnabled);
            if (parsedConfig.autoExclude !== undefined) setAutoExclude(parsedConfig.autoExclude);
            if (parsedConfig.hideNamesWhileRolling !== undefined) setHideNamesWhileRolling(parsedConfig.hideNamesWhileRolling);
            if (parsedConfig.particleEffects !== undefined) setParticleEffects(parsedConfig.particleEffects);
            
            // Restore Draw Config
            if (parsedConfig.mode) setMode(parsedConfig.mode);
            if (parsedConfig.classicCount) setClassicCount(parsedConfig.classicCount);
            if (parsedConfig.classicMethod) setClassicMethod(parsedConfig.classicMethod);
            if (parsedConfig.batchSize) setBatchSize(parsedConfig.batchSize);
            if (parsedConfig.prizeName) setPrizeName(parsedConfig.prizeName);
            if (parsedConfig.tournamentRounds) setTournamentRounds(parsedConfig.tournamentRounds);
          }

          // Load Participants
          const dataExists = await exists(participantsPath);
          if (dataExists) {
            const dataContent = await readTextFile(participantsPath);
            const parsedData = JSON.parse(dataContent);
            if (Array.isArray(parsedData) && parsedData.length > 0) {
              setParticipants(parsedData);
            }
          }

          // Load History
          const historyExists = await exists(historyPath);
          if (historyExists) {
            const historyContent = await readTextFile(historyPath);
            const parsedHistory = JSON.parse(historyContent);
            if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
              // Validate format (check if winners are objects, not strings)
              const firstWinner = parsedHistory[0].winners?.[0];
              const isNewFormat = typeof firstWinner === 'object' || firstWinner === undefined; // undefined if empty winners array
              
              if (isNewFormat) {
                setHistoryRecords(parsedHistory);
              } else {
                console.warn("Detected old history format, clearing history.");
                setHistoryRecords([]);
              }
            }
          }
        } catch (e) {
          console.error("Failed to load data from file system", e);
        }
      } else {
        // Fallback to LocalStorage
        const stored = localStorage.getItem("lucky-draw-participants")
        const storedConfig = localStorage.getItem("lucky-draw-config")
        const storedHistory = localStorage.getItem("lucky-draw-history")
        
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (Array.isArray(parsed) && parsed.length > 0) {
                setParticipants(parsed)
            }
          } catch (e) {
            console.error("Failed to load participants from LS", e)
          }
        }

        if (storedHistory) {
          try {
            const parsedHistory = JSON.parse(storedHistory)
            if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
                // Validate format (check if winners are objects, not strings)
                const firstWinner = parsedHistory[0].winners?.[0];
                const isNewFormat = typeof firstWinner === 'object' || firstWinner === undefined;
                
                if (isNewFormat) {
                   setHistoryRecords(parsedHistory)
                } else {
                   console.warn("Detected old history format in LS, clearing history.");
                   setHistoryRecords([]);
                }
            }
          } catch (e) {
            console.error("Failed to load history from LS", e)
          }
        }

        if (storedConfig) {
          try {
            const parsedConfig = JSON.parse(storedConfig)
            if (parsedConfig.soundEnabled !== undefined) setSoundEnabled(parsedConfig.soundEnabled)
            if (parsedConfig.autoExclude !== undefined) setAutoExclude(parsedConfig.autoExclude)
            if (parsedConfig.hideNamesWhileRolling !== undefined) setHideNamesWhileRolling(parsedConfig.hideNamesWhileRolling)
            if (parsedConfig.particleEffects !== undefined) setParticleEffects(parsedConfig.particleEffects)
            
            // Restore Draw Config
            if (parsedConfig.mode) setMode(parsedConfig.mode)
            if (parsedConfig.classicCount) setClassicCount(parsedConfig.classicCount)
            if (parsedConfig.classicMethod) setClassicMethod(parsedConfig.classicMethod)
            if (parsedConfig.batchSize) setBatchSize(parsedConfig.batchSize)
            if (parsedConfig.prizeName) setPrizeName(parsedConfig.prizeName)
            if (parsedConfig.tournamentRounds) setTournamentRounds(parsedConfig.tournamentRounds)
          } catch (e) {
            console.error("Failed to load config from LS", e)
          }
        }
      }
      setIsLoaded(true)
    };

    initializeApp();
  }, [])

  // Save Config & Data
  useEffect(() => {
    if (!isLoaded) return;

    const saveData = async () => {
      const config = {
        soundEnabled,
        autoExclude,
        hideNamesWhileRolling,
        particleEffects,
        // Draw Config
        mode,
        classicCount,
        classicMethod,
        batchSize,
        prizeName,
        tournamentRounds
      };

      if (isTauri()) {
        try {
          const { writeTextFile } = await import('@tauri-apps/plugin-fs');
          const { join } = await import('@tauri-apps/api/path');
          
          // Get App Directory (Current Working Directory)
          const appDir = await invoke('get_app_dir') as string;
          const configPath = await join(appDir, 'config.json');
          const participantsPath = await join(appDir, 'participants.json');
          const historyPath = await join(appDir, 'history.json');

          // Write files
          await writeTextFile(configPath, JSON.stringify(config, null, 2));
          await writeTextFile(participantsPath, JSON.stringify(participants, null, 2));
          await writeTextFile(historyPath, JSON.stringify(historyRecords, null, 2));
        } catch (e) {
          console.error("Failed to save data to file system", e);
        }
      } else {
        // Fallback to LocalStorage
        localStorage.setItem("lucky-draw-participants", JSON.stringify(participants));
        localStorage.setItem("lucky-draw-config", JSON.stringify(config));
        localStorage.setItem("lucky-draw-history", JSON.stringify(historyRecords));
      }
    };

    saveData();
  }, [
    participants,
    historyRecords,
    soundEnabled, 
    autoExclude, 
    hideNamesWhileRolling, 
    particleEffects, 
    isLoaded,
    // Add Draw Config dependencies
    mode,
    classicCount,
    classicMethod,
    batchSize,
    prizeName,
    tournamentRounds
  ])

  const [classicWinners, setClassicWinners] = useState<Participant[]>([]) // Track all winners in classic mode

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
      availableParticipants = participants.filter((p) => !p.excluded && !classicWinners.some(w => w.id === p.id))
    } else {
      // In tournament mode
      if (currentRoundIndex === 0) {
        // First round: pick from all not excluded
        // Also exclude already won in THIS round
        const currentRoundWinnersSoFar = roundWinners[currentRoundIndex] || []
        availableParticipants = participants.filter((p) => !p.excluded && !currentRoundWinnersSoFar.some(w => w.id === p.id))
      } else {
        // Subsequent rounds: pick from winners of previous round
        // Make sure roundWinners[currentRoundIndex - 1] exists
        const previousRoundWinners = roundWinners[currentRoundIndex - 1] || []
        // Also exclude already won in THIS round
        const currentRoundWinnersSoFar = roundWinners[currentRoundIndex] || []
        
        availableParticipants = participants.filter(p => 
            previousRoundWinners.some(w => w.id === p.id) && 
            !currentRoundWinnersSoFar.some(w => w.id === p.id) &&
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

    const winnersList: Participant[] = []
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
      winnersList.push(winner)
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
             setParticipants(participants.map((p) => (winnersList.some(w => w.id === p.id) ? { ...p, excluded: true } : p)))
         }
         
         // Save History if finished
         if (newClassicWinners.length >= classicCount) {
             const newRecord: HistoryRecord = {
                 id: Date.now(),
                 date: new Date().toLocaleString(),
                 mode: "classic",
                 prizeName: prizeName || "未命名奖品",
                 winners: newClassicWinners,
                totalParticipants: participants.filter(p => !p.excluded).length,
                participantsSnapshot: participants // Store snapshot of current participants
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
                totalParticipants: participants.filter(p => !p.excluded).length,
                rounds: tournamentRounds.map((r, idx) => ({
                    name: r.name,
                     winners: newRoundWinners[idx] || []
                 })),
                 participantsSnapshot: participants // Store snapshot of current participants
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
      (roundWinners[currentRoundIndex]?.length || 0) >= (tournamentRounds[currentRoundIndex]?.count || 0)

  const showNextRound = mode === "tournament" && 
      currentRoundFinished &&
      currentRoundIndex < tournamentRounds.length - 1

  const isFinalRound = mode === "tournament" && currentRoundIndex === tournamentRounds.length - 1
  const isClassicFinished = mode === "classic" && classicWinners.length >= classicCount

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        // Ignore if typing in an input
        if (
             document.activeElement?.tagName === "INPUT" || 
             document.activeElement?.tagName === "TEXTAREA" ||
             (document.activeElement as HTMLElement)?.isContentEditable
        ) {
            return
        }

        e.preventDefault()

        if (currentView !== "draw") return

        if (isDrawing) {
          handleStopDraw()
        } else {
            // Logic to determine "Start" or "Next"
            if (showNextRound) {
                handleNextRound()
            } else if ((isFinalRound && currentRoundFinished) || isClassicFinished) {
                // Finished, do nothing
            } else {
                handleStartDraw()
            }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    currentView, 
    isDrawing, 
    showNextRound, 
    isFinalRound, 
    currentRoundFinished, 
    isClassicFinished,
    handleStopDraw, // Dependencies that might change
    handleStartDraw,
    handleNextRound
  ])

  const handleResetConfig = () => {
    // Only Reset Draw Config, keep Settings (sound, effects, etc.) as is
    setMode("classic")
    setClassicCount(1)
    setClassicMethod("one-by-one")
    setBatchSize(2)
    setPrizeName("")
    setTournamentRounds([
      { id: 1, count: 5, name: "第一轮" },
      { id: 2, count: 3, name: "第二轮" },
      { id: 3, count: 1, name: "最终轮" },
    ])
  }

  const handleClearHistory = () => {
     setHistoryRecords([])
  }

  // Calculate candidates for rolling animation
   const getRollingCandidates = () => {
     if (mode === "classic") {
       return participants.filter((p) => !p.excluded && !classicWinners.some(w => w.id === p.id))
     } else {
       // Tournament
       if (currentRoundIndex === 0) {
         const currentRoundWinnersSoFar = roundWinners[currentRoundIndex] || []
         return participants.filter((p) => !p.excluded && !currentRoundWinnersSoFar.some(w => w.id === p.id))
       } else {
         const previousRoundWinners = roundWinners[currentRoundIndex - 1] || []
         const currentRoundWinnersSoFar = roundWinners[currentRoundIndex] || []
         return participants.filter(p => 
             previousRoundWinners.some(w => w.id === p.id) && 
             !currentRoundWinnersSoFar.some(w => w.id === p.id) &&
             !p.excluded
         )
       }
     }
   }

  const rollingCandidates = getRollingCandidates()

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
        <div className="flex flex-1 flex-col overflow-hidden relative">
          {/* TopBar */}
          {currentView === "draw" && (
            <TopBar
              mode={mode}
              focusMode={focusMode}
              inspectorVisible={inspectorVisible}
              onToggleFocus={handleToggleFocus}
              onToggleInspector={() => setInspectorVisible(!inspectorVisible)}
            />
          )}

          {/* Stage + Inspector */}
          <div className="flex flex-1 overflow-hidden">
            
            {/* Draw Area Wrapper (Stage + ControlBar) */}
            <div className="flex flex-1 flex-col overflow-hidden relative">
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
                    name: tournamentRounds[currentRoundIndex]?.name || "",
                    isFinished: currentRoundFinished,
                    targetCount: tournamentRounds[currentRoundIndex]?.count || 0,
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
                  onResetConfig={handleResetConfig}
                  onClearHistory={handleClearHistory}
                  candidates={rollingCandidates}
                />

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
                    showNextRound={showNextRound}
                    onNextRound={handleNextRound}
                    isFinalRound={isFinalRound}
                    isRoundFinished={currentRoundFinished}
                    isClassicFinished={isClassicFinished}
                  />
                )}
            </div>

            {/* Inspector Panel */}
            {inspectorVisible && !focusMode && currentView === "draw" && (
              <Inspector 
                mode={mode} 
                participants={participants} 
                onModeChange={setMode} 
                isDrawing={isDrawing}
                classicCount={classicCount}
                classicMethod={classicMethod}
                batchSize={batchSize}
                tournamentRounds={tournamentRounds}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
