import dayjs from "dayjs"
import React from "react"

import { Form } from "@/components/forms/Form"
import { Show } from "@/components/ui/Show"
import { Modal } from "@/components/Modal"
import { useAuth } from "@/context/AuthContext"
import { useModal } from "@/context/ModalContext"
import { useRequest } from "@/hooks/useRequest"
import { SuperSelect } from "@/components/ui/SuperSelect"
import { zodResolver } from "@hookform/resolvers/zod"
import { EventSchemas } from "@/lib/schemas"
import { BooleanSelect } from "@/components/ui/BooleanSelect"
import { DatetimeSelect } from "@/components/ui/DatetimeSelect"
import { selectDataFormatter } from "@/lib/formatters"
import { useState, useEffect } from "react"
import { FormProvider, set, useForm } from "react-hook-form"
import { getSeniors, updateEvent } from "@/lib/actions"
import { Professional, Senior, Staff, SuperSelectField } from "@/lib/types"

// Este formulario corresponde a la actualización de un evento
// Se utiliza el componente Modal para mostrar el formulario
// y se utiliza el componente Form para manejar la lógica del formulario

// Recibe una función refetch que permite volver a obtener los eventos al actualizar un evento

type EventFormProps = {
	centers: SuperSelectField[]
	services?: SuperSelectField[]
	professionals?: Professional[]
	refetch?: () => void
}

export const UpdateEvent: React.FC<EventFormProps> = ({ centers, professionals, refetch }) => {
	const [loading, setLoading] = useState(false)
	const [seniors, setSeniors] = useState<SuperSelectField[]>([])
	const [seniorsSearch, setSeniorsSearch] = useState<string>("")
	const [selectProfessionals, setSelectProfessionals] = useState<SuperSelectField[]>([])
    const [disabled,setDisabled] = useState(false)  

	const isAfterToday = (date: string) => dayjs(date).isAfter(dayjs())
	const isEnd = (date: string) => dayjs().isAfter(dayjs(date).add(3, "days"))

	const methods = useForm({ resolver: zodResolver(EventSchemas.Update) })

	const { role,user } = useAuth()
	const { selectedData } = useModal()
	const { isModalOpen, modalType } = useModal()


	useRequest<Senior[]>({
		action: getSeniors,
		query: `name=${seniorsSearch}&id=${seniorsSearch}&select=name,id&limit=5`,
		onSuccess: (data) => selectDataFormatter({ data, setData: setSeniors }),
		trigger: isModalOpen && modalType === "Edit",
	})

    useEffect(() => {
        setDisabled(role === "FUNCTIONARY" && (user as Staff).centerId !== selectedData?.centerId)

		if (!selectedData) return
		methods.reset({
			professionalId: selectedData?.professionalId,
			centerId: selectedData?.centerId ? selectedData?.centerId.toString() : undefined,
			serviceId: selectedData?.serviceId,
			assistance: selectedData?.assistance,
			seniorId: selectedData?.seniorId || undefined,
			start: dayjs(selectedData?.start).toISOString(),
			end: dayjs(selectedData?.end).toISOString(),
		})

		if (role === "ADMIN") {
			const serviceProfessionals = professionals?.filter(
				(professional) => professional.serviceId === selectedData?.serviceId
			)
			selectDataFormatter({ data: serviceProfessionals as Professional[], setData: setSelectProfessionals })
		}

		setSeniorsSearch(selectedData?.seniorId)
	}, [selectedData])

	return (
		<Modal type="Edit" title="Editar un evento" loading={loading}>
			<FormProvider {...methods}>
				<Form action={updateEvent} disabled={disabled} actionType="update" deletable refetch={refetch} setLoading={setLoading}>
					<Show when={isAfterToday(selectedData?.start)}>
						<Show when={role === "ADMIN"}>
							<SuperSelect
								label="Seleccione el profesional"
								name="professionalId"
                                options={selectProfessionals}
							/>
						</Show>

						<SuperSelect
							label="Seleccione el centro de atención (opcional)"
							name="centerId"
							options={centers}
                            disabled={disabled}
						/>
					</Show>

					<SuperSelect
						label="Seleccione la persona mayor"
						name="seniorId"
						options={seniors}
						setSearch={setSeniorsSearch}
						placeholder="Buscar por nombre o su Rut"
						disabled={!selectedData?.seniorId || disabled}
					/>

					<Show when={role === "ADMIN" && isAfterToday(selectedData?.start)}>
						<SuperSelect
							label="Seleccione el servicio"
							name="serviceId"
							options={[
								{
									label: selectedData?.service?.name,
									value: selectedData?.serviceId,
								},
							]}
						/>
					</Show>

					<Show when={isAfterToday(selectedData?.start)}>
						<div className="flex gap-2 justify-between">
                            <DatetimeSelect label="Inicio del evento" name="start" disabled={disabled}/>
							<DatetimeSelect label="Finalización del evento" name="end" disabled={disabled} />
						</div>
					</Show>

					<Show
						when={selectedData?.seniorId && !isAfterToday(selectedData?.start) && !isEnd(selectedData?.end)}
					>
						<BooleanSelect
							name="assistance"
							options={[
								{ label: "Asistió", value: true },
								{ label: "No asistió", value: false },
                            ]}
                            disabled={disabled}
						/>
					</Show>
				</Form>
			</FormProvider>
		</Modal>
	)
}
