import { db } from '../db'

const pkceMap = new Map<string, string>()

export const storePkce = async (codeChallenge: string) => {
    await db.upsert({ id: codeChallenge, data: codeChallenge })
}

export const validateChallenge = async (codeChallenge: string) => {
    return !!await db.getById<string>(codeChallenge)
}