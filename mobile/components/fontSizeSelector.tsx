import React from "react"
import Slider from "@react-native-community/slider"
import AppText from "./appText"

import { useFontSize } from "@/contexts/fontSizeContext"
import { View, StyleSheet, TouchableOpacity, TextStyle, ViewStyle, Dimensions, Text } from "react-native"
import { useEffect, useState } from "react"
import Colors from "./colors"

const { height } = Dimensions.get("window")

type CustomCustomButton2Props = {
    title: string
    onPress: () => void
    style?: ViewStyle
    textStyle?: TextStyle
}

const CustomButton2 = ({ title, onPress, style, textStyle }: CustomCustomButton2Props) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.CustomButton2, style]}>
            <Text style={[styles.CustomButton2Text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    )
}

const FontSizeSelector: React.FC = ({ navigation }: any) => {
	const [initialFs, setInitialFs] = useState(0)
	const { changeFontSize, fontSize } = useFontSize()

	useEffect(() => {
		if (initialFs === 0) setInitialFs(fontSize)
	}, [fontSize])
	return (
        <View style={styles.container}>
            <View style={styles.head}>
                <AppText style={styles.textHead}>Muestra de texto</AppText>
            </View>
            <View style={styles.body}>


			<Slider
                    style={{ width: 200, height: 100 }}
                    minimumValue={20}
				maximumValue={40}
				step={1}
				value={fontSize}
				onValueChange={(value) => {
					changeFontSize(value)
				}}

			/>
                <CustomButton2
				title="Guardar"
				onPress={() => {
                    navigation.navigate("Profile")
				}}
			/>
                <CustomButton2
				title="Cancelar"
				onPress={() => {
					console.log(initialFs)
					changeFontSize(initialFs)
                    navigation.navigate("Profile")
				}}
			/>
            </View>
        </View>
	)
}

const styles = StyleSheet.create({
    CustomButton2: {
        borderRadius: 10,
        marginVertical: 5,
        justifyContent: "center",
        width: "auto",
        height: height * 0.05,
        backgroundColor: Colors.green,
        paddingVertical: 0,
        paddingHorizontal: 20,
    },
    CustomButton2Text: {
        color: "#FFFFFF",
        textAlign: "center",
        fontSize: 18,
    },
    head: {
        color: Colors.white,
        backgroundColor: Colors.green,
        padding: 10,
        minHeight: "50%",
        display: "flex",
        justifyContent: "center",
    },
    body: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    textHead: {
        color: Colors.white,
        textAlign: "center",
    },
    container: {
        display: "flex",
        justifyContent: "center",
    },
})

export default FontSizeSelector
