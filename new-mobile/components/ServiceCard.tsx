import React from "react"

import { Text } from "@/components/Text"
import { Image } from "@/components/Image"
import { Service } from "@/lib/types"
import { TouchableOpacity, StyleSheet, View } from "react-native"

interface Props {
	service: Service
	onPress: () => void
}

export const ServiceCard: React.FC<Props> = ({ service, onPress }) => {
	return (
		<TouchableOpacity
			style={{ ...styles.gridItem, backgroundColor: service.color }}
			onPress={onPress}
		>
			<View style={[styles.iconContainer]}>
				<Image source={`/services/${service.id}.webp`} style={styles.iconImage} cache />
			</View>
			<Text style={styles.serviceText}>{service.name}</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	gridItem: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 10,
		margin: 10,
		paddingBottom: 10,
		width: 150,
		height: 170,
	},
	iconContainer: {
		width: 150,
		height: 150,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	iconImage: {
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		width: 150,
		height: 150,
	},
	serviceText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#FFF",
		marginVertical: 5,
	},
})
