import classNames from 'classnames'
import React from 'react'

import './Status.scss'

interface StatusProps {
  type: 'success' | 'error'
  message: string
}

const Status: React.FC<StatusProps> = ({ type, message }) => {
  return (
    <div
      className={classNames('status', {
        'status--success': type === 'success',
        'status--error': type === 'error',
      })}>
      <p>{message}</p>
    </div>
  )
}

export default Status
