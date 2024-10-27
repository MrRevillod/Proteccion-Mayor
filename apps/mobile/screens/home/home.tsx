import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView } from "react-native"
import MenuBar from "@/components/menuBar"
import GeneralView from "@/components/generalView"
import Colors from "@/components/colors"
import { makeAuthenticatedRequest, SERVER_URL } from "@/utils/request"
import { useEffect, useState } from "react"
import { AntDesign } from "@expo/vector-icons"

const { width } = Dimensions.get("window")
const itemSize = width * 0.32 // Tamaño del grid item
const numRows = 3
const spacing = 20 // Espacio entre elementos

// Define la interfaz para un servicio
interface Service {
	id: number
	name: string
	title: string
	description: string
	color: string
}

interface ResponseData {
	values: Service[]
}

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
	const [services, setServices] = useState<Service[]>([])

	useEffect(() => {
		const getServices = async () => {
			try {
				const response = await makeAuthenticatedRequest(`${SERVER_URL}/api/dashboard/services/`, "GET")
				if (response?.data) {
					const data: ResponseData = response.data
					setServices(data.values)
				}
			} catch (error) {
				console.error("Error fetching services:", error)
			}
		}
		getServices()
	}, [])

	return (
		<>
			<GeneralView title="Home" noBorders={true} hTitle={true}>
				<View>
					<ScrollView
						style={{
							height: "89%", // Altura ajustada para 2 filas
						}}
						showsVerticalScrollIndicator={false} // Oculta la barra de scroll
					>
						<View style={styles.gridContainer}>
							{services.map((service) => (
								<TouchableOpacity key={service.id} style={styles.gridItem}>
									<View style={[styles.iconContainer, { backgroundColor: service.color }]}>
										<Image
											source={{ uri: `${SERVER_URL}/api/storage/public/services/${service.id}.webp` }}
											style={styles.iconImage}
											resizeMode="cover"
										/>
									</View>
									<Text style={styles.serviceText}>{service.name}</Text>
								</TouchableOpacity>
							))}
							<TouchableOpacity style={styles.gridItem}>
								<View style={styles.iconContainer}>
									<AntDesign name="user" size={width * 0.2} color="white" />
								</View>
								<Text style={styles.serviceText}>Perfil</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
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
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		height: "10%",
	},
	gridItem: {
		width: "45%",
		alignItems: "center",
		marginBottom: spacing,
	},
	iconContainer: {
		width: itemSize,
		height: itemSize,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		elevation: 10,
		backgroundColor: Colors.green,
	},
	iconImage: {
		width: "100%",
		height: "100%",
		borderRadius: 20,
	},
	serviceText: {
		marginTop: 5,
		textAlign: "center",
		color: "#000",
		fontWeight: "bold",
		fontSize: 16,
	},
})

export default Home
