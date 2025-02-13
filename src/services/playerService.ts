//src/services/playerService.ts
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'

import { db } from '@src/firebase/firebase'
import type { Player } from '@src/types/player'

const PLAYERS_DOC_NAME = 'players'
let lastPlayerSnapshot: Player | null = null

export const createPlayer = async (player: Player) => {
  const playerRef = doc(db, PLAYERS_DOC_NAME, player.uid)
  await setDoc(playerRef, player)
}

export const getPlayer = async (uid: string): Promise<Player | null> => {
  const playerRef = doc(db, PLAYERS_DOC_NAME, uid)
  const playerSnap = await getDoc(playerRef)

  if (playerSnap.exists()) {
    return playerSnap.data() as Player
  } else {
    return null
  }
}

export const updatePlayer = async (uid: string, updates: Partial<Player>) => {
  const playerRef = doc(db, PLAYERS_DOC_NAME, uid)
  await updateDoc(playerRef, updates)
}

export const listenToPlayer = (
  uid: string,
  callback: (player: Player | null) => void,
  onError?: (error: string) => void
) => {
  if (!uid) return () => {}

  const playerRef = doc(db, PLAYERS_DOC_NAME, uid)

  return onSnapshot(
    playerRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const newPlayer = snapshot.data() as Player

        if (
          lastPlayerSnapshot &&
          lastPlayerSnapshot.xp === newPlayer.xp &&
          lastPlayerSnapshot.level === newPlayer.level
        ) {
          return
        }

        lastPlayerSnapshot = newPlayer
        callback(newPlayer)
      } else {
        callback(null)
      }
    },
    (error) => {
      console.error('Erreur Firestore:', error)
      onError?.('Impossible de récupérer les données du joueur.')
    }
  )
}
