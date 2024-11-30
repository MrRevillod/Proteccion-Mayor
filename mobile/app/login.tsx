import React from "react"
import RUT from "@/screens/login/rut"
import Pin from "@/screens/login/pin"

import { getStorageRUT } from "@/utils/storage"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { View, ActivityIndicator } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

const Stack = createNativeStackNavigator()

const Login = ({ route }: any) => {
	const methods = useForm({
		defaultValues: { rut: "", password: "" },
	})

	const { setValue } = methods
	const [rut, setRUT] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchRUT = async () => {
			if (route?.params?.screen === "RUT") {
				setRUT(null)
				setValue("rut", "")
				setLoading(false)
				return
			}

			try {
				const storedRUT = await getStorageRUT()
				if (storedRUT) {
					setRUT(storedRUT)
					setValue("rut", storedRUT)
				}

				console.log("storedRUT", storedRUT)

			} finally {
				setLoading(false)
			}
		}

		fetchRUT()
	}, [route?.params, setValue])

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
				{rut ? (
					<Stack.Screen name="Pin" component={Pin} />
				) : (
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
