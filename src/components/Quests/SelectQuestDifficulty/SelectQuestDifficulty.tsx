import classNames from 'classnames'
import React from 'react'

import { QUEST_DIFFICULTY, QuestDifficulty } from '@src/types/quest'

import './SelectQuestDifficulty.scss'

interface SelectQuestDifficultyProps {
  difficulty: QuestDifficulty
  // eslint-disable-next-line no-unused-vars
  handleDifficulty: (difficulty: QuestDifficulty) => void
  error?: string
}

const SelectQuestDifficulty: React.FC<SelectQuestDifficultyProps> = ({
  difficulty,
  handleDifficulty,
  error,
}) => {
  return (
    <section className="select-quest-difficulty">
      <p className="select-quest-difficulty__label">Difficulté</p>
      <section className="select-quest-difficulty__line">
        <button
          type="button"
          className={classNames('select-quest-difficulty__easy ', {
            selected: difficulty === QUEST_DIFFICULTY.EASY,
          })}
          onClick={() => handleDifficulty(QUEST_DIFFICULTY.EASY)}>
          Facile
        </button>
        <button
          type="button"
          className={classNames('select-quest-difficulty__medium ', {
            selected: difficulty === QUEST_DIFFICULTY.MEDIUM,
          })}
          onClick={() => handleDifficulty(QUEST_DIFFICULTY.MEDIUM)}>
          Moyen
        </button>
      </section>
      <section className="select-quest-difficulty__line">
        <button
          type="button"
          className={classNames('select-quest-difficulty__difficult ', {
            selected: difficulty === QUEST_DIFFICULTY.DIFFICULT,
          })}
          onClick={() => handleDifficulty(QUEST_DIFFICULTY.DIFFICULT)}>
          Difficile
        </button>
        <button
          type="button"
          className={classNames('select-quest-difficulty__hard ', {
            selected: difficulty === QUEST_DIFFICULTY.HARD,
          })}
          onClick={() => handleDifficulty(QUEST_DIFFICULTY.HARD)}>
          Epique
        </button>
      </section>
      {error && <small className="select-quest-difficulty__error">{error}</small>}
    </section>
  )
}

export default SelectQuestDifficulty
