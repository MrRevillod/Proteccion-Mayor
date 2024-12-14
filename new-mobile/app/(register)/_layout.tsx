import { z } from "zod"
import { Stack } from "expo-router"
import { Header } from "@/components/Header"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterSchema } from "@/lib/schemas"
import { FormProvider, useForm } from "react-hook-form"

const RegisterLayout = () => {
	type RegisterFormData = z.infer<typeof RegisterSchema>

	const methods = useForm<RegisterFormData>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			rut: "",
			email: "",
			pin: "",
			pinConfirm: "",
			dni_a: "",
			dni_b: "",
			social: "",
		},
	})

	const handleGoBack = (navigation: any) => {
		if (!navigation.canGoBack()) {
			methods.reset()
			methods.clearErrors()
			return navigation.replace("/login")
		}

		navigation.goBack()
	}

	return (
		<FormProvider {...methods}>
			<Stack
				screenOptions={{
					gestureEnabled: false,
					header: ({ navigation }) => <Header title="Protección Mayor" goBack={() => handleGoBack(navigation)} />,
				}}
			>
				<Stack.Screen name="instructions" />
				<Stack.Screen name="rut" />
				<Stack.Screen name="email" />
				<Stack.Screen name="pin" />
				<Stack.Screen name="dni" />
				<Stack.Screen name="rsh" />
				<Stack.Screen
					name="final"
					options={{
						header: () => <Header title="Protección Mayor" />,
					}}
				/>
				<Stack.Screen name="camera" options={{ headerShown: false }} />
			</Stack>
		</FormProvider>
	)
}

export default RegisterLayout
