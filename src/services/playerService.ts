//src/services/playerService.ts
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'

import { db } from '@src/firebase/firebase'
import type { Player } from '@src/types/player'

const PLAYERS_DOC_NAME = 'players'

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
  // eslint-disable-next-line no-unused-vars
  callback: (player: Player | null) => void,
  // eslint-disable-next-line no-unused-vars
  onError?: (error: string) => void
) => {
  const playerRef = doc(db, PLAYERS_DOC_NAME, uid)

  return onSnapshot(
    playerRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as Player)
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
