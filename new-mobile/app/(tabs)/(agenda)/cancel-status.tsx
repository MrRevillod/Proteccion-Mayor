import React from "react"

import { Text } from "@/components/Text"
import { FontAwesome } from "@expo/vector-icons"
import { primaryGreen } from "@/constants/Colors"
import { StyleSheet, View } from "react-native"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import { useLocalSearchParams } from "expo-router"

const EventTab = () => {
	useProtectedRoute()

	const params = useLocalSearchParams()
	const status = params.status as string

	return (
		<View style={styles.overlay}>
			{status === "success" && (
				<View style={styles.messageContainer}>
					<FontAwesome name="check-circle" size={100} color={primaryGreen} />
					<Text style={styles.successText}>¡Reserva cancelada con éxito!</Text>
				</View>
			)}

			{status === "error" && (
				<View style={styles.messageContainer}>
					<FontAwesome name="times-circle" size={100} color="red" />
					<Text style={styles.errorText}>Error al cancelar la reserva.</Text>
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
	},
	overlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 15,
	},
	alertBox: {
		backgroundColor: "white",
		borderRadius: 10,
		padding: 15,
		alignItems: "center",
		justifyContent: "center",
		gap: 20,
		width: "100%",
		height: "100%",
	},
	buttons: {
		gap: 10,
		width: "100%",
		marginBottom: "-5%",
	},
	messageContainer: {
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	successText: {
		fontSize: 18,
		color: primaryGreen,
		marginTop: 10,
		textAlign: "center",
	},
	errorText: {
		fontSize: 18,
		color: "red",
		marginTop: 10,
		textAlign: "center",
	},
})

export default EventTab
