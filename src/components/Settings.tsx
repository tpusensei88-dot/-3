import { Settings as SettingsType } from '../types'
import './Settings.css'

interface SettingsProps {
  settings: SettingsType
  onSettingsChange: (settings: SettingsType) => void
  onBack: () => void
}

export default function Settings({ settings, onSettingsChange, onBack }: SettingsProps) {
  const handleTimeLimitChange = (value: string) => {
    if (value === 'none') {
      onSettingsChange({ timeLimit: null })
    } else {
      onSettingsChange({ timeLimit: parseInt(value) })
    }
  }

  return (
    <div className="settings-screen">
      <div className="settings-content">
        <h1 className="settings-title">設定</h1>

        <div className="settings-section">
          <h2 className="section-title">制限時間</h2>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="timeLimit"
                value="none"
                checked={settings.timeLimit === null}
                onChange={(e) => handleTimeLimitChange(e.target.value)}
              />
              <span>設定なし</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="timeLimit"
                value="20"
                checked={settings.timeLimit === 20}
                onChange={(e) => handleTimeLimitChange(e.target.value)}
              />
              <span>20秒</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="timeLimit"
                value="30"
                checked={settings.timeLimit === 30}
                onChange={(e) => handleTimeLimitChange(e.target.value)}
              />
              <span>30秒</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="timeLimit"
                value="40"
                checked={settings.timeLimit === 40}
                onChange={(e) => handleTimeLimitChange(e.target.value)}
              />
              <span>40秒</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="timeLimit"
                value="50"
                checked={settings.timeLimit === 50}
                onChange={(e) => handleTimeLimitChange(e.target.value)}
              />
              <span>50秒</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="timeLimit"
                value="60"
                checked={settings.timeLimit === 60}
                onChange={(e) => handleTimeLimitChange(e.target.value)}
              />
              <span>60秒</span>
            </label>
          </div>
        </div>

        <button className="back-button" onClick={onBack}>
          もどる
        </button>
      </div>
    </div>
  )
}
