import { useState, useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import { commonProps } from "../../utils/types"
import { Controller, useFormContext } from "react-hook-form"
import Feather from "@expo/vector-icons/Feather"

const DNI = ({ navigation, route }: commonProps) => {
	const {
		setValue,
		getValues,
		trigger,
		control,
		formState: { errors },
	} = useFormContext()

	const [isCapturingFront, setIsCapturingFront] = useState<boolean>(true)
	const [arePhotosValid, setPhotosValid] = useState<boolean>(false)

	useEffect(() => {
		if (route.params?.photoUri) {
			if (isCapturingFront) {
				setValue("dni_a", route.params.photoUri)
			} else {
				setValue("dni_b", route.params.photoUri)
			}
		}
	}, [route.params?.photoUri])

	useEffect(() => {
		const photos = getValues(["dni_a", "dni_b"])
		if (photos[0] && photos[1]) {
			setPhotosValid(true)
		}
	}, [getValues(["dni_a", "dni_b"])])

	const openCamera = (type: "front" | "back") => {
		navigation.navigate("Camera", { from: "DNI", isDNI: true, type })
	}

	const validatePhotosAndNavigate = async () => {
		const isValid = await trigger(["dni_a", "dni_b"])
		if (isValid) {
			navigation.navigate("Social")
		}
	}

	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="5/7"
			textTitle="Sube tu Cédula de Identidad por ambos lados"
			textDescription="La imagen debe ser legible y el documento debe estar vigente."
		>
			<View>
				<Controller
					name="dni_a"
					render={({ field: { value } }) => (
						<View style={styles.takePhotoContainer}>
							<View style={{ width: "10%" }}>
								{value ? <Feather name="check-square" size={30} color="green" /> : <Feather name="square" size={30} color="black" />}
							</View>
							<CustomButton
								style={{ width: "85%" }}
								title={value ? "Re-tomar Foto Frontal" : "Tomar Foto Frontal"}
								onPress={() => {
									setIsCapturingFront(true)
									openCamera("front")
								}}
							/>
						</View>
					)}
				/>
				{errors["dni_a"] && typeof errors["dni_a"].message === "string" && (
					<Text style={{ color: "red", alignSelf: "center" }}>{errors["dni_a"].message}</Text>
				)}

				<Controller
					control={control}
					name="dni_b"
					render={({ field: { value } }) => (
						<View style={styles.takePhotoContainer}>
							<View style={{ width: "10%" }}>
								{value ? <Feather name="check-square" size={30} color="green" /> : <Feather name="square" size={30} color="black" />}
							</View>
							<CustomButton
								style={{ width: "85%" }}
								title={value ? "Re-tomar Foto Trasera" : "Tomar Foto Trasera"}
								onPress={() => {
									setIsCapturingFront(false)
									openCamera("back")
								}}
							/>
						</View>
					)}
				/>
				{errors["dni_b"] && typeof errors["dni_b"].message === "string" && (
					<Text style={{ color: "red", alignSelf: "center" }}>{errors["dni_b"].message}</Text>
				)}

				<>
					{arePhotosValid ? (
						<CustomButton title="Siguiente" onPress={validatePhotosAndNavigate} style={{ marginTop: 30 }} />
					) : (
						<CustomButton
							style={{ backgroundColor: Colors.white, marginTop: 30 }}
							textStyle={styles.customButtonText}
							title="Siguiente"
							onPress={validatePhotosAndNavigate}
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

export default DNI

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},
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
