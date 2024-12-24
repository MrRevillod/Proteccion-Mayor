import React from "react"

import { Button } from "@/components/Button"
import { useMutation } from "@/hooks/useMutation"
import { primaryGreen } from "@/constants/Colors"
import { reservateEvent } from "@/lib/actions"
import { MultiStepProgressBar } from "@/components/ProgressBar"
import { StyleSheet, Text, View } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"

const ConfirmEventScreen = () => {
	const router = useRouter()
	const params = useLocalSearchParams()
	const event = JSON.parse(params.event as string)

	const { loading, mutate } = useMutation({
		mutateFn: reservateEvent,
	})

	const handleConfirm = async () => {
		await mutate({
			params: { id: event.id },
			onSuccess: () => {},
		})
	}

	return (
		<View style={styles.container}>
			<View style={{ ...styles.dataContainer, paddingHorizontal: 15, marginTop: "12%" }}>
				<MultiStepProgressBar currentStep={5} nSteps={5} />
			</View>
			<View style={{ ...styles.dataContainer, padding: 15, height: "80%" }}>
				<View style={{ paddingVertical: 5 }}>
					<Text style={{ fontSize: 20, fontWeight: "500", marginBottom: 15 }}>
						Horas de atención disponibles:
					</Text>
					<Text>
						Seleccione la hora de atención que prefiera para continuar con la solicitud
						de su cita.
					</Text>
				</View>
				<View style={styles.buttonsContainer}>
					<Button
						text="Volver"
						onPress={() => router.back()}
						variant="tertiary"
						size="md"
					/>
					<Button text="" onPress={() => handleConfirm()} variant="primary" size="md" />
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		width: "100%",
		padding: 15,
		gap: "2%",
		backgroundColor: primaryGreen,
		height: "100%",
	},
	dataContainer: {
		borderRadius: 15,
		backgroundColor: "white",
		width: "100%",
		gap: 15,
	},
	flatList: {
		width: "100%",
		gap: 15,
		marginTop: 10,
		flexDirection: "column",
	},
	buttonsContainer: {
		flexDirection: "column",
		justifyContent: "space-between",
		width: "100%",
		gap: 15,
	},
})

export default ConfirmEventScreen
