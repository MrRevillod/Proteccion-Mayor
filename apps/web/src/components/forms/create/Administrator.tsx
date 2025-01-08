import React from "react"

import { Form } from "@/components/forms/Form"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/Modal"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { createAdministrator } from "@/lib/actions"
import { AdministratorSchemas } from "@/lib/schemas"
import { FormProvider, useForm } from "react-hook-form"
import { FormProps, Administrator } from "@/lib/types"

export const CreateAdministrator: React.FC<FormProps<Administrator>> = ({ data, setData }) => {
	const [loading, setLoading] = useState(false)
	const methods = useForm({ resolver: zodResolver(AdministratorSchemas.Create) })

	return (
		<Modal type="Create" title="Añadir nuevo administrador al sistema" loading={loading}>
			<FormProvider {...methods}>
				<Form<Administrator>
					data={data as Administrator[]}
					setData={setData}
					action={createAdministrator}
					setLoading={setLoading}
					actionType="create"
				>
					<Input name="id" label="Rut (sin puntos ni guión)" type="text" placeholder="123456789" />
					<Input name="name" label="Nombre" type="text" placeholder="Juan Perez" />
					<Input name="email" label="Correo Electrónico" type="email" placeholder="JohnD@provider.com" />
				</Form>
			</FormProvider>
		</Modal>
	)
}
