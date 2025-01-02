import React from "react"

import { Text } from "./Text"
import { Image } from "@/components/Image"
import { MaterialIcons } from "@expo/vector-icons"
import { StyleSheet, View, TouchableOpacity } from "react-native"

interface Props {
	title: string
	subtitle: string
	onPress: () => void
	selected?: boolean
	imageUri?: string
}

export const SelectableItem: React.FC<Props> = ({ title, subtitle, ...props }) => {
	const { imageUri, selected, onPress } = props

	return (
		<TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
			<View style={styles.infoContainer}>
				{imageUri && (
					<View style={styles.iconContainer}>
						<Image source={imageUri} style={styles.image} cache />
						{selected && (
							<>
								<View style={styles.overlay} />
								<View style={styles.checkIconContainer}>
									<MaterialIcons name="check-circle" size={24} color="white" />
								</View>
							</>
						)}
					</View>
				)}
				<View style={styles.textContainer}>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.subtitle}>{subtitle}</Text>
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
		width: 40,
		height: 40,
		borderRadius: 30,
		overflow: "hidden",
		backgroundColor: "#f0f0f0",
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},
	image: {
		width: "100%",
		height: "100%",
		borderRadius: 30,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		borderRadius: 30,
	},
	checkIconContainer: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: [{ translateX: -12 }, { translateY: -12 }],
	},
})
