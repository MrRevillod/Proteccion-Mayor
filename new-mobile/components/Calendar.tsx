import React from "react"
import dayjs from "dayjs"

import "dayjs/locale/es"

dayjs.locale("es")

import { Alert } from "react-native"
import { useState } from "react"
import { primaryGreen } from "@/constants/Colors"
import { CustomDayComponent } from "./CustomDay"
import { Calendar, LocaleConfig } from "react-native-calendars"

interface Props {
	markedDates: string[]
	onSelectDate: (date: string) => void
}

export const CalendarView: React.FC<Props> = ({ markedDates, onSelectDate }) => {
	const [selectedDate, setSelectedDate] = useState<string | null>(null)
	const currentDate = dayjs().format("YYYY-MM-DD")

	const handleSelectDate = (date: string) => {
		const selectedDateObj = dayjs(date)

		if (selectedDateObj.isBefore(dayjs(currentDate))) {
			return Alert.alert("No es posible seleccionar una fecha anterior a la actual.")
		}

		if (!markedDates.includes(date)) {
			return Alert.alert("No hay citas disponibles para esta fecha.")
		}

		const isWeekend = selectedDateObj.day() === 0 || selectedDateObj.day() === 6

		if (isWeekend) return Alert.alert("No puedes seleccionar un fin de semana.")

		setSelectedDate(date)
		onSelectDate(date)
	}

	return (
		<Calendar
			minDate={currentDate}
			current={currentDate}
			dayComponent={({ date, state }: any) => (
				<CustomDayComponent
					onPress={() => handleSelectDate(date.dateString)}
					date={date}
					state={state}
					isSelected={date.dateString === selectedDate}
					isMarked={markedDates.includes(date.dateString)}
				/>
			)}
			style={{
				borderRadius: 15,
				width: "100%",
				height: "62%",
				alignSelf: "center",
				marginTop: "5%",
				marginBottom: "-5%",
			}}
			theme={{
				arrowColor: primaryGreen,
				textMonthFontWeight: "bold",
			}}
		/>
	)
}

LocaleConfig.locales["es"] = {
	monthNames: [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre",
	],
	monthNamesShort: [
		"Ene.",
		"Feb.",
		"Mar",
		"Abr",
		"May",
		"Jun",
		"Jul.",
		"Ago",
		"Sep",
		"Oct",
		"Nov",
		"Dic",
	],
	dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
	dayNamesShort: ["Dom.", "Lun.", "Mar.", "Mié.", "Jue.", "Vie.", "Sáb."],
	today: "Hoy",
}

LocaleConfig.defaultLocale = "es"
