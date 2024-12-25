import React from "react"

import { primaryGreen } from "@/constants/Colors"
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from "react-native"

interface ButtonProps {
	text: string
	variant?: "primary" | "secondary" | "tertiary" | "quaternary"
	size?: "sm" | "md" | "lg" | "xl" | "xxl" | "full"
	onPress: () => void
	customFontSize?: number
}

export const Button: React.FC<ButtonProps> = ({ text, onPress, ...props }) => {
	const { variant = "primary", size = "lg", customFontSize } = props

	const buttonStyle: ViewStyle[] = [styles.button, styles[variant], styles[size]]
	const textStyle: TextStyle[] = [
		styles.buttonText,
		styles[`${variant}Text`],
		styles[`${size}Text`],
	]

	return (
		<TouchableOpacity style={buttonStyle} onPress={onPress}>
			<Text style={[...textStyle, customFontSize ? { fontSize: customFontSize } : {}]}>
				{text}
			</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	button: {
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 10,
	},

	primary: {
		backgroundColor: primaryGreen,
	},
	secondary: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: primaryGreen,
	},
	tertiary: {
		borderWidth: 1,
		borderColor: "#d4d3cf",
		backgroundColor: "transparent",
	},
	quaternary: {
		borderWidth: 1,
		borderColor: "#ccc",
		backgroundColor: "transparent",
	},
	sm: {
		width: "25%",
		paddingVertical: 4,
	},
	md: {
		width: "30%",
		paddingVertical: 10,
	},
	lg: {
		width: "100%",
	},
	xl: {
		width: "70%",
	},
	xxl: {
		width: "80%",
	},
	full: {
		width: "100%",
	},
	buttonText: {
		fontSize: 18,
		fontWeight: "bold",
	},
	smText: {
		fontSize: 14,
	},
	mdText: {
		fontSize: 16,
	},
	lgText: {
		fontSize: 16,
	},
	xlText: {
		fontSize: 20,
	},
	xxlText: {
		fontSize: 20,
	},
	fullText: {
		fontSize: 22,
	},
	primaryText: {
		color: "#fff",
	},
	secondaryText: {
		color: primaryGreen,
	},
	tertiaryText: {
		color: primaryGreen,
	},
	quaternaryText: {
		color: "#fcfcfc",
	},
})
