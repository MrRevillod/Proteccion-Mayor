import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import React from "react"
const width = Dimensions.get("window")

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
