import React, { useEffect } from "react"

import { Form } from "@/components/forms/Form"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/Modal"
import { SuperSelect } from "@/components/ui/SuperSelect"

import { useState } from "react"
import { message } from "antd"
import { FormProvider, useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRequest } from "@/hooks/useRequest"

import { StaffSchemas } from "@/lib/schemas"
import { selectDataFormatter } from "@/lib/formatters"
import { createStaff, getCenters } from "@/lib/actions"
import { Center, FormProps, Staff } from "@/lib/types"
import { Show } from "@/components/ui/Show"

export const CreateStaff: React.FC<FormProps<Staff>> = ({ data, setData }) => {
	const [loading, setLoading] = useState(false)
	const [centers, setCenters] = useState<Center[]>([])
	const methods = useForm({ resolver: zodResolver(StaffSchemas.Create) })

	const { error } = useRequest<Center[]>({
		action: getCenters,
		onSuccess: (centers) => selectDataFormatter({ data: centers, setData: setCenters }),
	})

	if (error) message.error("Error al cargar los datos")

	useEffect(() => {
		if (methods.watch("role") === "ADMIN") {
			methods.setValue("centerId", undefined)
		}
	}, [methods.watch("role")])

	return (
		<Modal type="Create" title="Añadir nuevo funcionario al sistema" loading={loading}>
			<FormProvider {...methods}>
				<Form<Staff>
					data={data as Staff[]}
					setData={setData}
					action={createStaff}
					setLoading={setLoading}
					actionType="create"
				>
					<Input name="id" label="Rut (sin puntos ni guión)" type="text" placeholder="123456789" />
					<Input name="name" label="Nombre" type="text" placeholder="Juan Perez" />
					<Input name="email" label="Correo Electrónico" type="email" placeholder="JohnD@provider.com" />
					<SuperSelect
						name="role"
						label="Rol"
						options={[
							{ label: "Administrador", value: "ADMIN" },
							{ label: "Funcionario", value: "FUNCTIONARY" },
						]}
					/>
					<Show when={methods.watch("role") === "FUNCTIONARY"}>
						<SuperSelect
							name="centerId"
							label="Centro de atención"
							options={centers}
							errorAlign="vertical"
						/>
					</Show>
				</Form>
			</FormProvider>
		</Modal>
	)
}
