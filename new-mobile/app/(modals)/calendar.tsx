import { Button } from "@/components/Button"
import { useState } from "react"
import { useRequest } from "@/hooks/useRequest"
import { primaryGreen } from "@/constants/Colors"
import { CalendarView } from "@/components/Calendar"
import { getAvailableDates } from "@/lib/actions"
import { MultiStepProgressBar } from "@/components/ProgressBar"
import { Alert, StyleSheet, Text, View } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"

const DateSelectionScreen = () => {
	const router = useRouter()
	const { serviceId, centerId } = useLocalSearchParams()
	const [selectedDate, setSelectedDate] = useState<string | null>(null)

	const { data: availableDates } = useRequest<string[]>({
		action: getAvailableDates,
		query: `serviceId=${serviceId}&centerId=${centerId}`,
	})

	const handleSelectDate = (date: string | null) => {
		if (!date) return Alert.alert("Seleccione una fecha para continuar.")

		router.push({
			pathname: "/(modals)/events",
			params: { date: selectedDate, serviceId, centerId },
		})
	}

	return (
		<View style={styles.container}>
			<View style={{ ...styles.dataContainer, paddingHorizontal: 15, marginTop: "12%" }}>
				<MultiStepProgressBar currentStep={3} nSteps={5} />
			</View>
			<View style={{ ...styles.dataContainer, padding: 15, height: "80%" }}>
				<View style={{ paddingVertical: 5, height: "20%" }}>
					<Text style={{ fontSize: 20, fontWeight: "500", marginBottom: 5 }}>
						Calendario de citas:
					</Text>
					<Text style={{ marginBottom: 15 }}>
						Seleccione una fecha disponible para continuar con la solicitud de tu cita.
					</Text>
					<Text>Las fechas en verde indican que hay citas disponibles.</Text>
				</View>

				<CalendarView
					markedDates={availableDates ?? []}
					onSelectDate={(date) => setSelectedDate(date)}
					style={{ height: "65%" }}
				/>

				<View style={styles.buttonsContainer}>
					<Button
						text="Volver"
						onPress={() => router.back()}
						variant="tertiary"
						size="md"
					/>
					<Button
						text="Siguiente"
						onPress={() => handleSelectDate(selectedDate)}
						size="md"
					/>
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

export default DateSelectionScreen
