const nonceMap = new Map<string, string>()

export const storeNonce = (nonce: string) => {
    nonceMap.set(nonce, nonce)
}

export const getNonce = (nonce: string) => {
    return nonceMap.get(nonce)
}