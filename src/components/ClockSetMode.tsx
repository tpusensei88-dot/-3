import { useState, useEffect } from 'react'
import Clock from './Clock'
import { Time, GameResult, Settings } from '../types'
import { generateRandomTime } from '../utils'
import './GameMode.css'

interface ClockSetModeProps {
  onComplete: (result: GameResult) => void
  onBack: () => void
  settings: Settings
}

export default function ClockSetMode({ onComplete, onBack, settings }: ClockSetModeProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [targetTime, setTargetTime] = useState<Time>(generateRandomTime())
  const [currentTime, setCurrentTime] = useState<Time>({ hour: 12, minute: 0 })
  const [correctCount, setCorrectCount] = useState(0)
  const [startTime] = useState<number>(Date.now())
  const [timeLeft, setTimeLeft] = useState<number | null>(settings.timeLimit)
  const [isCorrect, setIsCorrect] = useState(false)

  const TOTAL_QUESTIONS = 10

  useEffect(() => {
    if (settings.timeLimit !== null) {
      setTimeLeft(settings.timeLimit)
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [settings.timeLimit])

  useEffect(() => {
    if (timeLeft === 0) {
      const timeSpent = settings.timeLimit || 0
      const score = calculateScore(correctCount, TOTAL_QUESTIONS, timeSpent)
      onComplete({
        mode: 'clockSet',
        correctCount,
        totalQuestions: TOTAL_QUESTIONS,
        timeSpent,
        score,
        title: calculateTitle(score),
      })
    }
  }, [timeLeft])

  useEffect(() => {
    checkAnswer()
  }, [currentTime])

  const checkAnswer = () => {
    const hourMatch = currentTime.hour === targetTime.hour || 
                     (currentTime.hour === 12 && targetTime.hour === 0) ||
                     (currentTime.hour === 0 && targetTime.hour === 12)
    const minuteMatch = currentTime.minute === targetTime.minute

    if (hourMatch && minuteMatch) {
      setIsCorrect(true)
    } else {
      setIsCorrect(false)
    }
  }

  const handleNext = () => {
    if (!isCorrect) return

    const newCorrectCount = correctCount + 1
    setCorrectCount(newCorrectCount)

    if (currentQuestion + 1 >= TOTAL_QUESTIONS) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      const score = calculateScore(newCorrectCount, TOTAL_QUESTIONS, timeSpent)
      onComplete({
        mode: 'clockSet',
        correctCount: newCorrectCount,
        totalQuestions: TOTAL_QUESTIONS,
        timeSpent,
        score,
        title: calculateTitle(score),
      })
    } else {
      setCurrentQuestion(currentQuestion + 1)
      setTargetTime(generateRandomTime())
      setCurrentTime({ hour: 12, minute: 0 })
      setIsCorrect(false)
    }
  }

  return (
    <div className="game-mode">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>
          もどる
        </button>
        <div className="progress">
          問題 {currentQuestion + 1} / {TOTAL_QUESTIONS}
        </div>
        {timeLeft !== null && (
          <div className="timer">残り時間: {timeLeft}秒</div>
        )}
      </div>

      <div className="game-content">
        <div className="target-display">
          <h2>この時刻に合わせてください</h2>
          <div className="target-time">
            {targetTime.hour}時{targetTime.minute}分
          </div>
        </div>

        <Clock
          time={currentTime}
          onTimeChange={setCurrentTime}
          showRealTimeDisplay={false}
          interactive={true}
        />

        {isCorrect && (
          <div className="correct-message">
            <div className="correct-text">正解！</div>
            <button className="next-button" onClick={handleNext}>
              つぎへ
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function calculateScore(correctCount: number, totalQuestions: number, timeSpent: number): number {
  const accuracy = (correctCount / totalQuestions) * 100
  const timeBonus = Math.max(0, 1000 - timeSpent * 10)
  return Math.round(accuracy * 5 + timeBonus)
}

function calculateTitle(score: number): string {
  if (score >= 1000) return 'マスター'
  if (score >= 700) return 'ハイパー'
  if (score >= 400) return 'スーパー'
  return 'ノーマル'
}
