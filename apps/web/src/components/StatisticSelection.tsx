import clsx from "clsx"
import React from "react"

import { Show } from "./ui/Show"
import { useRequest } from "@/hooks/useRequest"
import { SuperSelect } from "./ui/SuperSelect"
import { getProfessionals } from "@/lib/actions"
import { useState, useEffect } from "react"
import { SelectedProfessional } from "@/pages/administration/Statistics"
import { FormProvider, useForm } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"
import { Professional, ReportType } from "@/lib/types"

interface StatisticSelectionProps {
	setReportSelection: Dispatch<SetStateAction<ReportType>>
	setSelectedProfessional: Dispatch<SetStateAction<SelectedProfessional>>
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
	})

	useEffect(() => {
		setReportSelection(statisticSelection)
		if (selectedProfessional && statisticSelection === "byProfessional") {
			setSelectedProfessional({
				id: selectedProfessional, name: "",
			})
		}

	}, [statisticSelection, setReportSelection, selectedProfessional])

	return (
		<FormProvider {...methods}>
			<form className={clsx(statisticSelection === "byProfessional" ? "w-full" : "w-1/2", "flex flex-row gap-4")} >
				<Show when={statisticSelection === "byProfessional"}>
					<div className="w-1/2">
						<SuperSelect
							name="professionalId"
							label=""
							placeholder="Seleccione un profesional"
							options={professionals.map((professional) => ({
								value: professional.id,
								label: professional.name,
							}))}
						/>
					</div>
				</Show>

				<div className={clsx(statisticSelection === "byProfessional" ? "w-1/2" : "w-full")}>
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
				</div>
			</form>
		</FormProvider >
	)
}