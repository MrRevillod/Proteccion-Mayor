import React, { useEffect, useState } from "react"
import { DatetimeSelect } from "@/components/ui/DatetimeSelect"
import { Form } from "@/components/forms/Form"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/Modal"
import { useModal } from "@/context/ModalContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateOperative, getCenters, getServices, getProfessionals } from "@/lib/actions"
import { OperativeSchemas } from "@/lib/schemas"
import { ImageSelector } from "@/components/ImageSelector"
import { Operative, FormProps, SuperSelectField, Center, Service, Professional } from "@/lib/types"
import { useForm, FormProvider } from "react-hook-form"
import { MultipleSelect } from "@/components/ui/MultipleSelect"
import { useRequest } from "@/hooks/useRequest"
import { selectDataFormatter } from "@/lib/formatters"
import { SuperSelect } from "@/components/ui/SuperSelect"

export const UpdateOperative: React.FC<FormProps<Operative>> = ({ data, setData }) => {
	const [loading, setLoading] = useState(false)
	const [centers, setCenters] = useState<SuperSelectField[]>([])
	const [services, setServices] = useState<SuperSelectField[]>([])
	const [professionals, setProfessionals] = useState<SuperSelectField[]>([])
	const { selectedData } = useModal()
	const methods = useForm({
		resolver: zodResolver(OperativeSchemas.Update),
	})
	const { watch, reset } = methods

	useRequest<Center[]>({
		action: getCenters,
		query: `select=name,id`,
		onSuccess: (data) => selectDataFormatter({ data, setData: setCenters }),
	})

	useRequest<Service[]>({
		action: getServices,
		query: `select=name,id`,
		onSuccess: (data) => selectDataFormatter({ data, setData: setServices }),
	})

	const { data: rawProfessionals } = useRequest<Professional[]>({
		action: getProfessionals,
		query: `select=name,id,serviceId`,
		onSuccess: (data) => selectDataFormatter({ data, setData: setProfessionals }),
	})

	const selectedServices = watch("services") as number[]

	useEffect(() => {
		if (!selectedData) return
		console.log("data", selectedData)
		reset({
			name: selectedData?.name,
			description: selectedData?.description,
			start: selectedData?.start,
			end: selectedData?.end,
			centerId: selectedData?.centerId,
			services: selectedData?.services?.map((service: any) => Number(service.id)),
			professionals: selectedData?.professionals?.map((professional: any) => professional.id),
		})
	}, [selectedData])

	useEffect(() => {
		if (!selectedServices) return

		const filteredProfessionals = (rawProfessionals ?? [])
			.filter((professional) => selectedServices.includes(professional.serviceId))
			.map((professional) => ({ label: professional.name, value: professional.id }))
		setProfessionals(filteredProfessionals)
	}, [selectedServices, rawProfessionals])

	return (
		<Modal type="Edit" title="Editar operativo" loading={loading}>
			<FormProvider {...methods}>
				<Form<Operative>
					data={data as Operative[]}
					setData={setData}
					action={updateOperative}
					actionType="update"
					setLoading={setLoading}
				>
					<Input name="name" label="Nombre del Operativo" type="text" placeholder="Nombre del operativo" />

					<Input
						name="description"
						label="Descripción"
						type="text"
						placeholder="Descripción breve del operativo"
					/>

					<div className="flex gap-2 justify-between">
						<DatetimeSelect label="Inicio del operativo" name="start" />
						<DatetimeSelect label="Término del operativo" name="end" />
					</div>

					<SuperSelect label="Seleccione el centro de atención" name="centerId" options={centers} />

					<MultipleSelect
						name="services"
						label="Seleccione los servicios del operativo"
						data={services}
						placeholder="Abogado(a), Asesoría Legal"
					/>

					<MultipleSelect
						name="professionals"
						label="Seleccione los profesionales"
						data={professionals}
						placeholder="Selecciona profesionales disponibles"
					/>

					<ImageSelector imageLabel="Imagen del operativo" size={[400, 250]} />
				</Form>
			</FormProvider>
		</Modal>
	)
}
