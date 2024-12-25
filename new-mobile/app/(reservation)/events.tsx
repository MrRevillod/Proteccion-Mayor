import { Event } from "@/lib/types"
import { useState } from "react"
import { getEvents } from "@/lib/actions"
import { EventCard } from "@/components/EventCard"
import { useRequest } from "@/hooks/useRequest"
import { ReservationStep } from "@/components/ReservationStep"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Alert, FlatList, StyleSheet, View } from "react-native"

const EventSelectionScreen = () => {
	const router = useRouter()
	const { date, centerId, serviceId } = useLocalSearchParams()
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

	const { data, loading } = useRequest<Event[]>({
		action: getEvents,
		query: `date=${date}&centerId=${centerId}&serviceId=${serviceId}`,
	})

	const handleSelectEvent = () => {
		if (!selectedEvent) {
			return Alert.alert("Seleccione una hora de atención para continuar.")
		}

		router.push({
			pathname: "/(reservation)/confirm",
			params: { eventId: selectedEvent.id.toString(), event: JSON.stringify(selectedEvent) },
		})
	}

	return (
		<ReservationStep
			continueHandler={() => handleSelectEvent()}
			currentStep={4}
			title="Horas de atención disponibles:"
			description="Seleccione la hora de atención que prefiera para continuar con la solicitud de su cita."
			loading={loading}
		>
			<FlatList
				data={data ?? []}
				numColumns={1}
				style={styles.flatList}
				ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<EventCard
						key={item.id}
						event={item}
						onPress={() => setSelectedEvent(item)}
						isSelected={selectedEvent?.id === item.id}
					/>
				)}
			/>
		</ReservationStep>
	)
}

const styles = StyleSheet.create({
	flatList: {
		width: "100%",
		height: "62%",
	},
})

export default EventSelectionScreen
