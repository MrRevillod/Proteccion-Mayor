import React from "react"
import dayjs from "dayjs"
import DatetimeSelect from "../../ui/DatetimeSelect"

import { Form } from "../Form"
import { Show } from "../../ui/Show"
import { Modal } from "../../Modal"
import { useAuth } from "../../../context/AuthContext"
import { useModal } from "../../../context/ModalContext"
import { useRequest } from "../../../hooks/useRequest"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocation } from "react-router-dom"
import { SuperSelect } from "../../ui/SuperSelect"
import { EventSchemas } from "../../../lib/schemas"
import { useState, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { createEvent, getSeniors } from "../../../lib/actions"
import { getIdsFromUrl, selectDataFormatter } from "../../../lib/formatters"
import { Professional, Senior, SuperSelectField } from "../../../lib/types"

// El formulario recibe refetch, ya que en este caso es más conveniente que
// filtrar los evento en el cliente, se vuelvan a obtener los eventos desde el servidor

type EventFormProps = {
	centers: SuperSelectField[]
	services?: SuperSelectField[]
	professionals?: Professional[]
	refetch?: () => void
}

const CreateEvent: React.FC<EventFormProps> = ({ centers, professionals, services, refetch }) => {

	const [loading, setLoading] = useState(false)
	const [seniors, setSeniors] = useState<SuperSelectField[]>([])
	const [seniorsSearch, setSeniorsSearch] = useState<string>("")
	const [selectProfessionals, setSelectProfessionals] = useState<SuperSelectField[]>([])

	const location = useLocation()
	const methods = useForm({ resolver: zodResolver(EventSchemas.Create) })

	const { user, role } = useAuth()
	const { watch, setValue } = methods
	const { isModalOpen, modalType, selectedData } = useModal()

	// Se obtiene el id del centro de la url, con el fin de seleccionarlo por defecto
	// ya que es posible crear un evento desde la url de un centro

	useEffect(() => {
		const selectedUrlCenter = getIdsFromUrl(location).centerId
		setValue("centerId", selectedUrlCenter ? Number(selectedUrlCenter) : undefined)
	}, [location.search])

	// Se obtiene valores de los input, al utilizar watch se obtiene el valor
	// del input en tiempo real y se puede utilizar para realizar peticiones
	// en un orden específico

	const selectedService = watch("serviceId")

	// Los hooks useRequest se utilizan para obtener los servicios, profesionales y centros
	// reciben un trigger que actua como un disparador de un useEffect

	const baseTrigger = isModalOpen && modalType === "Create"

	// Se obtienen los servicios al abrir el modal

	useEffect(() => {
		if (baseTrigger && selectedService && professionals) {
			const serviceProfessionals = professionals.filter(
				(professional) => professional.serviceId === selectedService
			)
			selectDataFormatter({ data: serviceProfessionals, setData: setSelectProfessionals })
		}
	}, [selectedService])

	// Se obtienen las personas mayores cuando se abre el modal y
	// se selecciona un servicio, un profesional y un centro

	useRequest<Senior[]>({
		action: getSeniors,
		query: `name=${seniorsSearch}&id=${seniorsSearch}&validated=1&select=name,id&limit=5`,
		onSuccess: (data) => selectDataFormatter({ data, setData: setSeniors }),
		trigger: baseTrigger,
	})

	// Se obtiene el valor del input startsAt
	// y se agrega 2 horas al valor de endsAt ya que esto brinda una mejor experiencia

	const startsAt = watch("start")

	useEffect(() => {
		if (startsAt) setValue("end", dayjs(startsAt).add(2, "hour").toISOString())
	}, [startsAt])

	useEffect(() => {

		if (role === "PROFESSIONAL" && baseTrigger) {
			setValue("professionalId", user?.id)
			setValue("serviceId", (user as Professional)?.service.id)
		}

	}, [isModalOpen, modalType])

	useEffect(() => {
		if (selectedData && selectedData.dateStr) {
			setValue("start", dayjs(selectedData.dateStr).hour(8).toISOString())
		}
	}, [selectedData])

	return (
		<Modal type="Create" title="Crear un nuevo evento" loading={loading}>
			<FormProvider {...methods}>
				<Form action={createEvent} actionType="create" refetch={refetch} setLoading={setLoading}>
					<Show when={role === "ADMIN"}>
						<SuperSelect label="Seleccione un servicio" name="serviceId" options={services} />
						<SuperSelect
							label="Seleccione un profesional"
							name="professionalId"
							options={selectProfessionals}
						/>
					</Show>

					<SuperSelect label="Seleccione un centro de atención" name="centerId" options={centers} />

					<SuperSelect
						label="Seleccione una persona mayor"
						name="seniorId"
						options={seniors}
						setSearch={setSeniorsSearch}
					/>
					<div className="flex gap-2 justify-between">
						<DatetimeSelect label="Inicio del evento" name="start" />
						<DatetimeSelect label="Término del evento" name="end" />
					</div>
					<SuperSelect
						label="Seleccione una repetición"
						name="repeat"
						placeholder="Las repeticiones se realizarán durante un mes"
						options={[
							{ label: "Diario (Todos los días a la misma hora)", value: "daily" },
							{ label: "Semanal (Repetir en los próximos 5 días)", value: "weekly" },
						]}
					/>
				</Form>
			</FormProvider>
		</Modal>
	)
}

export default CreateEvent
