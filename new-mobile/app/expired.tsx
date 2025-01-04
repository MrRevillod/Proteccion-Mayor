import React from "react"

import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useRouter } from "expo-router"
import { StyleSheet, View } from "react-native"

const ExpiredSessionScreen = () => {
	const router = useRouter()

	return (
		<View style={styles.container}>
			<View style={{ alignItems: "center", width: "80%", gap: 25 }}>
				<View style={{ alignItems: "center", gap: 10, marginBottom: 5 }}>
					<Text style={styles.title}>Tu sesión ha expirado</Text>
					<Text style={styles.description}>Para continuar, inicia sesión nuevamente</Text>
				</View>
				<Button
					text="Iniciar sesión"
					onPress={() => router.replace("/login")}
					size="xl"
					customFontSize={18}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
		width: "100%",
		height: "100%",
	},
	title: {
		fontSize: 25,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
	description: {
		fontSize: 18,
		fontWeight: "normal",
	},
})

export default ExpiredSessionScreen
