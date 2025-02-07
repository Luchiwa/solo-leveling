import classNames from 'classnames'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import InputText from '@components/Form/InputText'
import Loader from '@components/Loader/Loader'
import Status from '@components/Status/Status'
import {
  validateQuestCategory,
  validateQuestDifficulty,
  validateQuestTitle,
} from '@helpers/validationHelper'
import { usePlayerData } from '@hooks/usePlayerData'
import { addQuest } from '@src/services/questService'
import { QUEST_DIFFICULTY, QuestDifficulty } from '@src/types/quest'

import './AddQuest.scss'

const AddQuest: React.FC = () => {
  const { player } = usePlayerData()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState<QuestDifficulty>(QUEST_DIFFICULTY.UNSET)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldsErrors, setFieldsErrors] = useState<{
    title?: string
    category?: string
    difficulty?: string
  }>({})

  const validateForm = () => {
    const titleValidation = validateQuestTitle(title)
    const categoryValidation = validateQuestCategory(category)
    const difficultyValidation = validateQuestDifficulty(difficulty)

    const newErrors: { title?: string; category?: string; difficulty?: string } = {}

    if (!titleValidation.valid) newErrors.title = titleValidation.error
    if (!categoryValidation.valid) newErrors.category = categoryValidation.error
    if (!difficultyValidation.valid) newErrors.difficulty = difficultyValidation.error

    setFieldsErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleDifficulty = (difficulty: QuestDifficulty) => {
    setDifficulty(difficulty)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setError('')
    setLoading(true)
    try {
      if (player?.uid) {
        const newQuest = await addQuest(player.uid, title, category, difficulty)
        if (newQuest) {
          navigate('/') // Redirection uniquement si la quête existe bien
        } else {
          setError('La quête n’a pas pu être enregistrée.')
        }
      } else {
        setError('Player UID is missing')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="add-quest">
      <h1>Nouvelle quête</h1>
      <form className="add-quest__form" onSubmit={handleSubmit}>
        {error && <Status type="error" message={error} />}
        <InputText
          name="title"
          label="Titre"
          value={title}
          error={fieldsErrors.title}
          onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
        />
        <InputText
          name="category"
          label="Catégorie"
          value={category}
          error={fieldsErrors.category}
          onChange={(e) => setCategory((e.target as HTMLInputElement).value)}
        />
        <section className="add-quest__difficulty">
          <p className="add-quest__difficulty--label">Difficulté</p>
          <section className="add-quest__difficulty--line">
            <button
              type="button"
              className={classNames('add-quest__difficulty--easy ', {
                selected: difficulty === QUEST_DIFFICULTY.EASY,
              })}
              onClick={() => handleDifficulty(QUEST_DIFFICULTY.EASY)}>
              Facile
            </button>
            <button
              type="button"
              className={classNames('add-quest__difficulty--medium ', {
                selected: difficulty === QUEST_DIFFICULTY.MEDIUM,
              })}
              onClick={() => handleDifficulty(QUEST_DIFFICULTY.MEDIUM)}>
              Moyen
            </button>
          </section>
          <section className="add-quest__difficulty--line">
            <button
              type="button"
              className={classNames('add-quest__difficulty--difficult ', {
                selected: difficulty === QUEST_DIFFICULTY.DIFFICULT,
              })}
              onClick={() => handleDifficulty(QUEST_DIFFICULTY.DIFFICULT)}>
              Difficile
            </button>
            <button
              type="button"
              className={classNames('add-quest__difficulty--hard ', {
                selected: difficulty === QUEST_DIFFICULTY.HARD,
              })}
              onClick={() => handleDifficulty(QUEST_DIFFICULTY.HARD)}>
              Epique
            </button>
          </section>
          {fieldsErrors.difficulty && (
            <small className="add-quest__difficulty--error">{fieldsErrors.difficulty}</small>
          )}
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
