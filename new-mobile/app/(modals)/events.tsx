import { Event } from "@/lib/types"
import { Button } from "@/components/Button"
import { useState } from "react"
import { getEvents } from "@/lib/actions"
import { EventCard } from "@/components/EventCard"
import { useRequest } from "@/hooks/useRequest"
import { primaryGreen } from "@/constants/Colors"
import { MultiStepProgressBar } from "@/components/ProgressBar"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Alert, FlatList, StyleSheet, Text, View } from "react-native"

const EventSelectionScreen = () => {
	const router = useRouter()
	const { date, centerId, serviceId } = useLocalSearchParams()
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

	const { data } = useRequest<Event[]>({
		action: getEvents,
		query: `date=${date}&centerId=${centerId}&serviceId=${serviceId}`,
	})

	const handleSelectEvent = () => {
		if (!selectedEvent) {
			return Alert.alert("Seleccione una hora de atención para continuar.")
		}
		router.push({
			pathname: "/(modals)/confirm",
			params: { eventId: selectedEvent.id.toString(), event: JSON.stringify(selectedEvent) },
		})
	}

	return (
		<View style={styles.container}>
			<View style={{ ...styles.dataContainer, paddingHorizontal: 15, marginTop: "12%" }}>
				<MultiStepProgressBar currentStep={4} nSteps={5} />
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

				<FlatList
					data={data ?? []}
					renderItem={({ item }) => (
						<EventCard
							key={item.id}
							event={item}
							onPress={() => setSelectedEvent(item)}
							isSelected={selectedEvent?.id === item.id}
						/>
					)}
					keyExtractor={(item) => item.id.toString()}
					numColumns={1}
					style={styles.flatList}
					ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
				/>
				<View style={styles.buttonsContainer}>
					<Button
						text="Volver"
						onPress={() => router.back()}
						variant="tertiary"
						size="md"
					/>
					<Button
						text="Continuar"
						onPress={() => handleSelectEvent()}
						variant="primary"
						size="md"
					/>
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
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		gap: 15,
	},
})

export default EventSelectionScreen
