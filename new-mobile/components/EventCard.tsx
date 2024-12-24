import React from "react"
import dayjs from "dayjs"

import { Event } from "@/lib/types"
import { primaryGreen } from "@/constants/Colors"
import { MaterialIcons } from "@expo/vector-icons"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface Props {
	event: Event
	isSelected: boolean
	onPress: () => void
}

export const EventCard: React.FC<Props> = ({ event, isSelected, onPress }) => {
	const startHour = dayjs(event.start).format("HH:mm A")
	const endHour = dayjs(event.end).format("HH:mm A")

	const styles = StyleSheet.create({
		container: {
			backgroundColor: "white",
			padding: 15,
			borderRadius: 15,
			borderWidth: 1,
			borderColor: "#a0a0a0",
		},
		text: {
			color: "black",
			textAlign: "center",
		},
		selectedLabel: {
			position: "absolute",
			top: 12,
			right: 10,
			flexDirection: "row",
			alignItems: "center",
			borderRadius: 10,
		},
	})

	return (
		<TouchableOpacity style={styles.container} onPress={() => onPress()}>
			<Text style={styles.text}>
				{startHour} - {endHour}
			</Text>
			{isSelected && (
				<View style={styles.selectedLabel}>
					<MaterialIcons name="check-circle" size={24} color={primaryGreen} />
				</View>
			)}
		</TouchableOpacity>
	)
}
