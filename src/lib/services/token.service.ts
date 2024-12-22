import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { db } from '../db'

const codeMap = new Map<string, { code: string, iat: Date }>()

export const storeCode = async (code: string) => {
    await db.upsert({ id: code, data: { code, iat: new Date() } })
}

export const validCode = async (code: string) => {
    const codeData = await db.getById<{ code: string, iat: string }>(code)
    if (!codeData) {
        return false
    }

    console.log(codeData, 'codeData')

    const iatDate = new Date(codeData.iat)
    const now = Date.now()
    return now - iatDate.getTime() < 60 * 5 * 1000
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
    auth_time?: number,
    nonce?: string
}
type IdTokenHeader = {
    alg: 'RS256',
    typ: 'JWT'
}

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});
export const generateIdToken = (payload: IdTokenPayload, header: IdTokenHeader = { alg: 'RS256', typ: 'JWT' }) => {

    return jwt.sign(payload, privateKey, { algorithm: 'RS256', header })
}