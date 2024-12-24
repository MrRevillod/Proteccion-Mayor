import { Button } from "@/components/Button"
import { FontAwesome } from "@expo/vector-icons"
import { primaryGreen } from "@/constants/Colors"
import { ReactNode, useRef, useState } from "react"
import { manipulateAsync, SaveFormat } from "expo-image-manipulator"
import { CameraView, useCameraPermissions } from "expo-camera"
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native"

interface CustomCameraProps {
	onCapture: (photoUri: string) => void
	rectGenerator: (
		width: number,
		height: number
	) => { originX: number; originY: number; width: number; height: number }
	overlay?: ReactNode
}

export const CustomCamera = ({ onCapture, rectGenerator, overlay }: CustomCameraProps) => {
	const [loading, setLoading] = useState(false)
	const [permission, requestPermission] = useCameraPermissions()
	const cameraRef = useRef<CameraView | null>(null)

	if (!permission?.granted) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
				<Text style={{ fontSize: 24 }}>Se necesita permiso de cámara</Text>
				<Button onPress={requestPermission} text="Conceder permisos" variant="primary" size="lg" />
			</View>
		)
	}

	const handleCapture = async () => {
		if (cameraRef.current) {
			try {
				const { uri, width, height } = (await cameraRef.current.takePictureAsync({
					quality: 0.4,
					base64: false,
				})) ?? {
					uri: "",
					width: 0,
					height: 0,
				}

				setLoading(true)

				const croppedPhoto = await manipulateAsync(uri ?? "", [{ crop: rectGenerator(width, height) }], {
					compress: 1,
					format: SaveFormat.WEBP,
				})

				setLoading(false)

				onCapture(croppedPhoto.uri)
			} catch (error) {
				Alert.alert("Error", "No se pudo capturar la foto. Inténtelo de nuevo.")
			}
		}
	}

	return (
		<View style={{ flex: 1 }}>
			<CameraView style={styles.camera} ref={cameraRef} ratio="4:3">
				{!loading && overlay}
				{loading && (
					<View style={styles.loading}>
						<Text style={{ color: "white", marginBottom: 10, fontWeight: "semibold" }}>Procesando...</Text>
						<ActivityIndicator size="large" color="white" />
					</View>
				)}
				<TouchableOpacity style={styles.button} onPress={handleCapture}>
					<FontAwesome name="camera" size={40} color="white" />
				</TouchableOpacity>
			</CameraView>
		</View>
	)
}

const styles = StyleSheet.create({
	camera: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	button: {
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 50,
		width: 80,
		height: 80,
		backgroundColor: primaryGreen,
		borderRadius: 10,
	},
	loading: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		height: "100%",
		width: "100%",
	},
})
