import dayjs, { Dayjs } from "dayjs"
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
import { isWeekend } from "@/lib/validationRules"
import { useRequest } from "@/hooks/useRequest"
import { DatetimeSelect } from "@/components/ui/DatetimeSelect"
import { getProfessionals } from "@/lib/actions"
import { selectDataFormatter } from "@/lib/formatters"
import { Center, Professional, SuperSelectField } from "@/lib/types"

import "dayjs/locale/es"
dayjs.locale("es")

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
	const [formStep, setFormStep] = useState(1)
	const [modalSize, setModalSize] = useState("middle")

	const [weekDays, setWeekDays] = useState<WeekDay[]>([])
	const [currentWeekDay, setCurrentWeekDay] = useState<string>("")
	const [dailySessions, setDailySessions] = useState<Record<string, number>>({})

	const [professionals, setProfessionals] = useState<Professional[]>([])
	const [selectedProfessional, setSelectedProfessional] = useState<Professional>()

	const methods = useForm()

	const { user, role } = useAuth()
	const { watch, getValues } = methods
	const { handleCancel, handleOk, isModalOpen } = useModal()

	const selectedServiceId = watch("serviceId")
	const selectedProfessionalId = watch("professionalId")
	const selectedCenterId = watch(`${currentWeekDay}-centerId`)

	useRequest<Professional[]>({
		action: getProfessionals,
		query: `serviceId=${selectedServiceId}${selectedProfessionalId ? `&id=${selectedProfessionalId}` : ""}`,
		trigger: !!selectedServiceId && role !== "PROFESSIONAL",
		onSuccess: (data) => {
			selectDataFormatter({ data, setData: setProfessionals })
			selectedProfessionalId && setSelectedProfessional(data[0])
		},
	})

	const onCancel = () => {
		handleCancel()
		methods.reset()
		setFormStep(1)
		setWeekDays([])
		setDailySessions({})
		setCurrentWeekDay("")
		setSelectedProfessional(undefined)
	}

	useEffect(() => {
		if (!selectedServiceId || !selectedCenterId) {
			setDailySessions((prev) => ({ ...prev, [currentWeekDay]: 0 }))
			return
		}

		const center = centers.find((c) => c.id === Number(selectedCenterId))
		const dsForService = center?.dailySessions.find((ds) => ds.serviceId === Number(selectedServiceId))

		setDailySessions((prev) => ({ ...prev, [currentWeekDay]: dsForService?.quantity ?? 0 }))
	}, [selectedServiceId, selectedCenterId, centers])

	const handleNextStep = async () => {
		if (formStep === 1) {
			let start = getValues("start")
			let end = getValues("end")

			if (!start || !end || !selectedServiceId || !selectedProfessionalId) {
				message.error("Debes completar todos los campos.")
				return false
			}

			start = dayjs(start) as Dayjs
			end = dayjs(end) as Dayjs

			if (isWeekend(start.toISOString()) || isWeekend(end.toISOString())) {
				message.error("No es posible crear eventos los fines de semana.")
				return false
			}

			if (start.isAfter(end)) {
				message.error("La fecha de término debe ser posterior a la de inicio.")
				return false
			}

			try {
				await api.get(
					`/dashboard/events/week-availability?professionalId=${selectedProfessionalId}&start=${start}&end=${end}`
				)
			} catch (error: any) {
				if (error.response && error.response.status === 409) {
					message.error("Ya existe una agenda semanal para las fechas seleccionadas.")
					return
				}
			}

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

			if (days.length > 7) {
				message.error("El rango de fechas no puede ser mayor a una semana.")
				return
			}

			setWeekDays(days)
			setFormStep(2)
			setCurrentWeekDay(days[0].date)
		} else if (formStep > 1 && formStep < weekDays.length + 1) {
			const next = formStep + 1
			setFormStep(next)
			setCurrentWeekDay(weekDays[next - 2].date)
		} else if (formStep === weekDays.length + 1) {
			handleSubmit()
		}
	}

	const handlePreviousStep = () => setFormStep((prev) => Math.max(prev - 1, 1))

	const reduceWeekDays = (): Record<string, any> => {
		return weekDays.reduce((acc, { date }) => {
			const centerId = getValues(`${date}-centerId`)
			acc[date] = {
				centerId,
				events: Array.from({ length: dailySessions[date] }).map((_, index) => ({
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

		const query = `serviceId=${selectedServiceId}&professionalId=${selectedProfessionalId}`

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
		setWeekDays([])
		setDailySessions({})
		setCurrentWeekDay("")
		setSelectedProfessional(undefined)
	}

	useEffect(() => {
		if (role === "PROFESSIONAL" && isModalOpen) {
			const professional = user as Professional
			methods.setValue("professionalId", professional?.id)
			methods.setValue("serviceId", professional?.serviceId)
		}
	}, [isModalOpen, role, user, methods])

	return (
		<Modal
			type="Create"
			title="Crear agenda semanal"
			size={modalSize as any}
			hasDailySessions={dailySessions[currentWeekDay] > 0}
		>
			<FormProvider {...methods}>
				<form className="space-y-4 mt-4 mb-8">
					<Show when={formStep === 1}>
						<Show when={role === "ADMIN"}>
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
						<DatetimeSelect label="Fecha de inicio" name="start" showTime={false} disablePast />
						<DatetimeSelect label="Fecha de término" name="end" showTime={false} disablePast />
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

					<Show when={formStep > 1}>
						<Button variant="secondary" onClick={handlePreviousStep}>
							Anterior
						</Button>
					</Show>

					<Button variant="primary" onClick={() => handleNextStep()}>
						{formStep === 6 ? "Guardar" : "Siguiente"}
					</Button>
				</div>
			</FormProvider>
		</Modal>
	)
}