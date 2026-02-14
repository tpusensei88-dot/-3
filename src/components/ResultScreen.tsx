import { GameResult } from '../types'
import './ResultScreen.css'

interface ResultScreenProps {
  result: GameResult
  onBack: () => void
  onRetry: () => void
}

export default function ResultScreen({ result, onBack, onRetry }: ResultScreenProps) {
  const accuracy = Math.round((result.correctCount / result.totalQuestions) * 100)

  return (
    <div className="result-screen">
      <div className="result-content">
        <h1 className="result-title">クリア！</h1>

        <div className="result-stats">
          <div className="stat-item">
            <div className="stat-label">正答率</div>
            <div className="stat-value">{accuracy}%</div>
            <div className="stat-detail">
              {result.correctCount} / {result.totalQuestions} 問正解
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-label">クリア時間</div>
            <div className="stat-value">{result.timeSpent}秒</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">スコア</div>
            <div className="stat-value">{result.score}</div>
          </div>

          <div className="stat-item title-item">
            <div className="stat-label">称号</div>
            <div className={`stat-value title-badge title-${result.title.toLowerCase()}`}>
              {result.title}
            </div>
          </div>
        </div>

        <div className="result-buttons">
          <button className="retry-button" onClick={onRetry}>
            もう一度
          </button>
          <button className="back-button" onClick={onBack}>
            メニューにもどる
          </button>
        </div>
      </div>
    </div>
  )
}
