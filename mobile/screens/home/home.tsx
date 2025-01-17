import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView } from "react-native"
import MenuBar from "@/components/menuBar"
import GeneralView from "@/components/generalView"
import Colors from "@/components/colors"
import { makeAuthenticatedRequest, SERVER_URL } from "@/utils/request"
import { useEffect, useState } from "react"
import LoadingScreen from "@/components/loadingScreen"

const { width } = Dimensions.get("window")
const itemSize = width * 0.32 // Tamaño del grid item
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

const Home = ({ navigation }: any) => {
	const [services, setServices] = useState<Service[]>([])
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		const getServices = async () => {
			setLoading(true)

			makeAuthenticatedRequest(`${SERVER_URL}/api/dashboard/services/`, "GET", navigation).then((response) => {
				if (response?.data) {
					const data: ResponseData = response.data
					setServices(data.values)
				}
			})
			setLoading(false)
		}
		getServices()
	}, [])

	return (
		<>
			{loading && <LoadingScreen />}
			<GeneralView title="Home" noBorders={true} hTitle={true} navigation={navigation}>
				<View>
					<ScrollView
						style={{
							height: "87%",
						}}
						showsVerticalScrollIndicator={false}
					>
						<View style={styles.gridContainer}>
							{services.map((service) => (
								<TouchableOpacity
									key={service.id}
									style={styles.gridItem}
									onPress={() => navigation.navigate("Centers", { serviceId: service.id })}
								>
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
						</View>
					</ScrollView>
				</View>
			</GeneralView>
			<MenuBar navigation={navigation} />
		</>
	)
}

export default Home

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
