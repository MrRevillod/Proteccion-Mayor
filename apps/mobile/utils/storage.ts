import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"

export const expTime = process.env.TOKEN_EXPIRE_TIME || "14"
export const STORAGE_KEY = process.env.STORAGE_KEY_SECRET || "secret"

export const storeTokens = async (accessToken: string, refreshToken: string) => {
	try {
		const expirationTime = Date.now() + parseInt(expTime, 10) * 60 * 1000
		await AsyncStorage.setItem("accessToken", accessToken)
		await AsyncStorage.setItem("refreshToken", refreshToken)
		await AsyncStorage.setItem("expTime", JSON.stringify(expirationTime))
	} catch (error) {
		console.error("No se pudieron almacenar los tokens", error)
	}
}

export const replaceAccessToken = async (newAccessToken: string) => {
	await AsyncStorage.setItem("accessToken", newAccessToken)
}

export const getExpTime = async (): Promise<number | null> => {
	try {
		const expTime = await AsyncStorage.getItem("expTime")
		return expTime ? JSON.parse(expTime) : null
	} catch (error) {
		console.error("Error al obtener el tiempo de expiración", error)
		return null
	}
}

export const getAccessToken = async (): Promise<string | null> => {
	try {
		const token = await AsyncStorage.getItem("accessToken")
		return token || null
	} catch (error) {
		console.error("Error al obtener el access token", error)
		return null
	}
}

export const getRefreshToken = async (): Promise<string | null> => {
	try {
		const token = await AsyncStorage.getItem("refreshToken")
		return token || null
	} catch (error) {
		console.error("Error al obtener el refresh token", error)
		return null
	}
}

export const removeTokens = async () => {
	try {
		await AsyncStorage.removeItem("accessToken")
		await AsyncStorage.removeItem("refreshToken")
		console.log("Borrando tokens...")
	} catch (error) {
		console.error("No se pudieron eliminar los tokens", error)
	}
}

export const removeUser = async () => {
	try {
		await AsyncStorage.removeItem("user")
	} catch (error) {
		console.error("No se pudo eliminar el usuario", error)
	}
}

export const storeUser = async (user: object) => {
	try {
		if (!user) {
			throw new Error("El usuario no existe")
		}
		await AsyncStorage.setItem("user", JSON.stringify(user))
	} catch (error) {
		console.error("No se pudo almacenar el usuario", error)
	}
}

export const getStorageRUT = async (): Promise<string | null> => {
	try {
		const user = await AsyncStorage.getItem("user")
		if (user) {
			const parsedUser = JSON.parse(user)
			return parsedUser?.id ?? null
		}
		return null
	} catch (error) {
		console.error("Error al obtener el ID del usuario", error)
		return null
	}
}
