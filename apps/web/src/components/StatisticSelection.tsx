import React from "react"

import { ReportType } from "@/lib/types"
import { SuperSelect } from "./ui/SuperSelect"
import { FormProvider, useForm } from "react-hook-form"
import { useEffect, Dispatch, SetStateAction } from "react"

interface StatisticSelectionProps {
	setReportSelection: Dispatch<SetStateAction<ReportType>>
}

export const StatisticSelection: React.FC<StatisticSelectionProps> = ({ setReportSelection }) => {
	const methods = useForm({
		defaultValues: { statisticSelection: "general" },
	})

	const { watch } = methods
	const statisticSelection = watch("statisticSelection") as ReportType

	useEffect(() => {
		setReportSelection(statisticSelection)
	}, [statisticSelection, setReportSelection])

	return (
		<FormProvider {...methods}>
			<form className="w-1/2">
				<SuperSelect
					name="statisticSelection"
					label=""
					placeholder="Seleccione una opción"
					options={[
						{ value: "general", label: "Reporte general de asistencia" },
						{ value: "byService", label: "Reporte de asistencia por servicio" },
						{ value: "byCenter", label: "Reporte de asistencia por centros" },
					]}
				/>
			</form>
		</FormProvider>
	)
}
