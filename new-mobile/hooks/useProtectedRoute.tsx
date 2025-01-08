import { router } from "expo-router"
import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react"

export const useProtectedRoute = () => {
	const { isAuthenticated, validateSession, isCheckingSession } = useAuth()

	useEffect(() => {
		if (!isCheckingSession) {
			validateSession()
			if (!isAuthenticated) router.replace("/login")
		}
	}, [isAuthenticated])
}
