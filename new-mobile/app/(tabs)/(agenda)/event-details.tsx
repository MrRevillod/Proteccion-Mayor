import React from "react"
import dayjs from "dayjs"

import { Event } from "@/lib/types"
import { Button } from "@/components/Button"
import { useState } from "react"
import { useAlert } from "@/context/AlertContext"
import { EventCard } from "@/components/EventCard"
import { useMutation } from "@/hooks/useMutation"
import { primaryGreen } from "@/constants/Colors"
import { LoadingIndicator } from "@/components/Loading"
import { StyleSheet, View } from "react-native"
import { cancelReservation } from "@/lib/actions"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import { useLocalSearchParams, useRouter } from "expo-router"

const EventTab = () => {
	useProtectedRoute()

	const { alert } = useAlert()

	const router = useRouter()
	const params = useLocalSearchParams()

	const [event, setEvent] = useState<Event | null>(
		params.event ? JSON.parse(params.event as string) : null,
	)

	const { loading: mutationLoading, mutate } = useMutation({ mutateFn: cancelReservation })

	const handleConfirmCancel = () => {
		alert({
			title: "Cancelar cita",
			message: "¿Estás seguro de que deseas cancelar esta cita?",
			variant: "confirmCancel",
			onConfirm: handleCancel,
		})
	}

	const handleCancel = async () => {
		await mutate({
			params: { id: event?.id },
			onSuccess: () => {
				router.replace({
					pathname: "/(tabs)/(agenda)/cancel-status",
					params: { status: "success" },
				})
			},
			onError: () => {
				router.replace({
					pathname: "/(tabs)/(agenda)/cancel-status",
					params: { status: "error" },
				})
			},
		})
	}

	return (
		<View style={styles.overlay}>
			<View style={styles.alertBox}>
				{event && <EventCard event={event} />}
				<View style={styles.buttons}>
					<Button
						text="Volver atrás"
						onPress={() => router.replace("/(tabs)/(agenda)")}
					/>
					{dayjs(event?.start).isAfter(dayjs()) && (
						<Button
							variant="delete"
							text="Cancelar cita"
							onPress={handleConfirmCancel}
							size="lg"
						/>
					)}
				</View>
			</View>

			{mutationLoading && (
				<View style={styles.loadingOverlay}>
					<LoadingIndicator color="white" />
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
