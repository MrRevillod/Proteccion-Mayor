import { Button } from "@/components/Button"
import { useState } from "react"
import { useRequest } from "@/hooks/useRequest"
import { primaryGreen } from "@/constants/Colors"
import { CalendarView } from "@/components/Calendar"
import { getAvailableDates } from "@/lib/actions"
import { MultiStepProgressBar } from "@/components/ProgressBar"
import { Alert, StyleSheet, Text, View } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { ReservationStep } from "@/components/ReservationStep"

const DateSelectionScreen = () => {
	const router = useRouter()
	const { serviceId, centerId } = useLocalSearchParams()
	const [selectedDate, setSelectedDate] = useState<string | null>(null)

	const { data: availableDates, loading } = useRequest<string[]>({
		action: getAvailableDates,
		query: `serviceId=${serviceId}&centerId=${centerId}`,
	})

	const handleSelectDate = () => {
		if (!selectedDate)
			return Alert.alert(
				"Parece que no has seleccionado una fecha.",
				"Las fechas disponibles se muestran en color verde."
			)

		router.push({
			pathname: "/(modals)/events",
			params: { date: selectedDate, serviceId, centerId },
		})
	}

	return (
		<ReservationStep
			title="Calendario de citas:"
			description="Seleccione una fecha disponible para continuar con la solicitud de tu cita."
			currentStep={3}
			continueHandler={() => handleSelectDate()}
			loading={loading}
		>
			<CalendarView
				markedDates={availableDates ?? []}
				onSelectDate={(date) => setSelectedDate(date)}
			/>
		</ReservationStep>
	)
}

export default DateSelectionScreen
