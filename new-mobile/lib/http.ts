import { useAuth } from "@/context/AuthContext"
import axios from "axios"
import { getSecureStore } from "./secureStore"

export const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_BASE_URL

export const API_BASE_URL = `${SERVER_URL}/api`
export const SENIOR_IMAGE_BASE_URL = `${API_BASE_URL}/storage/public/seniors`
export const DEFAULT_PROFILE_PICTURE = `${API_BASE_URL}/storage/public/users/default-profile.webp`

export const RESET_PASSWORD_URL = `${SERVER_URL}/auth/restaurar-contrasena?variant=mobile`

export const api = axios.create({
	baseURL: API_BASE_URL,
})

export const getContentType = (body: any) => {
	return body instanceof FormData ? "multipart/form-data" : "application/json"
}

const getClientAuthorization = async () => {
	const [access, refresh] = await Promise.all([getSecureStore("accessToken"), getSecureStore("refreshToken")])
	return `Bearer ${access},${refresh}`
}

api.interceptors.request.use(
	async (config) => {
		config.headers.setAuthorization(await getClientAuthorization())
		return config
	},
	(error) => {
		return Promise.reject(error)
	},
)
