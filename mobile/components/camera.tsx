import { useRef } from "react"
import { useRoute } from "@react-navigation/native"
import { AntDesign } from "@expo/vector-icons"
import { CameraView, useCameraPermissions } from "expo-camera"
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native"

import * as ImageManipulator from "expo-image-manipulator"

type CameraProps = {
	navigation: any
}

const Camera = ({ navigation }: CameraProps) => {
	const [permission, requestPermission] = useCameraPermissions()
	const cameraRef = useRef<CameraView | null>(null)
	const route = useRoute()
	const { isDNI = false, isRSH = false } = route.params as { isDNI?: boolean; isRSH?: boolean }

	if (!permission) return <View />

	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>Necesitamos tu permiso para mostrar la cámara</Text>
				<Button onPress={requestPermission} title="Conceder permiso" />
			</View>
		)
	}

	const takePhoto = async () => {
		if (cameraRef.current) {
			const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 })
			if (photo) {
				const { uri, width, height } = photo
				const { params } = route as any
				const targetScreen = params?.from === "DNI" ? "DNI" : "Social"

				const cropArea = isDNI
					? { originX: width * 0.1, originY: height * 0.35, width: width * 0.8, height: height * 0.3 } // Ajuste para cédula
					: { originX: width * 0.05, originY: height * 0.15, width: width * 0.9, height: height * 0.7 } // Ajuste para documento

				const croppedPhoto = await ImageManipulator.manipulateAsync(uri, [{ crop: cropArea }], {
					compress: 1,
					format: ImageManipulator.SaveFormat.JPEG,
				})

				navigation.navigate(targetScreen, { photoUri: croppedPhoto.uri })
			}
		}
	}

	const renderOverlay = (isDNI: boolean, isRSH: boolean) => {
		if (isDNI) {
			return (
				<>
					<View style={styles.overlayTopDNI} />
					<View style={styles.overlayLeftDNI} />
					<View style={styles.overlayRightDNI} />
					<View style={styles.overlayBottomDNI} />
					<View style={styles.borderContainerDNI}>
						<View style={styles.dniFrame} />
					</View>
				</>
			)
		} else if (isRSH) {
			return (
				<>
					<View style={styles.overlayTopRSH} />
					<View style={styles.overlayLeftRSH} />
					<View style={styles.overlayRightRSH} />
					<View style={styles.overlayBottomRSH} />
					<View style={styles.borderContainerRSH}>
						<View style={styles.rshFrame} />
					</View>
				</>
			)
		}
		return null
	}

	return (
		<View style={styles.container}>
			<CameraView style={styles.camera} ref={cameraRef} ratio="4:3">
				{renderOverlay(isDNI, isRSH)}
				<View style={styles.buttonContainer}>
					<TouchableOpacity style={styles.button} onPress={takePhoto}>
						<AntDesign name="camera" size={44} color="white" />
					</TouchableOpacity>
				</View>
			</CameraView>
		</View>
	)
}

export default Camera

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	message: {
		textAlign: "center",
		paddingBottom: 10,
	},
	camera: {
		flex: 1,
	},
	overlayTopDNI: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: "35%",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	overlayLeftDNI: {
		position: "absolute",
		top: "35%",
		left: 0,
		width: "10%",
		bottom: "35%",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	overlayRightDNI: {
		position: "absolute",
		top: "35%",
		right: 0,
		width: "10%",
		bottom: "35%",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	overlayBottomDNI: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: "35%",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	borderContainerDNI: {
		position: "absolute",
		top: "35%",
		left: "10%",
		right: "10%",
		bottom: "35%",
		borderColor: "white",
		borderWidth: 2,
	},
	dniFrame: {
		flex: 1,
		backgroundColor: "transparent",
	},
	overlayTopRSH: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: "15%",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	overlayLeftRSH: {
		position: "absolute",
		top: "15%",
		left: 0,
		width: "5%",
		bottom: "15%",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	overlayRightRSH: {
		position: "absolute",
		top: "15%",
		right: 0,
		width: "5%",
		bottom: "15%",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	overlayBottomRSH: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: "15%",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	borderContainerRSH: {
		position: "absolute",
		top: "15%",
		left: "5%",
		right: "5%",
		bottom: "15%",
		borderColor: "white",
		borderWidth: 2,
	},
	rshFrame: {
		flex: 1,
		backgroundColor: "transparent",
	},
	buttonContainer: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		marginBottom: 30,
	},
	button: {
		padding: 15,
		backgroundColor: "green",
		borderRadius: 5,
	},
})
