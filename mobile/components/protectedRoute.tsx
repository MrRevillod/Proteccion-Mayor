import React from "react"

import { useAuth } from "@/contexts/authContext"
import { useEffect } from "react"
import { View, ActivityIndicator } from "react-native"
import LoadingScreen from "./loadingScreen"

interface ProtectedRouteProps {
	children: React.ReactNode
	navigation: any
}

const ProtectedRoute = ({ children, navigation }: ProtectedRouteProps) => {
	const { isAuthenticated, loading } = useAuth()

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			navigation.navigate("Login")
		}
	}, [isAuthenticated, loading, navigation])

	if (loading) {
		return (
			<LoadingScreen />
		)
	}

	if (!isAuthenticated) {
		return null
	}

	return <>{children}</>
}

export default ProtectedRoute
