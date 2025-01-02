import React from "react"

import { Text } from "@/components/Text"
import { primaryGreen } from "@/constants/Colors"
import { View, StyleSheet } from "react-native"

interface Props {
	currentStep: number
	nSteps: number
}

export const MultiStepProgressBar: React.FC<Props> = ({ currentStep, nSteps }) => {
	return (
		<View style={styles.container}>
			{Array.from({ length: nSteps }).map((_, index) => (
				<View key={index} style={styles.stepContainer}>
					<View style={[styles.circle, currentStep >= index + 1 && styles.activeCircle]}>
						<Text style={styles.circleText}>{index + 1}</Text>
					</View>
					{index < nSteps - 1 && (
						<View style={[styles.line, currentStep > index + 1 && styles.activeLine]} />
					)}
				</View>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		marginVertical: 20,
		width: "100%",
	},
	stepContainer: {
		alignItems: "center",
		position: "relative",
	},
	circle: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#e0e0e0",
		justifyContent: "center",
		alignItems: "center",
	},
	activeCircle: {
		backgroundColor: primaryGreen,
	},
	circleText: {
		color: "#fff",
		fontWeight: "bold",
	},
	line: {
		position: "absolute",
		top: 20,
		left: 40,
		width: 60,
		height: 2,
		backgroundColor: "#e0e0e0",
	},
	activeLine: {
		backgroundColor: primaryGreen,
	},
})
