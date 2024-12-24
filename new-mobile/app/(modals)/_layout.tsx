import { Stack } from "expo-router"

const ModalLayout = () => {
	return (
		<Stack screenOptions={{ gestureEnabled: false, headerShown: false }}>
			<Stack.Screen name="centers" />
			<Stack.Screen name="calendar" />
			<Stack.Screen name="events" />
			<Stack.Screen name="confirm" />
		</Stack>
	)
}

export default ModalLayout
