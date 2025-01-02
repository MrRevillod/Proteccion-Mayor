import { router } from "expo-router"
import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react"

export const useProtectedRoute = () => {
	const { isAuthenticated, validateSession } = useAuth()

	useEffect(() => {
		validateSession()
		if (!isAuthenticated) router.replace("/login")
	}, [isAuthenticated])
}
