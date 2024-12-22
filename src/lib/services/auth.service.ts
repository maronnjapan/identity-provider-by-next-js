import { db } from "../db"

const authMap = new Map<string, { clientId: string, nonce?: string, codeChallengeObj?: { code_challenge: string, code_challenge_method: 'S256' | 'plain' } }>()

export const storeAuth = async (key: string, value: { clientId: string, nonce?: string, isPublishIdToken: boolean, codeChallengeObj?: { code_challenge: string, code_challenge_method: 'S256' | 'plain' } }) => {
    await db.upsert({ id: key, data: value })
}
export const getAuth = async (key: string) => {
    return await db.getById<{ clientId: string, nonce?: string, codeChallengeObj?: { code_challenge: string, code_challenge_method: 'S256' | 'plain' } }>(key)
}