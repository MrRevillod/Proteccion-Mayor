import { View, StyleSheet, Alert } from "react-native"
import Input from "@/components/input"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"

import { useEffect } from "react"
import { SERVER_URL } from "@/utils/request"
import { useAuth } from "@/contexts/authContext"
import { useFormContext } from "react-hook-form" // Importa useFormContext
import GoBackButton from "@/components/goBack"
import * as Linking from "expo-linking"
const Pin = ({ navigation }: any) => {
	const { handleSubmit } = useFormContext()
	const { login } = useAuth()

	const onSubmit = async (data: any) => {
		await login(data)
		navigation.navigate("Menu")
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
						onPress={() => Linking.openURL(`${SERVER_URL}/auth/reset-password?variant=SENIOR`)}
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
