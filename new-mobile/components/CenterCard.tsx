import React from "react"

import { Center } from "@/lib/types"
import { primaryGreen } from "@/constants/Colors"
import { API_BASE_URL } from "@/lib/http"
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native"

interface Props {
	center: Center
	onPress: () => void
	selected?: boolean
}

export const CenterCard: React.FC<Props> = ({ center, onPress, selected }) => {
	const imageUri = `${API_BASE_URL}/storage/public/centers/${center.id}.webp`

	return (
		<TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
			<Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
			{selected && <View style={styles.overlay} />}
			{selected && (
				<View style={styles.selectedLabel}>
					<MaterialIcons name="check-circle" size={24} color={primaryGreen} />
					<Text style={styles.selectedText}>Seleccionado</Text>
				</View>
			)}
			<View style={styles.infoContainer}>
				<View style={styles.iconContainer}>
					<FontAwesome name="hospital-o" size={20} color="white" />
				</View>
				<View style={styles.textContainer}>
					<Text style={styles.title}>{center.name}</Text>
					<Text style={styles.subtitle}>{center.address}</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderColor: "#e0e0e0",
		borderRadius: 15,
		overflow: "hidden",
		backgroundColor: "#fff",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		marginBottom: 15,
	},
	image: {
		width: "100%",
		height: 100,
	},
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: 100,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		borderRadius: 15,
	},
	selectedLabel: {
		position: "absolute",
		top: 10,
		right: 10,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.95)",
		padding: 5,
		borderRadius: 10,
	},
	selectedText: {
		marginLeft: 5,
		fontSize: 14,
		color: primaryGreen,
	},
	infoContainer: {
		padding: 15,
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 12,
	},
	textContainer: {
		flex: 1,
		gap: 4,
	},
	title: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	subtitle: {
		fontSize: 14,
		color: "#666",
	},
	iconContainer: {
		backgroundColor: primaryGreen,
		padding: 10,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		width: 40,
		height: 40,
	},
})
