const firebaseErrorMessages: Record<string, string> = {
  'auth/invalid-email': 'Email invalide',
  'auth/missing-password': 'Mot de passe requis',
  'auth/missing-email': 'Email requis',
  'auth/weak-password': 'Mot de passe faible',
  'auth/email-already-in-use': 'Email existante',
  'auth/invalid-credential': 'Email ou mot de passe incorrect',
}

export const getFirebaseErrorMessage = (code: string): string => {
  return firebaseErrorMessages[code] || 'Une erreur inconnue est survenue.'
}
