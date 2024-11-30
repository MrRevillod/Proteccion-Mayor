import { SERVER_URL } from "@/utils/request"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema } from "@/utils/validation"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { View, StyleSheet, Text, Alert, Image } from "react-native"

import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"

import * as mime from "react-native-mime-types"
import * as ImagePicker from "expo-image-picker"

import axios from "axios"

const NewProfile = ({ navigation, route }: any) => {
	const [image, setImage] = useState("")
	const { setValue, control, handleSubmit } = useForm({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			profile: "",
			id: "211240512",
		},
	})
	useEffect(() => {
		if (route.params?.photoUri) {
			setValue("profile", route.params.photoUri)
			setImage(route.params.photoUri)
		}
	}, [route.params?.photoUri])

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 4],
			quality: 1,
		})

		console.log(result)

		if (!result.canceled) {
			setValue("profile", result.assets[0].uri)
			setImage(result.assets[0].uri)
		}
	}

	const openCamera = () => {
		navigation.navigate("Camera", { from: "profile" })
	}

	const onSubmit = async (data: any) => {
		const formData = new FormData()

		formData.append("id", data.id)

		const uriToFileObject = (uri: string, name: string) => {
			const fileName = `${name}.jpg`
			const fileType = mime.lookup(uri) || "image/jpeg"

			return {
				uri: uri,
				type: fileType,
				name: fileName,
			}
		}

		if (data.profile) {
			const profile = uriToFileObject(data.profile, "profile")
			formData.append("profile", profile as any)
		}
		try {
			await axios.post(`${SERVER_URL}/api/dashboard/seniors/${data.id}/profile`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
		} catch (error) {
			Alert.alert("Error", "Hubo un problema al enviar los datos. Intenta nuevamente.")
		}

		Alert.alert("Operación exitosa", "Foto de perfil cambiada")
	}

	return (
		<GeneralView title="Cambiar foto de perfil">
			<View>
				<View style={styles.container}>{image != "" && <Image source={{ uri: image }} style={styles.image} />}</View>
				<Controller
					name="profile"
					control={control}
					render={({ field: { value } }) => (
						<>
							<CustomButton
								style={{ marginTop: 30 }}
								title={value ? "Re-tomar Foto" : "Tomar Foto"}
								onPress={() => {
									openCamera()
								}}
							/>
							<CustomButton
								style={{ marginTop: 30 }}
								title={"Seleccionar foto"}
								onPress={() => {
									pickImage()
								}}
							/>
							<View style={styles.container}>{value && <Text>Foto tomada</Text>}</View>
						</>
					)}
				/>
				<CustomButton style={{ marginTop: 30, backgroundColor: Colors.green }} title="Cambiar foto" onPress={handleSubmit(onSubmit)} />
				<CustomButton
					title="Volver"
					onPress={() => navigation.goBack()}
					style={{ backgroundColor: Colors.white }}
					textStyle={styles.customButtonText}
				/>
			</View>
		</GeneralView>
	)
}

export default NewProfile

const styles = StyleSheet.create({
	container: {
		display: "flex",
		alignContent: "center",
		justifyContent: "center",
		alignItems: "center",
	},
	customButtonText: {
		color: Colors.green,
	},
	image: {
		width: 200,
		height: 200,
	},
})
