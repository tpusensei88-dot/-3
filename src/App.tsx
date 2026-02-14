import { useState, useEffect } from 'react'
import MainMenu from './components/MainMenu'
import KeyUnlockMode from './components/KeyUnlockMode'
import ClockSetMode from './components/ClockSetMode'
import AnswerModeWithMemory from './components/AnswerModeWithMemory'
import AnswerModeWithoutMemory from './components/AnswerModeWithoutMemory'
import ResultScreen from './components/ResultScreen'
import Settings from './components/Settings'
import { GameMode, GameResult, Settings as SettingsType } from './types'

function App() {
  // デバッグ用: アプリが読み込まれているか確認
  console.log('App component loaded')
  
  const [currentMode, setCurrentMode] = useState<GameMode | 'menu' | 'settings' | 'result'>('menu')
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [keyUnlockCleared, setKeyUnlockCleared] = useState(false)
  const [settings, setSettings] = useState<SettingsType>({
    timeLimit: null, // null = 制限時間なし
  })
  const [titles, setTitles] = useState<Record<string, string>>({})

  useEffect(() => {
    const savedKeyUnlock = localStorage.getItem('keyUnlockCleared')
    if (savedKeyUnlock === 'true') {
      setKeyUnlockCleared(true)
    }
    const savedTitles = localStorage.getItem('titles')
    if (savedTitles) {
      setTitles(JSON.parse(savedTitles))
    }
    const savedSettings = localStorage.getItem('settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleModeSelect = (mode: GameMode) => {
    if (mode !== 'keyUnlock' && !keyUnlockCleared) {
      alert('まず「鍵開け問題」をクリアしてください！')
      return
    }
    setCurrentMode(mode)
  }

  const handleGameComplete = (result: GameResult) => {
    setGameResult(result)
    setCurrentMode('result')

    // 鍵開け問題をクリアした場合
    if (result.mode === 'keyUnlock') {
      setKeyUnlockCleared(true)
      localStorage.setItem('keyUnlockCleared', 'true')
    }

    // 称号を更新
    const newTitles = { ...titles }
    const title = calculateTitle(result.score)
    if (!newTitles[result.mode] || getTitleRank(title) > getTitleRank(newTitles[result.mode])) {
      newTitles[result.mode] = title
      setTitles(newTitles)
      localStorage.setItem('titles', JSON.stringify(newTitles))
    }
  }

  const handleBackToMenu = () => {
    setCurrentMode('menu')
    setGameResult(null)
  }

  const handleSettingsChange = (newSettings: SettingsType) => {
    setSettings(newSettings)
    localStorage.setItem('settings', JSON.stringify(newSettings))
  }

  if (currentMode === 'menu') {
    return (
      <MainMenu
        onModeSelect={handleModeSelect}
        onSettingsClick={() => setCurrentMode('settings')}
        keyUnlockCleared={keyUnlockCleared}
        titles={titles}
      />
    )
  }

  if (currentMode === 'settings') {
    return (
      <Settings
        settings={settings}
        onSettingsChange={handleSettingsChange}
        onBack={handleBackToMenu}
      />
    )
  }

  if (currentMode === 'result' && gameResult) {
    return (
      <ResultScreen
        result={gameResult}
        onBack={handleBackToMenu}
        onRetry={() => setCurrentMode(gameResult.mode)}
      />
    )
  }

  switch (currentMode) {
    case 'keyUnlock':
      return (
        <KeyUnlockMode
          onComplete={handleGameComplete}
          onBack={handleBackToMenu}
          settings={settings}
        />
      )
    case 'clockSet':
      return (
        <ClockSetMode
          onComplete={handleGameComplete}
          onBack={handleBackToMenu}
          settings={settings}
        />
      )
    case 'answerWithMemory':
      return (
        <AnswerModeWithMemory
          onComplete={handleGameComplete}
          onBack={handleBackToMenu}
          settings={settings}
        />
      )
    case 'answerWithoutMemory':
      return (
        <AnswerModeWithoutMemory
          onComplete={handleGameComplete}
          onBack={handleBackToMenu}
          settings={settings}
        />
      )
    default:
      return null
  }
}

function calculateTitle(score: number): string {
  if (score >= 1000) return 'マスター'
  if (score >= 700) return 'ハイパー'
  if (score >= 400) return 'スーパー'
  return 'ノーマル'
}

function getTitleRank(title: string): number {
  const ranks: Record<string, number> = {
    'ノーマル': 1,
    'スーパー': 2,
    'ハイパー': 3,
    'マスター': 4,
  }
  return ranks[title] || 0
}

export default App
