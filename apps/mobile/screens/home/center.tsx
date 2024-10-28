import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import DataDisplayer from "@/components/dataDisplayer"
import GeneralView from "@/components/generalView"
import MenuBar from "@/components/menuBar"
import { View, Text, StyleSheet } from "react-native"

const Center = ({ navigation }: any) => {
	return (
		<>
			<GeneralView title="Agendar Servicio">
				<View style={styles.bigContainer}>
					<View style={styles.topContainer}>
						<Text style={styles.textStyle}>Seleccione Centro Comunitario</Text>
					</View>
					<View style={styles.midContainer}>
						<DataDisplayer titleField="CC PEDRO DE VALDIVIA" />
						<DataDisplayer titleField="CC PEDRO DE VALDIVIA" />
						<DataDisplayer titleField="CC PEDRO DE VALDIVIA" />
						<DataDisplayer titleField="CC PEDRO DE VALDIVIA" />
						<DataDisplayer titleField="CC PEDRO DE VALDIVIA" />
						<DataDisplayer titleField="CC PEDRO DE VALDIVIA" />
					</View>
					<View style={styles.bottomContainer}></View>
				</View>
				<View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
					<CustomButton title="Volver" onPress={() => navigation.navigate("Home")} style={{ width: "40%", borderRadius: 20 }} />
					<CustomButton title="Siguiente" onPress={() => navigation.navigate("Home")} style={{ width: "40%", borderRadius: 20 }} />
				</View>
			</GeneralView>
			<MenuBar navigation={navigation} />
		</>
	)
}

export default Center

const styles = StyleSheet.create({
	bigContainer: {
		height: "80%",
		borderRadius: 20,
	},
	topContainer: {
		backgroundColor: Colors.green,
		height: "10%",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	midContainer: {
		height: "85%",
		width: "100%",
		backgroundColor: Colors.white,
		borderColor: Colors.green,
		borderWidth: 2,
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
	textStyle: {
		color: "white",
		fontSize: 18,
	},
})
