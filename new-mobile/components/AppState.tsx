import { eventEmitter } from "@/lib/events"
import { useSegments } from "expo-router"
import { useEffect, useRef } from "react"
import { AppState, AppStateStatus } from "react-native"

export const AppStateHandler = () => {
	const appState = useRef(AppState.currentState)
	const segments = useSegments()

	const unprotecedRoutes = ["/login", "/expired", "/(register)"]

	useEffect(() => {
		const handleAppStateChange = (nextAppState: AppStateStatus) => {
			if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
				eventEmitter.emit("close-app")
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
