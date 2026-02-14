export type GameMode = 'keyUnlock' | 'clockSet' | 'answerWithMemory' | 'answerWithoutMemory'

export interface Settings {
  timeLimit: number | null // 秒単位、nullは制限時間なし
}

export interface GameResult {
  mode: GameMode
  correctCount: number
  totalQuestions: number
  timeSpent: number // 秒
  score: number
  title: string
}

export interface Time {
  hour: number
  minute: number
}
