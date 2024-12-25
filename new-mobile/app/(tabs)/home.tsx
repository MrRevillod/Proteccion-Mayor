import { useState } from "react"
import { useAlert } from "@/context/AlertContext"
import { useRouter } from "expo-router"
import { useRequest } from "@/hooks/useRequest"
import { ServiceCard } from "@/components/ServiceCard"
import { Center, Service } from "@/lib/types"
import { StyleSheet, FlatList, View } from "react-native"
import { getCentersByService, getServices } from "@/lib/actions"

const HomeScreen = () => {
	const router = useRouter()

	const { showAlert } = useAlert()
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
			const message = `No se han encontrado centros de atención disponibles para este servicio.`
			showAlert({ title: "Ups!", message })
			return setSelectedService(null)
		}

		router.push({
			pathname: "/(reservation)/centers",
			params: { centers: JSON.stringify(data), serviceId: selectedService?.id },
		})

		setSelectedService(null)
	}

	const handleError = (error: any) => {
		showAlert({
			title: "Error",
			message: error.message ?? "Error desconocido. Intente nuevamente.",
		})
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
