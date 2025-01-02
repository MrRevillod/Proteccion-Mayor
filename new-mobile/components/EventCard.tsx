import React from "react"
import dayjs from "dayjs"

import { Text } from "@/components/Text"
import { Event } from "@/lib/types"
import { Image } from "@/components/Image"
import { StyleSheet, View } from "react-native"

interface Props {
	event: Event
}

export const EventCard: React.FC<Props> = ({ event }) => {
	const startHour = dayjs(event.start).format("HH:mm A")
	const endHour = dayjs(event.end).format("HH:mm A")

	return (
		<View style={styles.container}>
			<Image source={`/centers/${event.center?.id}.webp`} style={styles.centerImage} cache />
			<View style={styles.profileContainer}>
				<Image
					source={`/services/${event.service?.id}.webp`}
					style={styles.serviceImage}
					cache
				/>
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
					Estado:{" "}
					<Text style={styles.value}>
						{dayjs(event.start).isBefore(dayjs())
							? "Cita realizada"
							: "Cita en reserva"}
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
		marginBottom: "2%",
		width: "100%",
	},
	centerImage: {
		width: "100%",
		height: 100,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
	},
	profileContainer: {
		alignItems: "center",
		marginTop: -50,
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
		fontSize: 15,
		fontWeight: "600",
		marginBottom: 4,
	},
	value: {
		fontSize: 15,
		fontWeight: "normal",
	},
})
