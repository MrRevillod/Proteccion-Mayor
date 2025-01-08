import React, { useState, useEffect } from "react"

import { Text } from "@/components/Text"
import { primaryGreen } from "@/constants/Colors"
import { View, ActivityIndicator, StyleSheet } from "react-native"

interface Props {
	color?: string
}

export const LoadingIndicator: React.FC<Props> = ({ color }) => {
	const [visible, setVisible] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => {
			setVisible(false)
		}, 1000)
		return () => clearTimeout(timer)
	}, [])

	if (!visible) return null

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
