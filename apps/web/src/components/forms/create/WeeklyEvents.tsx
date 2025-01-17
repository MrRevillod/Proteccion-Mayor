import dayjs from "dayjs"
import React, { useEffect, useState } from "react"

import { message } from "antd"
import { FormProvider, useForm } from "react-hook-form"

import { Show } from "@/components/ui/Show"
import { Modal } from "@/components/Modal"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/context/AuthContext"
import { SuperSelect } from "@/components/ui/SuperSelect"
import { WeeklyEventsStep } from "@/components/WeeklyEventsStep"

import { api } from "@/lib/axios"
import { useModal } from "@/context/ModalContext"
import { useRequest } from "@/hooks/useRequest"
import { getProfessionals } from "@/lib/actions"
import { selectDataFormatter } from "@/lib/formatters"
import { Center, Professional, SuperSelectField } from "@/lib/types"

interface Props {
	centers: Center[]
	formattedCenters: SuperSelectField[]
	services: SuperSelectField[]
}

const WEEK_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"]

export const CreateWeeklyEvents: React.FC<Props> = ({ centers, services, formattedCenters }) => {
	const { role } = useAuth()
	const [formStep, setFormStep] = useState(role === "ADMIN" ? 1 : 2)

	const [dailySessions, setDailySessions] = useState<number>(0)
	const [professionals, setProfessionals] = useState<Professional[]>([])
	const [modalSize, setModalSize] = useState("middle")
	const [selectedProfessional, setSelectedProfessional] = useState<Professional>()

	const methods = useForm()
	const { watch, getValues } = methods
	const { handleCancel, handleOk } = useModal()

	const selectedService = watch("serviceId")
	const selectedProfessionalId = watch("professionalId")
	const selectedCenters = watch(WEEK_DAYS.map((day) => `${day}-centerId`))

	useRequest<Professional[]>({
		action: getProfessionals,
		query: `serviceId=${selectedService}${
			selectedProfessionalId ? `&id=${selectedProfessionalId}` : ""
		}`,
		trigger: !!selectedService,
		onSuccess: (data) => {
			selectDataFormatter({ data, setData: setProfessionals })
			selectedProfessionalId && setSelectedProfessional(data[0])
		},
	})

	useEffect(() => {
		if (centers) {
			const center = centers.find((center) => center.id === selectedCenters[formStep - 2])
			const serviceDailySessions = center?.dailySessions.find(
				(session) => session.serviceId === selectedService
			)
			setDailySessions(serviceDailySessions?.quantity || 0)
		}
	}, [selectedCenters, formStep])

	const handleNextStep = async () => {
		if (formStep === 1) {
			if (!getValues("serviceId") || !getValues("professionalId")) {
				return message.error("Debes seleccionar un servicio y un profesional")
			}
		} else if (formStep === 2) {
			if (!getValues("monday-centerId")) {
				return message.error("Debes seleccionar un centro de atención para el lunes")
			}
		} else if (formStep === 6) {
			await handleSubmit()
		}

		formStep < 6 && setFormStep(formStep + 1)
	}

	const handlePreviousStep = () => formStep > 1 && setFormStep(formStep - 1)

	const handleSubmit = async () => {
		const weekStart = dayjs("2025-01-25").startOf("week")
		const query = `serviceId=${selectedService}&professionalId=${selectedProfessionalId}`

		const weeklyEvents = WEEK_DAYS.reduce((acc, day) => {
			const centerId = getValues(`${day}-centerId`)
			acc[day] = {
				centerId,
				events: Array.from({ length: dailySessions }).map((_, index) => ({
					start: getValues(`${day}[${index}].start`),
					end: getValues(`${day}[${index}].end`),
				})),
			}
			return acc
		}, {} as Record<string, any>)

		try {
			await api.post(`/dashboard/events/weekly?${query}`, {
				start: weekStart.toISOString(),
				weeklyEvents,
			})
		} catch (error) {
			message.error("Ocurrió un error al crear la agenda semanal")
		}

		message.success("Agenda semanal creada con éxito")
		handleOk()
		methods.reset()
		setFormStep(role === "ADMIN" ? 1 : 2)
	}

	return (
		<Modal type="Create" title="Crear agenda semanal" size={modalSize as any}>
			<FormProvider {...methods}>
				<form className="space-y-4 mt-4 mb-8">
					<Show when={formStep === 1 && role === "ADMIN"}>
						<SuperSelect
							label="Selecciona un servicio"
							options={services}
							name="serviceId"
							allowClear
						/>
						<SuperSelect
							label="Selecciona un profesional"
							options={professionals}
							name="professionalId"
							allowClear
						/>
					</Show>

					{WEEK_DAYS.map((day, index) => (
						<Show key={day} when={formStep === index + 2}>
							<WeeklyEventsStep
								centers={formattedCenters}
								dailySessions={dailySessions}
								minutesPerSession={selectedProfessional?.minutesPerSession ?? 0}
								date={dayjs("2025-01-25")
									.day(index + 1)
									.format("dddd DD/MM/YYYY")}
								day={day as any}
								setModalSize={setModalSize}
							/>
						</Show>
					))}
				</form>

				<div className="flex gap-4 justify-end bottom-0">
					<Button type="button" variant="secondary" onClick={handleCancel}>
						Cancelar
					</Button>

					<Button variant="secondary" onClick={handlePreviousStep}>
						Anterior
					</Button>

					<Button
						variant="primary"
						onClick={() => (formStep === 6 ? handleSubmit() : handleNextStep())}
					>
						{formStep === 6 ? "Guardar" : "Siguiente"}
					</Button>
				</div>
			</FormProvider>
		</Modal>
	)
}
