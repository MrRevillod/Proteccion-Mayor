import React, { useState, useEffect } from "react"
import { Professional, ReportType } from "@/lib/types"
import { SuperSelect } from "./ui/SuperSelect"
import { FormProvider, useForm } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"
import { Show } from "./ui/Show"
import { useRequest } from "@/hooks/useRequest"
import { getProfessionals } from "@/lib/actions"
import clsx from "clsx"

interface StatisticSelectionProps {
	setReportSelection: Dispatch<SetStateAction<ReportType>>
	setSelectedProfessional: Dispatch<SetStateAction<string>>
}

export const StatisticSelection: React.FC<StatisticSelectionProps> = ({ setReportSelection, setSelectedProfessional }) => {
	const methods = useForm({
		defaultValues: { statisticSelection: "general" },
	})

	const { watch } = methods
	const statisticSelection = watch("statisticSelection") as ReportType
	const selectedProfessional = watch("professionalId" as any)
	const [professionals, setProfessionals] = useState<Professional[]>([])

	useRequest<Professional[]>({
		action: getProfessionals,
		onSuccess: (data) => {
			setProfessionals(data)
		},
		onError: (error) => {
			console.error("Error al obtener profesionales:", error)
		},

	})
	console.log(selectedProfessional)
	useEffect(() => {
		setReportSelection(statisticSelection)
		if (selectedProfessional && statisticSelection === "byProfessional") {
			setSelectedProfessional(selectedProfessional)
		}

	}, [statisticSelection, setReportSelection, selectedProfessional])



	return (
		<FormProvider {...methods}>
			<form className={clsx(statisticSelection === "byProfessional" ? "w-full" : "w-1/2", "flex flex-row gap-4")} >
				<SuperSelect
					name="statisticSelection"
					label=""
					placeholder="Seleccione una opciÃ³n"
					options={[
						{ value: "general", label: "Reporte general de asistencia" },
						{ value: "byService", label: "Reporte de asistencia por servicio" },
						{ value: "byCenter", label: "Reporte de asistencia por centros" },
						{ value: "byProfessional", label: "Reporte de asistencia por profesional" },
					]}
				/>
				<Show when={statisticSelection === "byProfessional"}>

					<SuperSelect

						name="professionalId"
						label=""
						placeholder="Seleccione un profesional"
						options={professionals.map((professional) => ({
							value: professional.id,
							label: professional.name,
						}))}
					/>
				</Show>
			</form>
		</FormProvider >
	)
}