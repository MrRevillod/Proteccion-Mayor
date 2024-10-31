import Colors from "@/components/colors"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"

import { StyleSheet } from "react-native"
import { commonProps } from "@/utils/types"

const Final = ({ navigation }: commonProps) => {
	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="7/7"
			textTitle="Todo Listo!"
			textDescription="Has completado el registro. Cuando la municipalidad valide tus datos seras notificado y podras solicitar horas"
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
