import { useState, useEffect, useRef, useCallback } from 'react'
import { Time } from '../types'
import './Clock.css'

interface ClockProps {
  time: Time
  onTimeChange?: (time: Time) => void
  showRealTimeDisplay?: boolean
  showMinuteNumbers?: boolean
  interactive?: boolean
  size?: number
}

export default function Clock({
  time,
  onTimeChange,
  showRealTimeDisplay = false,
  showMinuteNumbers = false,
  interactive = false,
  size = 400,
}: ClockProps) {
  const [isDragging, setIsDragging] = useState<'hour' | 'minute' | null>(null)
  const clockRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<Time>(time)

  useEffect(() => {
    timeRef.current = time
  }, [time])

  const centerX = size / 2
  const centerY = size / 2
  const radius = size * 0.4

  const hourAngle = ((time.hour % 12) * 30 + time.minute * 0.5 - 90) * (Math.PI / 180)
  const minuteAngle = (time.minute * 6 - 90) * (Math.PI / 180)

  const hourHandX = centerX + radius * 0.5 * Math.cos(hourAngle)
  const hourHandY = centerY + radius * 0.5 * Math.sin(hourAngle)
  const minuteHandX = centerX + radius * 0.8 * Math.cos(minuteAngle)
  const minuteHandY = centerY + radius * 0.8 * Math.sin(minuteAngle)

  const handlePointerDown = (e: React.PointerEvent, hand: 'hour' | 'minute') => {
    if (!interactive) return
    e.preventDefault()
    setIsDragging(hand)
  }

  const handleMouseDown = (e: React.MouseEvent, hand: 'hour' | 'minute') => {
    handlePointerDown(e as any, hand)
  }

  const handlePointerMove = useCallback((e: PointerEvent | MouseEvent | TouchEvent) => {
    if (!isDragging || !clockRef.current || !interactive) return

    const rect = clockRef.current.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0]?.clientX : ('clientX' in e ? e.clientX : 0)
    const clientY = 'touches' in e ? e.touches[0]?.clientY : ('clientY' in e ? e.clientY : 0)
    const x = clientX - rect.left - centerX
    const y = clientY - rect.top - centerY
    const angle = Math.atan2(y, x) * (180 / Math.PI) + 90
    const normalizedAngle = angle < 0 ? angle + 360 : angle

    if (isDragging === 'minute') {
      const minute = Math.round(normalizedAngle / 6) % 60
      onTimeChange?.({ ...timeRef.current, minute })
    } else if (isDragging === 'hour') {
      const hourAngle = normalizedAngle / 30
      let hour = Math.round(hourAngle) % 12
      if (hour === 0) hour = 12
      onTimeChange?.({ ...timeRef.current, hour })
    }
  }, [isDragging, interactive, centerX, centerY, onTimeChange])

  const handlePointerUp = useCallback(() => {
    setIsDragging(null)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove)
      window.addEventListener('mouseup', handlePointerUp)
      window.addEventListener('touchmove', handlePointerMove, { passive: false })
      window.addEventListener('touchend', handlePointerUp)
      return () => {
        window.removeEventListener('mousemove', handlePointerMove)
        window.removeEventListener('mouseup', handlePointerUp)
        window.removeEventListener('touchmove', handlePointerMove)
        window.removeEventListener('touchend', handlePointerUp)
      }
    }
  }, [isDragging, handlePointerMove, handlePointerUp])

  return (
    <div className="clock-container">
      {showRealTimeDisplay && (
        <div className="real-time-display">
          {time.hour}時{time.minute}分
        </div>
      )}
      <div
        ref={clockRef}
        className="clock"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size}>
          {/* 時計の外枠 */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="white"
            stroke="#333"
            strokeWidth="3"
          />
          
          {/* 12時間の数字 */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
            const angle = ((num * 30 - 90) * Math.PI) / 180
            const x = centerX + (radius - 20) * Math.cos(angle)
            const y = centerY + (radius - 20) * Math.sin(angle)
            return (
              <text
                key={num}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="24"
                fontWeight="bold"
                fill="#333"
              >
                {num}
              </text>
            )
          })}

          {/* 分の数字（小さく） */}
          {showMinuteNumbers &&
            [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((min) => {
              const angle = ((min * 6 - 90) * Math.PI) / 180
              const x = centerX + (radius - 10) * Math.cos(angle)
              const y = centerY + (radius - 10) * Math.sin(angle)
              return (
                <text
                  key={min}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="#999"
                >
                  {min}
                </text>
              )
            })}

          {/* 時針 */}
          <line
            x1={centerX}
            y1={centerY}
            x2={hourHandX}
            y2={hourHandY}
            stroke="#333"
            strokeWidth="6"
            strokeLinecap="round"
            style={{ cursor: interactive ? 'pointer' : 'default', touchAction: 'none' }}
            onMouseDown={(e) => handleMouseDown(e, 'hour')}
            onTouchStart={(e) => handlePointerDown(e as any, 'hour')}
          />

          {/* 分針 */}
          <line
            x1={centerX}
            y1={centerY}
            x2={minuteHandX}
            y2={minuteHandY}
            stroke="#333"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ cursor: interactive ? 'pointer' : 'default', touchAction: 'none' }}
            onMouseDown={(e) => handleMouseDown(e, 'minute')}
            onTouchStart={(e) => handlePointerDown(e as any, 'minute')}
          />

          {/* 中心点 */}
          <circle cx={centerX} cy={centerY} r="8" fill="#333" />
        </svg>
      </div>
    </div>
  )
}
