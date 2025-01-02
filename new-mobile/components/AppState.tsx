import { useAuth } from "@/context/AuthContext"
import { useEffect, useRef } from "react"
import { AppState, AppStateStatus } from "react-native"

export const AppStateHandler = () => {
	const auth = useAuth()
	const appState = useRef(AppState.currentState)

	useEffect(() => {
		const handleAppStateChange = (nextAppState: AppStateStatus) => {
			if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
				auth.logout()
			}

			appState.current = nextAppState
		}

		const subscription = AppState.addEventListener("change", handleAppStateChange)

		return () => {
			subscription.remove()
		}
	}, [])

	return null
}
