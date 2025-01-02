import { z } from "zod"
import { Text } from "@/components/Text"
import { Input } from "@/components/Input"
import { Button } from "@/components/Button"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "expo-router"
import { isValidRut } from "@/lib/schemas"
import { StyleSheet, View } from "react-native"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { deleteSecureStore, getSecureStore } from "@/lib/secureStore"

const LoginScreen = () => {
	const auth = useAuth()
	const router = useRouter()

	const [rutExists, setRutExists] = useState<boolean>(false)

	const schema = z.object({
		rut: z.string().min(1, "El RUT es requerido").refine(isValidRut, {
			message: "El RUT ingresado no es válido",
		}),
		password: z.string().min(1, "El PIN es requerido").max(4, "El PIN debe tener 4 dígitos"),
	})

	type FormValues = z.infer<typeof schema>
	const methods = useForm<FormValues>({
		defaultValues: {
			rut: "",
			password: "",
		},
		mode: "onSubmit",
	})

	useEffect(() => {
		async function checkRut() {
			const rut = await getSecureStore("rut")

			if (rut) {
				setRutExists(true)
				methods.setValue("rut", rut)
			}
		}

		checkRut()
	}, [])

	const onSubmit = async (data: FormValues) => {
		try {
			schema.parse(data)
			await auth.login(data, () => router.replace("/(tabs)/home"))
		} catch (e) {
			if (e instanceof z.ZodError) {
				e.errors.forEach((error) => {
					methods.setError(error.path[0] as keyof FormValues, {
						type: "manual",
						message: error.message,
					})
				})
			}
		}
	}

	const handleForget = async () => {
		methods.setValue("rut", "")
		methods.setValue("password", "")
		await deleteSecureStore("rut")
		setRutExists(false)
		methods.clearErrors(["rut", "password"])
		auth.setError(null)
	}

	return (
		<FormProvider {...methods}>
			<View style={styles.container}>
				<View style={{ width: "80%" }}>
					<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
						Iniciar Sesión
					</Text>
				</View>

				{auth.error && (
					<View style={{ width: "80%", alignItems: "flex-start" }}>
						<Text style={{ color: "red", fontSize: 16, marginBottom: 20 }}>
							{auth.error}
						</Text>
					</View>
				)}

				<View style={{ width: "80%", gap: 25, marginBottom: 20 }}>
					{!rutExists && (
						<Input
							label="Ingrese su RUT sin puntos ni guión"
							name="rut"
							placeholder="11.111.111-1"
							keyboardType="default"
							maxLength={9}
						/>
					)}
					<Input
						label="Ingrese su PIN de acceso"
						name="password"
						placeholder="● ● ● ●"
						keyboardType="number-pad"
						secureTextEntry
						maxLength={4}
						autoFocus={rutExists}
					/>
				</View>

				<View style={{ width: "80%", gap: 20, alignItems: "center" }}>
					<Button
						variant="primary"
						text="Ingresar"
						onPress={methods.handleSubmit(onSubmit)}
						size="lg"
					/>
					{rutExists && (
						<Button
							variant="tertiary"
							text="Ingresar con otro RUT"
							onPress={() => handleForget()}
							size="full"
							customFontSize={18}
						/>
					)}
				</View>
			</View>
		</FormProvider>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		paddingTop: 50,
		backgroundColor: "white",
	},
})

export default LoginScreen
