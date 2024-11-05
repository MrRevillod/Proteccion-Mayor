import React from "react"
import Camera from "@/components/camera"
import RUT from "@/screens/register/rut"
import Email from "@/screens/register/email"
import Pin from "@/screens/register/pin"
import ConfirmPin from "@/screens/register/confirmPin"
import DNI from "@/screens/register/dni"
import Social from "@/screens/register/social"
import Final from "@/screens/register/final"
import registerSchema from "@/utils/validation"

import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

const Stack = createNativeStackNavigator()

const Register = () => {
	const methods = useForm({
		defaultValues: {
			rut: "",
			email: "",
			pin: "",
			pinConfirm: "",
			dni_a: "",
			dni_b: "",
			social: "",
		},
		resolver: zodResolver(registerSchema),
	})

	const { trigger } = methods

	const validateAndNavigate = async (field: any, navigation: any, nextScreen: string) => {
		const isValid = await trigger(field)
		if (isValid) {
			navigation.navigate(nextScreen)
		}
	}

	return (
		<FormProvider {...methods}>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name="RUT" component={RUT} />
				<Stack.Screen name="Email" component={Email} />
				<Stack.Screen name="Pin">{(props) => <Pin {...props} validateAndNavigate={validateAndNavigate} />}</Stack.Screen>
				<Stack.Screen name="ConfirmPin">{(props) => <ConfirmPin {...props} validateAndNavigate={validateAndNavigate} />}</Stack.Screen>
				<Stack.Screen name="DNI" component={DNI} />
				<Stack.Screen name="Social" component={Social} />
				<Stack.Screen name="Final" component={Final} />
				<Stack.Screen name="Camera" component={Camera} options={{ headerShown: true }} />
			</Stack.Navigator>
		</FormProvider>
	)
}

export default Register
