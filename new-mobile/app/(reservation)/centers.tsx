import { Center } from "@/lib/types"
import { useState } from "react"
import { useAlert } from "@/context/AlertContext"
import { SelectableItem } from "@/components/SelectableItem"
import { ReservationStep } from "@/components/ReservationStep"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import { FlatList, StyleSheet } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"

const CenterSelectionScreen = () => {
	useProtectedRoute()

	const router = useRouter()
	const [selectedCenter, setSelectedCenter] = useState<Center | null>(null)

	const { alert } = useAlert()
	const { centers: data, serviceId } = useLocalSearchParams()
	const centers = JSON.parse(data as string)

	const handleSelectCenter = () => {
		if (!selectedCenter) {
			return alert({
				variant: "simple",
				title: "Ups!",
				message: "Debes seleccionar un centro de atención para continuar.",
			})
		}

		router.push({
			pathname: "/(reservation)/calendar",
			params: { centerId: selectedCenter.id.toString(), serviceId },
		})
	}

	return (
		<ReservationStep
			title="Centros de atención disponibles:"
			description="Seleccione el centro de atención de su preferencia."
			currentStep={2}
			continueHandler={() => handleSelectCenter()}
		>
			<FlatList
				data={centers}
				numColumns={1}
				style={styles.flatList}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<SelectableItem
						title={item.name}
						subtitle={item.address}
						imageUri={`/centers/${item.id}.webp`}
						onPress={() => setSelectedCenter(item)}
						selected={selectedCenter?.id === item.id}
					/>
				)}
			/>
		</ReservationStep>
	)
}

const styles = StyleSheet.create({
	flatList: {
		gap: 15,
		borderRadius: 15,
		width: "100%",
		height: "62%",
	},
})

export default CenterSelectionScreen
