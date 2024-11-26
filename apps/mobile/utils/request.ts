import { getAccessToken, getRefreshToken, removeTokens, renewAccessAndTime } from "./storage"
import { isTokenExp } from "./validation"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { Alert } from "react-native"

export const SERVER_URL = `http://${process.env.EXPO_PUBLIC_SERVER_ADDRESS}`

export const makeAuthenticatedRequest = async (
	url: string,
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
	navigation?: any,
	showAlert: boolean = true,
	options: AxiosRequestConfig = {},
): Promise<AxiosResponse | null> => {
	try {
		let accessToken = await getAccessToken()
		const isExp = await isTokenExp()
		const refreshToken = await getRefreshToken()
		if (isExp && accessToken) {
			try {
				accessToken = await renewAccessToken()
			} catch (error) {
				Alert.alert("Error", "Su sesión ha expirado")
				removeTokens()
				navigation.navigate("Login")
			}
		}

		const headers = {
			...options.headers,
			Authorization: `Bearer ${accessToken},${refreshToken}`,
		}

		const response = await axios({
			url: url,
			method,
			...options,
			headers,
		})

		return response
	} catch (error: any) {
		if (!showAlert) {
			const errorMessage = error.response?.data?.message || error.message
			Alert.alert("Error", errorMessage)
			return null
		}
		removeTokens()
		navigation.navigate("Login")
		Alert.alert("Error", "Su sesión ha expirado")
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

		const bearer = `Bearer ${accessToken},${refreshToken}`

		const response = await axios.get(`${SERVER_URL}/api/auth/refresh`, {
			headers: { Authorization: bearer },
		})

		const { newAccessToken } = response.data.values

		await renewAccessAndTime(newAccessToken)

		return newAccessToken
	} catch (error) {
		removeTokens()
		throw error
	}
}
