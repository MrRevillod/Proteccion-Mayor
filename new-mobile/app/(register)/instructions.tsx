import React from "react"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useRouter } from "expo-router"
import { StyleSheet, View } from "react-native"

const InstructionItem = ({ step, text }: { step: number; text: string }) => (
	<View style={styles.instructionItem}>
		<Text style={styles.instructionStep}>{`${step}.`}</Text>
		<Text style={styles.instructionText}>{text}</Text>
	</View>
)

export const InstructionsRegisterScreen = () => {
	const router = useRouter()

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Text style={styles.title}>Instrucciones</Text>
				<Text style={styles.subtitle}>Sigue estos pasos para completar tu registro:</Text>
			</View>

			<View style={styles.instructionsContainer}>
				<InstructionItem step={1} text="Ingresar su RUT" />
				<InstructionItem step={2} text="Ingresar su correo electrónico" />
				<InstructionItem step={3} text="Configurar un PIN de acceso a la aplicación" />
				<InstructionItem step={4} text="Subir fotos de su cédula de identidad" />
				<InstructionItem step={5} text="Subir fotos de su registro social de hogares" />
				<InstructionItem step={6} text="Finalizar el registro" />
			</View>

			<Button
				variant="primary"
				text="Comenzar"
				onPress={() => router.push("/(register)/rut")}
				size="xxl"
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "white",
		paddingTop: "15%",
	},
	headerContainer: {
		width: "80%",
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#333",
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
	},
	instructionsContainer: {
		width: "80%",
		marginBottom: 20,
	},
	instructionItem: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 10,
	},
	instructionStep: {
		fontSize: 16,
		fontWeight: "bold",
		marginRight: 5,
		color: "#555",
	},
	instructionText: {
		fontSize: 16,
		color: "#555",
		flex: 1,
	},
})

export default InstructionsRegisterScreen
