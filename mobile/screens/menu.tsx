import React from "react"
import Colors from "@/components/colors"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"

import { StyleSheet } from "react-native"
import { commonProps } from "@/utils/types"

const Menu = ({ navigation }: commonProps) => {
	return (
		<GeneralView title="Bienvenido" textTitle="¿Es su primera vez usando Protección Mayor?">
			<CustomButton title="Si" onPress={() => navigation.navigate("Register")} style={{ marginTop: 20, width: "85%", alignSelf: "center" }} />
			<CustomButton
				title="No"
				style={{ backgroundColor: Colors.white, borderColor: Colors.green, borderWidth: 2, width: "85%", alignSelf: "center", marginTop: 20 }}
				textStyle={styles.customButtonText}
				onPress={() => navigation.navigate("Login")}
            />
		</GeneralView>
	)
}

export default Menu

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},
	customButtonText: {
		color: Colors.green,
	},
})
