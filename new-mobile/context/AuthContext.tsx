import React from "react"

import { api, httpClient } from "@/lib/http"
import { Dispatch, SetStateAction } from "react"
import { createContext, ReactNode, useState } from "react"
import { deleteSecureStore, setSecureStore } from "@/lib/secureStore"

interface AuthContextType {
	isAuthenticated: boolean
	user: any | null
	loading: boolean
	error: string | null
	setError: Dispatch<SetStateAction<string | null>>
	login: (credentials: any, onSuccess: () => void) => Promise<void>
	logout: () => Promise<void>
	setUser: Dispatch<SetStateAction<any | null>>
	accessToken: string | null
	refreshToken: string | null
	validateSession: () => Promise<void>
	isCheckingSession: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<any | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
	const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true)

	const [accessToken, setAccessToken] = useState<string | null>(null)
	const [refreshToken, setRefreshToken] = useState<string | null>(null)

	const login = async (credentials: any, onSuccess: Function) => {
		setLoading(true)

		try {
			const response = await httpClient.post("/auth/login-senior", {
				rut: credentials.rut,
				password: credentials.password,
			})

			const { accessToken, refreshToken, user } = response.data.values

			setAccessToken(accessToken)
			setRefreshToken(refreshToken)
			setUser(user)

			Promise.all([
				setSecureStore("rut", user.id),
				setSecureStore("accessToken", accessToken),
				setSecureStore("refreshToken", refreshToken),
			])

			setIsAuthenticated(true)
			setError(null)

			onSuccess()
		} catch (error: any) {
			console.log(error)
			setError(error.response?.data?.message || "Error al iniciar sesión")
			setUser(null)
			setIsAuthenticated(false)
		} finally {
			setLoading(false)
		}
	}

	const logout = async () => {
		setLoading(true)

		Promise.all([deleteSecureStore("accessToken"), deleteSecureStore("refreshToken")])

		setIsAuthenticated(false)
		setUser(null)

		setLoading(false)
	}

	const validateSession = async () => {

		setIsCheckingSession(true)

		try {
			await api.get("/auth/validate-auth")
			setIsAuthenticated(true)
		} catch (error) {
			await logout()
		} finally {
			setIsCheckingSession(false)
		}
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				login,
				error,
				setError,
				logout,
				refreshToken,
				loading,
				isAuthenticated,
				isCheckingSession,
				accessToken,
				validateSession,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

// Hook para consumir el contexto de autenticación

export const useAuth = () => {
	const context = React.useContext(AuthContext)

	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider")
	}

	return context
}
