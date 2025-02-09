import React from 'react'

import './Loader.scss'

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="loader-ring"></div>
      <div className="loader-bar"></div>
    </div>
  )
}

export default Loader
