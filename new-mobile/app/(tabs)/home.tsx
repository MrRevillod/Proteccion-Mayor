import { useState } from "react"
import { useRouter } from "expo-router"
import { useRequest } from "@/hooks/useRequest"
import { ServiceCard } from "@/components/ServiceCard"
import { Center, Service } from "@/lib/types"
import { getCentersByService, getServices } from "@/lib/actions"
import { StyleSheet, FlatList, View, Alert } from "react-native"

const HomeScreen = () => {
	const router = useRouter()

	const [selectedService, setSelectedService] = useState<Service | null>(null)

	const { data: services } = useRequest<Service[]>({
		action: getServices,
	})

	useRequest<Center[]>({
		action: getCentersByService,
		params: { serviceId: selectedService?.id },
		trigger: selectedService !== null,
		onSuccess: (data) => handleSuccess(data),
		onError: (error) => handleError(error),
	})

	const handleSuccess = (data: Center[]) => {
		if (data.length === 0) {
			Alert.alert(
				"Error",
				"No se han encontrado centros de atención disponibles para este servicio."
			)

			return setSelectedService(null)
		}

		router.push({
			pathname: "/(reservation)/centers",
			params: { centers: JSON.stringify(data), serviceId: selectedService?.id },
		})

		setSelectedService(null)
	}

	const handleError = (error: any) => {
		Alert.alert("Error", error.message || "Error desconocido. Intente nuevamente.")
		return setSelectedService(null)
	}

	return (
		<View style={styles.container}>
			<FlatList
				style={styles.flatList}
				contentContainerStyle={styles.contentContainer}
				numColumns={2}
				columnWrapperStyle={styles.column}
				data={services}
				renderItem={({ item }) => (
					<ServiceCard service={item} onPress={() => setSelectedService(item)} />
				)}
				keyExtractor={(item) => item.id.toString()}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		margin: 15,
		borderRadius: 15,
		backgroundColor: "white",
	},
	flatList: {
		width: "100%",
		padding: 15,
	},
	contentContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	column: {
		marginVertical: 5,
		justifyContent: "space-between",
		gap: 15,
	},
})

export default HomeScreen
