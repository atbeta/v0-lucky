"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Stage } from "@/components/stage"
import { Inspector } from "@/components/inspector"
import { ControlBar } from "@/components/control-bar"
import { TopBar } from "@/components/top-bar"
import { WindowTitlebar } from "@/components/window-titlebar"

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

  const [participants, setParticipants] = useState([
    { id: 1, name: "张三", weight: 1, excluded: false },
    { id: 2, name: "李四", weight: 1, excluded: false },
    { id: 3, name: "王五", weight: 2, excluded: false },
    { id: 4, name: "赵六", weight: 1, excluded: false },
    { id: 5, name: "孙七", weight: 1, excluded: false },
    { id: 6, name: "周八", weight: 1, excluded: false },
    { id: 7, name: "吴九", weight: 1, excluded: false },
  ])

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
    setIsDrawing(true)
    // Simulate drawing
    setTimeout(() => {
      const availableParticipants = participants.filter((p) => !p.excluded)
      const randomWinner = availableParticipants[Math.floor(Math.random() * availableParticipants.length)]
      setWinners([randomWinner.name])
      setIsDrawing(false)

      // Auto exclude if enabled
      if (autoExclude) {
        setParticipants(participants.map((p) => (p.name === randomWinner.name ? { ...p, excluded: true } : p)))
      }
    }, 3000)
  }

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
            />

            {/* Inspector Panel */}
            {inspectorVisible && !focusMode && currentView === "draw" && (
              <Inspector mode={mode} participants={participants} onModeChange={setMode} />
            )}
          </div>

          {/* Control Bar */}
          {currentView === "draw" && (
            <ControlBar
              isDrawing={isDrawing}
              onStartDraw={handleStartDraw}
              onStopDraw={() => setIsDrawing(false)}
              onReset={() => {
                setWinners([])
                setIsDrawing(false)
              }}
              winners={winners}
            />
          )}
        </div>
      </div>
    </div>
  )
}
