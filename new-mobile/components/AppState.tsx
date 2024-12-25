import { useAuth } from "@/context/AuthContext"
import { useEffect, useRef } from "react"
import { AppState, AppStateStatus } from "react-native"

const AppStateHandler = () => {
	const auth = useAuth()
	const appState = useRef(AppState.currentState)

	useEffect(() => {
		const handleAppStateChange = (nextAppState: AppStateStatus) => {
			const isBackground = nextAppState === "background" || nextAppState === "inactive"

			if (appState.current === "active" && isBackground) {
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

export default AppStateHandler
