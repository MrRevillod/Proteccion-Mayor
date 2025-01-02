import React from "react"

import { Text } from "@/components/Text"
import { FontAwesome } from "@expo/vector-icons"
import { primaryGreen } from "@/constants/Colors"
import { ReservationStep } from "@/components/ReservationStep"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import { StyleSheet, View } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"

const FinalReservationScreen = () => {
	useProtectedRoute()

	const router = useRouter()
	const params = useLocalSearchParams<{ status: string; message: string }>()

	const handleGoHome = async () => {
		router.replace("/(tabs)/home")
	}

	const { status, message } = params

	const styles = StyleSheet.create({
		container: {
			justifyContent: "center",
			alignItems: "center",
			height: "62%",
			gap: "10%",
			paddingTop: "20%",
		},
		text: {
			fontSize: 16,
			fontWeight: "bold",
			textAlign: "center",
		},
	})

	return (
		<ReservationStep
			currentStep={5}
			goBackEnabled={false}
			continueText="Volver al inicio"
			continueHandler={() => handleGoHome()}
		>
			<View style={styles.container}>
				{status === "success" ? (
					<>
						<FontAwesome name="check-circle" size={100} color={primaryGreen} />
						<View style={{ alignItems: "center", gap: 10 }}>
							<Text style={styles.text}>¡Reserva realizada con éxito!.</Text>
							<Text style={{ fontSize: 14 }}>
								Recibirá un correo con la confirmación de su cita.
							</Text>
						</View>
					</>
				) : (
					<>
						<FontAwesome name="times-circle" size={100} color="red" />
						<View style={{ alignItems: "center", gap: 10 }}>
							<Text style={styles.text}>¡Ha ocurrido un error!.</Text>
							<Text style={{ fontSize: 14 }}>{message}</Text>
						</View>
					</>
				)}
			</View>
		</ReservationStep>
	)
}

export default FinalReservationScreen
