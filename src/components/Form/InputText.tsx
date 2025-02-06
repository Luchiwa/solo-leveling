import React from 'react'

import './InputText.scss'

interface InputTextProps {
  type?: string
  label: string
  name: string
  placeholder?: string
  value: string
  onChange: (e: React.FormEvent) => void
}

const InputText: React.FC<InputTextProps> = ({
  type = 'text',
  placeholder = '',
  name,
  label,
  value,
  onChange,
}) => {
  return (
    <div className="input-text">
      <input name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} />
      <label htmlFor={name}>{label}</label>
      <span className="input-text__bar"></span>
    </div>
  )
}

export default InputText
