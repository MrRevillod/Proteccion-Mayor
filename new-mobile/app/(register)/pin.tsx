import { Text } from "react-native"
import { Input } from "@/components/Input"
import { Button } from "@/components/Button"
import { useRouter } from "expo-router"
import { useFormContext } from "react-hook-form"
import { StyleSheet, View } from "react-native"

const PinRegisterScreen = () => {
	const router = useRouter()
	const { trigger } = useFormContext()

	const handleNextStep = async () => {
		if (await trigger(["pin", "pinConfirm"])) router.push("/(register)/dni")
	}

	return (
		<View style={styles.container}>
			<View style={{ width: "80%" }}>
				<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Paso 3 de 6</Text>
			</View>

			<View style={{ width: "80%", gap: 25, marginBottom: 20 }}>
				<Input label="Ingrese un PIN de acceso" name="pin" placeholder="● ● ● ●" secureTextEntry keyboardType="numeric" maxLength={4} />
			</View>
			<View style={{ width: "80%", gap: 25, marginBottom: 20 }}>
				<Input
					label="Confirme el PIN de acceso"
					name="pinConfirm"
					placeholder="● ● ● ●"
					secureTextEntry
					keyboardType="numeric"
					maxLength={4}
				/>
			</View>

			<Button variant="primary" text="Siguiente" onPress={() => handleNextStep()} />
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
})

export default PinRegisterScreen
