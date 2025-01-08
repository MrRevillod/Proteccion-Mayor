import { useEffect, useRef, useState } from "react"
import { useRouter, useSegments } from "expo-router"
import { AppState, AppStateStatus } from "react-native"

import { useAuth } from "@/context/AuthContext"
import { eventEmitter, subscribeToEvent } from "@/lib/events"

export const AppStateHandler = () => {
	const appState = useRef(AppState.currentState)

	const auth = useAuth()
	const router = useRouter()
	const segments = useSegments()
	const unprotecedRoutes = ["/login", "/expired", "/(register)"]

	const SESSION_TIMEOUT = 1000 * 60 * 14

	const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null)

	useEffect(() => {
		const handleAppStateChange = (nextAppState: AppStateStatus) => {
			const isBg = appState.current === "active" && nextAppState.match(/inactive|background/)
			if (isBg && segments.some((segment) => !unprotecedRoutes.includes(segment))) {
				eventEmitter.emit("close-app")
			}

			appState.current = nextAppState
		}

		const subscription = AppState.addEventListener("change", handleAppStateChange)

		return () => {
			subscription.remove()
		}
	}, [])

	useEffect(() => {
		const unauthorized = subscribeToEvent("unauthorized", async () => {
			await auth.logout()
			return router.replace("/expired")
		})

		const closeApp = subscribeToEvent("close-app", async () => {
			if (sessionTimeout) {
				clearTimeout(sessionTimeout)
			}

			await auth.logout()
			return router.replace("/login")
		})

		const sessionExpired = subscribeToEvent("session-expired", async () => {
			await auth.logout()
			return router.replace("/expired")
		})

		const sessionStarted = subscribeToEvent("session-started", () => {
			const timeoutId = setTimeout(() => {
				eventEmitter.emit("session-expired")
			}, SESSION_TIMEOUT)

			setSessionTimeout(timeoutId)
		})

		return () => {
			unauthorized()
			closeApp()
			sessionExpired()
			sessionStarted()
		}
	}, [router])

	return null
}
