import React from "react"

import { View } from "react-native"
import { Input } from "@/components/Input"
import { RegisterScreen } from "@/components/RegisterScreen"

const EmailRegisterScreen = () => {
	return (
		<RegisterScreen fieldName="email" nextScreen="/(register)/pin" step="2 de 6">
			<View style={{ width: "80%", gap: 25, marginBottom: 20 }}>
				<Input
					label="Ingrese su correo electrónico"
					name="email"
					placeholder="tucorreo@mail.com"
					keyboardType="email-address"
					autoFocus
				/>
			</View>
		</RegisterScreen>
	)
}

export default EmailRegisterScreen
