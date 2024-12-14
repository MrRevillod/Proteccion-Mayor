import { Service } from "@/lib/types"
import { useState } from "react"
import { useRequest } from "@/hooks/useRequest"
import { getServices } from "@/lib/actions"
import { ServiceCard } from "@/components/ServiceCard"
import { StyleSheet, FlatList, View } from "react-native"

const HomeScreen = () => {
	const [services, setServices] = useState<Service[]>([])

	useRequest<Service[]>({
		action: getServices,
		onSuccess: (data) => {
			setServices(data)
		},
	})

	return (
		<View style={styles.container}>
			<FlatList
				style={styles.flatList}
				contentContainerStyle={styles.contentContainer}
				numColumns={2}
				columnWrapperStyle={styles.column}
				data={services}
				renderItem={({ item }) => <ServiceCard service={item} onPress={() => null} />}
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
