import React from "react"
import Colors from "@/components/colors"
import AppText from "./appText"

import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle, Dimensions } from "react-native"

const { height } = Dimensions.get("window")

type CustomButtonProps = {
	title: string
	onPress: () => void
	style?: ViewStyle
	textStyle?: TextStyle
}

const CustomButton = ({ title, onPress, style, textStyle }: CustomButtonProps) => {
	return (
		<TouchableOpacity onPress={onPress} style={[styles.button, style]}>
			<AppText style={[styles.buttonText, textStyle]}>{title}</AppText>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	button: {
		borderRadius: 10,
		marginVertical: 5,
		justifyContent: "center",
		width: "auto",
		height: height * 0.05,
		backgroundColor: Colors.green,
	},
	buttonText: {
		color: "#FFFFFF",
		textAlign: "center",
	},
})

export default CustomButton
