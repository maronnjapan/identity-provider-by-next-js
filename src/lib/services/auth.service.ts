import { db } from "../db"

type Auth = { clientId: string, nonce?: string, isPublishIdToken: boolean, codeChallengeObj?: { code_challenge: string, code_challenge_method: 'S256' | 'plain' } }


export const storeAuth = async (key: string, value: Auth) => {
    await db.upsert({ id: key, data: value })
}
export const getAuth = async (key: string) => {
    return await db.getById<Auth>(key)
}

export const deleteAuth = async (key: string) => {
    await db.delete(key)
}