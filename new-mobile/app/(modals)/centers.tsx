import { Center } from "@/lib/types"
import { Button } from "@/components/Button"
import { useState } from "react"
import { useRequest } from "@/hooks/useRequest"
import { CenterCard } from "@/components/CenterCard"
import { primaryGreen } from "@/constants/Colors"
import { getCentersByService } from "@/lib/actions"
import { MultiStepProgressBar } from "@/components/ProgressBar"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Alert, FlatList, StyleSheet, Text, View } from "react-native"

const CenterSelectionScreen = () => {
	const router = useRouter()
	const [selectedCenter, setSelectedCenter] = useState<Center | null>(null)

	const { serviceId } = useLocalSearchParams()
	const { data: centers } = useRequest<Center[]>({
		action: getCentersByService,
		params: { serviceId },
	})

	const handleSelectCenter = () => {
		if (!selectedCenter) {
			return Alert.alert("Seleccione un centro de atención para continuar.")
		}
		router.push({
			pathname: "/(modals)/calendar",
			params: { centerId: selectedCenter.id.toString(), serviceId },
		})
	}

	return (
		<View style={styles.container}>
			<View style={{ ...styles.dataContainer, paddingHorizontal: 15, marginTop: "12%" }}>
				<MultiStepProgressBar currentStep={2} nSteps={5} />
			</View>
			<View style={{ ...styles.dataContainer, padding: 15, height: "80%" }}>
				<View style={{ paddingVertical: 5 }}>
					<Text style={{ fontSize: 20, fontWeight: "500", marginBottom: 15 }}>
						Centros de atención disponibles:
					</Text>
					<Text>
						Seleccione el centro de atención que prefiera para continuar con la solicitud de su cita.
					</Text>
				</View>

				<FlatList
					data={centers}
					renderItem={({ item }) => (
						<CenterCard
							selected={selectedCenter?.id === item.id}
							center={item}
							onPress={() => setSelectedCenter(item)}
						/>
					)}
					keyExtractor={(item) => item.id.toString()}
					numColumns={1}
					style={styles.flatList}
				/>
				<View style={styles.buttonsContainer}>
					<Button text="Volver" onPress={() => router.back()} variant="tertiary" size="md" />
					<Button text="Continuar" onPress={() => handleSelectCenter()} variant="primary" size="md" />
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		width: "100%",
		padding: 15,
		gap: "2%",
		backgroundColor: primaryGreen,
		height: "100%",
	},
	dataContainer: {
		borderRadius: 15,
		backgroundColor: "white",
		width: "100%",
		gap: 15,
	},
	flatList: {
		width: "100%",
		gap: 15,
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		gap: 15,
	},
})

export default CenterSelectionScreen
