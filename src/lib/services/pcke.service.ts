import { createHash } from 'crypto'

const pkceMap = new Map<string, string>()

export const storePkce = (codeVerifier: string) => {
    pkceMap.set(codeVerifier, codeVerifier)
}

export const getCodeVerifier = (codeVerifier: string) => {
    return pkceMap.get(codeVerifier)
}

export const validateChallenge = async (codeVerifier: string) => {
    return pkceMap.has(codeVerifier)
}