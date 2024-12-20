import jwt from 'jsonwebtoken'

const codeMap = new Map<string, { code: string, iat: Date }>()

export const storeCode = (code: string) => {
    codeMap.set(code, { code, iat: new Date() })
}

export const validCode = (code: string) => {
    const codeData = codeMap.get(code)
    if (!codeData) {
        return false
    }

    const now = Date.now()
    return now - codeData.iat.getTime() < 60 * 5 * 1000
}

export const deleteCode = (code: string) => {
    codeMap.delete(code)
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
    nonce: string
}
type IdTokenHeader = {
    alg: 'RS256',
    typ: 'JWT'
}

export const generateIdToken = (payload: IdTokenPayload, header: IdTokenHeader = { alg: 'RS256', typ: 'JWT' }) => {
    return jwt.sign(payload, 'test-secret', { algorithm: 'RS256', header })
}