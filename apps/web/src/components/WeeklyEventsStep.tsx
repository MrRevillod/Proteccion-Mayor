import dayjs from "dayjs"
import React, { useEffect } from "react"

import { TimeSelect } from "./ui/TimeSelect"
import { SuperSelect } from "./ui/SuperSelect"
import { useFormContext } from "react-hook-form"
import { SuperSelectField } from "@/lib/types"

interface Props {
	centers: SuperSelectField[]
	dailySessions: number
	minutesPerSession: number
	date: string
	day: string
	setModalSize: (size: string) => void
}

export const WeeklyEventsStep: React.FC<Props> = ({ centers, ...props }) => {
	const { setValue, watch } = useFormContext()
	const { dailySessions, date, day, minutesPerSession, setModalSize } = props

	const selectedCenterId = watch(`${date}-centerId`)

	useEffect(() => {
		if (selectedCenterId) setModalSize("large")
	}, [selectedCenterId, setModalSize])

	return (
		<div className="flex flex-col gap-4">
			<p className="text-base">
				Selecciona las atenciones diarias del día{" "}
				<strong>{day + " " + dayjs(date).format("DD/MM/YYYY")}</strong>
			</p>

			<SuperSelect
				label="Selecciona un centro de atención"
				options={centers}
				name={`${date}-centerId`}
			/>

			{dailySessions ? <h2 className="text-base">Horas de atención:</h2> : null}

			<div className="grid grid-rows-5 grid-flow-col gap-x-10 gap-y-8">
				{Array.from({ length: dailySessions }).map((_, index) => {
					const start = dayjs()
						.hour(9)
						.minute(0)
						.add(index * minutesPerSession, "minute")

					const end = start.add(minutesPerSession, "minute")

					setValue(`${date}[${index}].start`, start.format("HH:mm"))
					setValue(`${date}[${index}].end`, end.format("HH:mm"))

					return (
						<div key={index} className="flex gap-4 items-center">
							<span className="-mb-6">{index + 1}</span>
							<div className="flex flex-row gap-2 w-full">
								<TimeSelect label="Inicio" name={`${date}[${index}].start`} />
								<TimeSelect label="Término" name={`${date}[${index}].end`} />
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
