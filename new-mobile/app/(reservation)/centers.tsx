import { Center } from "@/lib/types"
import { useState } from "react"
import { useAlert } from "@/context/AlertContext"
import { CenterCard } from "@/components/CenterCard"
import { ReservationStep } from "@/components/ReservationStep"
import { FlatList, StyleSheet } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"

const CenterSelectionScreen = () => {
	const router = useRouter()
	const [selectedCenter, setSelectedCenter] = useState<Center | null>(null)

	const { showAlert } = useAlert()
	const { centers: data, serviceId } = useLocalSearchParams()
	const centers = JSON.parse(data as string)

	const handleSelectCenter = () => {
		if (!selectedCenter) {
			return showAlert({
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
			description="Seleccione el centro de atención que prefiera para continuar con la solicitud de su cita."
			currentStep={2}
			continueHandler={() => handleSelectCenter()}
		>
			<FlatList
				data={centers}
				numColumns={1}
				style={styles.flatList}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<CenterCard
						center={item}
						selected={selectedCenter?.id === item.id}
						onPress={() => setSelectedCenter(item)}
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
