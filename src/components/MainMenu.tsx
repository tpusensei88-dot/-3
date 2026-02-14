import { GameMode } from '../types'
import './MainMenu.css'

interface MainMenuProps {
  onModeSelect: (mode: GameMode) => void
  onSettingsClick: () => void
  keyUnlockCleared: boolean
  titles: Record<string, string>
}

export default function MainMenu({
  onModeSelect,
  onSettingsClick,
  keyUnlockCleared,
  titles,
}: MainMenuProps) {
  return (
    <div className="main-menu">
      <h1 className="title">なんじ なんふん アタック</h1>
      
      <div className="mode-buttons">
        <button
          className={`mode-button ${keyUnlockCleared ? 'cleared' : 'required'}`}
          onClick={() => onModeSelect('keyUnlock')}
        >
          <div className="mode-title">鍵開け問題</div>
          {keyUnlockCleared && titles.keyUnlock && (
            <div className="mode-title-badge">{titles.keyUnlock}</div>
          )}
          {!keyUnlockCleared && <div className="mode-subtitle">まずこれをクリア！</div>}
        </button>

        <button
          className={`mode-button ${keyUnlockCleared ? '' : 'disabled'}`}
          onClick={() => onModeSelect('clockSet')}
          disabled={!keyUnlockCleared}
        >
          <div className="mode-title">時計合わせモード★</div>
          {titles.clockSet && (
            <div className="mode-title-badge">{titles.clockSet}</div>
          )}
        </button>

        <button
          className={`mode-button ${keyUnlockCleared ? '' : 'disabled'}`}
          onClick={() => onModeSelect('answerWithMemory')}
          disabled={!keyUnlockCleared}
        >
          <div className="mode-title">何時何分か答えるモード★★</div>
          <div className="mode-subtitle">（メモリに数字あり）</div>
          {titles.answerWithMemory && (
            <div className="mode-title-badge">{titles.answerWithMemory}</div>
          )}
        </button>

        <button
          className={`mode-button ${keyUnlockCleared ? '' : 'disabled'}`}
          onClick={() => onModeSelect('answerWithoutMemory')}
          disabled={!keyUnlockCleared}
        >
          <div className="mode-title">何時何分か答えるモード★★★</div>
          {titles.answerWithoutMemory && (
            <div className="mode-title-badge">{titles.answerWithoutMemory}</div>
          )}
        </button>
      </div>

      <button className="settings-button" onClick={onSettingsClick}>
        設定
      </button>
    </div>
  )
}
