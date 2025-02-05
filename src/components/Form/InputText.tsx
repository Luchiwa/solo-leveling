import React from "react"

interface InputTextProps {
  type?: string,
  label: string,
  name: string,
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputText: React.FC<InputTextProps> = ({ type = "text", placeholder = "", name, label, value, onChange }) => {
  return (
    <fieldset>
      <label htmlFor={name}>{label}</label>
      <input
        className="input-text"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </fieldset>
  )
}

export default InputText
