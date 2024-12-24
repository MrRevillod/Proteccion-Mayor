import React from "react"
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from "react-native"
import { primaryGreen } from "@/constants/Colors"

/**
 * Props for the Button component.
 */
interface ButtonProps {
	/**
	 * The text to display on the button.
	 */
	text: string

	/**
	 * The variant of the button.
	 * @default "primary"
	 */
	variant?: "primary" | "secondary" | "tertiary" | "quaternary"

	/**
	 * The size variant of the button.
	 * - `sm`: 25% width, smaller font and height
	 * - `md`: 30% width, medium font and height
	 * - `lg`: 50% width
	 * - `xl`: 70% width
	 * - `full`: 100% width
	 * @default "sm"
	 */
	size?: "sm" | "md" | "lg" | "xl" | "xxl" | "full"

	/**
	 * Function to call when the button is pressed.
	 */
	onPress: () => void
}

/**
 * A customizable button component.
 *
 * @param {ButtonProps} props - The props for the button.
 */
export const Button = ({ text, onPress, variant = "primary", size = "sm" }: ButtonProps) => {
	const buttonStyle: ViewStyle[] = [styles.button, styles[variant], styles[size]]
	const textStyle: TextStyle[] = [styles.buttonText, styles[`${variant}Text`], styles[`${size}Text`]]

	return (
		<TouchableOpacity style={buttonStyle} onPress={onPress}>
			<Text style={textStyle}>{text}</Text>
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
		borderWidth: 2,
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
		width: "50%",
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
		fontSize: 18,
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
		fontSize: 16,
	},
	quaternaryText: {
		color: "#fcfcfc",
		fontSize: 16,
	},
})
