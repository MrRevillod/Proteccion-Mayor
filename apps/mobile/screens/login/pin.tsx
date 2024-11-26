import Input from "@/components/input"
import Colors from "@/components/colors"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import GoBackButton from "@/components/goBack"

import { useAuth } from "@/contexts/authContext"
import { SERVER_URL } from "@/utils/request"
import { useFormContext } from "react-hook-form"
import { View, StyleSheet, Linking, AppState, AppStateStatus } from "react-native"
import { useEffect } from "react"
import { useIsFocused } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const Pin = ({ navigation }: any) => {
	const { login } = useAuth()
	const { handleSubmit, setValue } = useFormContext()
	const isFocused = useIsFocused()

	const onSubmit = async (data: any) => {
		await login(data)
		navigation.navigate("Home")
		await AsyncStorage.setItem("firtTime", "false")
	}

	useEffect(() => {
		// useIsFocused(), es un hook de react navigation que retorna true si la pantalla está enfocada, 
		// y false si no lo está. En este caso, se utiliza para limpiar el campo de contraseña cuando 
		// la pantalla no está enfocada.
		if (!isFocused) {
			setValue("password", "") // Resetea solo el campo de "password"
		}
	}, [isFocused])

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
