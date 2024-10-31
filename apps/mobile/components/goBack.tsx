import React from "react"

import { AntDesign } from "@expo/vector-icons"
import { TouchableOpacity, StyleSheet } from "react-native"

type GoBackButtonProps = {
	navigation: any
	visible?: boolean
}

const GoBackButton = ({ navigation, visible }: GoBackButtonProps) => {
	return (
		<>
			{visible && (
				<TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
					<AntDesign name="arrowleft" size={30} color="white" />
				</TouchableOpacity>
			)}
		</>
	)
}

export default GoBackButton

const styles = StyleSheet.create({
	button: {
		justifyContent: "center",
		position: "absolute",
		zIndex: 1,
		top: 50,
		left: 20,
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 18,
		textAlign: "center",
	},
})
