import Input from "@/components/input"
import Colors from "@/components/colors"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import GoBackButton from "@/components/goBack"

import { useAuth } from "@/contexts/authContext"
import { SERVER_URL } from "@/utils/request"
import { useFormContext } from "react-hook-form"
import { View, StyleSheet, Linking } from "react-native"

const Pin = ({ navigation }: any) => {
	const { login } = useAuth()
	const { handleSubmit } = useFormContext()

	const onSubmit = async (data: any) => {
		await login(data)
		navigation.navigate("Home")
	}

	return (
		<>
			<GoBackButton navigation={navigation} visible />
			<GeneralView title="Datos del Registro" textCircle="2/2" textTitle="Ingrese su Pin de 4 dígitos">
				<View style={styles.container}>
					<Input name="password" placeholder="Ingresa tu pin" secureTextEntry keyboardType="numeric" />
					<CustomButton title="Siguiente" onPress={handleSubmit(onSubmit)} />

					<CustomButton
						style={{ backgroundColor: Colors.white }}
						textStyle={styles.customButtonText}
						title="¿Olvidaste tu pin de acceso?"
						onPress={() => Linking.openURL(`${SERVER_URL}/auth/restaurar-contrasena?variant=mobile`)}
					/>
				</View>
			</GeneralView>
		</>
	)
}

export default Pin

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},
	customButtonText: {
		color: Colors.green,
		textDecorationLine: "underline",
	},
})
