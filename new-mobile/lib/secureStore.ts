import * as store from "expo-secure-store"

export const getSecureStore = async (key: string) => {
    return await store.getItemAsync(key)
}

export const setSecureStore = async (key: string, value: string) => {
    return await store.setItemAsync(key, value)
}

export const deleteSecureStore = async (key: string) => {
    return await store.deleteItemAsync(key)
}
