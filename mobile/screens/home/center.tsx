import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import DataDisplayer from "@/components/dataDisplayer"
import GeneralView from "@/components/generalView"
import MenuBar from "@/components/menuBar"
import { makeAuthenticatedRequest, SERVER_URL } from "@/utils/request" // Usa tu función de petición
import { useRoute } from "@react-navigation/native" // Para obtener parámetros de navegación

interface Center {
	id: number
	name: string
	address: string
}

const CenterScreen = ({ navigation }: any) => {
	const [centers, setCenters] = useState<Center[]>([])
	const route = useRoute()
	const { serviceId } = route.params as { serviceId: number }

	useEffect(() => {
		const fetchCenters = async () => {
			try {
				const response = await makeAuthenticatedRequest(`${SERVER_URL}/api/dashboard/events/${serviceId}`, "GET")
				if (response?.data) {
					const centerList = response.data.centers.map((item: { center: Center }) => item.center)
					setCenters(centerList)
				}
			} catch (error) {
				console.error("Error fetching centers:", error)
			}
		}

		if (serviceId) {
			fetchCenters()
		}
	}, [serviceId])

	return (
		<>
			<GeneralView title="Agendar Servicio">
				<View style={styles.bigContainer}>
					<View style={styles.topContainer}>
						<Text style={styles.textStyle}>Seleccione Centro Comunitario</Text>
					</View>
					<View style={styles.midContainer}>
						{centers.map((center) => (
							<TouchableOpacity
								key={center.id}
								onPress={() => navigation.navigate("Events", { serviceId, centerId: center.id })}>
								<DataDisplayer titleField={center.name} descriptionField={center.address} isCC />
							</TouchableOpacity>
						))}
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

export default CenterScreen

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
	textStyle: {
		color: "white",
		fontSize: 18,
	},
})
