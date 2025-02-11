import React, { useEffect, useState } from 'react'

import CloseButton from '@components/CloseButton/CloseButton'
import InputText from '@components/Form/InputText/InputText'
import Select from '@components/Form/Select/Select'
import Loader from '@components/Loader/Loader'
import SelectQuestDifficulty from '@components/Quests/SelectQuestDifficulty/SelectQuestDifficulty'
import Status from '@components/Status/Status'
import { usePlayerData } from '@context/PlayerProvider'
import {
  validateQuestCategory,
  validateQuestDifficulty,
  validateQuestTitle,
  validateTimedQuest,
} from '@helpers/validationHelper'
import { getUserCategories } from '@services/categoryService'
import { addQuest } from '@services/questService'
import { QUEST_DIFFICULTY, QuestDifficulty } from '@src/types/quest'

import InputDuration from '@src/components/Form/InputDuration/InputDuration'
import Toggle from '@src/components/Form/Toggle/Toggle'
import './AddQuest.scss'

interface AddQuestProps {
  onClose: () => void
}

const AddQuest: React.FC<AddQuestProps> = ({ onClose }) => {
  const { player } = usePlayerData()

  const [title, setTitle] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [difficulty, setDifficulty] = useState<QuestDifficulty>(QUEST_DIFFICULTY.UNSET)
  const [isTimed, setIsTimed] = useState(false)
  const [duration, setDuration] = useState({ days: 0, hours: 0, minutes: 0 })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldsErrors, setFieldsErrors] = useState<{
    title?: string
    categoryName?: string
    difficulty?: string
    timed?: string
  }>({})
  const [categories, setCategories] = useState<string[]>([])

  const validateForm = () => {
    const titleValidation = validateQuestTitle(title)
    const categoryValidation = validateQuestCategory(categoryName)
    const difficultyValidation = validateQuestDifficulty(difficulty)
    const timedValidation = validateTimedQuest(isTimed, duration)

    const newErrors: {
      title?: string
      categoryName?: string
      difficulty?: string
      timed?: string
    } = {}

    if (!titleValidation.valid) newErrors.title = titleValidation.error
    if (!categoryValidation.valid) newErrors.categoryName = categoryValidation.error
    if (!difficultyValidation.valid) newErrors.difficulty = difficultyValidation.error
    if (!timedValidation.valid) newErrors.timed = timedValidation.error

    setFieldsErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setTitle('')
    setCategoryName('')
    setDifficulty(QUEST_DIFFICULTY.UNSET)
    setIsTimed(false)
    setDuration({ days: 0, hours: 0, minutes: 0 })
    setFieldsErrors({})
    setError('')
  }

  const handleDifficulty = (difficulty: QuestDifficulty) => {
    setDifficulty(difficulty)
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setError('')
    setLoading(true)
    try {
      if (player?.uid) {
        const newQuest = await addQuest(
          player.uid,
          title,
          categoryName,
          difficulty,
          isTimed,
          isTimed ? duration : undefined
        )
        if (newQuest) {
          handleClose()
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

  useEffect(() => {
    if (!player?.uid) return

    const fetchCategories = async () => {
      setLoading(true)
      const userCategories = await getUserCategories(player.uid)
      setCategories(userCategories.map((cat) => cat.categoryName))
      setLoading(false)
    }

    fetchCategories()
  }, [player?.uid])

  useEffect(() => {
    if (!isTimed) setDuration({ days: 0, hours: 0, minutes: 0 })
  }, [isTimed])

  return (
    <section className="add-quest">
      <CloseButton onClick={handleClose} />
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
          value={categoryName}
          error={fieldsErrors.categoryName}
          onChange={(e) => setCategoryName((e.target as HTMLInputElement).value)}
        />
        {categories.length > 0 && (
          <Select
            defaultOptionLabel="Catégories existantes"
            options={categories}
            value={categoryName}
            onChange={(value: string) => setCategoryName(value)}
          />
        )}
        <Toggle name="isTimed" checked={isTimed} onChange={setIsTimed} label="Quête chronométrée" />
        {isTimed && (
          <InputDuration value={duration} onChange={setDuration} error={fieldsErrors.timed} />
        )}
        <SelectQuestDifficulty
          difficulty={difficulty}
          handleDifficulty={handleDifficulty}
          error={fieldsErrors.difficulty}
        />
        {loading ? (
          <Loader />
        ) : (
          <button className="primary-button" type="submit">
            Créer
          </button>
        )}
      </form>
    </section>
  )
}

export default AddQuest
