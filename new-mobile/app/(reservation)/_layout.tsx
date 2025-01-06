import { Stack } from "expo-router"

const ReservationLayout = () => {
	return (
		<Stack screenOptions={{ gestureEnabled: false, headerShown: false }}>
			<Stack.Screen name="centers" />
			<Stack.Screen name="calendar" />
			<Stack.Screen name="events" />
			<Stack.Screen name="confirm" />
			<Stack.Screen name="final" />
		</Stack>
	)
}

export default ReservationLayout
