import { useState, useEffect } from "react"
import { View, StyleSheet, Text, Alert } from "react-native"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import { commonProps } from "@/utils/types"
import { Controller, useFormContext } from "react-hook-form"
import * as mime from "react-native-mime-types"
import axios from "axios"
import Feather from "@expo/vector-icons/Feather"
import { SERVER_URL } from "@/utils/request"

const Social = ({ navigation, route }: commonProps) => {
	const {
		setValue,
		getValues,
		trigger,
		control,
		handleSubmit,
		formState: { errors },
	} = useFormContext()
	const [isPhotoValid, setPhotoValid] = useState<boolean>(false)

	useEffect(() => {
		if (route.params?.photoUri) {
			setValue("social", route.params.photoUri)
		}
	}, [route.params?.photoUri])

	useEffect(() => {
		const photo = getValues(["social"])
		if (photo[0]) {
			setPhotoValid(true)
		}
	}, [getValues(["social"])])

	const openCamera = () => {
		navigation.navigate("Camera", { from: "Social", isRSH: true })
	}

	const onSubmit = async (data: any) => {
		const isValid = await trigger("social")

		const formData = new FormData()

		formData.append("rut", data.rut)
		formData.append("pin", data.pin)
		formData.append("email", data.email)

		const uriToFileObject = (uri: string, name: string) => {
			const fileName = `${name}.jpg`
			const fileType = mime.lookup(uri) || "image/jpeg"

			return {
				uri: uri,
				type: fileType,
				name: fileName,
			}
		}

		if (data.dni_a) {
			const dniAFile = uriToFileObject(data.dni_a, "dni-a")
			formData.append("dni-a", dniAFile as any)
		}
		if (data.dni_b) {
			const dniBFile = uriToFileObject(data.dni_b, "dni-b")
			formData.append("dni-b", dniBFile as any)
		}
		if (data.social) {
			const socialFile = uriToFileObject(data.social, "social")
			formData.append("social", socialFile as any)
		}
		try {
			await axios.post(`${SERVER_URL}/api/dashboard/seniors/new-mobile`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})

			if (isValid) {
				navigation.navigate("Final")
			}
		} catch (error: any) {
			error.response.data.message && Alert.alert("Error", error.response.data.message)
		}
	}

	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="6/7"
			textTitle="Sube tu Registro Social de Hogares"
			textDescription="Recuerda que la imagen debe ser legible y estar actualizada"
		>
			<View>
				<Controller
					control={control}
					name="social"
					render={({ field: { value } }) => (
						<View style={styles.takePhotoContainer}>
							<View style={{ width: "10%" }}>
								{value ? <Feather name="check-square" size={30} color="green" /> : <Feather name="square" size={30} color="black" />}
							</View>
							<CustomButton
								style={{ width: "85%" }}
								title={value ? "Re-tomar Foto" : "Tomar Foto"}
								onPress={() => {
									openCamera()
								}}
							/>
						</View>
					)}
				/>
				{errors["social"] && <Text style={{ color: "red", alignSelf: "center" }}>{String(errors["social"].message)}</Text>}

				<>
					{isPhotoValid ? (
						<CustomButton title="Siguiente" onPress={handleSubmit(onSubmit)} style={{ marginTop: 30 }} />
					) : (
						<CustomButton
							style={{ backgroundColor: Colors.white, marginTop: 30 }}
							textStyle={styles.customButtonText}
							title="Siguiente"
							onPress={handleSubmit(onSubmit)}
						/>
					)}
				</>

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

export default Social

const styles = StyleSheet.create({
	customButtonText: {
		color: Colors.green,
	},
	takePhotoContainer: {
		flexDirection: "row",
		padding: 5,
		marginTop: 25,
		justifyContent: "space-between",
		alignItems: "center",
	},
})
