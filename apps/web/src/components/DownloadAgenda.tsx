import dayjs from "dayjs"
import React, { useEffect, useState } from "react"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"

import { useModal } from "@/context/ModalContext"
import { getEvents } from "@/lib/actions"
import { useRequest } from "@/hooks/useRequest"
import { generatePDF } from "@/lib/downloadDailyAgenda"
import { Event, Events, Professional } from "@/lib/types"

import { Show } from "@/components/ui/Show"
import { Modal } from "@/components/Modal"
import { Button } from "@/components/ui/Button"
import { SuperSelect } from "@/components/ui/SuperSelect"
import { DatetimeSelect } from "@/components/ui/DatetimeSelect"
import { useAuth } from "@/context/AuthContext"

export const DownloadAgenda: React.FC = () => {

	const { user, role } = useAuth()
	const { selectedData: professional, handleCancel } = useModal() as {
		selectedData: Professional
		handleCancel: () => void
	}

	const [query, setQuery] = useState("")
	const [submit, setSubmit] = useState(false)
	const [selectedDate, setSelectedDate] = useState("")
	const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)

	useEffect(() => {

		role !== "PROFESSIONAL" && setSelectedProfessional(professional)
		role === "PROFESSIONAL" && setSelectedProfessional(user as Professional)

	}, [professional])

	const selectOptions = [
		{ value: "today", label: `Hoy (${dayjs().format("DD/MM/YYYY")})` },
		{ value: "calendar", label: "Seleccionar una fecha" },
	]

	const schema = z
		.object({
			agenda: z.string().nonempty(),
			"agenda-date": z.string().optional(),
		})
		.refine((data) => data.agenda !== "calendar" || (data["agenda-date"] && data["agenda-date"].trim() !== ""), {
			path: ["agenda-date"],
			message: "Debes seleccionar una fecha si el calendario está seleccionado.",
		})

	const methods = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			agenda: "today",
			"agenda-date": "",
		},
	})

	useRequest<Events>({
		action: getEvents,
		query,
		trigger: !!submit,
		onSuccess: (data) => {
			const userData = (role === "PROFESSIONAL" ? user : professional) as Professional
			generatePDF(userData, data.formatted as Event[], selectedDate)
			setSubmit(false)
		},
	})

	const onSubmit = () => {
		const agenda = methods.getValues("agenda")
		const agendaDate = methods.getValues("agenda-date")
		const day = agenda === "today" ? dayjs().toISOString() : agendaDate

		setSelectedDate(day)

		const start = dayjs(day).startOf("day").toISOString()
		const end = dayjs(day).endOf("day").toISOString()

		setQuery(`professionalId=${selectedProfessional?.id}&start=${start}&end=${end}`)
		setSubmit(true)
	}

	const onCancel = () => {
		handleCancel()
		methods.reset()
		setQuery("")
		setSubmit(false)
	}

	return (
		<Modal title="Exportar Agenda Diaria" type="DownloadAgenda">
			<FormProvider {...methods}>
				<div className="flex flex-col space-y-4">
					<p>
						<strong>Nota:</strong> Aquí podrás descargar la agenda diaria del profesional seleccionado
					</p>

					<div className="flex justify-center mt-4 flex-col">
						<p>
							<strong>Profesional:</strong> {selectedProfessional?.name}
						</p>
						<p>
							<strong>Servicio:</strong> {selectedProfessional?.service.name}
						</p>
					</div>

					<SuperSelect
						label="¿Qué agenda deseas exportar?"
						name="agenda"
						allowClear={false}
						showSearch={false}
						options={selectOptions}
					/>

					<Show when={methods.watch("agenda") === "calendar"}>
						<DatetimeSelect label="Selecciona una fecha" name="agenda-date" showTime={false} />
					</Show>

					<div className="flex flex-row gap-4 w-full justify-end -mb-6">
						<Button type="button" variant="secondary" onClick={() => onCancel()}>
							Cancelar
						</Button>

						<Button type="submit" variant="primary" onClick={methods.handleSubmit(onSubmit)}>
							Descargar
						</Button>
					</div>
				</div>
			</FormProvider>
		</Modal>
	)
}