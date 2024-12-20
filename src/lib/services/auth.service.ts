const authMap = new Map<string, { clientId: string, nonce?: string, codeChallengeObj?: { code_challenge: string, code_challenge_method: 'S256' | 'plain' } }>()

export const storeAuth = (key: string, value: { clientId: string, nonce?: string, codeChallengeObj?: { code_challenge: string, code_challenge_method: 'S256' | 'plain' } }) => {
    authMap.set(key, { ...value })
}

export const getAuth = (key: string) => {
    return authMap.get(key)
}