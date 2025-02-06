import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

import { db } from '@src/firebase/firebase'

const DOC_NAME = 'players'

interface Player {
  playerName: string
  email: string
  level: number
  uid: string
}

export const createPlayer = async (player: Player) => {
  const playerRef = doc(db, DOC_NAME, player.uid)
  await setDoc(playerRef, player)
}

export const getPlayer = async (uid: string): Promise<Player | null> => {
  const playerRef = doc(db, DOC_NAME, uid)
  const playerSnap = await getDoc(playerRef)

  if (playerSnap.exists()) {
    return playerSnap.data() as Player
  } else {
    return null
  }
}

export const updatePlayer = async (uid: string, updates: Partial<Player>) => {
  const playerRef = doc(db, DOC_NAME, uid)
  await updateDoc(playerRef, updates)
}
