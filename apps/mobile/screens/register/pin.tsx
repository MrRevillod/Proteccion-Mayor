import Input from "@/components/input"
import Colors from "@/components/colors"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"

import { commonProps } from "@/utils/types"
import { View, StyleSheet } from "react-native"

const Pin = ({ navigation, validateAndNavigate }: commonProps) => {
	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="3/7"
			textTitle="Ingrese su Pin de 4 dígitos."
			textDescription="Su pin no debe repetir números, ni usar secuencias (1234). Además, debe ser un pin que recuerde fácilmente."
		>
			<View style={styles.container}>
				<Input name="pin" placeholder="Ingrese su pin aquí" secureTextEntry keyboardType="numeric" />
				<CustomButton title="Siguiente" onPress={() => validateAndNavigate("pin", navigation, "ConfirmPin")} />
				<CustomButton
					style={{ backgroundColor: Colors.white }}
					textStyle={styles.customButtonText}
					title="Volver"
					onPress={() => navigation.goBack()}
				/>
			</View>
		</GeneralView>
	)
}

export default Pin

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},
	customButtonText: {
		color: Colors.green,
	},
})
