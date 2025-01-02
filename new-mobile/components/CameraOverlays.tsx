import React from "react"

import { Text } from "@/components/Text"
import { StyleSheet, View, Dimensions } from "react-native"
const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

const baseStyles = StyleSheet.create({
	overlay: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		width: "100%",
	},
	border: {
		borderColor: "white",
		borderWidth: 2,
		borderStyle: "dashed",
	},
})

export const DniCameraOverlay = () => {
	const dniWidth = screenWidth * 0.8
	const dniHeight = dniWidth / 1.585

	const dniBgVerticalHeight = (screenHeight - dniHeight) / 2
	const dniBgHorizontalWidth = (screenWidth - dniWidth) / 2

	const styles = StyleSheet.create({
		borderContainer: {
			height: dniHeight,
			width: dniWidth,
		},
		verticalDniBg: {
			position: "absolute",
			backgroundColor: "rgba(0, 0, 0, 0.4)",
			left: 0,
			right: 0,
			height: dniBgVerticalHeight,
		},
		horizontalDniBg: {
			position: "absolute",
			backgroundColor: "rgba(0, 0, 0, 0.4)",
			top: dniBgVerticalHeight,
			bottom: dniBgVerticalHeight,
			width: dniBgHorizontalWidth,
		},
	})

	return (
		<View style={baseStyles.overlay}>
			<View style={[styles.verticalDniBg, { top: 0 }]} />
			<View style={[styles.horizontalDniBg, { right: 0 }]} />
			<View>
				<Text style={{ color: "white", fontSize: 20, marginTop: -50 }}>
					Ubique la cédula en el recuadro
				</Text>
			</View>
			<View style={[styles.borderContainer, baseStyles.border]} />
			<View style={[styles.horizontalDniBg, { left: 0 }]} />
			<View style={[styles.verticalDniBg, { bottom: 0 }]} />
		</View>
	)
}

export const RshCameraOverlay = () => {
	const rshWidth = screenWidth * 0.9
	const rshHeight = rshWidth / 0.7727

	const styles = StyleSheet.create({
		borderContainer: {
			height: rshHeight,
			width: rshWidth,
		},
		verticalRshBg: {
			position: "absolute",
			backgroundColor: "rgba(0, 0, 0, 0.4)",
			left: 0,
			right: 0,
			height: (screenHeight - rshHeight) / 2,
		},
		horizontalRshBg: {
			position: "absolute",
			backgroundColor: "rgba(0, 0, 0, 0.4)",
			top: (screenHeight - rshHeight) / 2,
			bottom: (screenHeight - rshHeight) / 2,
			width: (screenWidth - rshWidth) / 2,
		},
	})

	return (
		<View style={baseStyles.overlay}>
			<View style={[styles.verticalRshBg, { top: 0 }]} />
			<View style={[styles.horizontalRshBg, { right: 0 }]} />
			<View>
				<Text style={{ color: "white", fontSize: 20, marginTop: -50 }}>
					Ubique el documento en el recuadro
				</Text>
			</View>
			<View style={[styles.borderContainer, baseStyles.border]} />
			<View style={[styles.horizontalRshBg, { left: 0 }]} />
			<View style={[styles.verticalRshBg, { bottom: 0 }]} />
		</View>
	)
}
