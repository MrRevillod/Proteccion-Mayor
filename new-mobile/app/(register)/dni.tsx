import { Button } from "@/components/Button"
import { useRouter } from "expo-router"
import { FontAwesome } from "@expo/vector-icons"
import { primaryGreen } from "@/constants/Colors"
import { useFormContext } from "react-hook-form"
import { Text, StyleSheet, View } from "react-native"

const DniRegisterScreen = () => {
	const {
		trigger,
		watch,
		formState: { errors },
	} = useFormContext()

	const router = useRouter()
	const dni_a = watch("dni_a")
	const dni_b = watch("dni_b")

	const handleNextStep = async () => {
		if (await trigger(["dni_a", "dni_b"])) router.push("/(register)/rsh")
	}

	const openCamera = (fieldName: "dni_a" | "dni_b") => {
		router.push({ pathname: "/(register)/camera", params: { fieldName } })
	}

	return (
		<View style={styles.container}>
			<View style={{ width: "80%" }}>
				<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Paso 4 de 6</Text>
			</View>

			<View style={{ width: "80%", marginBottom: 24 }}>
				<Text style={{ fontSize: 18 }}>
					Necesitamos que suba una fotografía de su cédula de identidad por ambos lados.
				</Text>
			</View>

			<View style={styles.imageButtonContainer}>
				<Button
					variant="primary"
					text={dni_a ? "Volver a tomar" : "Subir lado frontal"}
					onPress={() => openCamera("dni_a")}
					size="xxl"
				/>
				{!dni_a && (
					<FontAwesome
						name="square-o"
						color={errors["dni_a"] ? "red" : primaryGreen}
						style={styles.checkIcon}
					/>
				)}
				{dni_a && <FontAwesome name="check-square" color={primaryGreen} style={styles.checkIcon} />}
			</View>

			<View style={[styles.imageButtonContainer, { marginBottom: 15 }]}>
				<Button
					variant="primary"
					text={dni_b ? "Volver a tomar" : "Subir lado trasero"}
					onPress={() => openCamera("dni_b")}
					size="xxl"
				/>
				{!dni_b && (
					<FontAwesome
						name="square-o"
						color={errors["dni_b"] ? "red" : primaryGreen}
						style={styles.checkIcon}
					/>
				)}
				{dni_b && <FontAwesome name="check-square" color={primaryGreen} style={styles.checkIcon} />}
			</View>

			<Button variant="primary" text="Siguiente" onPress={handleNextStep} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		paddingTop: 50,
		backgroundColor: "white",
	},
	imageButtonContainer: {
		width: "80%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 0,
	},
	checkIcon: {
		fontSize: 40,
	},
})

export default DniRegisterScreen
