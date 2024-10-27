import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from "react-native"
import MenuBar from "@/components/menuBar"
import GeneralView from "@/components/generalView"
import Colors from "@/components/colors"
import { makeAuthenticatedRequest, SERVER_URL } from "@/utils/request"
import { useEffect } from "react"

const { width } = Dimensions.get("window")

const services = [
	{ name: "Atención Social" },
	{ name: "Asesoría Jurídica" },
	{ name: "Psicología" },
	{ name: "Fonoaudiología" },
	{ name: "Podología" },
	{ name: "Kinesiología" },
	{ name: "Peluquería" },
	{ name: "Mi Perfil" },
]

const Home = ({ navigation }: any) => {
	useEffect(() => {
		const getServices = async () => {
			const response = await makeAuthenticatedRequest(`${SERVER_URL}/api/dashboard/services/`, "GET")
			console.warn(response?.data)
		}
		getServices()
	}, [])

	return (
		<>
			<GeneralView title="HOLA" noBorders={true} hasImage={true}>
				<View style={styles.gridContainer}>
					{services.map((service, index) => (
						<TouchableOpacity key={index} style={styles.gridItem}>
							<View style={styles.iconContainer}>
								<Image
									source={{ uri: `${SERVER_URL}/api/storage/public/services/${index + 1}.webp` }}
									style={styles.iconImage} // Nueva clase de estilo
									resizeMode="cover" // Para que la imagen ocupe el espacio completo y se ajuste
								/>
							</View>
							<Text style={styles.serviceText}>{service.name}</Text>
						</TouchableOpacity>
					))}
				</View>
			</GeneralView>
			<MenuBar
				onPress={() => {
					navigation.navigate("Menu")
				}}
			/>
		</>
	)
}

const styles = StyleSheet.create({
	gridContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	gridItem: {
		width: "50%", // Ajusta el ancho para encajar dos columnas
		alignItems: "center",
	},
	iconContainer: {
		width: width * 0.25,
		height: width * 0.25,
		backgroundColor: Colors.green,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		// Sombra iOS
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		// Sombra Android
		elevation: 20,
	},
	iconImage: {
		width: "100%", // Ajusta la imagen al tamaño del contenedor
		height: "100%", // Ajusta la imagen al tamaño del contenedor
		borderRadius: 20, // Asegura que la imagen siga la misma forma redondeada que el contenedor
	},
	serviceText: {
		marginTop: 5,
		marginBottom: 15,
		textAlign: "center",
		color: "#000",
		fontWeight: "bold",
	},
})

export default Home
