import React from "react"
import dayjs from "dayjs"

import { SuperSelectField } from "@/lib/types"
import { useFormContext } from "react-hook-form"
import { SuperSelect } from "./ui/SuperSelect"
import { TimeSelect } from "./ui/TimeSelect"

interface Props {
	centers: SuperSelectField[]
	dailySessions: number
	minutesPerSession: number
	date: string
	day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday"
	setModalSize: (size: string) => void
}

export const WeeklyEventsStep: React.FC<Props> = ({ centers, ...props }) => {
	const { setValue, watch } = useFormContext()
	const { dailySessions, date, day, minutesPerSession, setModalSize } = props

	watch(`${day}-centerId`) && setModalSize("large")

	return (
		<div className="flex flex-col gap-4">
			<p className="text-base">
				Selecciona las atenciones diarias del día <strong>{date}</strong>
			</p>
			<SuperSelect
				label="Selecciona un centro de atención"
				options={centers}
				name={`${day}-centerId`}
			/>

			{dailySessions ? <h2 className="text-base">Horas de atención:</h2> : null}

			<div className="grid grid-rows-5 grid-flow-col gap-x-10 gap-y-8">
				{Array.from({ length: dailySessions }).map((_, index) => {
					const start = dayjs()
						.hour(9)
						.minute(0)
						.add(index * minutesPerSession, "minute")
					const end = start.add(minutesPerSession, "minute")

					setValue(`${day}[${index}].start`, start)
					setValue(`${day}[${index}].end`, end)

					return (
						<div key={index} className="flex gap-4 items-center">
							<span className="-mb-6">{index + 1}</span>
							<div className="flex flex-row gap-2 w-full">
								<TimeSelect label="Inicio" name={`${day}[${index}].start`} />
								<TimeSelect label="Término" name={`${day}[${index}].end`} />
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
