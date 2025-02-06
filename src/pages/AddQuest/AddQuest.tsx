import classNames from 'classnames'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import InputText from '@components/Form/InputText'
import Loader from '@components/Loader/Loader'
import Status from '@components/Status/Status'
import { usePlayerData } from '@hooks/usePlayerData'
import { addQuest } from '@src/services/questService'

import './AddQuest.scss'

const AddQuest: React.FC = () => {
  const DIFFICULTY = {
    EASY: 1,
    MEDIUM: 2,
    DIFFICULT: 3,
    HARD: 4,
  }

  const { player } = usePlayerData()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDifficulty = (difficulty: number) => {
    setDifficulty(difficulty)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (player?.uid) {
        await addQuest(player.uid, title, category, difficulty)
      } else {
        setError('Player UID is missing')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="add-quest">
      <h1>Prochaine quête !</h1>
      <form className="add-quest__form" onSubmit={handleSubmit}>
        {error && <Status type="error" message={error} />}
        <InputText
          name="title"
          label="Titre"
          value={title}
          onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
        />
        <InputText
          name="category"
          label="Catégorie"
          value={category}
          onChange={(e) => setCategory((e.target as HTMLInputElement).value)}
        />
        <section className="add-quest__difficulty">
          <section className="add-quest__difficulty--line">
            <button
              type="button"
              className={classNames('add-quest__difficulty--easy ', {
                selected: difficulty === DIFFICULTY.EASY,
              })}
              onClick={() => handleDifficulty(DIFFICULTY.EASY)}>
              Facile
            </button>
            <button
              type="button"
              className={classNames('add-quest__difficulty--medium ', {
                selected: difficulty === DIFFICULTY.MEDIUM,
              })}
              onClick={() => handleDifficulty(DIFFICULTY.MEDIUM)}>
              Moyen
            </button>
          </section>
          <section className="add-quest__difficulty--line">
            <button
              type="button"
              className={classNames('add-quest__difficulty--difficult ', {
                selected: difficulty === DIFFICULTY.DIFFICULT,
              })}
              onClick={() => handleDifficulty(DIFFICULTY.DIFFICULT)}>
              Difficile
            </button>
            <button
              type="button"
              className={classNames('add-quest__difficulty--hard ', {
                selected: difficulty === DIFFICULTY.HARD,
              })}
              onClick={() => handleDifficulty(DIFFICULTY.HARD)}>
              Epique
            </button>
          </section>
        </section>
        {loading ? (
          <Loader />
        ) : (
          <button className="primary-button" type="submit">
            Envoyer
          </button>
        )}
      </form>
      <Link to="/">Retour</Link>
    </section>
  )
}

export default AddQuest
