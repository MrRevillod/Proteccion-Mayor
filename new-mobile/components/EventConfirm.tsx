import React from "react"
import dayjs from "dayjs"

import { Event } from "@/lib/types"
import { API_BASE_URL } from "@/lib/http"
import { StyleSheet, Text, View, Image } from "react-native"

interface Props {
	event: Event
}

export const EventConfirm: React.FC<Props> = ({ event }) => {
	const startHour = dayjs(event.start).format("HH:mm A")
	const endHour = dayjs(event.end).format("HH:mm A")
	const centerImage = `${API_BASE_URL}/storage/public/centers/${event.center?.id}.webp`
	const serviceImage = `${API_BASE_URL}/storage/public/services/${event.service?.id}.webp`

	return (
		<View style={styles.container}>
			<Image source={{ uri: centerImage }} style={styles.centerImage} />
			<View style={styles.profileContainer}>
				<Image source={{ uri: serviceImage }} style={styles.serviceImage} />
			</View>
			<View style={styles.infoContainer}>
				<Text style={styles.label}>
					Servicio: <Text style={styles.value}>{event.service?.name}</Text>
				</Text>
				<Text style={styles.label}>
					Fecha:{" "}
					<Text style={styles.value}>{dayjs(event.start).format("DD / MM / YYYY")}</Text>
				</Text>
				<Text style={styles.label}>
					Hora:{" "}
					<Text style={styles.value}>
						{startHour} - {endHour}
					</Text>
				</Text>
				<Text style={styles.label}>
					Profesional: <Text style={styles.value}>{event.professional?.name}</Text>
				</Text>
				<Text style={styles.label}>
					Ubicación: <Text style={styles.value}>{event.center?.name}</Text>
				</Text>
				<Text style={styles.label}>
					Dirección: <Text style={styles.value}>{event.center?.address}</Text>
				</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 15,
		borderWidth: 1,
		borderColor: "#e0e0e0",
	},
	centerImage: {
		width: "100%",
		height: 120,
	},
	profileContainer: {
		alignItems: "center",
		marginTop: -40,
	},
	serviceImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		borderWidth: 2,
		borderColor: "#fff",
	},
	infoContainer: {
		padding: 20,
		gap: 10,
	},
	label: {
		fontWeight: "600",
		marginBottom: 4,
	},
	value: {
		fontWeight: "normal",
	},
})
