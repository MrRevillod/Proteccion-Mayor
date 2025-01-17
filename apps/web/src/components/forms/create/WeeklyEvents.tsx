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
import { DatetimeSelect } from "@/components/ui/DatetimeSelect"
import { isWeekend } from "@/lib/validationRules"

interface Props {
	centers: Center[]
	formattedCenters: SuperSelectField[]
	services: SuperSelectField[]
}

type WeekDay = {
	day: string
	date: string
}

export const CreateWeeklyEvents: React.FC<Props> = ({ centers, services, formattedCenters }) => {
	const { role } = useAuth()
	const [formStep, setFormStep] = useState(1)

	const [weekDays, setWeekDays] = useState<WeekDay[]>([])
	const [modalSize, setModalSize] = useState("middle")
	const [dailySessions, setDailySessions] = useState<number>(1)

	const [professionals, setProfessionals] = useState<Professional[]>([])
	const [selectedProfessional, setSelectedProfessional] = useState<Professional>()

	const methods = useForm()
	const { watch, getValues } = methods
	const { handleCancel, handleOk } = useModal()

	const selectedService = watch("serviceId")
	const selectedProfessionalId = watch("professionalId")
	const selectedCenters = watch(weekDays.map(({ date }) => `${date}-centerId`))

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
		if (centers && selectedCenters.length) {
			const center = centers.find((center) => center.id === selectedCenters[formStep - 2])
			const serviceDailySessions = center?.dailySessions.find(
				(session) => session.serviceId === selectedService
			)

			setDailySessions(serviceDailySessions?.quantity ?? 0)
		}
	}, [selectedCenters, formStep])

	const onCancel = () => {
		handleCancel()
		methods.reset()
		setFormStep(1)
	}

	const generateWeekDays = (): void => {
		const start = dayjs(getValues("start"))
		const end = dayjs(getValues("end"))

		const days: WeekDay[] = []
		const dayDiff = end.diff(start, "day")

		const toUpperLowerCase = (day: string) => day.replace(/^\w/, (c) => c.toUpperCase())

		for (let i = 0; i < dayDiff + 1; i++) {
			if (!isWeekend(start.add(i, "day").toISOString())) {
				const dayName = toUpperLowerCase(start.add(i, "day").format("dddd"))
				const date = start.add(i, "day").format("YYYY-MM-DD")
				days.push({ day: dayName, date })
			}
		}

		setWeekDays(days)
	}

	const validateStepOne = (): boolean => {
		const start = getValues("start")
		const end = getValues("end")

		if (!start || !end || !selectedService || !selectedProfessionalId) {
			message.error("Debes completar todos los campos.")
			return false
		}

		if (dayjs(start).isAfter(dayjs(end))) {
			message.error("La fecha de término debe ser posterior a la de inicio.")
			return false
		}

		return true
	}

	const handleNextStep = async () => {
		switch (formStep) {
			case 1:
				validateStepOne() && generateWeekDays()
				break
			case 6:
				await handleSubmit()
				break
		}

		setFormStep((prev) => Math.min(prev + 1, 6))
	}

	const handlePreviousStep = () => setFormStep((prev) => Math.max(prev - 1, 1))

	const reduceWeekDays = (): Record<string, any> => {
		return weekDays.reduce((acc, { date }) => {
			const centerId = getValues(`${date}-centerId`)
			acc[date] = {
				centerId,
				events: Array.from({ length: dailySessions }).map((_, index) => ({
					start: getValues(`${date}[${index}].start`),
					end: getValues(`${date}[${index}].end`),
				})),
			}
			return acc
		}, {} as Record<string, any>)
	}

	const handleSubmit = async () => {
		const start = dayjs(methods.getValues("start"))
		const end = dayjs(methods.getValues("end"))
		const weeklyEvents = reduceWeekDays()

		const query = `serviceId=${selectedService}&professionalId=${selectedProfessionalId}`

		try {
			await api.post(`/dashboard/events/weekly?${query}`, {
				start: start.toISOString(),
				end: end.toISOString(),
				weeklyEvents,
			})
		} catch (error) {
			message.error("Ocurrió un error al crear la agenda semanal")
		}

		message.success("Agenda semanal creada con éxito")
		handleOk()
		methods.reset()
		setFormStep(1)
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
						<DatetimeSelect
							label="Fecha de inicio"
							name="start"
							showTime={false}
							disablePast
						/>
						<DatetimeSelect
							label="Fecha de término"
							name="end"
							showTime={false}
							disablePast
						/>
					</Show>

					{weekDays.map(({ date, day }, index) => (
						<Show key={date} when={formStep === index + 2}>
							<WeeklyEventsStep
								centers={formattedCenters}
								dailySessions={dailySessions}
								minutesPerSession={selectedProfessional?.minutesPerSession ?? 0}
								date={date}
								day={day}
								setModalSize={setModalSize}
							/>
						</Show>
					))}
				</form>

				<div className="flex gap-4 justify-end bottom-0">
					<Button type="button" variant="secondary" onClick={() => onCancel()}>
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
