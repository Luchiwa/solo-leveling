import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'

import './Select.scss'

interface SelectProps {
  defaultOptionLabel: string
  options: string[]
  value: string
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void
}

const Select: React.FC<SelectProps> = ({ defaultOptionLabel, options, value, onChange }) => {
  const selectRef = useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="custom-select" ref={selectRef}>
      <div className="custom-select__selected" onClick={() => setIsOpen(!isOpen)}>
        {value || defaultOptionLabel}
        <span className={classNames('custom-select__arrow', { open: isOpen })}></span>
      </div>

      {isOpen && (
        <ul className="custom-select__dropdown">
          {options.map((option) => (
            <li
              key={option}
              className={classNames('custom-select__option', { selected: option === value })}
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Select
