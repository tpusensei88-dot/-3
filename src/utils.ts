import { Time } from './types'

export function generateRandomTime(): Time {
  const hour = Math.floor(Math.random() * 12) + 1
  const minuteOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
  const minute = minuteOptions[Math.floor(Math.random() * minuteOptions.length)]
  return { hour, minute }
}
