import React from "react"

import { api } from "@/lib/http"
import { Dispatch, SetStateAction } from "react"
import { createContext, ReactNode, useEffect, useState } from "react"
import { deleteSecureStore, setSecureStore } from "@/lib/secureStore"

interface AuthContextType {
    isAuthenticated: boolean
    user: any | null
    loading: boolean
    error: string | null
    login: (credentials: any, onSuccess: () => void) => Promise<void>
    logout: () => Promise<void>
    refreshSession: () => Promise<void>
    setUser: Dispatch<SetStateAction<any | null>>
    accessToken: string | null
    refreshToken: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [refreshToken, setRefreshToken] = useState<string | null>(null)

    const login = async (credentials: any, onSuccess: Function) => {
        setLoading(true)

        try {
            const response = await api.post("/auth/login-senior", {
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
            setError(error.response?.data?.message || "Error al iniciar sesión")
            setUser(null)
            setIsAuthenticated(false)
            console.log("Error:", error)
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        setLoading(true)

        await api.post("/auth/logout")

        Promise.all([
            deleteSecureStore("rut"),
            deleteSecureStore("accessToken"),
            deleteSecureStore("refreshToken"),
        ])

        setIsAuthenticated(false)
        setUser(null)

        setLoading(false)
    }

    const checkAuth = async () => {
        setLoading(true)

        try {
            await api.get("/auth/validate-auth")
            setIsAuthenticated(true)
        } catch (error) {
            setUser(null)
            setIsAuthenticated(false)
        }

        setLoading(false)
    }

    const refreshSession = async () => {
        try {
            await api.get("/auth/refresh")
            setIsAuthenticated(true)
        } catch (error) {
            setUser(null)
            setIsAuthenticated(false)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login,
                error,
                logout,
                refreshToken,
                loading,
                isAuthenticated,
                accessToken,
                refreshSession,
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
