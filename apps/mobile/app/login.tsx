import React from "react"
import RUT from "@/screens/login/rut"
import Pin from "@/screens/login/pin"

import { getStorageRUT } from "@/utils/storage"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { View, ActivityIndicator } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

const Stack = createNativeStackNavigator()

const Login = () => {
	const methods = useForm({
		defaultValues: { rut: "", password: "" },
	})

	const { setValue } = methods
	const [rut, setRUT] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		getStorageRUT()
			.then((id) => {
				if (id) {
					setRUT(id) // Guarda el RUT en el estado local
					setValue("rut", id) // Asigna el RUT al formulario global
				}
			})
			.finally(() => setLoading(false)) // Cambia el estado de carga después de completar la promesa
	}, [setValue])

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		)
	}

	return (
		<FormProvider {...methods}>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				{rut !== null ? (
					// Si el RUT existe, salta a la pantalla Pin
					<Stack.Screen name="Pin" component={Pin} />
				) : (
					// Si no existe, muestra la pantalla RUT para ingresar manualmente
					<>
						<Stack.Screen name="RUT" component={RUT} />
						<Stack.Screen name="Pin" component={Pin} />
					</>
				)}
			</Stack.Navigator>
		</FormProvider>
	)
}

export default Login
