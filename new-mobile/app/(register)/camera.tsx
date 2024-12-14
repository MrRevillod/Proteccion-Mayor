import { useRouter } from "expo-router"
import { Dimensions } from "react-native"
import { CustomCamera } from "@/components/Camera"
import { useFormContext } from "react-hook-form"
import { useLocalSearchParams } from "expo-router/build/hooks"
import { DniCameraOverlay, RshCameraOverlay } from "@/components/CameraOverlays"

const CameraRegisterScreen = () => {
	const router = useRouter()
	const params = useLocalSearchParams()
	const methods = useFormContext()

	const handleCapture = (photoUri: string) => {
		methods.setValue(params.fieldName.toString(), photoUri)
		router.back()
	}

	const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

	const dniWidth = screenWidth * 0.8
	const dniHeight = dniWidth / 1.585

	const dniRectGenerator = (imageWidth: number, imageHeight: number) => {
		const widthRatio = imageWidth / screenWidth
		const heightRatio = imageHeight / screenHeight

		return {
			originX: ((screenWidth - dniWidth) / 2) * widthRatio,
			originY: ((screenHeight - dniHeight) / 2) * heightRatio,
			width: dniWidth * widthRatio,
			height: dniHeight * heightRatio,
		}
	}

	const rshWidth = screenWidth * 0.9
	const rshHeight = rshWidth / 0.7727

	const rshRectGenerator = (imageWidth: number, imageHeight: number) => {
		const widthRatio = imageWidth / screenWidth
		const heightRatio = imageHeight / screenHeight

		return {
			originX: ((screenWidth - rshWidth) / 2) * widthRatio,
			originY: ((screenHeight - rshHeight) / 2) * heightRatio,
			width: rshWidth * widthRatio,
			height: rshHeight * heightRatio,
		}
	}

	return (
		<CustomCamera
			onCapture={handleCapture}
			rectGenerator={params.fieldName.toString() === "social" ? rshRectGenerator : dniRectGenerator}
			overlay={params.fieldName.toString() === "social" ? <RshCameraOverlay /> : <DniCameraOverlay />}
		/>
	)
}

export default CameraRegisterScreen
