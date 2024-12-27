import dayjs from "dayjs"

import { Event } from "@/lib/types"
import { useState } from "react"
import { useAlert } from "@/context/AlertContext"
import { useRequest } from "@/hooks/useRequest"
import { SelectableItem } from "@/components/SelectableItem"
import { getEventsByDate } from "@/lib/actions"
import { ReservationStep } from "@/components/ReservationStep"
import { FlatList, StyleSheet, View } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"

const EventSelectionScreen = () => {
	const router = useRouter()
	const { alert } = useAlert()
	const { date, centerId, serviceId } = useLocalSearchParams()
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

	const { data, loading } = useRequest<Event[]>({
		action: getEventsByDate,
		query: `date=${date}&centerId=${centerId}&serviceId=${serviceId}`,
	})

	const handleSelectEvent = () => {
		if (!selectedEvent) {
			return alert({
				variant: "simple",
				title: "Ups!",
				message: "Debes seleccionar una hora de atención para continuar.",
			})
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
					<SelectableItem
						key={item.id}
						title={`${dayjs(item.start).format("HH:mm A")} - ${dayjs(item.end).format(
							"HH:mm A"
						)}`}
						subtitle={dayjs(item.start).format("DD/MM/YYYY")}
						onPress={() => setSelectedEvent(item)}
						selected={selectedEvent?.id === item.id}
						imageUri={`/services/${item.service?.id}.webp`}
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
