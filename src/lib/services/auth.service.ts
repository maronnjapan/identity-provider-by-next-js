const authMap = new Map<string, { clientId: string, nonce: string }>()

export const storeAuth = (key: string, value: { clientId: string, nonce: string }) => {
    authMap.set(key, { ...value })
}

export const getAuth = (key: string) => {
    return authMap.get(key)
}