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
import { DatetimeSelect } from "./ui/DatetimeSelect"

interface StatisticSelectionProps {
	setReportSelection: Dispatch<SetStateAction<ReportType>>
	setSelectedProfessional: Dispatch<SetStateAction<SelectedProfessional>>
}

export const StatisticSelection: React.FC<StatisticSelectionProps> = ({
	setReportSelection,
	setSelectedProfessional,
}) => {
	const methods = useForm({})

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
				id: selectedProfessional,
				name: "",
			})
		}
	}, [statisticSelection, setReportSelection, selectedProfessional])

	return (
		<FormProvider {...methods}>
			<form className={clsx(statisticSelection === "byProfessional" ? "w-full" : "w-1/2", "flex flex-row gap-4")}>
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

				<div className={clsx(statisticSelection === "byProfessional" ? "w-1/2" : "w-full flex")}>
					<DatetimeSelect label="Desde" name="from" />
					<DatetimeSelect label="Hasta" name="to" />
				</div>
			</form>
		</FormProvider>
	)
}
