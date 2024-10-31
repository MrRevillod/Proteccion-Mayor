import Input from "@/components/input"
import Colors from "@/components/colors"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"

import { commonProps } from "@/utils/types"
import { View, StyleSheet } from "react-native"

const ConfirmPin = ({ navigation, validateAndNavigate }: commonProps) => {
	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="4/7"
			textTitle="Vuelva a ingresar su Pin."
			textDescription="Antes de confirmar su pin, asegúrese de que le sea fácil de recordar."
		>
			<View style={styles.container}>
				<Input name="pinConfirm" placeholder="Confirme su Pin" secureTextEntry />
				<CustomButton title="Siguiente" onPress={() => validateAndNavigate("pinConfirm", navigation, "DNI")} />
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

export default ConfirmPin

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},
	customButtonText: {
		color: Colors.green,
	},
})
1
