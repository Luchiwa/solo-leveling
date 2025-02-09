import React from 'react'

import './InputDuration.scss'

interface InputDurationProps {
  value: { days: number; hours: number; minutes: number }
  error?: string
  // eslint-disable-next-line no-unused-vars
  onChange: (newValue: { days: number; hours: number; minutes: number }) => void
}

const InputDuration: React.FC<InputDurationProps> = ({ value, error, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof value) => {
    let newValue = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0 // Convertir en number, 0 si vide
    if (field === 'hours' && newValue > 23) newValue = 23 // Bloque au max 23h
    if (field === 'minutes' && newValue > 59) newValue = 59 // Bloque au max 59min

    onChange({ ...value, [field]: newValue })
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.value = ''
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, field: keyof typeof value) => {
    if (e.target.value === '') {
      onChange({ ...value, [field]: 0 })
    }
  }

  return (
    <>
      <div className="input-duration">
        <div className="input-duration__field">
          <label htmlFor="days">Jour{value.days > 1 ? 's' : ''}</label>
          <input
            id="days"
            type="number"
            min={0}
            max={99}
            value={value.days}
            onFocus={handleFocus}
            onBlur={(e) => handleBlur(e, 'days')}
            onChange={(e) => handleChange(e, 'days')}
            onWheel={(e) => e.currentTarget.blur()} // Désactive le scroll sur l'input
          />
        </div>
        <div className="input-duration__field">
          <label htmlFor="hours">Heure{value.hours > 1 ? 's' : ''}</label>
          <input
            id="hours"
            type="number"
            min={0}
            max={23}
            value={value.hours}
            onFocus={handleFocus}
            onBlur={(e) => handleBlur(e, 'hours')}
            onChange={(e) => handleChange(e, 'hours')}
            onWheel={(e) => e.currentTarget.blur()}
          />
        </div>
        <div className="input-duration__field">
          <label htmlFor="minutes">Minute{value.minutes > 1 ? 's' : ''}</label>
          <input
            id="minutes"
            type="number"
            min={0}
            max={59}
            value={value.minutes}
            onFocus={handleFocus}
            onBlur={(e) => handleBlur(e, 'minutes')}
            onChange={(e) => handleChange(e, 'minutes')}
            onWheel={(e) => e.currentTarget.blur()}
          />
        </div>
      </div>
      {error && <p>{error}</p>}
    </>
  )
}

export default InputDuration
