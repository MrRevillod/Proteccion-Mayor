import React from "react"

import { api, IMAGE_BASE_URL } from "@/lib/axios"
import { Dispatch, SetStateAction } from "react"
import { LoginFormData, Nullable, User, UserRole } from "@/lib/types"
import { createContext, ReactNode, useEffect, useState } from "react"

// Contexto para manejar la autenticación de los usuarios
// Se utiliza un contexto ya que la autenticación es necesaria
// en toda la aplicación web

interface AuthContextType {
	isAuthenticated: boolean
	user: User | null
	loading: boolean
	error: string | null
	role: Nullable<UserRole>
	login: (credentials: LoginFormData) => Promise<void>
	logout: () => Promise<void>
	refreshToken: () => Promise<void>
	setUser: Dispatch<SetStateAction<User | null>>
	profilePicture: string | null
	setProfilePicture: Dispatch<SetStateAction<string | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// isAuthenticated: Indica si el usuario está autenticado o no
// user: Datos del usuario autenticado
// loading: Indica si la petición está en proceso
// error: Mensaje de error en caso de que ocurra un error
// role: Rol del usuario autenticado

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [role, setRole] = useState<Nullable<UserRole>>(null)
	const [profilePicture, setProfilePicture] = useState<string | null>("")

	// login: Función para iniciar sesión en la aplicación
	const login = async (credentials: LoginFormData) => {
		setLoading(true)

		try {
			const response = await api.post(`/auth/login?variant=${credentials.role}`, {
				email: credentials.email,
				password: credentials.password,
			})

			const res = response.data.values

			setUser(res.user)
			setIsAuthenticated(true)
			setError(null)
			setRole(res.role)

			// Se actualiza la imagen de perfil del usuario
			setProfilePicture(`${IMAGE_BASE_URL}/users/${res.user.id}/${res.user.id}.webp`)

			// Se almacena el token de autenticación en el localStorage
			// para utilizarlo en caso de cerrar sesión y mantener
			// la selección de ocupación en el formulario de inicio de sesión

			localStorage.setItem("role", res.role)
		} catch (error: any) {
			setError(error.response?.data?.message || "Error al iniciar sesión")
			setRole(null)
			setUser(null)
			setIsAuthenticated(false)
		} finally {
			setLoading(false)
		}
	}

	// logout: Función para cerrar sesión en la aplicación
	const logout = async () => {
		setLoading(true)

		await api.post("/auth/logout")

		setIsAuthenticated(false)
		setUser(null)
		setRole(null)

		setLoading(false)
	}

	// checkAuth: Función para validar la autenticación del usuario
	const checkAuth = async () => {
		setLoading(true)

		try {
			const response = await api.get("/auth/validate-auth")
			const res = response.data.values
			setIsAuthenticated(true)
			setUser(res.user)
			setRole(res.role)
			setProfilePicture(`${IMAGE_BASE_URL}/users/${res.user.id}/${res.user.id}.webp`)
		} catch (error) {
			setUser(null)
			setIsAuthenticated(false)
			setRole(null)
		}

		setLoading(false)
	}

	// refreshToken: Función para refrescar el token de autenticación
	const refreshToken = async () => {
		try {
			const response = await api.get("/auth/refresh")
			setRole(response.data.values.role)
			setIsAuthenticated(true)
		} catch (error) {
			setUser(null)
			setRole(null)
			setIsAuthenticated(false)
		}
	}

	useEffect(() => {
		checkAuth()
	}, [])

	return (
		<AuthContext.Provider
			value={{
				role,
				user,
				setUser,
				login,
				error,
				logout,
				refreshToken,
				loading,
				isAuthenticated,
				profilePicture,
				setProfilePicture,
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
