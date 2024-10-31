import React from "react"
import Slider from "@react-native-community/slider"
import AppText from "./appText"
import CustomButton from "./button"

import { useFontSize } from "@/contexts/fontSizeContext"
import { View, StyleSheet } from "react-native"
import { useEffect, useState } from "react"

const FontSizeSelector: React.FC = ({ navigation }: any) => {
	const [initialFs, setInitialFs] = useState(0)
	const { changeFontSize, fontSize } = useFontSize()

	useEffect(() => {
		if (initialFs === 0) setInitialFs(fontSize)
	}, [fontSize])
	return (
		<View style={styles.container}>
			<Slider
				style={{ width: 200, height: 40 }}
				minimumValue={1}
				maximumValue={40}
				step={1}
				value={fontSize}
				onValueChange={(value) => {
					changeFontSize(value)
				}}
				minimumTrackTintColor="#FFFFFF"
				maximumTrackTintColor="#000000"
			/>
			<AppText>Acá podemos observer el effecto del fontSizeSelector</AppText>
			<CustomButton
				title="Guardar"
				onPress={() => {
					navigation.navigate("Menu")
				}}
			/>
			<CustomButton
				title="Cancelar"
				onPress={() => {
					console.log(initialFs)
					changeFontSize(initialFs)
					navigation.navigate("Menu")
				}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "space-around",
		marginVertical: 50,
	},
})

export default FontSizeSelector
