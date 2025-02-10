import React from 'react'
import './CloseButton.scss'

interface CloseButtonProps {
  onClick: () => void
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
  return (
    <button className="close-button" onClick={onClick} aria-label="Fermer">
      <span className="close-button__icon">&times;</span>
    </button>
  )
}

export default CloseButton
