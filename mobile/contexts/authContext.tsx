import axios from "axios"

import { SERVER_URL } from "@/utils/request"
import { makeAuthenticatedRequest } from "@/utils/request"
import { loginSeniorFormData, User } from "@/utils/types"
import { ActivityIndicator, Alert, AppState, AppStateStatus, View, StyleSheet, Text } from "react-native"
import { storeTokens, storeUser, removeTokens, getExpTime, getAccessToken, getRefreshToken } from "@/utils/storage"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import Colors from "@/components/colors"
import LoadingScreen from "@/components/loadingScreen"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface authContextProps {
	isAuthenticated: boolean
	user: User | null
	role: "SENIOR" | null
	loading: boolean
	login: (credentials: loginSeniorFormData) => Promise<void>
	logout: () => void
}

const AuthContext = createContext<authContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
	const [user, setUser] = useState<User | null>(null)
	const [role, setRole] = useState<"SENIOR" | null>(null)
	const [loading, setLoading] = useState<boolean>(false)

	const login = async (credentials: loginSeniorFormData) => {
		setLoading(true)
		try {
			const response = await axios.post(`${SERVER_URL}/api/auth/login-senior`, credentials)
			const { values } = response.data
			const { accessToken, refreshToken, publicUser } = values

			if (response) {
				storeTokens(accessToken, refreshToken)
				setIsAuthenticated(true)
				storeUser(publicUser)
				setRole("SENIOR")
			}
		} catch (error: any) {
			error.response.data.message && Alert.alert("Error", error.response.data.message)
		}
		setLoading(false)
	}

	const logout = async () => {
		setLoading(true)
		await removeTokens()
		setIsAuthenticated(false)
		setUser(null)
		setRole(null)
		setLoading(false)
	}

	const checkAuth = async () => {
		try {
			// const response = await makeAuthenticatedRequest(`${SERVER_URL}/api/auth/validate-auth`, "GET", null, false)
			let accessToken = await getAccessToken()
			const refreshToken = await getRefreshToken()
			if (accessToken && refreshToken) {
				const response = await axios.get(`${SERVER_URL}/api/auth/validate-auth`, {
					headers: {
						Authorization: `Bearer ${accessToken},${refreshToken}`
					}
				})
				if (response) {
					setIsAuthenticated(true)
					setUser(response?.data.values.user)
					setRole(response?.data.values.role)
				}
			}
		} catch (error) {
			setUser(null)
			setRole(null)
			setIsAuthenticated(false)
		}
	}

	useEffect(() => {
		const handleAppStateChange = (nextAppState: AppStateStatus) => {
			if (nextAppState === "background" || nextAppState === "inactive") {
				logout()
			}
		}
		const subscription = AppState.addEventListener("change", handleAppStateChange)
		return () => {
			subscription.remove()
		}
	}, [])

	useEffect(() => {
		checkAuth()
	}, [])

	return (
		<AuthContext.Provider value={{ isAuthenticated, user, role, loading, login, logout }}>
			{loading && <LoadingScreen />}
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = (): authContextProps => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error("useAuth debe ser utilizado dentro de un AuthProvider")
	}
	return context
}

export default AuthContext
