import admin from 'firebase-admin'
import serviceAccount from './serviceAccountKey.json'

// ✅ Initialise Firebase Admin (assure-toi que tu as bien le SDK d'admin Firebase)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()
const auth = admin.auth()

/**
 * Supprime un utilisateur et toutes ses données associées.
 * @param userId L'UID de l'utilisateur à supprimer.
 */
const deleteUser = async (userId: string) => {
  console.log(`🛑 Suppression de l'utilisateur : ${userId}`)

  // ✅ Démarrer une transaction Firestore
  const batch = db.batch()

  try {
    // 🔥 1. Récupérer et supprimer toutes les quêtes de l'utilisateur
    console.log('🔄 Suppression des quêtes...')
    const questsSnapshot = await db.collection('quests').where('userId', '==', userId).get()
    questsSnapshot.forEach((doc) => batch.delete(doc.ref))
    console.log(`✅ ${questsSnapshot.size} quêtes supprimées`)

    // 🔥 2. Récupérer et supprimer toutes les catégories créées par l'utilisateur
    console.log('🔄 Suppression des catégories...')
    const categoriesSnapshot = await db.collection('categories').where('userId', '==', userId).get()
    categoriesSnapshot.forEach((doc) => batch.delete(doc.ref))
    console.log(`✅ ${categoriesSnapshot.size} catégories supprimées`)

    // 🔥 3. Supprimer le profil utilisateur Firestore
    console.log('🔄 Suppression du profil utilisateur...')
    const playerRef = db.collection('players').doc(userId)
    batch.delete(playerRef)
    console.log('✅ Profil utilisateur supprimé')

    // 🔥 4. Exécuter la transaction Firestore
    await batch.commit()
    console.log('✅ Toutes les données Firestore ont été supprimées')

    // 🔥 5. Supprimer l'utilisateur de Firebase Auth
    console.log('🔄 Suppression du compte Firebase Auth...')
    await auth.deleteUser(userId)
    console.log(`✅ Compte Firebase Auth supprimé pour l'utilisateur : ${userId}`)

    console.log('🎉 Suppression complète réussie !')
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error)
    throw new Error('Échec de la suppression complète. Rien n’a été supprimé.')
  }
}

// ✅ Récupération de l'UID depuis la ligne de commande
const args = process.argv.slice(2)
if (!args[0]) {
  console.error('❌ Merci de spécifier un UID utilisateur.')
  process.exit(1)
}

deleteUser(args[0])
