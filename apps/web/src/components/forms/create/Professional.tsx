import React from "react"

import { Form } from "@/components/forms/Form"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/Modal"
import { useState } from "react"
import { useRequest } from "@/hooks/useRequest"
import { zodResolver } from "@hookform/resolvers/zod"
import { SuperSelect } from "@/components/ui/SuperSelect"
import { ProfessionalSchemas } from "@/lib/schemas"
import { selectDataFormatter } from "@/lib/formatters"
import { FormProvider, useForm } from "react-hook-form"
import { createProfessional, getServices } from "@/lib/actions"
import { FormProps, Professional, Service } from "@/lib/types"

export const CreateProfessional: React.FC<FormProps<Professional>> = ({ data, setData }) => {
	const methods = useForm({ resolver: zodResolver(ProfessionalSchemas.Create) })

	const [loading, setLoading] = useState(false)
	const [services, setServices] = useState<Service[]>([])

	// Se obtienen los servicios al abrir el modal
	// Se utiliza el hook useRequest para realizar la petición
	// Se utiliza el formatter selectDataFormatter para darle el formato

	useRequest<Service[]>({
		action: getServices,
		query: "select=id,title",
		onSuccess: (data) => {
			selectDataFormatter({
				data,
				setData: setServices,
				keys: { label: "title", value: "id" },
			})
		},
	})

	return (
		<Modal type="Create" title="Añadir nuevo profesional al sistema" loading={loading}>
			<FormProvider {...methods}>
				<Form<Professional>
					data={data as Professional[]}
					setData={setData}
					action={createProfessional}
					actionType="create"
					setLoading={setLoading}
				>
					<Input name="id" label="Rut (sin puntos ni guión)" type="text" placeholder="123456789" />
					<Input name="name" label="Nombre" type="text" placeholder="Juan Perez" />
					<Input name="email" label="Correo Electrónico" type="email" placeholder="JohnD@provider.com" />
					<SuperSelect label="Profesión" name="serviceId" options={services} />
				</Form>
			</FormProvider>
		</Modal>
	)
}
