import React, { useEffect, useState } from "react"
import { Form } from "@/components/forms/Form"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/Modal"
import { zodResolver } from "@hookform/resolvers/zod"
import { DatetimeSelect } from "@/components/ui/DatetimeSelect"
import { createOperative, getCenters, getProfessionals, getServices } from "@/lib/actions"
import { ImageSelector } from "@/components/ImageSelector"
import { OperativeSchemas } from "@/lib/schemas"
import { FormProps, Operatives, Center, SuperSelectField, Service, Professional } from "@/lib/types"
import { FormProvider, useForm } from "react-hook-form"
import { SuperSelect } from "@/components/ui/SuperSelect"
import { useRequest } from "@/hooks/useRequest"
import { selectDataFormatter } from "@/lib/formatters"
import { MultipleSelect } from "@/components/ui/MultipleSelect"

export const CreateOperative: React.FC<FormProps<Operatives>> = ({ data, setData }) => {
	const [loading, setLoading] = useState(false)
	const [centers, setCenters] = useState<SuperSelectField[]>([])
	const [services, setServices] = useState<SuperSelectField[]>([])
	const [professionals, setProfessionals] = useState<SuperSelectField[]>([])
	const methods = useForm({
		resolver: zodResolver(OperativeSchemas.Create),
	})
	const { watch } = methods

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
		if (!selectedServices) return
		const filteredProfessionals = (rawProfessionals ?? [])
			.filter((professional) => selectedServices.includes(professional.serviceId))
			.map((professional) => ({ label: professional.name, value: professional.id }))
		setProfessionals(filteredProfessionals)
	}, [selectedServices])

	return (
		<Modal type="Create" title="Añadir nuevo operativo al sistema" loading={loading}>
			<FormProvider {...methods}>
				<Form<Operatives>
					data={data as Operatives[]}
					setData={setData}
					action={createOperative}
					actionType="create"
					setLoading={setLoading}
				>
					<Input name="name" label="Nombre del Operativo" type="text" placeholder="Operativos las Lomas" />
					<Input
						name="description"
						label="Descripción"
						type="text"
						placeholder="Descripción breve del Operativo"
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
						placeholder="Abogado(a),Asesoría Legal"
					/>
					<MultipleSelect
						name="professionals"
						label="Seleccione los profesionales para el operativo"
						data={professionals}
						placeholder="Benjamin Espinoza,Carlos Riquelme"
					/>
					<ImageSelector imageLabel="Imagen del Operativo" size={[400, 250]} />
				</Form>
			</FormProvider>
		</Modal>
	)
}
