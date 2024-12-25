import React from "react"

import { primaryGreen } from "@/constants/Colors"
import { View, Text, ActivityIndicator, StyleSheet } from "react-native"

export const LoadingIndicator = () => {
	return (
		<View style={styles.loaderContainer}>
			<ActivityIndicator size="large" color={primaryGreen} />
			<Text style={styles.loadingText}>Cargando...</Text>
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
