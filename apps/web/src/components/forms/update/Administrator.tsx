import React from "react"

import { Form } from "../Form"
import { Input } from "../../ui/Input"
import { Modal } from "../../Modal"
import { useModal } from "../../../context/ModalContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateAdministrator } from "../../../lib/actions"
import { useEffect, useState } from "react"
import { AdministratorSchemas } from "../../../lib/schemas"
import { FormProvider, useForm } from "react-hook-form"
import { Administrator, FormProps } from "../../../lib/types"

const UpdateAdministrator: React.FC<FormProps<Administrator>> = ({ data, setData }) => {

	const [loading, setLoading] = useState(false)

	const methods = useForm({
		resolver: zodResolver(AdministratorSchemas.Update),
	})

	const { reset } = methods
	const { selectedData } = useModal()

	useEffect(() => {
		if (selectedData) {
			reset({
				name: selectedData.name,
				email: selectedData.email,
			})
		}
	}, [selectedData])

	return (
		<Modal type="Edit" title={`Editar la información de ${selectedData?.name}`} loading={loading}>
			<FormProvider {...methods}>
				<Form<Administrator>
					data={data as Administrator[]}
					setData={setData}
					action={updateAdministrator}
					actionType="update"
					setLoading={setLoading}
				>
					<Input name="name" label="Nombre" type="text" placeholder="Nombre" />
					<Input name="email" label="Correo Electrónico" type="email" placeholder="Correo Electrónico" />
					<Input name="password" label="Contraseña" type="password" placeholder="••••" />
					<Input name="confirmPassword" label="Confirmar contraseña" type="password" placeholder="••••" />
				</Form>
			</FormProvider>
		</Modal>
	)
}

export default UpdateAdministrator
