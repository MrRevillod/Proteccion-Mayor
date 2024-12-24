import { Button } from "@/components/Button"
import { register } from "@/lib/actions"
import { useRouter } from "expo-router"
import { FontAwesome } from "@expo/vector-icons"
import { useMutation } from "@/hooks/useMutation"
import { primaryGreen } from "@/constants/Colors"
import { useFormContext } from "react-hook-form"
import { imageUriToFile } from "@/lib/files"
import { RegisterFormData } from "@/lib/types"
import { ActivityIndicator, StyleSheet, Text, View, Dimensions } from "react-native"

const RshRegisterScreen = () => {
	const {
		trigger,
		watch,
		handleSubmit,
		formState: { errors },
	} = useFormContext<RegisterFormData>()

	const router = useRouter()
	const social = watch("social")

	const openCamera = (fieldName: "social") => {
		router.push({ pathname: "/(register)/camera", params: { fieldName } })
	}

	const { mutate, loading } = useMutation({ mutateFn: register })

	const onSubmit = async (data: RegisterFormData) => {
		if (!(await trigger("social"))) return

		const formData = new FormData()

		formData.append("rut", data.rut)
		formData.append("email", data.email)
		formData.append("pin", data.pin)

		formData.append("dni-a", imageUriToFile("dni-a", data.dni_a) as any)
		formData.append("dni-b", imageUriToFile("dni-b", data.dni_b) as any)
		formData.append("social", imageUriToFile("social", data.social) as any)

		const pathname = "/(register)/final"

		await mutate({
			params: { body: formData },
			onSuccess: () => router.push({ pathname, params: { status: "success" } }),
			onError: (err) => {
				router.push({
					pathname,
					params: { status: "error", message: err?.response?.data?.values?.message },
				})
			},
		})
	}

	return (
		<View style={styles.container}>
			{loading && (
				<View style={styles.loading}>
					<Text style={{ color: "white", marginBottom: 10, fontWeight: "semibold" }}>Procesando...</Text>
					<ActivityIndicator size="large" color="white" />
				</View>
			)}
			<View style={{ width: "80%" }}>
				<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Paso 5 de 6</Text>
			</View>

			<View style={{ width: "80%", marginBottom: 24 }}>
				<Text style={{ fontSize: 18 }}>Necesitamos que suba una foto de su registro social de hogares.</Text>
			</View>

			<View style={styles.imageButtonContainer}>
				<Button
					variant="primary"
					text={social ? "Volver a tomar" : "Tomar foto"}
					onPress={() => openCamera("social")}
					size="xxl"
				/>
				{!social && (
					<FontAwesome
						name="square-o"
						color={errors["social"] ? "red" : primaryGreen}
						style={styles.checkIcon}
					/>
				)}
				{social && <FontAwesome name="check-square" color={primaryGreen} style={styles.checkIcon} />}
			</View>

			<Button variant="primary" text="Finalizar" onPress={handleSubmit(onSubmit)} />
		</View>
	)
}

const { width, height } = Dimensions.get("window")

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		paddingTop: 50,
		backgroundColor: "white",
	},
	imageButtonContainer: {
		width: "80%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 0,
		marginBottom: 20,
	},
	checkIcon: {
		fontSize: 40,
	},
	loading: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		height: height,
		width: width,
	},
})

export default RshRegisterScreen
