import React from "react"

import { primaryGreen } from "@/constants/Colors"
import { View, Text, ActivityIndicator, StyleSheet } from "react-native"

interface Props {
	color?: string
}

export const LoadingIndicator: React.FC<Props> = ({ color }) => {
	return (
		<View style={styles.loaderContainer}>
			<ActivityIndicator size="large" color={color ?? primaryGreen} />
			<Text style={{ ...styles.loadingText, color: color ? "white" : "black" }}>
				Cargando...
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	loaderContainer: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 15,
		height: "62%",
	},
	loadingText: {
		marginTop: 10,
	},
})
