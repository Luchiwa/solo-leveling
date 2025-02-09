import React from 'react'

import './Toggle.scss'

interface ToggleProps {
  name: string
  checked: boolean
  // eslint-disable-next-line no-unused-vars
  onChange: (checked: boolean) => void
  label?: string
}

const Toggle: React.FC<ToggleProps> = ({ name, checked, onChange, label }) => {
  return (
    <div className="toggle">
      {label && (
        <label className="toggle__label" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="toggle__wrapper">
        <input
          id={name}
          name={name}
          type="checkbox"
          className="toggle__input"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="toggle__slider"></span>
      </div>
    </div>
  )
}

export default Toggle
