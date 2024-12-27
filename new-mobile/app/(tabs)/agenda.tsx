import dayjs from "dayjs"

import { Event } from "@/lib/types"
import { Button } from "@/components/Button"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { useAlert } from "@/context/AlertContext"
import { EventCard } from "@/components/EventCard"
import { useRequest } from "@/hooks/useRequest"
import { useMutation } from "@/hooks/useMutation"
import { SelectableItem } from "@/components/SelectableItem"
import { LoadingIndicator } from "@/components/Loading"
import { cancelReservation, getEvents } from "@/lib/actions"
import { StyleSheet, View, Text, FlatList, Modal } from "react-native"

const AgendaTab = () => {
	const { user } = useAuth()
	const { alert } = useAlert()

	const { data, refetch } = useRequest<{ formatted: Event[] }>({
		action: getEvents,
		query: `seniorId=${user?.id}`,
	})

	const [isModalVisible, setModalVisible] = useState(false)
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

	const { loading: mutationLoading, mutate } = useMutation({ mutateFn: cancelReservation })

	const handleEventPress = (event: Event) => {
		setSelectedEvent(event)
		setModalVisible(true)
	}

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
			params: { id: selectedEvent?.id },
			onSuccess: () => {
				alert({
					title: "Cita cancelada",
					message: "La cita ha sido cancelada correctamente.",
					variant: "simple",
					onConfirm: () => {
						setModalVisible(false)
						refetch()
					},
				})
			},
			onError: () => {
				alert({
					title: "Error",
					message: "Ha ocurrido un error al cancelar la cita.",
					variant: "simple",
					onConfirm: () => {
						setModalVisible(false)
						refetch()
					},
				})
			},
		})
	}

	return (
		<>
			<View style={styles.container}>
				<View style={styles.head}>
					<Text style={styles.text}>
						En esta sección podrás ver una lista de citas en las que has reservado y
						asistido.
					</Text>
					<Text style={styles.text}>
						Presiona sobre una para ver más detalles o cancelar una cita agendada.
					</Text>
				</View>

				{data?.formatted.length === 0 ? (
					<View style={{ alignItems: "center", justifyContent: "center", height: "70%" }}>
						<Text style={{ fontSize: 16, fontWeight: "semibold" }}>
							No tienes citas agendadas.
						</Text>
					</View>
				) : (
					<FlatList
						data={data?.formatted}
						numColumns={1}
						style={styles.flatList}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => (
							<SelectableItem
								title={item?.service?.name ?? "Servicio no encontrado"}
								subtitle={dayjs(item.start).format("DD/MM/YYYY - HH:mm A")}
								imageUri={`/services/${item.service?.id}.webp`}
								onPress={() => handleEventPress(item)}
							/>
						)}
					/>
				)}
			</View>

			<Modal transparent animationType="fade" visible={isModalVisible}>
				<View style={modalStyles.overlay}>
					<View style={modalStyles.alertBox}>
						{selectedEvent && <EventCard event={selectedEvent} />}
						<View style={modalStyles.buttons}>
							<Button text="Volver atrás" onPress={() => setModalVisible(false)} />
							{dayjs(selectedEvent?.start).isAfter(dayjs()) && (
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
			</Modal>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		margin: 15,
		borderRadius: 15,
		padding: 20,
		backgroundColor: "white",
		gap: "5%",
	},
	flatList: {
		width: "100%",
		borderRadius: 15,
	},
	contentContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	column: {
		marginVertical: 5,
		justifyContent: "space-between",
		gap: 15,
	},
	head: {
		width: "100%",
		gap: 15,
	},
	text: {
		fontWeight: "semibold",
		fontSize: 16,
	},
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
	},
})

const modalStyles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	alertBox: {
		height: "70%",
		width: "90%",
		backgroundColor: "white",
		borderRadius: 10,
		padding: 15,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		gap: 15,
	},
	buttons: {
		gap: 10,
		width: "100%",
		marginBottom: "-5%",
	},
})

export default AgendaTab
