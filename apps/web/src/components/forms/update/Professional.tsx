import React from "react"

import { Form } from "../Form"
import { Input } from "../../ui/Input"
import { Modal } from "../../Modal"
import { useModal } from "../../../context/ModalContext"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateProfessional } from "../../../lib/actions"
import { ProfessionalSchemas } from "../../../lib/schemas"
import { FormProvider, useForm } from "react-hook-form"
import { FormProps, Professional } from "../../../lib/types"

const UpdateProfessional: React.FC<FormProps<Professional>> = ({ data, setData }) => {
	const { selectedData } = useModal()

	const methods = useForm({
		resolver: zodResolver(ProfessionalSchemas.Update),
	})

	useEffect(() => {
		if (selectedData) {
			methods.reset({
				name: selectedData.name,
				email: selectedData.email,
			})
		}
	}, [selectedData])

	return (
		<Modal type="Edit" title={`Editar la información de ${selectedData?.name}`}>
			<FormProvider {...methods}>
				<Form<Professional>
					data={data as Professional[]}
					setData={setData}
					actionType="update"
					action={updateProfessional}
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

export default UpdateProfessional
