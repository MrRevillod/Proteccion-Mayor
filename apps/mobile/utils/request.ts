import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry"
import { getAccessToken, getRefreshToken, replaceAccessToken, storeTokens } from "./storage"
import { isTokenExp } from "./validation"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { SERVER_URL } from "@/constants/colors"
import { Alert } from "react-native"
import { AuthResponse } from "./types"
import { useAuth } from "@/contexts/authContext"

export const makeAuthenticatedRequest = async (
	url: string,
	method: "GET" | "POST" | "PUT" | "DELETE",
	showAlert: boolean = true,
	options: AxiosRequestConfig = {},
): Promise<AxiosResponse | null> => {
	try {
		let accessToken = await getAccessToken()
		const isExp = await isTokenExp()
		const refreshToken = await getRefreshToken()

		// Si el token ha expirado, intentamos renovarlo
		if (isExp && accessToken) {
			try {
				accessToken = await renewAccessToken()
			} catch (error) {
				throw new Error("No se pudo renovar el token. Necesita autenticarse nuevamente.")
			}
		}

		// Verifica si aún está en proceso de carga o los tokens no están disponibles
		if (!accessToken && !refreshToken) {
			throw new Error("Tokens no disponibles, el usuario necesita autenticarse de nuevo")
		}

		const headers = {
			...options.headers,
			Authorization: `Bearer ${accessToken}, Bearer ${refreshToken}`,
		}

		const response = await axios({
			url: url,
			method,
			...options,
			headers,
		})

		return response
	} catch (error: any) {
		if (showAlert && error.response?.data?.message) {
			Alert.alert("Error", error.response.data.message)
		}
		console.error(error)
		return null
	}
}

export const checkUniqueField = async (field: string, getValues: any, trigger: any, setError: any): Promise<boolean | undefined> => {
	try {
		const fieldValue = getValues(field)
		const isValid = await trigger(field)
		if (isValid) {
			const response = await axios.post(`${SERVER_URL}/api/dashboard/seniors/check-unique`, { [field]: fieldValue })
			if (response.status === 200) {
				return true
			}
		}
	} catch (error: any) {
		if (error.response && error.response.status === 409) {
			const values = error.response.data.values
			if (field === "rut") {
				setError(field, {
					type: "manual",
					message: values.rut,
				})
			}
			if (field === "email") {
				setError(field, {
					type: "manual",
					message: values.email,
				})
			}
			return false
		}
	}
}

const renewAccessToken = async () => {
	try {
		const accessToken = await getAccessToken()
		const refreshToken = await getRefreshToken()
		if (!refreshToken) throw new Error("No hay refresh token disponible")

		const response = await axios.get(`${SERVER_URL}/api/auth/refresh`, {
			headers: { Authorization: `Bearer ${accessToken}, Bearer ${refreshToken}` },
		})
		const { newAccessToken } = response.data

		await replaceAccessToken(newAccessToken)

		return newAccessToken
	} catch (error) {
		console.error("Error al renovar el token", error)
		throw error
	}
}
