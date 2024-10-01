import { View, StyleSheet } from "react-native"
import Input from "@/components/input"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import { commonProps } from "@/utils/types"
import { checkUniqueField } from "@/utils/request"

const Email = ({ navigation, control, errors, getValues, trigger, setError }: commonProps) => {
	const onSubmit = async () => {
		const request = await checkUniqueField("email", getValues, trigger, setError)
		if (request) {
			navigation.navigate("Pin")
		}
	}
	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="2/7"
			textTitle="Ingrese su Correo Electrónico"
			textDescription="Debe ingresar un correo real y al que usted tenga acceso."
		>
			<View style={styles.container}>
				<Input name="email" placeholder="TuCorreo@gmail.com" control={control} errors={errors} />
				<CustomButton title="Siguiente" onPress={onSubmit} />
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

export default Email

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},
	customButtonText: {
		color: Colors.green,
	},
})
