const stateMap = new Map<string, string>()

export const storeState = (state: string) => {
    stateMap.set(state, state)
}

export const getState = (state: string) => {
    return stateMap.get(state)
}