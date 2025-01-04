import "react-native-reanimated"
import FontAwesome from "@expo/vector-icons/FontAwesome"

import * as SplashScreen from "expo-splash-screen"

import { Stack, useRouter } from "expo-router"
import { Header } from "@/components/Header"
import { useFonts } from "expo-font"
import { useEffect } from "react"
import { AuthProvider } from "@/context/AuthContext"
import { AlertProvider } from "@/context/AlertContext"
import { subscribeToEvent } from "@/lib/events"
export { ErrorBoundary } from "expo-router"

export const unstable_settings = {
	initialRouteName: "index",
}

SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
	const router = useRouter()

	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	})

	useEffect(() => {
		if (error) throw error
	}, [error])

	useEffect(() => {
		if (loaded) SplashScreen.hideAsync()
	}, [loaded])

	useEffect(() => {
		const unsubscribe = subscribeToEvent("unauthorized", () => {
			router.replace("/expired")
		})

		return () => {
			unsubscribe()
		}
	}, [router])

	return loaded ? <RootLayoutNav /> : null
}

const RootLayoutNav = () => {
	return (
		<AuthProvider>
			<AlertProvider>
				<Stack
					screenOptions={{
						gestureEnabled: false,
						header: ({ navigation }) => (
							<Header title="Protección Mayor" goBack={() => navigation.goBack()} />
						),
					}}
				>
					<Stack.Screen name="index" options={{ headerShown: false }} />
					<Stack.Screen name="expired" options={{ headerShown: false }} />
					<Stack.Screen name="login" />
					<Stack.Screen name="(register)" options={{ headerShown: false }} />
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen name="(reservation)" options={{ headerShown: false }} />
				</Stack>
			</AlertProvider>
		</AuthProvider>
	)
}

export default RootLayout
