import jwt from 'jsonwebtoken'
import { db } from '../db'

const codeMap = new Map<string, { code: string, iat: Date }>()

export const storeCode = async (code: string) => {
    await db.upsert({ id: code, data: { code, iat: new Date() } })
}

export const validCode = async (code: string) => {
    const codeData = await db.getById<{ code: string, iat: Date }>(code)
    if (!codeData) {
        return false
    }

    const now = Date.now()
    return now - codeData.iat.getTime() < 60 * 5 * 1000
}

export const deleteCode = async (code: string) => {
    await db.delete(code)
}

export type IdTokenPayload = {
    iss: string,
    sub: string,
    name: string,
    email: string,
    iat: number,
    exp: number,
    aud: string,
    auth_time: number,
    nonce?: string
}
type IdTokenHeader = {
    alg: 'RS256',
    typ: 'JWT'
}

export const generateIdToken = (payload: IdTokenPayload, header: IdTokenHeader = { alg: 'RS256', typ: 'JWT' }) => {
    return jwt.sign(payload, 'test-secret', { algorithm: 'RS256', header })
}