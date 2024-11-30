import Colors from "@/components/colors"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { StyleSheet } from "react-native"
import { commonProps } from "@/utils/types"
import { useEffect } from "react"

const Final = ({ navigation }: commonProps) => {

	useEffect(() => {
		const firstTime = async () => {
			await AsyncStorage.setItem("firstTime", "false")
		}
		firstTime()
	}, [])

	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="7/7"
			textTitle="Todo Listo!"
			textDescription="Ha completado su registro. Cuando la municipalidad valide sus datos sera notificado y podrá solicitar horas!"
		>
			<CustomButton
				style={{ backgroundColor: Colors.white }}
				textStyle={styles.customButtonText}
				title="Volver al Inicio"
				onPress={() => navigation.navigate("Menu")}
			/>
		</GeneralView>
	)
}

export default Final

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},
	customButtonText: {
		color: Colors.green,
	},
})
