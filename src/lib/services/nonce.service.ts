import { db } from "../db"

const nonceMap = new Map<string, string>()

export const storeNonce = async (nonce: string) => {
    await db.upsert({ id: nonce, data: nonce })
}

export const getNonce = async (nonce: string) => {
    return await db.getById<string>(nonce)
}