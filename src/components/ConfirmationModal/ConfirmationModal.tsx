import React, { useState } from 'react'

import './ConfirmationModal.scss'

interface ConfirmationModalProps {
  title: string
  message?: string
  cancelLabel?: string
  confirmLabel?: string
  onCancel: () => void
  onConfirm: () => void
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  cancelLabel = 'Annuler',
  confirmLabel = 'Confirmer',
  onCancel,
  onConfirm,
}) => {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = (callback: () => void) => {
    setIsClosing(true)
    setTimeout(() => {
      callback() // Exécute onCancel ou onConfirm après l'animation
    }, 300) // Durée de l'animation (match le CSS)
  }

  return (
    <div className={`confirmation-modal ${isClosing ? 'closing' : ''}`}>
      <div className="confirmation-modal__content">
        <h2>{title}</h2>
        {message && <p>{message}</p>}
        <div className="confirmation-modal__actions">
          <button type="button" className="cancel-button" onClick={() => handleClose(onCancel)}>
            {cancelLabel}
          </button>
          <button type="button" className="confirm-button" onClick={() => handleClose(onConfirm)}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
