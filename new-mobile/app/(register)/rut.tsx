import { View } from "react-native"
import { Input } from "@/components/Input"
import { RegisterScreen } from "@/components/RegisterScreen"

const RutRegisterScreen = () => {
	return (
		<RegisterScreen fieldName="rut" nextScreen="/(register)/email" step="1 de 6">
			<View style={{ width: "80%", gap: 25, marginBottom: 20 }}>
				<Input label="Ingrese su RUT sin puntos ni guión" name="rut" placeholder="11.111.111-1" maxLength={9} />
			</View>
		</RegisterScreen>
	)
}

export default RutRegisterScreen
