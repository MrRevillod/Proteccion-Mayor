import { Text } from "react-native"
import { Button } from "@/components/Button"
import { StyleSheet, View } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"

const FinalRegisterScreen = () => {
	const router = useRouter()
	const params = useLocalSearchParams()
	const status = params.status as string
	const message = params.message

	return (
		<View style={styles.container}>
			<View style={{ width: "80%" }}>
				<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Paso 6 de 6</Text>
			</View>

			{status === "success" && (
				<Text style={{ fontSize: 18, marginBottom: 20, width: "80%" }}>
					La solicitud se ha realizado con éxito. El equipo de administración revisará los datos de registro y se le notificará por correo
					electrónico una vez que su cuenta haya sido activada.
				</Text>
			)}

			{status === "error" && (
				<Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Lo sentimos. No se ha podido completar la solicitud.</Text>
			)}
			{status === "error" && message && <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>{message}</Text>}

			<Button variant="primary" text="Volver al inicio" onPress={() => router.replace("/")} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		paddingTop: 50,
		backgroundColor: "white",
		gap: 10,
	},
})

export default FinalRegisterScreen
