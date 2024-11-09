import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar, Animated } from "react-native"
import Colors from "@/components/colors"
import GeneralView from "@/components/generalView"
import MenuBar from "@/components/menuBar"

const { width } = Dimensions.get("window")

const Schelude = ({ navigation }: any) => {
	const [selectedButton, setSelectedButton] = useState<number>(0)
	const slideAnim = new Animated.Value(0)

	// Función para manejar la animación del deslizador
	const handlePress = (index: number) => {
		setSelectedButton(index)

		// Animar el deslizador hacia el botón seleccionado
		Animated.timing(slideAnim, {
			toValue: index === 0 ? 0 : width * 0.5,
			duration: 300,
			useNativeDriver: true,
		}).start()
	}

	return (
		<>
			<GeneralView title="Agenda" noBorders>
				<View style={styles.bigContainer}>
					<View style={styles.buttonsContainer}>
						<Animated.View style={[styles.slider, { transform: [{ translateX: slideAnim }] }]} />

						<TouchableOpacity style={[styles.button, selectedButton === 0 && styles.buttonActive]} onPress={() => handlePress(0)}>
							<Text style={[styles.buttonText, selectedButton === 0 && styles.buttonTextActive]}>Próximas Horas</Text>
						</TouchableOpacity>

						<TouchableOpacity style={[styles.button, selectedButton === 1 && styles.buttonActive]} onPress={() => handlePress(1)}>
							<Text style={[styles.buttonText, selectedButton === 1 && styles.buttonTextActive]}>Horas Finalizadas</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.midContainer}></View>
					<View style={styles.bottomContainer}></View>
				</View>
			</GeneralView>
			<MenuBar navigation={navigation} />
		</>
	)
}

export default Schelude

const styles = StyleSheet.create({
	bigContainer: {
		height: "86%",
	},
	buttonsContainer: {
		flexDirection: "row",
		position: "relative",
		width: "100%",
		height: "10%",
		backgroundColor: Colors.white,
		borderColor: Colors.green,
		borderWidth: 2,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		overflow: "hidden",
	},
	midContainer: {
		height: "85%",
		width: "100%",
		backgroundColor: Colors.white,
		borderColor: Colors.green,
		borderLeftWidth: 2,
		borderRightWidth: 2,
		padding: 10,
		margin: 0,
	},
	bottomContainer: {
		backgroundColor: Colors.green,
		height: "5%",
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
	},
	button: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.white,
	},
	buttonActive: {
		backgroundColor: Colors.green,
	},
	buttonText: {
		fontSize: 16,
		color: Colors.green,
		fontWeight: "600",
	},
	buttonTextActive: {
		color: Colors.white,
	},
	slider: {
		position: "absolute",
		width: "50%",
		height: "100%",
		backgroundColor: Colors.green,
	},
})
