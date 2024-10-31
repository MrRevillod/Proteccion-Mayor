import { View, StyleSheet } from "react-native"
import Input from "@/components/input"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import { useFormContext } from "react-hook-form"
import { checkUniqueField } from "@/utils/request"
import GoBackButton from "@/components/goBack"
import { commonProps } from "@/utils/types"

const RUT = ({ navigation }: commonProps) => {
	const { getValues, setError, trigger } = useFormContext()

	const onSubmit = async () => {
		const request = await checkUniqueField("rut", getValues, trigger, setError)
		if (request) {
			navigation.navigate("Email")
		}
	}

	return (
		<>
			<GoBackButton navigation={navigation}></GoBackButton>
			<GeneralView
				title="Datos del Registro"
				textCircle="1/7"
				textTitle="Ingrese su RUT"
				textDescription="Debe ingresar su RUT sin puntos ni guión."
			>
				<View style={styles.container}>
					<Input name="rut" placeholder="Ingrese su RUT aquí" />
					<CustomButton title="Siguiente" onPress={onSubmit} />
				</View>
			</GeneralView>
		</>
	)
}

export default RUT

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},
})
