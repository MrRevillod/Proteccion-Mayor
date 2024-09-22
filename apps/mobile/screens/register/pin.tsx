import { View, StyleSheet } from "react-native"
import Input from "@/components/input"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import { commonProps } from "@/utils/types"

const Pin = ({ navigation, control, errors, validateAndNavigate }: commonProps) => {
	return (
		<GeneralView title="Datos del Registro" textCircle="3/7" textTitle="Ingresa tu Pin de 4 dígitos.">
			<View style={styles.container}>
				<Input name="pin" placeholder="Ingresa tu pin" control={control} errors={errors} secureTextEntry />
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
