import { useState, useEffect } from 'react'
import Clock from './Clock'
import { Time, GameResult, Settings } from '../types'
import { generateRandomTime } from '../utils'
import './GameMode.css'

interface AnswerModeWithMemoryProps {
  onComplete: (result: GameResult) => void
  onBack: () => void
  settings: Settings
}

export default function AnswerModeWithMemory({
  onComplete,
  onBack,
  settings,
}: AnswerModeWithMemoryProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [targetTime, setTargetTime] = useState<Time>(generateRandomTime())
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null)
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
        mode: 'answerWithMemory',
        correctCount,
        totalQuestions: TOTAL_QUESTIONS,
        timeSpent,
        score,
        title: calculateTitle(score),
      })
    }
  }, [timeLeft])

  useEffect(() => {
    if (selectedHour !== null && selectedMinute !== null) {
      checkAnswer()
    }
  }, [selectedHour, selectedMinute])

  const checkAnswer = () => {
    if (selectedHour === null || selectedMinute === null) return

    const hourMatch = selectedHour === targetTime.hour || 
                     (selectedHour === 12 && targetTime.hour === 0) ||
                     (selectedHour === 0 && targetTime.hour === 12)
    const minuteMatch = selectedMinute === targetTime.minute

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
        mode: 'answerWithMemory',
        correctCount: newCorrectCount,
        totalQuestions: TOTAL_QUESTIONS,
        timeSpent,
        score,
        title: calculateTitle(score),
      })
    } else {
      setCurrentQuestion(currentQuestion + 1)
      setTargetTime(generateRandomTime())
      setSelectedHour(null)
      setSelectedMinute(null)
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
        <h2>この時計は何時何分ですか？</h2>

        <Clock
          time={targetTime}
          showRealTimeDisplay={false}
          showMinuteNumbers={true}
          interactive={false}
        />

        <div className="answer-section">
          <div className="answer-input">
            <div className="input-group">
              <label>時</label>
              <div className="number-buttons">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hour) => (
                  <button
                    key={hour}
                    className={`number-button ${selectedHour === hour ? 'selected' : ''}`}
                    onClick={() => setSelectedHour(hour)}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label>分</label>
              <div className="number-buttons">
                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((minute) => (
                  <button
                    key={minute}
                    className={`number-button ${selectedMinute === minute ? 'selected' : ''}`}
                    onClick={() => setSelectedMinute(minute)}
                  >
                    {minute}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedHour !== null && selectedMinute !== null && (
            <div className="selected-answer">
              あなたの答え: {selectedHour}時{selectedMinute}分
            </div>
          )}

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
