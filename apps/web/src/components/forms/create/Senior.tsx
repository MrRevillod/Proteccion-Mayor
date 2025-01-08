import React from "react"

import { Form } from "@/components/forms/Form"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/Modal"
import { useState } from "react"
import { SuperSelect } from "@/components/ui/SuperSelect"
import { zodResolver } from "@hookform/resolvers/zod"

import { createSenior } from "@/lib/actions"
import { SeniorSchemas } from "@/lib/schemas"
import { DatetimeSelect } from "@/components/ui/DatetimeSelect"
import { FormProps, Senior } from "@/lib/types"
import { FormProvider, useForm } from "react-hook-form"

export const CreateSenior: React.FC<FormProps<Senior>> = ({ data, setData }) => {
	const [loading, setLoading] = useState(false)
	const methods = useForm({ resolver: zodResolver(SeniorSchemas.DashboardRegister) })

	return (
		<Modal type="Create" title="Añadir nueva persona mayor al sistema" loading={loading}>
			<FormProvider {...methods}>
				<Form<Senior>
					data={data as Senior[]}
					setData={setData}
					action={createSenior}
					actionType="create"
					setLoading={setLoading}
				>
					<Input name="id" label="Rut (sin puntos ni guión)" type="text" placeholder="123456789" />
					<Input name="name" label="Nombre" type="text" placeholder="Juan Perez" />
					<Input name="email" label="Correo Electrónico" type="email" placeholder="JohnD@provider.com" />
					<Input name="address" label="Dirección" type="text" placeholder="Montt #123" />
					<SuperSelect
						name="gender"
						label="Género"
						showSearch={false}
						options={[
							{ value: "MA", label: "Masculino" },
							{ value: "FE", label: "Femenino" },
						]}
					/>
					<DatetimeSelect label="Fecha de nacimiento" name="birthDate" showTime={false} />
				</Form>
			</FormProvider>
		</Modal>
	)
}
