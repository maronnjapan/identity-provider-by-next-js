import { db } from '../db'

const pkceMap = new Map<string, string>()

export const storePkce = async (codeVerifier: string) => {
    await db.upsert({ id: codeVerifier, data: codeVerifier })
}

export const getCodeVerifier = async (codeVerifier: string) => {
    return await db.getById<string>(codeVerifier)
}

export const validateChallenge = async (codeVerifier: string) => {
    return !!await db.getById<string>(codeVerifier)
}