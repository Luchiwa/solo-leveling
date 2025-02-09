import React from 'react'

import './InputText.scss'

interface InputTextProps {
  type?: string
  label: string
  name: string
  placeholder?: string
  value: string
  error?: string
  // eslint-disable-next-line no-unused-vars
  onChange: (e: React.FormEvent) => void
}

const InputText: React.FC<InputTextProps> = ({
  type = 'text',
  placeholder = '',
  name,
  label,
  value,
  error,
  onChange,
}) => {
  return (
    <fieldset className="input-text">
      <div className="input-text__input">
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <label htmlFor={name}>{label}</label>
        <span className="input-text__input--bar"></span>
      </div>
      {error && <small className="input-text__error">{error}</small>}
    </fieldset>
  )
}

export default InputText
