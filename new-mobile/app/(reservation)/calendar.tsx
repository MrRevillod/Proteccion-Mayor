import { useState } from "react"
import { useAlert } from "@/context/AlertContext"
import { useRequest } from "@/hooks/useRequest"
import { CalendarView } from "@/components/Calendar"
import { ReservationStep } from "@/components/ReservationStep"
import { getAvailableDates } from "@/lib/actions"
import { useLocalSearchParams, useRouter } from "expo-router"

const DateSelectionScreen = () => {
	const router = useRouter()

	const { alert } = useAlert()
	const { serviceId, centerId } = useLocalSearchParams()
	const [selectedDate, setSelectedDate] = useState<string | null>(null)

	const { data: availableDates, loading } = useRequest<string[]>({
		action: getAvailableDates,
		query: `serviceId=${serviceId}&centerId=${centerId}`,
	})

	const handleSelectDate = () => {
		if (!selectedDate) {
			return alert({
				variant: "simple",
				title: "Parece que no has seleccionado una fecha.",
				message: "Las fechas disponibles se muestran en color verde.",
			})
		}

		router.push({
			pathname: "/(reservation)/events",
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
