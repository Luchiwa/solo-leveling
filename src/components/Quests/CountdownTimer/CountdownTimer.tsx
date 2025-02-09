import classNames from 'classnames'
import { Timestamp } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

import './CountdownTimer.scss'

interface CountdownTimerProps {
  expiresAt: Timestamp
  onExpire: () => void
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiresAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [isExpiringSoon, setIsExpiringSoon] = useState(false)

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime()
      const expirationTime = expiresAt.toMillis()
      const remaining = expirationTime - now

      if (remaining <= 0) {
        setTimeLeft('⏳ Expiré')
        onExpire()

        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200])
        }
        return
      }

      const minutesLeft = Math.floor(remaining / (1000 * 60))
      setIsExpiringSoon(minutesLeft < 5)

      const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((remaining / (1000 * 60)) % 60)
      const seconds = Math.floor((remaining / 1000) % 60)
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [expiresAt, onExpire])

  return (
    <span className={classNames('countdown-timer', { 'countdown-timer--warning': isExpiringSoon })}>
      {timeLeft}
    </span>
  )
}

export default CountdownTimer
